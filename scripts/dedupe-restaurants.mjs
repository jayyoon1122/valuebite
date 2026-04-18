/**
 * Comprehensive restaurant deduplication.
 *
 * Handles ALL classes of duplicates:
 *   A) Active dupes within 50m + same name: keep best, merge data, deactivate rest
 *   B) Orphan menus (menu but no place_id): copy to same-name place_id sibling
 *   C) Inactive restaurants with rich data: nothing to do (likely already merged)
 *
 * "Best" record is determined by score:
 *   +10 if has google_place_id
 *   +5  if has photos
 *   +3  if has menu
 *   +2  if has phone
 *   +2  if has operating_hours
 *   +1  if has website
 *   +(value_score)
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const headersJson = { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

async function paginated(table, query = '') {
  const all = [];
  for (let offset = 0; offset < 50000; offset += 1000) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}&limit=1000&offset=${offset}`, { headers });
    const batch = await r.json();
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  return all;
}

function distM(a, b) {
  const dLat = (b.lat - a.lat) * 111000;
  const dLng = (b.lng - a.lng) * 111000 * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}
function nameKey(r) { return (r.name?.en || r.name?.original || '').toLowerCase().trim(); }

function score(r, hasMenu, hasPhotos) {
  let s = 0;
  if (r.external_ids?.google_place_id) s += 10;
  if (hasPhotos) s += 5;
  if (hasMenu) s += 3;
  if (r.phone) s += 2;
  if (r.operating_hours) s += 2;
  if (r.website) s += 1;
  s += parseFloat(r.value_score || 0);
  return s;
}

function mergeUpdate(winner, loser) {
  const update = {};
  // Copy place_id if winner missing it
  if (!winner.external_ids?.google_place_id && loser.external_ids?.google_place_id) {
    update.external_ids = { ...(winner.external_ids || {}), ...loser.external_ids };
  }
  // Copy non-null scalar fields if winner missing
  for (const f of ['phone', 'website', 'operating_hours', 'is_24h', 'avg_meal_price', 'price_currency', 'address']) {
    if ((winner[f] == null || winner[f] === '') && loser[f] != null && loser[f] !== '') {
      update[f] = loser[f];
    }
  }
  if (Object.keys(update).length > 0) update.updated_at = new Date().toISOString();
  return update;
}

async function reassignChildRecords(loserId, winnerId) {
  // Move menu_items
  await fetch(`${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${loserId}`, {
    method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
  });
  // Move menu_photos
  await fetch(`${SUPABASE_URL}/rest/v1/menu_photos?restaurant_id=eq.${loserId}`, {
    method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
  });
  // Move reviews
  await fetch(`${SUPABASE_URL}/rest/v1/reviews?restaurant_id=eq.${loserId}`, {
    method: 'PATCH', headers: headersJson, body: JSON.stringify({ restaurant_id: winnerId }),
  });
}

async function main() {
  console.log('Loading data...');
  const restaurants = await paginated('restaurants', 'select=*');
  const menuItems = await paginated('menu_items', 'select=restaurant_id');
  const photos = await paginated('menu_photos', 'select=restaurant_id');
  console.log(`  ${restaurants.length} restaurants, ${menuItems.length} menu items, ${photos.length} photos`);

  const menuByRest = new Set(menuItems.map(m => m.restaurant_id));
  const photoByRest = new Set(photos.map(p => p.restaurant_id));

  // ─── Phase A: Geographic duplicates (active, within 50m, same name) ───
  console.log('\nPhase A: Merging geographic duplicates (within 50m)...');
  const active = restaurants.filter(r => r.is_active);
  const byName = {};
  for (const r of active) {
    const k = nameKey(r); if (!k) continue;
    (byName[k] = byName[k] || []).push(r);
  }

  let mergedA = 0;
  for (const [name, list] of Object.entries(byName)) {
    if (list.length < 2) continue;
    // Group into clusters by proximity
    const used = new Set();
    for (let i = 0; i < list.length; i++) {
      if (used.has(i)) continue;
      const cluster = [list[i]];
      used.add(i);
      for (let j = i + 1; j < list.length; j++) {
        if (used.has(j)) continue;
        if (distM(list[i], list[j]) < 50) {
          cluster.push(list[j]);
          used.add(j);
        }
      }
      if (cluster.length < 2) continue;
      // Pick winner by score
      cluster.sort((a, b) => score(b, menuByRest.has(b.id), photoByRest.has(b.id)) -
                            score(a, menuByRest.has(a.id), photoByRest.has(a.id)));
      const winner = cluster[0];
      for (let k = 1; k < cluster.length; k++) {
        const loser = cluster[k];
        const update = mergeUpdate(winner, loser);
        if (Object.keys(update).length > 0) {
          await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${winner.id}`, {
            method: 'PATCH', headers: headersJson, body: JSON.stringify(update),
          });
        }
        await reassignChildRecords(loser.id, winner.id);
        await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${loser.id}`, {
          method: 'PATCH', headers: headersJson, body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
        });
        mergedA++;
      }
    }
  }
  console.log(`  Merged ${mergedA} geographic duplicates`);

  // ─── Phase B: Orphan menus (active, has menu, no place_id) ───
  // Need to refresh data since Phase A moved things
  console.log('\nPhase B: Reassigning orphan menus...');
  const restaurants2 = await paginated('restaurants', 'select=id,name,lat,lng,is_active,external_ids');
  const menuItems2 = await paginated('menu_items', 'select=id,restaurant_id');
  const menuByRest2 = {};
  menuItems2.forEach(m => (menuByRest2[m.restaurant_id] = (menuByRest2[m.restaurant_id] || 0) + 1));

  const active2 = restaurants2.filter(r => r.is_active);
  const orphans = active2.filter(r => menuByRest2[r.id] && !r.external_ids?.google_place_id);
  const targets = active2.filter(r => r.external_ids?.google_place_id);

  // Index targets by name for fast lookup
  const targetsByName = {};
  for (const t of targets) {
    const k = nameKey(t); if (!k) continue;
    (targetsByName[k] = targetsByName[k] || []).push(t);
  }

  let mergedB = 0;
  for (const orphan of orphans) {
    const k = nameKey(orphan); if (!k) continue;
    const cands = targetsByName[k] || [];
    if (cands.length === 0) continue;
    // Find geographically closest target with same name (any distance — these are split records)
    let best = null, bestD = Infinity;
    for (const c of cands) {
      const d = distM(orphan, c);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (!best) continue;
    // Reassign menu items + deactivate orphan
    await reassignChildRecords(orphan.id, best.id);
    await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${orphan.id}`, {
      method: 'PATCH', headers: headersJson, body: JSON.stringify({ is_active: false, updated_at: new Date().toISOString() }),
    });
    mergedB++;
    if (mergedB % 100 === 0) console.log(`  ${mergedB} orphans merged...`);
  }
  console.log(`  Reassigned ${mergedB} orphan menus`);

  console.log(`\nDone. Total merges: ${mergedA + mergedB}`);
  console.log('Re-run check-data-health.mjs to verify');
}

main().catch(err => { console.error(err); process.exit(1); });
