# ValueBite — Remaining Improvements & Recommendations

## Completed ✅
- [x] Database tables created (Supabase migration)
- [x] API routes deployed (Vercel API Routes)
- [x] Production deployment live
- [x] All UX fixes (chain filter, purpose fit, emojis, post form, review order)
- [x] Dark mode toggle working
- [x] Fullscreen photo viewer with swipe
- [x] 198 restaurants across 8 cities
- [x] Google reviews for all restaurants
- [x] 18 languages, 28 countries, 67 cities
- [x] App Store listing written
- [x] GitHub repo pushed
- [x] Cost simulation provided

## High Priority — Do Before First 1K Users

### 1. SEO Optimization
- Each restaurant page should have proper meta tags (title, description, OG image)
- Add `generateMetadata()` to restaurant/[id]/page.tsx
- Add sitemap.xml generation for all restaurant URLs
- This drives free organic traffic

### 2. PWA Improvements
- Add service worker for offline support
- "Add to Home Screen" prompt
- This makes the web app feel native without App Store

### 3. User Authentication (Supabase Auth)
- Enable Google/Apple sign-in via Supabase Auth
- This is needed for: favorites, reviews, budget tracking
- All features currently work in demo mode without login

### 4. Share Functionality
- "Share this restaurant" button → generates link + social cards
- "I saved ¥X this month" → shareable Instagram Story card
- This is the #1 organic growth mechanism

## Medium Priority — Before 10K Users

### 5. Notifications
- Browser push notifications via Firebase
- Weekly "Value Report" email
- Price change alerts

### 6. Real Data Pipeline
- Connect Google Places API to auto-populate new cities
- Scheduled cron job to refresh restaurant data weekly
- This replaces seed data with live data

### 7. Performance Optimization
- Image optimization (use next/image instead of raw img tags)
- Lazy loading for restaurant cards below the fold
- Server-side rendering for SEO pages

### 8. Analytics
- PostHog or Mixpanel for user behavior tracking
- Track: which restaurants get clicked, which purposes are popular, search queries
- This data drives product decisions

## Low Priority — Before 100K Users

### 9. Mobile App Build (Expo EAS)
- Build and submit to App Store / Play Store
- The React Native code is ready, just needs EAS build

### 10. Content Marketing
- Blog: "Top 10 Budget Eats in Tokyo Under ¥1,000"
- SEO-optimized city guides
- Social media presence (@valuebite)

### 11. Localization Quality
- Professional review of Japanese translations
- Add missing translation keys in non-core locales
- RTL testing for Arabic/Hebrew

### 12. A/B Testing
- Test different value score displays
- Test ad placement positions
- Test purpose category ordering
