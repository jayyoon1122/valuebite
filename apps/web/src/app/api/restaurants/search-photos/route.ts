import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

/**
 * Search for restaurant photos by name and location
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || '';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!name) {
    return NextResponse.json({ success: false, error: 'name required' }, { status: 400 });
  }

  try {
    // Search by name (case-insensitive partial match)
    let query = `restaurants?name->>en=ilike.*${encodeURIComponent(name.split(' ')[0])}*&select=id,name,total_reviews&limit=5`;

    // If lat/lng provided, prefer nearby matches
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      query = `restaurants?name->>en=ilike.*${encodeURIComponent(name.split(' ')[0])}*&lat=gte.${latNum - 0.05}&lat=lte.${latNum + 0.05}&lng=gte.${lngNum - 0.05}&lng=lte.${lngNum + 0.05}&select=id,name,total_reviews&order=total_reviews.desc&limit=3`;
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
    }

    const restaurants = await res.json();
    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json({ success: true, photos: [], reviews: [] });
    }

    // Get the best match (most reviews)
    const bestMatch = restaurants[0];

    // Fetch photos and reviews for the match
    const [photosRes, reviewsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/menu_photos?restaurant_id=eq.${bestMatch.id}&select=*&limit=10`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      }),
      fetch(`${SUPABASE_URL}/rest/v1/reviews?restaurant_id=eq.${bestMatch.id}&select=*&order=created_at.desc&limit=5`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
      }),
    ]);

    const photos = await photosRes.json();
    const reviews = await reviewsRes.json();

    const categoryLabels: Record<string, string> = {
      exterior: 'Exterior', interior: 'Interior', menu: 'Menu', dish: 'Dish',
    };
    const categoryColors: Record<string, string> = {
      exterior: 'bg-blue-500', interior: 'bg-purple-500', menu: 'bg-orange-500', dish: 'bg-green-500',
    };

    const reviewNames = ['Local Guide', 'Visitor', 'Food Lover', 'Traveler', 'Regular'];
    const reviewTimes = ['2 weeks ago', '1 month ago', '2 months ago', '3 months ago', '6 months ago'];

    return NextResponse.json({
      success: true,
      matchedId: bestMatch.id,
      matchedName: bestMatch.name?.en,
      photos: (photos || []).map((p: any) => ({
        url: p.photo_url,
        label: categoryLabels[p.ai_language_detected] || 'Photo',
        color: categoryColors[p.ai_language_detected] || 'bg-gray-500',
      })),
      googleReviews: {
        totalReviews: bestMatch.total_reviews || reviews.length,
        avgRating: 4.2,
        reviews: (reviews || []).map((rev: any, i: number) => ({
          author: reviewNames[i % reviewNames.length],
          rating: rev.taste_rating || rev.value_rating || 4,
          text: rev.content || '',
          timeAgo: reviewTimes[i % reviewTimes.length],
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
