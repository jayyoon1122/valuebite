# ValueBite Monetization Guide

3-tier strategy: **In-house promoted restaurants** (main) + **Google AdSense** (fill) + **Affiliate delivery links** (bonus).

---

## 💰 Revenue Projection (Realistic)

Assuming **10K MAU after 3 months**:

| Source | Method | Revenue/month |
|--------|--------|--------------|
| In-house promoted | 50 restaurants × $50/mo avg | **$2,500** |
| AdSense fill | 100K impressions × $2 CPM | **$200** |
| Affiliate (delivery) | 1% of users order, 10% commission, $20 avg | **$2,000** |
| **Total** | | **~$4,700/mo** |

At 100K MAU (year 1 target): roughly **$30-50K/month**.

---

## Tier 1: In-House Promoted Restaurants (메인 수익원)

### How it works
Restaurants pay to appear higher in search results / feed. Cards look 100% identical to organic results — only differentiator is a tiny "Sponsored" tag below the cuisine type. Like Yelp's promoted businesses.

### Already built (code-side)
- ✅ DB schema: `promoted_listings` + `promoted_daily_stats` tables
- ✅ API: `GET /api/sponsored?city=X&purpose=Y` returns best matching listing
- ✅ API: `POST /api/sponsored` records click events
- ✅ Component: `RestaurantCard` accepts `isSponsored` prop, looks identical to organic
- ✅ Home page: weaves 3 sponsored cards into feed at positions 4, 10, 16
- ✅ Targeting: by city, purpose (date_night/daily_eats/etc.), cuisine
- ✅ Budget control: daily_budget + total_budget enforced
- ✅ Bid types: CPM (per impression) + CPC (per click)

### What Jay needs to do

**Phase 1 — Run SQL migration (1 minute)**
```
Supabase SQL Editor → paste contents of:
packages/db/migrations/20260418_promoted_listings.sql
```

**Phase 2 — Create admin UI for selling promotions** (post-launch, when traffic justifies)
Future: a `/admin/promoted` page where you (or restaurants) can:
- Pick a restaurant
- Set bid + budget
- Choose targeting
- See impressions/clicks

For v1: insert promoted_listings rows manually via SQL Editor.

**Phase 3 — Sales (post-launch)**
Pricing strategy:
- **Bronze**: $30/mo, citywide targeting, 1000 imps/day
- **Silver**: $75/mo, purpose-targeted, 3000 imps/day
- **Gold**: $200/mo, top 5 placement guaranteed, unlimited

Sales pitch: "Top of search results in [city] for [purpose] — 100% native look, no ad-blocker affects us."

### Manual: How to add a promoted listing right now

Run in Supabase SQL Editor:
```sql
INSERT INTO promoted_listings (
  restaurant_id, campaign_name,
  bid_per_impression, daily_budget, total_budget,
  target_cities, target_purposes
) VALUES (
  '<restaurant-uuid>',          -- get from restaurants table
  'Spring promo 2026',
  10.00,                         -- $10 CPM (per 1000 imps)
  5.00,                          -- $5/day max
  150.00,                        -- $150 total
  ARRAY['tokyo'],                -- city targeting
  ARRAY['daily_eats','good_value'] -- purpose targeting
);
```

---

## Tier 2: Google AdSense (보조)

### How it works
When no in-house promoted listing matches, fall back to AdSense. Used in slots like restaurant detail bottom (low-CTR positions).

### Code already done
- ✅ `<GoogleAdSlot>` component renders nothing if no client ID set
- ✅ AdSense script auto-loaded from `layout.tsx` if env var present
- ✅ `apps/web/public/ads.txt` placeholder created

### Jay's manual steps

**Step 1 — Apply (1-2 weeks approval)**
1. Visit https://www.google.com/adsense
2. Sign up with the same Google account as Play Console
3. Add site: `truevaluebite.com`
4. AdSense team reviews — typically 1-2 weeks
5. Requirements they check:
   - Site is live ✅ (we are)
   - Has original content ✅ (we have)
   - Privacy policy link ✅ (we have)
   - Some traffic (recommend waiting until 100+ daily users)

**Step 2 — After approval**
1. Get your Publisher ID: starts with `ca-pub-XXXXXXXXXXXX`
2. Update `apps/web/public/ads.txt`:
   ```
   google.com, pub-XXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
3. Add Vercel env var: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXX`
4. Create ad units in AdSense dashboard → get slot IDs
5. Add to pages where you want fill ads:
   ```tsx
   import { GoogleAdSlot } from '@/components/GoogleAdSlot';
   <GoogleAdSlot slotId="1234567890" />
   ```
