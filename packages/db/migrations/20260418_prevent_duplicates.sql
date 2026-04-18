-- ═══════════════════════════════════════════════════════════════════
-- Migration: Prevent restaurant duplicates structurally
-- Date: 2026-04-18 (revised after first attempt)
-- Run once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════
--
-- ROOT CAUSE: Multiple import scripts inserted same restaurant twice with
-- different fields populated. Result: 384 split pairs.
--
-- THIS MIGRATION makes the duplicate state STRUCTURALLY IMPOSSIBLE:
--   1. SAFE-Activate restaurants: only those WITHOUT an active dupe
--   2. Add unique partial index on (name + rounded lat/lng) for active rows
--   3. Change is_active default to TRUE so new rows are visible by default
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. SAFE-Activate: Activate inactive rows that have real data,
--        BUT only if no active row already occupies the same dedup key ───
UPDATE restaurants r SET is_active = true
WHERE is_active = false
  AND (
    EXISTS (SELECT 1 FROM menu_items WHERE restaurant_id = r.id)
    OR EXISTS (SELECT 1 FROM menu_photos WHERE restaurant_id = r.id)
    OR r.phone IS NOT NULL
    OR r.operating_hours IS NOT NULL
    OR r.website IS NOT NULL
  )
  AND NOT EXISTS (
    -- Don't activate if an active row already has the same (name, rounded lat, rounded lng)
    SELECT 1 FROM restaurants r2
    WHERE r2.is_active = true
      AND r2.id != r.id
      AND LOWER(COALESCE(r2.name->>'en', r2.name->>'original', ''))
          = LOWER(COALESCE(r.name->>'en', r.name->>'original', ''))
      AND ROUND(r2.lat::numeric, 4) = ROUND(r.lat::numeric, 4)
      AND ROUND(r2.lng::numeric, 4) = ROUND(r.lng::numeric, 4)
  );

-- ─── 2. Belt-and-suspenders: Deactivate any duplicates that slipped through ───
-- For each (name, lat-rounded, lng-rounded) group, keep only the BEST active row.
-- Best = most place_id + photos + menu + phone (rich data wins).
WITH ranked_dupes AS (
  SELECT
    r.id,
    ROW_NUMBER() OVER (
      PARTITION BY
        LOWER(COALESCE(r.name->>'en', r.name->>'original', '')),
        ROUND(r.lat::numeric, 4),
        ROUND(r.lng::numeric, 4)
      ORDER BY
        (CASE WHEN r.external_ids->>'google_place_id' IS NOT NULL THEN 1 ELSE 0 END) DESC,
        (CASE WHEN EXISTS (SELECT 1 FROM menu_photos WHERE restaurant_id = r.id) THEN 1 ELSE 0 END) DESC,
        (CASE WHEN EXISTS (SELECT 1 FROM menu_items WHERE restaurant_id = r.id) THEN 1 ELSE 0 END) DESC,
        (CASE WHEN r.phone IS NOT NULL THEN 1 ELSE 0 END) DESC,
        COALESCE(r.value_score, 0) DESC,
        r.created_at DESC NULLS LAST
    ) AS rn
  FROM restaurants r
  WHERE r.is_active = true
    AND r.lat IS NOT NULL
    AND r.lng IS NOT NULL
)
UPDATE restaurants
SET is_active = false, updated_at = NOW()
WHERE id IN (SELECT id FROM ranked_dupes WHERE rn > 1);

-- ─── 3. Change is_active default to TRUE going forward ───
ALTER TABLE restaurants ALTER COLUMN is_active SET DEFAULT true;

-- ─── 4. Add unique partial index on active restaurants ───
-- Partial: only active rows must be unique (deactivated dupes can stay)
CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_dedup_active
  ON restaurants (
    LOWER(COALESCE(name->>'en', name->>'original', '')),
    ROUND(lat::numeric, 4),
    ROUND(lng::numeric, 4)
  )
  WHERE is_active = true;

-- ─── 5. Add helpful indexes if missing ───
CREATE INDEX IF NOT EXISTS idx_restaurants_active_geo
  ON restaurants (is_active, lat, lng) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant
  ON menu_items (restaurant_id);

CREATE INDEX IF NOT EXISTS idx_menu_photos_restaurant
  ON menu_photos (restaurant_id);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION (run after migration to confirm)
-- ═══════════════════════════════════════════════════════════════════

-- Should return 0 (no duplicates left)
-- SELECT
--   LOWER(COALESCE(name->>'en', name->>'original', '')) AS name_key,
--   ROUND(lat::numeric, 4) AS lat_key,
--   ROUND(lng::numeric, 4) AS lng_key,
--   COUNT(*) AS cnt
-- FROM restaurants WHERE is_active = true
-- GROUP BY 1, 2, 3 HAVING COUNT(*) > 1;
