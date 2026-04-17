#!/usr/bin/env node
/**
 * Insert photos for verified restaurants into menu_photos table
 * Reads restaurant external_ids.google_place_id → calls Place Details → inserts photo refs
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

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: options.method || 'GET', headers: options.headers || {} };
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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status >= 400) throw new Error(`Supabase ${res.status}: ${res.data.slice(0, 200)}`);
  return res.data ? res.json() : null;
}

async function main() {
  // Get all verified restaurants
  let allRestaurants = [];
  for (let offset = 0; offset < 2000; offset += 500) {
    const batch = await supabase(`restaurants?source=eq.verified_import&is_active=eq.true&select=id,name,external_ids&limit=500&offset=${offset}`, {
      headers: { 'Prefer': 'return=representation' },
    });
    if (!batch || batch.length === 0) break;
    allRestaurants = allRestaurants.concat(batch);
  }

  console.log(`Found ${allRestaurants.length} verified restaurants`);

  // Check which already have photos
  const withPhotos = new Set();
  for (let offset = 0; offset < 20000; offset += 1000) {
    const batch = await supabase(`menu_photos?select=restaurant_id&limit=1000&offset=${offset}`, {
      headers: { 'Prefer': 'return=representation' },
    });
    if (!batch || batch.length === 0) break;
    batch.forEach(p => withPhotos.add(p.restaurant_id));
  }
  console.log(`${withPhotos.size} restaurants already have photos`);

  const needPhotos = allRestaurants.filter(r => !withPhotos.has(r.id));
  console.log(`${needPhotos.length} restaurants need photos\n`);

  let success = 0, errors = 0;

  for (let i = 0; i < needPhotos.length; i++) {
    const r = needPhotos[i];
    const placeId = r.external_ids?.google_place_id;
    const name = typeof r.name === 'string' ? r.name : (r.name?.en || '?');

    if (!placeId) {
      console.log(`  [${i + 1}/${needPhotos.length}] ✗ ${name}: no place_id`);
      errors++;
      continue;
    }

    try {
      // Get photos from Place Details
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${GOOGLE_KEY}`;
      const res = await fetch(detailUrl);
      const data = res.json();
      const photos = data.result?.photos || [];

      if (photos.length === 0) {
        console.log(`  [${i + 1}/${needPhotos.length}] ✗ ${name}: no photos`);
        errors++;
        continue;
      }

      // Insert into menu_photos (max 10)
      const photoData = photos.slice(0, 10).map(p => ({
        restaurant_id: r.id,
        photo_url: `gphoto:${p.photo_reference}`,
        ai_processed: true,
        ai_confidence: 0.85,
        ai_language_detected: 'exterior',
        is_stale: false,
      }));

      await supabase('menu_photos', {
        method: 'POST',
        body: photoData,
      });

      success++;
      console.log(`  [${i + 1}/${needPhotos.length}] ✓ ${name}: ${photos.length} photos`);

      // Rate limit
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.log(`  [${i + 1}/${needPhotos.length}] ✗ ${name}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${success} success, ${errors} errors`);
}

main().catch(console.error);