6. Redeploy

**Note**: AdSense in TWA (Trusted Web Activity) is allowed. Google's policy specifically permits AdSense in TWA wrappers since they're functionally web pages.

---

## Tier 3: Affiliate Delivery Links (보너스)

### How it works
Subtle "Order online" chips on restaurant detail page link to DoorDash/Uber Eats/etc. with affiliate codes. We earn 5-10% commission per order.

### Code already done
- ✅ `<DeliveryLinks>` component shown after Get Directions on restaurant detail
- ✅ `getDeliveryLinks()` smart routing per country (DoorDash for US/CA, Uber Eats globally, Demaecan for JP, Foodpanda for SE Asia, Wolt for EU)
- ✅ Currently links work without affiliate codes (no commission yet)
- ✅ Just add affiliate IDs to env vars to start earning

### Jay's manual steps

**Step 1 — Apply for affiliate programs** (each takes a few days)

| Service | Apply | Commission | Coverage |
|---------|-------|------------|----------|
| DoorDash | https://www.doordash.com/affiliates | ~10% on first order | US, CA, AU, NZ |
| Uber Eats | Via Impact.com | ~$5 per first order | Global |
| Grubhub | Via Impact.com | ~$10 per new user | US |
| Wolt | https://wolt.com/partner-program | Varies | EU + Asia |
| Foodpanda | Via Awin.com or Impact | Varies | SE Asia |
| Demaecan (出前館) | https://demae-can.com (B2B contact) | Negotiate | JP |

**Step 2 — Add IDs to Vercel env**
```
NEXT_PUBLIC_AFFILIATE_DOORDASH_ID=your_doordash_id
NEXT_PUBLIC_AFFILIATE_UBEREATS_ID=your_ubereats_id
NEXT_PUBLIC_AFFILIATE_GRUBHUB_ID=your_grubhub_id
```

**Step 3 — Redeploy** → links automatically include affiliate parameters → earn commission.

---

## 🚀 Recommended rollout order

### Week 1 (immediate, after launch)
1. ✅ Code is ready — just deploy
2. Run `promoted_listings` SQL migration
3. Apply for AdSense + DoorDash + Uber Eats affiliates

### Month 1-2
1. Wait for AdSense approval
2. Wait for first 1K MAU
3. Once you have traction, **insert your first paid promoted listing manually** (offer free trial to 3-5 favorite local restaurants in exchange for a testimonial)

### Month 3+
1. Build admin UI for self-serve promoted listings (Stripe Connect for payments)
2. Set up automated sales emails to top-performing restaurants
3. Negotiate direct deals with delivery platforms (better commission rates than affiliate programs)

---

## 🎨 UX Principles (왜 자연스러운가)

| Principle | What we do | What other apps do (badly) |
|-----------|------------|---------------------------|
| Sponsored = relevant | Promoted restaurants are real restaurants users would actually visit | Random product banners interrupting food browsing |
| Same UI as organic | Same RestaurantCard component | Distinct ad cards screaming "I'M AN AD" |
| Frequency | 1 sponsored per 6 organic (positions 4, 10, 16) | Every 2-3 items |
| Disclosure | Tiny "Sponsored" text in cuisine row (FTC compliant) | Massive yellow "AD" banner |
| No interruption | No popups, no interstitials, no autoplay video | All the above |

---

## 📊 Analytics to track (post-launch)

Run weekly via SQL:

```sql
-- Top performing campaigns
SELECT
  pl.campaign_name,
  r.name->>'en' AS restaurant,
  pl.impressions,
  pl.clicks,
  ROUND((pl.clicks::numeric / NULLIF(pl.impressions, 0) * 100), 2) AS ctr_pct,
  pl.spent
FROM promoted_listings pl
JOIN restaurants r ON pl.restaurant_id = r.id
WHERE pl.is_active = true
ORDER BY pl.spent DESC
LIMIT 20;

-- Daily revenue
SELECT date, SUM(spent) AS daily_revenue
FROM promoted_daily_stats
WHERE date >= CURRENT_DATE - 30
GROUP BY date ORDER BY date DESC;
```

---

## 🛡️ Compliance

- **FTC native ad disclosure**: ✅ "Sponsored" label on every promoted card
- **GDPR**: ✅ no personal data sent to ad networks (we use first-party promoted_listings)
- **AdSense policy**: ✅ no clicks on own ads, no encourage-to-click
- **Play Store policy**: ✅ ads disclosed in store listing → update PLAY_CONSOLE_ANSWERS.md when activated
