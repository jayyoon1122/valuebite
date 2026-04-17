/**
 * NYC Menu Extraction Pipeline
 *
 * Phase 1: Discover 500 budget restaurants in NYC via Google Places
 * Phase 2: Fetch details (reviews, photos) for each
 * Phase 3: Store in Supabase
 * Phase 4: Extract menus via Haiku Vision (reviews + menu photos)
 *
 * Usage: node scripts/nyc-pipeline.mjs [phase]
 *   phase 1 = discover restaurants
 *   phase 2 = fetch details + store
 *   phase 3 = extract menus (Haiku)
 *   all     = run all phases
 */

import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { writeFileSync } from 'fs';

// Load env
const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const GOOGLE_KEY = env.GOOGLE_PLACES_API_KEY;
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
// PHASE 1: Discover NYC budget restaurants
// ═══════════════════════════════════════════

// NYC neighborhoods with good budget dining
const NYC_SEARCH_AREAS = [
  // Manhattan
  { lat: 40.7580, lng: -73.9855, name: 'Midtown' },
  { lat: 40.7282, lng: -73.7942, name: 'East Village' },
  { lat: 40.7193, lng: -73.9951, name: 'Chinatown' },
  { lat: 40.7484, lng: -73.9967, name: 'Hell\'s Kitchen' },
  { lat: 40.8075, lng: -73.9626, name: 'Harlem' },
  { lat: 40.7359, lng: -73.9911, name: 'Greenwich Village' },
  { lat: 40.7614, lng: -73.9776, name: 'Columbus Circle' },
  { lat: 40.7831, lng: -73.9712, name: 'Upper West Side' },
  { lat: 40.7681, lng: -73.9614, name: 'Upper East Side' },
  { lat: 40.7127, lng: -74.0060, name: 'Financial District' },
  // Brooklyn
  { lat: 40.6892, lng: -73.9857, name: 'Downtown Brooklyn' },
  { lat: 40.6872, lng: -73.9418, name: 'Bed-Stuy' },
  { lat: 40.6782, lng: -73.9442, name: 'Crown Heights' },
  { lat: 40.7081, lng: -73.9571, name: 'Williamsburg' },
  { lat: 40.6501, lng: -73.9496, name: 'Flatbush' },
  { lat: 40.6340, lng: -73.9790, name: 'Sunset Park' },
  // Queens
  { lat: 40.7433, lng: -73.8235, name: 'Flushing' },
  { lat: 40.7498, lng: -73.8758, name: 'Jackson Heights' },
  { lat: 40.7557, lng: -73.8831, name: 'Elmhurst' },
  { lat: 40.7282, lng: -73.7949, name: 'Fresh Meadows' },
  { lat: 40.7561, lng: -73.8439, name: 'Corona' },
  // Bronx
  { lat: 40.8448, lng: -73.8648, name: 'Bronx - Fordham' },
  // Staten Island
  { lat: 40.6424, lng: -74.0764, name: 'Staten Island' },
];

