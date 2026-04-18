# ValueBite Monetization Guide

**Current strategy** (v1, no sales effort needed): **Google AdSense only**.
**Future options** (v2, when traffic justifies effort): in-house promoted listings + delivery affiliate links — code is built and dormant, just need activation.

---

## 🎯 v1 Strategy: AdSense-Only (현재)

### Why AdSense-only for now?
- ✅ **Zero sales effort** — Google fills slots automatically
- ✅ **Zero ongoing maintenance** — set once, runs forever
- ✅ **Pays from day one** of approval
- ❌ Lower CPM ($1-3) than direct deals

### Where ads appear (natural placements)

| Location | Format | Frequency |
|----------|--------|-----------|
| Home feed (list view) | In-feed Native | 1 ad per 6 restaurants (positions 4, 10, 16) |
| Map view bottom sheet | In-feed Native | Same as home feed |
| Restaurant detail bottom | Auto Display | 1, after all content |

**No popups, no interstitials, no autoplay video.** Ad slots collapse to nothing if no ad available, so the UX never feels broken.

### Code is ready — what's deployed

✅ `<GoogleAdSlot>` component:
- Auto-loads AdSense script in `<head>` when `NEXT_PUBLIC_ADSENSE_CLIENT_ID` env var is set
- Renders nothing when env var is empty (current state — no AdSense account yet)
- Supports formats: `auto`, `fluid`, `rectangle`

✅ Home page (`apps/web/src/app/page.tsx`):
- Weaves ad slots at positions 4, 10, 16 in the restaurant feed
- Uses 3 distinct slot IDs (Google's targeting works better with separate slots)

✅ Restaurant detail page:
- Single ad slot at the bottom, after the Contribute section

✅ `apps/web/public/ads.txt` placeholder
✅ AdSense compliance: privacy policy linked, original content, no encourage-to-click

### Jay's manual steps (one-time)

**Step 1 — Apply for AdSense (1-2 weeks approval)**
1. Go to https://www.google.com/adsense
2. Sign up with the same Google account as Play Console (recommended)
3. Add site: `truevaluebite.com`
4. Wait for approval email

**Tip**: AdSense approval rate is much higher when site has:
- 100+ daily visitors (so wait until launched + some traffic)
- 30+ pieces of original content (we have 6,000+ restaurants ✅)
- Privacy policy (✅ we have at /privacy)
- Site is HTTPS (✅ Vercel)

**Step 2 — After approval (5 minutes)**

a. **Get your Publisher ID** from AdSense dashboard. Looks like: `ca-pub-1234567890123456`

b. **Update `apps/web/public/ads.txt`** (replace placeholder):
   ```
   google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
   ```

c. **Add Vercel env var**:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
   ```
   In Vercel Dashboard → Project Settings → Environment Variables → Production

d. **Create ad units in AdSense dashboard**:
   - Type: "In-feed ads" (for home feed) — get 3 slot IDs
   - Type: "Display ads" → "Auto" (for restaurant detail bottom) — get 1 slot ID

e. **Update slot IDs** in code:
   - `apps/web/src/app/page.tsx` line ~14: replace `['feed-ad-1', 'feed-ad-2', 'feed-ad-3']` with your 3 In-feed slot IDs
   - `apps/web/src/app/restaurant/[id]/page.tsx`: replace `slotId="detail-bottom"` with your Display slot ID

f. **Redeploy**: `vercel --prod`

That's it. Ads start appearing within minutes.

### Expected revenue (AdSense alone)

Conservative estimate:

| Daily Active Users | Page views/day | Ad revenue/day | Monthly |
|---|---|---|---|
| 100 | 500 | $0.50 | $15 |
| 1,000 | 5,000 | $5 | $150 |
| 10,000 | 50,000 | $50 | **$1,500** |
| 50,000 | 250,000 | $250 | **$7,500** |

(Assumes ~$1 CPM blended — typical for food/lifestyle apps in tier-1 countries)

---

## 🚀 v2 Strategy: Activate later when traffic justifies (미래 옵션)

When you have 10K+ MAU and time for sales/operations, you can activate higher-revenue tiers.

### Option A: In-house Promoted Restaurants (5-20× higher CPM than AdSense)

**Status**: ✅ Code 100% built, just dormant.

What's already in the codebase:
- DB tables: `promoted_listings`, `promoted_daily_stats`
- API: `GET /api/sponsored?city=X&purpose=Y`, `POST /api/sponsored` (click tracking)
- Targeting: city + purpose + cuisine
- Budget enforcement (daily + total)
- Bid types (CPM + CPC)

To activate: edit home page to call `/api/sponsored` and inject results as `<RestaurantCard isSponsored />` instead of `<GoogleAdSlot>`. (This was the previous design — see git history `1cd306a`.)

Pricing strategy when ready:
- **Bronze** ($30/mo): citywide targeting, 1000 imps/day
- **Silver** ($75/mo): purpose-targeted, 3000 imps/day
- **Gold** ($200/mo): top 5 placement guaranteed, unlimited

### Option B: Affiliate Delivery Links

**Status**: ✅ Code 100% built, hidden until env vars set.

`<DeliveryLinks>` component on restaurant detail page automatically appears when ANY of these env vars are set:
```
NEXT_PUBLIC_AFFILIATE_DOORDASH_ID=...
NEXT_PUBLIC_AFFILIATE_UBEREATS_ID=...
NEXT_PUBLIC_AFFILIATE_GRUBHUB_ID=...
```

Programs to apply for (each 1-2 weeks approval):
| Service | Link | Commission | Coverage |
|---------|------|------------|----------|
| DoorDash | https://www.doordash.com/affiliates | ~10% first order | US/CA/AU/NZ |
| Uber Eats | Via Impact.com | ~$5/first order | Global |
| Grubhub | Via Impact.com | ~$10/new user | US |
| Wolt | https://wolt.com/partner-program | Varies | EU + Nordic |
| Foodpanda | Via Awin/Impact | Varies | SE Asia |

---

## 📋 Current state (now)

```
Tier 1 (in-house promoted): code built, DB schema ready, NOT activated (no ads serving from here)
Tier 2 (Google AdSense):    code built, slots placed, NOT activated (waiting for AdSense account)
Tier 3 (affiliate delivery): code built, hidden, NOT activated (waiting for affiliate accounts)
```

**Effective state**: ZERO ads showing. App is 100% clean.

**Once Jay sets `NEXT_PUBLIC_ADSENSE_CLIENT_ID`**: AdSense ads start appearing automatically in the slots.

This is by design — clean app for launch, monetization activates with one env var change.

---

## 🛡️ Compliance

- **AdSense policies**: ✅ no own-clicks, no incentivized clicks, no popunders
- **GDPR**: AdSense handles consent automatically via Funding Choices (set up in AdSense dashboard)
- **Play Store policy**: Update PLAY_CONSOLE_ANSWERS.md "Ads" section from "No" to "Yes" once activated
- **FTC native ad disclosure**: Not currently needed (AdSense ads have built-in "Ad" label). Will need "Sponsored" label if/when in-house promoted activates.
