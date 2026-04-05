/**
 * ValueBite — Google Places Data Fetcher (Supabase REST API version)
 * Usage: node scripts/fetch-restaurants.mjs
 */

import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!API_KEY) { console.error('Missing GOOGLE_PLACES_API_KEY'); process.exit(1); }
if (!SUPABASE_KEY) { console.error('Missing SUPABASE_SERVICE_KEY'); process.exit(1); }

const CITIES = [
  { name: 'Tokyo', country: 'JP', currency: 'JPY', lat: 35.6762, lng: 139.6503 },
  { name: 'Osaka', country: 'JP', currency: 'JPY', lat: 34.6937, lng: 135.5023 },
  { name: 'Kyoto', country: 'JP', currency: 'JPY', lat: 35.0116, lng: 135.7681 },
  { name: 'New York City', country: 'US', currency: 'USD', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', country: 'US', currency: 'USD', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'US', currency: 'USD', lat: 41.8781, lng: -87.6298 },
  { name: 'San Francisco', country: 'US', currency: 'USD', lat: 37.7749, lng: -122.4194 },
  { name: 'Miami', country: 'US', currency: 'USD', lat: 25.7617, lng: -80.1918 },
  { name: 'Austin', country: 'US', currency: 'USD', lat: 30.2672, lng: -97.7431 },
  { name: 'Boston', country: 'US', currency: 'USD', lat: 42.3601, lng: -71.0589 },
  { name: 'Houston', country: 'US', currency: 'USD', lat: 29.7604, lng: -95.3698 },
  { name: 'Seattle', country: 'US', currency: 'USD', lat: 47.6062, lng: -122.3321 },
  { name: 'Washington DC', country: 'US', currency: 'USD', lat: 38.9072, lng: -77.0369 },
  { name: 'Denver', country: 'US', currency: 'USD', lat: 39.7392, lng: -104.9903 },
  { name: 'Nashville', country: 'US', currency: 'USD', lat: 36.1627, lng: -86.7816 },
  { name: 'Atlanta', country: 'US', currency: 'USD', lat: 33.7490, lng: -84.3880 },
  { name: 'Dallas', country: 'US', currency: 'USD', lat: 32.7767, lng: -96.7970 },
  { name: 'Phoenix', country: 'US', currency: 'USD', lat: 33.4484, lng: -112.0740 },
  { name: 'San Diego', country: 'US', currency: 'USD', lat: 32.7157, lng: -117.1611 },
  { name: 'Philadelphia', country: 'US', currency: 'USD', lat: 39.9526, lng: -75.1652 },
  { name: 'Charlotte', country: 'US', currency: 'USD', lat: 35.2271, lng: -80.8431 },
  { name: 'Raleigh', country: 'US', currency: 'USD', lat: 35.7796, lng: -78.6382 },
  { name: 'Salt Lake City', country: 'US', currency: 'USD', lat: 40.7608, lng: -111.8910 },
  { name: 'London', country: 'GB', currency: 'GBP', lat: 51.5074, lng: -0.1278 },
  { name: 'Manchester', country: 'GB', currency: 'GBP', lat: 53.4808, lng: -2.2426 },
  { name: 'Berlin', country: 'DE', currency: 'EUR', lat: 52.5200, lng: 13.4050 },
  { name: 'Munich', country: 'DE', currency: 'EUR', lat: 48.1351, lng: 11.5820 },
  { name: 'Frankfurt', country: 'DE', currency: 'EUR', lat: 50.1109, lng: 8.6821 },
  { name: 'Paris', country: 'FR', currency: 'EUR', lat: 48.8566, lng: 2.3522 },
  { name: 'Sydney', country: 'AU', currency: 'AUD', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'AU', currency: 'AUD', lat: -37.8136, lng: 144.9631 },
  { name: 'Toronto', country: 'CA', currency: 'CAD', lat: 43.6532, lng: -79.3832 },
  { name: 'Vancouver', country: 'CA', currency: 'CAD', lat: 49.2827, lng: -123.1207 },
  { name: 'Dubai', country: 'AE', currency: 'AED', lat: 25.2048, lng: 55.2708 },
  { name: 'Abu Dhabi', country: 'AE', currency: 'AED', lat: 24.4539, lng: 54.3773 },
  { name: 'Singapore', country: 'SG', currency: 'SGD', lat: 1.3521, lng: 103.8198 },
  { name: 'Hong Kong', country: 'HK', currency: 'HKD', lat: 22.3193, lng: 114.1694 },
  { name: 'Taipei', country: 'TW', currency: 'TWD', lat: 25.0330, lng: 121.5654 },
  { name: 'Amsterdam', country: 'NL', currency: 'EUR', lat: 52.3676, lng: 4.9041 },
  { name: 'Madrid', country: 'ES', currency: 'EUR', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', country: 'ES', currency: 'EUR', lat: 41.3874, lng: 2.1686 },
  { name: 'Lisbon', country: 'PT', currency: 'EUR', lat: 38.7223, lng: -9.1393 },
  { name: 'Rome', country: 'IT', currency: 'EUR', lat: 41.9028, lng: 12.4964 },
  { name: 'Milan', country: 'IT', currency: 'EUR', lat: 45.4642, lng: 9.1900 },
  { name: 'Zurich', country: 'CH', currency: 'CHF', lat: 47.3769, lng: 8.5417 },
  { name: 'Geneva', country: 'CH', currency: 'CHF', lat: 46.2044, lng: 6.1432 },
  { name: 'Luxembourg City', country: 'LU', currency: 'EUR', lat: 49.6116, lng: 6.1319 },
  { name: 'Prague', country: 'CZ', currency: 'CZK', lat: 50.0755, lng: 14.4378 },
  { name: 'Vienna', country: 'AT', currency: 'EUR', lat: 48.2082, lng: 16.3738 },
  { name: 'Budapest', country: 'HU', currency: 'HUF', lat: 47.4979, lng: 19.0402 },
  { name: 'Warsaw', country: 'PL', currency: 'PLN', lat: 52.2297, lng: 21.0122 },
  { name: 'Istanbul', country: 'TR', currency: 'TRY', lat: 41.0082, lng: 28.9784 },
  { name: 'Athens', country: 'GR', currency: 'EUR', lat: 37.9838, lng: 23.7275 },
  { name: 'Tel Aviv', country: 'IL', currency: 'ILS', lat: 32.0853, lng: 34.7818 },
  { name: 'Doha', country: 'QA', currency: 'QAR', lat: 25.2854, lng: 51.5310 },
  { name: 'Kuwait City', country: 'KW', currency: 'KWD', lat: 29.3759, lng: 47.9774 },
  { name: 'Mumbai', country: 'IN', currency: 'INR', lat: 19.0760, lng: 72.8777 },
  { name: 'Mexico City', country: 'MX', currency: 'MXN', lat: 19.4326, lng: -99.1332 },
  { name: 'Cancun', country: 'MX', currency: 'MXN', lat: 21.1619, lng: -86.8515 },
];

const PRICE_ESTIMATES = {
  JP: { 0: 400, 1: 700, 2: 1200 }, US: { 0: 5, 1: 10, 2: 20 },
  GB: { 0: 4, 1: 8, 2: 16 }, DE: { 0: 4, 1: 8, 2: 16 },
  FR: { 0: 5, 1: 10, 2: 18 }, AU: { 0: 6, 1: 12, 2: 22 },
  CA: { 0: 5, 1: 10, 2: 20 }, AE: { 0: 10, 1: 25, 2: 50 },
  SG: { 0: 3, 1: 6, 2: 12 }, HK: { 0: 25, 1: 50, 2: 100 },
  TW: { 0: 50, 1: 100, 2: 200 }, NL: { 0: 5, 1: 10, 2: 18 },
  ES: { 0: 4, 1: 8, 2: 15 }, PT: { 0: 4, 1: 7, 2: 14 },
  IT: { 0: 4, 1: 8, 2: 16 }, CH: { 0: 8, 1: 15, 2: 28 },
  LU: { 0: 5, 1: 10, 2: 20 }, CZ: { 0: 80, 1: 150, 2: 300 },
  AT: { 0: 5, 1: 9, 2: 18 }, HU: { 0: 1000, 1: 2000, 2: 4000 },
  PL: { 0: 15, 1: 30, 2: 60 }, TR: { 0: 50, 1: 120, 2: 250 },
  GR: { 0: 4, 1: 7, 2: 14 }, IL: { 0: 15, 1: 30, 2: 60 },
  QA: { 0: 10, 1: 20, 2: 40 }, KW: { 0: 1, 1: 2, 2: 4 },
  IN: { 0: 100, 1: 200, 2: 400 }, MX: { 0: 50, 1: 100, 2: 200 },
};

const CHAIN_KEYWORDS = ['mcdonald', 'subway', 'starbucks', 'kfc', 'burger king', 'pizza hut', 'domino', 'taco bell', 'wendy', 'chipotle', 'nando', 'pret', 'greggs', 'wetherspoon', 'matsuya', 'sukiya', 'yoshinoya', 'saizeriya', 'gusto', 'coco curry', 'shake shack', 'chick-fil-a', 'five guys'];

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200) + '-' + Date.now().toString(36).slice(-4);
}

