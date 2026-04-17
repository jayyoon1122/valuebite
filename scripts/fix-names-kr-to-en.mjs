#!/usr/bin/env node
/**
 * Fix Korean restaurant names → fetch English name from Google Places API
 * For each restaurant with a Korean name.en, fetch the English name using place_id
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

// Check if string contains Korean characters
function hasKorean(str) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(str);
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

  // Filter to those with Korean in name.en
  const needFix = allRestaurants.filter(r => {
    const en = r.name?.en || '';
    return hasKorean(en);
  });

  console.log(`${needFix.length} restaurants have Korean text in name.en\n`);

  let fixed = 0, errors = 0;

  for (let i = 0; i < needFix.length; i++) {
    const r = needFix[i];
    const placeId = r.external_ids?.google_place_id;
    const currentName = r.name?.en || '?';

    if (!placeId) {
      console.log(`  [${i + 1}/${needFix.length}] SKIP ${currentName}: no place_id`);
      errors++;
      continue;
    }

    try {
      // Fetch place details in English
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name&language=en&key=${GOOGLE_KEY}`;
      const res = await fetch(detailUrl);
      const data = res.json();
      const englishName = data.result?.name;

      if (!englishName) {
        // Try Japanese as fallback (for Tokyo restaurants)
        const jaUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name&language=ja&key=${GOOGLE_KEY}`;
        const jaRes = await fetch(jaUrl);
        const jaData = jaRes.json();
        const jaName = jaData.result?.name;

        if (jaName && !hasKorean(jaName)) {
          // Use Japanese name as both en and original
          const newName = { en: jaName, original: jaName };
          await supabase(`restaurants?id=eq.${r.id}`, {
            method: 'PATCH',
            body: { name: newName },
          });
          fixed++;
          console.log(`  [${i + 1}/${needFix.length}] JA ${currentName} → ${jaName}`);
        } else {
          console.log(`  [${i + 1}/${needFix.length}] FAIL ${currentName}: no English/Japanese name`);
          errors++;
        }
      } else {
        // Also fetch Japanese name for "original" field
        let originalName = englishName;
        const jaUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name&language=ja&key=${GOOGLE_KEY}`;
        const jaRes = await fetch(jaUrl);
        const jaData = jaRes.json();
        if (jaData.result?.name) {
          originalName = jaData.result.name;
        }

        const newName = { en: englishName, original: originalName };
        await supabase(`restaurants?id=eq.${r.id}`, {
          method: 'PATCH',
          body: { name: newName },
        });

        fixed++;
        console.log(`  [${i + 1}/${needFix.length}] OK ${currentName} → ${englishName} (${originalName})`);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.log(`  [${i + 1}/${needFix.length}] ERR ${currentName}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${fixed} fixed, ${errors} errors`);
}

main().catch(console.error);
