/**
 * Fetch more photos for restaurants that have fewer than 10
 * Also re-categorize photos properly
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

function getPhotoUrl(ref, width = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photo_reference=${ref}&key=${API_KEY}`;
}

async function fetchPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result?.photos || [];
}

async function main() {
  console.log('📸 Fetching more photos for restaurants...\n');

  // Get all restaurants with their google_place_id
  const restaurants = await supaFetch(
    'restaurants?source=eq.google_places&select=id,name,external_ids&limit=2000'
  );

  console.log(`Total restaurants: ${restaurants.length}`);

  let updated = 0, skipped = 0;

  for (let i = 0; i < restaurants.length; i++) {
    const r = restaurants[i];
    const placeId = r.external_ids?.google_place_id;
    if (!placeId) { skipped++; continue; }

    // Check current photo count
    const photos = await supaFetch(`menu_photos?restaurant_id=eq.${r.id}&select=count`);
    const currentCount = photos[0]?.count || 0;

    if (currentCount >= 8) { skipped++; continue; } // Already has enough

    // Fetch photos from Google
    const googlePhotos = await fetchPlacePhotos(placeId);
    if (googlePhotos.length === 0) { skipped++; continue; }

    // Delete existing photos (will replace with more)
    await supaDelete(`menu_photos?restaurant_id=eq.${r.id}`);

    // Insert up to 10 photos with proper categories
    const maxPhotos = Math.min(googlePhotos.length, 10);
    for (let j = 0; j < maxPhotos; j++) {
      const photo = googlePhotos[j];
      await supaInsert('menu_photos', {
        restaurant_id: r.id,
        photo_url: getPhotoUrl(photo.photo_reference),
        ai_language_detected: CATEGORIES[j] || 'dish',
        ai_processed: true,
        ai_confidence: '0.85',
      });
    }

    updated++;
    if ((i + 1) % 50 === 0) {
      console.log(`[${i + 1}/${restaurants.length}] ${updated} updated, ${skipped} skipped`);
    }

    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`\n✅ Done: ${updated} restaurants updated with more photos, ${skipped} skipped`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
