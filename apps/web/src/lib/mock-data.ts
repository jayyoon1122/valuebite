import type { RestaurantListItem, PriceBracket } from '@valuebite/types';

// Mock data for development before backend is connected
export const MOCK_RESTAURANTS: RestaurantListItem[] = [
  {
    id: '1', name: { original: '松屋 新宿店', en: 'Matsuya Shinjuku', romanized: 'Matsuya' },
    slug: 'matsuya-shinjuku', cuisineType: ['japanese', 'gyudon'],
    lat: 35.6938, lng: 139.7034, avgMealPrice: 550, priceCurrency: 'JPY',
    valueScore: 4.5, tasteScore: 3.8, portionScore: 4.2, totalReviews: 342,
    photoUrl: '', distance: 250, purposeFit: 0.95,
    freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
  },
  {
    id: '2', name: { original: 'やよい軒 渋谷店', en: 'Yayoiken Shibuya', romanized: 'Yayoiken' },
    slug: 'yayoiken-shibuya', cuisineType: ['japanese', 'teishoku'],
    lat: 35.6580, lng: 139.7016, avgMealPrice: 780, priceCurrency: 'JPY',
    valueScore: 4.3, tasteScore: 4.0, portionScore: 4.5, totalReviews: 218,
    photoUrl: '', distance: 480, purposeFit: 0.90,
    freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
  },
  {
    id: '3', name: { original: '日高屋 池袋店', en: 'Hidakaya Ikebukuro', romanized: 'Hidakaya' },
    slug: 'hidakaya-ikebukuro', cuisineType: ['chinese', 'ramen'],
    lat: 35.7295, lng: 139.7109, avgMealPrice: 490, priceCurrency: 'JPY',
    valueScore: 4.1, tasteScore: 3.5, portionScore: 4.0, totalReviews: 156,
    photoUrl: '', distance: 350, purposeFit: 0.88,
    freshnessIndicator: { label: 'Verified 1-3 months ago', color: 'yellow', icon: 'clock' },
  },
  {
    id: '4', name: { original: 'CoCo壱番屋 新宿店', en: 'CoCo Ichibanya Shinjuku', romanized: 'CoCo Curry' },
    slug: 'coco-ichibanya-shinjuku', cuisineType: ['japanese', 'curry'],
    lat: 35.6920, lng: 139.7005, avgMealPrice: 750, priceCurrency: 'JPY',
    valueScore: 3.9, tasteScore: 3.8, portionScore: 3.5, totalReviews: 89,
    photoUrl: '', distance: 620, purposeFit: 0.82,
    freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
  },
  {
    id: '5', name: { original: '富士そば 新宿店', en: 'Fuji Soba Shinjuku', romanized: 'Fuji Soba' },
    slug: 'fuji-soba-shinjuku', cuisineType: ['japanese', 'soba', 'udon'],
    lat: 35.6905, lng: 139.6980, avgMealPrice: 420, priceCurrency: 'JPY',
    valueScore: 4.7, tasteScore: 3.5, portionScore: 3.8, totalReviews: 501,
    photoUrl: '', distance: 180, purposeFit: 0.97,
    freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
  },
  {
    id: '6', name: { original: 'サイゼリヤ 渋谷店', en: 'Saizeriya Shibuya', romanized: 'Saizeriya' },
    slug: 'saizeriya-shibuya', cuisineType: ['italian', 'family'],
    lat: 35.6612, lng: 139.6985, avgMealPrice: 650, priceCurrency: 'JPY',
    valueScore: 4.6, tasteScore: 3.6, portionScore: 4.3, totalReviews: 275,
    photoUrl: '', distance: 900, purposeFit: 0.85,
    freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' },
  },
];

export const MOCK_BRACKETS: PriceBracket[] = [
  { id: 1, countryId: 1, purposeKey: 'daily_eats', purposeLabel: { en: 'Daily Eats', ja: '普段の食事' }, maxPrice: 1000, icon: '🍛', sortOrder: 0 },
  { id: 2, countryId: 1, purposeKey: 'good_value', purposeLabel: { en: 'Good Value', ja: 'コスパ◎' }, maxPrice: 1500, icon: '🍱', sortOrder: 1 },
  { id: 3, countryId: 1, purposeKey: 'date_night', purposeLabel: { en: 'Date Night', ja: 'デートの夜' }, maxPrice: 2500, icon: '🥂', sortOrder: 2 },
  { id: 4, countryId: 1, purposeKey: 'family_dinner', purposeLabel: { en: 'Family Dinner', ja: '家族ディナー' }, maxPrice: 2000, icon: '👨‍👩‍👧‍👦', sortOrder: 3 },
  { id: 5, countryId: 1, purposeKey: 'late_night', purposeLabel: { en: 'Late Night', ja: '夜食' }, maxPrice: 1200, icon: '🌙', sortOrder: 4 },
  { id: 6, countryId: 1, purposeKey: 'healthy_budget', purposeLabel: { en: 'Healthy & Budget', ja: 'ヘルシー&節約' }, maxPrice: 1400, icon: '🥗', sortOrder: 5 },
  { id: 7, countryId: 1, purposeKey: 'solo_dining', purposeLabel: { en: 'Solo Dining', ja: 'ひとり飯' }, maxPrice: 1200, icon: '🧑‍💻', sortOrder: 6 },
  { id: 8, countryId: 1, purposeKey: 'group_party', purposeLabel: { en: 'Group & Party', ja: '宴会' }, maxPrice: 1500, icon: '🎉', sortOrder: 7 },
];
