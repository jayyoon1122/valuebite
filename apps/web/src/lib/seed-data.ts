/**
 * Comprehensive seed data for Tokyo launch
 * 30+ real budget restaurants with realistic reviews, menus, and community posts
 * All data based on publicly known chain/restaurant information
 */

import type { RestaurantListItem } from '@valuebite/types';

// Unsplash placeholder images for food categories
const PHOTOS = {
  gyudon: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  ramen: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop',
  curry: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  soba: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&h=300&fit=crop',
  teishoku: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=400&h=300&fit=crop',
  italian: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
  udon: 'https://images.unsplash.com/photo-1618841557871-b4664f1db0d3?w=400&h=300&fit=crop',
  tonkatsu: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
  cafe: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
  izakaya: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
};

export const SEED_RESTAURANTS: RestaurantListItem[] = [
  // === SHINJUKU AREA ===
  { id: 'r1', name: { original: '松屋 新宿西口店', en: 'Matsuya Shinjuku West', romanized: 'Matsuya' }, slug: 'matsuya-shinjuku-west', cuisineType: ['japanese', 'gyudon'], lat: 35.6938, lng: 139.6980, avgMealPrice: 450, priceCurrency: 'JPY', valueScore: 4.6, tasteScore: 3.8, portionScore: 4.3, totalReviews: 487, photoUrl: PHOTOS.gyudon, distance: 120, purposeFit: 0.95, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r2', name: { original: '富士そば 新宿店', en: 'Fuji Soba Shinjuku', romanized: 'Fuji Soba' }, slug: 'fuji-soba-shinjuku', cuisineType: ['japanese', 'soba', 'udon'], lat: 35.6905, lng: 139.6995, avgMealPrice: 420, priceCurrency: 'JPY', valueScore: 4.7, tasteScore: 3.5, portionScore: 3.8, totalReviews: 623, photoUrl: PHOTOS.soba, distance: 180, purposeFit: 0.97, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r3', name: { original: 'すき家 新宿三丁目店', en: 'Sukiya Shinjuku 3-chome', romanized: 'Sukiya' }, slug: 'sukiya-shinjuku', cuisineType: ['japanese', 'gyudon'], lat: 35.6920, lng: 139.7050, avgMealPrice: 430, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 3.6, portionScore: 4.1, totalReviews: 312, photoUrl: PHOTOS.gyudon, distance: 350, purposeFit: 0.93, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r4', name: { original: '日高屋 新宿南口店', en: 'Hidakaya Shinjuku South', romanized: 'Hidakaya' }, slug: 'hidakaya-shinjuku', cuisineType: ['chinese', 'ramen'], lat: 35.6880, lng: 139.6990, avgMealPrice: 490, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 3.7, portionScore: 4.0, totalReviews: 198, photoUrl: PHOTOS.chinese, distance: 280, purposeFit: 0.88, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r5', name: { original: 'CoCo壱番屋 新宿靖国通り店', en: 'CoCo Ichibanya Shinjuku', romanized: 'CoCo Curry' }, slug: 'coco-curry-shinjuku', cuisineType: ['japanese', 'curry'], lat: 35.6930, lng: 139.7020, avgMealPrice: 750, priceCurrency: 'JPY', valueScore: 3.9, tasteScore: 4.0, portionScore: 3.5, totalReviews: 145, photoUrl: PHOTOS.curry, distance: 420, purposeFit: 0.78, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r6', name: { original: 'てんや 新宿西口店', en: 'Tenya Shinjuku West', romanized: 'Tenya' }, slug: 'tenya-shinjuku', cuisineType: ['japanese', 'tempura'], lat: 35.6942, lng: 139.6975, avgMealPrice: 550, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.1, portionScore: 3.9, totalReviews: 167, photoUrl: PHOTOS.teishoku, distance: 150, purposeFit: 0.90, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r7', name: { original: '吉野家 新宿東口店', en: 'Yoshinoya Shinjuku East', romanized: 'Yoshinoya' }, slug: 'yoshinoya-shinjuku', cuisineType: ['japanese', 'gyudon'], lat: 35.6925, lng: 139.7045, avgMealPrice: 480, priceCurrency: 'JPY', valueScore: 4.1, tasteScore: 3.5, portionScore: 4.0, totalReviews: 276, photoUrl: PHOTOS.gyudon, distance: 390, purposeFit: 0.91, isChain: true, freshnessIndicator: { label: 'Verified 1-3 months ago', color: 'yellow', icon: 'clock' } },

  // === SHIBUYA AREA ===
  { id: 'r8', name: { original: 'サイゼリヤ 渋谷東口店', en: 'Saizeriya Shibuya East', romanized: 'Saizeriya' }, slug: 'saizeriya-shibuya', cuisineType: ['italian', 'family'], lat: 35.6612, lng: 139.7020, avgMealPrice: 580, priceCurrency: 'JPY', valueScore: 4.6, tasteScore: 3.6, portionScore: 4.4, totalReviews: 389, photoUrl: PHOTOS.italian, distance: 850, purposeFit: 0.85, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r9', name: { original: 'やよい軒 渋谷店', en: 'Yayoiken Shibuya', romanized: 'Yayoiken' }, slug: 'yayoiken-shibuya', cuisineType: ['japanese', 'teishoku'], lat: 35.6595, lng: 139.7005, avgMealPrice: 780, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.0, portionScore: 4.5, totalReviews: 234, photoUrl: PHOTOS.teishoku, distance: 920, purposeFit: 0.90, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r10', name: { original: 'なか卯 渋谷宮益坂店', en: 'Nakau Shibuya', romanized: 'Nakau' }, slug: 'nakau-shibuya', cuisineType: ['japanese', 'udon', 'gyudon'], lat: 35.6600, lng: 139.7035, avgMealPrice: 490, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 3.6, portionScore: 4.0, totalReviews: 156, photoUrl: PHOTOS.udon, distance: 870, purposeFit: 0.89, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r11', name: { original: '天下一品 渋谷店', en: 'Tenkaippin Shibuya', romanized: 'Tenkaippin' }, slug: 'tenkaippin-shibuya', cuisineType: ['japanese', 'ramen'], lat: 35.6588, lng: 139.6980, avgMealPrice: 830, priceCurrency: 'JPY', valueScore: 4.0, tasteScore: 4.3, portionScore: 3.8, totalReviews: 201, photoUrl: PHOTOS.ramen, distance: 960, purposeFit: 0.72, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === IKEBUKURO AREA ===
  { id: 'r12', name: { original: '日高屋 池袋東口店', en: 'Hidakaya Ikebukuro East', romanized: 'Hidakaya' }, slug: 'hidakaya-ikebukuro', cuisineType: ['chinese', 'ramen'], lat: 35.7300, lng: 139.7130, avgMealPrice: 490, priceCurrency: 'JPY', valueScore: 4.1, tasteScore: 3.5, portionScore: 4.0, totalReviews: 178, photoUrl: PHOTOS.chinese, distance: 1200, purposeFit: 0.88, isChain: true, freshnessIndicator: { label: 'Verified 1-3 months ago', color: 'yellow', icon: 'clock' } },
  { id: 'r13', name: { original: 'ガスト 池袋東口店', en: 'Gusto Ikebukuro', romanized: 'Gusto' }, slug: 'gusto-ikebukuro', cuisineType: ['family', 'western'], lat: 35.7310, lng: 139.7115, avgMealPrice: 650, priceCurrency: 'JPY', valueScore: 4.0, tasteScore: 3.4, portionScore: 4.2, totalReviews: 267, photoUrl: PHOTOS.italian, distance: 1350, purposeFit: 0.82, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r14', name: { original: '松のや 池袋西口店', en: 'Matsunoya Ikebukuro', romanized: 'Matsunoya' }, slug: 'matsunoya-ikebukuro', cuisineType: ['japanese', 'tonkatsu'], lat: 35.7295, lng: 139.7080, avgMealPrice: 550, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.2, portionScore: 4.0, totalReviews: 189, photoUrl: PHOTOS.tonkatsu, distance: 1400, purposeFit: 0.87, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === TOKYO STATION / MARUNOUCHI ===
  { id: 'r15', name: { original: '丸亀製麺 東京駅店', en: 'Marugame Seimen Tokyo Sta.', romanized: 'Marugame Udon' }, slug: 'marugame-tokyo-sta', cuisineType: ['japanese', 'udon'], lat: 35.6812, lng: 139.7671, avgMealPrice: 450, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.0, portionScore: 4.2, totalReviews: 534, photoUrl: PHOTOS.udon, distance: 2100, purposeFit: 0.94, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r16', name: { original: 'かつや 大手町店', en: 'Katsuya Otemachi', romanized: 'Katsuya' }, slug: 'katsuya-otemachi', cuisineType: ['japanese', 'tonkatsu'], lat: 35.6855, lng: 139.7640, avgMealPrice: 590, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.1, portionScore: 4.0, totalReviews: 145, photoUrl: PHOTOS.tonkatsu, distance: 2300, purposeFit: 0.86, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === AKIHABARA ===
  { id: 'r17', name: { original: '松屋 秋葉原店', en: 'Matsuya Akihabara', romanized: 'Matsuya' }, slug: 'matsuya-akihabara', cuisineType: ['japanese', 'gyudon'], lat: 35.6984, lng: 139.7731, avgMealPrice: 450, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 3.8, portionScore: 4.2, totalReviews: 312, photoUrl: PHOTOS.gyudon, distance: 3200, purposeFit: 0.94, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r18', name: { original: 'ゴーゴーカレー 秋葉原店', en: 'Go Go Curry Akihabara', romanized: 'Go Go Curry' }, slug: 'gogo-curry-akihabara', cuisineType: ['japanese', 'curry'], lat: 35.6990, lng: 139.7715, avgMealPrice: 780, priceCurrency: 'JPY', valueScore: 4.1, tasteScore: 4.2, portionScore: 4.5, totalReviews: 198, photoUrl: PHOTOS.curry, distance: 3100, purposeFit: 0.80, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === UENO ===
  { id: 'r19', name: { original: '大戸屋 上野店', en: 'Ootoya Ueno', romanized: 'Ootoya' }, slug: 'ootoya-ueno', cuisineType: ['japanese', 'teishoku'], lat: 35.7135, lng: 139.7770, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 4.1, portionScore: 3.9, totalReviews: 178, photoUrl: PHOTOS.teishoku, distance: 3500, purposeFit: 0.78, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === SHIMBASHI (OFFICE DISTRICT) ===
  { id: 'r20', name: { original: '松屋 新橋店', en: 'Matsuya Shimbashi', romanized: 'Matsuya' }, slug: 'matsuya-shimbashi', cuisineType: ['japanese', 'gyudon'], lat: 35.6660, lng: 139.7580, avgMealPrice: 450, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 3.8, portionScore: 4.2, totalReviews: 402, photoUrl: PHOTOS.gyudon, distance: 4100, purposeFit: 0.95, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r21', name: { original: 'すき家 新橋日比谷口店', en: 'Sukiya Shimbashi', romanized: 'Sukiya' }, slug: 'sukiya-shimbashi', cuisineType: ['japanese', 'gyudon'], lat: 35.6665, lng: 139.7575, avgMealPrice: 430, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 3.5, portionScore: 4.1, totalReviews: 256, photoUrl: PHOTOS.gyudon, distance: 4200, purposeFit: 0.92, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // === UNIQUE/INTERESTING BUDGET SPOTS ===
  { id: 'r22', name: { original: '餃子の王将 新宿歌舞伎町店', en: 'Gyoza no Ohsho Kabukicho', romanized: 'Gyoza Ohsho' }, slug: 'gyoza-ohsho-kabukicho', cuisineType: ['chinese', 'gyoza'], lat: 35.6950, lng: 139.7030, avgMealPrice: 620, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.2, portionScore: 4.5, totalReviews: 234, photoUrl: PHOTOS.chinese, distance: 300, purposeFit: 0.85, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r23', name: { original: 'バーミヤン 新宿靖国通り店', en: 'Bamiyan Shinjuku', romanized: 'Bamiyan' }, slug: 'bamiyan-shinjuku', cuisineType: ['chinese', 'family'], lat: 35.6935, lng: 139.7015, avgMealPrice: 680, priceCurrency: 'JPY', valueScore: 4.0, tasteScore: 3.5, portionScore: 4.3, totalReviews: 145, photoUrl: PHOTOS.chinese, distance: 250, purposeFit: 0.80, isChain: true, freshnessIndicator: { label: 'Verified 1-3 months ago', color: 'yellow', icon: 'clock' } },
  { id: 'r24', name: { original: 'はなまるうどん 渋谷公園通り店', en: 'Hanamaru Udon Shibuya', romanized: 'Hanamaru Udon' }, slug: 'hanamaru-udon-shibuya', cuisineType: ['japanese', 'udon'], lat: 35.6620, lng: 139.6990, avgMealPrice: 380, priceCurrency: 'JPY', valueScore: 4.8, tasteScore: 3.7, portionScore: 3.9, totalReviews: 312, photoUrl: PHOTOS.udon, distance: 800, purposeFit: 0.96, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r25', name: { original: 'かっぱ寿司 新宿三丁目店', en: 'Kappa Sushi Shinjuku', romanized: 'Kappa Sushi' }, slug: 'kappa-sushi-shinjuku', cuisineType: ['japanese', 'sushi'], lat: 35.6910, lng: 139.7055, avgMealPrice: 880, priceCurrency: 'JPY', valueScore: 4.1, tasteScore: 3.8, portionScore: 4.0, totalReviews: 167, photoUrl: PHOTOS.sushi, distance: 450, purposeFit: 0.75, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r26', name: { original: 'リンガーハット 新宿西口店', en: 'Ringer Hut Shinjuku', romanized: 'Ringer Hut' }, slug: 'ringer-hut-shinjuku', cuisineType: ['japanese', 'champon'], lat: 35.6940, lng: 139.6965, avgMealPrice: 690, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 4.0, portionScore: 4.3, totalReviews: 123, photoUrl: PHOTOS.ramen, distance: 200, purposeFit: 0.83, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r27', name: { original: 'ドトールコーヒー 新宿南口店', en: 'Doutor Coffee Shinjuku South', romanized: 'Doutor' }, slug: 'doutor-shinjuku-south', cuisineType: ['cafe', 'light-meal'], lat: 35.6885, lng: 139.6992, avgMealPrice: 450, priceCurrency: 'JPY', valueScore: 3.8, tasteScore: 3.5, portionScore: 3.0, totalReviews: 98, photoUrl: PHOTOS.cafe, distance: 300, purposeFit: 0.70, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'r28', name: { original: '鳥貴族 新宿東口店', en: 'Torikizoku Shinjuku East', romanized: 'Torikizoku' }, slug: 'torikizoku-shinjuku', cuisineType: ['japanese', 'yakitori', 'izakaya'], lat: 35.6928, lng: 139.7048, avgMealPrice: 980, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.1, portionScore: 4.2, totalReviews: 289, photoUrl: PHOTOS.izakaya, distance: 380, purposeFit: 0.82, isChain: true, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // ===== INDEPENDENT RESTAURANTS =====

  // --- Roppongi / Azabu ---
  { id: 'i1', name: { original: '麺屋 翔 六本木店', en: 'Menya Sho Roppongi', romanized: 'Menya Sho' }, slug: 'menya-sho-roppongi', cuisineType: ['japanese', 'ramen'], lat: 35.6627, lng: 139.7310, avgMealPrice: 920, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.6, portionScore: 4.0, totalReviews: 234, photoUrl: PHOTOS.ramen, distance: 1500, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i2', name: { original: 'チャイハネ 六本木', en: 'Chai Khana Roppongi', romanized: 'Chai Khana' }, slug: 'chai-khana-roppongi', cuisineType: ['indian', 'nepali'], lat: 35.6635, lng: 139.7295, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.4, portionScore: 4.2, totalReviews: 145, photoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', distance: 1550, purposeFit: 0.75, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Asakusa ---
  { id: 'i3', name: { original: '尾張屋 浅草', en: 'Owariya Asakusa', romanized: 'Owariya' }, slug: 'owariya-asakusa', cuisineType: ['japanese', 'soba'], lat: 35.7115, lng: 139.7966, avgMealPrice: 680, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.3, portionScore: 3.8, totalReviews: 312, photoUrl: PHOTOS.soba, distance: 4200, purposeFit: 0.85, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i4', name: { original: '浅草もんじゃ お好み焼き', en: 'Asakusa Monja', romanized: 'Asakusa Monja' }, slug: 'asakusa-monja', cuisineType: ['japanese', 'monja', 'okonomiyaki'], lat: 35.7120, lng: 139.7950, avgMealPrice: 780, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 4.1, portionScore: 4.3, totalReviews: 189, photoUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop', distance: 4300, purposeFit: 0.78, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Shimokitazawa ---
  { id: 'i5', name: { original: '下北沢カレー食堂', en: 'Shimokita Curry Shokudo', romanized: 'Shimokita Curry' }, slug: 'shimokita-curry', cuisineType: ['japanese', 'curry'], lat: 35.6615, lng: 139.6686, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.5, portionScore: 3.9, totalReviews: 178, photoUrl: PHOTOS.curry, distance: 2100, purposeFit: 0.82, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i6', name: { original: 'ベトナム料理 サイゴン', en: 'Vietnam Kitchen Saigon', romanized: 'Saigon' }, slug: 'saigon-shimokitazawa', cuisineType: ['vietnamese', 'pho'], lat: 35.6610, lng: 139.6695, avgMealPrice: 780, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.3, portionScore: 4.1, totalReviews: 134, photoUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop', distance: 2200, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Koenji ---
  { id: 'i7', name: { original: '高円寺 ネパール食堂', en: 'Koenji Nepal Shokudo', romanized: 'Nepal Shokudo' }, slug: 'nepal-shokudo-koenji', cuisineType: ['nepali', 'indian', 'dal-bhat'], lat: 35.7055, lng: 139.6495, avgMealPrice: 750, priceCurrency: 'JPY', valueScore: 4.6, tasteScore: 4.5, portionScore: 4.8, totalReviews: 201, photoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', distance: 3100, purposeFit: 0.88, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i8', name: { original: '高円寺 天ぷら 天助', en: 'Tensuke Tempura Koenji', romanized: 'Tensuke' }, slug: 'tensuke-koenji', cuisineType: ['japanese', 'tempura'], lat: 35.7050, lng: 139.6500, avgMealPrice: 650, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.4, portionScore: 4.1, totalReviews: 156, photoUrl: PHOTOS.teishoku, distance: 3200, purposeFit: 0.85, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Ebisu / Meguro ---
  { id: 'i9', name: { original: 'アフガン 恵比寿', en: 'Afghan Ebisu', romanized: 'Afghan' }, slug: 'afghan-ebisu', cuisineType: ['japanese', 'curry', 'lunch-set'], lat: 35.6468, lng: 139.7100, avgMealPrice: 900, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.5, portionScore: 4.0, totalReviews: 267, photoUrl: PHOTOS.curry, distance: 1800, purposeFit: 0.78, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i10', name: { original: '目黒 とんかつ かつ壱', en: 'Katsuichi Meguro', romanized: 'Katsuichi' }, slug: 'katsuichi-meguro', cuisineType: ['japanese', 'tonkatsu'], lat: 35.6340, lng: 139.7157, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.6, portionScore: 4.2, totalReviews: 145, photoUrl: PHOTOS.tonkatsu, distance: 2000, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Takadanobaba (University area) ---
  { id: 'i11', name: { original: 'タイ料理 バンコク 高田馬場', en: 'Bangkok Thai Takadanobaba', romanized: 'Bangkok Thai' }, slug: 'bangkok-thai-takadanobaba', cuisineType: ['thai'], lat: 35.7128, lng: 139.7038, avgMealPrice: 780, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.4, portionScore: 4.5, totalReviews: 223, photoUrl: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop', distance: 2500, purposeFit: 0.85, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i12', name: { original: '馬場南海 カレー', en: 'Baba Nankai Curry', romanized: 'Baba Nankai' }, slug: 'baba-nankai', cuisineType: ['japanese', 'curry', 'yoshoku'], lat: 35.7125, lng: 139.7035, avgMealPrice: 600, priceCurrency: 'JPY', valueScore: 4.7, tasteScore: 4.3, portionScore: 4.8, totalReviews: 456, photoUrl: PHOTOS.curry, distance: 2550, purposeFit: 0.92, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i13', name: { original: '成蹊 Korean Kitchen', en: 'Seikei Korean Kitchen', romanized: 'Seikei Korean' }, slug: 'seikei-korean-takadanobaba', cuisineType: ['korean', 'bibimbap'], lat: 35.7130, lng: 139.7040, avgMealPrice: 820, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 4.3, portionScore: 4.0, totalReviews: 112, photoUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', distance: 2600, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Ginza ---
  { id: 'i14', name: { original: '銀座 立ち食い寿司 すし処', en: 'Ginza Standing Sushi', romanized: 'Ginza Tachigui Sushi' }, slug: 'ginza-standing-sushi', cuisineType: ['japanese', 'sushi', 'tachigui'], lat: 35.6717, lng: 139.7649, avgMealPrice: 980, priceCurrency: 'JPY', valueScore: 4.6, tasteScore: 4.7, portionScore: 3.5, totalReviews: 345, photoUrl: PHOTOS.sushi, distance: 3800, purposeFit: 0.75, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i15', name: { original: '銀座 洋食 煉瓦亭', en: 'Renga-tei Ginza', romanized: 'Renga-tei' }, slug: 'rengatei-ginza', cuisineType: ['japanese', 'yoshoku', 'western'], lat: 35.6720, lng: 139.7655, avgMealPrice: 950, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.4, portionScore: 3.8, totalReviews: 278, photoUrl: PHOTOS.teishoku, distance: 3900, purposeFit: 0.72, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Nakano ---
  { id: 'i16', name: { original: '中野 青葉 本店', en: 'Aoba Ramen Nakano', romanized: 'Aoba Ramen' }, slug: 'aoba-ramen-nakano', cuisineType: ['japanese', 'ramen'], lat: 35.7076, lng: 139.6655, avgMealPrice: 830, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.6, portionScore: 3.9, totalReviews: 389, photoUrl: PHOTOS.ramen, distance: 2800, purposeFit: 0.78, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Kichijoji ---
  { id: 'i17', name: { original: '吉祥寺 いせや 焼き鳥', en: 'Iseya Yakitori Kichijoji', romanized: 'Iseya' }, slug: 'iseya-kichijoji', cuisineType: ['japanese', 'yakitori'], lat: 35.7037, lng: 139.5796, avgMealPrice: 600, priceCurrency: 'JPY', valueScore: 4.7, tasteScore: 4.3, portionScore: 4.5, totalReviews: 534, photoUrl: PHOTOS.izakaya, distance: 5500, purposeFit: 0.88, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Shinjuku area (independent) ---
  { id: 'i18', name: { original: '思い出横丁 もつ焼き', en: 'Omoide Yokocho Motsuyaki', romanized: 'Omoide Yokocho' }, slug: 'omoide-yokocho', cuisineType: ['japanese', 'yakitori', 'izakaya'], lat: 35.6940, lng: 139.6982, avgMealPrice: 800, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.3, portionScore: 3.8, totalReviews: 678, photoUrl: PHOTOS.izakaya, distance: 130, purposeFit: 0.82, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i19', name: { original: '新宿 麺屋 武蔵', en: 'Menya Musashi Shinjuku', romanized: 'Menya Musashi' }, slug: 'menya-musashi-shinjuku', cuisineType: ['japanese', 'ramen', 'tsukemen'], lat: 35.6935, lng: 139.7010, avgMealPrice: 950, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.5, portionScore: 4.0, totalReviews: 412, photoUrl: PHOTOS.ramen, distance: 200, purposeFit: 0.76, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Shibuya area (independent) ---
  { id: 'i20', name: { original: '渋谷 壁の穴 パスタ', en: 'Kabe no Ana Pasta Shibuya', romanized: 'Kabe no Ana' }, slug: 'kabe-no-ana-shibuya', cuisineType: ['italian', 'pasta'], lat: 35.6610, lng: 139.6975, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.2, tasteScore: 4.3, portionScore: 3.8, totalReviews: 198, photoUrl: PHOTOS.italian, distance: 900, purposeFit: 0.75, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i21', name: { original: '渋谷 魚力 海鮮丼', en: 'Uoriki Kaisen-don Shibuya', romanized: 'Uoriki' }, slug: 'uoriki-shibuya', cuisineType: ['japanese', 'sushi', 'kaisen-don'], lat: 35.6598, lng: 139.7010, avgMealPrice: 880, priceCurrency: 'JPY', valueScore: 4.4, tasteScore: 4.5, portionScore: 4.2, totalReviews: 256, photoUrl: PHOTOS.sushi, distance: 850, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- Ikebukuro area (independent) ---
  { id: 'i22', name: { original: '池袋 中華 永利', en: 'Eiri Chinese Ikebukuro', romanized: 'Eiri' }, slug: 'eiri-ikebukuro', cuisineType: ['chinese', 'sichuan'], lat: 35.7305, lng: 139.7120, avgMealPrice: 750, priceCurrency: 'JPY', valueScore: 4.5, tasteScore: 4.6, portionScore: 4.4, totalReviews: 189, photoUrl: PHOTOS.chinese, distance: 1250, purposeFit: 0.85, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },

  // --- More ethnic food ---
  { id: 'i23', name: { original: 'ターリー屋 新宿', en: 'Thali-ya Indian Shinjuku', romanized: 'Thali-ya' }, slug: 'thaliya-shinjuku', cuisineType: ['indian', 'curry', 'thali'], lat: 35.6918, lng: 139.7000, avgMealPrice: 850, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.4, portionScore: 4.2, totalReviews: 167, photoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', distance: 320, purposeFit: 0.82, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i24', name: { original: 'サムギョプサル 韓国料理 美豚', en: 'Biton Korean BBQ', romanized: 'Biton' }, slug: 'biton-korean-shinjuku', cuisineType: ['korean', 'bbq'], lat: 35.6945, lng: 139.7025, avgMealPrice: 980, priceCurrency: 'JPY', valueScore: 4.1, tasteScore: 4.3, portionScore: 4.0, totalReviews: 145, photoUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', distance: 350, purposeFit: 0.70, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
  { id: 'i25', name: { original: 'フォー ベトナム 新宿', en: 'Pho Vietnam Shinjuku', romanized: 'Pho Vietnam' }, slug: 'pho-vietnam-shinjuku', cuisineType: ['vietnamese', 'pho', 'banh-mi'], lat: 35.6915, lng: 139.6988, avgMealPrice: 820, priceCurrency: 'JPY', valueScore: 4.3, tasteScore: 4.2, portionScore: 4.1, totalReviews: 123, photoUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop', distance: 280, purposeFit: 0.80, isChain: false, freshnessIndicator: { label: 'Recently Verified', color: 'green', icon: 'check' } },
];

// === SEED REVIEWS (varied, realistic) ===
export const SEED_REVIEWS = [
  // Matsuya reviews
  { id: 'rev1', restaurantId: 'r1', userName: 'TokyoFoodie', userLevel: 3, wasWorthIt: true, pricePaid: 450, currency: '¥', tasteRating: 4, portionRating: 5, valueRating: 5, content: 'Best value gyudon in Shinjuku. The regular beef bowl at ¥450 is filling and tasty. Get the miso soup combo (+¥70) for a complete meal. Open 24h, perfect for late night hunger.', visitPurpose: 'daily_eats', aiSummary: 'Excellent value gyudon, generous portions, great for quick meals.', helpfulCount: 34, createdAt: '2026-04-03T10:30:00Z' },
  { id: 'rev2', restaurantId: 'r1', userName: 'BudgetSalary', userLevel: 2, wasWorthIt: true, pricePaid: 520, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'My go-to weekday lunch spot. The curry set meal is underrated — filling, tasty, and under ¥600 with salad and miso. Service is fast, in and out in 15 minutes.', visitPurpose: 'daily_eats', helpfulCount: 21, createdAt: '2026-04-01T12:15:00Z' },
  { id: 'rev3', restaurantId: 'r1', userName: 'NightOwl23', userLevel: 1, wasWorthIt: true, pricePaid: 450, currency: '¥', tasteRating: 3, portionRating: 4, content: 'Reliable 3AM option near Shinjuku station. Not gourmet, but exactly what you need after a long night. Counter seating is comfortable for solo diners.', visitPurpose: 'late_night', helpfulCount: 12, createdAt: '2026-03-28T03:20:00Z' },
  { id: 'rev4', restaurantId: 'r1', userName: 'StudentLife', userLevel: 1, wasWorthIt: true, pricePaid: 380, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 5, content: 'Breakfast set at ¥350 is the hidden gem. Rice, miso soup, grilled salmon — can\'t beat it for the price. Way cheaper than convenience store breakfast.', visitPurpose: 'daily_eats', helpfulCount: 45, createdAt: '2026-03-25T08:00:00Z' },

  // Fuji Soba reviews
  { id: 'rev5', restaurantId: 'r2', userName: 'SobaLover', userLevel: 2, wasWorthIt: true, pricePaid: 420, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Standing soba at its finest. The kakiage soba at ¥420 is my standard order. Fresh tempura, decent broth. Perfect for a quick 5-minute meal between trains.', visitPurpose: 'daily_eats', aiSummary: 'Quick standing soba with fresh kakiage tempura. Great transit meal.', helpfulCount: 28, createdAt: '2026-04-02T18:30:00Z' },
  { id: 'rev6', restaurantId: 'r2', userName: 'RailFan', userLevel: 1, wasWorthIt: true, pricePaid: 380, currency: '¥', tasteRating: 3, portionRating: 3, valueRating: 5, content: 'The ¥380 kake soba is probably the cheapest hot meal you can get in Shinjuku. Nothing fancy, but honest food. 24 hours, which is amazing.', visitPurpose: 'solo_dining', helpfulCount: 15, createdAt: '2026-03-30T22:45:00Z' },

  // Saizeriya reviews
  { id: 'rev7', restaurantId: 'r8', userName: 'ItalianBudget', userLevel: 2, wasWorthIt: true, pricePaid: 580, currency: '¥', tasteRating: 4, portionRating: 5, valueRating: 5, content: 'The Hamburg Steak (¥399) + Drink Bar (¥199) combo is insane value. Tasty, generous portions, and you can refill drinks forever. Perfect for students and families.', visitPurpose: 'family_dinner', aiSummary: 'Incredible value Italian chain. Hamburg steak + drink bar combo is unbeatable.', helpfulCount: 56, createdAt: '2026-04-04T19:00:00Z' },
  { id: 'rev8', restaurantId: 'r8', userName: 'DatePlanner', userLevel: 2, wasWorthIt: true, pricePaid: 1200, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 4, content: 'Had a casual date here. ¥1,200 for two people including wine is hard to beat. Not romantic, but the food is decent and the price can\'t be argued with. Good for early-stage dating when you want to be casual.', visitPurpose: 'date_night', helpfulCount: 31, createdAt: '2026-03-29T20:00:00Z' },

  // Hanamaru Udon
  { id: 'rev9', restaurantId: 'r24', userName: 'UdonMaster', userLevel: 3, wasWorthIt: true, pricePaid: 380, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'The kake udon starts at ¥300!!! Add a tempura piece for ¥100-150 and you have a solid meal for under ¥500. Noodles are surprisingly good for the price — chewy and fresh.', visitPurpose: 'daily_eats', aiSummary: 'Ultra-cheap udon starting at ¥300. Add tempura for a full meal under ¥500.', helpfulCount: 67, createdAt: '2026-04-03T13:00:00Z' },

  // Torikizoku
  { id: 'rev10', restaurantId: 'r28', userName: 'GroupDiner', userLevel: 2, wasWorthIt: true, pricePaid: 980, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'All items ¥360 (tax included). Yakitori, drinks, sides — everything. For a group of 4, we spent about ¥4,000 total and were completely satisfied. Best budget izakaya chain.', visitPurpose: 'group_party', helpfulCount: 42, createdAt: '2026-04-02T21:30:00Z' },

  // More varied reviews across many restaurants
  { id: 'rev11', restaurantId: 'r15', userName: 'UdonFan', userLevel: 2, wasWorthIt: true, pricePaid: 450, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Watch them make the udon fresh in front of you. The kake udon is only ¥390 and the noodles are thick and chewy. Add a tempura piece for the perfect budget lunch.', visitPurpose: 'daily_eats', helpfulCount: 23, createdAt: '2026-04-01T12:30:00Z' },
  { id: 'rev12', restaurantId: 'r14', userName: 'TonkatsuLove', userLevel: 2, wasWorthIt: true, pricePaid: 550, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 4, content: 'Crispy tonkatsu with unlimited rice, cabbage, and miso refills for ¥550. That\'s basically all-you-can-eat sides. The katsu itself is surprisingly good for the price.', visitPurpose: 'daily_eats', aiSummary: 'Excellent tonkatsu with unlimited rice and sides refills.', helpfulCount: 38, createdAt: '2026-03-31T12:00:00Z' },
  { id: 'rev13', restaurantId: 'r9', userName: 'HealthyEater', userLevel: 2, wasWorthIt: true, pricePaid: 780, currency: '¥', tasteRating: 4, portionRating: 5, valueRating: 4, content: 'The grilled fish teishoku set is the healthiest budget meal in Shibuya. Rice, miso, pickles, grilled mackerel — a proper balanced meal for under ¥800. Rice refills are free!', visitPurpose: 'healthy_budget', helpfulCount: 29, createdAt: '2026-04-02T12:30:00Z' },
  // Sukiya
  { id: 'rev14', restaurantId: 'r3', userName: 'MidnightSnacker', userLevel: 1, wasWorthIt: true, pricePaid: 430, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 5, content: 'Sukiya\'s cheese gyudon at ¥490 is an underrated combo. 24 hours, fast, and you get more topping variety than Matsuya or Yoshinoya. Their kids menu is also great if you have little ones.', visitPurpose: 'late_night', helpfulCount: 18, createdAt: '2026-04-02T01:30:00Z' },
  { id: 'rev15', restaurantId: 'r3', userName: 'CheapEatsTokyo', userLevel: 3, wasWorthIt: true, pricePaid: 380, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 5, content: 'The mini gyudon at ¥330 is the cheapest filling meal near Shinjuku station. Not the tastiest, but when you need calories and have ¥500 in your pocket, Sukiya delivers.', visitPurpose: 'daily_eats', aiSummary: 'Cheapest gyudon option with good topping variety.', helpfulCount: 41, createdAt: '2026-03-29T12:00:00Z' },
  // Hidakaya
  { id: 'rev16', restaurantId: 'r4', userName: 'RamenOnBudget', userLevel: 2, wasWorthIt: true, pricePaid: 490, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Best budget Chinese food chain in Tokyo. The fried rice + ramen combo at ¥650 is massive — could easily share with two people. Gyoza plate (¥260) is a must-order side.', visitPurpose: 'daily_eats', helpfulCount: 33, createdAt: '2026-04-01T19:00:00Z' },
  // CoCo Curry
  { id: 'rev17', restaurantId: 'r5', userName: 'CurryAddict', userLevel: 2, wasWorthIt: true, pricePaid: 750, currency: '¥', tasteRating: 4, portionRating: 3, valueRating: 3, content: 'The customization is what makes CoCo Curry special — choose your spice level, rice amount, and toppings. A bit pricier than other chains but the taste is consistent. Go for 3-spicy level for the authentic experience.', visitPurpose: 'solo_dining', helpfulCount: 15, createdAt: '2026-03-30T13:00:00Z' },
  // Tenya
  { id: 'rev18', restaurantId: 'r6', userName: 'TempuraFan', userLevel: 1, wasWorthIt: true, pricePaid: 550, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'The vegetable tendon at ¥500 is incredible value. Crispy tempura on rice with sweet tare sauce. Way better than convenience store tempura and only slightly more expensive.', visitPurpose: 'daily_eats', aiSummary: 'Excellent value tempura rice bowls, especially the vegetable tendon.', helpfulCount: 27, createdAt: '2026-04-03T12:30:00Z' },
  // Yoshinoya
  { id: 'rev19', restaurantId: 'r7', userName: 'OldSchoolFan', userLevel: 2, wasWorthIt: true, pricePaid: 480, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 4, content: 'Yoshinoya has been serving gyudon since 1899. The taste is slightly sweeter than Matsuya. I prefer their set meals with salad — better balanced nutrition for just ¥100 more.', visitPurpose: 'daily_eats', helpfulCount: 12, createdAt: '2026-03-28T12:00:00Z' },
  // Nakau
  { id: 'rev20', restaurantId: 'r10', userName: 'ValueSeeker', userLevel: 2, wasWorthIt: true, pricePaid: 490, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Nakau is the most underrated chain. Their oyakodon (chicken and egg rice bowl) at ¥490 is legitimately delicious — soft scrambled egg, juicy chicken. Better than most sit-down restaurants at double the price.', visitPurpose: 'daily_eats', helpfulCount: 52, createdAt: '2026-04-02T12:45:00Z' },
  // Tenkaippin
  { id: 'rev21', restaurantId: 'r11', userName: 'ThickBrothLover', userLevel: 2, wasWorthIt: true, pricePaid: 830, currency: '¥', tasteRating: 5, portionRating: 4, valueRating: 4, content: 'If you like rich, thick chicken broth ramen, Tenkaippin is the place. Their kotteri (thick) broth is legendary — almost like a stew. At ¥830 it\'s not the cheapest, but the flavor is worth every yen.', visitPurpose: 'solo_dining', helpfulCount: 36, createdAt: '2026-03-31T20:00:00Z' },
  // Gusto
  { id: 'rev22', restaurantId: 'r13', userName: 'FamilyDad', userLevel: 2, wasWorthIt: true, pricePaid: 650, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 5, content: 'Perfect for families with kids. High chairs available, kids menu from ¥299, and the drink bar keeps everyone happy. Weekend mornings have a great breakfast buffet for ¥599.', visitPurpose: 'family_dinner', helpfulCount: 44, createdAt: '2026-04-01T18:30:00Z' },
  // Gyoza no Ohsho
  { id: 'rev23', restaurantId: 'r22', userName: 'GyozaKing', userLevel: 3, wasWorthIt: true, pricePaid: 620, currency: '¥', tasteRating: 5, portionRating: 5, valueRating: 5, content: 'Best gyoza chain in Japan, hands down. 6 pan-fried gyoza for ¥260 — crispy bottoms, juicy filling. Order with fried rice (¥490) for the ultimate combo. Watch them hand-wrap the dumplings in the open kitchen.', visitPurpose: 'group_party', aiSummary: 'Legendary gyoza chain with hand-wrapped dumplings and open kitchen.', helpfulCount: 78, createdAt: '2026-04-03T19:30:00Z' },
  // Kappa Sushi
  { id: 'rev24', restaurantId: 'r25', userName: 'SushiDeal', userLevel: 1, wasWorthIt: true, pricePaid: 880, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 4, content: 'Conveyor belt sushi starting at ¥110 per plate. Not Tsukiji quality, but for the price it\'s solid. The salmon, tuna, and shrimp are all fresh. Great for satisfying a sushi craving without breaking ¥1,000.', visitPurpose: 'family_dinner', helpfulCount: 22, createdAt: '2026-03-30T19:00:00Z' },
  // Ringer Hut
  { id: 'rev25', restaurantId: 'r26', userName: 'NagasakiFan', userLevel: 1, wasWorthIt: true, pricePaid: 690, currency: '¥', tasteRating: 4, portionRating: 5, valueRating: 5, content: 'Nagasaki champon noodles loaded with vegetables. The regular at ¥690 has cabbage, carrots, bean sprouts, pork, and seafood — more vegetables than most salad places. Great healthy budget option.', visitPurpose: 'healthy_budget', helpfulCount: 19, createdAt: '2026-04-02T13:00:00Z' },
  // Torikizoku extra review
  { id: 'rev26', restaurantId: 'r28', userName: 'IzakayaExpert', userLevel: 3, wasWorthIt: true, pricePaid: 1100, currency: '¥', tasteRating: 4, portionRating: 3, valueRating: 5, content: 'The ¥360 uniform pricing is genius. Draft beer ¥360, yakitori skewers ¥360, edamame ¥360 — everything. For 3 skewers + 2 beers + a side you\'re at ¥2,160. Try that at any other izakaya and you\'d pay double.', visitPurpose: 'group_party', helpfulCount: 55, createdAt: '2026-04-01T22:00:00Z' },
  // Ootoya
  { id: 'rev27', restaurantId: 'r19', userName: 'BalancedMeal', userLevel: 2, wasWorthIt: true, pricePaid: 850, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 4, content: 'Ootoya is a step above typical chain teishoku. The grilled chicken set at ¥830 comes with 5-grain rice, miso with real tofu, and pickled vegetables. Feels like a home-cooked meal. Slightly pricier but worth it for the quality.', visitPurpose: 'healthy_budget', helpfulCount: 31, createdAt: '2026-03-29T12:30:00Z' },
  // Go Go Curry
  { id: 'rev28', restaurantId: 'r18', userName: 'MegaPortionFan', userLevel: 1, wasWorthIt: true, pricePaid: 780, currency: '¥', tasteRating: 4, portionRating: 5, valueRating: 4, content: 'The "Major" size curry at ¥780 is absolutely massive. Dark, thick Kanazawa-style curry with a crispy tonkatsu on top. If you\'re really hungry, this is the best bang for your buck in Akihabara. Warning: the "World Champion" size is ¥1,500 and could feed two.', visitPurpose: 'solo_dining', aiSummary: 'Massive Kanazawa-style curry with legendary portion sizes.', helpfulCount: 40, createdAt: '2026-04-03T14:00:00Z' },
  // Katsuya
  { id: 'rev29', restaurantId: 'r16', userName: 'LunchBreak', userLevel: 1, wasWorthIt: true, pricePaid: 590, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Katsudon (tonkatsu on egg and rice) for ¥590 near Tokyo Station. Perfect power lunch — filling, tasty, and fast. They also do a katsu curry that\'s great value at ¥650.', visitPurpose: 'daily_eats', helpfulCount: 17, createdAt: '2026-04-02T12:15:00Z' },
  // Matsuya Akihabara
  { id: 'rev30', restaurantId: 'r17', userName: 'AkibaRegular', userLevel: 2, wasWorthIt: true, pricePaid: 450, currency: '¥', tasteRating: 4, portionRating: 4, valueRating: 5, content: 'Same great Matsuya quality as any other branch. Convenient spot between the Electric Town exit and the main strip. The premium gyudon (¥550) is worth the upgrade — better quality beef and a soft-boiled egg on top.', visitPurpose: 'daily_eats', helpfulCount: 14, createdAt: '2026-04-01T15:00:00Z' },
  // Doutor
  { id: 'rev31', restaurantId: 'r27', userName: 'CoffeeBudget', userLevel: 1, wasWorthIt: true, pricePaid: 450, currency: '¥', tasteRating: 3, portionRating: 3, valueRating: 4, content: 'Not a restaurant per se, but Doutor\'s Milano sandwich set (¥450 with coffee) is a legitimate light lunch. Cheaper than Starbucks and the food is actually decent. Great for when you need WiFi and a quick bite.', visitPurpose: 'solo_dining', helpfulCount: 9, createdAt: '2026-03-28T14:00:00Z' },
  // Bamiyan
  { id: 'rev32', restaurantId: 'r23', userName: 'ChinaOnBudget', userLevel: 1, wasWorthIt: true, pricePaid: 680, currency: '¥', tasteRating: 3, portionRating: 4, valueRating: 4, content: 'Bamiyan is the Chinese version of Gusto — family-friendly, cheap drink bar, and surprisingly large menu. The mapo tofu set at ¥599 with rice is my go-to. Their lunch sets (11am-5pm) are even cheaper.', visitPurpose: 'family_dinner', helpfulCount: 16, createdAt: '2026-03-31T18:00:00Z' },
];

// === SEED COMMUNITY POSTS ===
export const SEED_POSTS = [
  { id: 'p1', type: 'tip', user: 'TokyoFoodie', userLevel: 3, title: 'Top 5 lunch spots under ¥500 near Shinjuku Station', content: 'After 6 months of daily exploration, here are my top picks for budget lunches near Shinjuku: 1) Fuji Soba (¥380 kake soba), 2) Matsuya (¥450 gyudon), 3) Hanamaru Udon (¥300 kake), 4) Sukiya (¥430 gyudon), 5) Tenya (¥550 tendon). All within 5 min walk from the station.', upvotes: 156, comments: 1, time: '2h ago' },
  { id: 'p2', type: 'deal', user: 'DealHunter', userLevel: 2, title: 'Saizeriya added a ¥299 pasta — yes, really', content: 'The new peperoncino pasta at Saizeriya is only ¥299 (tax included). Add the drink bar for ¥199 and you have a complete meal for under ¥500. This is probably the cheapest sit-down Italian meal in Tokyo.', upvotes: 234, comments: 45, time: '5h ago' },
  { id: 'p3', type: 'discussion', user: 'RamenHunter', userLevel: 2, title: 'Is Ichiran worth ¥1,000+ when Hidakaya exists at ¥490?', content: 'Genuine question: Hidakaya ramen is ¥490 and honestly pretty good. Ichiran is ¥1,000+. Is the taste difference really worth 2x the price? What do you all think?', upvotes: 89, comments: 67, time: '8h ago' },
  { id: 'p4', type: 'tip', user: 'BudgetSalary', userLevel: 2, title: 'Matsuya breakfast sets are the best-kept secret in Tokyo', content: 'Most people know Matsuya for gyudon, but their breakfast sets (available until 11am) are incredible value. Grilled salmon + rice + miso for ¥350. That\'s cheaper than a konbini onigiri set and way more filling.', upvotes: 198, comments: 23, time: '1d ago' },
  { id: 'p5', type: 'deal', user: 'CouponQueen', userLevel: 3, title: 'Gusto app coupon: 20% off all drink bars this week', content: 'Download the Gusto app and check the coupon section. 20% off drink bars all week. Stack it with the lunch set menu for best value. The Hamburg set + drink bar comes out to about ¥680.', upvotes: 67, comments: 12, time: '1d ago' },
  { id: 'p6', type: 'tip', user: 'NightOwl23', userLevel: 1, title: 'Best 24-hour restaurants near Shinjuku for late night', content: 'For those of us who work late or party late: Matsuya, Fuji Soba, Sukiya, and Yoshinoya are all 24h near Shinjuku station. My ranking for late night: 1) Matsuya (most variety), 2) Fuji Soba (quickest), 3) Sukiya (cheapest).', upvotes: 112, comments: 28, time: '2d ago' },
  { id: 'p7', type: 'discussion', user: 'FamilyMan', userLevel: 2, title: 'Best family-friendly budget restaurants for kids under 5?', content: 'Looking for places in Tokyo where I can bring my toddler without feeling awkward. Budget of ¥2,000 for the whole family. Saizeriya is our go-to but looking for variety. Any suggestions?', upvotes: 45, comments: 38, time: '2d ago' },
  { id: 'p8', type: 'deal', user: 'StudentLife', userLevel: 1, title: 'Yoshinoya student discount: Show student ID for ¥50 off', content: 'Just discovered that Yoshinoya gives ¥50 off if you show a student ID at certain locations. Not all branches do this, but the ones near universities usually do. Shinjuku East branch confirmed!', upvotes: 145, comments: 19, time: '3d ago' },
  { id: 'p9', type: 'tip', user: 'GyozaKing', userLevel: 3, title: 'Gyoza no Ohsho ¥260 gyoza is the best deal in Tokyo', content: 'I\'ve eaten at over 50 gyoza places in Tokyo. Nothing beats Ohsho\'s 6-piece plate at ¥260 for the price. Hand-wrapped, pan-fried to perfection. Pro tip: order "yoku-yaki" (extra crispy) for no extra charge.', upvotes: 203, comments: 31, time: '3d ago' },
  { id: 'p10', type: 'discussion', user: 'ExpatTokyo', userLevel: 2, title: 'Moving from NYC — how does budget dining compare?', content: 'Just relocated to Tokyo from New York. In NYC, a decent lunch is $15-20 minimum. Here I\'m eating amazing food for ¥500 ($3.50). Am I dreaming? What are the hidden costs or gotchas I should know about?', upvotes: 178, comments: 52, time: '4d ago' },
  { id: 'p11', type: 'tip', user: 'HealthyEater', userLevel: 2, title: 'Budget-friendly healthy eating guide: Shibuya area', content: 'Here are my top picks for healthy meals under ¥1,000 in Shibuya: 1) Yayoiken grilled fish set (¥780), 2) Ringer Hut vegetable champon (¥690), 3) Ootoya balanced teishoku (¥830). All include rice and miso.', upvotes: 98, comments: 15, time: '4d ago' },
  { id: 'p12', type: 'deal', user: 'AppDealFinder', userLevel: 2, title: 'Matsuya app: Digital coupon for free miso upgrade!', content: 'The Matsuya official app has a digital coupon right now — free upgrade from regular miso soup to premium tonjiru (pork miso) worth ¥100. Just show the coupon on your phone. Valid until end of month.', upvotes: 312, comments: 42, time: '5d ago' },
  { id: 'p13', type: 'discussion', user: 'SoloDiner', userLevel: 1, title: 'Best counter-only restaurants for eating alone comfortably?', content: 'I eat alone 90% of the time and prefer counter seats. What are the best counter-only budget restaurants in Shinjuku/Shibuya? Fuji Soba is my current go-to but want variety.', upvotes: 67, comments: 41, time: '5d ago' },
  { id: 'p14', type: 'tip', user: 'IzakayaExpert', userLevel: 3, title: 'How to eat at Torikizoku for under ¥1,500 per person', content: 'Strategy for maximum value at Torikizoku (all items ¥360): 1) Start with edamame + 2 yakitori, 2) One beer or highball, 3) Share karaage plate, 4) End with rice ball. Total: ~¥1,440. That\'s appetizer, main, drink, and carb — at an izakaya!', upvotes: 189, comments: 27, time: '6d ago' },
  { id: 'p15', type: 'discussion', user: 'TouristHelper', userLevel: 2, title: 'What should tourists know about budget dining in Japan?', content: 'Tips for tourist friends: 1) No tipping ever, 2) Many chains have vending machine ordering — no Japanese needed, 3) Lunch sets are always cheaper than dinner, 4) Water is always free, 5) ¥500 is a realistic meal budget per person.', upvotes: 256, comments: 38, time: '1w ago' },
];

// === SEED AI SUMMARIES (pre-cached) ===
export const SEED_AI_SUMMARIES: Record<string, any> = {
  r1: {
    summary: 'Reliable 24-hour gyudon chain right by Shinjuku station. Known for generous beef bowls at unbeatable prices — the regular gyudon at ¥450 is consistently voted "worth it" by 87% of diners. The breakfast sets are a local secret, offering a full Japanese breakfast for ¥350.',
    bestItems: ['Beef Bowl Regular (¥450)', 'Curry Set (¥520)', 'Breakfast Set A (¥350)'],
    bestFor: ['Quick solo lunch', 'Budget daily meals', 'Late night eats', '24h convenience'],
    commonComplaints: ['Can be crowded during 12-1pm rush', 'Limited vegetarian options'],
    bestTimeToVisit: 'Weekday lunch before 12pm or after 2pm. Breakfast sets before 11am.',
    worthItPercentage: 87,
    avgPricePaid: 470,
  },
  r2: {
    summary: 'The ultimate quick-stop soba spot for commuters. Standing-only counters mean you\'re in and out in 5 minutes. The kakiage soba at ¥420 features freshly fried tempura and decent buckwheat noodles. Open 24 hours, making it Shinjuku\'s cheapest hot meal option at any time.',
    bestItems: ['Kakiage Soba (¥420)', 'Kake Soba (¥380)', 'Tempura Udon (¥450)'],
    bestFor: ['Transit meals', 'Ultra-quick lunch', 'Solo dining', 'Late night'],
    commonComplaints: ['Standing only — no seats', 'Can feel rushed during peak hours'],
    bestTimeToVisit: 'Any time — 24 hours. Least crowded before 11am and after 9pm.',
    worthItPercentage: 91,
    avgPricePaid: 410,
  },
  r8: {
    summary: 'Italy\'s gift to budget dining in Tokyo. The Hamburg Steak at ¥399 and unlimited drink bar at ¥199 make this the go-to spot for students, families, and casual dates. Wine starts at ¥100 per glass. Consistently voted the best value family restaurant chain.',
    bestItems: ['Hamburg Steak (¥399)', 'Margherita Pizza (¥399)', 'Drink Bar (¥199)'],
    bestFor: ['Family dinner', 'Casual dates', 'Student hangouts', 'Group dining'],
    commonComplaints: ['Weekend dinner can have 20-30 min wait', 'Not authentic Italian'],
    bestTimeToVisit: 'Weekday dinner or weekend lunch. Avoid 6-8pm on weekends.',
    worthItPercentage: 89,
    avgPricePaid: 620,
  },
  r24: {
    summary: 'The cheapest udon in Tokyo, period. Kake udon starts at ¥300 — less than a convenience store rice ball. Self-service style where you pick tempura and sides as you go. Noodles are made fresh and surprisingly chewy for the price.',
    bestItems: ['Kake Udon (¥300)', 'Kakiage Tempura (¥150)', 'Beef Udon (¥500)'],
    bestFor: ['Ultra-budget meals', 'Quick solo lunch', 'Healthy budget eating'],
    commonComplaints: ['Self-service can be confusing for first-timers', 'Small portions'],
    bestTimeToVisit: 'Lunch time has the freshest noodles. Lines move fast.',
    worthItPercentage: 93, avgPricePaid: 380,
  },
  r3: {
    summary: 'Sukiya offers the most topping variety among gyudon chains. The cheese gyudon and kimchi gyudon are popular choices you won\'t find at competitors. Open 24 hours, with a surprisingly good kids menu making it family-friendly for budget outings.',
    bestItems: ['Gyudon Regular (¥430)', 'Cheese Gyudon (¥490)', 'Kids Curry (¥290)'],
    bestFor: ['Late night meals', 'Family budget dining', 'Topping variety lovers'],
    commonComplaints: ['Slightly less convenient locations than Matsuya', 'Service can be slow during rush'],
    bestTimeToVisit: 'Any time — 24 hours. Best during off-peak for seating.',
    worthItPercentage: 84, avgPricePaid: 440,
  },
  r4: {
    summary: 'Best budget Chinese food chain in Tokyo. Known for generous combo meals — the fried rice + ramen set is enough for two. Gyoza plate at ¥260 is a must-order. Beer is also cheap, making it a budget-friendly spot for after-work meals.',
    bestItems: ['Ramen + Fried Rice Combo (¥650)', 'Gyoza Plate (¥260)', 'Tanmen (¥520)'],
    bestFor: ['Quick Chinese food', 'After-work budget meals', 'Solo ramen runs'],
    commonComplaints: ['Can be greasy', 'Noisy atmosphere'],
    bestTimeToVisit: 'Weekday dinner. Lunch combos available 11am-3pm.',
    worthItPercentage: 82, avgPricePaid: 510,
  },
  r6: {
    summary: 'Tempura rice bowls (tendon) at chain restaurant prices. The vegetable tendon at ¥500 is the standout — crispy mixed tempura over rice with sweet tare sauce. One of the few budget options for quality tempura without paying ¥1,500+ at dedicated shops.',
    bestItems: ['Vegetable Tendon (¥500)', 'Shrimp Tendon (¥550)', 'All-Star Tendon (¥690)'],
    bestFor: ['Quick lunch', 'Tempura cravings on budget', 'Solo dining'],
    commonComplaints: ['Limited menu variety', 'Tempura can be oily at off-peak times'],
    bestTimeToVisit: 'Lunch rush (11:30-1pm) — freshest tempura batches.',
    worthItPercentage: 86, avgPricePaid: 540,
  },
  r9: {
    summary: 'The gold standard for teishoku (set meals) in Tokyo. Grilled fish, rice, miso, and pickles — a properly balanced Japanese meal. Rice refills are free, making it even better value. The grilled mackerel set is the most popular order.',
    bestItems: ['Grilled Mackerel Set (¥780)', 'Ginger Pork Set (¥730)', 'Mixed Grill Set (¥880)'],
    bestFor: ['Healthy balanced meals', 'Solo dining', 'Business lunch'],
    commonComplaints: ['Can have 10-15min wait at peak lunch', 'Some items sell out by 1pm'],
    bestTimeToVisit: 'Arrive before 12pm for best selection.',
    worthItPercentage: 88, avgPricePaid: 760,
  },
  r14: {
    summary: 'Matsunoya is Matsuya\'s tonkatsu spinoff — crispy tonkatsu sets with unlimited rice, cabbage, and miso refills. The loin katsu set at ¥550 is the best value tonkatsu in Tokyo. Basically all-you-can-eat sides with your meal.',
    bestItems: ['Loin Katsu Set (¥550)', 'Chicken Katsu Set (¥500)', 'Katsu Curry (¥650)'],
    bestFor: ['Hearty lunch', 'Unlimited refill lovers', 'Solo dining'],
    commonComplaints: ['Katsu quality varies by time of day', 'Can be heavy/oily'],
    bestTimeToVisit: 'Early lunch for freshest katsu.',
    worthItPercentage: 85, avgPricePaid: 560,
  },
  r22: {
    summary: 'Legendary gyoza chain where you can watch dumplings being hand-wrapped in the open kitchen. Six pan-fried gyoza for just ¥260 — crispy bottoms, juicy pork filling. The fried rice is also excellent. A must-visit for dumpling lovers on a budget.',
    bestItems: ['Pan-fried Gyoza 6pc (¥260)', 'Fried Rice (¥490)', 'Stamina Ramen (¥580)'],
    bestFor: ['Group dining', 'Gyoza lovers', 'Late night eats'],
    commonComplaints: ['Can be very crowded on weekends', 'Strong garlic smell on clothes'],
    bestTimeToVisit: 'Weekday dinner or late night. Weekend lunch has long lines.',
    worthItPercentage: 90, avgPricePaid: 630,
  },
  r28: {
    summary: 'The ultimate budget izakaya — every single item is ¥360 including tax. Draft beer, yakitori, edamame, everything. Perfect for groups who want to drink and eat without calculating. A night out for 4 people rarely exceeds ¥8,000 total.',
    bestItems: ['Yakitori Skewers (¥360)', 'Draft Beer (¥360)', 'Karaage (¥360)'],
    bestFor: ['Group parties', 'Budget drinking', 'After-work socializing'],
    commonComplaints: ['Can get noisy', 'Quality of individual items is mid-tier'],
    bestTimeToVisit: 'Weekday evening. Reserve on Fridays/Saturdays.',
    worthItPercentage: 88, avgPricePaid: 1050,
  },
  r15: {
    summary: 'Self-service udon where noodles are freshly made in front of you. Pick your base udon, then add tempura and toppings as you walk down the line (like a cafeteria). The thick, chewy noodles at ¥390 are some of the best value in Tokyo Station area.',
    bestItems: ['Kake Udon (¥390)', 'Beef Udon (¥590)', 'Kakiage (¥170)'],
    bestFor: ['Quick transit meal', 'Fresh noodle lovers', 'Tokyo Station layover'],
    commonComplaints: ['Self-service system can be confusing', 'Seating fills up fast at lunch'],
    bestTimeToVisit: 'Before 12pm or after 2pm to avoid the office worker rush.',
    worthItPercentage: 90, avgPricePaid: 460,
  },
  r18: {
    summary: 'Kanazawa-style dark curry with legendary portion sizes. The "Major" size at ¥780 will defeat most appetites. The thick, rich curry sauce with a crispy tonkatsu on top is Akihabara\'s favorite fuel. Ask for the "World Champion" size if you dare.',
    bestItems: ['Major Curry (¥780)', 'Champion Curry (¥900)', 'Chicken Katsu Curry (¥730)'],
    bestFor: ['Mega portions', 'Solo power lunch', 'Akihabara fuel-up'],
    commonComplaints: ['Very heavy/rich — not for light eaters', 'Limited menu variety'],
    bestTimeToVisit: 'Lunch or mid-afternoon. Avoid 12-1pm peak.',
    worthItPercentage: 83, avgPricePaid: 800,
  },
  r10: {
    summary: 'The most underrated chain in Tokyo. Nakau\'s oyakodon (chicken and egg bowl) at ¥490 rivals sit-down restaurants at double the price. Soft scrambled egg, juicy chicken thigh — genuinely delicious. They also do great udon sets.',
    bestItems: ['Oyakodon (¥490)', 'Udon Set (¥550)', 'Katsudon (¥590)'],
    bestFor: ['Quality donburi', 'Solo lunch', 'Underrated gem'],
    commonComplaints: ['Fewer locations than Matsuya/Sukiya', 'Limited late night hours at some branches'],
    bestTimeToVisit: 'Lunch time for freshest preparation.',
    worthItPercentage: 86, avgPricePaid: 510,
  },
};

// Menus for key restaurants
export const SEED_MENUS: Record<string, Array<{ name: string; price: number; category: string; isLunchSpecial?: boolean; tag?: string }>> = {
  r1: [
    { name: 'Beef Bowl (Regular)', price: 450, category: 'main' },
    { name: 'Beef Bowl (Large)', price: 550, category: 'main' },
    { name: 'Beef Bowl (Extra Large)', price: 680, category: 'main' },
    { name: 'Curry Rice', price: 490, category: 'main' },
    { name: 'Beef Curry Set', price: 580, category: 'set_meal', isLunchSpecial: true },
    { name: 'Grilled Salmon Breakfast', price: 350, category: 'set_meal', tag: 'Until 11am' },
    { name: 'Natto Breakfast', price: 290, category: 'set_meal', tag: 'Until 11am' },
    { name: 'Miso Soup', price: 70, category: 'side' },
    { name: 'Raw Egg', price: 70, category: 'side' },
    { name: 'Salad', price: 120, category: 'side' },
    { name: 'Kimchi', price: 100, category: 'side' },
  ],
  r8: [
    { name: 'Hamburg Steak', price: 399, category: 'main' },
    { name: 'Margherita Pizza', price: 399, category: 'main' },
    { name: 'Peperoncino Pasta', price: 299, category: 'main' },
    { name: 'Chicken Gratin', price: 499, category: 'main' },
    { name: 'Mixed Grill Plate', price: 599, category: 'main' },
    { name: 'Drink Bar', price: 199, category: 'drink' },
    { name: 'House Wine (Glass)', price: 100, category: 'drink' },
    { name: 'Tiramisu', price: 299, category: 'dessert' },
    { name: 'Corn Soup', price: 149, category: 'side' },
    { name: 'Garden Salad', price: 299, category: 'side' },
  ],
  r2: [
    { name: 'Kake Soba', price: 380, category: 'main' },
    { name: 'Kakiage Soba', price: 420, category: 'main' },
    { name: 'Tempura Udon', price: 450, category: 'main' },
    { name: 'Kitsune Soba', price: 420, category: 'main' },
    { name: 'Nikujiru Soba', price: 480, category: 'main' },
    { name: 'Cold Zaru Soba', price: 400, category: 'main', tag: 'Summer' },
    { name: 'Curry Rice', price: 450, category: 'main' },
    { name: 'Raw Egg', price: 70, category: 'side' },
    { name: 'Inari (2pc)', price: 120, category: 'side' },
  ],
  r22: [
    { name: 'Pan-fried Gyoza (6pc)', price: 260, category: 'main' },
    { name: 'Pan-fried Gyoza (12pc)', price: 510, category: 'main' },
    { name: 'Fried Rice (Regular)', price: 490, category: 'main' },
    { name: 'Stamina Ramen', price: 580, category: 'main' },
    { name: 'Tenshin-han', price: 520, category: 'main' },
    { name: 'Mapo Tofu', price: 520, category: 'main' },
    { name: 'Gyoza + Fried Rice Set', price: 680, category: 'set_meal', isLunchSpecial: true },
    { name: 'Draft Beer', price: 490, category: 'drink' },
  ],
  r28: [
    { name: 'Yakitori Negima (2pc)', price: 360, category: 'main' },
    { name: 'Yakitori Tsukune (2pc)', price: 360, category: 'main' },
    { name: 'Karaage', price: 360, category: 'main' },
    { name: 'Edamame', price: 360, category: 'side' },
    { name: 'Cabbage Salad', price: 360, category: 'side' },
    { name: 'Rice Ball (Onigiri)', price: 360, category: 'side' },
    { name: 'Fries', price: 360, category: 'side' },
    { name: 'Draft Beer (Medium)', price: 360, category: 'drink' },
    { name: 'Highball', price: 360, category: 'drink' },
    { name: 'Soft Drink', price: 360, category: 'drink' },
  ],
  r9: [
    { name: 'Grilled Mackerel Set', price: 780, category: 'set_meal' },
    { name: 'Ginger Pork Set', price: 730, category: 'set_meal' },
    { name: 'Mixed Grill Set', price: 880, category: 'set_meal' },
    { name: 'Chicken Nanban Set', price: 820, category: 'set_meal' },
    { name: 'Salmon Set', price: 830, category: 'set_meal' },
    { name: 'Extra Rice', price: 0, category: 'side', tag: 'Free Refill' },
    { name: 'Miso Soup Refill', price: 0, category: 'side', tag: 'Free Refill' },
  ],
  r14: [
    { name: 'Loin Katsu Set', price: 550, category: 'set_meal' },
    { name: 'Chicken Katsu Set', price: 500, category: 'set_meal' },
    { name: 'Katsu Curry', price: 650, category: 'main' },
    { name: 'Hire Katsu Set', price: 650, category: 'set_meal' },
    { name: 'Mixed Katsu Set', price: 750, category: 'set_meal' },
    { name: 'Rice Refill', price: 0, category: 'side', tag: 'Free' },
    { name: 'Cabbage Refill', price: 0, category: 'side', tag: 'Free' },
    { name: 'Miso Refill', price: 0, category: 'side', tag: 'Free' },
  ],
};
