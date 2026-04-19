/**
 * Multi-City Restaurant Pipeline
 *
 * Usage: node scripts/city-pipeline.mjs <city> <phase>
 *   city:  nyc | la | tokyo | singapore
 *   phase: 1 = discover | 2 = fetch details | 3 = extract menus | all
 *
 * Examples:
 *   node scripts/city-pipeline.mjs la all
 *   node scripts/city-pipeline.mjs nyc 3        # re-run menu extraction for NYC
 *   node scripts/city-pipeline.mjs tokyo 1
 */

import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

// Load env
const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const GOOGLE_KEY = env.GOOGLE_PLACES_API_KEY;

// Ingestion guard (P0-4): is this Google Place actually a restaurant?
// Reject obvious non-restaurants (hostels, malls, bookstores, etc.) at intake
// so they never enter the DB. Returns true if place looks like a real eatery.
const _NON_RESTAURANT_TYPES = new Set([
  'lodging', 'hotel', 'hostel', 'pharmacy', 'drugstore', 'spa', 'beauty_salon',
  'parking', 'gas_station', 'atm', 'real_estate_agency', 'bank',
  'school', 'university', 'hospital', 'clinic', 'library',
  'shopping_mall', 'department_store', 'electronics_store', 'clothing_store',
  'jewelry_store', 'shoe_store', 'book_store', 'home_goods_store',
  'furniture_store', 'museum', 'tourist_attraction', 'place_of_worship',
  'movie_theater', 'gym', 'stadium',
]);
const _RESTAURANT_TYPES = new Set([
  'restaurant', 'cafe', 'bakery', 'bar', 'meal_takeaway', 'meal_delivery',
  'food', 'food_court',
]);
const _NON_RESTAURANT_NAME = /\b(animate|tsutaya|bookoff|don[\s-]?quijote|donki|loft\s+main|daiso|yodobashi|bic\s+camera|yamada\s+denki|tower\s+records|matsumoto\s+kiyoshi|sundrug|apple\s+store|uniqlo\s+(flagship|main)|muji\s+(flagship|main)|ikea)\b/i;

function isLikelyRestaurant(place) {
  const types = place.types || [];
  if (_NON_RESTAURANT_NAME.test(place.name || '')) return false;
  // Must have at least one restaurant-y type
  const hasFoodType = types.some(t => _RESTAURANT_TYPES.has(t));
  if (!hasFoodType) return false;
  // If it ALSO has a non-food primary type (lodging, hostel, mall), reject —
  // these are usually hotels/malls with a token "restaurant" tag from a tenant.
  const hasNonFood = types.some(t => _NON_RESTAURANT_TYPES.has(t));
  if (hasNonFood) return false;
  return true;
}
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY;

if (!GOOGLE_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing required env vars');
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function supaFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': opts.prefer || '',
      ...opts.headers,
    },
    method: opts.method || 'GET',
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ═══════════════════════════════════════════
// City Configurations
// ═══════════════════════════════════════════

