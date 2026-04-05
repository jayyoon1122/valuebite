/**
 * Data Bootstrapping Service
 * Seeds restaurant data from Google Places API + Yelp for initial launch
 */

import { slugify } from '@valuebite/utils';

interface GooglePlaceResult {
  place_id: string;
  name: string;
  geometry: { location: { lat: number; lng: number } };
  formatted_address: string;
  price_level?: number; // 0-4
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  opening_hours?: { open_now: boolean };
  photos?: Array<{ photo_reference: string }>;
}

interface GooglePlaceDetail {
  place_id: string;
  name: string;
  formatted_phone_number?: string;
  website?: string;
  reviews?: Array<{
    text: string;
    rating: number;
    time: number;
    language: string;
  }>;
  opening_hours?: {
    weekday_text: string[];
    periods: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
  };
}

interface BootstrappedRestaurant {
  name: Record<string, string>;
  lat: number;
  lng: number;
  address: Record<string, string>;
  phone?: string;
  website?: string;
  cuisineType: string[];
  avgMealPrice?: number;
  priceCurrency: string;
  operatingHours?: Record<string, { open: string; close: string }>;
  source: 'google_places' | 'yelp';
  externalIds: Record<string, string>;
  totalReviews: number;
  valueScore?: number;
}

// Map Google price_level to estimated prices per country
const PRICE_ESTIMATES: Record<string, Record<number, number>> = {
  JP: { 0: 400, 1: 700, 2: 1200, 3: 2500, 4: 5000 },
  US: { 0: 5, 1: 10, 2: 20, 3: 40, 4: 80 },
  GB: { 0: 4, 1: 8, 2: 16, 3: 30, 4: 60 },
  DE: { 0: 4, 1: 8, 2: 16, 3: 30, 4: 60 },
  KR: { 0: 3000, 1: 6000, 2: 12000, 3: 25000, 4: 50000 },
};

const CURRENCY_MAP: Record<string, string> = {
  JP: 'JPY', US: 'USD', GB: 'GBP', DE: 'EUR', KR: 'KRW', FR: 'EUR',
};

// Map Google types to cuisine categories
function mapGoogleTypesToCuisine(types: string[]): string[] {
  const mapping: Record<string, string> = {
    restaurant: 'restaurant',
    meal_delivery: 'delivery',
    meal_takeaway: 'takeaway',
    bakery: 'bakery',
    cafe: 'cafe',
    bar: 'bar',
  };

  return types
    .filter((t) => mapping[t])
    .map((t) => mapping[t]);
}

// Parse Google opening hours to our format
function parseGoogleHours(
  periods?: GooglePlaceDetail['opening_hours'],
): Record<string, { open: string; close: string }> | undefined {
  if (!periods?.periods) return undefined;

  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const result: Record<string, { open: string; close: string }> = {};

  for (const period of periods.periods) {
    const dayName = dayNames[period.open.day];
    const openTime = period.open.time.replace(/(\d{2})(\d{2})/, '$1:$2');
    const closeTime = period.close
      ? period.close.time.replace(/(\d{2})(\d{2})/, '$1:$2')
      : '23:59';
    result[dayName] = { open: openTime, close: closeTime };
  }

  return result;
}

/**
 * Fetch budget restaurants from Google Places API for a city
 */
export async function fetchGooglePlaces(
  lat: number,
  lng: number,
  radiusMeters: number,
  apiKey: string,
  countryCode: string,
): Promise<BootstrappedRestaurant[]> {
  const results: BootstrappedRestaurant[] = [];

  // Search for restaurants with price_level 0-2 (cheap to moderate)
  for (const priceLevel of [0, 1, 2]) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=restaurant&maxprice=${priceLevel}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) continue;

    const data = await response.json();
    const places: GooglePlaceResult[] = data.results || [];

    for (const place of places) {
      // Get detailed info
      let detail: GooglePlaceDetail | null = null;
      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,reviews,opening_hours&key=${apiKey}`;
        const detailRes = await fetch(detailUrl);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          detail = detailData.result;
        }
      } catch {
        // Continue without details
      }

      const priceEstimates = PRICE_ESTIMATES[countryCode] || PRICE_ESTIMATES.US;
      const estimatedPrice = priceEstimates[place.price_level ?? 1];

      results.push({
        name: { original: place.name, en: place.name },
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        address: { original: place.formatted_address, en: place.formatted_address },
        phone: detail?.formatted_phone_number,
        website: detail?.website,
        cuisineType: mapGoogleTypesToCuisine(place.types),
        avgMealPrice: estimatedPrice,
        priceCurrency: CURRENCY_MAP[countryCode] || 'USD',
        operatingHours: detail?.opening_hours ? parseGoogleHours(detail.opening_hours) : undefined,
        source: 'google_places',
        externalIds: { google_place_id: place.place_id },
        totalReviews: place.user_ratings_total || 0,
        valueScore: place.rating ? Math.min(5, place.rating * 0.9) : undefined,
      });
    }

    // Respect rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  return results;
}

/**
 * Full city bootstrap pipeline
 */
export async function bootstrapCity(
  cityName: string,
  lat: number,
  lng: number,
  countryCode: string,
  googleApiKey: string,
  db: any,
): Promise<{ imported: number; skipped: number; errors: number }> {
  console.log(`Bootstrapping ${cityName}...`);

  const stats = { imported: 0, skipped: 0, errors: 0 };

  try {
    const restaurants = await fetchGooglePlaces(
      lat, lng, 5000, // 5km radius
      googleApiKey,
      countryCode,
    );

    console.log(`Found ${restaurants.length} restaurants from Google Places`);

    for (const r of restaurants) {
      try {
        // Check for duplicates by external ID
        const existing = await db.query.restaurants.findFirst({
          where: (t: any, { eq }: any) =>
            eq(t.externalIds, JSON.stringify(r.externalIds)),
        });

        if (existing) {
          stats.skipped++;
          continue;
        }

        const slug = slugify(r.name.en || r.name.original) + '-' + Date.now().toString(36);

        // Import restaurant
        const { restaurants: restaurantsTable } = await import('@valuebite/db');
        await db.insert(restaurantsTable).values({
          name: r.name,
          slug,
          lat: r.lat,
          lng: r.lng,
          address: r.address,
          phone: r.phone,
          website: r.website,
          cuisineType: r.cuisineType,
          avgMealPrice: r.avgMealPrice ? String(r.avgMealPrice) : null,
          priceCurrency: r.priceCurrency,
          operatingHours: r.operatingHours,
          source: r.source,
          externalIds: r.externalIds,
          totalReviews: r.totalReviews,
          valueScore: r.valueScore ? String(r.valueScore) : null,
          isActive: true,
        });

        stats.imported++;
      } catch (err) {
        stats.errors++;
        console.error(`Error importing ${r.name.original}:`, err);
      }
    }
  } catch (err) {
    console.error(`Bootstrap error for ${cityName}:`, err);
  }

  console.log(`Bootstrap complete for ${cityName}: ${JSON.stringify(stats)}`);
  return stats;
}
