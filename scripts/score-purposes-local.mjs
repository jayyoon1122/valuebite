/**
 * Score all active restaurants for all 9 purposes using LOCAL data only.
 *
 * Why local: scoring 6,000+ restaurants via Google Places API would take hours
 * and cost $$. We have enough signal from cuisine_type + is_chain + avg_meal_price
 * + value/taste/portion scores + total_reviews to differentiate purposes well.
 *
 * Each purpose gets a score 0.0-1.0. Higher = better fit.
 * Page filter: shows restaurants with score >= 0.4 OR price-bracket match.
 *
 * Run: node scripts/score-purposes-local.mjs
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const headersJson = { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

// ───── Cuisine fit per purpose ─────
// boost: cuisine type contributes positively (each boost match = +0.25)
// penalty: cuisine type contributes negatively (each penalty match = -0.20)
const CUISINE_FIT = {
  date_night: {
    boost: ['italian', 'french', 'sushi', 'omakase', 'kaiseki', 'steakhouse', 'wine_bar', 'mediterranean', 'spanish', 'tapas', 'fine_dining', 'fusion', 'seafood', 'dessert', 'cocktail', 'lounge'],
    penalty: ['fast_food', 'food_court', 'buffet', 'meal_takeaway', 'meal_delivery', 'bakery', 'cafe', 'donut', 'street_food'],
  },
  family_dinner: {
    boost: ['pizza', 'burger', 'bbq', 'barbecue', 'american', 'chinese', 'korean', 'italian', 'mexican', 'indian', 'thai', 'family_restaurant', 'pasta', 'chicken', 'diner', 'teppanyaki', 'tonkatsu', 'donburi', 'gyudon'],
    penalty: ['bar', 'pub', 'cocktail', 'wine_bar', 'lounge', 'nightclub', 'omakase', 'fine_dining'],
  },
  group_party: {
    boost: ['korean', 'bbq', 'barbecue', 'chinese', 'hot_pot', 'izakaya', 'tapas', 'sharing', 'buffet', 'mexican', 'indian', 'thai', 'yakitori', 'pub', 'beer_hall', 'sports_bar'],
    penalty: ['fine_dining', 'omakase', 'kaiseki', 'cafe', 'bakery', 'fast_food'],
  },
  solo_dining: {
    boost: ['ramen', 'noodle', 'curry', 'rice', 'onigiri', 'sandwich', 'pho', 'udon', 'soba', 'gyudon', 'donburi', 'fast_food', 'diner', 'cafe', 'bakery', 'sushi', 'tonkatsu', 'standing_bar'],
    penalty: ['bbq', 'barbecue', 'hot_pot', 'sharing', 'banquet', 'kaiseki', 'fine_dining'],
  },
  late_night: {
    boost: ['ramen', 'fast_food', 'korean', 'bbq', 'kebab', 'burger', 'pizza', 'bar', 'pub', 'izakaya', 'diner', 'noodle', 'street_food', 'late_night'],
    penalty: ['cafe', 'bakery', 'breakfast', 'brunch', 'bistro', 'fine_dining'],
  },
  healthy_budget: {
    boost: ['salad', 'poke', 'vegan', 'vegetarian', 'mediterranean', 'sushi', 'thai', 'vietnamese', 'smoothie', 'acai', 'organic', 'health_food', 'juice', 'donburi', 'soba'],
    penalty: ['fast_food', 'fried_chicken', 'burger', 'pizza', 'bbq', 'donut', 'dessert', 'fried'],
  },
  daily_eats: {
    boost: ['ramen', 'curry', 'rice', 'noodle', 'sandwich', 'diner', 'cafe', 'fast_food', 'street_food', 'onigiri', 'gyudon', 'udon', 'soba', 'donburi', 'family_restaurant', 'tonkatsu', 'meal_takeaway'],
    penalty: ['fine_dining', 'omakase', 'kaiseki', 'steakhouse', 'wine_bar', 'cocktail'],
  },
  good_value: {
    boost: [], // primarily score-driven, not cuisine-driven
    penalty: ['fine_dining', 'omakase', 'kaiseki'],
  },
  special_occasion: {
    boost: ['fine_dining', 'omakase', 'sushi', 'steakhouse', 'french', 'italian', 'seafood', 'tasting_menu', 'fusion', 'kaiseki', 'wine_bar', 'cocktail', 'mediterranean'],
    penalty: ['fast_food', 'burger', 'hot_dog', 'sandwich', 'street_food', 'food_court', 'meal_takeaway', 'meal_delivery', 'cafe', 'bakery', 'donut'],
  },
};

// ───── Price-tier preference per purpose ─────
// We DON'T have Google price_level for most, so derive from avg_meal_price (in local currency).
// Function: returns price-fit score 0-1 based on whether price is in the "ideal range" for purpose.
function priceTierScore(price, currency, purpose) {
  if (!price || price <= 0) return 0.3; // neutral if unknown
  // Normalize price to JPY equivalent (rough multipliers)
  const toJPY = { JPY: 1, USD: 150, GBP: 190, EUR: 165, AUD: 100, SGD: 110, HKD: 19, KRW: 0.11, TWD: 4.7, CHF: 170, CAD: 110, INR: 1.8, MXN: 8, NZD: 90, THB: 4.2, AED: 41, ILS: 41, TRY: 5, PLN: 38, HUF: 0.42, CZK: 6.6, BGN: 84 };
  const jpy = price * (toJPY[currency] || 1);

  // Purpose-specific ideal ranges (in JPY equivalent):
  const ranges = {
    daily_eats:       { ideal: [200, 800],   ok: [0, 1500] },
    good_value:       { ideal: [400, 1500],  ok: [0, 2500] },
    date_night:       { ideal: [2500, 6000], ok: [1500, 12000] },
    family_dinner:    { ideal: [800, 2500],  ok: [400, 5000] },
    late_night:       { ideal: [400, 1500],  ok: [0, 3000] },
    healthy_budget:   { ideal: [500, 1500],  ok: [0, 2500] },
    group_party:      { ideal: [1500, 4000], ok: [800, 6000] },
    solo_dining:      { ideal: [300, 1200],  ok: [0, 2500] },
    special_occasion: { ideal: [5000, 30000],ok: [3000, 100000] },
  };
  const r = ranges[purpose] || ranges.daily_eats;
  if (jpy >= r.ideal[0] && jpy <= r.ideal[1]) return 1.0;
  if (jpy >= r.ok[0] && jpy <= r.ok[1]) {
    // partial credit — closer to ideal = higher
    if (jpy < r.ideal[0]) return 0.5 + 0.4 * (jpy - r.ok[0]) / (r.ideal[0] - r.ok[0]);
    return 0.5 + 0.4 * (r.ok[1] - jpy) / (r.ok[1] - r.ideal[1]);
  }
  return 0.0;
}

function cuisineScore(cuisineTypes, purpose) {
  const config = CUISINE_FIT[purpose];
  if (!config) return 0;
  const types = (cuisineTypes || []).map(c => c.toLowerCase().replace(/[\s-]+/g, '_'));
  let score = 0;
  for (const t of types) {
    if (config.boost.some(b => t.includes(b) || b.includes(t))) score += 0.25;
    if (config.penalty.some(p => t.includes(p) || p.includes(t))) score -= 0.20;
  }
  return Math.min(1, Math.max(-0.5, score));
}

// ───── Final score formula ─────
// Weights chosen so that a perfect cuisine + ideal price + good value = ~0.85 score
// And a wrong cuisine match drops below 0.4 threshold.
function computeScore(restaurant, purpose) {
  let score = 0;

  // 1. Cuisine fit (0-0.45) — biggest signal
  score += cuisineScore(restaurant.cuisine_type, purpose) * 0.45;

  // 2. Price tier fit (0-0.35) — second biggest
  score += priceTierScore(restaurant.avg_meal_price, restaurant.price_currency, purpose) * 0.35;

  // 3. Quality bonus (0-0.10) — based on value_score + taste_score
  const quality = ((restaurant.value_score || 0) + (restaurant.taste_score || 0)) / 10;
  score += Math.min(0.10, quality * 0.10);

  // 4. Popularity bonus (0-0.05) — total_reviews indicates trust
  const popularity = Math.min(1, (restaurant.total_reviews || 0) / 2000);
  score += popularity * 0.05;

  // 5. Chain penalty for date_night / special_occasion / healthy_budget
  if (['date_night', 'special_occasion'].includes(purpose) && restaurant.is_chain) {
    score -= 0.20;
  }
  if (purpose === 'healthy_budget' && restaurant.is_chain) {
    score -= 0.10;
  }

  // 6. good_value bonus — if value_score >= 4, big boost
  if (purpose === 'good_value' && (restaurant.value_score || 0) >= 4) {
    score += 0.15;
  }

  // 7. solo_dining bonus — places with high portion score (filling enough alone)
  if (purpose === 'solo_dining' && (restaurant.portion_score || 0) >= 4) {
    score += 0.05;
  }

  return Math.round(Math.min(1, Math.max(0, score)) * 100) / 100;
}

const PURPOSES = ['daily_eats', 'good_value', 'date_night', 'family_dinner', 'late_night', 'healthy_budget', 'group_party', 'solo_dining', 'special_occasion'];

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

async function patchBatch(updates) {
  // Supabase REST doesn't support bulk PATCH by id list with different bodies — must do per row
  // But we can parallelize in chunks
  const CHUNK = 25;
  for (let i = 0; i < updates.length; i += CHUNK) {
    const batch = updates.slice(i, i + CHUNK);
    await Promise.all(batch.map(u =>
      fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${u.id}`, {
        method: 'PATCH', headers: headersJson,
        body: JSON.stringify({ purpose_scores: u.scores }),
      })
    ));
    if ((i + CHUNK) % 250 === 0) console.log(`  ${Math.min(i + CHUNK, updates.length)}/${updates.length} updated`);
  }
}

async function main() {
  console.log('Loading active restaurants...');
  const restaurants = await paginated('restaurants', 'is_active=eq.true&select=id,name,cuisine_type,avg_meal_price,price_currency,value_score,taste_score,portion_score,total_reviews,is_chain');
  console.log(`  ${restaurants.length} active restaurants`);

  console.log('\nComputing scores for all 9 purposes...');
  const updates = [];
  for (const r of restaurants) {
    const scores = {};
    for (const p of PURPOSES) scores[p] = computeScore(r, p);
    updates.push({ id: r.id, scores });
  }

  // Print distribution to verify scores look right
  console.log('\nScore distribution (active restaurants with score >= 0.4 per purpose):');
  for (const p of PURPOSES) {
    const fits = updates.filter(u => u.scores[p] >= 0.4).length;
    const top5 = updates.map(u => ({ id: u.id, score: u.scores[p] }))
      .sort((a, b) => b.score - a.score).slice(0, 5);
    const top5Names = top5.map(t => {
      const r = restaurants.find(x => x.id === t.id);
      return (r.name?.en || r.name?.original || '?').substring(0, 30) + ' (' + t.score.toFixed(2) + ')';
    });
    console.log('  ' + p.padEnd(20) + ' score>=0.4: ' + fits + ' restaurants. TOP 3: ' + top5Names.slice(0, 3).join(', '));
  }

  console.log('\nWriting purpose_scores to DB...');
  await patchBatch(updates);
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
