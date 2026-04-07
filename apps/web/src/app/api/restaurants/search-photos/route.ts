import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

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
    let query = `restaurants?name->>en=ilike.*${encodeURIComponent(name.split(' ')[0])}*&select=id,name,total_reviews&limit=5`;

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

    const bestMatch = restaurants[0];

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

    function resolvePhotoUrl(url: string): string {
      if (url?.startsWith('gphoto:') && GOOGLE_API_KEY) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${url.slice(7)}&key=${GOOGLE_API_KEY}`;
      }
      return url;
    }

    return NextResponse.json({
      success: true,
      matchedId: bestMatch.id,
      matchedName: bestMatch.name?.en,
      photos: (photos || []).map((p: any) => ({
        url: resolvePhotoUrl(p.photo_url),
        label: { exterior: 'Exterior', interior: 'Interior', menu: 'Menu', dish: 'Dish' }[p.ai_language_detected as string] || 'Photo',
        color: { exterior: 'bg-blue-500', interior: 'bg-purple-500', menu: 'bg-orange-500', dish: 'bg-green-500' }[p.ai_language_detected as string] || 'bg-gray-500',
      })),
      googleReviews: {
        totalReviews: bestMatch.total_reviews || reviews.length,
        avgRating: 4.2,
        reviews: (reviews || []).map((rev: any) => ({
          author: rev.author_name || 'Google User',
          rating: rev.taste_rating || rev.value_rating || 4,
          text: rev.content || '',
          timeAgo: '',
        })),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
