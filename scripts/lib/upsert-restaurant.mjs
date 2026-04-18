/**
 * upsertRestaurant — the ONLY way scripts should write restaurants.
 *
 * Why: Multiple historical import scripts (verified-import.mjs, city-pipeline.mjs,
 * fetch-restaurants.mjs) used plain INSERT. Result: 384 duplicate restaurants
 * with split menu/photo data. See WORKLOG.md pinned rules dated 2026-04-18.
 *
 * Usage:
 *   import { upsertRestaurant } from './lib/upsert-restaurant.mjs';
 *   const result = await upsertRestaurant(SUPABASE_URL, SUPABASE_KEY, {
 *     name: { en: 'NY Pizza Suprema' },
 *     lat: 40.7501,
 *     lng: -73.9952,
 *     external_ids: { google_place_id: 'ChIJ...' },
 *     // ... other fields
 *   });
 *   // result = { id, action: 'created' | 'updated' }
 *
 * Behavior:
 *   1. Looks for existing active restaurant within 50m of given lat/lng
 *      with matching name (lowercase) OR matching google_place_id.
 *   2. If found: PATCH the existing record (merging non-null fields only).
 *   3. If not found: INSERT new record.
 *   4. NEVER creates a second active record for same restaurant.
 */

const DEDUPE_RADIUS_METERS = 50;

function distMeters(a, b) {
  const dLat = (b.lat - a.lat) * 111000;
  const dLng = (b.lng - a.lng) * 111000 * Math.cos(a.lat * Math.PI / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function nameKey(nameObj) {
  if (!nameObj) return '';
  return (nameObj.en || nameObj.original || nameObj.romanized || '').toLowerCase().trim();
}

/**
 * Find an existing active restaurant matching the given input.
 * Match priority: exact google_place_id → name + within 50m
 */
async function findExisting(SUPABASE_URL, headers, input) {
  const placeId = input.external_ids?.google_place_id;

  // Try place_id match first (most reliable)
  if (placeId) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/restaurants?external_ids->>google_place_id=eq.${placeId}&select=id,lat,lng,name`,
      { headers }
    );
    if (r.ok) {
      const matches = await r.json();
      if (matches.length > 0) return matches[0];
    }
  }

  // Fall back to name + location proximity
  const key = nameKey(input.name);
  if (!key || input.lat == null || input.lng == null) return null;

  const latRange = DEDUPE_RADIUS_METERS / 111000;
  const lngRange = DEDUPE_RADIUS_METERS / (111000 * Math.cos(input.lat * Math.PI / 180));

  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/restaurants?lat=gte.${input.lat - latRange}&lat=lte.${input.lat + latRange}&lng=gte.${input.lng - lngRange}&lng=lte.${input.lng + lngRange}&select=id,name,lat,lng,external_ids`,
    { headers }
  );
  if (!r.ok) return null;
  const candidates = await r.json();

  // Filter by name match + true distance check
  for (const c of candidates) {
    if (nameKey(c.name) === key && distMeters(c, input) <= DEDUPE_RADIUS_METERS) {
      return c;
    }
  }
  return null;
}

/**
 * Merge new fields into existing record — only update if new value is non-null
 * and existing is null/empty (don't overwrite richer data with poorer data).
 */
function mergeFields(existing, input) {
  const update = {};
  for (const [key, val] of Object.entries(input)) {
    if (val == null) continue;
    if (key === 'id') continue;
    if (key === 'external_ids') {
      // Merge place_id if new one provided
      const merged = { ...(existing.external_ids || {}), ...val };
      if (JSON.stringify(merged) !== JSON.stringify(existing.external_ids)) {
        update.external_ids = merged;
      }
      continue;
    }
    // For other fields: only set if existing is empty
    const existingVal = existing[key];
    if (existingVal == null || existingVal === '' ||
        (Array.isArray(existingVal) && existingVal.length === 0)) {
      update[key] = val;
    }
  }
  if (Object.keys(update).length > 0) {
    update.updated_at = new Date().toISOString();
  }
  return update;
}

/**
 * Main upsert function.
 * @returns {{ id: string, action: 'created' | 'updated' | 'unchanged' }}
 */
export async function upsertRestaurant(SUPABASE_URL, SUPABASE_KEY, input) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  if (!input.name || input.lat == null || input.lng == null) {
    throw new Error('upsertRestaurant: name, lat, lng are required');
  }

  const existing = await findExisting(SUPABASE_URL, headers, input);

  if (existing) {
    const update = mergeFields(existing, input);
    if (Object.keys(update).length === 0) {
      return { id: existing.id, action: 'unchanged' };
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${existing.id}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(update),
    });
    if (!r.ok) throw new Error(`PATCH failed: ${r.status} ${await r.text()}`);
    return { id: existing.id, action: 'updated' };
  }

  // Insert new — ensure is_active=true so it's visible
  const newRow = { is_active: true, ...input };
  const r = await fetch(`${SUPABASE_URL}/rest/v1/restaurants`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(newRow),
  });
  if (!r.ok) throw new Error(`POST failed: ${r.status} ${await r.text()}`);
  const inserted = await r.json();
  return { id: inserted[0].id, action: 'created' };
}

/**
 * Insert menu items for a restaurant, deduplicating by (name + price).
 * Use this instead of plain INSERT when adding menu items.
 */
export async function upsertMenuItems(SUPABASE_URL, SUPABASE_KEY, restaurantId, items) {
  if (!items || items.length === 0) return { created: 0, skipped: 0 };

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };

  // Get existing menu items for this restaurant
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${restaurantId}&select=name,price`,
    { headers }
  );
  const existing = r.ok ? await r.json() : [];
  const existingKeys = new Set(
    existing.map((m) => `${(m.name?.en || m.name?.original || m.name || '').toLowerCase().trim()}:${m.price}`)
  );

  const toInsert = items.filter((item) => {
    const key = `${(item.name?.en || item.name?.original || item.name || '').toLowerCase().trim()}:${item.price}`;
    return !existingKeys.has(key);
  }).map((item) => ({ ...item, restaurant_id: restaurantId }));

  if (toInsert.length === 0) {
    return { created: 0, skipped: items.length };
  }

  const ins = await fetch(`${SUPABASE_URL}/rest/v1/menu_items`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(toInsert),
  });
  if (!ins.ok) throw new Error(`menu_items POST failed: ${ins.status} ${await ins.text()}`);
  return { created: toInsert.length, skipped: items.length - toInsert.length };
}
