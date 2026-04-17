# Play Console Form Answers — Copy/Paste Ready

When Play Console asks each question, here are the exact answers for ValueBite.

---

## App access
**Question**: Is all functionality available without restrictions?

✅ **Answer**: "All functionality is available without restrictions"

(ValueBite has no login wall — anonymous users can use everything)

---

## Ads
**Question**: Does your app contain ads?

✅ **Answer**: **"No, my app does not contain ads"**

(NativeAdCard component exists but is sample/placeholder. If you decide to enable real ads later, change this answer and disclose ad networks)

---

## Content rating questionnaire

| Question | Answer |
|----------|--------|
| Email | economistview123@gmail.com |
| Category | **Reference, News, or Educational** (Food & Drink doesn't have its own — this is the closest match) |
| Does your app contain violence? | **No** |
| Does your app contain sexual content? | **No** |
| Does your app contain profanity? | **No** |
| Does your app contain controlled substances (alcohol, tobacco, drugs)? | **Yes** (restaurants serve alcohol — izakaya, bars listed) |
| → Does it depict use, sale, or reference? | **Reference only** (we list restaurants that serve alcohol but don't promote drinking) |
| Gambling content? | **No** |
| User-generated content (UGC)? | **Yes** |
| → Can users interact (chat, share, post)? | **Yes** (community posts and comments) |
| → Do you moderate UGC? | **Yes** (we have report functionality and moderation) |
| → Can users share location? | **No** (we use device location for nearby search but users don't share specific locations) |
| Personal information shared? | **No** (anonymous by default) |
| Mature themes? | **No** |

**Expected rating**: Likely **Everyone 10+** (due to alcohol reference) or **Teen** (for UGC). Both are fine.

---

## Target audience and content
| Question | Answer |
|----------|--------|
| Target age groups | **18 and over** (safest — UGC compliance is easier) |
| Does your app appeal to children? | **No** |
| Are children likely to use this app? | **No** |

---

## Data safety form

### Step 1: Data collection and security

**Q: Does your app collect or share any of the required user data types?**
✅ **Answer**: **Yes**

**Q: Is all of the user data collected by your app encrypted in transit?**
✅ **Answer**: **Yes** (HTTPS enforced via Vercel)

**Q: Do you provide a way for users to request that their data be deleted?**
✅ **Answer**: **Yes** (Privacy Policy section 10 + in-app "Clear Local Data" button)

### Step 2: Data types

**Location**
- Approximate location: ✅ Collected
  - Purpose: App functionality (find nearby restaurants)
  - Required or optional: **Optional** (user denies → defaults to Tokyo)
  - Shared with third parties: **No**

**Personal info**
- Name: ✅ Collected (display name in profile)
  - Purpose: Account / personalization
  - Required: **Optional**
  - Shared: **No**
- Email address: ❌ NOT collected (no sign-up required)
- User IDs: ✅ Collected (device fingerprint for upvote tracking)
  - Purpose: Fraud prevention (preventing duplicate upvotes)
  - Required: **Required**
  - Shared: **No**

**App activity**
- App interactions: ✅ Collected (community posts, comments, ratings)
  - Purpose: App functionality
  - Required: **Optional**
  - Shared: **No**
- Search history: ❌ NOT collected (search is client-side filtering only)

**Photos and videos**
- Photos: ✅ Collected (avatar upload)
  - Purpose: Personalization
  - Required: **Optional**
  - Shared: **No**
  - **Note**: Stored only on user's device (localStorage), never uploaded to server

**Files and docs**
- ❌ NOT collected

**Calendar / Contacts / Messages / Health**
- ❌ NOT collected

**Financial info**
- ✅ Collected (dining expenses logged in budget tracker)
  - Purpose: App functionality
  - Required: **Optional**
  - Shared: **No**
  - **Note**: Stored only on user's device (localStorage), never uploaded

**Audio**
- ❌ NOT collected

**Device or other IDs**
- ✅ Collected (browser fingerprint)
  - Purpose: Fraud prevention, analytics
  - Required: **Required**
  - Shared: **No**

---

## Government apps
✅ **Answer**: "No, my app is not a government app"

## News apps
✅ **Answer**: "No, my app is not a news app"

## Health apps
✅ **Answer**: "No, my app is not a health app"

## COVID-19 apps
✅ **Answer**: "No"

## Financial apps
✅ **Answer**: "No, my app is not a financial app"

(The budget tracker is a personal expense tool, not a financial service. No transactions, no payments)

---

## App content declarations

### Pricing
✅ **Answer**: **Free**, with **no in-app purchases**, **no subscriptions**

### Pre-registration
✅ **Answer**: **No** (we're launching directly to Production)

### Restricted content
- Gambling? **No**
- Real-money gaming? **No**
- News content? **No**

---

## Production release form

### Release name
```
1.0.0 (1)
```

### Release notes (English)
(Use the version from STORE_LISTING.md → "What's new")

### Countries / Regions
**Recommended for v1.0**: Choose **all available countries**, but if you want a soft launch, start with:
- Japan
- United States
- United Kingdom
- Singapore
- Hong Kong
- South Korea
- Australia
- Canada

(Then expand to all 28 countries after 1-2 weeks of stability)

### Rollout percentage
**Recommendation**: Start at **20%** for first 48 hours, then 100% if no major issues
(Internal testing track is even safer first — see PLAY_STORE_LAUNCH_GUIDE.md Part 5.8)
