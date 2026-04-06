/**
 * Fetch more restaurants for cities with low counts
 * Uses larger radius and more price levels
 */
import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const CITIES_NEEDING_MORE = [
  { name: 'London', country: 'GB', currency: 'GBP', lat: 51.5074, lng: -0.1278 },
  { name: 'London Soho', country: 'GB', currency: 'GBP', lat: 51.5133, lng: -0.1312 },
  { name: 'London East', country: 'GB', currency: 'GBP', lat: 51.5155, lng: -0.0722 },
  { name: 'Paris', country: 'FR', currency: 'EUR', lat: 48.8566, lng: 2.3522 },
  { name: 'Paris Marais', country: 'FR', currency: 'EUR', lat: 48.8566, lng: 2.3600 },
  { name: 'Sydney', country: 'AU', currency: 'AUD', lat: -33.8688, lng: 151.2093 },
  { name: 'Sydney Newtown', country: 'AU', currency: 'AUD', lat: -33.8976, lng: 151.1790 },
];

const PRICE_ESTIMATES = {
  GB: { 0: 4, 1: 8, 2: 16 },
  FR: { 0: 5, 1: 10, 2: 18 },
  AU: { 0: 6, 1: 12, 2: 22 },
};

const CHAIN_KEYWORDS = ['mcdonald', 'subway', 'starbucks', 'kfc', 'burger king', 'pizza hut', 'domino', 'taco bell', 'nando', 'pret', 'greggs', 'wetherspoon', 'shake shack'];

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200) + '-' + Date.now().toString(36).slice(-4);
}

async function fetchNearby(lat, lng, radius, maxPrice) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&maxprice=${maxPrice}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function fetchDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,reviews,photos&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || null;
}

async function supaInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function supaUpdate(id, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
}

// Check if place already exists
async function placeExists(placeId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?external_ids->>google_place_id=eq.${placeId}&select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  const data = await res.json();
  return data.length > 0 ? data[0].id : null;
}

function getPhotoUrl(ref) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${API_KEY}`;
}

async function processCity(city) {
  console.log(`\n🏙️ ${city.name}`);
  const seenIds = new Set();
  const allPlaces = [];

  for (const priceLevel of [0, 1, 2]) {
    for (const radius of [1500, 3000, 5000, 8000]) {
      const places = await fetchNearby(city.lat, city.lng, radius, priceLevel);
      for (const p of places) {
        if (!seenIds.has(p.place_id)) {
          seenIds.add(p.place_id);
          allPlaces.push({ ...p, price_level: priceLevel });
        }
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`  Found ${allPlaces.length} unique places`);
  let inserted = 0, enriched = 0, skipped = 0;

  for (const place of allPlaces) {
    const existingId = await placeExists(place.place_id);

    if (existingId) {
      // Already exists — just fetch details if not yet enriched
      skipped++;
      continue;
    }

    const priceEst = (PRICE_ESTIMATES[city.country] || PRICE_ESTIMATES.GB)[place.price_level ?? 1];
    const nameLC = (place.name || '').toLowerCase();
    const isChain = CHAIN_KEYWORDS.some(kw => nameLC.includes(kw));

    try {
      // Insert restaurant
      const ok = await supaInsert('restaurants', {
        name: { original: place.name, en: place.name },
        slug: slugify(place.name || 'restaurant'),
        lat: place.geometry?.location?.lat || 0,
        lng: place.geometry?.location?.lng || 0,
        address: { original: place.vicinity || '', en: place.vicinity || '' },
        cuisine_type: (place.types || []).filter(t => !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(t)),
        avg_meal_price: priceEst,
        price_currency: city.currency,
        value_score: place.rating ? Math.min(5, +(place.rating * 0.9).toFixed(2)) : null,
        total_reviews: place.user_ratings_total || 0,
        source: 'google_places',
        external_ids: { google_place_id: place.place_id },
        is_chain: isChain,
        is_active: true,
      });
      if (!ok) { skipped++; continue; }
      inserted++;

      // Fetch details + photos
      const details = await fetchDetails(place.place_id);
      if (!details) continue;

      // Get the restaurant ID we just inserted
      const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?external_ids->>google_place_id=eq.${place.place_id}&select=id&limit=1`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      });
      const [restaurant] = await res.json();
      if (!restaurant) continue;

      // Update with details
      await supaUpdate(restaurant.id, {
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        is_verified: true,
        updated_at: new Date().toISOString(),
      });

      // Insert reviews
      for (const rev of (details.reviews || []).slice(0, 5)) {
        await supaInsert('reviews', {
          restaurant_id: restaurant.id,
          content: rev.text || '',
          taste_rating: Math.min(5, Math.max(1, rev.rating || 3)),
          value_rating: Math.min(5, Math.max(1, rev.rating || 3)),
          was_worth_it: (rev.rating || 3) >= 4,
          language: rev.language || 'en',
        });
      }

      // Insert photos
      const categories = ['exterior', 'interior', 'menu', 'dish', 'dish'];
      for (let i = 0; i < Math.min(5, (details.photos || []).length); i++) {
        const photo = details.photos[i];
        await supaInsert('menu_photos', {
          restaurant_id: restaurant.id,
          photo_url: getPhotoUrl(photo.photo_reference),
          ai_language_detected: categories[i],
          ai_processed: true,
          ai_confidence: '0.80',
        });
      }

      enriched++;
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  Error: ${place.name}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`  ✅ Inserted: ${inserted}, Enriched: ${enriched}, Skipped: ${skipped}`);
}

async function main() {
  console.log('🚀 Fetching missing city data');
  for (const city of CITIES_NEEDING_MORE) {
    await processCity(city);
  }
  console.log('\n✅ Done!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
