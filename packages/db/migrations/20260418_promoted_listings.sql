-- ═══════════════════════════════════════════════════════════════════
-- Migration: In-house promoted restaurants (paid placements)
-- Date: 2026-04-18
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════
--
-- Powers Tier 1 of monetization: restaurants pay for premium placement.
-- Cards look 100% identical to organic results (Instagram/Yelp style)
-- with only a small "Sponsored" label.
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS promoted_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  -- Bid model
  bid_per_impression NUMERIC(10, 4) NOT NULL DEFAULT 0,  -- CPM rate ($ per 1000 imp)
  bid_per_click NUMERIC(10, 4) DEFAULT 0,                 -- optional CPC
  daily_budget NUMERIC(10, 2) NOT NULL,
  total_budget NUMERIC(10, 2),
  spent NUMERIC(10, 4) DEFAULT 0,
  -- Schedule
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  -- Targeting (NULL = no restriction)
  target_cities TEXT[],        -- e.g. ARRAY['tokyo', 'osaka']
  target_purposes TEXT[],      -- e.g. ARRAY['daily_eats', 'date_night']
  target_cuisines TEXT[],      -- e.g. ARRAY['ramen', 'sushi']
  -- Stats
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  -- State
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promoted_active
  ON promoted_listings (is_active, end_date)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_promoted_restaurant
  ON promoted_listings (restaurant_id);

-- Daily counter resets (impressions/clicks daily for budget tracking)
CREATE TABLE IF NOT EXISTS promoted_daily_stats (
  promoted_id UUID NOT NULL REFERENCES promoted_listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  spent NUMERIC(10, 4) DEFAULT 0,
  PRIMARY KEY (promoted_id, date)
);

CREATE INDEX IF NOT EXISTS idx_promoted_daily_date
  ON promoted_daily_stats (date);

COMMIT;
