import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '35.6762');
  const lng = parseFloat(searchParams.get('lng') || '139.6503');
  const radiusKm = parseFloat(searchParams.get('radius') || '10');

  const latRange = radiusKm / 111;
  const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  };

  try {
    // Fetch restaurants in area (over-fetch to allow re-ranking)
    const restaurantsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/restaurants?is_active=eq.true&lat=gte.${lat - latRange}&lat=lte.${lat + latRange}&lng=gte.${lng - lngRange}&lng=lte.${lng + lngRange}&select=id,name,slug,lat,lng,cuisine_type,avg_meal_price,price_currency,value_score,taste_score,portion_score,total_reviews,is_chain,phone,website,purpose_scores,place_attributes&order=value_score.desc.nullslast&limit=300`,
      { headers }
    );

    if (!restaurantsRes.ok) {
      return NextResponse.json({ success: false, error: 'DB query failed' }, { status: 500 });
    }

    const data = await restaurantsRes.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ success: true, data: [], count: 0 });
    }

    // Fetch which of these restaurants have photos. Chunk IDs to keep URL under PostgREST's
    // ~8KB limit. 50 UUIDs per batch ≈ 2KB URL.
    const ids = data.map((r: any) => r.id as string);
    const restaurantsWithPhotos = new Set<string>();
    const CHUNK = 50;
    const photoBatches = await Promise.all(
      Array.from({ length: Math.ceil(ids.length / CHUNK) }, (_, i) => ids.slice(i * CHUNK, (i + 1) * CHUNK))
        .map((batch) =>
          fetch(`${SUPABASE_URL}/rest/v1/menu_photos?restaurant_id=in.(${batch.join(',')})&select=restaurant_id&limit=2000`, { headers })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
        )
    );
    for (const batch of photoBatches) {
      for (const p of batch as { restaurant_id: string }[]) restaurantsWithPhotos.add(p.restaurant_id);
    }

    // Transform + sort: photos-first, then by value_score
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
        placeAttributes: r.place_attributes || {},
        distance: Math.round(haversine(lat, lng, r.lat, r.lng)),
        freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
        _hasPhoto: restaurantsWithPhotos.has(r.id),
      }))
      .sort((a, b) => {
        // Primary sort: has photo (true first)
        if (a._hasPhoto !== b._hasPhoto) return a._hasPhoto ? -1 : 1;
        // Secondary sort: value score desc
        return (b.valueScore || 0) - (a.valueScore || 0);
      })
      .slice(0, 100)
      .map(({ _hasPhoto, ...r }) => r); // strip internal flag

    return NextResponse.json({ success: true, data: restaurants, count: restaurants.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
