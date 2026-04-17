/**
 * Enrich top Tokyo restaurants with photos, hours, phone, reviews
 * Run: node scripts/enrich-tokyo.mjs
 */

import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!API_KEY) { console.error('Missing GOOGLE_PLACES_API_KEY'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_KEY'); process.exit(1); }

// Tokyo coordinates and radius
const TOKYO_LAT = 35.6762, TOKYO_LNG = 139.6503, RADIUS_KM = 20;
const latRange = RADIUS_KM / 111;
const lngRange = RADIUS_KM / (111 * Math.cos(TOKYO_LAT * Math.PI / 180));

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

async function getTokyoRestaurants() {
  const url = `${SUPABASE_URL}/rest/v1/restaurants?lat=gte.${TOKYO_LAT - latRange}&lat=lte.${TOKYO_LAT + latRange}&lng=gte.${TOKYO_LNG - lngRange}&lng=lte.${TOKYO_LNG + lngRange}&select=id,external_ids,name&order=value_score.desc.nullslast&limit=200`;
  const res = await fetch(url, { headers });
  return await res.json();
}

async function fetchPlaceDetails(placeId) {
  const fields = 'name,formatted_phone_number,website,rating,user_ratings_total,opening_hours,reviews,photos';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') return null;
  return data.result;
}

function getPhotoUrl(photoRef, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${API_KEY}`;
}

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

async function updateRestaurant(id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function insertReviews(restaurantId, googleReviews) {
  if (!googleReviews?.length) return 0;
  let inserted = 0;
  for (const review of googleReviews.slice(0, 5)) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          author_name: review.author_name || 'Google User',
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

async function insertPhotos(restaurantId, photos) {
  if (!photos?.length) return 0;
  let inserted = 0;
  for (let i = 0; i < Math.min(photos.length, 5); i++) {
    const photo = photos[i];
    const photoUrl = getPhotoUrl(photo.photo_reference);
    const category = i === 0 ? 'exterior' : i === 1 ? 'interior' : i === 2 ? 'menu' : 'dish';
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_photos`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          photo_url: photoUrl,
          ai_language_detected: category,
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
  console.log('Tokyo Restaurant Enrichment Started');
  const restaurants = await getTokyoRestaurants();
  console.log(`Found ${restaurants.length} Tokyo restaurants to process\n`);

  let enriched = 0, failed = 0, totalReviews = 0, totalPhotos = 0;
  const t0 = Date.now();

  for (let i = 0; i < restaurants.length; i++) {
    const r = restaurants[i];
    const placeId = r.external_ids?.google_place_id;
    const name = r.name?.en || r.name?.original || 'Unknown';

    if (!placeId) { failed++; continue; }

    if ((i + 1) % 25 === 0 || i === 0) {
      const elapsed = Math.round((Date.now() - t0) / 1000);
      console.log(`[${i + 1}/${restaurants.length}] ${elapsed}s elapsed | enriched=${enriched} reviews=${totalReviews} photos=${totalPhotos}`);
    }

    try {
      const details = await fetchPlaceDetails(placeId);
      if (!details) { failed++; continue; }

      const hours = parseHours(details.opening_hours);
      const is24h = details.opening_hours?.periods?.some(p => !p.close) || false;

      await updateRestaurant(r.id, {
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        operating_hours: hours,
        is_24h: is24h,
        value_score: details.rating ? Math.min(5, +(details.rating * 0.9).toFixed(2)) : null,
        total_reviews: details.user_ratings_total || 0,
        is_verified: true,
        updated_at: new Date().toISOString(),
      });

      totalReviews += await insertReviews(r.id, details.reviews);
      totalPhotos += await insertPhotos(r.id, details.photos);
      enriched++;

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`  Error enriching ${name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('ENRICHMENT COMPLETE');
  console.log('='.repeat(50));
  console.log(`Restaurants enriched: ${enriched}`);
  console.log(`Failed: ${failed}`);
  console.log(`Reviews added: ${totalReviews}`);
  console.log(`Photos added: ${totalPhotos}`);
  console.log(`Total time: ${Math.round((Date.now() - t0) / 1000)}s`);
}

main().catch(console.error);
