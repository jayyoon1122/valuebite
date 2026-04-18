-- ═══════════════════════════════════════════════════════════════════
-- Migration: Prevent restaurant duplicates structurally
-- Date: 2026-04-18 (v3 — minimal, no SQL-side data manipulation)
-- Run AFTER: node scripts/dedupe-final.mjs
-- ═══════════════════════════════════════════════════════════════════
--
-- This migration is now MINIMAL because all the dedupe + activation
-- logic happens in scripts/dedupe-final.mjs (which handles edge cases
-- like both-inactive duplicates that pure SQL can't atomically resolve).
--
-- Run dedupe-final.mjs FIRST, then this migration.
-- The script verifies "0 active duplicates" before printing success.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─── 1. Default is_active = TRUE going forward ───
-- New rows are visible by default. No more invisible-data bugs.
ALTER TABLE restaurants ALTER COLUMN is_active SET DEFAULT true;

-- ─── 2. Unique partial index on active restaurants ───
-- Key: (lower(name), rounded lat 4dp, rounded lng 4dp) WHERE is_active = true
-- 4 dp ≈ 11m precision, matching the 50m tolerance in upsertRestaurant().
-- Partial: deactivated dupes can stay (we don't want to delete history).
CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_dedup_active
  ON restaurants (
    LOWER(COALESCE(name->>'en', name->>'original', '')),
    ROUND(lat::numeric, 4),
    ROUND(lng::numeric, 4)
  )
  WHERE is_active = true;

-- ─── 3. Helpful query indexes ───
CREATE INDEX IF NOT EXISTS idx_restaurants_active_geo
  ON restaurants (is_active, lat, lng) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant
  ON menu_items (restaurant_id);

CREATE INDEX IF NOT EXISTS idx_menu_photos_restaurant
  ON menu_photos (restaurant_id);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════
-- VERIFICATION (optional — should return 0 rows)
-- ═══════════════════════════════════════════════════════════════════
-- SELECT
--   LOWER(COALESCE(name->>'en', name->>'original', '')) AS name_key,
--   ROUND(lat::numeric, 4) AS lat_key,
--   ROUND(lng::numeric, 4) AS lng_key,
--   COUNT(*) AS cnt
-- FROM restaurants WHERE is_active = true
-- GROUP BY 1, 2, 3 HAVING COUNT(*) > 1;
