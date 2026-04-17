// Region/city configuration for the selector
export interface CityConfig {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  cities: CityConfig[];
}

// Active cities (data verified) — other cities coming soon
export const REGIONS: CountryConfig[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', cities: [
    { id: 'nyc', name: 'New York City', lat: 40.7128, lng: -74.0060 },
    { id: 'la', name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  ]},
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', cities: [
    { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  ]},
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', cities: [
    { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278 },
  ]},
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', cities: [
    { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ]},
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', cities: [
    { id: 'hongkong', name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  ]},
];

/**
 * Find the nearest supported city based on coordinates
 */
export function findNearestCity(lat: number, lng: number): { city: CityConfig; country: CountryConfig } | null {
  let best: { city: CityConfig; country: CountryConfig; dist: number } | null = null;
  for (const country of REGIONS) {
    for (const city of country.cities) {
      const dist = Math.sqrt((lat - city.lat) ** 2 + (lng - city.lng) ** 2);
      if (!best || dist < best.dist) {
        best = { city, country, dist };
      }
    }
  }
  return best ? { city: best.city, country: best.country } : null;
}

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar' },
  { code: 'cs', name: 'Czech', native: 'Čeština' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
];
