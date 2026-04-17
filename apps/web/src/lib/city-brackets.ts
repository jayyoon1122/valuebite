/**
 * City-level price brackets
 * Each city has a cost-of-living multiplier applied to the country base price
 */

import type { PriceBracket } from '@valuebite/types';

// Country base prices (in local currency) — [min, max] per purpose
// min = 0 means "no floor" (includes cheapest options)
const COUNTRY_BASE: Record<string, Record<string, [number, number]>> = {
  JP: { daily_eats: [0, 800], good_value: [0, 1200], date_night: [1200, 3000], family_dinner: [600, 2000], late_night: [0, 1500], healthy_budget: [0, 1200], group_party: [800, 2500], solo_dining: [0, 1000], special_occasion: [2500, 10000] },
  US: { daily_eats: [0, 10], good_value: [0, 15], date_night: [15, 35], family_dinner: [8, 20], late_night: [0, 15], healthy_budget: [0, 14], group_party: [10, 25], solo_dining: [0, 12], special_occasion: [30, 80] },
  GB: { daily_eats: [0, 8], good_value: [0, 12], date_night: [12, 30], family_dinner: [6, 18], late_night: [0, 12], healthy_budget: [0, 11], group_party: [8, 20], solo_dining: [0, 10], special_occasion: [25, 60] },
  SG: { daily_eats: [0, 8], good_value: [0, 12], date_night: [12, 30], family_dinner: [6, 20], late_night: [0, 12], healthy_budget: [0, 11], group_party: [8, 20], solo_dining: [0, 10], special_occasion: [25, 60] },
  HK: { daily_eats: [0, 50], good_value: [0, 80], date_night: [80, 200], family_dinner: [40, 150], late_night: [0, 80], healthy_budget: [0, 70], group_party: [50, 150], solo_dining: [0, 60], special_occasion: [150, 500] },
};

// City cost-of-living multipliers (1.0 = country average)
const CITY_MULTIPLIERS: Record<string, number> = {
  tokyo: 1.0,
  nyc: 1.35, la: 1.15,
  london: 1.25,
  singapore: 1.0,
  hongkong: 1.0,
};

const PURPOSE_LABELS: Record<string, Record<string, string>> = {
  daily_eats: { en: 'Daily Eats', ja: '普段の食事', ko: '일상 식사', de: 'Alltag', fr: 'Repas du quotidien', es: 'Comida diaria' },
  good_value: { en: 'Good Value', ja: 'コスパ◎', ko: '가성비', de: 'Preis-Leistung', fr: 'Bon rapport qualité-prix', es: 'Buena relación calidad-precio' },
  date_night: { en: 'Date Night', ja: 'デートの夜', ko: '데이트', de: 'Date-Abend', fr: 'Dîner en amoureux', es: 'Cena romántica' },
  family_dinner: { en: 'Family Dinner', ja: '家族ディナー', ko: '가족 외식', de: 'Familienessen', fr: 'Repas en famille', es: 'Cena familiar' },
  late_night: { en: 'Late Night', ja: '夜食', ko: '야식', de: 'Spätabends', fr: 'Repas tardif', es: 'Noche' },
  healthy_budget: { en: 'Healthy & Budget', ja: 'ヘルシー&節約', ko: '건강 식단', de: 'Gesund & günstig', fr: 'Sain & économique', es: 'Sano y económico' },
  group_party: { en: 'Group & Party', ja: '宴会', ko: '단체/회식', de: 'Gruppe & Feier', fr: 'Groupe & fête', es: 'Grupo y fiesta' },
  solo_dining: { en: 'Solo Dining', ja: 'ひとり飯', ko: '혼밥', de: 'Alleine essen', fr: 'Manger seul', es: 'Comer solo' },
  special_occasion: { en: 'Special Occasion', ja: '特別な日', ko: '특별한 날', de: 'Besonderer Anlass', fr: 'Occasion spéciale', es: 'Ocasión especial' },
};

const PURPOSE_ICONS: Record<string, string> = {
  daily_eats: '🍛', good_value: '🍱', date_night: '🥂', family_dinner: '👨‍👩‍👧‍👦',
  late_night: '🌙', healthy_budget: '🥗', group_party: '🎉', solo_dining: '🧑‍💻', special_occasion: '🎂',
};

/**
 * Get price brackets for a specific city
 */
export function getCityBrackets(cityId: string, countryCode: string): PriceBracket[] {
  const base = COUNTRY_BASE[countryCode] || COUNTRY_BASE.US;
  const multiplier = CITY_MULTIPLIERS[cityId] || 1.0;

  return Object.entries(base).map(([purposeKey, [min, max]], i) => ({
    id: i + 1,
    countryId: 0,
    cityId: 0,
    purposeKey: purposeKey as any,
    purposeLabel: PURPOSE_LABELS[purposeKey] || { en: purposeKey },
    minPrice: Math.round(min * multiplier),
    maxPrice: Math.round(max * multiplier),
    icon: PURPOSE_ICONS[purposeKey],
    sortOrder: i,
  }));
}