const CITIES = {
  nyc: {
    name: 'New York City',
    currency: 'USD',
    latRange: [40.4, 41.0],
    lngRange: [-74.3, -73.7],
    benchmark: 15, // typical budget meal price
    areas: [
      { lat: 40.7580, lng: -73.9855, name: 'Midtown' },
      { lat: 40.7282, lng: -73.7942, name: 'East Village' },
      { lat: 40.7193, lng: -73.9951, name: 'Chinatown' },
      { lat: 40.7484, lng: -73.9967, name: 'Hells Kitchen' },
      { lat: 40.8075, lng: -73.9626, name: 'Harlem' },
      { lat: 40.7359, lng: -73.9911, name: 'Greenwich Village' },
      { lat: 40.7614, lng: -73.9776, name: 'Columbus Circle' },
      { lat: 40.7831, lng: -73.9712, name: 'Upper West Side' },
      { lat: 40.7681, lng: -73.9614, name: 'Upper East Side' },
      { lat: 40.7127, lng: -74.0060, name: 'Financial District' },
      { lat: 40.6892, lng: -73.9857, name: 'Downtown Brooklyn' },
      { lat: 40.6872, lng: -73.9418, name: 'Bed-Stuy' },
      { lat: 40.6782, lng: -73.9442, name: 'Crown Heights' },
      { lat: 40.7081, lng: -73.9571, name: 'Williamsburg' },
      { lat: 40.6501, lng: -73.9496, name: 'Flatbush' },
      { lat: 40.6340, lng: -73.9790, name: 'Sunset Park' },
      { lat: 40.7433, lng: -73.8235, name: 'Flushing' },
      { lat: 40.7498, lng: -73.8758, name: 'Jackson Heights' },
      { lat: 40.7557, lng: -73.8831, name: 'Elmhurst' },
      { lat: 40.7282, lng: -73.7949, name: 'Fresh Meadows' },
      { lat: 40.7561, lng: -73.8439, name: 'Corona' },
      { lat: 40.8448, lng: -73.8648, name: 'Bronx Fordham' },
      { lat: 40.6424, lng: -74.0764, name: 'Staten Island' },
    ],
  },
  la: {
    name: 'Los Angeles',
    currency: 'USD',
    latRange: [33.7, 34.2],
    lngRange: [-118.7, -118.1],
    benchmark: 14,
    areas: [
      { lat: 34.0522, lng: -118.2437, name: 'Downtown LA' },
      { lat: 34.1016, lng: -118.3267, name: 'Hollywood' },
      { lat: 34.0195, lng: -118.4912, name: 'Santa Monica' },
      { lat: 34.0259, lng: -118.3965, name: 'Mid-Wilshire' },
      { lat: 33.9425, lng: -118.4081, name: 'Inglewood' },
      { lat: 34.0628, lng: -118.3587, name: 'Silver Lake' },
      { lat: 34.0736, lng: -118.2600, name: 'Echo Park' },
      { lat: 34.0477, lng: -118.2541, name: 'Arts District' },
      { lat: 34.0537, lng: -118.2427, name: 'Little Tokyo' },
      { lat: 34.0407, lng: -118.1976, name: 'Boyle Heights' },
      { lat: 34.0662, lng: -118.2138, name: 'Lincoln Heights' },
      { lat: 33.9616, lng: -118.3523, name: 'Hawthorne' },
      { lat: 33.8614, lng: -118.3983, name: 'Torrance' },
      { lat: 33.9747, lng: -118.2479, name: 'Compton' },
      { lat: 34.1478, lng: -118.1445, name: 'Pasadena' },
      { lat: 34.0211, lng: -118.3965, name: 'Culver City' },
      { lat: 33.9850, lng: -118.4695, name: 'Venice' },
      { lat: 34.1808, lng: -118.3090, name: 'Burbank' },
      { lat: 34.1625, lng: -118.3517, name: 'North Hollywood' },
      { lat: 34.0566, lng: -118.3007, name: 'Koreatown' },
      { lat: 34.0639, lng: -118.4464, name: 'Westwood' },
      { lat: 34.0900, lng: -118.4065, name: 'Beverly Hills' },
      { lat: 33.7701, lng: -118.1937, name: 'Long Beach' },
    ],
  },
  tokyo: {
    name: 'Tokyo',
    currency: 'JPY',
    latRange: [35.5, 35.85],
    lngRange: [139.5, 139.95],
    benchmark: 1000, // ¥1000 typical budget meal
    areas: [
      { lat: 35.6812, lng: 139.7671, name: 'Ginza' },
      { lat: 35.6938, lng: 139.7035, name: 'Shinjuku' },
      { lat: 35.6595, lng: 139.7004, name: 'Shibuya' },
      { lat: 35.7100, lng: 139.8107, name: 'Asakusa' },
      { lat: 35.7295, lng: 139.7109, name: 'Ikebukuro' },
      { lat: 35.6580, lng: 139.7015, name: 'Ebisu' },
      { lat: 35.7023, lng: 139.5747, name: 'Kichijoji' },
      { lat: 35.7328, lng: 139.7105, name: 'Ikebukuro' },
      { lat: 35.6684, lng: 139.6009, name: 'Shimokitazawa' },
      { lat: 35.6905, lng: 139.6995, name: 'Shinjuku West' },
      { lat: 35.6326, lng: 139.7157, name: 'Meguro' },
      { lat: 35.7141, lng: 139.7774, name: 'Ueno' },
      { lat: 35.6762, lng: 139.6503, name: 'Koenji' },
      { lat: 35.6486, lng: 139.7108, name: 'Nakameguro' },
      { lat: 35.6980, lng: 139.7731, name: 'Akihabara' },
      { lat: 35.6634, lng: 139.7160, name: 'Daikanyama' },
      { lat: 35.7312, lng: 139.7288, name: 'Otsuka' },
      { lat: 35.7060, lng: 139.7513, name: 'Bunkyo' },
      { lat: 35.6655, lng: 139.7527, name: 'Shinagawa' },
      { lat: 35.7467, lng: 139.8088, name: 'Nishi-Nippori' },
      { lat: 35.6581, lng: 139.7414, name: 'Tamachi' },
      { lat: 35.6721, lng: 139.7637, name: 'Tsukiji' },
      { lat: 35.7283, lng: 139.6918, name: 'Mejiro' },
    ],
  },
  singapore: {
    name: 'Singapore',
    currency: 'SGD',
    latRange: [1.2, 1.47],
    lngRange: [103.6, 104.0],
    benchmark: 8, // SGD 8 typical hawker meal
    areas: [
      { lat: 1.2834, lng: 103.8607, name: 'Chinatown' },
      { lat: 1.3006, lng: 103.8565, name: 'Orchard' },
      { lat: 1.2966, lng: 103.8485, name: 'Somerset' },
      { lat: 1.3521, lng: 103.8198, name: 'Bishan' },
      { lat: 1.3114, lng: 103.7963, name: 'Buona Vista' },
      { lat: 1.3009, lng: 103.8389, name: 'Dhoby Ghaut' },
      { lat: 1.2818, lng: 103.8451, name: 'Tanjong Pagar' },
      { lat: 1.3066, lng: 103.8314, name: 'Tiong Bahru' },
      { lat: 1.3115, lng: 103.8602, name: 'Bugis' },
      { lat: 1.3143, lng: 103.8628, name: 'Little India' },
      { lat: 1.2903, lng: 103.8519, name: 'Marina Bay' },
      { lat: 1.3382, lng: 103.8475, name: 'Toa Payoh' },
      { lat: 1.3329, lng: 103.7423, name: 'Jurong East' },
      { lat: 1.3505, lng: 103.9492, name: 'Tampines' },
      { lat: 1.3112, lng: 103.8923, name: 'Geylang' },
      { lat: 1.3025, lng: 103.8939, name: 'Katong' },
      { lat: 1.3644, lng: 103.8501, name: 'Ang Mo Kio' },
      { lat: 1.3770, lng: 103.8488, name: 'Yishun' },
      { lat: 1.3516, lng: 103.8723, name: 'Serangoon' },
      { lat: 1.3352, lng: 103.8866, name: 'Aljunied' },
      { lat: 1.3410, lng: 103.7597, name: 'Bukit Batok' },
      { lat: 1.3766, lng: 103.7630, name: 'Woodlands' },
      { lat: 1.3329, lng: 103.8942, name: 'Paya Lebar' },
    ],
  },
  hongkong: {
    name: 'Hong Kong',
    currency: 'HKD',
    latRange: [22.15, 22.55],
    lngRange: [113.8, 114.4],
    benchmark: 60, // HKD 60 typical budget meal
    areas: [
      { lat: 22.2819, lng: 114.1578, name: 'Central' },
      { lat: 22.2783, lng: 114.1747, name: 'Wan Chai' },
      { lat: 22.2780, lng: 114.1827, name: 'Causeway Bay' },
      { lat: 22.3193, lng: 114.1694, name: 'Mong Kok' },
      { lat: 22.3048, lng: 114.1712, name: 'Tsim Sha Tsui' },
      { lat: 22.3364, lng: 114.1870, name: 'Wong Tai Sin' },
      { lat: 22.3120, lng: 114.2254, name: 'Kwun Tong' },
      { lat: 22.3814, lng: 114.1881, name: 'Sha Tin' },
      { lat: 22.3708, lng: 114.1133, name: 'Tsuen Wan' },
      { lat: 22.3217, lng: 114.2094, name: 'San Po Kong' },
      { lat: 22.3316, lng: 114.1625, name: 'Sham Shui Po' },
      { lat: 22.2948, lng: 114.1721, name: 'Jordan' },
      { lat: 22.2855, lng: 114.1492, name: 'Sheung Wan' },
      { lat: 22.2467, lng: 114.1722, name: 'Aberdeen' },
      { lat: 22.2700, lng: 114.1880, name: 'North Point' },
      { lat: 22.2630, lng: 114.2240, name: 'Chai Wan' },
      { lat: 22.3443, lng: 114.1591, name: 'Cheung Sha Wan' },
      { lat: 22.4444, lng: 114.0223, name: 'Tuen Mun' },
      { lat: 22.3940, lng: 114.1098, name: 'Kwai Fong' },
      { lat: 22.2515, lng: 114.1594, name: 'Pok Fu Lam' },
      { lat: 22.3725, lng: 114.1145, name: 'Tsuen Wan West' },
      { lat: 22.3964, lng: 114.2020, name: 'Tai Wai' },
      { lat: 22.3142, lng: 114.2195, name: 'Ngau Tau Kok' },
    ],
  },
  london: {
    name: 'London',
    currency: 'GBP',
    latRange: [51.3, 51.7],
    lngRange: [-0.5, 0.3],
    benchmark: 10, // £10 typical budget meal
    areas: [
      { lat: 51.5074, lng: -0.1278, name: 'Westminster' },
      { lat: 51.5155, lng: -0.1418, name: 'Soho' },
      { lat: 51.5194, lng: -0.0738, name: 'Shoreditch' },
      { lat: 51.5362, lng: -0.1033, name: 'Islington' },
      { lat: 51.5115, lng: -0.0561, name: 'Whitechapel' },
      { lat: 51.4974, lng: -0.1357, name: 'Victoria' },
      { lat: 51.5228, lng: -0.1547, name: 'Fitzrovia' },
      { lat: 51.5313, lng: -0.1244, name: 'Kings Cross' },
      { lat: 51.5117, lng: -0.1040, name: 'City of London' },
      { lat: 51.4613, lng: -0.1156, name: 'Brixton' },
      { lat: 51.4750, lng: -0.0377, name: 'Deptford' },
      { lat: 51.4650, lng: -0.0152, name: 'Lewisham' },
      { lat: 51.5466, lng: -0.0553, name: 'Hackney' },
      { lat: 51.5410, lng: -0.0024, name: 'Stratford' },
      { lat: 51.4875, lng: -0.1687, name: 'Earls Court' },
      { lat: 51.4923, lng: -0.2236, name: 'Hammersmith' },
      { lat: 51.5124, lng: -0.1880, name: 'Notting Hill' },
      { lat: 51.5530, lng: -0.1726, name: 'Camden' },
      { lat: 51.4627, lng: -0.1145, name: 'Camberwell' },
      { lat: 51.4816, lng: -0.0066, name: 'Greenwich' },
      { lat: 51.5033, lng: -0.0195, name: 'Canary Wharf' },
      { lat: 51.5558, lng: -0.0750, name: 'Stoke Newington' },
      { lat: 51.4451, lng: -0.1549, name: 'Tooting' },
    ],
  },
};

