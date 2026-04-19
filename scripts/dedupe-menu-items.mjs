/**
 * Dedupe menu_items within each restaurant — keep one per (name, price) tuple.
 *
 * ROOT CAUSE: data-cleanup.mjs Phase 1 reassigned menu_items from "junk"
 * restaurants to their "real" twin without checking if the real one already
 * had the same items. Result: 1,973 duplicate menu items.
 *
 * This script is the cleanup. The data-cleanup.mjs script has been updated
 * to dedupe at reassignment time so this can't happen again.
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY };
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

function itemKey(m) {
  const name = typeof m.name === 'object' ? (m.name?.en || m.name?.original || JSON.stringify(m.name)) : String(m.name);
  return name.toLowerCase().trim() + '|' + Number(m.price).toFixed(2);
}

async function main() {
  console.log('Loading menu items...');
  const items = await paginated('menu_items', 'select=id,restaurant_id,name,price,created_at');
  console.log(`  ${items.length} total`);

  // Group by restaurant + (name, price)
  const groups = {};
  for (const m of items) {
    if (!m.restaurant_id) continue;
    const key = m.restaurant_id + '||' + itemKey(m);
    (groups[key] = groups[key] || []).push(m);
  }
  const dupes = Object.entries(groups).filter(([_, l]) => l.length > 1);
  console.log(`  ${dupes.length} duplicate groups`);

  // Delete all but the first (oldest by created_at, fallback to first by id)
  const idsToDelete = [];
  for (const [_, list] of dupes) {
    list.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || '') || a.id.localeCompare(b.id));
    for (let i = 1; i < list.length; i++) idsToDelete.push(list[i].id);
  }
  console.log(`  ${idsToDelete.length} duplicate items to delete`);

  // Delete in batches
  let deleted = 0;
  for (let i = 0; i < idsToDelete.length; i += 50) {
    const batch = idsToDelete.slice(i, i + 50);
    const r = await fetch(`${SUPABASE_URL}/rest/v1/menu_items?id=in.(${batch.join(',')})`, {
      method: 'DELETE', headers: headersJson,
    });
    if (r.ok) deleted += batch.length;
    if ((i + 50) % 500 === 0) console.log(`  ${Math.min(i + 50, idsToDelete.length)}/${idsToDelete.length} deleted`);
  }
  console.log(`Done. Deleted ${deleted} duplicate menu items.`);
}

main().catch(err => { console.error(err); process.exit(1); });
