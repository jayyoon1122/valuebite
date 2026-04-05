# ValueBite — Setup Guides

---

## Google Places API Key — Step-by-Step

### Step 1: Go to Google Cloud Console
1. Open https://console.cloud.google.com
2. Sign in with your Google account
3. If first time: Accept Terms of Service

### Step 2: Create a Project
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click **"New Project"** (top right of the modal)
3. Project name: `ValueBite`
4. Organization: Leave as default (or "No organization")
5. Click **"Create"**
6. Wait 10-20 seconds for project creation
7. Make sure "ValueBite" is selected as the active project

### Step 3: Enable Billing
1. Go to **Navigation Menu (☰)** → **Billing**
2. Click **"Link a billing account"**
3. If no billing account exists: Click **"Create Account"** → Enter credit card
4. Google gives $300 free credit for new accounts + Places API has $200/month free tier
5. Click **"Link"**

### Step 4: Enable Places API
1. Go to **Navigation Menu (☰)** → **APIs & Services** → **Library**
2. In the search bar, type: `Places API`
3. Click **"Places API"** (NOT "Places API (New)")
4. Click the blue **"Enable"** button
5. Wait for it to enable

### Step 5: Also Enable These APIs
Repeat the process for:
- **Maps JavaScript API** (for web map display)
- **Geocoding API** (for address lookup)
- **Places API (New)** (newer version, eventually replaces old one)

### Step 6: Create API Key
1. Go to **Navigation Menu (☰)** → **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** (top of page)
3. Select **"API key"**
4. A popup shows your API key — **copy it immediately**
5. Click **"Edit API key"** (or click the pencil icon)

### Step 7: Restrict the API Key (IMPORTANT for security)
1. Under **"Application restrictions"**: Select **"HTTP referrers (web sites)"**
2. Add your domains:
   - `https://valuebite.app/*`
   - `https://*.vercel.app/*`
   - `http://localhost:3000/*` (for development)
3. Under **"API restrictions"**: Select **"Restrict key"**
4. Check: Places API, Maps JavaScript API, Geocoding API
5. Click **"Save"**

### Step 8: Add to Your Project
Add to your `.env` file:
```
GOOGLE_PLACES_API_KEY=AIzaSy...your_key_here
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...same_key
```

### Pricing (as of 2026)
- $200/month free credit (covers ~10,000 place details requests)
- Place Details: $17 per 1,000 requests
- Place Photos: $7 per 1,000 requests
- Nearby Search: $32 per 1,000 requests
- For 10K MAU: estimated $50-100/month after free credit

---

## Google AdMob Account — Step-by-Step

### Step 1: Sign Up
1. Go to https://admob.google.com
2. Click **"Sign Up"** or **"Get Started"**
3. Sign in with your Google account (same as Cloud Console is fine)
4. Fill in:
   - Country: Your country
   - Time zone: Your time zone
   - Payment currency: USD (recommended)
5. Accept Terms & Conditions
6. Click **"Create AdMob Account"**

### Step 2: Add Your App
1. In the AdMob dashboard, click **"Apps"** in the left sidebar
2. Click **"Add App"**
3. Platform: Select **"iOS"** first
4. "Is the app listed on a supported app store?": Select **"No"** (not published yet)
5. App name: `ValueBite`
6. Click **"Add"**
7. **Copy the App ID** (format: `ca-app-pub-XXXXXXXXXX~XXXXXXXXXX`)
8. Repeat for **Android**

### Step 3: Create Ad Units

