/**
 * Data health check — run before every deploy AND on a schedule.
 *
 * Catches the failure modes documented in WORKLOG.md:
 *   - Duplicate restaurants (same name + same location, both active)
 *   - Restaurants with menu but no place_id (orphan menus, won't be seen)
 *   - Restaurants with place_id but no menu (visible but empty)
 *   - Active restaurants with NO data at all (broken records)
 *   - Inactive restaurants with rich data (invisible enrichment)
 *
 * Exits with code 1 if any CRITICAL issue found (use in CI / pre-deploy hooks).
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE env vars'); process.exit(2);
}
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

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

function distMeters(a, b) {
  const dLat = (b.lat - a.lat) * 111000;
  const dLng = (b.lng - a.lng) * 111000 * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}
function nameKey(r) { return (r.name?.en || r.name?.original || '').toLowerCase().trim(); }

const COLOR = { red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m', reset: '\x1b[0m', bold: '\x1b[1m' };

async function main() {
  console.log(`${COLOR.bold}=== ValueBite Data Health Check ===${COLOR.reset}\n`);

  const restaurants = await paginated('restaurants', 'select=id,name,lat,lng,is_active,external_ids,phone,operating_hours,website');
  const menuItems = await paginated('menu_items', 'select=restaurant_id');
  const photos = await paginated('menu_photos', 'select=restaurant_id');

  const menuByRest = new Set(menuItems.map(m => m.restaurant_id));
  const photoByRest = new Set(photos.map(p => p.restaurant_id));

  let critical = 0, warning = 0;
  const report = (level, msg) => {
    const c = level === 'CRITICAL' ? COLOR.red : COLOR.yellow;
    console.log(`${c}[${level}]${COLOR.reset} ${msg}`);
    if (level === 'CRITICAL') critical++; else warning++;
  };
  const ok = (msg) => console.log(`${COLOR.green}[OK]${COLOR.reset} ${msg}`);

  // ─── Check 1: Duplicate active restaurants (same name + within 50m) ───
  const active = restaurants.filter(r => r.is_active);
  console.log(`\n${COLOR.bold}1. Duplicate active restaurants${COLOR.reset}`);
  const byName = {};
  for (const r of active) {
    const k = nameKey(r); if (!k) continue;
    (byName[k] = byName[k] || []).push(r);
  }
  let dupePairs = 0;
  for (const [name, list] of Object.entries(byName)) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (distMeters(list[i], list[j]) < 50) {
          dupePairs++;
          if (dupePairs <= 5) report('CRITICAL', `Duplicate "${name}" — ids ${list[i].id.slice(0,8)} & ${list[j].id.slice(0,8)}`);
        }
      }
    }
  }
  if (dupePairs === 0) ok('No duplicate active restaurants');
  else if (dupePairs > 5) console.log(`  ... and ${dupePairs - 5} more duplicate pairs`);

  // ─── Check 2: Active restaurants with NO data at all ───
  console.log(`\n${COLOR.bold}2. Active restaurants with no useful data${COLOR.reset}`);
  const empty = active.filter(r =>
    !menuByRest.has(r.id) && !photoByRest.has(r.id) &&
    !r.phone && !r.operating_hours && !r.website
  );
  if (empty.length === 0) ok('All active restaurants have at least some data');
  else if (empty.length < 100) report('WARNING', `${empty.length} active restaurants have no menu, photo, phone, hours, or website`);
  else report('CRITICAL', `${empty.length} active restaurants have NO data — users will see empty cards`);

  // ─── Check 3: Orphan menus that have a fixable sibling ───
  console.log(`\n${COLOR.bold}3. Orphan menus with same-name place_id sibling (fixable splits)${COLOR.reset}`);
  const orphans = active.filter(r => menuByRest.has(r.id) && !r.external_ids?.google_place_id);
  // Find siblings (same name, has place_id) — these are split duplicates
  const targetsByName = {};
  for (const r of active.filter(r => r.external_ids?.google_place_id)) {
    const k = nameKey(r); if (!k) continue;
    (targetsByName[k] = targetsByName[k] || []).push(r);
  }
  const fixable = orphans.filter(o => targetsByName[nameKey(o)]?.length > 0);
  const noSibling = orphans.length - fixable.length;
  if (fixable.length === 0) ok(`No fixable orphan menus. ${noSibling} orphans without place_id sibling (legitimate — no Google match)`);
  else if (fixable.length < 50) report('WARNING', `${fixable.length} orphan menus could be merged with same-name place_id siblings — run dedupe-restaurants.mjs`);
  else report('CRITICAL', `${fixable.length} fixable orphan menus — run scripts/dedupe-restaurants.mjs`);

  // ─── Check 4: Restaurants with place_id but no menu (incomplete) ───
  console.log(`\n${COLOR.bold}4. Restaurants with place_id but no menu${COLOR.reset}`);
  const noMenu = active.filter(r => r.external_ids?.google_place_id && !menuByRest.has(r.id));
  if (noMenu.length < 1000) ok(`${noMenu.length} restaurants have place_id but no menu (acceptable — menu adds over time)`);
  else report('WARNING', `${noMenu.length} restaurants need menu enrichment`);

  // ─── Check 5: Inactive restaurants with rich data (invisible enrichment) ───
  console.log(`\n${COLOR.bold}5. Inactive restaurants with rich data (hidden from users)${COLOR.reset}`);
  const inactive = restaurants.filter(r => !r.is_active);
  const hiddenRich = inactive.filter(r => menuByRest.has(r.id) || photoByRest.has(r.id) || r.phone);
  if (hiddenRich.length === 0) ok('No inactive restaurants have orphaned data');
  else report('WARNING', `${hiddenRich.length} inactive restaurants have menu/photo/phone but are invisible to users`);

  // ─── Summary ───
  console.log(`\n${COLOR.bold}=== Summary ===${COLOR.reset}`);
  console.log(`Total restaurants: ${restaurants.length} (${active.length} active, ${inactive.length} inactive)`);
  console.log(`Total menu items: ${menuItems.length}`);
  console.log(`Total photos: ${photos.length}`);
  console.log(`Distinct restaurants with menu: ${new Set(menuItems.map(m => m.restaurant_id)).size}`);
  console.log(`Distinct restaurants with photos: ${new Set(photos.map(p => p.restaurant_id)).size}`);
  console.log('');
  if (critical > 0) {
    console.log(`${COLOR.red}${COLOR.bold}❌ ${critical} critical issue(s), ${warning} warning(s)${COLOR.reset}`);
    console.log(`${COLOR.red}Do NOT deploy until critical issues are resolved.${COLOR.reset}`);
    process.exit(1);
  }
  if (warning > 0) {
    console.log(`${COLOR.yellow}⚠️  ${warning} warning(s) — deploy OK but consider fixing.${COLOR.reset}`);
    process.exit(0);
  }
  console.log(`${COLOR.green}${COLOR.bold}✅ All checks passed. Safe to deploy.${COLOR.reset}`);
}

main().catch(err => { console.error(err); process.exit(2); });
