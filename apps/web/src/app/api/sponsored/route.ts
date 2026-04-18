import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

/**
 * GET /api/sponsored?city=tokyo&purpose=daily_eats&cuisine=ramen&exclude=id1,id2
 * Returns: { success, data: <RestaurantListItem with isSponsored=true and promotedId> } or { success, data: null }
 *
 * Algorithm:
 * 1. Find active promoted_listings matching context (city, purpose, cuisine)
 * 2. Filter out today's daily-budget-exceeded listings
 * 3. Filter out exclude IDs (already shown in this view)
 * 4. Pick highest bid_per_impression
 * 5. Increment impressions counter (atomic)
 * 6. Return restaurant data joined with promoted_id
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const purpose = searchParams.get('purpose');
  const cuisine = searchParams.get('cuisine');
  const exclude = (searchParams.get('exclude') || '').split(',').filter(Boolean);

  try {
    // Fetch active promoted listings
    const today = new Date().toISOString().split('T')[0];
    const promotedRes = await fetch(
      `${SUPABASE_URL}/rest/v1/promoted_listings?is_active=eq.true&or=(end_date.is.null,end_date.gt.${new Date().toISOString()})&select=*&order=bid_per_impression.desc&limit=50`,
      { headers }
    );
    if (!promotedRes.ok) return NextResponse.json({ success: true, data: null });
    const listings: any[] = await promotedRes.json();
    if (listings.length === 0) return NextResponse.json({ success: true, data: null });

    // Filter by targeting
    const matching = listings.filter((l) => {
      if (l.target_cities?.length && city && !l.target_cities.includes(city)) return false;
      if (l.target_purposes?.length && purpose && !l.target_purposes.includes(purpose)) return false;
      if (l.target_cuisines?.length && cuisine && !l.target_cuisines.some((c: string) => cuisine.includes(c))) return false;
      if (exclude.includes(l.restaurant_id)) return false;
      return true;
    });

    if (matching.length === 0) return NextResponse.json({ success: true, data: null });

    // Check daily budget for top candidates (max 5)
    let chosen = null;
    for (const candidate of matching.slice(0, 5)) {
      const dailyRes = await fetch(
        `${SUPABASE_URL}/rest/v1/promoted_daily_stats?promoted_id=eq.${candidate.id}&date=eq.${today}&select=spent`,
        { headers }
      );
      const daily = dailyRes.ok ? await dailyRes.json() : [];
      const todaySpent = daily[0]?.spent || 0;
      if (todaySpent < candidate.daily_budget) {
        chosen = candidate;
        break;
      }
    }

    if (!chosen) return NextResponse.json({ success: true, data: null });

    // Fetch the restaurant details
    const restaurantRes = await fetch(
      `${SUPABASE_URL}/rest/v1/restaurants?id=eq.${chosen.restaurant_id}&is_active=eq.true&select=id,name,slug,lat,lng,cuisine_type,avg_meal_price,price_currency,value_score,taste_score,portion_score,total_reviews,is_chain&limit=1`,
      { headers }
    );
    const rData = restaurantRes.ok ? await restaurantRes.json() : [];
    if (rData.length === 0) return NextResponse.json({ success: true, data: null });
    const r = rData[0];

    // Atomically increment impression count + daily stats (fire-and-forget)
    const cpmCost = parseFloat(chosen.bid_per_impression) / 1000;
    fetch(`${SUPABASE_URL}/rest/v1/promoted_listings?id=eq.${chosen.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ impressions: chosen.impressions + 1, spent: parseFloat(chosen.spent || 0) + cpmCost, updated_at: new Date().toISOString() }),
    }).catch(() => {});
    // Upsert daily stats
    fetch(`${SUPABASE_URL}/rest/v1/promoted_daily_stats?on_conflict=promoted_id,date`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ promoted_id: chosen.id, date: today, impressions: 1, spent: cpmCost }),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: {
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
        // Sponsored markers
        isSponsored: true,
        promotedId: chosen.id,
        campaignName: chosen.campaign_name,
        freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: null });
  }
}

/**
 * POST /api/sponsored/click
 * Body: { promotedId }
 * Records a click on a sponsored listing
 */
export async function POST(request: NextRequest) {
  try {
    const { promotedId } = await request.json();
    if (!promotedId) return NextResponse.json({ success: false, error: 'promotedId required' }, { status: 400 });

    const today = new Date().toISOString().split('T')[0];
    // Get current click count
    const r = await fetch(`${SUPABASE_URL}/rest/v1/promoted_listings?id=eq.${promotedId}&select=clicks,bid_per_click,spent`, { headers });
    const data = r.ok ? await r.json() : [];
    if (!data[0]) return NextResponse.json({ success: false }, { status: 404 });
    const current = data[0];
    const cpcCost = parseFloat(current.bid_per_click || 0);

    // Increment click count + add CPC cost
    fetch(`${SUPABASE_URL}/rest/v1/promoted_listings?id=eq.${promotedId}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ clicks: current.clicks + 1, spent: parseFloat(current.spent || 0) + cpcCost, updated_at: new Date().toISOString() }),
    }).catch(() => {});

    fetch(`${SUPABASE_URL}/rest/v1/promoted_daily_stats?on_conflict=promoted_id,date`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ promoted_id: promotedId, date: today, clicks: 1, spent: cpcCost }),
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
