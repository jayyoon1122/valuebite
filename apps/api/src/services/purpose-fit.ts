/**
 * Purpose Fit Scoring Engine
 * Calculates how well a restaurant fits each dining purpose
 * Range: 0.00 - 1.00
 */

interface RestaurantPurposeInput {
  avgMealPrice: number | null;
  cuisineType: string[];
  operatingHours: Record<string, { open: string; close: string }> | null;
  is24h: boolean;
  atmosphereScore: number | null;
  portionScore: number | null;
  nutritionScore: number | null;
  totalReviews: number;
  countryCode: string;
}

interface ReviewSignals {
  dailyEats: number;
  dateNight: number;
  familyDinner: number;
  lateNight: number;
  healthyBudget: number;
  soloDining: number;
  groupParty: number;
}

const BRACKETS: Record<string, Record<string, number>> = {
  JP: { daily_eats: 1000, good_value: 1500, date_night: 2500, family_dinner: 2000, late_night: 1200, healthy_budget: 1400, group_party: 1500, solo_dining: 1200, special_occasion: 5000 },
  US: { daily_eats: 10, good_value: 15, date_night: 25, family_dinner: 18, late_night: 12, healthy_budget: 14, group_party: 15, solo_dining: 12, special_occasion: 50 },
  GB: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  DE: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  KR: { daily_eats: 7000, good_value: 10000, date_night: 20000, family_dinner: 15000, late_night: 8000, healthy_budget: 9000, group_party: 12000, solo_dining: 8000, special_occasion: 40000 },
};

function priceInBracket(price: number | null, countryCode: string, purpose: string): number {
  if (!price) return 0.5;
  const brackets = BRACKETS[countryCode] || BRACKETS.US;
  const maxPrice = brackets[purpose] || brackets.daily_eats;
  if (price <= maxPrice * 0.5) return 1.0;
  if (price <= maxPrice) return 0.8 + 0.2 * (1 - price / maxPrice);
  if (price <= maxPrice * 1.5) return 0.3;
  return 0.1;
}

function hasLateHours(hours: Record<string, { open: string; close: string }> | null, is24h: boolean): number {
  if (is24h) return 1.0;
  if (!hours) return 0.3;
  let lateCount = 0;
  for (const day of Object.values(hours)) {
    const closeHour = parseInt(day.close.split(':')[0]);
    if (closeHour >= 22 || closeHour <= 4) lateCount++;
  }
  return lateCount / Math.max(1, Object.keys(hours).length);
}

function hasLunchHours(hours: Record<string, { open: string; close: string }> | null): number {
  if (!hours) return 0.5;
  const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];
  let lunchCount = 0;
  for (const day of weekdays) {
    const h = hours[day];
    if (h) {
      const openHour = parseInt(h.open.split(':')[0]);
      if (openHour <= 12) lunchCount++;
    }
  }
  return lunchCount / 5;
}

function cuisineUniquenesScore(cuisineType: string[]): number {
  const unique = ['french', 'italian', 'mediterranean', 'thai', 'indian', 'korean', 'mexican', 'vietnamese'];
  const common = ['fast_food', 'gyudon', 'ramen', 'udon', 'soba'];
  if (cuisineType.some((c) => unique.includes(c))) return 0.8;
  if (cuisineType.some((c) => common.includes(c))) return 0.3;
  return 0.5;
}

export function calculateAllPurposeFits(
  restaurant: RestaurantPurposeInput,
  reviewSignals?: ReviewSignals,
): Record<string, number> {
  const price = restaurant.avgMealPrice;
  const cc = restaurant.countryCode;
  const atmosphere = (restaurant.atmosphereScore ?? 3) / 5;
  const portion = (restaurant.portionScore ?? 3) / 5;
  const nutrition = (restaurant.nutritionScore ?? 3) / 5;
  const rs = reviewSignals || { dailyEats: 0.5, dateNight: 0.3, familyDinner: 0.3, lateNight: 0.3, healthyBudget: 0.3, soloDining: 0.5, groupParty: 0.3 };

  const clamp = (v: number) => Math.min(1.0, Math.max(0, Math.round(v * 100) / 100));

  return {
    fitDailyEats: clamp(
      priceInBracket(price, cc, 'daily_eats') * 0.30 +
      hasLunchHours(restaurant.operatingHours) * 0.15 +
      0.5 * 0.15 + // speed proxy
      rs.dailyEats * 0.25 +
      (restaurant.totalReviews > 10 ? 0.15 : 0.05),
    ),
    fitDateNight: clamp(
      priceInBracket(price, cc, 'date_night') * 0.20 +
      atmosphere * 0.25 +
      cuisineUniquenesScore(restaurant.cuisineType) * 0.15 +
      rs.dateNight * 0.30 +
      0.10,
    ),
    fitFamilyDinner: clamp(
      priceInBracket(price, cc, 'family_dinner') * 0.25 +
      portion * 0.15 +
      rs.familyDinner * 0.30 +
      0.5 * 0.15 + // menu variety proxy
      0.15,
    ),
    fitLateNight: clamp(
      priceInBracket(price, cc, 'late_night') * 0.25 +
      hasLateHours(restaurant.operatingHours, restaurant.is24h) * 0.35 +
      rs.lateNight * 0.25 +
      0.15,
    ),
    fitHealthyBudget: clamp(
      priceInBracket(price, cc, 'healthy_budget') * 0.25 +
      nutrition * 0.30 +
      rs.healthyBudget * 0.25 +
      0.20,
    ),
    fitSoloDining: clamp(
      priceInBracket(price, cc, 'solo_dining') * 0.25 +
      rs.soloDining * 0.35 +
      0.5 * 0.20 + // speed proxy
      0.20,
    ),
    fitGroupParty: clamp(
      priceInBracket(price, cc, 'group_party') * 0.25 +
      rs.groupParty * 0.30 +
      0.5 * 0.20 + // sharing proxy
      atmosphere * 0.25,
    ),
    fitSpecialOccasion: clamp(
      priceInBracket(price, cc, 'special_occasion') * 0.15 +
      atmosphere * 0.30 +
      cuisineUniquenesScore(restaurant.cuisineType) * 0.20 +
      rs.dateNight * 0.20 + // reuse date night signals
      0.15,
    ),
  };
}
