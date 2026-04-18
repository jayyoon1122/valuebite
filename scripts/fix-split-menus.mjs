/**
 * Fix split data: menu items on one record, place_id/photos on another.
 * Strategy: COPY menu_items to the place_id version (the one users actually see).
 * Then deactivate the menu-only duplicate (no place_id, no photos = useless).
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

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

function distKm(a, b) {
  const dLat = (b.lat - a.lat) * 111;
  const dLng = (b.lng - a.lng) * 111 * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

async function main() {
  console.log('Loading restaurants...');
  const restaurants = await paginated('restaurants', 'select=id,name,lat,lng,external_ids,phone,is_active');
  console.log('  Loaded', restaurants.length);

  console.log('Loading menu items...');
  const menuItems = await paginated('menu_items', 'select=id,restaurant_id,name,price,currency,category,source');
  console.log('  Loaded', menuItems.length);

  // Group menu items by restaurant_id
  const menuByRest = {};
  for (const m of menuItems) {
    if (!menuByRest[m.restaurant_id]) menuByRest[m.restaurant_id] = [];
    menuByRest[m.restaurant_id].push(m);
  }

  // Group restaurants by name
  const byName = {};
  for (const r of restaurants) {
    const key = (r.name?.en || r.name?.original || '').toLowerCase().trim();
    if (!key) continue;
    if (!byName[key]) byName[key] = [];
    byName[key].push(r);
  }

  let copyCount = 0, deactivateCount = 0;
  const ops = [];

  for (const [name, list] of Object.entries(byName)) {
    if (list.length < 2) continue;

    const sources = list.filter(r => menuByRest[r.id] && menuByRest[r.id].length > 0);
    const targets = list.filter(r => r.external_ids?.google_place_id && (!menuByRest[r.id] || menuByRest[r.id].length === 0));

    if (sources.length === 0 || targets.length === 0) continue;

    // For each source (has menu), find geographically closest target (has place_id, no menu)
    for (const source of sources) {
      // Find closest target by lat/lng
      let closest = null, closestDist = Infinity;
      for (const target of targets) {
        const d = distKm(source, target);
        if (d < closestDist) { closestDist = d; closest = target; }
      }
      if (!closest) continue;

      // Copy menu items from source to target
      const items = menuByRest[source.id];
      const newItems = items.map(item => ({
        restaurant_id: closest.id,
        name: item.name,
        price: item.price,
        currency: item.currency,
        category: item.category,
        source: item.source || 'duplicate_merge',
      }));

      ops.push({
        sourceId: source.id,
        targetId: closest.id,
        targetName: closest.name?.en || closest.name?.original,
        itemCount: newItems.length,
        distKm: closestDist.toFixed(2),
        items: newItems,
      });

      // Mark target as already-having so we don't double-copy
      menuByRest[closest.id] = items;
      // Remove from targets so next source picks a different one (for chains)
      const idx = targets.indexOf(closest);
      if (idx >= 0) targets.splice(idx, 1);
    }
  }

  console.log(`\nFound ${ops.length} merge operations`);
  console.log('Sample:');
  ops.slice(0, 5).forEach(op => console.log(`  ${op.targetName}: copying ${op.itemCount} items (${op.distKm}km away)`));

  // Execute: insert menu items in batches
  console.log('\nExecuting copies...');
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const r = await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify(op.items),
    });
    if (r.ok) {
      copyCount += op.items.length;
      // Deactivate the source duplicate (it has no place_id, no photos — won't be missed)
      await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${op.sourceId}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ is_active: false }),
      });
      deactivateCount++;
    } else {
      console.log('  FAIL:', op.targetName, await r.text().then(t => t.substring(0, 100)));
    }
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${ops.length} done`);
  }

  console.log('\nDone:');
  console.log(`  Menu items copied: ${copyCount}`);
  console.log(`  Duplicate restaurants deactivated: ${deactivateCount}`);
}

main().catch(console.error);
