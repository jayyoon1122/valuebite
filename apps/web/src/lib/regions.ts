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

export const REGIONS: CountryConfig[] = [
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', cities: [
    { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { id: 'osaka', name: 'Osaka', lat: 34.6937, lng: 135.5023 },
    { id: 'kyoto', name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
  ]},
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', cities: [
    { id: 'nyc', name: 'New York City', lat: 40.7128, lng: -74.0060 },
    { id: 'la', name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { id: 'chicago', name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { id: 'sf', name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { id: 'miami', name: 'Miami', lat: 25.7617, lng: -80.1918 },
    { id: 'austin', name: 'Austin', lat: 30.2672, lng: -97.7431 },
    { id: 'boston', name: 'Boston', lat: 42.3601, lng: -71.0589 },
    { id: 'houston', name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { id: 'seattle', name: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { id: 'dc', name: 'Washington DC', lat: 38.9072, lng: -77.0369 },
    { id: 'denver', name: 'Denver', lat: 39.7392, lng: -104.9903 },
    { id: 'nashville', name: 'Nashville', lat: 36.1627, lng: -86.7816 },
    { id: 'atlanta', name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
    { id: 'dallas', name: 'Dallas', lat: 32.7767, lng: -96.7970 },
    { id: 'phoenix', name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    { id: 'sandiego', name: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { id: 'philly', name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { id: 'charlotte', name: 'Charlotte', lat: 35.2271, lng: -80.8431 },
    { id: 'raleigh', name: 'Raleigh', lat: 35.7796, lng: -78.6382 },
    { id: 'slc', name: 'Salt Lake City', lat: 40.7608, lng: -111.8910 },
  ]},
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', cities: [
    { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278 },
    { id: 'manchester', name: 'Manchester', lat: 53.4808, lng: -2.2426 },
  ]},
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', cities: [
    { id: 'berlin', name: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { id: 'munich', name: 'Munich', lat: 48.1351, lng: 11.5820 },
    { id: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
  ]},
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', cities: [
    { id: 'paris', name: 'Paris', lat: 48.8566, lng: 2.3522 },
  ]},
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', cities: [
    { id: 'sydney', name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { id: 'melbourne', name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
  ]},
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', cities: [
    { id: 'toronto', name: 'Toronto', lat: 43.6532, lng: -79.3832 },
    { id: 'vancouver', name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
  ]},
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', cities: [
    { id: 'dubai', name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { id: 'abudhabi', name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
  ]},
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', cities: [
    { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ]},
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', currency: 'HKD', cities: [
    { id: 'hongkong', name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  ]},
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', currency: 'TWD', cities: [
    { id: 'taipei', name: 'Taipei', lat: 25.0330, lng: 121.5654 },
  ]},
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', cities: [
    { id: 'amsterdam', name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  ]},
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', cities: [
    { id: 'madrid', name: 'Madrid', lat: 40.4168, lng: -3.7038 },
    { id: 'barcelona', name: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  ]},
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', cities: [
    { id: 'lisbon', name: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  ]},
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', cities: [
    { id: 'rome', name: 'Rome', lat: 41.9028, lng: 12.4964 },
    { id: 'milan', name: 'Milan', lat: 45.4642, lng: 9.1900 },
  ]},
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', cities: [
    { id: 'zurich', name: 'Zurich', lat: 47.3769, lng: 8.5417 },
    { id: 'geneva', name: 'Geneva', lat: 46.2044, lng: 6.1432 },
  ]},
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', currency: 'EUR', cities: [
    { id: 'luxembourg', name: 'Luxembourg City', lat: 49.6116, lng: 6.1319 },
  ]},
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK', cities: [
    { id: 'prague', name: 'Prague', lat: 50.0755, lng: 14.4378 },
  ]},
  { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: 'EUR', cities: [
    { id: 'vienna', name: 'Vienna', lat: 48.2082, lng: 16.3738 },
  ]},
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: 'HUF', cities: [
    { id: 'budapest', name: 'Budapest', lat: 47.4979, lng: 19.0402 },
  ]},
  { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: 'PLN', cities: [
    { id: 'warsaw', name: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  ]},
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', cities: [
    { id: 'istanbul', name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  ]},
  { code: 'GR', name: 'Greece', flag: '🇬🇷', currency: 'EUR', cities: [
    { id: 'athens', name: 'Athens', lat: 37.9838, lng: 23.7275 },
  ]},
  { code: 'IL', name: 'Israel', flag: '🇮🇱', currency: 'ILS', cities: [
    { id: 'telaviv', name: 'Tel Aviv', lat: 32.0853, lng: 34.7818 },
  ]},
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', cities: [
    { id: 'doha', name: 'Doha', lat: 25.2854, lng: 51.5310 },
  ]},
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', cities: [
    { id: 'kuwait', name: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
  ]},
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', cities: [
    { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  ]},
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', cities: [
    { id: 'mexicocity', name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    { id: 'cancun', name: 'Cancun', lat: 21.1619, lng: -86.8515 },
  ]},
];

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
