/**
 * Supabase client for fetching real restaurant data
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffnxyafohnxgfxsklbaq.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

interface SupabaseRestaurant {
  id: string;
  name: Record<string, string>;
  slug: string;
  lat: number;
  lng: number;
  address: Record<string, string>;
  cuisine_type: string[];
  avg_meal_price: number;
  price_currency: string;
  value_score: number;
  taste_score: number;
  portion_score: number;
  total_reviews: number;
  phone: string;
  website: string;
  operating_hours: any;
  is_24h: boolean;
  is_chain: boolean;
  is_active: boolean;
  source: string;
  external_ids: Record<string, string>;
}

interface SupabaseReview {
  id: string;
  restaurant_id: string;
  content: string;
  taste_rating: number;
  value_rating: number;
  was_worth_it: boolean;
  language: string;
  ai_summary: string;
  helpful_count: number;
  created_at: string;
}

interface SupabasePhoto {
  id: string;
  restaurant_id: string;
  photo_url: string;
  ai_language_detected: string; // Used as photo category
}

async function supabaseFetch(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  if (!res.ok) return [];
  return res.json();
}

// Cache for client-side use
let restaurantCache: Record<string, any[]> = {};
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Fetch restaurants from Supabase for a given city area
 */
export async function fetchRestaurantsFromDB(lat: number, lng: number, radiusKm: number = 10): Promise<any[]> {
  const cacheKey = `${Math.round(lat*10)}_${Math.round(lng*10)}`;

  if (restaurantCache[cacheKey] && Date.now() - lastFetchTime < CACHE_TTL) {
    return restaurantCache[cacheKey];
  }

  try {
    // Bounding box query (approximate)
    const latRange = radiusKm / 111;
    const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    const data: SupabaseRestaurant[] = await supabaseFetch(
      `restaurants?is_active=eq.true&lat=gte.${lat - latRange}&lat=lte.${lat + latRange}&lng=gte.${lng - lngRange}&lng=lte.${lng + lngRange}&select=id,name,slug,lat,lng,cuisine_type,avg_meal_price,price_currency,value_score,taste_score,portion_score,total_reviews,is_chain,external_ids&order=value_score.desc.nullslast&limit=100`
    );

    const restaurants = data.map(r => ({
      id: r.id,
      name: r.name || { en: 'Unknown', original: 'Unknown' },
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
      photoUrl: '', // Will be populated from photos table
      distance: Math.round(haversine(lat, lng, r.lat, r.lng)),
      purposeFit: 0.8, // Default
      freshnessIndicator: { label: 'Recently Verified', color: 'green' as const, icon: 'check' },
    }));

    restaurantCache[cacheKey] = restaurants;
    lastFetchTime = Date.now();
    return restaurants;
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return [];
  }
}

/**
 * Fetch a single restaurant by ID
 */
export async function fetchRestaurantByIdFromDB(id: string): Promise<any | null> {
  try {
    const data: SupabaseRestaurant[] = await supabaseFetch(
      `restaurants?id=eq.${id}&select=*&limit=1`
    );
    if (!data || data.length === 0) return null;

    const r = data[0];
    return {
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
      phone: r.phone,
      website: r.website,
      operatingHours: r.operating_hours,
      is24h: r.is_24h,
      isChain: r.is_chain || false,
      address: r.address,
      freshnessIndicator: { label: 'Recently Verified', color: 'green' as const, icon: 'check' },
    };
  } catch {
    return null;
  }
}

/**
 * Fetch reviews for a restaurant from DB
 */
export async function fetchReviewsFromDB(restaurantId: string): Promise<any[]> {
  try {
    const data: SupabaseReview[] = await supabaseFetch(
      `reviews?restaurant_id=eq.${restaurantId}&select=*&order=created_at.desc&limit=10`
    );
    return data.map(r => ({
      author: 'Google User',
      rating: r.taste_rating || 4,
      text: r.content || '',
      timeAgo: getTimeAgo(r.created_at),
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch photos for a restaurant from DB
 */
export async function fetchPhotosFromDB(restaurantId: string): Promise<any[]> {
  try {
    const data: SupabasePhoto[] = await supabaseFetch(
      `menu_photos?restaurant_id=eq.${restaurantId}&select=*&limit=5`
    );
    return data.map(p => ({
      url: p.photo_url,
      label: categoryLabel(p.ai_language_detected),
      color: categoryColor(p.ai_language_detected),
    }));
  } catch {
    return [];
  }
}

function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    exterior: 'Exterior', interior: 'Interior', menu: 'Menu', dish: 'Dish',
  };
  return labels[cat] || 'Photo';
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    exterior: 'bg-blue-500', interior: 'bg-purple-500', menu: 'bg-orange-500', dish: 'bg-green-500',
  };
  return colors[cat] || 'bg-gray-500';
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const mins = Math.floor((now - d) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days/30)}mo ago`;
}
