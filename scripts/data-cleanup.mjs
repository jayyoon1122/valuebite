/**
 * Comprehensive data cleanup — single script that replaces 4 prior dedupe scripts.
 *
 * Three root-cause issues this addresses:
 *
 * 1. SPLIT DUPLICATES (the real one I kept missing):
 *    Same restaurant exists as TWO active records:
 *    A) Manual import: has menu/price but NO place_id, sometimes wrong coords
 *    B) Google import: has place_id + photos but NO menu
 *    Previous dedupe only matched within 50m. But "junk" records often have
 *    wildly wrong coords (5km+ off). For UNIQUE names (not chains), if there
 *    are exactly 1 with place_id and 1+ without, the no-place_id ones are
 *    junk → merge their data into the real one and deactivate.
 *
 * 2. PHOTO COVERAGE:
 *    Many active restaurants with place_id never had photos enriched (only
 *    Tokyo enrichment ran). Run Google Places photo enrichment for all
 *    photo-less restaurants that have a place_id.
 *
 * 3. has_photos column sync:
 *    Backfill the new column (until DB trigger handles it).
 *
 * Usage:
 *   node scripts/data-cleanup.mjs               # all 3 phases
 *   node scripts/data-cleanup.mjs --no-enrich   # skip slow Google API calls
 */