// Supabase REST API insert
async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    if (err.includes('duplicate')) return false;
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
  return true;
}

async function fetchNearby(lat, lng, radius, maxPrice) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&maxprice=${maxPrice}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function processCity(city, idx, total) {
  console.log(`\n[${idx+1}/${total}] 🏙️  ${city.name} (${city.country})`);

  const seenIds = new Set();
  const allPlaces = [];

  for (const priceLevel of [0, 1, 2]) {
    for (const radius of [2000, 5000]) {
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

  console.log(`  Found ${allPlaces.length} unique restaurants`);

  let inserted = 0, skipped = 0;

  for (const place of allPlaces) {
    const priceEst = (PRICE_ESTIMATES[city.country] || PRICE_ESTIMATES.US)[place.price_level ?? 1];
    const nameLC = (place.name || '').toLowerCase();
    const isChain = CHAIN_KEYWORDS.some(kw => nameLC.includes(kw));

    try {
      const ok = await supabaseInsert('restaurants', {
        name: { original: place.name, en: place.name },
        slug: slugify(place.name || 'restaurant'),
        lat: place.geometry?.location?.lat || 0,
        lng: place.geometry?.location?.lng || 0,
        address: { original: place.vicinity || '', en: place.vicinity || '' },
        cuisine_type: (place.types || []).filter(t => !['restaurant','food','point_of_interest','establishment'].includes(t)),
        avg_meal_price: priceEst,
        price_currency: city.currency,
        value_score: place.rating ? Math.min(5, +(place.rating * 0.9).toFixed(2)) : null,
        total_reviews: place.user_ratings_total || 0,
        source: 'google_places',
        external_ids: { google_place_id: place.place_id },
        is_chain: isChain,
        is_active: true,
      });
      if (ok) inserted++; else skipped++;
    } catch (err) {
      skipped++;
      if (!err.message?.includes('duplicate')) {
        console.error(`  Error: ${place.name}: ${err.message}`);
      }
    }
  }

  console.log(`  ✅ Inserted: ${inserted}, Skipped: ${skipped}`);
  return { city: city.name, found: allPlaces.length, inserted, skipped };
}

async function main() {
  console.log('🚀 ValueBite Data Fetcher (Supabase REST API)');
  console.log(`📍 ${CITIES.length} cities`);
  console.log(`🔑 Google: ${API_KEY.slice(0,10)}...`);
  console.log(`🗄️  Supabase: ${SUPABASE_URL}`);
  console.log('');

  const results = [];
  let totalInserted = 0;

  for (let i = 0; i < CITIES.length; i++) {
    const r = await processCity(CITIES[i], i, CITIES.length);
    results.push(r);
    totalInserted += r.inserted;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 DONE: ${totalInserted} restaurants inserted across ${CITIES.length} cities`);
  results.sort((a, b) => b.inserted - a.inserted);
  console.log('\nTop 10:');
  for (const r of results.slice(0, 10)) {
    console.log(`  ${r.city}: ${r.inserted}`);
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