#### For Native Ads (Instagram-style feed ads):
1. Select your app → **"Ad units"** tab
2. Click **"Add ad unit"**
3. Select **"Native advanced"**
4. Ad unit name: `valuebite_feed_native`
5. Click **"Create ad unit"**
6. **Copy the Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXX/XXXXXXXXXX`)

#### For Banner Ads (restaurant detail page):
1. Click **"Add ad unit"** again
2. Select **"Banner"**
3. Ad unit name: `valuebite_detail_banner`
4. Click **"Create ad unit"**
5. Copy the Ad Unit ID

#### For Interstitial Ads (optional — between page transitions):
1. Click **"Add ad unit"**
2. Select **"Interstitial"**
3. Ad unit name: `valuebite_interstitial`
4. Click **"Create ad unit"**
5. Copy the Ad Unit ID

### Step 4: Set Up Mediation (Optional but Recommended)
1. Go to **"Mediation"** in left sidebar
2. Click **"Create mediation group"**
3. Ad format: **"Native"**
4. Platform: **"iOS"** (repeat for Android)
5. Add ad sources:
   - **Google AdMob** (default, already there)
   - **Meta Audience Network** (click "Add ad source" → "Meta Audience Network")
6. This lets Meta and Google compete for your ad inventory, maximizing revenue

### Step 5: Configure Meta Audience Network (Optional)
1. Go to https://business.facebook.com
2. Navigate to **Monetization Manager**
3. Click **"Get Started"** → Create a property for ValueBite
4. Create ad placements (Native, Banner)
5. Get your **Placement IDs**
6. Add these IDs to the AdMob mediation group from Step 4

### Step 6: Add to Your App
Add to your `.env` file:
```
ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXX~XXXXXXXX
ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXX~XXXXXXXX
ADMOB_NATIVE_AD_UNIT=ca-app-pub-XXXXXXXX/XXXXXXXX
ADMOB_BANNER_AD_UNIT=ca-app-pub-XXXXXXXX/XXXXXXXX
```

### Revenue Expectations
- Native ads CPM: $8-15 (food vertical, US market)
- Banner ads CPM: $2-5
- At 10K MAU with 4 sessions/day:
  - ~240K native impressions/month → $1,920-3,600
  - ~120K banner impressions/month → $240-600
  - **Total: ~$2,160-4,200/month**

---

## Success Recommendations for ValueBite

### Critical Success Factors

1. **Solve Cold Start with Google Data**
   - Don't wait for user-generated content
   - Import restaurant data from Google Places API for every launch city on day 1
   - Use Google reviews as the primary review source
   - Generate AI summaries from Google reviews automatically
   - Users should NEVER see an empty city

2. **Focus on ONE City First**
   - Tokyo is your best launch city (strong budget dining culture)
   - Get to 1,000 daily active users in Tokyo before expanding
   - Quality of data in one city > breadth of many empty cities

3. **Viral Loop: "I saved ¥X"**
   - After users log expenses, show "You saved ¥X,XXX this month vs. average"
   - Make this shareable on social media (Instagram Stories, Twitter/X)
   - This is your #1 organic growth mechanism

4. **Student Ambassador Program**
   - Budget dining is MOST relevant to university students
   - Partner with 5-10 universities in each launch city
   - Student ambassadors contribute restaurant data + spread the app
   - Offer "Founding Member" badges for early contributors

5. **Don't Compete with Google Maps**
   - Google Maps has ALL restaurants. You can't win on coverage.
   - Win on CURATION — only show restaurants that are actually good value
   - Your value is the Value Score + Purpose categories + Budget tracker
   - Think of it as "Spotify for restaurants" — curated playlists, not a raw database

6. **Monetization Timing**
   - 0-10K MAU: AdMob native ads only (current setup)
   - 10K-50K MAU: Add Meta Audience Network for higher CPMs
   - 50K-100K MAU: Introduce restaurant promoted listings
   - 100K+ MAU: Data licensing, premium features, brand partnerships

7. **Community is Your Moat**
   - The community section (tips, deals, discussions) is critical
   - Seed it with real content from Reddit r/CheapEats, local food blogs
   - Incentivize posting with contribution points
   - A vibrant community keeps users coming back even when they're not hungry

8. **Price as a Feature, Not a Shame**
   - Never use words like "cheap" or "budget" in marketing — use "smart", "value", "savvy"
   - Position as: "Smart people eat here" not "Poor people eat here"
   - The app should feel premium even though it helps find affordable food

9. **Weekly Push Notifications**
   - "This week's best value restaurants near you" — personalized digest
   - "Price drop alert: Matsuya Shinjuku lowered gyudon to ¥430"
   - "New restaurant added near your office: 4.7 value score!"
   - Keep users engaged without being annoying (1-2 per week max)

10. **SEO / ASO Strategy**
    - App Store: Optimize for "budget restaurants [city]", "cheap eats [city]", "best value food"
    - Web: Each restaurant should have an SEO-friendly URL (valuebite.app/tokyo/matsuya-shinjuku)
    - Blog: "Top 10 Budget Eats in Tokyo Under ¥1,000" — content marketing
    - This drives organic installs without ad spend