// ═══════════════════════════════════════════
// PHASE 1: Discover budget restaurants
// ═══════════════════════════════════════════

async function phase1_discover(city) {
  const cfg = CITIES[city];
  console.log(`\n═══ PHASE 1: Discover ${cfg.name} Budget Restaurants ═══\n`);

  const allPlaces = new Map();

  for (const area of cfg.areas) {
    console.log(`  Searching ${area.name}...`);

    // Use localized keywords for Asian cities
    const defaultKw = ['cheap eats', 'budget restaurant', 'value meal'];
    const cityKeywords = {
      tokyo: ['安い', 'ランチ', 'cheap eats', '定食'],
      hongkong: ['平價', '茶餐廳', '小食', 'cheap eats', 'cha chaan teng'],
      singapore: ['cheap eats', 'hawker', 'budget restaurant', 'value meal'],
    };
    const keywords = cityKeywords[city] || defaultKw;
    for (const kw of keywords) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=2500&type=restaurant&keyword=${encodeURIComponent(kw)}&key=${GOOGLE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      for (const place of (data.results || [])) {
        // Ingestion guard (P0-4): skip non-restaurants. Google Places sometimes
        // returns hostels, malls, bookstores, etc. when keyword search hits a
        // chain name. Reject if any clearly non-food primary type is present
        // AND no restaurant/cafe/food type.
        if (!isLikelyRestaurant(place)) continue;
        if (!allPlaces.has(place.place_id)) {
          allPlaces.set(place.place_id, {
            google_place_id: place.place_id,
            name: place.name,
            lat: place.geometry?.location?.lat,
            lng: place.geometry?.location?.lng,
            rating: place.rating,
            totalReviews: place.user_ratings_total,
            priceLevel: place.price_level,
            types: place.types,
            vicinity: place.vicinity,
          });
        }
      }

      // Also general restaurant search for popular local spots
      if (kw === 'cheap eats') {
        const url2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=1500&type=restaurant&key=${GOOGLE_KEY}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        for (const place of (data2.results || [])) {
          if (!isLikelyRestaurant(place)) continue;
          if (!allPlaces.has(place.place_id) && (place.price_level == null || place.price_level <= 2)) {
            allPlaces.set(place.place_id, {
              google_place_id: place.place_id,
              name: place.name,
              lat: place.geometry?.location?.lat,
              lng: place.geometry?.location?.lng,
              rating: place.rating,
              totalReviews: place.user_ratings_total,
              priceLevel: place.price_level,
              types: place.types,
              vicinity: place.vicinity,
            });
          }
        }
      }

      await sleep(200);
    }

    console.log(`    Found ${allPlaces.size} unique restaurants so far`);
    if (allPlaces.size >= 600) {
      console.log('  Reached target, stopping search');
      break;
    }
  }

  const sorted = [...allPlaces.values()]
    .filter(p => p.rating >= 3.5 && p.totalReviews >= 10)
    .sort((a, b) => (b.rating * Math.log(b.totalReviews + 1)) - (a.rating * Math.log(a.totalReviews + 1)))
    .slice(0, 500);

  console.log(`\n  Total discovered: ${allPlaces.size}`);
  console.log(`  After quality filter: ${sorted.length}`);

  const outPath = new URL(`../${city}-places.json`, import.meta.url);
  writeFileSync(outPath, JSON.stringify(sorted, null, 2));
  console.log(`  Saved to ${city}-places.json`);

  return sorted;
}