async function searchGooglePlaces(lat, lng, radius = 2000) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=budget+cheap+value&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const results = data.results || [];

  // Get next page if available
  let allResults = [...results];
  if (data.next_page_token) {
    await sleep(2000); // Google requires delay for next_page_token
    const url2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_KEY}`;
    const res2 = await fetch(url2);
    const data2 = await res2.json();
    allResults = allResults.concat(data2.results || []);
  }

  return allResults;
}

async function phase1_discover() {
  console.log('\n═══ PHASE 1: Discover NYC Budget Restaurants ═══\n');

  const allPlaces = new Map(); // dedup by place_id

  for (const area of NYC_SEARCH_AREAS) {
    console.log(`  Searching ${area.name}...`);

    // Search with different keywords to find budget spots
    const keywords = ['cheap eats', 'budget restaurant', 'value meal'];
    for (const kw of keywords) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=2500&type=restaurant&keyword=${encodeURIComponent(kw)}&key=${GOOGLE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      for (const place of (data.results || [])) {
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

      // Also search without keyword (just "restaurant") to get popular local spots
      if (kw === 'cheap eats') {
        const url2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${area.lat},${area.lng}&radius=1500&type=restaurant&key=${GOOGLE_KEY}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        for (const place of (data2.results || [])) {
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

  // Sort by rating * reviews (popularity), take top 500
  const sorted = [...allPlaces.values()]
    .filter(p => p.rating >= 3.5 && p.totalReviews >= 10) // minimum quality
    .sort((a, b) => (b.rating * Math.log(b.totalReviews + 1)) - (a.rating * Math.log(a.totalReviews + 1)))
    .slice(0, 500);

  console.log(`\n  Total discovered: ${allPlaces.size}`);
  console.log(`  After quality filter: ${sorted.length}`);

  // Save to file for Phase 2
  writeFileSync(
    new URL('../scripts/nyc-places.json', import.meta.url),
    JSON.stringify(sorted, null, 2)
  );
  console.log('  Saved to scripts/nyc-places.json');

  return sorted;
}

// ═══════════════════════════════════════════
// PHASE 2: Fetch details & store in Supabase
// ═══════════════════════════════════════════

async function fetchPlaceDetails(placeId) {
  const fields = 'name,formatted_phone_number,website,rating,user_ratings_total,price_level,opening_hours,reviews,photos,editorial_summary,formatted_address';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&reviews_sort=newest&language=en&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || null;
}

function computeValueScore(avgPrice, rating, totalReviews, priceLevel) {
  // Value score: high rating + low price + many reviews = great value
  let score = 3.0; // base

  if (rating >= 4.5) score += 0.8;
  else if (rating >= 4.0) score += 0.5;
  else if (rating >= 3.5) score += 0.2;

  if (priceLevel === 1) score += 0.6;
  else if (priceLevel === 2) score += 0.3;
  else if (priceLevel === 0) score += 0.8;

  if (totalReviews >= 1000) score += 0.3;
  else if (totalReviews >= 500) score += 0.2;
  else if (totalReviews >= 100) score += 0.1;

  return Math.min(5.0, Math.round(score * 100) / 100);
}

async function phase2_fetchAndStore() {
  console.log('\n═══ PHASE 2: Fetch Details & Store ═══\n');

  let places;
  try {
    places = JSON.parse(readFileSync(new URL('../scripts/nyc-places.json', import.meta.url), 'utf8'));
  } catch {
    console.error('  Run phase 1 first');
    return;
  }

  // Check which ones we already have
  const existing = await supaFetch('restaurants?select=external_ids&lat=gte.40.4&lat=lte.41.0&lng=gte.-74.3&lng=lte.-73.7&limit=1000');
  const existingIds = new Set((existing || []).map(r => r.external_ids?.google_place_id).filter(Boolean));

  const toFetch = places.filter(p => !existingIds.has(p.google_place_id));
  console.log(`  Total places: ${places.length}`);
  console.log(`  Already in DB: ${existingIds.size}`);
  console.log(`  Need to fetch: ${toFetch.length}`);

  let stored = 0, errors = 0;

  for (let i = 0; i < toFetch.length; i++) {
    const place = toFetch[i];

    if ((i + 1) % 50 === 0) {
      console.log(`  [${i + 1}/${toFetch.length}] ${stored} stored, ${errors} errors`);
    }

    try {
      const details = await fetchPlaceDetails(place.google_place_id);
      if (!details) { errors++; continue; }

      const avgPrice = place.priceLevel === 0 ? 5 :
                       place.priceLevel === 1 ? 12 :
                       place.priceLevel === 2 ? 20 :
                       place.priceLevel === 3 ? 35 : 15;

      const restaurantId = randomUUID();

      // Parse operating hours
      let operatingHours = null;
      if (details.opening_hours?.periods) {
        const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        operatingHours = {};
        for (const period of details.opening_hours.periods) {
          const day = dayMap[period.open?.day];
          if (day && period.open?.time && period.close?.time) {
            const openTime = period.open.time.replace(/(\d{2})(\d{2})/, '$1:$2');
            const closeTime = period.close.time.replace(/(\d{2})(\d{2})/, '$1:$2');
            operatingHours[day] = { open: openTime, close: closeTime };
          }
        }
      }

      // Store restaurant
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
          price_currency: 'USD',
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
        const reviewRows = reviews.map(rev => ({
          id: randomUUID(),
          restaurant_id: restaurantId,
          content: rev.text || '',
          taste_rating: rev.rating || 4,
          value_rating: rev.rating || 4,
          language: rev.language || 'en',
          created_at: rev.time ? new Date(rev.time * 1000).toISOString() : new Date().toISOString(),
        }));

        await supaFetch('reviews', {
          method: 'POST',
          prefer: 'return=minimal',
          body: reviewRows,
        });
      }

      // Store photos (as gphoto: references)
      const photos = (details.photos || []).slice(0, 10);
      if (photos.length > 0) {
        const photoRows = photos.map((photo, idx) => {
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
        });

        await supaFetch('menu_photos', {
          method: 'POST',
          prefer: 'return=minimal',
          body: photoRows,
        });
      }

      stored++;
      await sleep(250); // Rate limiting

    } catch (err) {
      errors++;
      if (errors <= 5) console.error(`  Error: ${err.message}`);
    }
  }

  console.log(`\n  ✓ Stored ${stored} restaurants, ${errors} errors`);
}

// ═══════════════════════════════════════════
// PHASE 3: Menu extraction via Haiku Vision
// ═══════════════════════════════════════════

async function phase3_extractMenus() {
  console.log('\n═══ PHASE 3: Extract Menus (Haiku Vision) ═══\n');

  if (!ANTHROPIC_KEY) {
    console.error('  ANTHROPIC_API_KEY not set');
    return;
  }

  // Get all NYC restaurants
  const restaurants = await supaFetch(
    'restaurants?select=id,name,avg_meal_price,price_currency,lat,lng&lat=gte.40.4&lat=lte.41.0&lng=gte.-74.3&lng=lte.-73.7&order=total_reviews.desc&limit=500'
  );

  console.log(`  Found ${restaurants.length} NYC restaurants`);

  let processed = 0, menuFound = 0, errors = 0;

  async function processOne(rest) {
    try {
      // Check if we already have menu items
      const existing = await supaFetch(`menu_items?select=id&restaurant_id=eq.${rest.id}&limit=1`);
      if (existing?.length > 0) {
        return; // Already has menu data
      }

      // Get reviews
      const reviews = await supaFetch(
        `reviews?select=content,taste_rating&restaurant_id=eq.${rest.id}&order=created_at.desc&limit=10`
      );
      const reviewText = (reviews || []).map(r => r.content).filter(Boolean).join('\n---\n');

      // Get photos
      const photos = await supaFetch(
        `menu_photos?select=photo_url,ai_language_detected&restaurant_id=eq.${rest.id}&order=ai_language_detected.asc&limit=10`
      );

      // Pick up to 5 menu-candidate photos
      const menuCandidates = (photos || [])
        .filter(p => p.ai_language_detected === 'menu' && p.photo_url?.startsWith('gphoto:'))
        .slice(0, 5);

      // If no menu candidates, pick first 3 photos anyway
      const photosToSend = menuCandidates.length > 0 ? menuCandidates :
        (photos || []).filter(p => p.photo_url?.startsWith('gphoto:')).slice(0, 3);

      // Skip if no photos AND no reviews
      if (photosToSend.length === 0 && !reviewText) return;

      // Build image URLs
      const imageUrls = photosToSend.map(p => {
        const ref = p.photo_url.slice(7);
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${ref}&key=${GOOGLE_KEY}`;
      });

      // Build Haiku request
      const content = [];

      // Add review text
      if (reviewText) {
        content.push({
          type: 'text',
          text: `CUSTOMER REVIEWS:\n${reviewText.slice(0, 3000)}`,
        });
      }

      // Add images (download and convert to base64)
      for (const url of imageUrls) {
        try {
          const imgRes = await fetch(url, { redirect: 'follow' });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            content.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: contentType,
                data: base64,
              },
            });
          }
        } catch {}
      }

      content.push({
        type: 'text',
        text: `Extract menu items with prices from the images and reviews above.

RULES:
- Extract all menu items that have prices visible in menu board/card images.
- From reviews, extract items where a price is mentioned (e.g. "the burger is $12", "pad thai $9.50", "combo for $15").
- Include the item name in English. If originally in another language, provide both.
- Use the price as shown — do not round or estimate.

Respond ONLY with a JSON array (no markdown, no explanation):
[{"name": "Item Name", "name_local": "Local name or null", "price": 12.99, "currency": "USD", "category": "main|appetizer|drink|dessert|side|set_meal"}]

If NO prices found at all, respond with: []`,
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
        throw new Error(`Haiku ${haikuRes.status}: ${err}`);
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

      // Store menu items (filter out items without price)
      if (Array.isArray(menuItems)) {
        menuItems = menuItems.filter(item => item.price != null && item.price > 0 && item.name);
      }
      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const itemRows = menuItems.slice(0, 30).map(item => ({
          id: randomUUID(),
          restaurant_id: rest.id,
          name: { en: item.name, original: item.name_local || item.name },
          price: item.price,
          currency: item.currency || 'USD',
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

  // Process in batches of 3 for parallelism
  const BATCH_SIZE = 3;
  for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
    const batch = restaurants.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(r => processOne(r)));
    processed += batch.length;
    if (processed % 25 < BATCH_SIZE) {
      console.log(`  [${processed}/${restaurants.length}] ${menuFound} menus found, ${errors} errors`);
    }
  }

  console.log(`\n═══ PHASE 3 Complete ═══`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Menus found: ${menuFound}`);
  console.log(`  Errors: ${errors}`);
}

// ═══════════════════════════════════════════
// Main
// ═══════════════════════════════════════════

const phase = process.argv[2] || 'all';

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  NYC Menu Extraction Pipeline          ║');
  console.log('╚════════════════════════════════════════╝');

  if (phase === '1' || phase === 'all') {
    await phase1_discover();
  }

  if (phase === '2' || phase === 'all') {
    await phase2_fetchAndStore();
  }

  if (phase === '3' || phase === 'all') {
    await phase3_extractMenus();
  }

  console.log('\n✓ Pipeline complete');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
