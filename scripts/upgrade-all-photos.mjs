/**
 * Upgrade ALL restaurants to 10 photos each using Google Places API.
 * Uses photo metadata (width/height) for smarter categorization.
 * Processes in batches with Supabase pagination.
 *
 * Targets: restaurants with <8 photos (skips those already at 8+).
 * Deletes old photos and replaces with fresh set of up to 10.
 */
import 'dotenv/config';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: GOOGLE_PLACES_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY');
  process.exit(1);
}

/**
 * Categorize photo using Google Places metadata (width/height)
 */
function categorizeFromMetadata(photo, index) {
  const { width = 1, height = 1 } = photo;
  const ratio = width / height;

  if (index === 0) return 'exterior';
  if (ratio < 0.77) return 'menu';
  if (ratio > 1.8) return 'interior';
  if (index === 1) return 'interior';
  return 'dish';
}

async function supaFetch(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase GET failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function supaInsertBatch(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    if (errText && !supaInsertBatch._errorLogged) {
      console.warn(`  Insert error (${res.status}): ${errText.slice(0, 200)}`);
      supaInsertBatch._errorLogged = true;
    }
  }
  return res.ok;
}
supaInsertBatch._errorLogged = false;

async function supaDelete(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  return res.ok;
}

async function fetchPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    if (data.status === 'OVER_QUERY_LIMIT') throw new Error('OVER_QUERY_LIMIT');
    console.warn(`  Google API status: ${data.status} for ${placeId}`);
  }
  return data.result?.photos || [];
}

/**
 * Store only the photo_reference (not the full URL with API key).
 * The API route reconstructs the full URL at read time.
 * This avoids the VARCHAR(500) limit and keeps API keys out of the DB.
 */
function getPhotoUrl(ref) {
  return `gphoto:${ref}`;
}

async function getRestaurantPhotoCounts() {
  // Get all photo counts grouped by restaurant_id
  const counts = {};
  let offset = 0;
  while (true) {
    const photos = await supaFetch(`menu_photos?select=restaurant_id&limit=1000&offset=${offset}`);
    if (!photos || photos.length === 0) break;
    photos.forEach(p => { counts[p.restaurant_id] = (counts[p.restaurant_id] || 0) + 1; });
    offset += photos.length;
    if (photos.length < 1000) break;
  }
  return counts;
}

async function main() {
  console.log('=== Restaurant Photo Upgrade ===\n');

  // Step 1: Get all restaurants
  console.log('Step 1: Fetching all restaurants...');
  const allRestaurants = [];
  let offset = 0;
  while (true) {
    const batch = await supaFetch(
      `restaurants?source=eq.google_places&select=id,name,external_ids&order=id&limit=500&offset=${offset}`
    );
    if (!batch || batch.length === 0) break;
    allRestaurants.push(...batch);
    offset += batch.length;
    if (batch.length < 500) break;
  }
  console.log(`  Total restaurants: ${allRestaurants.length}`);

  // Step 2: Get current photo counts
  console.log('Step 2: Checking current photo counts...');
  const photoCounts = await getRestaurantPhotoCounts();

  const needUpgrade = allRestaurants.filter(r => {
    const count = photoCounts[r.id] || 0;
    const hasPlaceId = !!r.external_ids?.google_place_id;
    return hasPlaceId && count < 8;
  });

  const alreadyGood = allRestaurants.length - needUpgrade.length;
  console.log(`  Already have 8+ photos: ${alreadyGood}`);
  console.log(`  Need upgrade: ${needUpgrade.length}`);

  if (needUpgrade.length === 0) {
    console.log('\nAll restaurants already have enough photos!');
    return;
  }

  // Step 3: Process restaurants
  console.log(`\nStep 3: Upgrading ${needUpgrade.length} restaurants...\n`);

  let updated = 0, skipped = 0, errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < needUpgrade.length; i++) {
    const r = needUpgrade[i];
    const placeId = r.external_ids?.google_place_id;
    const name = r.name?.en || r.name?.original || r.id;

    try {
      const googlePhotos = await fetchPlacePhotos(placeId);

      if (googlePhotos.length === 0) {
        skipped++;
        continue;
      }

      // Delete existing photos for this restaurant
      await supaDelete(`menu_photos?restaurant_id=eq.${r.id}`);

      // Build batch of photo rows
      const maxPhotos = Math.min(googlePhotos.length, 10);
      const photoRows = [];
      for (let j = 0; j < maxPhotos; j++) {
        const photo = googlePhotos[j];
        photoRows.push({
          restaurant_id: r.id,
          photo_url: getPhotoUrl(photo.photo_reference),
          ai_language_detected: categorizeFromMetadata(photo, j),
          ai_processed: true,
          ai_confidence: 0.85,
        });
      }

      // Insert all photos in one batch
      const ok = await supaInsertBatch('menu_photos', photoRows);
      if (ok) {
        updated++;
      } else {
        errors++;
        console.warn(`  Failed to insert photos for: ${name}`);
      }

    } catch (err) {
      if (err.message === 'OVER_QUERY_LIMIT') {
        console.error('\nGoogle API quota exceeded! Stopping.');
        console.log(`Progress: ${updated} updated, ${skipped} skipped, ${errors} errors out of ${i} processed`);
        break;
      }
      errors++;
      console.warn(`  Error for ${name}: ${err.message}`);
    }

    // Progress log every 100 restaurants
    if ((i + 1) % 100 === 0 || i === needUpgrade.length - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const rate = (updated / (elapsed || 1)).toFixed(1);
      console.log(`  [${i + 1}/${needUpgrade.length}] ${updated} updated, ${skipped} skipped, ${errors} errors (${elapsed}s, ${rate}/s)`);
    }

    // Rate limit: ~4 requests/sec to stay within Google Places quota
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n=== Complete ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (no Google photos): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Time: ${totalTime}s`);

  // Final photo count
  const finalCounts = await getRestaurantPhotoCounts();
  const finalWith8Plus = Object.values(finalCounts).filter(c => c >= 8).length;
  console.log(`\nRestaurants with 8+ photos: ${finalWith8Plus}/${allRestaurants.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
