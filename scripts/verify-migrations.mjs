/**
 * Verify both 2026-04-19 migrations actually applied:
 *  1. restaurants.has_photos column exists & populated
 *  2. menu_items unique index prevents (restaurant_id, lower(name->>en), price) dupes
 */
import 'dotenv/config';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const HJ = { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' };

async function get(path) {
  const r = await fetch(`${URL}/rest/v1/${path}`, { headers: H });
  return { ok: r.ok, status: r.status, body: r.ok ? await r.json() : await r.text() };
}

async function main() {
  console.log('═══ Migration verification ═══\n');

  // ─────────── Migration 1: has_photos column ───────────
  console.log('[1/2] restaurants.has_photos column');
  const colCheck = await get('restaurants?select=id,has_photos&limit=1');
  if (!colCheck.ok) {
    console.log(`  ❌ Column missing or query failed: ${colCheck.status}`);
    console.log(`     ${colCheck.body.slice?.(0, 200) ?? colCheck.body}`);
  } else {
    console.log('  ✅ Column exists');
    // Count distribution
    const withPhotos = await get('restaurants?has_photos=eq.true&select=id&limit=1', );
    const withoutPhotos = await get('restaurants?has_photos=eq.false&select=id&limit=1');
    const nullPhotos = await get('restaurants?has_photos=is.null&select=id&limit=1');

    // Use Range header for true counts
    const countQuery = async (q) => {
      const r = await fetch(`${URL}/rest/v1/restaurants?${q}`, {
        headers: { ...H, Prefer: 'count=exact', Range: '0-0' },
      });
      const cr = r.headers.get('content-range') || '';
      return parseInt(cr.split('/')[1] || '0', 10);
    };
    const total = await countQuery('select=id');
    const withPhotosCount = await countQuery('has_photos=eq.true&select=id');
    const withoutPhotosCount = await countQuery('has_photos=eq.false&select=id');
    const nullPhotosCount = await countQuery('has_photos=is.null&select=id');
    console.log(`     total=${total}  with=${withPhotosCount}  without=${withoutPhotosCount}  null=${nullPhotosCount}`);
    if (nullPhotosCount > 0) {
      console.log(`  ⚠️  ${nullPhotosCount} rows still NULL — backfill may not have run`);
    } else {
      console.log('  ✅ Backfill complete (no NULLs)');
    }
  }

  // ─────────── Migration 2: unique index on menu_items ───────────
  console.log('\n[2/2] menu_items unique index');
  // Try to insert a duplicate of an existing item — if index exists, PG rejects with 23505
  const sample = await get('menu_items?select=id,restaurant_id,name,price,description&limit=1');
  if (!sample.ok || !sample.body[0]) {
    console.log('  ⚠️  No menu_items to test against — skipping insert test');
  } else {
    const m = sample.body[0];
    console.log(`     Test row: restaurant_id=${m.restaurant_id}  name=${JSON.stringify(m.name)?.slice(0, 60)}  price=${m.price}`);
    // Attempt to insert exact duplicate
    const dup = {
      restaurant_id: m.restaurant_id,
      name: m.name,
      price: m.price,
      description: m.description || null,
    };
    const ins = await fetch(`${URL}/rest/v1/menu_items`, {
      method: 'POST', headers: HJ, body: JSON.stringify(dup),
    });
    if (ins.status === 409 || ins.status === 400) {
      const txt = await ins.text();
      if (txt.includes('duplicate') || txt.includes('idx_menu_items_unique') || txt.includes('23505')) {
        console.log('  ✅ Unique index BLOCKED duplicate insert (as expected)');
        console.log(`     Server: ${txt.slice(0, 200)}`);
      } else {
        console.log(`  ⚠️  Got ${ins.status} but unclear if from our index: ${txt.slice(0, 200)}`);
      }
    } else if (ins.ok) {
      // Our test inserted! Roll it back so we don't pollute the DB.
      const created = await ins.json();
      const newId = Array.isArray(created) ? created[0]?.id : created?.id;
      console.log(`  ❌ Duplicate insert SUCCEEDED — index NOT enforcing! id=${newId}`);
      if (newId) {
        await fetch(`${URL}/rest/v1/menu_items?id=eq.${newId}`, { method: 'DELETE', headers: HJ });
        console.log(`     (cleaned up the test row)`);
      }
    } else {
      console.log(`  ⚠️  Unexpected status ${ins.status}: ${(await ins.text()).slice(0, 200)}`);
    }
  }

  // ─────────── Bonus: scan for any remaining duplicates ───────────
  console.log('\n[bonus] Scanning all menu_items for surviving dupes...');
  const all = [];
  for (let off = 0; off < 50000; off += 1000) {
    const r = await fetch(`${URL}/rest/v1/menu_items?select=restaurant_id,name,price&limit=1000&offset=${off}`, { headers: H });
    const batch = await r.json();
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  const groups = {};
  for (const m of all) {
    if (!m.restaurant_id || m.price == null) continue;
    const nm = typeof m.name === 'object' ? (m.name?.en || m.name?.original || '') : String(m.name || '');
    const k = `${m.restaurant_id}|${nm.toLowerCase().trim()}|${Number(m.price).toFixed(2)}`;
    groups[k] = (groups[k] || 0) + 1;
  }
  const dupes = Object.entries(groups).filter(([_, c]) => c > 1);
  if (dupes.length === 0) {
    console.log(`  ✅ ${all.length} menu_items scanned — zero duplicates`);
  } else {
    console.log(`  ❌ ${dupes.length} duplicate groups still exist among ${all.length} items`);
    dupes.slice(0, 5).forEach(([k, c]) => console.log(`     ${c}x  ${k}`));
  }

  console.log('\n═══ Done ═══');
}

main().catch(e => { console.error(e); process.exit(1); });
