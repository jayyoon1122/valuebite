#!/usr/bin/env node
/**
 * Verified Restaurant Import Pipeline
 *
 * Imports 1,200 curated restaurants from parsed_restaurants.json
 * Steps:
 *   1. Deactivate all existing restaurants
 *   2. For each restaurant: search Google Places → get place_id, lat, lng, photos
 *   3. Upsert restaurant with real menu prices
 *   4. Insert menu items
 *   5. Calculate value_score
 */

import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import https from 'https';

// ─── Config ───
const ENV = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = ENV.SUPABASE_SERVICE_KEY;
const GOOGLE_KEY = ENV.GOOGLE_PLACES_API_KEY;

const CITY_CONFIG = {
  nyc:       { country: 'US', currency: 'USD', lat: 40.7128, lng: -74.0060, searchSuffix: 'New York City' },
  la:        { country: 'US', currency: 'USD', lat: 34.0522, lng: -118.2437, searchSuffix: 'Los Angeles' },
  tokyo:     { country: 'JP', currency: 'JPY', lat: 35.6762, lng: 139.6503, searchSuffix: 'Tokyo' },
  singapore: { country: 'SG', currency: 'SGD', lat: 1.3521, lng: 103.8198, searchSuffix: 'Singapore' },
  hongkong:  { country: 'HK', currency: 'HKD', lat: 22.3193, lng: 114.1694, searchSuffix: 'Hong Kong' },
  london:    { country: 'GB', currency: 'GBP', lat: 51.5074, lng: -0.1278, searchSuffix: 'London' },
};

// ─── HTTP helpers ───
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
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
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation,resolution=merge-duplicates' : 'return=representation',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status >= 400) {
    const errText = res.data;
    throw new Error(`Supabase ${res.status}: ${errText}`);
  }
  return res.data ? res.json() : null;
}

// ─── Google Places API (Legacy) ───
async function searchPlace(name, city) {
  const cfg = CITY_CONFIG[city];
  const query = encodeURIComponent(`${name} ${cfg.searchSuffix}`);

  // Step 1: Find place_id
  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address,geometry,rating,user_ratings_total&locationbias=circle:30000@${cfg.lat},${cfg.lng}&key=${GOOGLE_KEY}`;
  const findRes = await fetch(findUrl);
  const findData = findRes.json();
  if (!findData.candidates || findData.candidates.length === 0) return null;

  const candidate = findData.candidates[0];
  const placeId = candidate.place_id;

  // Step 2: Get full details (photos, hours, contact)
  const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo,opening_hours,website,formatted_phone_number,types&key=${GOOGLE_KEY}`;
  const detailRes = await fetch(detailUrl);
  const detailData = detailRes.json();
  const details = detailData.result || {};

  return {
    id: placeId,
    displayName: { text: candidate.name },
    formattedAddress: candidate.formatted_address,
    location: {
      latitude: candidate.geometry?.location?.lat,
      longitude: candidate.geometry?.location?.lng,
    },
    rating: candidate.rating,
    userRatingCount: candidate.user_ratings_total,
    types: details.types || [],
    websiteUri: details.website,
    internationalPhoneNumber: details.formatted_phone_number,
    regularOpeningHours: details.opening_hours,
    photos: (details.photos || []).map(ph => ({
      name: ph.photo_reference,
      widthPx: ph.width,
      heightPx: ph.height,
    })),
  };
}

// ─── Value Score Calculation ───
function calcValueScore(avgPrice, rating, reviewCount, cityBenchmark) {
  // Price factor: how much below benchmark (0-2 range, 1 = at benchmark)
  const priceFactor = avgPrice > 0 ? Math.min(2, cityBenchmark / avgPrice) : 1;
  // Rating factor: normalized to 0-1 (Google max is 5)
  const ratingFactor = (rating || 4.0) / 5;
  // Popularity factor: log scale of reviews
  const popFactor = Math.min(1, Math.log10(Math.max(1, reviewCount)) / 4);
  // Weighted score (max ~5)
  const score = (priceFactor * 0.4 + ratingFactor * 0.4 + popFactor * 0.2) * 5;
  return Math.round(Math.min(5, Math.max(1, score)) * 100) / 100;
}

// Benchmarks per city (typical budget meal price in local currency)
const CITY_BENCHMARKS = {
  nyc: 15, la: 13, tokyo: 1000, singapore: 8, hongkong: 60, london: 12,
};

