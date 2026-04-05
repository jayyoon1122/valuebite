-- ValueBite Database Migration
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste & Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================
-- COUNTRIES
-- ==================
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) UNIQUE NOT NULL,
    name JSONB NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    default_locale VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- CITIES
-- ==================
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(id),
    name JSONB NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN DEFAULT false,
    restaurant_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- PRICE BRACKETS
-- ==================
CREATE TABLE IF NOT EXISTS price_brackets (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(id),
    city_id INT REFERENCES cities(id),
    purpose_key VARCHAR(50) NOT NULL,
    purpose_label JSONB NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    icon VARCHAR(50),
    description JSONB,
    sort_order INT DEFAULT 0,
    last_adjusted TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- RESTAURANTS
-- ==================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id INT REFERENCES countries(id),
    city_id INT REFERENCES cities(id),
    neighborhood_id INT,
    name JSONB NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description JSONB,
    cuisine_type TEXT[],
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    address JSONB NOT NULL DEFAULT '{}',
    phone VARCHAR(30),
    website VARCHAR(500),
    operating_hours JSONB,
    is_24h BOOLEAN DEFAULT false,
    accepts_cards BOOLEAN,
    accepts_mobile_pay BOOLEAN,
    avg_meal_price DECIMAL(10,2),
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    price_last_verified TIMESTAMPTZ,
    price_currency VARCHAR(3),
    value_score DECIMAL(3,2),
    taste_score DECIMAL(3,2),
    portion_score DECIMAL(3,2),
    cleanliness_score DECIMAL(3,2),
    atmosphere_score DECIMAL(3,2),
    nutrition_score DECIMAL(3,2),
    fit_daily_eats DECIMAL(3,2) DEFAULT 0,
    fit_date_night DECIMAL(3,2) DEFAULT 0,
    fit_family_dinner DECIMAL(3,2) DEFAULT 0,
    fit_late_night DECIMAL(3,2) DEFAULT 0,
    fit_healthy_budget DECIMAL(3,2) DEFAULT 0,
    fit_group_party DECIMAL(3,2) DEFAULT 0,
    fit_solo_dining DECIMAL(3,2) DEFAULT 0,
    fit_special_occasion DECIMAL(3,2) DEFAULT 0,
    source VARCHAR(50),
    external_ids JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_chain BOOLEAN DEFAULT false,
    total_reviews INT DEFAULT 0,
    total_visits INT DEFAULT 0,
    photo_count INT DEFAULT 0,
    ai_summary JSONB,
    ai_summary_generated_at TIMESTAMPTZ,
    reviews_since_last_summary INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_user_update TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city_id, is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(lat, lng);
CREATE INDEX IF NOT EXISTS idx_restaurants_value ON restaurants(value_score);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);

-- ==================
-- MENU ITEMS
-- ==================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name JSONB NOT NULL,
    description JSONB,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    estimated_calories INT,
    has_protein BOOLEAN,
    is_vegetarian BOOLEAN,
    is_vegan BOOLEAN,
    allergens TEXT[],
    is_lunch_special BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    available_hours JSONB,
    last_verified TIMESTAMPTZ,
    source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- MENU PHOTOS
-- ==================
CREATE TABLE IF NOT EXISTS menu_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    uploaded_by UUID,
    photo_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    ai_processed BOOLEAN DEFAULT false,
    ai_extracted_items JSONB,
    ai_confidence DECIMAL(3,2),
    ai_language_detected VARCHAR(10),
    photo_date TIMESTAMPTZ,
    is_stale BOOLEAN DEFAULT false,
    staleness_warning VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- USERS
-- ==================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    auth_provider VARCHAR(20),
    auth_provider_id VARCHAR(255),
    home_country_id INT REFERENCES countries(id),
    home_city_id INT REFERENCES cities(id),
    preferred_locale VARCHAR(10),
    preferred_purposes TEXT[],
    dietary_prefs TEXT[],
    monthly_budget DECIMAL(10,2),
    contribution_points INT DEFAULT 0,
    level INT DEFAULT 1,
    badges TEXT[],
    total_reviews INT DEFAULT 0,
    total_photos INT DEFAULT 0,
    monthly_spent DECIMAL(10,2) DEFAULT 0,
    monthly_reset_day INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ
);

-- ==================
-- REVIEWS
-- ==================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    was_worth_it BOOLEAN,
    price_paid DECIMAL(10,2),
    currency VARCHAR(3),
    taste_rating SMALLINT CHECK (taste_rating BETWEEN 1 AND 5),
    portion_rating SMALLINT CHECK (portion_rating BETWEEN 1 AND 5),
    value_rating SMALLINT CHECK (value_rating BETWEEN 1 AND 5),
    content TEXT,
    language VARCHAR(10),
    ai_sentiment DECIMAL(3,2),
    ai_keywords TEXT[],
    ai_summary TEXT,
    visit_date TIMESTAMPTZ,
    visit_purpose VARCHAR(50),
    photos TEXT[],
    helpful_count INT DEFAULT 0,
    is_flagged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id, created_at DESC);

-- ==================
-- USER VISITS
-- ==================
CREATE TABLE IF NOT EXISTS user_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    restaurant_id UUID REFERENCES restaurants(id),
    visited_at TIMESTAMPTZ DEFAULT NOW(),
    amount_spent DECIMAL(10,2),
    currency VARCHAR(3),
    purpose VARCHAR(50),
    quick_rating BOOLEAN
);

-- ==================
-- USER FAVORITES
-- ==================
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID REFERENCES users(id),
    restaurant_id UUID REFERENCES restaurants(id),
    list_name VARCHAR(100) DEFAULT 'favorites',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, restaurant_id, list_name)
);

-- ==================
-- COMMUNITY POSTS
-- ==================
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    city_id INT REFERENCES cities(id),
    post_type VARCHAR(30) NOT NULL,
    title VARCHAR(200),
    content TEXT NOT NULL,
    photos TEXT[],
    restaurant_id UUID REFERENCES restaurants(id),
    upvotes INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- PROMOTED LISTINGS
-- ==================
CREATE TABLE IF NOT EXISTS promoted_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    campaign_name VARCHAR(200),
    budget_total DECIMAL(10,2),
    budget_spent DECIMAL(10,2) DEFAULT 0,
    cost_per_click DECIMAL(6,4),
    cost_per_impression DECIMAL(6,4),
    target_purposes TEXT[],
    target_city_ids INT[],
    target_radius_km DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'pending',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- PRICE ALERTS
-- ==================
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    restaurant_id UUID,
    menu_item_id UUID,
    previous_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    change_pct DECIMAL(5,2),
    alert_type VARCHAR(20),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================
-- Enable Row Level Security (RLS)
-- ==================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for restaurants, cities, countries
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_brackets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON community_posts FOR SELECT USING (true);

-- Done!
SELECT 'Migration complete! All tables created.' AS status;
