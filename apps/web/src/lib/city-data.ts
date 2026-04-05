/**
 * City data router — hybrid: seed data + Supabase real data
 */

import type { RestaurantListItem } from '@valuebite/types';
import { SEED_RESTAURANTS, SEED_REVIEWS, SEED_AI_SUMMARIES } from './seed-data';

let cachedCityData: Record<string, RestaurantListItem[]> = {};
let cachedCityReviews: any[] = [];
let cachedCitySummaries: Record<string, any> = {};
let cachedGoogleReviews: Record<string, any> = {};
let cityDataLoaded = false;

function ensureCityData() {
  if (cityDataLoaded) return;
  try { const m = require('./seed-cities'); if (m.CITY_RESTAURANTS) cachedCityData = m.CITY_RESTAURANTS; } catch {}
  try { const m = require('./seed-city-reviews'); if (m.CITY_REVIEWS) cachedCityReviews = m.CITY_REVIEWS; if (m.CITY_AI_SUMMARIES) cachedCitySummaries = m.CITY_AI_SUMMARIES; } catch {}
  try { const m = require('./seed-google-reviews'); if (m.GOOGLE_REVIEWS) cachedGoogleReviews = m.GOOGLE_REVIEWS; } catch {}
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

export function getGoogleReviewsForRestaurant(restaurantId: string): any | null {
  ensureCityData();
  return cachedGoogleReviews[restaurantId] || null;
}

// ===== Async: fetch real data from Supabase =====

export async function fetchRealRestaurants(lat: number, lng: number): Promise<any[]> {
  try {
    const res = await fetch(`/api/restaurants/nearby?lat=${lat}&lng=${lng}&radius=10`);
    const data = await res.json();
    if (data.success) return data.data;
  } catch {}
  return [];
}

export async function fetchRealRestaurantDetail(id: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/restaurants/${id}`);
    const data = await res.json();
    if (data.success) return data.data;
  } catch {}
  return null;
}
