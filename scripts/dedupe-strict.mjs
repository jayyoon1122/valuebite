/**
 * Strict dedupe — catches EVERY case the SQL unique constraint will reject.
 *
 * Groups active restaurants by EXACTLY the same key the index uses:
 *   (lower(name->>en OR name->>original), ROUND(lat, 4), ROUND(lng, 4))
 *
 * For each group with > 1 active record:
 *   - Pick winner by score (place_id > photos > menu > phone > value_score)
 *   - Reassign all child records (menu_items, menu_photos, reviews) to winner
 *   - Deactivate losers
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const headersJson = { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

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

// Match the SQL constraint EXACTLY
function indexKey(r) {
  const name = (r.name?.en || r.name?.original || '').toLowerCase();
  const lat = Math.round(r.lat * 10000) / 10000;  // 4 dp
  const lng = Math.round(r.lng * 10000) / 10000;
  return `${name}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
}

function score(r, hasMenu, hasPhotos) {
  let s = 0;
  if (r.external_ids?.google_place_id) s += 100;  // place_id is by far the most important
  if (hasPhotos) s += 50;
  if (hasMenu) s += 30;
  if (r.phone) s += 20;
  if (r.operating_hours) s += 20;
  if (r.website) s += 10;
  s += parseFloat(r.value_score || 0);
  return s;
}

async function reassignChildren(loserId, winnerId) {
  for (const table of ['menu_items', 'menu_photos', 'reviews']) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?restaurant_id=eq.${loserId}`, {
      method: 'PATCH', headers: headersJson,
      body: JSON.stringify({ restaurant_id: winnerId }),
    });
  }
}

async function main() {
  console.log('Loading...');
  const restaurants = await paginated('restaurants', 'select=id,name,lat,lng,is_active,external_ids,phone,operating_hours,website,value_score,created_at');
  const menuItems = await paginated('menu_items', 'select=restaurant_id');
  const photos = await paginated('menu_photos', 'select=restaurant_id');
  const menuByRest = new Set(menuItems.map(m => m.restaurant_id));
  const photoByRest = new Set(photos.map(p => p.restaurant_id));
  console.log(`  ${restaurants.length} restaurants`);

  // Group ACTIVE by EXACT index key
  const groups = {};
  for (const r of restaurants) {
    if (!r.is_active) continue;
    if (r.lat == null || r.lng == null) continue;
    const k = indexKey(r);
    if (!k.startsWith('|')) {
      (groups[k] = groups[k] || []).push(r);
    }
  }

  const dupes = Object.entries(groups).filter(([k, list]) => list.length > 1);
  console.log(`Found ${dupes.length} duplicate groups (would block unique index)`);

  let mergedCount = 0;
  for (const [key, list] of dupes) {
    list.sort((a, b) => score(b, menuByRest.has(b.id), photoByRest.has(b.id)) -
                       score(a, menuByRest.has(a.id), photoByRest.has(a.id)));
    const winner = list[0];
    for (let i = 1; i < list.length; i++) {
      const loser = list[i];
      await reassignChildren(loser.id, winner.id);
      await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${loser.id}`, {
        method: 'PATCH', headers: headersJson,
        body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
      });
      mergedCount++;
    }
    if (mergedCount > 0 && mergedCount % 50 === 0) console.log(`  ${mergedCount} merged...`);
  }
  console.log(`Done. ${mergedCount} duplicates deactivated.`);

  // Verify by re-grouping
  const remaining = await paginated('restaurants', 'select=id,name,lat,lng,is_active');
  const groups2 = {};
  for (const r of remaining) {
    if (!r.is_active) continue;
    if (r.lat == null || r.lng == null) continue;
    const k = indexKey(r);
    if (!k.startsWith('|')) (groups2[k] = groups2[k] || []).push(r);
  }
  const stillDupes = Object.entries(groups2).filter(([k, l]) => l.length > 1);
  console.log(`Verification: ${stillDupes.length} duplicate groups remaining`);
  if (stillDupes.length > 0) {
    console.log('First 3 remaining:');
    stillDupes.slice(0, 3).forEach(([k, l]) => console.log(`  ${k}: ${l.length} active`));
  }
}

main().catch(err => { console.error(err); process.exit(1); });
