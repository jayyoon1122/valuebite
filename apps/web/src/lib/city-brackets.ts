/**
 * City-level price brackets
 * Each city has a cost-of-living multiplier applied to the country base price
 */

import type { PriceBracket } from '@valuebite/types';

// Country base prices (in local currency, for 'daily_eats' purpose)
const COUNTRY_BASE: Record<string, Record<string, number>> = {
  JP: { daily_eats: 1000, good_value: 1500, date_night: 2500, family_dinner: 2000, late_night: 1200, healthy_budget: 1400, group_party: 1500, solo_dining: 1200, special_occasion: 5000 },
  US: { daily_eats: 10, good_value: 15, date_night: 25, family_dinner: 18, late_night: 12, healthy_budget: 14, group_party: 15, solo_dining: 12, special_occasion: 50 },
  GB: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  DE: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  FR: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  AU: { daily_eats: 12, good_value: 18, date_night: 30, family_dinner: 22, late_night: 15, healthy_budget: 17, group_party: 18, solo_dining: 15, special_occasion: 60 },
  CA: { daily_eats: 12, good_value: 18, date_night: 30, family_dinner: 22, late_night: 15, healthy_budget: 17, group_party: 18, solo_dining: 15, special_occasion: 60 },
  AE: { daily_eats: 35, good_value: 55, date_night: 90, family_dinner: 70, late_night: 40, healthy_budget: 45, group_party: 60, solo_dining: 40, special_occasion: 180 },
  SG: { daily_eats: 8, good_value: 12, date_night: 25, family_dinner: 18, late_night: 10, healthy_budget: 11, group_party: 15, solo_dining: 10, special_occasion: 50 },
  HK: { daily_eats: 50, good_value: 80, date_night: 150, family_dinner: 120, late_night: 60, healthy_budget: 70, group_party: 100, solo_dining: 60, special_occasion: 300 },
  TW: { daily_eats: 120, good_value: 200, date_night: 400, family_dinner: 300, late_night: 150, healthy_budget: 180, group_party: 250, solo_dining: 150, special_occasion: 800 },
  ES: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  IT: { daily_eats: 8, good_value: 12, date_night: 20, family_dinner: 15, late_night: 10, healthy_budget: 11, group_party: 12, solo_dining: 10, special_occasion: 40 },
  PT: { daily_eats: 7, good_value: 10, date_night: 18, family_dinner: 13, late_night: 8, healthy_budget: 9, group_party: 10, solo_dining: 8, special_occasion: 35 },
  NL: { daily_eats: 9, good_value: 14, date_night: 22, family_dinner: 17, late_night: 11, healthy_budget: 13, group_party: 14, solo_dining: 11, special_occasion: 45 },
  CH: { daily_eats: 15, good_value: 22, date_night: 35, family_dinner: 28, late_night: 18, healthy_budget: 20, group_party: 22, solo_dining: 18, special_occasion: 70 },
  CZ: { daily_eats: 200, good_value: 300, date_night: 500, family_dinner: 400, late_night: 250, healthy_budget: 280, group_party: 300, solo_dining: 250, special_occasion: 1000 },
  HU: { daily_eats: 2500, good_value: 3500, date_night: 6000, family_dinner: 4500, late_night: 3000, healthy_budget: 3200, group_party: 3500, solo_dining: 3000, special_occasion: 12000 },
  PL: { daily_eats: 30, good_value: 45, date_night: 80, family_dinner: 60, late_night: 35, healthy_budget: 40, group_party: 45, solo_dining: 35, special_occasion: 150 },
  TR: { daily_eats: 200, good_value: 300, date_night: 500, family_dinner: 400, late_night: 250, healthy_budget: 280, group_party: 300, solo_dining: 250, special_occasion: 1000 },
  GR: { daily_eats: 7, good_value: 10, date_night: 18, family_dinner: 13, late_night: 8, healthy_budget: 9, group_party: 10, solo_dining: 8, special_occasion: 35 },
  IL: { daily_eats: 40, good_value: 60, date_night: 100, family_dinner: 80, late_night: 45, healthy_budget: 50, group_party: 60, solo_dining: 45, special_occasion: 200 },
  QA: { daily_eats: 25, good_value: 40, date_night: 70, family_dinner: 55, late_night: 30, healthy_budget: 35, group_party: 40, solo_dining: 30, special_occasion: 140 },
  KW: { daily_eats: 2, good_value: 3, date_night: 5, family_dinner: 4, late_night: 2, healthy_budget: 3, group_party: 3, solo_dining: 2, special_occasion: 10 },
  IN: { daily_eats: 300, good_value: 500, date_night: 800, family_dinner: 600, late_night: 350, healthy_budget: 400, group_party: 500, solo_dining: 350, special_occasion: 1500 },
  MX: { daily_eats: 150, good_value: 250, date_night: 400, family_dinner: 300, late_night: 180, healthy_budget: 200, group_party: 250, solo_dining: 180, special_occasion: 800 },
  LU: { daily_eats: 10, good_value: 15, date_night: 25, family_dinner: 18, late_night: 12, healthy_budget: 14, group_party: 15, solo_dining: 12, special_occasion: 50 },
  AT: { daily_eats: 9, good_value: 13, date_night: 22, family_dinner: 16, late_night: 11, healthy_budget: 12, group_party: 13, solo_dining: 11, special_occasion: 45 },
};

