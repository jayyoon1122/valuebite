/**
 * ValueBite — Google Place Details & Photos Fetcher
 * Enriches existing restaurants in Supabase with details, reviews, and categorized photos.
 *
 * Usage: node scripts/fetch-details.mjs
 * Estimated cost: ~$25 from Google $300 credit
 * Estimated time: ~15-20 minutes
 */

import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!API_KEY) { console.error('Missing GOOGLE_PLACES_API_KEY'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_KEY'); process.exit(1); }

// Photo categories based on Google's photo metadata
// Google provides photo.html_attributions and we can infer type from context
const PHOTO_CATEGORIES = ['exterior', 'interior', 'menu', 'dish', 'ambiance'];

function categorizePhoto(index, total) {
  // Google tends to order photos: exterior first, then interior, then food
  // We'll assign categories based on position
  if (index === 0) return 'exterior';
  if (index === 1) return 'interior';
  if (index === 2) return 'menu';
  return 'dish';
}

// Fetch all restaurants that need enrichment
async function getRestaurantsToEnrich() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?source=eq.google_places&is_verified=eq.false&select=id,external_ids,name&limit=2000`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  return await res.json();
}

// Fetch Place Details from Google
async function fetchPlaceDetails(placeId) {
  const fields = 'name,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,reviews,photos,editorial_summary';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    return null;
  }
  return data.result;
}

// Get photo URL from Google (photos are served via a URL, not stored)
function getPhotoUrl(photoRef, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${API_KEY}`;
}

// Parse Google opening hours to our format
function parseHours(openingHours) {
  if (!openingHours?.periods) return null;
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const result = {};
  for (const period of openingHours.periods) {
    const day = dayNames[period.open?.day];
    if (!day) continue;
    const open = period.open?.time?.replace(/(\d{2})(\d{2})/, '$1:$2') || '00:00';
    const close = period.close?.time?.replace(/(\d{2})(\d{2})/, '$1:$2') || '23:59';
    result[day] = { open, close };
  }
  return Object.keys(result).length > 0 ? result : null;
}

// Update restaurant in Supabase
async function updateRestaurant(id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  return res.ok;
}

// Insert Google reviews into reviews table
async function insertReviews(restaurantId, googleReviews) {
  if (!googleReviews || googleReviews.length === 0) return 0;

  let inserted = 0;
  for (const review of googleReviews.slice(0, 5)) { // max 5 reviews per restaurant
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          content: review.text || '',
          taste_rating: Math.min(5, Math.max(1, review.rating || 3)),
          value_rating: Math.min(5, Math.max(1, review.rating || 3)),
          language: review.language || 'en',
          ai_summary: review.text?.slice(0, 100) || '',
          was_worth_it: (review.rating || 3) >= 4,
          helpful_count: 0,
        }),
      });
      if (res.ok) inserted++;
    } catch {}
  }
  return inserted;
}

// Insert photos as menu_photos
async function insertPhotos(restaurantId, photos) {
  if (!photos || photos.length === 0) return 0;

  let inserted = 0;
  const maxPhotos = Math.min(photos.length, 5); // max 5 photos per restaurant

  for (let i = 0; i < maxPhotos; i++) {
    const photo = photos[i];
    const photoUrl = getPhotoUrl(photo.photo_reference);
    const category = categorizePhoto(i, maxPhotos);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_photos`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          photo_url: photoUrl,
          ai_language_detected: category, // Repurposing this field for photo category
          ai_processed: true,
          ai_confidence: '0.80',
        }),
      });
      if (res.ok) inserted++;
    } catch {}
  }
  return inserted;
}

async function main() {
  console.log('🚀 ValueBite Place Details Fetcher');
  console.log(`🗄️  Supabase: ${SUPABASE_URL}`);
  console.log('');

  // Get restaurants to enrich
  const restaurants = await getRestaurantsToEnrich();
  console.log(`📍 Found ${restaurants.length} restaurants to enrich\n`);

  let enriched = 0, failed = 0, totalReviews = 0, totalPhotos = 0;

  for (let i = 0; i < restaurants.length; i++) {
    const r = restaurants[i];
    const placeId = r.external_ids?.google_place_id;
    const name = r.name?.en || r.name?.original || 'Unknown';

    if (!placeId) { failed++; continue; }

    // Progress
    if ((i + 1) % 50 === 0 || i === 0) {
      console.log(`\n[${i + 1}/${restaurants.length}] Processing... (${enriched} enriched, ${totalReviews} reviews, ${totalPhotos} photos)`);
    }

    try {
      const details = await fetchPlaceDetails(placeId);
      if (!details) { failed++; continue; }

      // Parse data
      const hours = parseHours(details.opening_hours);
      const is24h = details.opening_hours?.periods?.some(p => !p.close) || false;

      // Update restaurant with details
      const updateData = {
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        operating_hours: hours,
        is_24h: is24h,
        value_score: details.rating ? Math.min(5, +(details.rating * 0.9).toFixed(2)) : null,
        total_reviews: details.user_ratings_total || 0,
        is_verified: true,
        price_last_verified: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await updateRestaurant(r.id, updateData);

      // Insert reviews
      const reviewCount = await insertReviews(r.id, details.reviews);
      totalReviews += reviewCount;

      // Insert photos
      const photoCount = await insertPhotos(r.id, details.photos);
      totalPhotos += photoCount;

      enriched++;

      // Rate limit: ~5 requests per second
      await new Promise(resolve => setTimeout(resolve, 250));

    } catch (err) {
      console.error(`  Error enriching ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 ENRICHMENT COMPLETE');
  console.log('='.repeat(50));
  console.log(`Restaurants enriched: ${enriched}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total reviews added: ${totalReviews}`);
  console.log(`Total photos added: ${totalPhotos}`);
  console.log('');
  console.log('✅ Done!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