// ═══════════════════════════════════════════
// PHASE 2: Fetch details & store in Supabase
// ═══════════════════════════════════════════

async function phase2_fetchAndStore(city) {
  const cfg = CITIES[city];
  console.log(`\n═══ PHASE 2: Fetch Details & Store (${cfg.name}) ═══\n`);

  let places;
  try {
    places = JSON.parse(readFileSync(new URL(`../${city}-places.json`, import.meta.url), 'utf8'));
  } catch {
    console.error('  Run phase 1 first');
    return;
  }

  // Check existing
  const [latMin, latMax] = cfg.latRange;
  const [lngMin, lngMax] = cfg.lngRange;
  const existing = await supaFetch(
    `restaurants?select=external_ids&lat=gte.${latMin}&lat=lte.${latMax}&lng=gte.${lngMin}&lng=lte.${lngMax}&limit=2000`
  );
  const existingIds = new Set((existing || []).map(r => r.external_ids?.google_place_id).filter(Boolean));

  const toFetch = places.filter(p => !existingIds.has(p.google_place_id));
  console.log(`  Total places: ${places.length}`);
  console.log(`  Already in DB: ${existingIds.size}`);
  console.log(`  Need to fetch: ${toFetch.length}`);

  let stored = 0, errors = 0;

  const priceLevelMap = { 0: 5, 1: 12, 2: 20, 3: 35 };
  // Tokyo/Singapore use local currency
  const priceLevelMapJPY = { 0: 500, 1: 800, 2: 1200, 3: 2500 };
  const priceLevelMapSGD = { 0: 4, 1: 8, 2: 15, 3: 30 };

  function getAvgPrice(priceLevel) {
    if (cfg.currency === 'JPY') return priceLevelMapJPY[priceLevel] ?? 1000;
    if (cfg.currency === 'SGD') return priceLevelMapSGD[priceLevel] ?? 10;
    return priceLevelMap[priceLevel] ?? 15;
  }

  for (let i = 0; i < toFetch.length; i++) {
    const place = toFetch[i];
    if ((i + 1) % 50 === 0) {
      console.log(`  [${i + 1}/${toFetch.length}] ${stored} stored, ${errors} errors`);
    }

    try {
      const fields = 'name,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,reviews,photos,formatted_address';
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.google_place_id}&fields=${fields}&reviews_sort=newest&language=en&key=${GOOGLE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const details = data.result;
      if (!details) { errors++; continue; }

      const avgPrice = getAvgPrice(place.priceLevel);
      const restaurantId = randomUUID();

      // Parse operating hours
      let operatingHours = null;
      if (details.opening_hours?.periods) {
        const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        operatingHours = {};
        for (const period of details.opening_hours.periods) {
          const day = dayMap[period.open?.day];
          if (day && period.open?.time && period.close?.time) {
            operatingHours[day] = {
              open: period.open.time.replace(/(\d{2})(\d{2})/, '$1:$2'),
              close: period.close.time.replace(/(\d{2})(\d{2})/, '$1:$2'),
            };
          }
        }
      }

      await supaFetch('restaurants', {
        method: 'POST',
        prefer: 'return=minimal',
        body: {
          id: restaurantId,
          external_ids: { google_place_id: place.google_place_id },
          name: { en: details.name || place.name, original: details.name || place.name },
          slug: (details.name || place.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 70) + '-' + restaurantId.slice(0, 6),
          lat: place.lat,
          lng: place.lng,
          cuisine_type: (place.types || []).filter(t => !['point_of_interest', 'establishment', 'food'].includes(t)),
          avg_meal_price: avgPrice,
          price_currency: cfg.currency,
          value_score: computeValueScore(avgPrice, place.rating, place.totalReviews, place.priceLevel),
          total_reviews: details.user_ratings_total || place.totalReviews || 0,
          phone: details.formatted_phone_number || null,
          website: details.website || null,
          operating_hours: operatingHours,
          address: { en: details.formatted_address || place.vicinity, original: details.formatted_address || place.vicinity },
          source: 'google_places',
          is_chain: false,
        },
      });

      // Store reviews
      const reviews = (details.reviews || []).slice(0, 10);
      if (reviews.length > 0) {
        await supaFetch('reviews', {
          method: 'POST',
          prefer: 'return=minimal',
          body: reviews.map(rev => ({
            id: randomUUID(),
            restaurant_id: restaurantId,
            content: rev.text || '',
            taste_rating: rev.rating || 4,
            value_rating: rev.rating || 4,
            language: rev.language || 'en',
            created_at: rev.time ? new Date(rev.time * 1000).toISOString() : new Date().toISOString(),
          })),
        });
      }

      // Store photos
      const photos = (details.photos || []).slice(0, 10);
      if (photos.length > 0) {
        await supaFetch('menu_photos', {
          method: 'POST',
          prefer: 'return=minimal',
          body: photos.map((photo, idx) => {
            const ratio = (photo.width || 1) / (photo.height || 1);
            return {
              id: randomUUID(),
              restaurant_id: restaurantId,
              photo_url: `gphoto:${photo.photo_reference}`,
              ai_processed: true,
              ai_confidence: 0.7,
              ai_language_detected: ratio < 0.85 ? 'menu' : (idx === 0 ? 'exterior' : 'dish'),
              created_at: new Date().toISOString(),
            };
          }),
        });
      }

      stored++;
      await sleep(250);
    } catch (err) {
      errors++;
      if (errors <= 5) console.error(`  Error: ${err.message}`);
    }
  }

  console.log(`\n  ✓ Stored ${stored} restaurants, ${errors} errors`);
}

