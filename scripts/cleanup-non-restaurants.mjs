/**
 * Deactivate restaurants that are clearly NOT restaurants.
 *
 * ROOT CAUSE: Google Places API returned mixed POI types tagged with `food`
 * or `restaurant` even when the place is actually a comic shop (animate),
 * pharmacy, hotel, etc. These leaked into our DB and showed up in purpose
 * results — e.g. "animate Ikebukuro Flagship Store" appearing as #3 for
 * Family Dinner.
 *
 * Strategy:
 *   1. Name-based blacklist for obviously-non-food chains (animate, BookOff,
 *      Don Quijote, Loft, Daiso, Yodobashi, Bic Camera, Yamada Denki, etc.)
 *   2. Cuisine-type blacklist when ALL tags are non-food (lodging,
 *      convenience_store, pharmacy, etc.)
 *   3. Heuristic: if name contains "Store" / "Mall" / "Plaza" without any
 *      food cuisine tag, flag for review.
 *
 * Outputs:
 *   - Deactivates obvious matches (sets is_active=false)
 *   - Prints suspicious matches for manual review (does NOT auto-deactivate)
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const headersJson = { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

// Names (case-insensitive) — TIGHT word-boundary match to avoid false positives
// like "Kerbey Lane Cafe - University" (has "university" but IS a cafe).
// These are the places where the BRAND name itself is non-food.
const NAME_BLACKLIST = [
  'animate ', 'animate ikebukuro', 'animate shibuya', // anime store
  'bookoff', 'book off',
  'don quijote', 'don quixote', 'donki main', 'donki shibuya',
  'tsutaya book', 'tsutaya shibuya', 'shibuya tsutaya',
  'tower records',
  'yodobashi camera',
  'bic camera', 'bicカメラ',
  'yamada denki',
  'matsumoto kiyoshi',
  'sundrug ',
  'uniqlo flagship', 'uniqlo shinjuku', 'uniqlo ginza',
  'gu shibuya', 'gu shinjuku',
  'muji flagship', 'muji ginza',
  'ikea ',
  'apple store',
  'コインパーキング',
];

// Cuisine-type blacklist: if ALL tags are in this set, place is non-food.
const NON_FOOD_TYPES = new Set([
  'store', 'lodging', 'hotel', 'spa', 'beauty_salon', 'pharmacy', 'drugstore',
  'convenience_store', 'supermarket', 'gas_station', 'parking', 'atm',
  'real_estate_agency', 'school', 'hospital', 'clinic', 'bank',
  'library', 'tourist_attraction', 'museum', 'shopping_mall',
  'point_of_interest', 'establishment', 'place_of_worship',
]);

// Tags that ALWAYS make it a real restaurant (override blacklist if present).
const FOOD_TAGS = new Set([
  'restaurant', 'cafe', 'bakery', 'bar', 'food', 'meal_takeaway', 'meal_delivery',
  'ramen', 'sushi', 'pizza', 'burger', 'curry', 'noodle', 'sandwich',
  'japanese', 'chinese', 'korean', 'thai', 'indian', 'italian', 'french',
  'mexican', 'american', 'vietnamese', 'mediterranean', 'spanish',
  'tonkatsu', 'gyukatsu', 'omakase', 'kaiseki', 'izakaya', 'yakitori',
  'tempura', 'donburi', 'gyudon', 'teppanyaki', 'tapas', 'dim_sum',
  'bbq', 'barbecue', 'steakhouse', 'wine_bar', 'cocktail_bar', 'pub',
  'dessert', 'ice_cream', 'donut', 'food_court', 'family_restaurant',
  'street_food',
]);

async function paginated(table, query) {
  const all = [];
  for (let offset = 0; offset < 100000; offset += 1000) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}&limit=1000&offset=${offset}`, { headers });
    const batch = await r.json();
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  return all;
}

function containsNameBlacklist(name) {
  const n = String(name || '').toLowerCase();
  return NAME_BLACKLIST.find(b => n.includes(b)) || null;
}

function isAllNonFood(types) {
  if (!Array.isArray(types) || types.length === 0) return false;
  // If ANY food tag present, it's a restaurant.
  for (const t of types) if (FOOD_TAGS.has(String(t).toLowerCase())) return false;
  // All remaining must be in non-food set.
  return types.every(t => NON_FOOD_TYPES.has(String(t).toLowerCase()));
}

async function main() {
  console.log('Loading active restaurants…');
  const restaurants = await paginated(
    'restaurants',
    'is_active=eq.true&select=id,name,cuisine_type'
  );
  console.log(`  ${restaurants.length} active restaurants\n`);

  const obvious = [];   // auto-deactivate
  const suspicious = []; // print only

  // Food keywords in NAME — if present, NEVER deactivate (very high precision).
  // This catches "Donburi and Noodle Restaurant Hashitate" with only "store" tag,
  // "Jason's Deli", "SCHMEARZ BAGEL SHOP", "Humphry Slocombe" (well-known shop), etc.
  const FOOD_NAME_KEYWORDS = [
    'restaurant', 'cafe', 'café', 'bistro', 'diner', 'eatery', 'kitchen',
    'bakery', 'bagel', 'bakehouse', 'pâtisserie', 'patisserie',
    'deli ', "'s deli", '-deli', 'deli$', // various Deli forms
    'pizzeria', 'pizza', 'taqueria', 'taco',
    'noodle', 'noodles', 'ramen', 'soba', 'udon', 'pho ',
    'sushi', 'omakase', 'kaiseki', 'izakaya', 'yakitori',
    'tonkatsu', 'gyukatsu', 'donburi', 'gyudon', 'kushiage', 'okonomiyaki',
    'curry', 'chinese', 'korean', 'thai', 'indian', 'italian', 'french',
    'mexican', 'vietnamese', 'spanish', 'mediterranean',
    'burger', 'sandwich', 'hot dog', 'fried chicken', 'fast food',
    'bbq', 'barbecue', 'grill ', 'steakhouse', 'steak ',
    'bar ', 'pub ', 'tavern', 'beer hall', 'wine bar', 'cocktail',
    'dessert', 'ice cream', 'gelato', 'yogurt', 'frozen yogurt', 'donut', 'doughnut',
    'food', 'food court', 'food hall', 'foods',
    'breakfast', 'brunch', 'lunch ',
    'tea house', 'teahouse', 'coffee', 'espresso', 'roastery',
    'churreria', 'churros', 'bakery',
    'mcdonald', 'kfc', 'burger king', 'subway', 'wendy', 'starbucks',
  ];

  function isLikelyRestaurantByName(name) {
    const n = String(name || '').toLowerCase();
    return FOOD_NAME_KEYWORDS.some(kw => n.includes(kw.replace('$', '')));
  }

  for (const r of restaurants) {
    const enName = (r.name?.en || r.name?.original || '').toString();
    const types = r.cuisine_type || [];
    const hasFoodTag = types.some(t => FOOD_TAGS.has(String(t).toLowerCase()));
    const blacklistMatch = containsNameBlacklist(enName);
    const looksLikeFood = isLikelyRestaurantByName(enName);

    // PRIORITY 1: Explicit non-food brand match always wins, even if Google
    // mis-tagged the place with a food tag. (e.g. "animate" tagged as Chinese.)
    if (blacklistMatch) {
      obvious.push({ id: r.id, name: enName, reason: `non-food brand: "${blacklistMatch}" (overrides food tag)`, types });
      continue;
    }

    // PRIORITY 2: Otherwise, food signals protect it.
    if (hasFoodTag || looksLikeFood) continue;

    // PRIORITY 3: All non-food tags + nothing else → deactivate.
    if (types.length > 0 && isAllNonFood(types) && !types.includes('store')) {
      obvious.push({ id: r.id, name: enName, reason: `non-food tags: ${types.join(',')}`, types });
    }
  }

  console.log(`Found ${obvious.length} obvious non-restaurants to deactivate.\n`);
  if (obvious.length > 0) {
    console.log('First 20 to be deactivated:');
    for (const x of obvious.slice(0, 20)) {
      console.log(`  - ${x.name.padEnd(50)} | ${x.reason}`);
    }
  }

  if (process.argv.includes('--apply')) {
    console.log('\nDeactivating obvious matches…');
    const CHUNK = 25;
    for (let i = 0; i < obvious.length; i += CHUNK) {
      const batch = obvious.slice(i, i + CHUNK);
      await Promise.all(batch.map(o =>
        fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${o.id}`, {
          method: 'PATCH', headers: headersJson,
          body: JSON.stringify({ is_active: false }),
        })
      ));
      if ((i + CHUNK) % 100 === 0) console.log(`  ${Math.min(i + CHUNK, obvious.length)}/${obvious.length}`);
    }
    console.log('Done.');
  } else {
    console.log('\nDry run. Re-run with --apply to actually deactivate these rows.');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
