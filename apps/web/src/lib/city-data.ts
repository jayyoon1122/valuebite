/**
 * City data router — returns restaurants, reviews, Google reviews, and summaries for any city
 */

import type { RestaurantListItem } from '@valuebite/types';
import { SEED_RESTAURANTS, SEED_REVIEWS, SEED_AI_SUMMARIES } from './seed-data';

// Cached data
let cachedCityData: Record<string, RestaurantListItem[]> = {};
let cachedCityReviews: any[] = [];
let cachedCitySummaries: Record<string, any> = {};
let cachedGoogleReviews: Record<string, any> = {};
let cityDataLoaded = false;

function ensureCityData() {
  if (cityDataLoaded) return;
  try {
    const cityMod = require('./seed-cities');
    if (cityMod.CITY_RESTAURANTS) cachedCityData = cityMod.CITY_RESTAURANTS;
  } catch {}
  try {
    const reviewMod = require('./seed-city-reviews');
    if (reviewMod.CITY_REVIEWS) cachedCityReviews = reviewMod.CITY_REVIEWS;
    if (reviewMod.CITY_AI_SUMMARIES) cachedCitySummaries = reviewMod.CITY_AI_SUMMARIES;
  } catch {}
  try {
    const googleMod = require('./seed-google-reviews');
    if (googleMod.GOOGLE_REVIEWS) cachedGoogleReviews = googleMod.GOOGLE_REVIEWS;
  } catch {}
  cityDataLoaded = true;
}

export function getRestaurantsForCity(cityId: string): RestaurantListItem[] {
  if (cityId === 'tokyo') return SEED_RESTAURANTS;
  ensureCityData();
  return cachedCityData[cityId] || [];
}

export function getRestaurantById(id: string): RestaurantListItem | undefined {
  const tokyo = SEED_RESTAURANTS.find((r) => r.id === id);
  if (tokyo) return tokyo;
  ensureCityData();
  for (const restaurants of Object.values(cachedCityData)) {
    const found = restaurants.find((r) => r.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getReviewsForRestaurant(restaurantId: string): any[] {
  const tokyoReviews = SEED_REVIEWS.filter((r) => r.restaurantId === restaurantId);
  if (tokyoReviews.length > 0) return tokyoReviews;
  ensureCityData();
  return cachedCityReviews.filter((r: any) => r.restaurantId === restaurantId);
}

export function getAISummaryForRestaurant(restaurantId: string): any | null {
  if (SEED_AI_SUMMARIES[restaurantId]) return SEED_AI_SUMMARIES[restaurantId];
  ensureCityData();
  return cachedCitySummaries[restaurantId] || null;
}

/**
 * Get Google reviews for a restaurant (primary review source)
 */
export function getGoogleReviewsForRestaurant(restaurantId: string): {
  totalReviews: number;
  avgRating: number;
  reviews: Array<{ author: string; rating: number; text: string; timeAgo: string }>;
} | null {
  ensureCityData();
  return cachedGoogleReviews[restaurantId] || null;
}
