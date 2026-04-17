#!/usr/bin/env node
/**
 * Purpose Scoring Pipeline
 * 1. Fetch structured attributes from Google Places API (New)
 * 2. Analyze review text for atmosphere/companion signals
 * 3. Compute purpose_scores for each restaurant
 * 4. Store place_attributes + purpose_scores in Supabase
 */
import { readFileSync } from 'fs';
import https from 'https';

const ENV = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = ENV.SUPABASE_SERVICE_KEY;
const GOOGLE_KEY = ENV.GOOGLE_PLACES_API_KEY;

function httpFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data, json: () => JSON.parse(data) }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function supabase(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await httpFetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status >= 400) throw new Error(`Supabase ${res.status}: ${res.data.slice(0, 300)}`);
  return res.data ? res.json() : null;
}

// ── Google Places API (New) ──
const PLACE_FIELDS = [
  'goodForChildren', 'goodForGroups', 'outdoorSeating', 'liveMusic',
  'servesCocktails', 'servesWine', 'servesBeer', 'reservable',
  'allowsDogs', 'dineIn', 'takeout', 'delivery', 'restroom',
  'reviews', 'priceLevel',
].join(',');

async function fetchPlaceAttributes(placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeId}?key=${GOOGLE_KEY}`;
  const res = await httpFetch(url, {
    headers: { 'X-Goog-FieldMask': PLACE_FIELDS },
  });
  if (res.status >= 400) return null;
  return res.json();
}

// ── Review Text Analysis ──
const REVIEW_SIGNALS = {
  date_night: {
    positive: /\b(romantic|date|anniversary|intimate|cozy|candle|couple|girlfriend|boyfriend|wife|husband|partner|ambiance|ambience|elegant|classy|wine|cocktail)\b/i,
    negative: /\b(noisy|loud|crowded|kids|family|children|fast food|quick bite)\b/i,
  },
  family_dinner: {
    positive: /\b(family|families|kids|children|child|kid-friendly|highchair|high chair|stroller|son|daughter|mom|dad|parents|spacious|roomy)\b/i,
    negative: /\b(bar|club|adults only|romantic|intimate|no kids)\b/i,
  },
  group_party: {
    positive: /\b(group|friends|party|gathering|celebration|birthday|large table|big table|private room|banquet|loud|fun|lively|sharing)\b/i,
    negative: /\b(quiet|intimate|solo|alone|small)\b/i,
  },
  solo_dining: {
    positive: /\b(solo|alone|myself|counter|bar seat|one person|quick|fast|by myself|single|grab|on the go)\b/i,
    negative: /\b(group|party|reservation required|wait|long wait)\b/i,
  },
  late_night: {
    positive: /\b(late|midnight|night|after hours|late-night|2am|3am|4am|open late|post-bar|after work|evening)\b/i,
    negative: /\b(closes early|lunch only|breakfast)\b/i,
  },
  healthy_budget: {
    positive: /\b(healthy|fresh|salad|vegan|vegetarian|organic|light|clean|nutritious|low-calorie|grilled|steamed)\b/i,
    negative: /\b(fried|greasy|heavy|oily|unhealthy|junk)\b/i,
  },
  special_occasion: {
    positive: /\b(special|occasion|celebrate|celebration|anniversary|birthday|proposal|elegant|fine dining|upscale|luxury|premium|tasting menu|omakase|michelin)\b/i,
    negative: /\b(cheap|fast food|casual|takeout|grab)\b/i,
  },
};

function analyzeReviews(reviews) {
  const signals = {};
  for (const [purpose, { positive, negative }] of Object.entries(REVIEW_SIGNALS)) {
    let posCount = 0, negCount = 0;
    for (const review of reviews) {
      const text = review.text?.text || review.originalText?.text || '';
      const posMatches = text.match(positive);
      const negMatches = text.match(negative);
      if (posMatches) posCount += posMatches.length;
      if (negMatches) negCount += negMatches.length;
    }
    // Normalize to 0-1 score
    const total = reviews.length || 1;
    signals[purpose] = Math.min(1, Math.max(0, (posCount - negCount * 0.5) / total));
  }
  return signals;
}

// ── Cuisine Type Matching ──
const CUISINE_SCORES = {
  date_night: {
    boost: ['italian', 'french', 'japanese', 'sushi', 'seafood', 'steakhouse', 'wine_bar', 'mediterranean', 'spanish', 'tapas', 'fine_dining', 'fusion', 'thai'],
    penalty: ['fast_food', 'burger', 'hot_dog', 'pizza', 'food_court', 'buffet', 'chicken', 'sandwich'],
  },
  family_dinner: {
    boost: ['pizza', 'burger', 'bbq', 'barbecue', 'american', 'chinese', 'korean', 'italian', 'mexican', 'indian', 'thai', 'buffet', 'pasta', 'chicken', 'diner'],
    penalty: ['bar', 'pub', 'cocktail', 'wine_bar', 'fine_dining'],
  },
  group_party: {
    boost: ['korean', 'bbq', 'barbecue', 'chinese', 'hot_pot', 'izakaya', 'tapas', 'sharing', 'buffet', 'mexican', 'indian', 'thai', 'yakitori'],
    penalty: ['fine_dining', 'omakase', 'counter'],
  },
  solo_dining: {
    boost: ['ramen', 'noodle', 'sushi', 'curry', 'rice', 'onigiri', 'sandwich', 'pho', 'udon', 'soba', 'gyudon', 'fast_food', 'diner', 'cafe', 'bakery', 'counter'],
    penalty: ['bbq', 'barbecue', 'hot_pot', 'sharing', 'banquet'],
  },
  late_night: {
    boost: ['ramen', 'fast_food', 'korean', 'bbq', 'kebab', 'burger', 'pizza', 'bar', 'izakaya', 'diner', 'noodle', 'street_food'],
    penalty: ['cafe', 'bakery', 'breakfast', 'brunch'],
  },
  healthy_budget: {
    boost: ['salad', 'poke', 'vegan', 'vegetarian', 'mediterranean', 'japanese', 'sushi', 'thai', 'vietnamese', 'indian_vegetarian', 'smoothie', 'acai'],
    penalty: ['fast_food', 'fried', 'burger', 'pizza', 'bbq', 'fried_chicken'],
  },
  daily_eats: {
    boost: ['ramen', 'curry', 'rice', 'noodle', 'sandwich', 'diner', 'cafe', 'fast_food', 'street_food', 'onigiri', 'gyudon', 'udon', 'soba'],
    penalty: ['fine_dining', 'omakase', 'steakhouse'],
  },
  good_value: {
    boost: [], // good_value is primarily score-driven, not cuisine-driven
    penalty: ['fine_dining', 'omakase'],
  },
  special_occasion: {
    boost: ['fine_dining', 'omakase', 'sushi', 'steakhouse', 'french', 'italian', 'seafood', 'tasting_menu', 'japanese', 'fusion'],
    penalty: ['fast_food', 'burger', 'hot_dog', 'sandwich', 'street_food', 'food_court'],
  },
};

function getCuisineScore(cuisineTypes, purpose) {
  const config = CUISINE_SCORES[purpose];
  if (!config) return 0;
  let score = 0;
  const types = (cuisineTypes || []).map(c => c.toLowerCase().replace(/\s+/g, '_'));
  for (const t of types) {
    if (config.boost.some(b => t.includes(b))) score += 0.3;
    if (config.penalty.some(p => t.includes(p))) score -= 0.2;
  }
  return Math.min(1, Math.max(-0.5, score));
}

// ── Price Level Mapping ──
const PRICE_SCORES = {
  //                              free  inexp  mod   exp   v_exp
  daily_eats:                   [ 0.8,  1.0,  0.5,  0.1,  0.0 ],
  good_value:                   [ 0.6,  1.0,  0.7,  0.2,  0.0 ],
  date_night:                   [ 0.0,  0.2,  0.8,  1.0,  0.7 ],
  family_dinner:                [ 0.3,  0.7,  1.0,  0.5,  0.1 ],
  late_night:                   [ 0.5,  0.8,  0.6,  0.2,  0.0 ],
  healthy_budget:               [ 0.5,  1.0,  0.6,  0.2,  0.0 ],
  group_party:                  [ 0.2,  0.6,  1.0,  0.6,  0.2 ],
  solo_dining:                  [ 0.7,  1.0,  0.5,  0.1,  0.0 ],
  special_occasion:             [ 0.0,  0.0,  0.3,  0.8,  1.0 ],
};

const PRICE_LEVEL_MAP = {
  'PRICE_LEVEL_FREE': 0,
  'PRICE_LEVEL_INEXPENSIVE': 1,
  'PRICE_LEVEL_MODERATE': 2,
  'PRICE_LEVEL_EXPENSIVE': 3,
  'PRICE_LEVEL_VERY_EXPENSIVE': 4,
};

function getPriceScore(priceLevel, purpose) {
  const idx = PRICE_LEVEL_MAP[priceLevel] ?? 1; // default inexpensive for budget app
  return (PRICE_SCORES[purpose] || PRICE_SCORES.daily_eats)[idx];
}

// ── Compute Final Purpose Scores ──
function computePurposeScores(restaurant, placeData, reviewSignals) {
  const attrs = placeData || {};
  const scores = {};

  const purposes = Object.keys(PRICE_SCORES);
  for (const purpose of purposes) {
    let score = 0;

    // 1. Google structured attributes (0-0.35)
    if (purpose === 'date_night') {
      if (attrs.servesCocktails) score += 0.12;
      if (attrs.servesWine) score += 0.12;
      if (attrs.reservable) score += 0.08;
      if (attrs.outdoorSeating) score += 0.05;
      if (attrs.goodForChildren) score -= 0.1;
      if (attrs.liveMusic) score += 0.03;
    }
    if (purpose === 'family_dinner') {
      if (attrs.goodForChildren) score += 0.25;
      if (attrs.goodForGroups) score += 0.1;
      if (attrs.dineIn) score += 0.05;
      if (attrs.restroom) score += 0.03;
    }
    if (purpose === 'group_party') {
      if (attrs.goodForGroups) score += 0.25;
      if (attrs.servesBeer) score += 0.05;
      if (attrs.reservable) score += 0.05;
      if (attrs.liveMusic) score += 0.05;
    }
    if (purpose === 'solo_dining') {
      if (attrs.takeout) score += 0.1;
      if (!attrs.reservable) score += 0.05;
      if (attrs.goodForGroups) score -= 0.05;
    }
    if (purpose === 'healthy_budget') {
      // Mostly driven by cuisine and reviews
    }
    if (purpose === 'special_occasion') {
      if (attrs.reservable) score += 0.15;
      if (attrs.servesCocktails) score += 0.1;
      if (attrs.servesWine) score += 0.1;
      if (attrs.goodForChildren) score -= 0.1;
    }

    // 2. Price level (0-0.25)
    score += getPriceScore(attrs.priceLevel, purpose) * 0.25;

    // 3. Review text signals (0-0.2)
    score += (reviewSignals[purpose] || 0) * 0.2;

    // 4. Cuisine match (0-0.15)
    score += getCuisineScore(restaurant.cuisine_type, purpose) * 0.15;

    // 5. Chain penalty for date_night/special_occasion (0 or -0.15)
    if ((purpose === 'date_night' || purpose === 'special_occasion') && restaurant.is_chain) {
      score -= 0.15;
    }

    // 6. Review count bonus — popular places get a small boost (0-0.05)
    const reviews = restaurant.total_reviews || 0;
    if (purpose === 'date_night' || purpose === 'family_dinner' || purpose === 'special_occasion') {
      score += Math.min(0.05, reviews / 10000);
    }

    // 7. Value score bonus for good_value purpose (0-0.15)
    if (purpose === 'good_value') {
      const vs = restaurant.value_score || 0;
      score += (vs / 5) * 0.15;
    }

    scores[purpose] = Math.round(Math.min(1, Math.max(0, score)) * 100) / 100;
  }

  return scores;
}

// ── Main Pipeline ──
async function main() {
  // Get all verified restaurants
  let allRestaurants = [];
  for (let offset = 0; offset < 2000; offset += 500) {
    const batch = await supabase(`restaurants?source=eq.verified_import&is_active=eq.true&select=id,name,external_ids,cuisine_type,is_chain,total_reviews,value_score,taste_score,avg_meal_price,price_currency&limit=500&offset=${offset}`, {
      headers: { 'Prefer': 'return=representation' },
    });
    if (!batch || batch.length === 0) break;
    allRestaurants = allRestaurants.concat(batch);
  }

  console.log(`Found ${allRestaurants.length} restaurants\n`);

  let success = 0, errors = 0, skipped = 0;

  for (let i = 0; i < allRestaurants.length; i++) {
    const r = allRestaurants[i];
    const placeId = r.external_ids?.google_place_id;
    const name = typeof r.name === 'object' ? (r.name?.en || r.name?.original || '?') : (r.name || '?');

    if (!placeId) {
      console.log(`  [${i + 1}/${allRestaurants.length}] SKIP ${name}: no place_id`);
      skipped++;
      continue;
    }

    try {
      // Fetch from Google Places API (New)
      const placeData = await fetchPlaceAttributes(placeId);

      if (!placeData || placeData.error) {
        console.log(`  [${i + 1}/${allRestaurants.length}] ERR ${name}: ${placeData?.error?.message?.slice(0, 80) || 'no data'}`);
        errors++;
        // Still compute scores with what we have
        const reviewSignals = {};
        const scores = computePurposeScores(r, {}, reviewSignals);
        await supabase(`restaurants?id=eq.${r.id}`, {
          method: 'PATCH',
          body: { purpose_scores: scores },
        });
        continue;
      }

      // Extract structured attributes
      const attrs = {
        goodForChildren: placeData.goodForChildren || false,
        goodForGroups: placeData.goodForGroups || false,
        outdoorSeating: placeData.outdoorSeating || false,
        liveMusic: placeData.liveMusic || false,
        servesCocktails: placeData.servesCocktails || false,
        servesWine: placeData.servesWine || false,
        servesBeer: placeData.servesBeer || false,
        reservable: placeData.reservable || false,
        allowsDogs: placeData.allowsDogs || false,
        dineIn: placeData.dineIn || false,
        takeout: placeData.takeout || false,
        delivery: placeData.delivery || false,
        restroom: placeData.restroom || false,
        priceLevel: placeData.priceLevel || null,
      };

      // Analyze review text
      const reviews = placeData.reviews || [];
      const reviewSignals = analyzeReviews(reviews);

      // Compute purpose scores
      const scores = computePurposeScores(r, attrs, reviewSignals);

      // Store both in DB
      await supabase(`restaurants?id=eq.${r.id}`, {
        method: 'PATCH',
        body: { place_attributes: attrs, purpose_scores: scores },
      });

      success++;
      const topPurpose = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      console.log(`  [${i + 1}/${allRestaurants.length}] OK ${name} | top: ${topPurpose[0]}=${topPurpose[1]} | children=${attrs.goodForChildren} groups=${attrs.goodForGroups} wine=${attrs.servesWine} reservable=${attrs.reservable}`);

      // Rate limit: ~5 req/sec
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.log(`  [${i + 1}/${allRestaurants.length}] ERR ${name}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${success} scored, ${errors} errors, ${skipped} skipped`);
}

main().catch(console.error);