// ─── Purpose Fit Calculation ───
function calcPurposeFit(restaurant, menuItems) {
  const price = restaurant.avg_meal_price || 0;
  const rating = restaurant.rating || 0;
  const reviews = restaurant.total_reviews || 0;
  const cuisine = (Array.isArray(restaurant.cuisine_type) ? restaurant.cuisine_type.join(' ') : (restaurant.cuisine_type || '')).toLowerCase();

  // daily_eats: low price, popular (many reviews = locals eat there)
  const daily = (reviews > 100 ? 0.4 : reviews > 30 ? 0.2 : 0) +
                (price > 0 ? Math.min(0.6, 0.6 * (CITY_BENCHMARKS[restaurant._city] || 15) / price) : 0.3);

  // good_value: best price-to-quality ratio
  const value = (rating >= 4.5 ? 0.4 : rating >= 4.0 ? 0.3 : 0.2) +
                (price > 0 ? Math.min(0.6, 0.6 * (CITY_BENCHMARKS[restaurant._city] || 15) / price) : 0.3);

  // date_night: decent rating, not too cheap (feels special)
  const date = (rating >= 4.3 ? 0.4 : rating >= 4.0 ? 0.3 : 0.1) +
               (reviews > 200 ? 0.3 : reviews > 50 ? 0.2 : 0.1) +
               (['italian', 'french', 'japanese', 'korean', 'spanish'].some(c => cuisine.includes(c)) ? 0.3 : 0.1);

  // solo_dining: practical, quick, counter service type
  const solo = (reviews > 50 ? 0.3 : 0.1) +
               (['ramen', 'noodle', 'fast', 'pizza', 'taco', 'sandwich', 'curry'].some(c => cuisine.includes(c)) ? 0.4 : 0.2) +
               (price > 0 && price <= (CITY_BENCHMARKS[restaurant._city] || 15) ? 0.3 : 0.1);

  // late_night: check if open late
  const lateNight = (restaurant.is_24h ? 0.8 : 0.2) + (reviews > 30 ? 0.2 : 0);

  // Only use columns that exist in the DB table
  return {
    fit_daily_eats: Math.min(1, daily),
    fit_date_night: Math.min(1, date),
    fit_family_dinner: Math.min(1, (rating >= 4.0 ? 0.5 : 0.3) + (reviews > 100 ? 0.3 : 0.1) + 0.2),
    fit_late_night: Math.min(1, lateNight),
    fit_healthy_budget: Math.min(1, (['salad', 'healthy', 'vegetarian', 'vegan', 'poke'].some(c => cuisine.includes(c)) ? 0.7 : 0.2) + 0.2),
    fit_group_party: Math.min(1, (reviews > 200 ? 0.4 : 0.2) + (rating >= 4.0 ? 0.3 : 0.1) + 0.2),
    fit_solo_dining: Math.min(1, solo),
    fit_special_occasion: Math.min(1, (rating >= 4.5 ? 0.5 : rating >= 4.0 ? 0.3 : 0.1) + (reviews > 500 ? 0.3 : 0.1) + 0.1),
  };
}

// ─── Slug generation ───
function makeSlug(name) {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
  const hash = createHash('md5').update(name).digest('hex').slice(0, 4);
  return `${base}-${hash}`;
}

// ─── Parse operating hours from Google ───
function parseHours(regularOpeningHours) {
  if (!regularOpeningHours?.periods) return {};
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const hours = {};
  for (const p of regularOpeningHours.periods) {
    const dayIdx = p.open?.day ?? 0;
    const day = days[dayIdx];
    if (day && p.open) {
      const openTime = p.open.time || '0000';
      const closeTime = p.close?.time || '2359';
      hours[day] = {
        open: openTime.slice(0, 2) + ':' + openTime.slice(2),
        close: closeTime.slice(0, 2) + ':' + closeTime.slice(2),
      };
    }
  }
  return hours;
}

// ─── Photo references from Google ───
function extractPhotos(place) {
  if (!place.photos) return [];
  return place.photos.slice(0, 10).map(p => ({
    url: `gphoto:${p.name}`,  // photo_reference stored as gphoto: token
    label: 'food',
    width: p.widthPx || 400,
    height: p.heightPx || 300,
  }));
}

