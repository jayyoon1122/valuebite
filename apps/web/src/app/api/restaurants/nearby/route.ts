import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

const VALID_PURPOSES = new Set([
  'daily_eats', 'good_value', 'date_night', 'family_dinner',
  'late_night', 'healthy_budget', 'group_party', 'solo_dining', 'special_occasion',
]);

// Edge cache: same (lat, lng, purpose) tuple is served from Vercel's edge for 60s.
// stale-while-revalidate: serve cached data instantly for up to 5 min while
// refreshing in background. Most users see <50ms response.
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '35.6762');
  const lng = parseFloat(searchParams.get('lng') || '139.6503');
  const radiusKm = parseFloat(searchParams.get('radius') || '10');
  const purposeRaw = searchParams.get('purpose') || '';
  const purpose = purposeRaw.replace(/-/g, '_');

  const latRange = radiusKm / 111;
  const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };

  // Sort: purpose_score when specified, else value_score.
  // has_photos column is added by the 20260419 migration. Until applied,
  // sort gracefully degrades to value_score (still works, just no photo ranking).
  const sortClause = (purpose && VALID_PURPOSES.has(purpose))
    ? `order=purpose_scores->>${purpose}.desc.nullslast`
    : 'order=value_score.desc.nullslast';
  const overFetch = (purpose && VALID_PURPOSES.has(purpose)) ? 300 : 200;

  try {
    // ONE query (was 7+ before). Try to include has_photos column for fast
    // sort; fall back to old SELECT if column doesn't exist yet (pre-migration).
    const baseSelect = 'id,name,slug,lat,lng,cuisine_type,avg_meal_price,price_currency,value_score,taste_score,portion_score,total_reviews,is_chain,phone,website,purpose_scores,operating_hours,is_24h,updated_at';
    const tryWithHasPhotos = await fetch(
      `${SUPABASE_URL}/rest/v1/restaurants?is_active=eq.true&lat=gte.${lat - latRange}&lat=lte.${lat + latRange}&lng=gte.${lng - lngRange}&lng=lte.${lng + lngRange}&select=${baseSelect},has_photos&${sortClause}&limit=${overFetch}`,
      { headers, next: { revalidate: 60 } }
    );
    let restaurantsRes = tryWithHasPhotos;
    if (!tryWithHasPhotos.ok) {
      // has_photos column not yet present (migration not run) — retry without it
      restaurantsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/restaurants?is_active=eq.true&lat=gte.${lat - latRange}&lat=lte.${lat + latRange}&lng=gte.${lng - lngRange}&lng=lte.${lng + lngRange}&select=${baseSelect}&${sortClause}&limit=${overFetch}`,
        { headers, next: { revalidate: 60 } }
      );
    }

    if (!restaurantsRes.ok) {
      return NextResponse.json({ success: false, error: 'DB query failed' }, { status: 500 });
    }

    const data = await restaurantsRes.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ success: true, data: [], count: 0 }, { headers: CACHE_HEADERS });
    }

    // Pure in-memory transform + sort. No more I/O.
    const restaurants = data
      .map((r: any) => ({
        id: r.id,
        name: r.name || { en: 'Unknown' },
        slug: r.slug,
        cuisineType: r.cuisine_type || [],
        lat: r.lat,
        lng: r.lng,
        avgMealPrice: r.avg_meal_price ? parseFloat(String(r.avg_meal_price)) : undefined,
        priceCurrency: r.price_currency || 'USD',
        valueScore: r.value_score ? parseFloat(String(r.value_score)) : undefined,
        tasteScore: r.taste_score ? parseFloat(String(r.taste_score)) : undefined,
        portionScore: r.portion_score ? parseFloat(String(r.portion_score)) : undefined,
        totalReviews: r.total_reviews || 0,
        isChain: r.is_chain || false,
        purposeScores: r.purpose_scores || {},
        hasPhoto: !!r.has_photos,
        operatingHours: r.operating_hours,
        is24h: r.is_24h,
        lastVerified: r.updated_at || null,
        distance: Math.round(haversine(lat, lng, r.lat, r.lng)),
        freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
      }))
      .sort((a, b) => {
        if (purpose && VALID_PURPOSES.has(purpose)) {
          const sa = a.purposeScores?.[purpose] || 0;
          const sb = b.purposeScores?.[purpose] || 0;
          if (sa !== sb) return sb - sa;
          if (a.hasPhoto !== b.hasPhoto) return a.hasPhoto ? -1 : 1;
          return (b.valueScore || 0) - (a.valueScore || 0);
        }
        if (a.hasPhoto !== b.hasPhoto) return a.hasPhoto ? -1 : 1;
        return (b.valueScore || 0) - (a.valueScore || 0);
      });

    // ─────────── DIVERSIFICATION (P0-3) ───────────
    // For premium/curated purposes (date_night, special_occasion), the raw
    // sort produces "all sushi" because high-end sushi dominates the score.
    // Apply two filters:
    //   1. Value floor — exclude restaurants with value_score < 2.5
    //   2. Cuisine cap — limit each NORMALIZED cuisine bucket so the list
    //      shows variety. Bucket key collapses "Sushi Omakase",
    //      "All-You-Can-Eat Sushi", "Budget Omakase" all into "sushi" so cap
    //      actually limits sushi places.
    function bucketKey(types: string[] | undefined): string {
      if (!types || !types.length) return 'unknown';
      const first = String(types[0]).toLowerCase();
      // Normalize related sub-cuisines into one bucket
      if (/(sushi|omakase|kaiseki|sashimi)/.test(first)) return 'sushi_japanese_premium';
      if (/(steakhouse|gyukatsu|tonkatsu|teppan|wagyu)/.test(first)) return 'meat';
      if (/(ramen|noodle|udon|soba|pho)/.test(first)) return 'noodle';
      if (/(pizza|italian|pasta)/.test(first)) return 'italian';
      if (/(burger|fast_food)/.test(first)) return 'burger';
      if (/(thai|vietnamese|korean|chinese|indian)/.test(first)) return first.split(/\s/)[0];
      return first.split(/\s/)[0];
    }
    let diversified = restaurants;
    const PREMIUM_PURPOSES = new Set(['date_night', 'special_occasion']);
    if (purpose && PREMIUM_PURPOSES.has(purpose)) {
      const MAX_PER_CUISINE = 3;
      const VALUE_FLOOR = 2.5;
      const seenCuisine: Record<string, number> = {};
      diversified = restaurants
        .filter((r: any) => (r.valueScore || 0) >= VALUE_FLOOR)
        .filter((r: any) => {
          const key = bucketKey(r.cuisineType);
          seenCuisine[key] = (seenCuisine[key] || 0) + 1;
          return seenCuisine[key] <= MAX_PER_CUISINE;
        });
    }

    return NextResponse.json(
      { success: true, data: diversified.slice(0, 100), count: Math.min(diversified.length, 100) },
      { headers: CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
