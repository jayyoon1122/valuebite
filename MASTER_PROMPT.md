# ValueBite — Master Development Prompt
## International Budget Restaurant Discovery Platform
### Version 1.0 | Last Updated: 2026-04-05

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Database Design](#4-database-design)
5. [Backend API Design](#5-backend-api-design)
6. [AI/ML Pipeline](#6-aiml-pipeline)
7. [Frontend — Web Application](#7-frontend--web-application)
8. [Frontend — Mobile App (iOS & Android)](#8-frontend--mobile-app-ios--android)
9. [Core Business Mechanism](#9-core-business-mechanism)
10. [Monetization & Ad System](#10-monetization--ad-system)
11. [Localization & Multi-Country Support](#11-localization--multi-country-support)
12. [Data Bootstrapping Strategy](#12-data-bootstrapping-strategy)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Security & Privacy](#14-security--privacy)
15. [Development Phases & Milestones](#15-development-phases--milestones)
16. [Additional Improvements & Recommendations](#16-additional-improvements--recommendations)

---

## 1. PROJECT OVERVIEW

### 1.1 Product Vision

ValueBite is an international budget restaurant discovery platform inspired by Korea's "거지맵". It helps users find the best value-for-money restaurants worldwide, powered by AI-driven menu analysis, community curation, and purpose-based categorization.

### 1.2 Core Value Proposition

- Discover restaurants that deliver the best VALUE (not just cheapest) within price brackets
- AI analyzes menus, photos, and reviews to surface meaningful insights
- Purpose-based dining categories (daily eats, date night, family dinner, etc.)
- Country-specific price brackets auto-adjusted for local cost of living
- Community-driven quality curation with strict value standards

### 1.3 Target Users

- **Primary**: Budget-conscious young adults (18-35), students, early-career professionals
- **Secondary**: Families managing household budgets, travelers seeking local affordable dining
- **Tertiary**: Foodies who appreciate "hidden gem" value restaurants regardless of income

### 1.4 Target Markets (Launch Order)

1. **Phase 1**: Tokyo, Japan (strong budget-dining culture, "B-class gourmet" trend)
2. **Phase 2**: New York City, USA + London, UK
3. **Phase 3**: Berlin, Germany + Paris, France + Seoul, Korea (reverse-entry with premium features)
4. **Phase 4**: Global expansion — Southeast Asia, Latin America, etc.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────┐     │
│  │  Web App      │  │  iOS App          │  │  Android App        │   │
│  │  (Next.js)    │  │  (React Native)   │  │  (React Native)     │   │
│  │  PWA-enabled  │  │                   │  │                     │   │
│  └──────┬───────┘  └────────┬──────────┘  └─────────┬──────────┘   │
│         │                   │                        │               │
│         └───────────────────┼────────────────────────┘               │
│                             │                                        │
└─────────────────────────────┼────────────────────────────────────────┘
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (Kong / AWS API Gateway)           │
│  ┌────────────┐ ┌──────────┐ ┌────────────┐ ┌───────────────┐      │
│  │Rate Limiter│ │Auth (JWT)│ │Load Balancer│ │Request Logger │      │
│  └────────────┘ └──────────┘ └────────────┘ └───────────────┘      │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVICES (Microservices)                  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Restaurant        │  │ User Service      │  │ Review Service    │  │
│  │ Service           │  │ (auth, profile,   │  │ (reviews, ratings │  │
│  │ (CRUD, search,    │  │  preferences,     │  │  photos, "was it  │  │
│  │  geo-queries)     │  │  budget tracking) │  │  worth it" votes) │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ AI Service        │  │ Ad Service        │  │ Notification      │  │
│  │ (menu analysis,   │  │ (sponsored        │  │ Service           │  │
│  │  photo OCR/vision │  │  content, promoted │  │ (price alerts,    │  │
│  │  review NLP,      │  │  listings, ad      │  │  deal notifs,     │  │
│  │  recommendations) │  │  targeting)        │  │  push/email)      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │ Community         │  │ Analytics          │                       │
│  │ Service           │  │ Service            │                       │
│  │ (posts, tips,     │  │ (user behavior,    │                       │
│  │  deal sharing)    │  │  trends, reporting) │                      │
│  └──────────────────┘  └──────────────────┘                         │
│                                                                      │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐   │
│  │ PostgreSQL   │  │ Redis         │  │ Elastic   │  │ S3/Cloud   │  │
│  │ + PostGIS    │  │ (Cache,       │  │ Search    │  │ Storage    │  │
│  │ (Primary DB) │  │  Sessions,    │  │ (Full-text│  │ (Images,   │  │
│  │              │  │  Rate Limits) │  │  + Geo)   │  │  Menus)    │  │
│  └─────────────┘  └──────────────┘  └──────────┘  └────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Message Queue (RabbitMQ / AWS SQS)                             │ │
│  │  — async processing for AI tasks, notifications, data ingestion │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                               │
│  ┌──────────┐ ┌────────────┐ ┌─────────────┐ ┌──────────────────┐  │
│  │Google Maps│ │Google      │ │Claude /     │ │Google Ads /      │  │
│  │Platform   │ │Places API  │ │OpenAI APIs  │ │Meta Ads SDK      │  │
│  └──────────┘ └────────────┘ └─────────────┘ └──────────────────┘  │
│  ┌──────────┐ ┌────────────┐ ┌─────────────┐ ┌──────────────────┐  │
│  │Yelp Fusion│ │Firebase    │ │Stripe       │ │Apple/Google Pay  │  │
│  │API        │ │(Push notif)│ │(Payments)   │ │                  │  │
│  └──────────┘ └────────────┘ └─────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Architecture Decisions

- **Monorepo** using Turborepo: shared types, components, and utilities across web + mobile
- **API-first design**: All business logic through REST + GraphQL APIs; clients are thin
- **Event-driven async processing**: AI analysis, notifications, and data ingestion happen asynchronously via message queues
- **Multi-tenant by country**: Single codebase with country-specific configurations (currency, language, price brackets, map provider settings)
- **PWA-first web**: Web app works offline-capable for basic map browsing, installable on mobile home screens

---

## 3. TECH STACK

### 3.1 Frontend

| Component | Technology | Justification |
|---|---|---|
| Web App | **Next.js 15+ (App Router)** | SSR for SEO (restaurant pages need to be indexable), React Server Components for performance, built-in API routes |
| Mobile App | **React Native (Expo)** | Single codebase for iOS + Android, shared logic with web via monorepo, Expo simplifies build/deploy |
| Shared UI | **Tailwind CSS + shadcn/ui** (web), **NativeWind** (mobile) | Consistent design system across platforms |
| Maps | **Mapbox GL JS** (web) + **react-native-mapbox-gl** (mobile) | Better customization than Google Maps, more affordable at scale, custom map styles to match brand |
| State Management | **Zustand** | Lightweight, works in React Native and Next.js |
| Data Fetching | **TanStack Query (React Query)** | Caching, optimistic updates, background refetching |
| Forms | **React Hook Form + Zod** | Type-safe validation shared between client and server |
| Animations | **Framer Motion** (web) + **Reanimated 3** (mobile) | Smooth UI transitions |

### 3.2 Backend

| Component | Technology | Justification |
|---|---|---|
| Runtime | **Node.js 22+ (LTS)** | JavaScript ecosystem consistency with frontend, excellent async I/O |
| Framework | **Fastify** | Faster than Express, built-in schema validation, plugin system |
| API Layer | **REST (primary) + tRPC (internal)** | REST for public API + third-party integrations; tRPC for type-safe frontend-backend communication |
| ORM | **Drizzle ORM** | Lightweight, type-safe, excellent PostgreSQL + PostGIS support |
| Auth | **Auth.js (NextAuth) + JWT** | Social logins (Google, Apple, Kakao), session management |
| File Upload | **AWS S3 + Presigned URLs** | Direct client-to-S3 uploads for menu photos |
| Task Queue | **BullMQ (Redis-backed)** | Job scheduling for AI processing, notifications, data scraping |
| WebSockets | **Socket.io** | Real-time updates (new reviews, price changes) |

### 3.3 Database & Storage

| Component | Technology | Justification |
|---|---|---|
| Primary DB | **PostgreSQL 16 + PostGIS** | Geospatial indexing (ST_DWithin for radius search), JSONB for flexible menu schemas, mature ecosystem |
| Cache | **Redis 7** | Session cache, geo-queries cache, rate limiting, BullMQ backend |
| Search | **Meilisearch** (or Elasticsearch) | Fast full-text search with typo tolerance, geo-filtering, facets. Meilisearch is simpler to self-host |
| Object Storage | **AWS S3 / Cloudflare R2** | Menu photos, user uploads. R2 has zero egress fees |
| CDN | **Cloudflare** | Global edge caching for images and static assets |

### 3.4 AI/ML

| Component | Technology | Justification |
|---|---|---|
| Menu Photo Analysis | **Claude Vision API (claude-sonnet-4-6)** | Best multi-language OCR + understanding of menu layouts, prices, descriptions |
| Review NLP | **Claude API (claude-haiku-4-5)** | Fast, cheap sentiment analysis and summarization at scale |
| Recommendations | **Custom model (Python + scikit-learn / LightGBM)** | Collaborative filtering + content-based hybrid for personalized recommendations |
| Embeddings | **OpenAI text-embedding-3-small** or **Voyage AI** | For semantic search ("cozy ramen place for rainy days") |
| Vector DB | **pgvector (PostgreSQL extension)** | Keep it simple — vector search in same DB, avoid extra infra |

### 3.5 Infrastructure & DevOps

| Component | Technology | Justification |
|---|---|---|
| Hosting (Web) | **Vercel** | Optimal for Next.js, edge functions, preview deployments |
| Hosting (API) | **AWS ECS Fargate** or **Railway** | Container-based, auto-scaling, cost-effective for microservices |
| CI/CD | **GitHub Actions** | Monorepo-aware, free for public repos |
| Monitoring | **Sentry (errors) + Grafana Cloud (metrics)** | Full observability stack |
| Analytics | **PostHog** (self-hosted or cloud) | Product analytics, feature flags, session replay — privacy-friendly |
| IaC | **Terraform** | Reproducible infrastructure |

---

## 4. DATABASE DESIGN

### 4.1 Core Schema (PostgreSQL + PostGIS)

```sql
-- ====================
-- COUNTRY & LOCALIZATION
-- ====================

CREATE TABLE countries (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(2) UNIQUE NOT NULL,      -- ISO 3166-1 (US, JP, KR, GB, DE...)
    name            JSONB NOT NULL,                   -- {"en": "Japan", "ja": "日本", "ko": "일본"}
    currency_code   VARCHAR(3) NOT NULL,              -- ISO 4217 (USD, JPY, KRW, GBP, EUR)
    currency_symbol VARCHAR(5) NOT NULL,              -- $, ¥, ₩, £, €
    default_locale  VARCHAR(10) NOT NULL,             -- en-US, ja-JP, ko-KR
    timezone        VARCHAR(50) NOT NULL,             -- Asia/Tokyo, America/New_York
    is_active       BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE price_brackets (
    id              SERIAL PRIMARY KEY,
    country_id      INT REFERENCES countries(id),
    purpose_key     VARCHAR(50) NOT NULL,             -- daily_eats, date_night, family_dinner, etc.
    purpose_label   JSONB NOT NULL,                   -- {"en": "Daily Eats", "ja": "普段の食事"}
    max_price       DECIMAL(10,2) NOT NULL,           -- threshold in local currency
    icon            VARCHAR(50),                      -- emoji or icon key
    description     JSONB,                            -- {"en": "Everyday meals under $10"}
    sort_order      INT DEFAULT 0,
    last_adjusted   TIMESTAMPTZ DEFAULT NOW(),        -- auto-adjust based on CPI
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Purpose keys and initial price brackets:
-- daily_eats:       US $10, JP ¥1,000, KR ₩7,000,  UK £8,   DE €8
-- good_value:       US $15, JP ¥1,500, KR ₩10,000, UK £12,  DE €12
-- date_night:       US $25, JP ¥2,500, KR ₩20,000, UK £20,  DE €20
-- family_dinner:    US $18, JP ¥2,000, KR ₩15,000, UK £15,  DE €15
-- late_night:       US $12, JP ¥1,200, KR ₩8,000,  UK £10,  DE €10
-- healthy_budget:   US $14, JP ¥1,400, KR ₩9,000,  UK £11,  DE €11
-- group_party:      US $15, JP ¥1,500, KR ₩12,000, UK £12,  DE €12  (per person)
-- solo_dining:      US $12, JP ¥1,200, KR ₩8,000,  UK £10,  DE €10
-- special_occasion: US $50, JP ¥5,000, KR ₩40,000, UK £40,  DE €40

-- ====================
-- CITIES & AREAS
-- ====================

CREATE TABLE cities (
    id              SERIAL PRIMARY KEY,
    country_id      INT REFERENCES countries(id),
    name            JSONB NOT NULL,                   -- {"en": "Tokyo", "ja": "東京"}
    location        GEOMETRY(Point, 4326) NOT NULL,   -- center point
    bounds          GEOMETRY(Polygon, 4326),          -- city boundary
    is_active       BOOLEAN DEFAULT false,
    restaurant_count INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE neighborhoods (
    id              SERIAL PRIMARY KEY,
    city_id         INT REFERENCES cities(id),
    name            JSONB NOT NULL,
    location        GEOMETRY(Point, 4326),
    bounds          GEOMETRY(Polygon, 4326),
    avg_meal_price  DECIMAL(10,2),                    -- auto-calculated
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- RESTAURANTS
-- ====================

CREATE TABLE restaurants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id          INT REFERENCES countries(id),
    city_id             INT REFERENCES cities(id),
    neighborhood_id     INT REFERENCES neighborhoods(id),

    -- Basic info
    name                JSONB NOT NULL,               -- {"original": "松屋", "en": "Matsuya", "romanized": "Matsuya"}
    slug                VARCHAR(255) UNIQUE,
    description         JSONB,
    cuisine_type        VARCHAR(100)[],               -- ['japanese', 'ramen', 'gyudon']
    location            GEOMETRY(Point, 4326) NOT NULL,
    address             JSONB NOT NULL,               -- structured address with localized versions
    phone               VARCHAR(30),
    website             VARCHAR(500),

    -- Operating info
    operating_hours     JSONB,                        -- {"mon": {"open": "11:00", "close": "22:00"}, ...}
    is_24h              BOOLEAN DEFAULT false,
    accepts_cards       BOOLEAN,
    accepts_mobile_pay  BOOLEAN,

    -- Price info
    avg_meal_price      DECIMAL(10,2),                -- auto-calculated from menu items
    price_range_min     DECIMAL(10,2),
    price_range_max     DECIMAL(10,2),
    price_last_verified TIMESTAMPTZ,
    price_currency      VARCHAR(3),

    -- Value scoring (AI-computed)
    value_score         DECIMAL(3,2),                 -- 0.00-5.00 (taste×portion÷price)
    taste_score         DECIMAL(3,2),
    portion_score       DECIMAL(3,2),
    cleanliness_score   DECIMAL(3,2),
    atmosphere_score    DECIMAL(3,2),
    nutrition_score     DECIMAL(3,2),                 -- penalizes carb-only meals (from 거지맵 concept)

    -- Purpose fit scores (AI-computed, 0.00-1.00)
    fit_daily_eats      DECIMAL(3,2) DEFAULT 0,
    fit_date_night      DECIMAL(3,2) DEFAULT 0,
    fit_family_dinner   DECIMAL(3,2) DEFAULT 0,
    fit_late_night      DECIMAL(3,2) DEFAULT 0,
    fit_healthy_budget  DECIMAL(3,2) DEFAULT 0,
    fit_group_party     DECIMAL(3,2) DEFAULT 0,
    fit_solo_dining     DECIMAL(3,2) DEFAULT 0,
    fit_special_occasion DECIMAL(3,2) DEFAULT 0,

    -- Metadata
    source              VARCHAR(50),                  -- 'user', 'google_places', 'yelp', 'ai_scraped'
    external_ids        JSONB,                        -- {"google_place_id": "...", "yelp_id": "..."}
    is_verified         BOOLEAN DEFAULT false,
    is_active           BOOLEAN DEFAULT true,
    total_reviews       INT DEFAULT 0,
    total_visits        INT DEFAULT 0,
    photo_count         INT DEFAULT 0,

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    last_user_update    TIMESTAMPTZ                   -- last time a user contributed data
);

CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);
CREATE INDEX idx_restaurants_city ON restaurants(city_id, is_active);
CREATE INDEX idx_restaurants_price ON restaurants(avg_meal_price) WHERE is_active = true;
CREATE INDEX idx_restaurants_value_score ON restaurants(value_score DESC) WHERE is_active = true;
CREATE INDEX idx_restaurants_cuisine ON restaurants USING GIN(cuisine_type);

-- ====================
-- MENU ITEMS
-- ====================

CREATE TABLE menu_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID REFERENCES restaurants(id) ON DELETE CASCADE,

    name            JSONB NOT NULL,                   -- {"original": "牛丼並盛", "en": "Regular Beef Bowl"}
    description     JSONB,
    category        VARCHAR(100),                     -- appetizer, main, drink, dessert, set_meal
    price           DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) NOT NULL,

    -- AI-extracted nutrition estimate
    estimated_calories INT,
    has_protein     BOOLEAN,                          -- for nutrition quality filter
    is_vegetarian   BOOLEAN,
    is_vegan        BOOLEAN,
    allergens       VARCHAR(50)[],

    -- Metadata
    is_lunch_special  BOOLEAN DEFAULT false,          -- hidden lunch deal
    is_seasonal       BOOLEAN DEFAULT false,
    available_hours   JSONB,                          -- null = always available
    last_verified     TIMESTAMPTZ,
    source            VARCHAR(50),                    -- 'ai_photo_extract', 'user_input', 'website_scrape'

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- MENU PHOTOS (for AI analysis)
-- ====================

CREATE TABLE menu_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    uploaded_by     UUID REFERENCES users(id),
    photo_url       VARCHAR(500) NOT NULL,
    thumbnail_url   VARCHAR(500),

    -- AI analysis results
    ai_processed    BOOLEAN DEFAULT false,
    ai_extracted_items JSONB,                         -- extracted menu items + prices
    ai_confidence   DECIMAL(3,2),                     -- 0.00-1.00
    ai_language_detected VARCHAR(10),

    -- Freshness tracking
    photo_date      DATE,                             -- when the photo was taken (EXIF or user-provided)
    is_stale        BOOLEAN DEFAULT false,            -- flagged if > 6 months old
    staleness_warning VARCHAR(200),                   -- "Prices may have changed since [date]"

    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- USERS
-- ====================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE,
    display_name    VARCHAR(100),
    avatar_url      VARCHAR(500),
    auth_provider   VARCHAR(20),                      -- google, apple, kakao, email
    auth_provider_id VARCHAR(255),

    -- Preferences
    home_country_id INT REFERENCES countries(id),
    home_city_id    INT REFERENCES cities(id),
    preferred_locale VARCHAR(10),
    preferred_purposes VARCHAR(50)[],                 -- ['daily_eats', 'solo_dining']
    dietary_prefs   VARCHAR(50)[],                    -- ['vegetarian', 'halal', 'gluten_free']
    monthly_budget  DECIMAL(10,2),                    -- optional: user's dining-out budget

    -- Gamification
    contribution_points INT DEFAULT 0,
    level           INT DEFAULT 1,                    -- Beginner, Regular, Expert, Master
    badges          VARCHAR(50)[],
    total_reviews   INT DEFAULT 0,
    total_photos    INT DEFAULT 0,

    -- Budget tracker
    monthly_spent   DECIMAL(10,2) DEFAULT 0,          -- current month dining spend
    monthly_reset_day INT DEFAULT 1,                  -- day of month to reset

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_active     TIMESTAMPTZ
);

-- ====================
-- REVIEWS & RATINGS
-- ====================

CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),

    -- Quick rating (primary — low friction)
    was_worth_it    BOOLEAN,                          -- thumbs up/down ("Was it worth it?")
    price_paid      DECIMAL(10,2),                    -- what user actually paid
    currency        VARCHAR(3),

    -- Detailed rating (optional)
    taste_rating    SMALLINT CHECK (taste_rating BETWEEN 1 AND 5),
    portion_rating  SMALLINT CHECK (portion_rating BETWEEN 1 AND 5),
    value_rating    SMALLINT CHECK (value_rating BETWEEN 1 AND 5),

    -- Review text
    content         TEXT,
    language        VARCHAR(10),                      -- auto-detected

    -- AI analysis of this review
    ai_sentiment    DECIMAL(3,2),                     -- -1.00 to 1.00
    ai_keywords     VARCHAR(100)[],                   -- extracted key phrases
    ai_summary      TEXT,                             -- one-line AI summary

    -- Metadata
    visit_date      DATE,
    visit_purpose   VARCHAR(50),                      -- which purpose category
    photos          UUID[],                           -- references to uploaded photos
    helpful_count   INT DEFAULT 0,
    is_flagged      BOOLEAN DEFAULT false,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- USER VISITS (lightweight tracking)
-- ====================

CREATE TABLE user_visits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    restaurant_id   UUID REFERENCES restaurants(id),
    visited_at      TIMESTAMPTZ DEFAULT NOW(),
    amount_spent    DECIMAL(10,2),
    currency        VARCHAR(3),
    purpose         VARCHAR(50),
    quick_rating    BOOLEAN                           -- was_worth_it quick tap
);

-- ====================
-- USER FAVORITES & LISTS
-- ====================

CREATE TABLE user_favorites (
    user_id         UUID REFERENCES users(id),
    restaurant_id   UUID REFERENCES restaurants(id),
    list_name       VARCHAR(100) DEFAULT 'favorites', -- custom lists: "Friday spots", "Client lunch places"
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, restaurant_id, list_name)
);

-- ====================
-- COMMUNITY / FEED
-- ====================

CREATE TABLE community_posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    city_id         INT REFERENCES cities(id),
    post_type       VARCHAR(30) NOT NULL,             -- 'tip', 'deal', 'discussion', 'haul' (grocery deals)
    title           VARCHAR(200),
    content         TEXT NOT NULL,
    photos          VARCHAR(500)[],
    restaurant_id   UUID REFERENCES restaurants(id),  -- optional link to restaurant
    upvotes         INT DEFAULT 0,
    comment_count   INT DEFAULT 0,
    is_pinned       BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- ADS & PROMOTED LISTINGS
-- ====================

CREATE TABLE promoted_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID REFERENCES restaurants(id),
    campaign_name   VARCHAR(200),
    budget_total    DECIMAL(10,2),                    -- total campaign budget
    budget_spent    DECIMAL(10,2) DEFAULT 0,
    cost_per_click  DECIMAL(6,4),                     -- CPC bid
    cost_per_impression DECIMAL(6,4),                 -- CPM bid
    target_purposes VARCHAR(50)[],                    -- which purpose categories to show in
    target_city_ids INT[],
    target_radius_km DECIMAL(5,2),                    -- geo-targeting radius
    status          VARCHAR(20) DEFAULT 'pending',    -- pending, active, paused, ended
    starts_at       TIMESTAMPTZ,
    ends_at         TIMESTAMPTZ,
    impressions     INT DEFAULT 0,
    clicks          INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE native_ads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_provider     VARCHAR(20) NOT NULL,             -- 'google_admob', 'meta_audience_network'
    ad_unit_id      VARCHAR(200) NOT NULL,
    ad_format       VARCHAR(30) NOT NULL,             -- 'native_feed', 'interstitial', 'banner', 'rewarded'
    placement       VARCHAR(50) NOT NULL,             -- 'restaurant_list', 'map_view', 'community_feed'
    country_codes   VARCHAR(2)[],                     -- targeting by country
    is_active       BOOLEAN DEFAULT true,
    priority        INT DEFAULT 0,                    -- higher = shown more often
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- PRICE ALERTS
-- ====================

CREATE TABLE price_alerts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    restaurant_id   UUID REFERENCES restaurants(id),
    menu_item_id    UUID REFERENCES menu_items(id),
    previous_price  DECIMAL(10,2),
    new_price       DECIMAL(10,2),
    change_pct      DECIMAL(5,2),
    alert_type      VARCHAR(20),                      -- 'price_increase', 'price_decrease', 'threshold_exceeded'
    is_read         BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ====================
-- DATA INGESTION LOG
-- ====================

CREATE TABLE data_ingestion_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source          VARCHAR(50) NOT NULL,             -- 'google_places', 'yelp', 'user_upload', 'web_scrape'
    entity_type     VARCHAR(30) NOT NULL,             -- 'restaurant', 'menu', 'review'
    entity_id       UUID,
    status          VARCHAR(20),                      -- 'success', 'failed', 'duplicate', 'needs_review'
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Key Indexes & Performance

```sql
-- Geospatial: Find restaurants within X km of user
CREATE INDEX idx_restaurants_geo ON restaurants USING GIST(location);

-- Purpose-based queries: "Best daily eats near me"
CREATE INDEX idx_restaurants_daily ON restaurants(fit_daily_eats DESC)
    WHERE is_active = true AND fit_daily_eats > 0.5;

-- Price bracket queries
CREATE INDEX idx_restaurants_price_country ON restaurants(country_id, avg_meal_price)
    WHERE is_active = true;

-- Full-text search (sync to Meilisearch for production)
CREATE INDEX idx_restaurants_name_gin ON restaurants USING GIN(name jsonb_path_ops);

-- Review aggregation
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id, created_at DESC);
```

---

## 5. BACKEND API DESIGN

### 5.1 Core API Endpoints

```yaml
# =============================
# RESTAURANT DISCOVERY (Core)
# =============================

GET /api/v1/restaurants/nearby
  Query: lat, lng, radius_km, purpose?, price_max?, cuisine?, sort_by(value_score|distance|price), page, limit
  Response: paginated restaurant list with distance, value_score, avg_price
  Notes: This is the PRIMARY endpoint. Must be < 200ms response time.

GET /api/v1/restaurants/search
  Query: q (text query), city_id, filters (same as above)
  Response: search results with relevance score
  Notes: Powers the search bar. Uses Meilisearch.

GET /api/v1/restaurants/:id
  Response: full restaurant detail including menu, AI summary, reviews summary, photos
  Notes: Includes "similar restaurants" recommendations

GET /api/v1/restaurants/:id/menu
  Response: full menu with prices, AI-extracted items, freshness indicators
  Notes: Groups by category, flags stale prices

GET /api/v1/restaurants/:id/reviews
  Query: sort_by(recent|helpful|critical), page, limit
  Response: paginated reviews with AI sentiment + summary

GET /api/v1/restaurants/purpose/:purpose_key
  Query: city_id, lat, lng, sort_by, page, limit
  Response: restaurants ranked by fit score for that purpose
  Notes: Powers the purpose-based browsing feature

GET /api/v1/restaurants/trending
  Query: city_id, time_range(week|month)
  Response: trending restaurants (most new reviews, biggest value score jumps)

# =============================
# MAP DATA
# =============================

GET /api/v1/map/clusters
  Query: bounds (sw_lat, sw_lng, ne_lat, ne_lng), zoom_level, purpose?, price_max?
  Response: clustered restaurant markers for map view
  Notes: Use server-side clustering for performance at low zoom levels

GET /api/v1/map/heatmap
  Query: city_id, metric (value_score|price|density)
  Response: heatmap data for overlay
  Notes: Shows "value zones" — neighborhoods with highest concentration of good-value restaurants

# =============================
# USER
# =============================

POST /api/v1/auth/register       — email/social signup
POST /api/v1/auth/login          — email/social login
POST /api/v1/auth/refresh        — refresh JWT token
DELETE /api/v1/auth/account      — delete account (GDPR)

GET    /api/v1/user/profile
PATCH  /api/v1/user/profile      — update preferences, locale, dietary prefs
GET    /api/v1/user/favorites
POST   /api/v1/user/favorites    — add to favorites/custom list
DELETE /api/v1/user/favorites/:restaurant_id

GET    /api/v1/user/budget        — monthly spend summary
POST   /api/v1/user/budget/log    — log a dining expense
GET    /api/v1/user/budget/history — spending history with charts data

GET    /api/v1/user/recommendations — personalized AI recommendations

# =============================
# REVIEWS & CONTRIBUTIONS
# =============================

POST   /api/v1/reviews                — create review (text + ratings)
POST   /api/v1/reviews/quick          — quick "was it worth it?" tap + price paid
PATCH  /api/v1/reviews/:id            — edit own review
DELETE /api/v1/reviews/:id            — delete own review
POST   /api/v1/reviews/:id/helpful    — mark review as helpful

POST   /api/v1/restaurants/suggest    — suggest a new restaurant
POST   /api/v1/menu-photos/upload     — upload menu photo for AI processing
GET    /api/v1/menu-photos/:id/status — check AI processing status

# =============================
# COMMUNITY
# =============================

GET    /api/v1/community/feed        — community posts feed
POST   /api/v1/community/posts       — create post
POST   /api/v1/community/posts/:id/upvote
GET    /api/v1/community/posts/:id/comments
POST   /api/v1/community/posts/:id/comments

# =============================
# NOTIFICATIONS
# =============================

GET    /api/v1/notifications          — user's notifications
PATCH  /api/v1/notifications/:id/read
POST   /api/v1/notifications/settings — configure push/email preferences

# =============================
# ADS (Internal + External)
# =============================

GET    /api/v1/ads/feed              — get native ad to insert in feed (Instagram-style)
POST   /api/v1/ads/impression        — log ad impression
POST   /api/v1/ads/click             — log ad click

# Restaurant owner endpoints (promoted listings)
POST   /api/v1/business/promote      — create promoted listing campaign
GET    /api/v1/business/campaigns    — list campaigns with stats
PATCH  /api/v1/business/campaigns/:id — pause/resume/update campaign

# =============================
# ADMIN / DATA PIPELINE
# =============================

POST   /api/v1/admin/ingest/google-places  — trigger Google Places data import for a city
POST   /api/v1/admin/ingest/yelp           — trigger Yelp data import
POST   /api/v1/admin/ai/reprocess/:restaurant_id  — re-run AI analysis
GET    /api/v1/admin/analytics/overview    — dashboard metrics
POST   /api/v1/admin/price-brackets/adjust — trigger CPI-based price bracket adjustment
```

### 5.2 Response Format Standard

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "has_next": true
  },
  "ads": [
    {
      "type": "native_sponsored",
      "position": 4,
      "content": { ... }
    }
  ]
}
```

---

## 6. AI/ML PIPELINE

### 6.1 Menu Photo Analysis Pipeline

```
User uploads menu photo
        │
        ▼
┌───────────────────┐
│  Pre-processing    │  — Image quality check, orientation fix, enhancement
│  (Sharp.js)        │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Claude Vision API │  Prompt: "Extract all menu items with names, descriptions,
│  (claude-sonnet)   │  and prices from this menu photo. Detect the language.
│                    │  Return structured JSON. Flag any items that appear to be
│                    │  lunch-only specials or seasonal items."
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Post-processing   │  — Parse JSON, validate prices against country bracket
│  & Validation      │  — Currency detection & conversion
│                    │  — Detect if photo is stale (EXIF date > 6 months)
│                    │  — Cross-reference with existing menu data
│                    │  — Flag significant price changes (>15%)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Store Results     │  — Update menu_items table
│  & Notify          │  — Update restaurant avg_meal_price
│                    │  — Trigger price alerts if thresholds crossed
│                    │  — Award contribution points to uploader
└───────────────────┘
```

### 6.2 Review Analysis Pipeline

```
New review submitted
        │
        ▼
┌───────────────────┐
│  Language Detection│  — Detect language, store for filtering
│  & Moderation      │  — Check for spam, inappropriate content
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Sentiment Analysis│  Prompt: "Analyze this restaurant review. Extract:
│  (claude-haiku)    │  1. Overall sentiment (-1 to 1)
│                    │  2. Specific praise/complaints about: taste, portions,
│                    │     value, cleanliness, service, atmosphere
│                    │  3. Key phrases/highlights
│                    │  4. One-sentence summary"
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Aggregate Scores  │  — Recalculate restaurant's overall scores
│  & Update          │  — Update value_score composite
│                    │  — Update purpose fit scores based on review content
│                    │  — Regenerate restaurant AI summary
└───────────────────┘
```

### 6.3 Restaurant AI Summary Generation

For each restaurant, generate an "AI Summary" (like Amazon's AI review summary):

```
Prompt template:
"Based on {n} reviews for {restaurant_name}, generate a concise summary covering:
- What diners love most
- Best value menu items (with prices)
- Who this restaurant is best for (purpose fit)
- Any common complaints
- Best time to visit
Keep it under 150 words. Be honest and helpful, not promotional."
```

Regenerate weekly or when 5+ new reviews are added.

### 6.4 Recommendation Engine

**Hybrid approach:**

1. **Collaborative filtering**: "Users who liked restaurants you liked also enjoyed X"
2. **Content-based**: Match user's cuisine preferences, price range, dietary needs
3. **Context-aware**: Time of day (lunch vs dinner), day of week, weather, location
4. **Purpose-based**: Weight recommendations by user's selected purpose

```python
# Simplified recommendation scoring
def score_restaurant(user, restaurant, context):
    cf_score = collaborative_filter(user, restaurant)      # 0-1
    content_score = content_match(user.prefs, restaurant)   # 0-1
    context_score = context_relevance(context, restaurant)  # 0-1
    purpose_score = purpose_fit(context.purpose, restaurant) # 0-1
    value_score = restaurant.value_score / 5.0              # 0-1
    freshness = recency_boost(restaurant.last_user_update)  # 0-1

    return (
        cf_score * 0.25 +
        content_score * 0.20 +
        context_score * 0.15 +
        purpose_score * 0.20 +
        value_score * 0.15 +
        freshness * 0.05
    )
```

### 6.5 Automated Price Monitoring

```
Weekly cron job per active city:
    1. For each restaurant with last_verified > 30 days:
       a. Check Google Places API for updated price_level
       b. Scrape restaurant website for menu changes (if available)
       c. Cross-reference with recent user-submitted menu photos
    2. If price change detected > 10%:
       a. Update menu_items prices
       b. Recalculate avg_meal_price
       c. Check if restaurant still fits its price brackets
       d. Send price alerts to users who favorited this restaurant
    3. If no data available for > 90 days:
       a. Flag restaurant for community verification
       b. Show "prices unverified" badge on listing
```

---

## 7. FRONTEND — WEB APPLICATION

### 7.1 Page Structure (Next.js App Router)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (main)/
│   ├── layout.tsx                  ← persistent bottom nav, header, map toggle
│   ├── page.tsx                    ← HOME: map view + nearby restaurants
│   ├── search/page.tsx             ← search results
│   ├── purpose/
│   │   └── [purpose]/page.tsx      ← purpose-based list (daily_eats, date_night, etc.)
│   ├── restaurant/
│   │   └── [slug]/
│   │       ├── page.tsx            ← restaurant detail
│   │       ├── menu/page.tsx       ← full menu view
│   │       └── reviews/page.tsx    ← all reviews
│   ├── community/
│   │   ├── page.tsx                ← community feed
│   │   └── [postId]/page.tsx       ← single post + comments
│   ├── profile/
│   │   ├── page.tsx                ← user profile
│   │   ├── favorites/page.tsx
│   │   ├── budget/page.tsx         ← monthly budget tracker
│   │   ├── contributions/page.tsx
│   │   └── settings/page.tsx
│   ├── trending/page.tsx           ← trending restaurants this week
│   └── deals/page.tsx              ← hot deals, lunch specials, coupons
├── business/                       ← restaurant owner portal
│   ├── page.tsx                    ← dashboard
│   ├── claim/page.tsx              ← claim restaurant listing
│   └── promote/page.tsx            ← create promoted listing
├── api/                            ← Next.js API routes (BFF pattern)
│   └── ...
├── globals.css
├── layout.tsx                      ← root layout: fonts, theme, providers
└── manifest.json                   ← PWA manifest
```

### 7.2 Key UI Components

```
components/
├── map/
│   ├── MapView.tsx                 ← Mapbox GL wrapper with restaurant markers
│   ├── MapMarker.tsx               ← custom marker with price badge
│   ├── MapCluster.tsx              ← clustered markers at low zoom
│   ├── MapHeatmap.tsx              ← value/price heatmap overlay
│   └── MapBottomSheet.tsx          ← slide-up restaurant preview on marker tap
├── restaurant/
│   ├── RestaurantCard.tsx          ← list item: photo, name, price, value score, distance
│   ├── RestaurantDetail.tsx        ← full detail view
│   ├── ValueScoreBadge.tsx         ← visual value score indicator (🔥 Great Value!)
│   ├── PriceBracketTag.tsx         ← "Daily Eats ✓" tag
│   ├── MenuItemList.tsx            ← menu with prices, AI indicators
│   ├── MenuPhotoUploader.tsx       ← camera/gallery upload with EXIF date check
│   ├── AISummaryCard.tsx           ← AI-generated review summary
│   ├── PriceHistoryChart.tsx       ← mini sparkline of price changes
│   └── StalePriceWarning.tsx       ← "Prices last verified X months ago"
├── review/
│   ├── QuickRating.tsx             ← thumbs up/down + price paid (one-tap)
│   ├── DetailedReviewForm.tsx      ← full review with ratings
│   └── ReviewCard.tsx              ← single review display
├── purpose/
│   ├── PurposeSelector.tsx         ← horizontal scroll chips: Daily Eats, Date Night...
│   ├── PurposeCard.tsx             ← purpose category card with icon + description
│   └── PurposeResultList.tsx       ← restaurants sorted by purpose fit
├── budget/
│   ├── BudgetOverview.tsx          ← monthly spend vs budget
│   ├── SpendingChart.tsx           ← bar/line chart of daily/weekly spend
│   ├── BudgetLogForm.tsx           ← quick "I spent $X at Y" input
│   └── SavingsCalculator.tsx       ← "You saved $X this month vs avg"
├── ads/
│   ├── NativeAdCard.tsx            ← Instagram-style sponsored content in feed
│   ├── PromotedBadge.tsx           ← subtle "Promoted" label
│   └── AdInterstitial.tsx          ← full-screen ad (sparingly, between actions)
├── community/
│   ├── PostCard.tsx
│   ├── CreatePostForm.tsx
│   └── CommentThread.tsx
├── common/
│   ├── BottomNav.tsx               ← Map | Search | Purpose | Community | Profile
│   ├── Header.tsx
│   ├── SearchBar.tsx               ← with voice search, recent searches
│   ├── FilterSheet.tsx             ← bottom sheet with filters
│   ├── CurrencyDisplay.tsx         ← auto-formats price in local currency
│   ├── DistanceBadge.tsx           ← "350m away"
│   └── EmptyState.tsx
└── providers/
    ├── AuthProvider.tsx
    ├── LocationProvider.tsx
    ├── LocaleProvider.tsx
    └── ThemeProvider.tsx
```

### 7.3 Key UI/UX Design Principles

1. **Map-first**: The home screen IS the map. Restaurant list is a bottom sheet overlay.
2. **One-tap value**: User opens app → sees value restaurants near them in < 2 seconds
3. **Purpose chips at top**: Always visible horizontal scroll of purpose categories
4. **Color-coded price markers**: Green (great value) → Yellow (good) → Orange (above bracket)
5. **Instagram-style feed**: Community and restaurant discovery scroll like Instagram — native ads blend naturally
6. **"Was it worth it?" prompt**: After detecting a user visited a restaurant (geofencing), show a 2-second rating prompt
7. **Dark mode**: Essential for late-night browsing (one of the purposes)
8. **Haptic feedback**: On mobile, subtle haptics for likes, bookmarks, ratings

### 7.4 PWA Configuration

```json
// manifest.json
{
  "name": "ValueBite - Smart Budget Dining",
  "short_name": "ValueBite",
  "description": "Find the best value restaurants near you",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 8. FRONTEND — MOBILE APP (iOS & Android)

### 8.1 React Native (Expo) Project Structure

```
apps/mobile/
├── app/                            ← Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── _layout.tsx             ← Tab navigator: Map, Discover, Purpose, Community, Profile
│   │   ├── index.tsx               ← Map tab (home)
│   │   ├── discover.tsx            ← Search + trending
│   │   ├── purpose.tsx             ← Purpose-based browsing
│   │   ├── community.tsx           ← Community feed
│   │   └── profile.tsx             ← User profile + budget
│   ├── restaurant/
│   │   └── [id].tsx                ← Restaurant detail (shared element transition)
│   ├── review/
│   │   └── create.tsx              ← Review creation flow
│   ├── camera/
│   │   └── menu-scan.tsx           ← Camera view for menu photo capture
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── onboarding.tsx          ← First-launch: select country, city, purposes, budget
│   └── _layout.tsx                 ← Root layout
├── components/                     ← Shared with web via packages/ui where possible
├── hooks/
│   ├── useLocation.ts              ← GPS with background tracking for visit detection
│   ├── useGeofence.ts              ← Detect when user enters/leaves restaurant area
│   └── useCamera.ts                ← Camera access for menu photos
├── services/
│   ├── api.ts                      ← API client (shared with web)
│   ├── notifications.ts            ← Push notification handler
│   └── analytics.ts                ← Event tracking
└── assets/
```

### 8.2 Mobile-Specific Features

| Feature | Implementation |
|---|---|
| **Geofence-based visit detection** | When user is near a saved restaurant for 20+ min, trigger "Was it worth it?" notification |
| **Camera menu scanner** | Native camera with overlay guide: "Point at the menu" → auto-capture → AI extract |
| **Offline map caching** | Cache map tiles + restaurant data for areas user frequently visits |
| **Widget (iOS/Android)** | Home screen widget showing "Today's suggestion" based on location + time + budget remaining |
| **Share extension** | Share a restaurant from Google Maps/Instagram directly to ValueBite |
| **Apple/Google Pay** | For in-app purchases (premium subscription) |
| **Haptic feedback** | Subtle haptics on interactions for premium feel |
| **Push notifications** | Price alerts, deal notifications, weekly value report |

### 8.3 Onboarding Flow

```
Screen 1: Welcome
  "Find amazing food at amazing prices"
  [Get Started]

Screen 2: Select Your Country
  [Grid of country flags + names]
  Auto-detect from device locale

Screen 3: Select Your City
  [Search or select from popular cities in chosen country]
  "We'll add more cities soon!"

Screen 4: What's Your Dining Style?
  [Multi-select purpose chips]
  Daily Eats | Date Spots | Family Dinner | Late Night | Healthy | Solo

Screen 5: Monthly Dining Budget (Optional)
  [Slider in local currency]
  "We'll help you track spending and find the best value"
  [Skip] [Set Budget]

Screen 6: Sign Up (Optional)
  "Save your favorites and earn rewards"
  [Continue with Google] [Continue with Apple] [Skip for now]

→ Drop into Map View with restaurants
```

---

## 9. CORE BUSINESS MECHANISM

### 9.1 Value Score Algorithm

The Value Score is the CORE differentiator. It's not just about cheap — it's about VALUE.

```python
def calculate_value_score(restaurant):
    """
    Value Score = (Quality Metrics) / (Price Relative to Bracket)
    Range: 0.00 - 5.00
    """
    # Quality metrics (from AI analysis of reviews + community ratings)
    taste = restaurant.taste_score           # 0-5
    portion = restaurant.portion_score       # 0-5
    nutrition = restaurant.nutrition_score   # 0-5 (penalizes carb-only)
    cleanliness = restaurant.cleanliness_score # 0-5

    quality_composite = (
        taste * 0.35 +
        portion * 0.25 +
        nutrition * 0.20 +
        cleanliness * 0.20
    )

    # Price factor: how cheap relative to the bracket ceiling
    bracket = get_price_bracket(restaurant.country, 'daily_eats')
    price_ratio = restaurant.avg_meal_price / bracket.max_price
    # price_ratio < 1.0 means under budget; > 1.0 means over

    if price_ratio <= 0:
        price_factor = 1.0
    elif price_ratio <= 0.5:
        price_factor = 1.5  # significantly under budget = bonus
    elif price_ratio <= 1.0:
        price_factor = 1.0 + (1.0 - price_ratio) * 0.5  # under budget = slight bonus
    else:
        price_factor = max(0.3, 1.0 / price_ratio)  # over budget = penalty

    # Community validation
    review_count = restaurant.total_reviews
    confidence = min(1.0, review_count / 20)  # full confidence at 20+ reviews
    worth_it_ratio = get_worth_it_ratio(restaurant.id)  # % of "was it worth it" = yes

    community_factor = 0.5 + (worth_it_ratio * confidence * 0.5)  # 0.5-1.0

    # Final score
    raw_score = quality_composite * price_factor * community_factor
    return min(5.0, round(raw_score, 2))
```

### 9.2 Purpose Fit Scoring

```python
def calculate_purpose_fit(restaurant, purpose_key):
    """
    How well does this restaurant fit a specific dining purpose?
    Range: 0.00 - 1.00
    """
    scores = {}

    if purpose_key == 'daily_eats':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'daily_eats'),  # 0-1
            'speed': estimate_meal_speed(restaurant),                  # fast = higher
            'proximity_to_offices': office_district_score(restaurant), # higher near offices
            'consistency': review_consistency_score(restaurant),        # reliable > exciting
            'weekday_hours': has_lunch_hours(restaurant),
        }
        weights = [0.30, 0.25, 0.15, 0.20, 0.10]

    elif purpose_key == 'date_night':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'date_night'),
            'atmosphere': restaurant.atmosphere_score / 5,
            'uniqueness': cuisine_uniqueness_score(restaurant),
            'romantic_keywords': review_keyword_match(restaurant, ['cozy', 'romantic', 'intimate', 'ambiance']),
            'evening_hours': has_dinner_hours(restaurant),
        }
        weights = [0.20, 0.30, 0.15, 0.25, 0.10]

    elif purpose_key == 'family_dinner':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'family_dinner'),
            'kid_friendly': review_keyword_match(restaurant, ['kids', 'family', 'children', 'high chair', 'space']),
            'portion_size': restaurant.portion_score / 5,
            'menu_variety': menu_variety_score(restaurant),
            'noise_tolerance': not_quiet_fine_dining(restaurant),
        }
        weights = [0.25, 0.30, 0.15, 0.15, 0.15]

    elif purpose_key == 'late_night':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'late_night'),
            'late_hours': open_after_10pm(restaurant),
            'comfort_food': review_keyword_match(restaurant, ['comfort', 'satisfying', 'filling', 'hearty']),
            'quick_service': estimate_meal_speed(restaurant),
        }
        weights = [0.25, 0.35, 0.25, 0.15]

    elif purpose_key == 'healthy_budget':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'healthy_budget'),
            'nutrition': restaurant.nutrition_score / 5,
            'healthy_options': menu_healthy_ratio(restaurant),
            'dietary_labels': has_dietary_labels(restaurant),
        }
        weights = [0.25, 0.30, 0.25, 0.20]

    elif purpose_key == 'solo_dining':
        scores = {
            'price_fit': price_in_bracket(restaurant, 'solo_dining'),
            'solo_friendly': review_keyword_match(restaurant, ['alone', 'solo', 'counter', 'bar seating', 'no minimum']),
            'quick_service': estimate_meal_speed(restaurant),
            'no_awkward_minimums': not_requires_group(restaurant),
        }
        weights = [0.25, 0.35, 0.20, 0.20]

    elif purpose_key == 'group_party':
        scores = {
            'per_person_price': price_in_bracket(restaurant, 'group_party'),
            'group_capacity': has_large_tables(restaurant),
            'sharing_menu': has_sharing_options(restaurant),
            'festive_atmosphere': review_keyword_match(restaurant, ['fun', 'loud', 'group', 'party', 'sharing']),
        }
        weights = [0.25, 0.25, 0.25, 0.25]

    # Weighted sum
    fit_score = sum(s * w for s, w in zip(scores.values(), weights))
    return round(min(1.0, fit_score), 2)
```

### 9.3 Price Bracket Auto-Adjustment

```python
# Quarterly job: adjust price brackets based on local CPI data
def adjust_price_brackets():
    for country in get_active_countries():
        # Get CPI change from external API (e.g., World Bank, local statistics bureau)
        cpi_change = get_cpi_food_change(country.code, period='quarter')

        for bracket in get_brackets(country.id):
            old_max = bracket.max_price
            new_max = old_max * (1 + cpi_change)

            # Round to culturally appropriate increment
            new_max = round_to_local_increment(new_max, country.code)
            # US: round to nearest $1, Japan: nearest ¥100, Korea: nearest ₩1000

            if abs(new_max - old_max) / old_max > 0.02:  # only update if > 2% change
                bracket.max_price = new_max
                bracket.last_adjusted = now()
                bracket.save()

                # Notify affected users
                notify_bracket_change(country, bracket, old_max, new_max)
```

### 9.4 Restaurant Quality Gate

From 거지맵's concept: not every cheap restaurant deserves to be listed.

```python
def passes_quality_gate(restaurant):
    """
    Restaurant must pass these checks to appear in ValueBite:
    """
    checks = []

    # 1. Price must be within at least one purpose bracket
    fits_any_bracket = any(
        restaurant.avg_meal_price <= bracket.max_price
        for bracket in get_brackets(restaurant.country_id)
    )
    checks.append(fits_any_bracket)

    # 2. Nutrition quality (from 거지맵: penalize carb-only above threshold)
    if restaurant.avg_meal_price > get_bracket(restaurant.country_id, 'daily_eats').max_price * 0.7:
        # If it's not super cheap, it needs to have nutritional value
        checks.append(restaurant.nutrition_score >= 2.0)
    else:
        checks.append(True)  # Very cheap places get a pass on nutrition

    # 3. Minimum community validation
    if restaurant.source == 'user':
        checks.append(True)  # User-submitted always shows (community self-curates)
    else:
        # Auto-imported restaurants need at least 1 "worth it" vote
        checks.append(restaurant.total_reviews >= 1 or restaurant.source in ['google_places', 'yelp'])

    # 4. Not flagged or inactive
    checks.append(restaurant.is_active and not restaurant.is_flagged)

    # 5. Has some price data
    checks.append(restaurant.avg_meal_price is not None and restaurant.avg_meal_price > 0)

    return all(checks)
```

### 9.5 Data Freshness System

```python
# Freshness tiers for displayed data
def get_freshness_indicator(restaurant):
    days_since_update = (now() - restaurant.price_last_verified).days

    if days_since_update <= 30:
        return {"label": "Recently Verified", "color": "green", "icon": "✓"}
    elif days_since_update <= 90:
        return {"label": "Verified 1-3 months ago", "color": "yellow", "icon": "~"}
    elif days_since_update <= 180:
        return {"label": "May be outdated", "color": "orange", "icon": "⚠"}
    else:
        return {"label": "Unverified — help us update!", "color": "red", "icon": "❓",
                "cta": "Upload current menu photo"}
```

---

## 10. MONETIZATION & AD SYSTEM

### 10.1 Ad Strategy — Instagram-Style Native Ads

The primary monetization: native ads that blend into the restaurant feed, powered by Google AdMob and Meta Audience Network.

```
Feed Layout Example:
┌─────────────────────────────┐
│ 1. Restaurant Card          │  ← organic result
│ 2. Restaurant Card          │  ← organic result
│ 3. Restaurant Card          │  ← organic result
│ 4. ▸ Sponsored Content ◂    │  ← NATIVE AD (Google/Meta)
│    Looks like a restaurant  │     styled exactly like a restaurant card
│    card but marked "Ad"     │     but with "Sponsored" label
│ 5. Restaurant Card          │  ← organic result
│ 6. Restaurant Card          │  ← organic result
│ 7. Restaurant Card          │  ← organic result
│ 8. ▸ Promoted Listing ◂     │  ← RESTAURANT PROMOTED LISTING
│    "⭐ Featured" badge      │     paid by restaurant owner
│ 9. Restaurant Card          │  ← organic result
│ ...                         │
└─────────────────────────────┘
```

### 10.2 Ad Implementation

```typescript
// Ad placement configuration
const AD_CONFIG = {
  // Native feed ads (Google AdMob / Meta Audience Network)
  native_feed: {
    frequency: 5,           // show ad every 5th item in feed
    first_ad_position: 4,   // first ad after 4 organic results
    max_ads_per_session: 10,
    providers: ['google_admob', 'meta_audience_network'],
    format: 'native',       // blends with feed
    targeting: {
      interests: ['food', 'restaurants', 'dining', 'budget', 'cooking'],
      demographics: { age_range: '18-45' },
      geo: 'user_city',
    }
  },
  // Banner ads (bottom of restaurant detail page)
  detail_banner: {
    placement: 'restaurant_detail_bottom',
    format: 'banner_320x50',
    frequency: 'every_page',
    providers: ['google_admob'],
  },
  // Rewarded ads (watch ad → unlock premium feature temporarily)
  rewarded: {
    trigger: 'premium_feature_access',  // e.g., "Watch ad to see AI recommendation"
    reward: 'temp_premium_24h',
    providers: ['google_admob'],
  }
};

// Native Ad Component (Instagram-style)
const NativeAdCard = ({ ad }) => (
  <View style={styles.restaurantCard}>  {/* Same styling as restaurant cards */}
    <Text style={styles.sponsoredLabel}>Sponsored</Text>
    <Image source={{ uri: ad.image }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{ad.headline}</Text>
    <Text style={styles.cardSubtitle}>{ad.body}</Text>
    <TouchableOpacity onPress={() => handleAdClick(ad)}>
      <Text style={styles.ctaButton}>{ad.callToAction}</Text>
    </TouchableOpacity>
  </View>
);
```

### 10.3 Revenue Streams Breakdown

```
TARGET: Break-even at 10K MAU

Revenue Sources (estimated at 10K MAU):

1. Native Feed Ads (Google AdMob + Meta Audience Network)
   - 3,000 DAU × 2 sessions × 4 ads = 24K impressions/day
   - 720K impressions/month
   - eCPM: $8-12 (food vertical, geo-targeted)
   - Revenue: $5,760 - $8,640/month

2. Restaurant Promoted Listings
   - Target: 20-30 paying restaurants
   - Price: $30-50/month (affordable for small restaurants)
   - Revenue: $600 - $1,500/month

3. Rewarded Video Ads
   - 5% of users watch 1 rewarded ad/day = 150 views/day
   - 4,500 views/month
   - eCPM: $15-25 for rewarded video
   - Revenue: $67 - $112/month

TOTAL ESTIMATED REVENUE AT 10K MAU: $6,427 - $10,252/month

Monthly Costs (lean):
- Cloud hosting (Vercel + AWS):     $500 - $800
- Database (managed PostgreSQL):    $100 - $200
- Redis + Search:                   $100 - $200
- AI API costs:                     $300 - $800
- Maps API:                         $200 - $500
- CDN + Storage:                    $50  - $150
- Monitoring + Tools:               $100 - $200
- Total:                            $1,350 - $2,850/month

NET AT 10K MAU: $3,577 - $7,402/month (BEP achieved ✓)
```

### 10.4 Future Revenue (Post-BEP)

| MAU | Ad Revenue | Promoted | Premium Sub | Data | Total/month |
|-----|-----------|----------|-------------|------|-------------|
| 10K | $7K | $1K | - | - | ~$8K |
| 50K | $35K | $5K | $3K | - | ~$43K |
| 100K | $70K | $12K | $8K | $5K | ~$95K |
| 500K | $300K | $50K | $40K | $20K | ~$410K |

---

## 11. LOCALIZATION & MULTI-COUNTRY SUPPORT

### 11.1 i18n Architecture

```typescript
// Using next-intl for web, i18next for mobile
// Shared translation files in monorepo

// packages/i18n/locales/
//   en.json, ja.json, ko.json, de.json, fr.json, es.json, zh.json

// Translation structure
{
  "common": {
    "search": "Search restaurants...",
    "nearby": "Nearby",
    "value_score": "Value Score",
    "was_it_worth_it": "Was it worth it?",
    "yes_worth_it": "Yes! 👍",
    "no_not_worth_it": "Not really 👎"
  },
  "purpose": {
    "daily_eats": "Daily Eats",
    "date_night": "Date Night",
    "family_dinner": "Family Dinner",
    "late_night": "Late Night Bites",
    "healthy_budget": "Healthy & Budget",
    "solo_dining": "Solo Dining",
    "group_party": "Group & Party",
    "special_occasion": "Special Occasion"
  },
  "price": {
    "under": "Under {amount}",
    "range": "{min} - {max}",
    "per_person": "/person",
    "prices_verified": "Prices verified {date}",
    "prices_may_changed": "Prices may have changed since {date}"
  },
  "budget": {
    "monthly_spent": "Spent this month",
    "remaining": "{amount} remaining",
    "saved": "You saved {amount} vs. average!"
  }
}
```

### 11.2 Currency & Price Display

```typescript
// Utility for locale-aware price formatting
function formatPrice(amount: number, countryCode: string): string {
  const config = COUNTRY_CONFIG[countryCode];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currencyCode,
    minimumFractionDigits: config.currencyCode === 'JPY' || config.currencyCode === 'KRW' ? 0 : 2,
    maximumFractionDigits: config.currencyCode === 'JPY' || config.currencyCode === 'KRW' ? 0 : 2,
  }).format(amount);
}

// Examples:
// formatPrice(8.50, 'US')  → "$8.50"
// formatPrice(980, 'JP')   → "¥980"
// formatPrice(7000, 'KR')  → "₩7,000"
// formatPrice(7.50, 'GB')  → "£7.50"
// formatPrice(8.00, 'DE')  → "8,00 €"
```

### 11.3 Map Provider by Region

```typescript
const MAP_CONFIG = {
  default: 'mapbox',  // Global default
  overrides: {
    JP: 'mapbox',     // Mapbox has good Japan coverage
    KR: 'kakao',      // Kakao Maps is superior in Korea (optional)
    CN: 'amap',       // If expanding to China, Amap/Gaode required
  }
};
```

---

## 12. DATA BOOTSTRAPPING STRATEGY

### 12.1 Phase 1: Automated Seeding (Pre-Launch)

```python
# For each target city, run this pipeline:

async def bootstrap_city(city_id, country_code):
    """Seed restaurant data from multiple sources before user launch."""

    # Step 1: Google Places API — bulk fetch budget restaurants
    restaurants = await google_places.nearby_search(
        location=city.center,
        radius=city.radius_km * 1000,
        type='restaurant',
        max_price=2,  # Google's "inexpensive" + "moderate" levels
    )

    for place in restaurants:
        # Get detailed info
        detail = await google_places.get_details(place.place_id)

        # Step 2: Attempt to extract menu from website
        if detail.website:
            menu_data = await ai_extract_menu_from_website(detail.website)

        # Step 3: Use Google Places photos as initial images
        photos = await google_places.get_photos(place.place_id, max=5)

        # Step 4: Analyze Google reviews with AI
        if detail.reviews:
            ai_analysis = await analyze_reviews_batch(detail.reviews)

        # Step 5: Create restaurant record
        await create_restaurant(
            name=detail.name,
            location=detail.geometry.location,
            avg_price=estimate_price_from_level(detail.price_level, country_code),
            source='google_places',
            external_ids={'google_place_id': place.place_id},
            ai_scores=ai_analysis,
        )

    # Step 6: Supplement with Yelp Fusion API (US/Europe markets)
    if country_code in ['US', 'GB', 'DE', 'FR']:
        yelp_restaurants = await yelp.search(
            location=city.name_en,
            price='1,2',  # $ and $$
            sort_by='rating',
            limit=200,
        )
        # Merge with existing, deduplicate by location proximity

    # Step 7: For Japan specifically — Tabelog data (if API available)
    if country_code == 'JP':
        # Tabelog is the gold standard for Japanese restaurant reviews
        # May need to scrape public data or partner
        pass

    logger.info(f"Bootstrapped {city.name}: {count} restaurants seeded")
```

### 12.2 Phase 2: Community Growth Engine

```
Contribution Rewards System:

Action                          Points    Badge
─────────────────────────────────────────────────
First restaurant suggestion     50        🏪 Trailblazer
Upload menu photo               30        📸 Menu Scout
Write a review                  20        ✍️  Reviewer
Quick "worth it" rating         5         👍 Quick Rater
Verify/update prices            25        ✅ Price Checker
Post in community               10        💬 Community Member
10 reviews in one month         100       🔥 Power Reviewer
Review flagged as "most helpful"50        ⭐ Trusted Reviewer

Levels:
1-99 pts:     Newbie 🌱
100-499 pts:  Regular 🍽️
500-1999 pts: Expert 🎯
2000+ pts:    Master 👑

Perks per level:
- Regular: Custom avatar frame, priority support
- Expert: Early access to new features, "Expert" badge on reviews
- Master: Direct line to team, beta testing, annual meetup invite
```

---

## 13. DEPLOYMENT & INFRASTRUCTURE

### 13.1 Environment Setup

```yaml
# Environments
development:  Local dev (Docker Compose for all services)
staging:      mirrors production, auto-deploy from `develop` branch
production:   auto-deploy from `main` branch (with approval gate)

# Vercel (Web Frontend)
- Framework: Next.js
- Regions: iad1 (US East), nrt1 (Tokyo), lhr1 (London)
- Edge Functions for geo-routing

# AWS (Backend Services)
- Region: ap-northeast-1 (Tokyo primary), us-east-1 (US fallback)
- ECS Fargate for API services
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis
- S3 for static assets
- CloudFront CDN

# Mobile
- iOS: TestFlight → App Store
- Android: Google Play Internal Testing → Production
- Expo EAS Build + EAS Submit for CI/CD
```

### 13.2 Docker Compose (Development)

```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: valuebite
      POSTGRES_USER: valuebite
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  meilisearch:
    image: getmeili/meilisearch:v1.8
    environment:
      MEILI_MASTER_KEY: dev_master_key
    ports:
      - "7700:7700"
    volumes:
      - meilidata:/meili_data

  api:
    build: ./apps/api
    depends_on: [postgres, redis, meilisearch]
    environment:
      DATABASE_URL: postgresql://valuebite:dev_password@postgres:5432/valuebite
      REDIS_URL: redis://redis:6379
      MEILI_URL: http://meilisearch:7700
      MEILI_KEY: dev_master_key
    ports:
      - "4000:4000"
    volumes:
      - ./apps/api:/app
      - /app/node_modules

  web:
    build: ./apps/web
    depends_on: [api]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app
      - /app/node_modules

  worker:
    build: ./apps/worker
    depends_on: [postgres, redis]
    environment:
      DATABASE_URL: postgresql://valuebite:dev_password@postgres:5432/valuebite
      REDIS_URL: redis://redis:6379
    volumes:
      - ./apps/worker:/app
      - /app/node_modules

volumes:
  pgdata:
  meilidata:
```

### 13.3 Monorepo Structure

```
valuebite/
├── apps/
│   ├── web/                    ← Next.js web app
│   │   ├── app/
│   │   ├── components/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   ├── mobile/                 ← React Native (Expo) app
│   │   ├── app/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── app.json
│   │   └── package.json
│   ├── api/                    ← Fastify backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   ├── jobs/          ← BullMQ job processors
│   │   │   ├── ai/            ← AI pipeline handlers
│   │   │   └── index.ts
│   │   └── package.json
│   ├── worker/                 ← Background job processor
│   │   ├── src/
│   │   │   ├── jobs/
│   │   │   │   ├── menuPhotoAnalysis.ts
│   │   │   │   ├── reviewAnalysis.ts
│   │   │   │   ├── priceMonitoring.ts
│   │   │   │   ├── dataIngestion.ts
│   │   │   │   └── bracketAdjustment.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── admin/                  ← Admin dashboard (internal)
│       └── ...
├── packages/
│   ├── ui/                     ← Shared UI components
│   ├── types/                  ← Shared TypeScript types
│   ├── utils/                  ← Shared utilities
│   ├── i18n/                   ← Translations
│   ├── config/                 ← Shared configs (eslint, tsconfig, etc.)
│   └── db/                     ← Drizzle schema & migrations
├── docker-compose.yml
├── turbo.json
├── package.json
└── README.md
```

---

## 14. SECURITY & PRIVACY

### 14.1 Authentication & Authorization

- JWT-based auth with short-lived access tokens (15 min) + refresh tokens (30 days)
- Social login via OAuth 2.0 (Google, Apple, Kakao)
- Rate limiting: 100 req/min for authenticated users, 20 req/min for anonymous
- API keys for restaurant business accounts (promoted listings)

### 14.2 Data Privacy (GDPR, CCPA, APPI Compliant)

- User data deletion on request (right to be forgotten)
- Location data: never stored permanently. Used for real-time queries only, unless user explicitly opts into visit tracking.
- Reviews: anonymizable on account deletion
- Analytics: use privacy-friendly PostHog with data residency options
- Cookie consent: minimal cookies, no third-party tracking beyond ad SDKs

### 14.3 Content Moderation

- AI-powered review moderation (spam, hate speech, fake reviews)
- Community reporting system with 3-strike rule
- Menu photo moderation (block inappropriate images)
- Restaurant owners can flag incorrect information for review

---

## 15. DEVELOPMENT PHASES & MILESTONES

### Phase 1: Foundation (Weeks 1-6)

```
Week 1-2: Project Setup
  □ Monorepo initialization (Turborepo)
  □ Database schema + migrations (Drizzle)
  □ Basic Fastify API with health check
  □ Next.js web app skeleton
  □ React Native (Expo) app skeleton
  □ Docker Compose for local dev
  □ CI/CD pipeline (GitHub Actions)

Week 3-4: Core Backend
  □ User auth (social + email)
  □ Restaurant CRUD with PostGIS geospatial queries
  □ Menu items CRUD
  □ Search with Meilisearch integration
  □ Image upload to S3
  □ Price bracket configuration per country

Week 5-6: Core Frontend (Web)
  □ Map view with restaurant markers (Mapbox)
  □ Restaurant list view (bottom sheet over map)
  □ Restaurant detail page
  □ Search functionality
  □ Purpose-based filtering
  □ Basic responsive design
```

### Phase 2: AI & Data (Weeks 7-10)

```
Week 7-8: AI Pipeline
  □ Menu photo upload + AI extraction (Claude Vision)
  □ Review sentiment analysis pipeline
  □ Restaurant AI summary generation
  □ Value Score calculation engine
  □ Purpose fit scoring

Week 9-10: Data Bootstrapping
  □ Google Places API integration
  □ Yelp Fusion API integration (US/EU)
  □ Automated data ingestion pipeline
  □ Tokyo city data seed (Phase 1 city)
  □ Data quality validation & deduplication
```

### Phase 3: User Features (Weeks 11-14)

```
Week 11-12: Reviews & Community
  □ Quick "Was it worth it?" rating
  □ Detailed review form
  □ Review display with AI summaries
  □ Community feed (tips, deals)
  □ User profile + contribution points
  □ Favorites & custom lists

Week 13-14: Budget & Alerts
  □ Monthly budget tracker
  □ Dining expense logging
  □ Price alert system
  □ Push notifications (Firebase)
  □ Email notifications
```

### Phase 4: Mobile & Monetization (Weeks 15-18)

```
Week 15-16: Mobile App
  □ React Native app — all core features
  □ Camera menu scanner
  □ Geofence-based visit detection
  □ Push notifications
  □ Onboarding flow
  □ Offline map caching

Week 17-18: Ads & Revenue
  □ Google AdMob integration (native + banner + rewarded)
  □ Meta Audience Network integration
  □ Native ad cards in feed (Instagram-style)
  □ Restaurant promoted listings system
  □ Business owner portal (claim + promote)
  □ Ad analytics dashboard
```

### Phase 5: Polish & Launch (Weeks 19-22)

```
Week 19-20: Testing & Optimization
  □ Performance optimization (Core Web Vitals)
  □ Load testing (target: 200ms p95 for nearby search)
  □ Security audit
  □ Accessibility audit (WCAG 2.1 AA)
  □ i18n review for Japanese (Phase 1 market)
  □ Edge case testing

Week 21-22: Launch Prep
  □ App Store + Google Play submissions
  □ Landing page + marketing site
  □ Social media accounts setup
  □ Press/media kit
  □ Tokyo beta launch (invite-only → public)
  □ Analytics + monitoring dashboards
```

### Phase 6: Growth (Weeks 23+)

```
  □ Student ambassador program
  □ NYC + London data seeding
  □ Multi-city expansion
  □ Premium subscription features
  □ Restaurant partnership program
  □ Widget development (iOS + Android)
  □ Apple Watch complication
```

---

## 16. ADDITIONAL IMPROVEMENTS & RECOMMENDATIONS

### 16.1 Features Not Yet Mentioned (High Priority)

1. **"Meal Planner" Mode**
   - Users set weekly dining budget → app suggests a mix of restaurants for the week that stays within budget
   - "Monday: Matsuya ¥450, Tuesday: Home cooking (recipe link), Wednesday: Ramen Jiro ¥780..."
   - This drives daily engagement and is a strong retention feature

2. **"Price Drop" Alerts (like Camelcamelcamel for restaurants)**
   - Track menu prices over time
   - Notify when a favorite restaurant adds a new cheaper option or drops prices
   - Historical price chart on restaurant detail page

3. **"Lunch Lottery" / Random Pick**
   - "I can't decide" button → spins wheel of nearby value restaurants within budget
   - Fun, shareable, drives engagement
   - Sponsored spins (restaurant pays to be in the wheel)

4. **Group Dining Bill Optimizer**
   - Group selects a restaurant → each person picks items → real-time bill total per person
   - "Your share: $8.50" — useful for groups splitting checks
   - Suggests cheaper alternatives if group total exceeds budget

5. **"Cook vs. Eat Out" Calculator**
   - For a given meal, show: restaurant cost vs. estimated grocery cost to cook at home
   - Links to grocery deals if cooking is cheaper
   - Validates eating out when restaurant is actually good value

6. **Seasonal/Event-Based Recommendations**
   - "Cherry blossom viewing spots with cheap food nearby" (Japan spring)
   - "Best cheap Super Bowl watch parties" (US)
   - "Christmas market food value guide" (Europe)
   - Drives seasonal traffic spikes

7. **Restaurant "Value Trend" Indicator**
   - ↗️ "Getting more expensive" vs ↘️ "Better value recently" vs ➡️ "Stable"
   - Based on price history and recent review sentiment

8. **Accessibility Dining Filter**
   - Wheelchair accessible, allergen-safe, halal/kosher certified
   - Important for inclusivity and underserved user segments

### 16.2 Features Not Yet Mentioned (Medium Priority)

9. **Social Features — "Eat Together"**
   - Find other ValueBite users who want to split a meal deal or share group discounts
   - Optional, privacy-first matchmaking for solo diners
   - Increases community stickiness

10. **Restaurant Owner Dashboard**
    - Free analytics: "X people viewed your listing, Y visited, Z rated"
    - Upsell promoted listings: "Boost views by 5x for $40/month"
    - Menu management: update prices, add specials
    - This builds B2B relationships early

11. **Walking Route Optimization**
    - "I have 30 minutes for lunch and want to walk < 500m"
    - Shows time-to-arrive alongside restaurant results
    - Integrates with transit APIs for "reachable by subway in 15 min"

12. **Photo-First Review**
    - Some users hate writing. Let them just upload a food photo + price paid.
    - AI generates the "review" from the photo: "Large katsu curry, golden brown, generous portion"
    - Lowest-friction contribution method

13. **Comparison Mode**
    - Side-by-side compare 2-3 restaurants: price, value score, reviews, menu highlights
    - Useful for "should I go here or there?"

14. **Weekly Value Report (Push/Email)**
    - Every Monday: "Top 5 new value finds near you this week"
    - Personalized, drives re-engagement
    - Includes spending summary from last week

### 16.3 Technical Recommendations

15. **Start with web PWA, then wrap with Capacitor/Expo**
    - Faster initial development: one codebase
    - PWA installable on both iOS and Android home screens
    - Migrate to native when you need camera/geofence features

16. **Implement feature flags from day one (PostHog)**
    - Roll out features per country, per city, per user segment
    - A/B test ad placements, UI layouts, pricing
    - Essential for iterating fast without breaking things

17. **Build a "data quality score" for each restaurant**
    - Track: how many sources confirm this restaurant? how recent is the data? how many users verified?
    - Show low-quality listings differently (greyed out, "help us verify")
    - Incentivize contributions for low-quality restaurants specifically

18. **Implement request-level caching aggressively**
    - Restaurant nearby queries: cache for 5 min per geo hash
    - Restaurant detail: cache for 1 hour, invalidate on new review
    - Map clusters: cache for 10 min per zoom level + bounds
    - Target: 80% cache hit rate → massive cost savings

19. **Plan for Right-to-Left (RTL) languages from the start**
    - If expanding to Arabic/Hebrew markets later
    - CSS logical properties, i18n framework with RTL support
    - Much cheaper to plan for than to retrofit

20. **Set up synthetic monitoring**
    - Automated tests that run every 5 min: search nearby, view restaurant, load map
    - Alert if response time > 500ms or error rate > 1%
    - Catch performance regressions before users notice

### 16.4 Business & Growth Recommendations

21. **Launch with a waitlist, not open access**
    - Creates urgency, controls data quality in early phase
    - "Join 2,847 people waiting for ValueBite in Tokyo"
    - Early users get "Founding Member" badge (lifetime)

22. **Micro-influencer strategy over traditional marketing**
    - Partner with "budget food" YouTubers/TikTokers/Instagrammers
    - Provide them early access + custom branded map view
    - Cost: free product access, not cash — budget-friendly marketing for a budget app

23. **Consider a Telegram/LINE bot as a lightweight entry point**
    - "Send me your location → I'll find 3 value restaurants nearby"
    - No install required, viral in messaging groups
    - Drives traffic to the full app

24. **Open API for third-party developers**
    - Let bloggers, travel sites, and apps embed ValueBite data
    - "Powered by ValueBite" attribution → brand awareness
    - Monetize API access for commercial use

25. **Local government partnerships**
    - Some cities promote affordable dining as part of tourism or welfare programs
    - Partner for official "affordable dining guide" status
    - Grants + PR value

---

## APPENDIX: ENVIRONMENT VARIABLES

```env
# .env.example

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/valuebite

# Redis
REDIS_URL=redis://localhost:6379

# Search
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_KEY=your_master_key

# Auth
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id

# Maps
MAPBOX_ACCESS_TOKEN=your_mapbox_token
GOOGLE_MAPS_API_KEY=your_google_maps_key

# AI
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# External Data
GOOGLE_PLACES_API_KEY=your_places_key
YELP_FUSION_API_KEY=your_yelp_key

# Ads
GOOGLE_ADMOB_APP_ID=your_admob_id
GOOGLE_ADMOB_NATIVE_UNIT_ID=your_native_unit_id
GOOGLE_ADMOB_BANNER_UNIT_ID=your_banner_unit_id
GOOGLE_ADMOB_REWARDED_UNIT_ID=your_rewarded_unit_id
META_AUDIENCE_NETWORK_APP_ID=your_meta_id
META_AUDIENCE_NATIVE_PLACEMENT_ID=your_placement_id

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=valuebite-uploads
AWS_REGION=ap-northeast-1

# Notifications
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_PRIVATE_KEY=your_firebase_key

# Analytics
POSTHOG_API_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn

# Payments (for premium subscription & restaurant payments)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## APPENDIX: KEY METRICS TO TRACK

```
Acquisition:
  - Daily new signups (by source: organic, social, referral, ad)
  - Waitlist conversion rate
  - App store ranking + reviews

Engagement:
  - DAU / MAU ratio (target: 30%+)
  - Sessions per user per day
  - Map views / searches per session
  - Restaurant detail page views
  - Average session duration

Contribution:
  - Reviews per day
  - Menu photos uploaded per day
  - "Was it worth it?" taps per day
  - Community posts per day
  - New restaurant suggestions per day

Retention:
  - D1, D7, D30 retention rates
  - Weekly active user trend
  - Churn rate by cohort

Revenue:
  - Ad revenue per MAU (ARPMAU)
  - Ad fill rate + eCPM by placement
  - Promoted listing revenue
  - Premium subscription conversions
  - Revenue per restaurant-owner account

Data Quality:
  - % of restaurants with verified prices (<30 days)
  - % of restaurants with 3+ reviews
  - % of restaurants with menu data
  - Average data age per city
```

---

*This master prompt is designed to be self-contained. Any developer or AI agent should be able to read this document and understand the full scope of ValueBite, then begin implementation from any section.*
