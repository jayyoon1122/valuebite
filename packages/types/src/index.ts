// ==================
// COUNTRY & LOCALIZATION
// ==================

export interface Country {
  id: number;
  code: string;
  name: Record<string, string>;
  currencyCode: string;
  currencySymbol: string;
  defaultLocale: string;
  timezone: string;
  isActive: boolean;
}

export interface PriceBracket {
  id: number;
  countryId: number;
  cityId?: number;
  cityName?: string;
  purposeKey: PurposeKey;
  purposeLabel: Record<string, string>;
  maxPrice: number;
  icon?: string;
  description?: Record<string, string>;
  sortOrder: number;
}

export interface RestaurantListItemWithChain extends RestaurantListItem {
  isChain?: boolean;
}

export type PurposeKey =
  | 'daily_eats'
  | 'good_value'
  | 'date_night'
  | 'family_dinner'
  | 'late_night'
  | 'healthy_budget'
  | 'group_party'
  | 'solo_dining'
  | 'special_occasion';

export const PURPOSE_KEYS: PurposeKey[] = [
  'daily_eats',
  'good_value',
  'date_night',
  'family_dinner',
  'late_night',
  'healthy_budget',
  'group_party',
  'solo_dining',
  'special_occasion',
];

// ==================
// CITY & NEIGHBORHOOD
// ==================

export interface City {
  id: number;
  countryId: number;
  name: Record<string, string>;
  lat: number;
  lng: number;
  isActive: boolean;
  restaurantCount: number;
}

export interface Neighborhood {
  id: number;
  cityId: number;
  name: Record<string, string>;
  lat: number;
  lng: number;
  avgMealPrice?: number;
}

// ==================
// RESTAURANT
// ==================

export interface Restaurant {
  id: string;
  countryId: number;
  cityId: number;
  neighborhoodId?: number;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string>;
  cuisineType: string[];
  lat: number;
  lng: number;
  address: Record<string, string>;
  phone?: string;
  website?: string;
  operatingHours?: Record<string, { open: string; close: string }>;
  is24h: boolean;
  acceptsCards?: boolean;
  acceptsMobilePay?: boolean;
  avgMealPrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  priceLastVerified?: string;
  priceCurrency?: string;
  valueScore?: number;
  tasteScore?: number;
  portionScore?: number;
  cleanlinessScore?: number;
  atmosphereScore?: number;
  nutritionScore?: number;
  fitDailyEats: number;
  fitDateNight: number;
  fitFamilyDinner: number;
  fitLateNight: number;
  fitHealthyBudget: number;
  fitGroupParty: number;
  fitSoloDining: number;
  fitSpecialOccasion: number;
  source: 'user' | 'google_places' | 'yelp' | 'ai_scraped';
  externalIds?: Record<string, string>;
  isVerified: boolean;
  isActive: boolean;
  totalReviews: number;
  totalVisits: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
  distance?: number; // computed field for nearby queries
}

export interface RestaurantListItem {
  id: string;
  name: Record<string, string>;
  slug: string;
  cuisineType: string[];
  lat: number;
  lng: number;
  avgMealPrice?: number;
  priceCurrency?: string;
  valueScore?: number;
  tasteScore?: number;
  portionScore?: number;
  totalReviews: number;
  photoUrl?: string;
  distance?: number;
  purposeFit?: number;
  freshnessIndicator: FreshnessIndicator;
}

export interface FreshnessIndicator {
  label: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
  icon: string;
  cta?: string;
}

// ==================
// MENU
// ==================

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  category?: string;
  price: number;
  currency: string;
  estimatedCalories?: number;
  hasProtein?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  allergens?: string[];
  isLunchSpecial: boolean;
  isSeasonal: boolean;
  lastVerified?: string;
  source: 'ai_photo_extract' | 'user_input' | 'website_scrape';
}

// ==================
// REVIEW
// ==================

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  wasWorthIt?: boolean;
  pricePaid?: number;
  currency?: string;
  tasteRating?: number;
  portionRating?: number;
  valueRating?: number;
  content?: string;
  language?: string;
  aiSentiment?: number;
  aiKeywords?: string[];
  aiSummary?: string;
  visitDate?: string;
  visitPurpose?: PurposeKey;
  photos?: string[];
  helpfulCount: number;
  createdAt: string;
  user?: {
    displayName: string;
    avatarUrl?: string;
    level: number;
  };
}

// ==================
// USER
// ==================

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  homeCountryId?: number;
  homeCityId?: number;
  preferredLocale?: string;
  preferredPurposes?: PurposeKey[];
  dietaryPrefs?: string[];
  monthlyBudget?: number;
  contributionPoints: number;
  level: number;
  badges?: string[];
  totalReviews: number;
  totalPhotos: number;
}

// ==================
// API RESPONSES
// ==================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  ads?: NativeAd[];
}

export interface NativeAd {
  type: 'native_sponsored' | 'promoted_listing';
  position: number;
  content: {
    id: string;
    headline: string;
    body: string;
    imageUrl: string;
    callToAction: string;
    targetUrl: string;
    sponsoredLabel: string;
  };
}

// ==================
// QUERY PARAMS
// ==================

export interface NearbyQuery {
  lat: number;
  lng: number;
  radiusKm?: number;
  purpose?: PurposeKey;
  priceMax?: number;
  cuisine?: string;
  sortBy?: 'value_score' | 'distance' | 'price';
  page?: number;
  limit?: number;
}

export interface SearchQuery {
  q: string;
  cityId?: number;
  purpose?: PurposeKey;
  priceMax?: number;
  cuisine?: string;
  sortBy?: 'relevance' | 'value_score' | 'price';
  page?: number;
  limit?: number;
}
