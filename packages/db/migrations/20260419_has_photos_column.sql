-- ═══════════════════════════════════════════════════════════════════
-- Migration: Add has_photos boolean column for performance
-- Date: 2026-04-19
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════
--
-- ROOT CAUSE: nearby API was making 6+ HTTP calls per page load to
-- check which restaurants have photos (N+1 pattern, chunked into
-- 50-ID batches). Result: 0.9s warm response time, 2.5s cold.
--
-- FIX: precompute has_photos on the restaurants table. API can sort
-- by it directly. Eliminates the chunked lookup entirely.
-- Expected speedup: 0.9s → ~0.2s warm.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- 1. Add column with default false
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS has_photos BOOLEAN DEFAULT false;

-- 2. Backfill from existing menu_photos
UPDATE restaurants SET has_photos = true
WHERE id IN (SELECT DISTINCT restaurant_id FROM menu_photos WHERE restaurant_id IS NOT NULL);

-- 3. Index for fast sort
CREATE INDEX IF NOT EXISTS idx_restaurants_has_photos
  ON restaurants (has_photos, value_score DESC) WHERE is_active = true;

-- 4. Trigger to keep in sync (auto-update when photos are inserted/deleted)
CREATE OR REPLACE FUNCTION sync_restaurant_has_photos()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE restaurants SET has_photos = true WHERE id = NEW.restaurant_id;
  ELSIF (TG_OP = 'DELETE') THEN
    -- Only flip to false if this was the last photo
    IF NOT EXISTS (SELECT 1 FROM menu_photos WHERE restaurant_id = OLD.restaurant_id AND id != OLD.id) THEN
      UPDATE restaurants SET has_photos = false WHERE id = OLD.restaurant_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_menu_photos_sync ON menu_photos;
CREATE TRIGGER trg_menu_photos_sync
  AFTER INSERT OR DELETE ON menu_photos
  FOR EACH ROW EXECUTE FUNCTION sync_restaurant_has_photos();

COMMIT;

-- Verify (should match the count from menu_photos distinct restaurant_ids):
-- SELECT COUNT(*) FROM restaurants WHERE has_photos = true;
-- SELECT COUNT(DISTINCT restaurant_id) FROM menu_photos;
