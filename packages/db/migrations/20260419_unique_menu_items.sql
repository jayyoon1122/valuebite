-- ═══════════════════════════════════════════════════════════════════
-- Migration: Prevent duplicate menu items at DB level
-- Date: 2026-04-19
-- Run AFTER scripts/dedupe-menu-items.mjs has cleaned existing dupes
-- ═══════════════════════════════════════════════════════════════════
--
-- ROOT CAUSE: data-cleanup.mjs reassigned menu_items between restaurants
-- without checking for existing duplicates → Tina's Cuban Cuisine showed
-- every menu item twice. Application-level fix is in place, but DB-level
-- constraint guarantees this can never happen again regardless of bugs.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- Unique partial index on (restaurant_id, lowered name->>en, price)
-- Skip rows where name or price is null (they're invalid anyway).
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_items_unique
  ON menu_items (
    restaurant_id,
    LOWER(COALESCE(name->>'en', name->>'original', '')),
    price
  )
  WHERE restaurant_id IS NOT NULL AND price IS NOT NULL;

COMMIT;