function computeValueScore(avgPrice, rating, totalReviews, priceLevel) {
  let score = 3.0;
  if (rating >= 4.5) score += 0.8;
  else if (rating >= 4.0) score += 0.5;
  else if (rating >= 3.5) score += 0.2;
  if (priceLevel === 0) score += 0.8;
  else if (priceLevel === 1) score += 0.6;
  else if (priceLevel === 2) score += 0.3;
  if (totalReviews >= 1000) score += 0.3;
  else if (totalReviews >= 500) score += 0.2;
  else if (totalReviews >= 100) score += 0.1;
  return Math.min(5.0, Math.round(score * 100) / 100);
}

// ═══════════════════════════════════════════
// PHASE 3: Optimized menu extraction (Haiku Vision)
//
// Key optimizations vs v1:
// 1. Image 600px (not 1200px) — 40% fewer tokens, menu text still readable
// 2. Send ALL photos (up to 10) — let Haiku find menus, not aspect-ratio heuristic
// 3. Skip restaurants with 3+ existing menu items (good enough)
// 4. Skip images > 4MB to avoid API errors
// 5. Batch of 5 parallel requests
// ═══════════════════════════════════════════

async function phase3_extractMenus(city) {
  const cfg = CITIES[city];
  console.log(`\n═══ PHASE 3: Extract Menus — ${cfg.name} (Optimized) ═══\n`);

  if (!ANTHROPIC_KEY) {
    console.error('  ANTHROPIC_API_KEY not set');
    return;
  }

  const [latMin, latMax] = cfg.latRange;
  const [lngMin, lngMax] = cfg.lngRange;

  const restaurants = await supaFetch(
    `restaurants?select=id,name,avg_meal_price,price_currency,lat,lng&lat=gte.${latMin}&lat=lte.${latMax}&lng=gte.${lngMin}&lng=lte.${lngMax}&order=total_reviews.desc&limit=600`
  );

  console.log(`  Found ${restaurants.length} ${cfg.name} restaurants`);

  let processed = 0, menuFound = 0, skipped = 0, errors = 0;

  async function processOne(rest) {
    try {
      // Skip if already has 3+ menu items (good enough quality)
      const existing = await supaFetch(`menu_items?select=id&restaurant_id=eq.${rest.id}&limit=3`);
      if (existing?.length >= 3) {
        skipped++;
        return;
      }

      // Delete low-quality existing items (1-2 items) to re-extract
      if (existing?.length > 0 && existing.length < 3) {
        await supaFetch(`menu_items?restaurant_id=eq.${rest.id}`, {
          method: 'DELETE',
        });
      }

      // Get reviews
      const reviews = await supaFetch(
        `reviews?select=content,taste_rating&restaurant_id=eq.${rest.id}&order=created_at.desc&limit=10`
      );
      const reviewText = (reviews || []).map(r => r.content).filter(Boolean).join('\n---\n');

      // Get ALL photos (not just "menu" tagged) — let Haiku decide
      const photos = await supaFetch(
        `menu_photos?select=photo_url&restaurant_id=eq.${rest.id}&limit=10`
      );
      const allPhotos = (photos || []).filter(p => p.photo_url?.startsWith('gphoto:'));

      // Skip if no photos AND no reviews
      if (allPhotos.length === 0 && !reviewText) return;

      // Build image URLs — 600px instead of 1200px (saves ~40% tokens)
      const imageUrls = allPhotos.slice(0, 10).map(p => {
        const ref = p.photo_url.slice(7);
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${ref}&key=${GOOGLE_KEY}`;
      });

      // Build Haiku request
      const content = [];

      if (reviewText) {
        content.push({
          type: 'text',
          text: `CUSTOMER REVIEWS:\n${reviewText.slice(0, 3000)}`,
        });
      }

      // Download images — skip those > 4MB
      for (const url of imageUrls) {
        try {
          const imgRes = await fetch(url, { redirect: 'follow' });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            if (buffer.byteLength > 4 * 1024 * 1024) continue; // skip > 4MB
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            content.push({
              type: 'image',
              source: { type: 'base64', media_type: contentType, data: base64 },
            });
          }
        } catch {}
      }

      const currencyHint = cfg.currency === 'JPY' ? '¥800, ¥1200' :
                           cfg.currency === 'SGD' ? 'S$5, $8.50' : '$12, $9.50';

      content.push({
        type: 'text',
        text: `Look at ALL images above. Some may be menu boards, price lists, or chalkboards — extract every item with a price from those.
For non-menu images (food photos, exterior, interior), ignore them.
From reviews, extract items where a specific price is mentioned (e.g. "${currencyHint}").

Include the item name in English. If originally in another language, provide both.

Respond ONLY with a JSON array:
[{"name": "Item Name", "name_local": "Local name or null", "price": 12.99, "currency": "${cfg.currency}", "category": "main|appetizer|drink|dessert|side|set_meal"}]

If NO prices found, respond with: []`,
      });

      // Call Haiku
      const haikuRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{ role: 'user', content }],
        }),
      });

      if (!haikuRes.ok) {
        const err = await haikuRes.text();
        throw new Error(`Haiku ${haikuRes.status}: ${err.slice(0, 200)}`);
      }

      const haikuData = await haikuRes.json();
      const responseText = haikuData.content?.[0]?.text || '[]';

      // Parse response
      let menuItems = [];
      try {
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        menuItems = JSON.parse(cleaned);
      } catch {
        const match = responseText.match(/\[[\s\S]*\]/);
        if (match) {
          try { menuItems = JSON.parse(match[0]); } catch {}
        }
      }

      // Filter invalid items
      if (Array.isArray(menuItems)) {
        menuItems = menuItems.filter(item => item.price != null && item.price > 0 && item.name);
      }

      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const itemRows = menuItems.slice(0, 40).map(item => ({
          id: randomUUID(),
          restaurant_id: rest.id,
          name: { en: item.name, original: item.name_local || item.name },
          price: item.price,
          currency: item.currency || cfg.currency,
          category: item.category || 'main',
          source: 'ai_photo_extract',
          last_verified: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        await supaFetch('menu_items', {
          method: 'POST',
          prefer: 'return=minimal',
          body: itemRows,
        });

        menuFound++;
        console.log(`    ✓ ${rest.name?.en || rest.name}: ${menuItems.length} items`);
      }

    } catch (err) {
      errors++;
      if (errors <= 10) console.error(`  Error on ${rest.name?.en}: ${err.message}`);
    }
  }

  // Process in batches of 5 for parallelism
  const BATCH_SIZE = 5;
  for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
    const batch = restaurants.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(r => processOne(r)));
    processed += batch.length;
    if (processed % 25 < BATCH_SIZE) {
      console.log(`  [${processed}/${restaurants.length}] ${menuFound} menus, ${skipped} skipped, ${errors} errors`);
    }
  }

  console.log(`\n═══ PHASE 3 Complete (${cfg.name}) ═══`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Menus extracted: ${menuFound}`);
  console.log(`  Skipped (already good): ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

// ═══════════════════════════════════════════
// Main
// ═══════════════════════════════════════════

const cityArg = process.argv[2];
const phaseArg = process.argv[3] || 'all';

if (!cityArg || !CITIES[cityArg]) {
  console.error(`Usage: node scripts/city-pipeline.mjs <city> <phase>`);
  console.error(`Cities: ${Object.keys(CITIES).join(', ')}`);
  console.error(`Phases: 1 (discover), 2 (fetch+store), 3 (menus), all`);
  process.exit(1);
}

async function main() {
  const cfg = CITIES[cityArg];
  console.log('╔════════════════════════════════════════╗');
  console.log(`║  ${cfg.name.padEnd(37)}║`);
  console.log('╚════════════════════════════════════════╝');

  if (phaseArg === '1' || phaseArg === 'all') await phase1_discover(cityArg);
  if (phaseArg === '2' || phaseArg === 'all') await phase2_fetchAndStore(cityArg);
  if (phaseArg === '3' || phaseArg === 'all') await phase3_extractMenus(cityArg);

  console.log('\n✓ Pipeline complete');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
