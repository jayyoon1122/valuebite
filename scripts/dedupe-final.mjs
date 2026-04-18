/**
 * Final dedupe — guarantees the SQL unique index can be created.
 *
 * Considers ALL restaurants (active + inactive), groups by EXACTLY
 * the SQL constraint key, picks the BEST of each group, sets ONLY
 * that one is_active=true and EVERYTHING else is_active=false.
 *
 * Reassigns child records (menu_items, menu_photos, reviews) from
 * loser to winner so no data is lost.
 *
 * Run BEFORE applying the SQL migration.
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

function indexKey(r) {
  const name = (r.name?.en || r.name?.original || '').toLowerCase();
  if (!name || r.lat == null || r.lng == null) return null;
  const lat = (Math.round(r.lat * 10000) / 10000).toFixed(4);
  const lng = (Math.round(r.lng * 10000) / 10000).toFixed(4);
  return `${name}|${lat}|${lng}`;
}

function score(r, hasMenu, hasPhotos) {
  let s = 0;
  if (r.external_ids?.google_place_id) s += 1000;
  if (hasPhotos) s += 100;
  if (hasMenu) s += 50;
  if (r.phone) s += 30;
  if (r.operating_hours) s += 30;
  if (r.website) s += 10;
  s += parseFloat(r.value_score || 0);
  if (r.is_active) s += 1; // tiny tiebreaker
  return s;
}

function hasRealData(r, hasMenu, hasPhotos) {
  return hasMenu || hasPhotos || r.phone || r.operating_hours || r.website || r.external_ids?.google_place_id;
}

async function reassignChildren(loserId, winnerId) {
  for (const table of ['menu_items', 'menu_photos', 'reviews']) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?restaurant_id=eq.${loserId}`, {
      method: 'PATCH', headers: headersJson,
      body: JSON.stringify({ restaurant_id: winnerId }),
    });
  }
}

async function setActive(ids, active) {
  if (ids.length === 0) return;
  // Patch in batches of 50 IDs
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=in.(${batch.join(',')})`, {
      method: 'PATCH', headers: headersJson,
      body: JSON.stringify({ is_active: active, updated_at: new Date().toISOString() }),
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
  console.log(`  ${restaurants.length} restaurants, ${menuByRest.size} with menu, ${photoByRest.size} with photos`);

  // Group ALL (active + inactive) by exact index key
  const groups = {};
  let noKeyCount = 0;
  for (const r of restaurants) {
    const k = indexKey(r);
    if (!k) { noKeyCount++; continue; }
    (groups[k] = groups[k] || []).push(r);
  }
  console.log(`  Groups: ${Object.keys(groups).length}, ${noKeyCount} restaurants have no key (no name or no lat/lng)`);

  let mergedCount = 0, activatedCount = 0, deactivatedCount = 0;
  const toActivate = [];
  const toDeactivate = [];

  for (const [key, list] of Object.entries(groups)) {
    // Sort: best first
    list.sort((a, b) => score(b, menuByRest.has(b.id), photoByRest.has(b.id)) -
                       score(a, menuByRest.has(a.id), photoByRest.has(a.id)));
    const winner = list[0];
    const winnerHasData = hasRealData(winner, menuByRest.has(winner.id), photoByRest.has(winner.id));

    // Reassign children from losers to winner, mark losers for deactivation
    for (let i = 1; i < list.length; i++) {
      const loser = list[i];
      await reassignChildren(loser.id, winner.id);
      if (loser.is_active) toDeactivate.push(loser.id);
      mergedCount++;
    }

    // Winner: should be active if it has real data, inactive otherwise
    if (winnerHasData && !winner.is_active) toActivate.push(winner.id);
    if (!winnerHasData && winner.is_active) toDeactivate.push(winner.id);
  }

  console.log(`\nMerged ${mergedCount} duplicates`);
  console.log(`Activating ${toActivate.length} winners that had data but were inactive`);
  console.log(`Deactivating ${toDeactivate.length} losers + empty winners`);

  await setActive(toActivate, true);
  await setActive(toDeactivate, false);
  activatedCount = toActivate.length;
  deactivatedCount = toDeactivate.length;

  // Verify
  console.log('\nVerifying...');
  const after = await paginated('restaurants', 'select=id,name,lat,lng,is_active');
  const groups2 = {};
  for (const r of after) {
    if (!r.is_active) continue;
    const k = indexKey(r);
    if (!k) continue;
    (groups2[k] = groups2[k] || []).push(r);
  }
  const stillDupes = Object.entries(groups2).filter(([k, l]) => l.length > 1);
  if (stillDupes.length === 0) {
    console.log('  ✅ 0 active duplicates — SQL unique index will succeed');
  } else {
    console.log(`  ❌ ${stillDupes.length} duplicate groups still active. First 5:`);
    stillDupes.slice(0, 5).forEach(([k, l]) => console.log(`    ${k}: ${l.length} active (ids: ${l.map(r => r.id.substring(0,8)).join(', ')})`));
  }

  const activeCount = after.filter(r => r.is_active).length;
  console.log(`\nFinal: ${activeCount} active restaurants (was ${restaurants.filter(r => r.is_active).length})`);
}

main().catch(err => { console.error(err); process.exit(1); });
