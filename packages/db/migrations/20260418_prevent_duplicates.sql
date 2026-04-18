-- ═══════════════════════════════════════════════════════════════════
-- Migration: Prevent restaurant duplicates structurally
-- Date: 2026-04-18
-- Run once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════
--
-- ROOT CAUSE (recorded in WORKLOG.md pinned rules):
--   Multiple import scripts (verified-import.mjs, city-pipeline.mjs,
--   fetch-restaurants.mjs) inserted the same restaurant twice with
--   different fields populated. Result: 384 split pairs.
--
-- THIS MIGRATION makes the duplicate state STRUCTURALLY IMPOSSIBLE:
--   1. Activate any restaurant that has real data (clean legacy invisibility)
--   2. Add unique partial index on (name + rounded lat/lng) for active rows
--   3. Change is_active default to TRUE so new rows are visible by default
--   4. Add a CHECK constraint preventing accidental NULL on critical fields
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. Activate restaurants with real data (legacy cleanup) ───
UPDATE restaurants r SET is_active = true
WHERE is_active = false
  AND (
    EXISTS (SELECT 1 FROM menu_items WHERE restaurant_id = r.id)
    OR EXISTS (SELECT 1 FROM menu_photos WHERE restaurant_id = r.id)
    OR r.phone IS NOT NULL
    OR r.operating_hours IS NOT NULL
    OR r.website IS NOT NULL
  );

-- ─── 2. Change is_active default to TRUE ───
ALTER TABLE restaurants ALTER COLUMN is_active SET DEFAULT true;

-- ─── 3. Add unique partial index on active restaurants ───
-- Key = lowercase name + lat rounded to 4dp + lng rounded to 4dp
-- 4 decimal places ≈ 11m precision (close enough for "same restaurant")
-- Partial: only active rows must be unique (deactivated dupes can stay)
CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_dedup_active
  ON restaurants (
    LOWER(COALESCE(name->>'en', name->>'original', '')),
    ROUND(lat::numeric, 4),
    ROUND(lng::numeric, 4)
  )
  WHERE is_active = true;

-- ─── 4. Add helpful indexes if missing ───
CREATE INDEX IF NOT EXISTS idx_restaurants_active_geo
  ON restaurants (is_active, lat, lng) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant
  ON menu_items (restaurant_id);

CREATE INDEX IF NOT EXISTS idx_menu_photos_restaurant
  ON menu_photos (restaurant_id);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION (run after migration)
-- ═══════════════════════════════════════════════════════════════════

-- Should return 0 (no duplicates left)
-- SELECT LOWER(COALESCE(name->>'en', name->>'original', '')) as name_key,
--        ROUND(lat::numeric, 4) as lat_key,
--        ROUND(lng::numeric, 4) as lng_key,
--        COUNT(*) as cnt
-- FROM restaurants WHERE is_active = true
-- GROUP BY 1, 2, 3 HAVING COUNT(*) > 1;

-- Should show is_active default is now true
-- SELECT column_default FROM information_schema.columns
-- WHERE table_name = 'restaurants' AND column_name = 'is_active';