// City cost-of-living multipliers (1.0 = country average)
const CITY_MULTIPLIERS: Record<string, number> = {
  // Japan
  tokyo: 1.0, osaka: 0.85, kyoto: 0.90,
  // US
  nyc: 1.35, la: 1.15, chicago: 1.0, sf: 1.40, miami: 1.10,
  austin: 0.85, boston: 1.15, houston: 0.80, seattle: 1.15, dc: 1.20,
  denver: 0.90, nashville: 0.85, atlanta: 0.85, dallas: 0.80,
  phoenix: 0.80, sandiego: 1.05, philly: 0.95, charlotte: 0.75, raleigh: 0.75, slc: 0.80,
  // UK
  london: 1.25, manchester: 0.80,
  // Germany
  berlin: 0.90, munich: 1.15, frankfurt: 1.10,
  // France
  paris: 1.20,
  // Australia
  sydney: 1.10, melbourne: 1.0,
  // Canada
  toronto: 1.10, vancouver: 1.15,
  // UAE
  dubai: 1.0, abudhabi: 0.90,
  // Others
  singapore: 1.0, hongkong: 1.0, taipei: 1.0,
  amsterdam: 1.05, madrid: 0.90, barcelona: 0.95, lisbon: 0.90,
  rome: 0.95, milan: 1.10, zurich: 1.0, geneva: 1.05,
  luxembourg: 1.0, prague: 0.90, vienna: 1.0, budapest: 0.85,
  warsaw: 0.85, istanbul: 0.80, athens: 0.85,
  telaviv: 1.15, doha: 0.95, kuwait: 1.0, mumbai: 1.0,
  mexicocity: 0.90, cancun: 1.15,
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
  daily_eats: '🍱', good_value: '💰', date_night: '🥂', family_dinner: '👨‍👩‍👧‍👦',
  late_night: '🌙', healthy_budget: '🥗', group_party: '🎉', solo_dining: '🧑‍💻', special_occasion: '🎂',
};

/**
 * Get price brackets for a specific city
 */
export function getCityBrackets(cityId: string, countryCode: string): PriceBracket[] {
  const base = COUNTRY_BASE[countryCode] || COUNTRY_BASE.US;
  const multiplier = CITY_MULTIPLIERS[cityId] || 1.0;

  return Object.entries(base).map(([purposeKey, basePrice], i) => ({
    id: i + 1,
    countryId: 0,
    cityId: 0,
    purposeKey: purposeKey as any,
    purposeLabel: PURPOSE_LABELS[purposeKey] || { en: purposeKey },
    maxPrice: Math.round(basePrice * multiplier),
    icon: PURPOSE_ICONS[purposeKey],
    sortOrder: i,
  }));
}
