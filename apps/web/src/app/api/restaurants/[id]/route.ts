import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

async function supaFetch(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Fetch restaurant, reviews, photos, and menu items in parallel
    const [restaurants, reviews, photos, menuItems] = await Promise.all([
      supaFetch(`restaurants?id=eq.${id}&select=*&limit=1`),
      supaFetch(`reviews?restaurant_id=eq.${id}&select=*&order=created_at.desc&limit=10`),
      supaFetch(`menu_photos?restaurant_id=eq.${id}&select=*&limit=15`),
      supaFetch(`menu_items?restaurant_id=eq.${id}&select=*&order=category,price`),
    ]);

    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const r = restaurants[0];

    // Format photos with categories — resolve gphoto: references to full URLs
    const formattedPhotos = (photos || []).map((p: any) => {
      let url = p.photo_url || '';
      if (url.startsWith('gphoto:') && GOOGLE_API_KEY) {
        const ref = url.slice(7);
        url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_API_KEY}`;
      }
      return {
        url,
        label: { exterior: 'Exterior', interior: 'Interior', menu: 'Menu', dish: 'Dish' }[p.ai_language_detected as string] || 'Photo',
        color: { exterior: 'bg-blue-500', interior: 'bg-purple-500', menu: 'bg-orange-500', dish: 'bg-green-500' }[p.ai_language_detected as string] || 'bg-gray-500',
      };
    });

    // Format reviews using real data from Supabase
    const formattedReviews = (reviews || []).map((rev: any) => ({
      author: rev.author_name || 'Google User',
      rating: rev.taste_rating || rev.value_rating || 4,
      text: rev.content || '',
      timeAgo: getTimeAgo(rev.created_at),
    }));

    function getTimeAgo(dateStr: string): string {
      if (!dateStr) return '';
      const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
      if (days < 1) return 'Today';
      if (days < 7) return `${days}d ago`;
      if (days < 30) return `${Math.floor(days / 7)}w ago`;
      if (days < 365) return `${Math.floor(days / 30)}mo ago`;
      return `${Math.floor(days / 365)}y ago`;
    }

    // Format menu items — pass full name object for frontend language handling
    const formattedMenuItems = (menuItems || []).map((item: any) => ({
      name: item.name || { en: 'Unknown' },
      price: parseFloat(String(item.price)),
      currency: item.currency || 'USD',
      category: item.category || 'main',
      source: item.source,
    }));

    // Compute "typical meal price" — median of real main dishes
    // Uses price-gap detection to filter out sides/toppings miscategorized as "main"
    function median(arr: number[]): number {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    function getMainPrices(items: any[]): number[] {
      const mealCats = items.filter((m: any) => ['main', 'set_meal', 'combo'].includes(m.category));
      let prices = (mealCats.length >= 1 ? mealCats : items)
        .map((m: any) => m.price).filter((p: number) => p > 0).sort((a: number, b: number) => a - b);
      // Price-gap detection: if a jump > 2.5x exists, items above are the real meals
      if (prices.length > 1) {
        for (let i = prices.length - 2; i >= 0; i--) {
          if (prices[i + 1] > prices[i] * 2.5) {
            prices = prices.slice(i + 1);
            break;
          }
        }
      }
      return prices;
    }
    const mainPrices = getMainPrices(formattedMenuItems);
    const typicalMealPrice = mainPrices.length > 0 ? median(mainPrices) : null;

    // Use real menu price if available, otherwise fall back to DB value
    const avgMealPrice = typicalMealPrice || (r.avg_meal_price ? parseFloat(String(r.avg_meal_price)) : undefined);

    return NextResponse.json({
      success: true,
      data: {
        id: r.id,
        name: r.name || { en: 'Unknown' },
        slug: r.slug,
        cuisineType: r.cuisine_type || [],
        lat: r.lat,
        lng: r.lng,
        avgMealPrice,
        priceCurrency: r.price_currency,
        valueScore: r.value_score ? parseFloat(String(r.value_score)) : undefined,
        tasteScore: r.taste_score ? parseFloat(String(r.taste_score)) : undefined,
        portionScore: r.portion_score ? parseFloat(String(r.portion_score)) : undefined,
        totalReviews: r.total_reviews || 0,
        phone: r.phone,
        website: r.website,
        operatingHours: r.operating_hours,
        is24h: r.is_24h,
        isChain: r.is_chain,
        address: r.address,
        menuItemCount: formattedMenuItems.length,
        menuItems: formattedMenuItems,
        freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
        photos: formattedPhotos,
        googleReviews: {
          totalReviews: r.total_reviews || 0,
          avgRating: r.value_score ? Math.min(parseFloat(String(r.value_score)), 5.0) : 4.0,
          reviews: formattedReviews,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