// ─── Main Pipeline ───
async function main() {
  const args = process.argv.slice(2);
  const targetCity = args[0]; // optional: run single city

  const parsed = JSON.parse(readFileSync('FYI/parsed_restaurants.json', 'utf8'));

  const citiesToRun = targetCity ? [targetCity] : Object.keys(CITY_CONFIG);

  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║  Verified Restaurant Import Pipeline  ║`);
  console.log(`╚═══════════════════════════════════════╝\n`);
  console.log(`Cities: ${citiesToRun.join(', ')}`);
  console.log(`Total restaurants: ${citiesToRun.reduce((s, c) => s + (parsed[c]?.length || 0), 0)}\n`);

  // Step 1: Deactivate existing (only on full run)
  if (!targetCity) {
    console.log('═══ Step 1: Deactivating existing restaurants ═══');
    try {
      await supabase('restaurants?is_active=eq.true', {
        method: 'PATCH',
        body: { is_active: false },
        headers: { 'Prefer': 'return=minimal' },
      });
      console.log('  ✓ All existing restaurants deactivated\n');
    } catch (e) {
      console.log(`  Warning: ${e.message}\n`);
    }
  }

  const stats = { total: 0, found: 0, inserted: 0, menuItems: 0, errors: 0 };

  for (const city of citiesToRun) {
    const restaurants = parsed[city];
    if (!restaurants) { console.log(`Skipping ${city}: no data`); continue; }

    const cfg = CITY_CONFIG[city];
    console.log(`\n═══ ${cfg.searchSuffix} (${restaurants.length} restaurants) ═══`);

    for (let i = 0; i < restaurants.length; i++) {
      const r = restaurants[i];
      stats.total++;
      const progress = `[${i + 1}/${restaurants.length}]`;

      try {
        // Search Google Places
        const place = await searchPlace(r.name, city);

        if (!place) {
          console.log(`  ${progress} ✗ ${r.name}: not found on Google`);
          stats.errors++;
          continue;
        }

        stats.found++;
        const placeId = place.id;
        const lat = place.location?.latitude;
        const lng = place.location?.longitude;
        const rating = place.rating || 0;
        const reviewCount = place.userRatingCount || 0;
        const photos = extractPhotos(place);
        const hours = parseHours(place.regularOpeningHours);

        // Calculate avg meal price from menu items (median of main items)
        const prices = r.menu.map(m => m.price).filter(p => p > 0).sort((a, b) => a - b);
        const mid = Math.floor(prices.length / 2);
        const avgPrice = prices.length > 0
          ? (prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2)
          : 0;

        const valueScore = calcValueScore(avgPrice, rating, reviewCount, CITY_BENCHMARKS[city]);

        const restaurantData = {
          name: { en: place.displayName?.text || r.name, original: r.name },
          slug: makeSlug(r.name),
          cuisine_type: [r.cuisine],
          lat, lng,
          address: { en: place.formattedAddress || '', original: place.formattedAddress || '' },
          phone: place.internationalPhoneNumber || '',
          website: place.websiteUri || '',
          operating_hours: hours,
          is_24h: Object.values(hours).some(h => h.open === '00:00' && h.close === '23:59'),
          avg_meal_price: avgPrice,
          price_currency: cfg.currency,
          price_last_verified: new Date().toISOString(),
          value_score: valueScore,
          source: 'verified_import',
          external_ids: { google_place_id: placeId },
          is_verified: true,
          is_active: true,
          total_reviews: reviewCount,
          photo_count: photos.length,
          _city: city, // temp field for purpose calc
        };

        // Calculate purpose fit
        const purposeFit = calcPurposeFit(restaurantData, r.menu);
        Object.assign(restaurantData, purposeFit);
        delete restaurantData._city;

        // Upsert restaurant
        const [inserted] = await supabase('restaurants?on_conflict=slug', {
          method: 'POST',
          body: restaurantData,
          headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
        });

        const restaurantId = inserted?.id;
        if (!restaurantId) {
          console.log(`  ${progress} ✗ ${r.name}: insert failed`);
          stats.errors++;
          continue;
        }

        stats.inserted++;

        // Insert photos
        if (photos.length > 0) {
          try {
            await supabase('photos', {
              method: 'POST',
              body: photos.map(p => ({
                restaurant_id: restaurantId,
                url: p.url,
                label: p.label,
                width: p.width,
                height: p.height,
                source: 'google_places',
                is_verified: true,
              })),
            });
          } catch (e) {
            // Photos might already exist
          }
        }

        // Delete existing menu items for this restaurant
        try {
          await supabase(`menu_items?restaurant_id=eq.${restaurantId}`, {
            method: 'DELETE',
            headers: { 'Prefer': 'return=minimal' },
          });
        } catch (e) { /* ignore */ }

        // Insert menu items from Excel
        if (r.menu.length > 0) {
          const menuData = r.menu
            .filter(m => m.name && m.price > 0)
            .map(m => ({
              restaurant_id: restaurantId,
              name: { en: m.name, original: m.name },
              category: 'main',
              price: m.price,
              currency: cfg.currency,
              source: 'verified_import',
              last_verified: new Date().toISOString(),
            }));

          if (menuData.length > 0) {
            await supabase('menu_items', {
              method: 'POST',
              body: menuData,
            });
            stats.menuItems += menuData.length;
          }
        }

        console.log(`  ${progress} ✓ ${r.name}: ${rating}★ ${reviewCount} reviews, ${cfg.currency} ${avgPrice}, ${photos.length} photos`);

        // Rate limit: ~5 requests/sec to stay safe
        await new Promise(r => setTimeout(r, 200));

      } catch (e) {
        console.log(`  ${progress} ✗ ${r.name}: ${e.message}`);
        stats.errors++;
      }
    }
  }

  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║           Import Complete             ║`);
  console.log(`╚═══════════════════════════════════════╝`);
  console.log(`  Total processed: ${stats.total}`);
  console.log(`  Found on Google: ${stats.found}`);
  console.log(`  Inserted/Updated: ${stats.inserted}`);
  console.log(`  Menu items: ${stats.menuItems}`);
  console.log(`  Errors: ${stats.errors}`);
}

main().catch(console.error);