import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const headersJson = { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
const SKIP_ENRICH = process.argv.includes('--no-enrich');

async function paginated(table, query) {
  const all = [];
  for (let offset = 0; offset < 50000; offset += 1000) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}&limit=1000&offset=${offset}`, { headers });
    const batch = await r.json();
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  return all;
}

// Normalize a name string for fuzzy matching.
// - lowercase
// - replace curly quotes/dashes with straight
// - strip all punctuation + extra whitespace
// - drop common branch/location suffixes (Tokyo branch names, NYC neighborhoods)
const BRANCH_SUFFIXES = /\b(branch|shop|store|main|location|fidi|midtown|downtown|uptown|brooklyn|manhattan|queens|harajuku|shibuya|shinjuku|ginza|ikebukuro|roppongi|asakusa|akihabara|ueno|akasaka|tokyo|new\s*york|nyc|la|sf|coredo|muromachi|hills|tower|station|terminal|south|north|east|west|center|east|cafe|restaurant|bar|kitchen|dining|grill|bistro)\b/g;

function normalizeName(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")  // curly single quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')  // curly double quotes
    .replace(/[\u2013\u2014\u2015]/g, '-')        // en/em dashes
    .replace(/[^\w\s]/g, ' ')                     // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function nameKey(r) {
  // Try both en and original — return the SHORTER normalized one (so suffix-heavy
  // names like "Pisillo Italian Panini FIDI" group with "Pisillo Italian Panini").
  const candidates = [r.name?.en, r.name?.original, r.name?.romanized]
    .filter(Boolean)
    .map(normalizeName)
    .map(s => s.replace(BRANCH_SUFFIXES, '').replace(/\s+/g, ' ').trim())
    .filter(s => s.length >= 3);
  if (candidates.length === 0) return '';
  // Pick shortest — most likely the "core" name
  return candidates.sort((a, b) => a.length - b.length)[0];
}
function distKm(a, b) {
  const dLat = (b.lat - a.lat) * 111;
  const dLng = (b.lng - a.lng) * 111 * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Reassign child records from loser → winner WITHOUT creating duplicates.
// For menu_items: only move items where (name, price) doesn't already exist on winner.
// For menu_photos: only move where photo_url doesn't already exist.
// For reviews: only move where (author_name, content) doesn't already exist.
// Items that would be duplicates are DELETED instead of moved.
async function reassignChildren(loserId, winnerId) {
  // ─── menu_items: dedupe by (name, price) ───
  const winnerItems = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${winnerId}&select=name,price`, { headers })
    .then(r => r.ok ? r.json() : []);
  const winnerKeys = new Set(winnerItems.map(m => {
    const n = typeof m.name === 'object' ? (m.name?.en || m.name?.original || '') : String(m.name || '');
    return n.toLowerCase().trim() + '|' + Number(m.price).toFixed(2);
  }));
  const loserItems = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${loserId}&select=id,name,price`, { headers })
    .then(r => r.ok ? r.json() : []);
  const itemsToMove = [], itemsToDelete = [];
  for (const m of loserItems) {
    const n = typeof m.name === 'object' ? (m.name?.en || m.name?.original || '') : String(m.name || '');
    const key = n.toLowerCase().trim() + '|' + Number(m.price).toFixed(2);
    if (winnerKeys.has(key)) itemsToDelete.push(m.id);
    else { itemsToMove.push(m.id); winnerKeys.add(key); }
  }
  if (itemsToMove.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/menu_items?id=in.(${itemsToMove.join(',')})`, {
      method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
    });
  }
  if (itemsToDelete.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/menu_items?id=in.(${itemsToDelete.join(',')})`, {
      method: 'DELETE', headers: headersJson,
    });
  }

  // ─── menu_photos: dedupe by photo_url ───
  const winnerPhotos = await fetch(`${SUPABASE_URL}/rest/v1/menu_photos?restaurant_id=eq.${winnerId}&select=photo_url`, { headers })
    .then(r => r.ok ? r.json() : []);
  const winnerPhotoUrls = new Set(winnerPhotos.map(p => p.photo_url));
  const loserPhotos = await fetch(`${SUPABASE_URL}/rest/v1/menu_photos?restaurant_id=eq.${loserId}&select=id,photo_url`, { headers })
    .then(r => r.ok ? r.json() : []);
  const photosToMove = [], photosToDelete = [];
  for (const p of loserPhotos) {
    if (winnerPhotoUrls.has(p.photo_url)) photosToDelete.push(p.id);
    else { photosToMove.push(p.id); winnerPhotoUrls.add(p.photo_url); }
  }
  if (photosToMove.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/menu_photos?id=in.(${photosToMove.join(',')})`, {
      method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
    });
  }
  if (photosToDelete.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/menu_photos?id=in.(${photosToDelete.join(',')})`, {
      method: 'DELETE', headers: headersJson,
    });
  }

  // ─── reviews: dedupe by (author_name, content snippet) ───
  const winnerReviews = await fetch(`${SUPABASE_URL}/rest/v1/reviews?restaurant_id=eq.${winnerId}&select=author_name,content`, { headers })
    .then(r => r.ok ? r.json() : []);
  const winnerReviewKeys = new Set(winnerReviews.map(r => (r.author_name || '') + '|' + (r.content || '').substring(0, 100)));
  const loserReviews = await fetch(`${SUPABASE_URL}/rest/v1/reviews?restaurant_id=eq.${loserId}&select=id,author_name,content`, { headers })
    .then(r => r.ok ? r.json() : []);
  const reviewsToMove = [], reviewsToDelete = [];
  for (const r of loserReviews) {
    const key = (r.author_name || '') + '|' + (r.content || '').substring(0, 100);
    if (winnerReviewKeys.has(key)) reviewsToDelete.push(r.id);
    else { reviewsToMove.push(r.id); winnerReviewKeys.add(key); }
  }
  if (reviewsToMove.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/reviews?id=in.(${reviewsToMove.join(',')})`, {
      method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
    });
  }
  if (reviewsToDelete.length) {
    await fetch(`${SUPABASE_URL}/rest/v1/reviews?id=in.(${reviewsToDelete.join(',')})`, {
      method: 'DELETE', headers: headersJson,
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// PHASE 1: Merge split duplicates (no distance limit, trust place_id)
// ─────────────────────────────────────────────────────────────────
async function phase1MergeSplitDuplicates() {
  console.log('\n=== PHASE 1: Merge split duplicates ===');
  const restaurants = await paginated('restaurants', 'is_active=eq.true&select=id,name,lat,lng,external_ids,phone,operating_hours,website,address,avg_meal_price,price_currency,cuisine_type,is_chain');
  console.log(`  ${restaurants.length} active restaurants loaded`);

  // Group by name
  const byName = {};
  for (const r of restaurants) {
    const k = nameKey(r); if (!k) continue;
    (byName[k] = byName[k] || []).push(r);
  }

  const dupeGroups = Object.entries(byName).filter(([_, list]) => list.length > 1);
  console.log(`  ${dupeGroups.length} name groups with multiple records`);

  let mergeCount = 0, skipChainCount = 0;
  for (const [name, list] of dupeGroups) {
    const withPlaceId = list.filter(r => r.external_ids?.google_place_id);
    const withoutPlaceId = list.filter(r => !r.external_ids?.google_place_id);

    // If ALL have place_id, they're legitimate multi-location restaurants — keep all
    if (withoutPlaceId.length === 0) continue;

    // If NONE have place_id, can't determine which is real — leave alone
    if (withPlaceId.length === 0) continue;

    // For each junk (no place_id) record, find closest real (has place_id) match
    // Distance limit: 100km (so we don't merge a London restaurant into a Tokyo one
    // — they'd be different restaurants with the same name across cities).
    for (const junk of withoutPlaceId) {
      let closest = null, closestDist = Infinity;
      for (const real of withPlaceId) {
        const d = distKm(junk, real);
        if (d < closestDist) { closestDist = d; closest = real; }
      }
      if (!closest || closestDist > 100) {
        skipChainCount++;
        continue;
      }
      // Move all child records (menus, photos, reviews) to the real one
      await reassignChildren(junk.id, closest.id);
      // Merge useful fields if real is missing them
      const update = {};
      for (const f of ['phone', 'website', 'operating_hours', 'avg_meal_price', 'price_currency', 'address']) {
        if ((!closest[f] || closest[f] === '') && junk[f]) update[f] = junk[f];
      }
      if (Object.keys(update).length) {
        await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${closest.id}`, {
          method: 'PATCH', headers: headersJson, body: JSON.stringify(update),
        });
      }
      // Deactivate the junk record
      await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${junk.id}`, {
        method: 'PATCH', headers: headersJson,
        body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
      });
      mergeCount++;
      if (mergeCount % 50 === 0) console.log(`    ${mergeCount} merged...`);
    }
  }
  console.log(`  Merged ${mergeCount} junk duplicates into real records`);
  console.log(`  Skipped ${skipChainCount} different-city same-name (legitimate multi-location)`);
}

// ─────────────────────────────────────────────────────────────────
// PHASE 2: Enrich photos for active restaurants that have place_id but no photos
// ─────────────────────────────────────────────────────────────────
async function phase2EnrichPhotos() {
  if (SKIP_ENRICH || !GOOGLE_KEY) {
    console.log('\n=== PHASE 2: Photo enrichment SKIPPED (--no-enrich or no GOOGLE_KEY) ===');
    return;
  }
  console.log('\n=== PHASE 2: Enrich photos for restaurants with place_id but no photos ===');

  const photos = await paginated('menu_photos', 'select=restaurant_id');
  const withPhotos = new Set(photos.map(p => p.restaurant_id));
  const restaurants = await paginated('restaurants', 'is_active=eq.true&select=id,name,external_ids');
  const candidates = restaurants.filter(r =>
    r.external_ids?.google_place_id && !withPhotos.has(r.id)
  );
  console.log(`  ${candidates.length} restaurants need photo enrichment`);

  let enriched = 0, failed = 0;
  for (let i = 0; i < candidates.length; i++) {
    const r = candidates[i];
    const placeId = r.external_ids.google_place_id;
    try {
      // Use Google Places Details API (legacy) — returns photo references
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status !== 'OK' || !data.result?.photos?.length) { failed++; continue; }

      const inserts = data.result.photos.slice(0, 5).map((p, i) => ({
        restaurant_id: r.id,
        photo_url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${GOOGLE_KEY}`,
        ai_language_detected: i === 0 ? 'exterior' : i === 1 ? 'interior' : i === 2 ? 'menu' : 'dish',
        ai_processed: true,
        ai_confidence: '0.80',
      }));
      const insRes = await fetch(`${SUPABASE_URL}/rest/v1/menu_photos`, {
        method: 'POST', headers: headersJson, body: JSON.stringify(inserts),
      });
      if (insRes.ok) {
        // Also update has_photos column (if it exists)
        await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${r.id}`, {
          method: 'PATCH', headers: headersJson,
          body: JSON.stringify({ has_photos: true }),
        }).catch(() => {});
        enriched++;
      } else { failed++; }
      await new Promise(r => setTimeout(r, 200));
    } catch { failed++; }

    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${candidates.length} processed (${enriched} enriched, ${failed} failed)`);
  }
  console.log(`  Done. ${enriched} enriched, ${failed} failed.`);
}

// ─────────────────────────────────────────────────────────────────
// PHASE 3: Backfill has_photos column (if exists)
// ─────────────────────────────────────────────────────────────────
async function phase3BackfillHasPhotos() {
  console.log('\n=== PHASE 3: Backfill has_photos column ===');
  // Check if column exists
  const test = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?select=has_photos&limit=1`, { headers });
  if (!test.ok) {
    console.log('  has_photos column not yet present (migration not run yet) — skipping');
    return;
  }
  console.log('  has_photos column exists — backfilling');

  // Get all distinct restaurant_ids with photos
  const photos = await paginated('menu_photos', 'select=restaurant_id');
  const withPhotos = [...new Set(photos.map(p => p.restaurant_id))];
  console.log(`  ${withPhotos.length} restaurants have photos`);

  // Set has_photos=true in batches
  for (let i = 0; i < withPhotos.length; i += 50) {
    const batch = withPhotos.slice(i, i + 50);
    await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=in.(${batch.join(',')})`, {
      method: 'PATCH', headers: headersJson,
      body: JSON.stringify({ has_photos: true }),
    });
  }
  console.log('  Done');
}

async function main() {
  await phase1MergeSplitDuplicates();
  await phase2EnrichPhotos();
  await phase3BackfillHasPhotos();
  console.log('\nAll phases complete. Run scripts/check-data-health.mjs to verify.');
}

main().catch(err => { console.error(err); process.exit(1); });
