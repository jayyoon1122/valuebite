/**
 * Affiliate link generators for delivery service partnerships.
 *
 * Tier 3 monetization: when users click "Order Online", we earn a
 * commission (~5-10%) on the order. UX impact: zero (users would
 * search for delivery anyway, this just gives them a 1-tap path).
 *
 * Setup per platform (Jay applies after launch + traffic):
 *   - DoorDash Affiliate: https://www.doordash.com/affiliates
 *   - Uber Eats Affiliate: https://merchants.ubereats.com/us/en/grow-your-business/influencer-program/
 *   - Grubhub Affiliate: https://impact.com (via Grubhub program)
 *   - Wolt Affiliate (EU/Asia): https://wolt.com/partner-program
 *
 * Set affiliate IDs in Vercel env:
 *   AFFILIATE_DOORDASH_ID, AFFILIATE_UBEREATS_ID, etc.
 */

export interface DeliveryLink {
  service: 'doordash' | 'ubereats' | 'grubhub' | 'wolt' | 'demaecan' | 'foodpanda';
  label: string;
  url: string;
  available: boolean;  // false if no link could be generated for this country
  logo?: string;
}

const AFFILIATE_PARAMS: Record<string, string> = {
  doordash: process.env.NEXT_PUBLIC_AFFILIATE_DOORDASH_ID || '',
  ubereats: process.env.NEXT_PUBLIC_AFFILIATE_UBEREATS_ID || '',
  grubhub: process.env.NEXT_PUBLIC_AFFILIATE_GRUBHUB_ID || '',
};

/**
 * Generate delivery service links for a restaurant based on location.
 * Returns the platforms available in that country with affiliate codes attached.
 */
export function getDeliveryLinks(restaurant: {
  name: { en?: string; original?: string };
  lat: number;
  lng: number;
  countryCode?: string;
}): DeliveryLink[] {
  const name = restaurant.name?.en || restaurant.name?.original || '';
  const query = encodeURIComponent(name);
  const country = (restaurant.countryCode || guessCountry(restaurant.lat, restaurant.lng)).toUpperCase();
  const links: DeliveryLink[] = [];

  // US, Canada, Australia, NZ → DoorDash
  if (['US', 'CA', 'AU', 'NZ'].includes(country)) {
    const aff = AFFILIATE_PARAMS.doordash;
    links.push({
      service: 'doordash',
      label: 'DoorDash',
      url: `https://www.doordash.com/search/store/${query}/${aff ? `?aff=${aff}` : ''}`,
      available: true,
    });
  }

  // Most countries → Uber Eats
  if (['US', 'CA', 'AU', 'GB', 'JP', 'TW', 'HK', 'SG', 'IN', 'MX', 'FR', 'DE', 'ES', 'NL', 'PL'].includes(country)) {
    const aff = AFFILIATE_PARAMS.ubereats;
    links.push({
      service: 'ubereats',
      label: 'Uber Eats',
      url: `https://www.ubereats.com/search?q=${query}${aff ? `&utm_source=${aff}` : ''}`,
      available: true,
    });
  }

  // US → Grubhub
  if (country === 'US') {
    const aff = AFFILIATE_PARAMS.grubhub;
    links.push({
      service: 'grubhub',
      label: 'Grubhub',
      url: `https://www.grubhub.com/search?searchTerm=${query}${aff ? `&affId=${aff}` : ''}`,
      available: true,
    });
  }

  // Japan → 出前館 (Demaecan)
  if (country === 'JP') {
    links.push({
      service: 'demaecan',
      label: 'Demaecan (出前館)',
      url: `https://demae-can.com/shop/search?keyword=${query}`,
      available: true,
    });
  }

  // EU + Asia (HK, SG, TW, JP partial) → Foodpanda / Wolt
  if (['HK', 'SG', 'TW', 'TH', 'PH', 'MY', 'PK', 'BG'].includes(country)) {
    links.push({
      service: 'foodpanda',
      label: 'Foodpanda',
      url: `https://www.foodpanda.com/?keyword=${query}`,
      available: true,
    });
  }
  if (['DE', 'FI', 'SE', 'DK', 'NO', 'CZ', 'PL', 'GR', 'EE', 'LT', 'LV', 'IL', 'JP'].includes(country)) {
    links.push({
      service: 'wolt',
      label: 'Wolt',
      url: `https://wolt.com/discovery/search?q=${query}`,
      available: true,
    });
  }

  return links;
}

/**
 * Rough country guess from lat/lng (used when countryCode isn't passed).
 * Just enough to route to the right delivery platforms.
 */
function guessCountry(lat: number, lng: number): string {
  // Japan
  if (lat >= 30 && lat <= 46 && lng >= 128 && lng <= 146) return 'JP';
  // Korea
  if (lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132) return 'KR';
  // Singapore
  if (lat >= 1 && lat <= 1.5 && lng >= 103 && lng <= 104.2) return 'SG';
  // Hong Kong
  if (lat >= 22 && lat <= 22.6 && lng >= 113.8 && lng <= 114.5) return 'HK';
  // Taiwan
  if (lat >= 21 && lat <= 26 && lng >= 119 && lng <= 122.5) return 'TW';
  // Mainland US (rough)
  if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) return 'US';
  // UK
  if (lat >= 49 && lat <= 61 && lng >= -10 && lng <= 2) return 'GB';
  // Germany
  if (lat >= 47 && lat <= 55 && lng >= 5 && lng <= 16) return 'DE';
  return 'US'; // safe default
}
