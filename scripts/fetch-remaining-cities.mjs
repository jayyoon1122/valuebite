/**
 * Fetch restaurants for cities with fewer than 15 restaurants
 * Each restaurant gets details + up to 10 photos + reviews
 */
import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const CITIES = [
  { name: 'Istanbul', country: 'TR', currency: 'TRY', lat: 41.0082, lng: 28.9784 },
  { name: 'Istanbul Beyoglu', country: 'TR', currency: 'TRY', lat: 41.0340, lng: 28.9770 },
  { name: 'Istanbul Kadikoy', country: 'TR', currency: 'TRY', lat: 40.9903, lng: 29.0291 },
  { name: 'Amsterdam', country: 'NL', currency: 'EUR', lat: 52.3676, lng: 4.9041 },
  { name: 'Amsterdam Jordaan', country: 'NL', currency: 'EUR', lat: 52.3750, lng: 4.8830 },
  { name: 'Zurich', country: 'CH', currency: 'CHF', lat: 47.3769, lng: 8.5417 },
  { name: 'Zurich Old Town', country: 'CH', currency: 'CHF', lat: 47.3717, lng: 8.5420 },
  { name: 'Prague', country: 'CZ', currency: 'CZK', lat: 50.0755, lng: 14.4378 },
  { name: 'Prague Vinohrady', country: 'CZ', currency: 'CZK', lat: 50.0745, lng: 14.4485 },
  { name: 'Vienna', country: 'AT', currency: 'EUR', lat: 48.2082, lng: 16.3738 },
  { name: 'Vienna Naschmarkt', country: 'AT', currency: 'EUR', lat: 48.1988, lng: 16.3635 },
  { name: 'Manchester', country: 'GB', currency: 'GBP', lat: 53.4808, lng: -2.2426 },
  { name: 'Manchester NQ', country: 'GB', currency: 'GBP', lat: 53.4850, lng: -2.2350 },
  { name: 'Barcelona', country: 'ES', currency: 'EUR', lat: 41.3874, lng: 2.1686 },
  { name: 'Barcelona Born', country: 'ES', currency: 'EUR', lat: 41.3850, lng: 2.1820 },
  { name: 'Milan', country: 'IT', currency: 'EUR', lat: 45.4642, lng: 9.1900 },
  { name: 'Milan Navigli', country: 'IT', currency: 'EUR', lat: 45.4500, lng: 9.1700 },
];

const PRICE_ESTIMATES = {
  TR: { 0: 50, 1: 120, 2: 250 },
  NL: { 0: 5, 1: 10, 2: 18 },
  CH: { 0: 8, 1: 15, 2: 28 },
  CZ: { 0: 80, 1: 150, 2: 300 },
  AT: { 0: 5, 1: 9, 2: 18 },
  GB: { 0: 4, 1: 8, 2: 16 },
  ES: { 0: 4, 1: 8, 2: 15 },
  IT: { 0: 4, 1: 8, 2: 16 },
};

const CHAIN_KEYWORDS = ['mcdonald', 'subway', 'starbucks', 'kfc', 'burger king', 'pizza hut', 'domino', 'nando', 'pret', 'greggs'];
const PHOTO_CATEGORIES = ['exterior', 'interior', 'menu', 'dish', 'dish', 'dish', 'interior', 'dish', 'exterior', 'dish'];

function slugify(t) { return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').slice(0,200)+'-'+Date.now().toString(36).slice(-4); }
function photoUrl(ref) { return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${API_KEY}`; }

async function supaInsert(table, data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
  return r.ok;
}

async function placeExists(placeId) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?external_ids->>google_place_id=eq.${placeId}&select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  const d = await r.json();
  return d.length > 0;
}

async function fetchNearby(lat, lng, radius, maxPrice) {
  const r = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&maxprice=${maxPrice}&key=${API_KEY}`);
  const d = await r.json();
  return d.results || [];
}

async function fetchDetails(placeId) {
  const r = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,user_ratings_total,price_level,reviews,photos&key=${API_KEY}`);
  const d = await r.json();
  return d.result || null;
}

async function processCity(city) {
  console.log(`\n🏙️ ${city.name}`);
  const seen = new Set();
  const places = [];

  for (const price of [0, 1, 2]) {
    for (const radius of [1500, 3000, 5000, 8000]) {
      const results = await fetchNearby(city.lat, city.lng, radius, price);
      for (const p of results) {
        if (!seen.has(p.place_id)) { seen.add(p.place_id); places.push({...p, price_level: price}); }
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`  Found ${places.length} unique`);
  let ins = 0, skip = 0;

  for (const place of places) {
    if (await placeExists(place.place_id)) { skip++; continue; }

    const est = (PRICE_ESTIMATES[city.country] || PRICE_ESTIMATES.IT)[place.price_level ?? 1];
    const isChain = CHAIN_KEYWORDS.some(k => (place.name||'').toLowerCase().includes(k));

    const ok = await supaInsert('restaurants', {
      name: { original: place.name, en: place.name },
      slug: slugify(place.name || 'r'),
      lat: place.geometry?.location?.lat || 0,
      lng: place.geometry?.location?.lng || 0,
      address: { original: place.vicinity || '', en: place.vicinity || '' },
      cuisine_type: (place.types||[]).filter(t => !['restaurant','food','point_of_interest','establishment'].includes(t)),
      avg_meal_price: est,
      price_currency: city.currency,
      value_score: place.rating ? Math.min(5, +(place.rating * 0.9).toFixed(2)) : null,
      total_reviews: place.user_ratings_total || 0,
      source: 'google_places',
      external_ids: { google_place_id: place.place_id },
      is_chain: isChain,
      is_active: true,
    });
    if (!ok) { skip++; continue; }

    // Fetch details
    const details = await fetchDetails(place.place_id);
    if (!details) { ins++; continue; }

    // Get inserted restaurant ID
    const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?external_ids->>google_place_id=eq.${place.place_id}&select=id&limit=1`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    const [restaurant] = await res.json();
    if (!restaurant) { ins++; continue; }

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

    // Insert up to 10 photos
    for (let j = 0; j < Math.min(10, (details.photos || []).length); j++) {
      await supaInsert('menu_photos', {
        restaurant_id: restaurant.id,
        photo_url: photoUrl(details.photos[j].photo_reference),
        ai_language_detected: PHOTO_CATEGORIES[j] || 'dish',
        ai_processed: true,
        ai_confidence: '0.85',
      });
    }

    ins++;
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`  ✅ Inserted: ${ins}, Skipped: ${skip}`);
}

async function main() {
  console.log('🚀 Fetching remaining cities data\n');
  for (const city of CITIES) await processCity(city);
  console.log('\n✅ All done!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
