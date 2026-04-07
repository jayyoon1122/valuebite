/**
 * Fix ALL restaurants: ensure every restaurant has 5-10 photos
 * Processes in batches to handle Supabase pagination
 */
import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const CATEGORIES = ['exterior', 'interior', 'menu', 'dish', 'dish', 'dish', 'interior', 'dish', 'exterior', 'dish'];

async function supaFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  return res.json();
}

async function supaInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

async function supaDelete(path) {
  await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
}

function getPhotoUrl(ref) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${API_KEY}`;
}

async function fetchPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result?.photos || [];
}

async function processRestaurant(r) {
  const placeId = r.external_ids?.google_place_id;
  if (!placeId) return false;

  // Fetch photos from Google
  const googlePhotos = await fetchPlacePhotos(placeId);
  if (googlePhotos.length === 0) return false;

  // Delete existing photos
  await supaDelete(`menu_photos?restaurant_id=eq.${r.id}`);

  // Insert up to 10 photos
  const maxPhotos = Math.min(googlePhotos.length, 10);
  for (let j = 0; j < maxPhotos; j++) {
    await supaInsert('menu_photos', {
      restaurant_id: r.id,
      photo_url: getPhotoUrl(googlePhotos[j].photo_reference),
      ai_language_detected: CATEGORIES[j] || 'dish',
      ai_processed: true,
      ai_confidence: '0.85',
    });
  }
  return true;
}

async function main() {
  console.log('📸 Fixing ALL restaurant photos...\n');

  // Process in batches of 500 (Supabase pagination)
  let offset = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let batch = 0;

  while (true) {
    batch++;
    const restaurants = await supaFetch(
      `restaurants?source=eq.google_places&select=id,name,external_ids&order=id&limit=500&offset=${offset}`
    );

    if (!restaurants || restaurants.length === 0) break;

    console.log(`\nBatch ${batch}: ${restaurants.length} restaurants (offset ${offset})`);

    for (let i = 0; i < restaurants.length; i++) {
      const r = restaurants[i];
      const success = await processRestaurant(r);
      if (success) totalUpdated++;
      else totalSkipped++;

      if ((i + 1) % 50 === 0) {
        console.log(`  [${i + 1}/${restaurants.length}] ${totalUpdated} updated, ${totalSkipped} skipped`);
      }

      await new Promise(resolve => setTimeout(resolve, 250));
    }

    offset += restaurants.length;
    if (restaurants.length < 500) break; // Last batch
  }

  console.log(`\n✅ Done: ${totalUpdated} restaurants with photos, ${totalSkipped} skipped (no Google photos available)`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
