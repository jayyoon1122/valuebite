/**
 * Definitive test: copy an existing menu_item row in full, change only the id,
 * insert it. If unique index is enforcing, we get 23505. Anything else means
 * the index isn't doing its job.
 */
import 'dotenv/config';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const HJ = { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' };

async function main() {
  // Grab one row with ALL columns
  const r = await fetch(`${URL}/rest/v1/menu_items?select=*&limit=1`, { headers: H });
  const [row] = await r.json();
  if (!row) { console.log('No rows to test'); return; }

  console.log('Test row columns:', Object.keys(row).join(', '));
  console.log(`  restaurant_id=${row.restaurant_id}`);
  console.log(`  name=${JSON.stringify(row.name)}`);
  console.log(`  price=${row.price}\n`);

  // Build a duplicate: copy everything EXCEPT id (so PG generates a new one)
  const dup = { ...row };
  delete dup.id;
  delete dup.created_at;  // let DB set defaults
  delete dup.updated_at;

  const ins = await fetch(`${URL}/rest/v1/menu_items`, {
    method: 'POST', headers: HJ, body: JSON.stringify(dup),
  });
  const txt = await ins.text();
  console.log(`Insert response: ${ins.status}`);
  console.log(`Body: ${txt.slice(0, 400)}\n`);

  if (ins.status === 409 || (ins.status === 400 && txt.includes('23505'))) {
    if (txt.includes('idx_menu_items_unique') || txt.includes('duplicate key')) {
      console.log('✅ PASS — unique index BLOCKED the duplicate');
    } else {
      console.log(`✅ PASS — got unique violation (23505), index is enforcing`);
    }
  } else if (ins.ok) {
    const created = await JSON.parse(txt);
    const newId = Array.isArray(created) ? created[0]?.id : created?.id;
    console.log(`❌ FAIL — duplicate insert succeeded (id=${newId}). Index NOT enforcing.`);
    if (newId) {
      await fetch(`${URL}/rest/v1/menu_items?id=eq.${newId}`, { method: 'DELETE', headers: HJ });
      console.log('   (cleaned up the test row)');
    }
  } else {
    console.log(`⚠️  Unexpected status ${ins.status} — could not determine`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
