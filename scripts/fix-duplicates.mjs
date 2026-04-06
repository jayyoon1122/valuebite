/**
 * Fix duplicate restaurants in Supabase
 * Keeps the one with more reviews/photos, deletes the rest
 */
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok && options.method !== 'DELETE') {
    console.error(`API error: ${res.status} ${await res.text()}`);
  }
  if (options.method === 'DELETE') return null;
  return res.json();
}

async function main() {
  console.log('🔍 Finding duplicate restaurants...');

  // Get all restaurants with their google_place_id
  const restaurants = await supaFetch(
    'restaurants?select=id,name,external_ids,total_reviews,is_verified&order=total_reviews.desc&limit=2000'
  );

  console.log(`Total restaurants: ${restaurants.length}`);

  // Group by google_place_id
  const byPlaceId = {};
  for (const r of restaurants) {
    const placeId = r.external_ids?.google_place_id;
    if (!placeId) continue;
    if (!byPlaceId[placeId]) byPlaceId[placeId] = [];
    byPlaceId[placeId].push(r);
  }

  // Find duplicates
  const duplicates = Object.entries(byPlaceId).filter(([, group]) => group.length > 1);
  console.log(`Found ${duplicates.length} duplicate groups`);

  let deleted = 0;
  for (const [placeId, group] of duplicates) {
    // Keep the one with most reviews (first one since sorted desc)
    const keep = group[0];
    const toDelete = group.slice(1);

    for (const dup of toDelete) {
      // Delete photos for duplicate
      await supaFetch(`menu_photos?restaurant_id=eq.${dup.id}`, { method: 'DELETE' });
      // Delete reviews for duplicate
      await supaFetch(`reviews?restaurant_id=eq.${dup.id}`, { method: 'DELETE' });
      // Delete the restaurant
      await supaFetch(`restaurants?id=eq.${dup.id}`, { method: 'DELETE' });
      deleted++;
    }
  }

  console.log(`\n✅ Deleted ${deleted} duplicate restaurants`);

  // Check final count
  const remaining = await supaFetch('restaurants?select=count', { headers: { 'Prefer': 'count=exact', 'Range': '0-0' } });
  console.log(`Remaining restaurants: ${remaining[0]?.count}`);
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
