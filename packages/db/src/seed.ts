import 'dotenv/config';
import { createDb, countries, priceBrackets, cities } from './index';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://valuebite:dev_password@localhost:5432/valuebite';

async function seed() {
  const db = createDb(DATABASE_URL);
  console.log('Seeding database...');

  // Countries
  const countryData = [
    // Tier 1 — Launch markets
    { code: 'JP', name: { en: 'Japan', ja: '日本', ko: '일본' }, currencyCode: 'JPY', currencySymbol: '¥', defaultLocale: 'ja-JP', timezone: 'Asia/Tokyo', isActive: true },
    { code: 'US', name: { en: 'United States', ja: 'アメリカ', ko: '미국' }, currencyCode: 'USD', currencySymbol: '$', defaultLocale: 'en-US', timezone: 'America/New_York', isActive: true },
    { code: 'GB', name: { en: 'United Kingdom', ja: 'イギリス', ko: '영국' }, currencyCode: 'GBP', currencySymbol: '£', defaultLocale: 'en-GB', timezone: 'Europe/London', isActive: true },
    { code: 'DE', name: { en: 'Germany', ja: 'ドイツ', ko: '독일' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'de-DE', timezone: 'Europe/Berlin', isActive: true },
    { code: 'FR', name: { en: 'France', ja: 'フランス', ko: '프랑스' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'fr-FR', timezone: 'Europe/Paris', isActive: true },
    { code: 'AU', name: { en: 'Australia', ja: 'オーストラリア', ko: '호주' }, currencyCode: 'AUD', currencySymbol: 'A$', defaultLocale: 'en-AU', timezone: 'Australia/Sydney', isActive: true },
    { code: 'CA', name: { en: 'Canada', ja: 'カナダ', ko: '캐나다' }, currencyCode: 'CAD', currencySymbol: 'C$', defaultLocale: 'en-CA', timezone: 'America/Toronto', isActive: true },
    { code: 'AE', name: { en: 'UAE', ja: 'アラブ首長国連邦', ko: 'UAE' }, currencyCode: 'AED', currencySymbol: 'د.إ', defaultLocale: 'en-AE', timezone: 'Asia/Dubai', isActive: true },
    { code: 'SG', name: { en: 'Singapore', ja: 'シンガポール', ko: '싱가포르' }, currencyCode: 'SGD', currencySymbol: 'S$', defaultLocale: 'en-SG', timezone: 'Asia/Singapore', isActive: true },
    { code: 'HK', name: { en: 'Hong Kong', ja: '香港', ko: '홍콩' }, currencyCode: 'HKD', currencySymbol: 'HK$', defaultLocale: 'en-HK', timezone: 'Asia/Hong_Kong', isActive: true },
    { code: 'TW', name: { en: 'Taiwan', ja: '台湾', ko: '대만' }, currencyCode: 'TWD', currencySymbol: 'NT$', defaultLocale: 'zh-TW', timezone: 'Asia/Taipei', isActive: true },
    // Tier 1 — European expansion
    { code: 'NL', name: { en: 'Netherlands', ja: 'オランダ', ko: '네덜란드' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'nl-NL', timezone: 'Europe/Amsterdam', isActive: true },
    { code: 'ES', name: { en: 'Spain', ja: 'スペイン', ko: '스페인' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'es-ES', timezone: 'Europe/Madrid', isActive: true },
    { code: 'IT', name: { en: 'Italy', ja: 'イタリア', ko: '이탈리아' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'it-IT', timezone: 'Europe/Rome', isActive: true },
    { code: 'PT', name: { en: 'Portugal', ja: 'ポルトガル', ko: '포르투갈' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'pt-PT', timezone: 'Europe/Lisbon', isActive: true },
    { code: 'CH', name: { en: 'Switzerland', ja: 'スイス', ko: '스위스' }, currencyCode: 'CHF', currencySymbol: 'CHF', defaultLocale: 'de-CH', timezone: 'Europe/Zurich', isActive: true },
    { code: 'LU', name: { en: 'Luxembourg', ja: 'ルクセンブルク', ko: '룩셈부르크' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'fr-LU', timezone: 'Europe/Luxembourg', isActive: true },
    { code: 'CZ', name: { en: 'Czech Republic', ja: 'チェコ', ko: '체코' }, currencyCode: 'CZK', currencySymbol: 'Kč', defaultLocale: 'cs-CZ', timezone: 'Europe/Prague', isActive: true },
    { code: 'AT', name: { en: 'Austria', ja: 'オーストリア', ko: '오스트리아' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'de-AT', timezone: 'Europe/Vienna', isActive: true },
    { code: 'HU', name: { en: 'Hungary', ja: 'ハンガリー', ko: '헝가리' }, currencyCode: 'HUF', currencySymbol: 'Ft', defaultLocale: 'hu-HU', timezone: 'Europe/Budapest', isActive: true },
    { code: 'PL', name: { en: 'Poland', ja: 'ポーランド', ko: '폴란드' }, currencyCode: 'PLN', currencySymbol: 'zł', defaultLocale: 'pl-PL', timezone: 'Europe/Warsaw', isActive: true },
    { code: 'TR', name: { en: 'Turkey', ja: 'トルコ', ko: '튀르키예' }, currencyCode: 'TRY', currencySymbol: '₺', defaultLocale: 'tr-TR', timezone: 'Europe/Istanbul', isActive: true },
    { code: 'GR', name: { en: 'Greece', ja: 'ギリシャ', ko: '그리스' }, currencyCode: 'EUR', currencySymbol: '€', defaultLocale: 'el-GR', timezone: 'Europe/Athens', isActive: true },
    // Tier 1 — Middle East & Asia expansion
    { code: 'IL', name: { en: 'Israel', ja: 'イスラエル', ko: '이스라엘' }, currencyCode: 'ILS', currencySymbol: '₪', defaultLocale: 'he-IL', timezone: 'Asia/Jerusalem', isActive: true },
    { code: 'QA', name: { en: 'Qatar', ja: 'カタール', ko: '카타르' }, currencyCode: 'QAR', currencySymbol: 'QR', defaultLocale: 'en-QA', timezone: 'Asia/Qatar', isActive: true },
    { code: 'KW', name: { en: 'Kuwait', ja: 'クウェート', ko: '쿠웨이트' }, currencyCode: 'KWD', currencySymbol: 'KD', defaultLocale: 'en-KW', timezone: 'Asia/Kuwait', isActive: true },
    { code: 'IN', name: { en: 'India', ja: 'インド', ko: '인도' }, currencyCode: 'INR', currencySymbol: '₹', defaultLocale: 'en-IN', timezone: 'Asia/Kolkata', isActive: true },
    // Tier 1 — Latin America
    { code: 'MX', name: { en: 'Mexico', ja: 'メキシコ', ko: '멕시코' }, currencyCode: 'MXN', currencySymbol: 'MX$', defaultLocale: 'es-MX', timezone: 'America/Mexico_City', isActive: true },
    // Tier 2 — Future expansion
    { code: 'KR', name: { en: 'South Korea', ja: '韓国', ko: '한국' }, currencyCode: 'KRW', currencySymbol: '₩', defaultLocale: 'ko-KR', timezone: 'Asia/Seoul', isActive: false },
    { code: 'NZ', name: { en: 'New Zealand', ja: 'ニュージーランド', ko: '뉴질랜드' }, currencyCode: 'NZD', currencySymbol: 'NZ$', defaultLocale: 'en-NZ', timezone: 'Pacific/Auckland', isActive: false },
  ];

  const insertedCountries = await db.insert(countries).values(countryData).returning();
  console.log(`Inserted ${insertedCountries.length} countries`);

  // Price Brackets
  const bracketData: Array<{
    countryId: number; purposeKey: string; purposeLabel: Record<string,string>;
    maxPrice: string; icon: string; sortOrder: number;
  }> = [];

  const purposes = [
    // All currencies: JP=JPY, US=USD, GB=GBP, EUR countries, AU=AUD, CA=CAD, AE=AED, SG=SGD, HK=HKD, TW=TWD, CH=CHF, CZ=CZK, HU=HUF, PL=PLN, TR=TRY, IL=ILS, QA=QAR, KW=KWD, IN=INR, MX=MXN, KR=KRW, NZ=NZD
    { key: 'daily_eats', label: { en: 'Daily Eats', ja: '普段の食事' }, icon: '🍱', prices: { JP: '1000', US: '10', GB: '8', DE: '8', FR: '8', NL: '9', ES: '8', IT: '8', PT: '7', LU: '10', AT: '9', GR: '7', AU: '12', CA: '12', AE: '35', SG: '8', HK: '50', TW: '120', CH: '15', CZ: '200', HU: '2500', PL: '30', TR: '200', IL: '40', QA: '25', KW: '2', IN: '300', MX: '150', KR: '7000', NZ: '14' } },
    { key: 'good_value', label: { en: 'Good Value', ja: 'コスパ◎' }, icon: '💰', prices: { JP: '1500', US: '15', GB: '12', DE: '12', FR: '12', NL: '14', ES: '12', IT: '12', PT: '10', LU: '15', AT: '13', GR: '10', AU: '18', CA: '18', AE: '55', SG: '12', HK: '80', TW: '200', CH: '22', CZ: '300', HU: '3500', PL: '45', TR: '300', IL: '60', QA: '40', KW: '3', IN: '500', MX: '250', KR: '10000', NZ: '20' } },
    { key: 'date_night', label: { en: 'Date Night', ja: 'デートの夜' }, icon: '🥂', prices: { JP: '2500', US: '25', GB: '20', DE: '20', FR: '20', NL: '22', ES: '20', IT: '20', PT: '18', LU: '25', AT: '22', GR: '18', AU: '30', CA: '30', AE: '90', SG: '25', HK: '150', TW: '400', CH: '35', CZ: '500', HU: '6000', PL: '80', TR: '500', IL: '100', QA: '70', KW: '5', IN: '800', MX: '400', KR: '20000', NZ: '35' } },
    { key: 'family_dinner', label: { en: 'Family Dinner', ja: '家族ディナー' }, icon: '👨‍👩‍👧‍👦', prices: { JP: '2000', US: '18', GB: '15', DE: '15', FR: '15', NL: '17', ES: '15', IT: '15', PT: '13', LU: '18', AT: '16', GR: '13', AU: '22', CA: '22', AE: '70', SG: '18', HK: '120', TW: '300', CH: '28', CZ: '400', HU: '4500', PL: '60', TR: '400', IL: '80', QA: '55', KW: '4', IN: '600', MX: '300', KR: '15000', NZ: '25' } },
    { key: 'late_night', label: { en: 'Late Night', ja: '夜食' }, icon: '🌙', prices: { JP: '1200', US: '12', GB: '10', DE: '10', FR: '10', NL: '11', ES: '10', IT: '10', PT: '8', LU: '12', AT: '11', GR: '8', AU: '15', CA: '15', AE: '40', SG: '10', HK: '60', TW: '150', CH: '18', CZ: '250', HU: '3000', PL: '35', TR: '250', IL: '45', QA: '30', KW: '2', IN: '350', MX: '180', KR: '8000', NZ: '16' } },
    { key: 'healthy_budget', label: { en: 'Healthy & Budget', ja: 'ヘルシー&節約' }, icon: '🥗', prices: { JP: '1400', US: '14', GB: '11', DE: '11', FR: '11', NL: '13', ES: '11', IT: '11', PT: '9', LU: '14', AT: '12', GR: '9', AU: '17', CA: '17', AE: '45', SG: '11', HK: '70', TW: '180', CH: '20', CZ: '280', HU: '3200', PL: '40', TR: '280', IL: '50', QA: '35', KW: '3', IN: '400', MX: '200', KR: '9000', NZ: '18' } },
    { key: 'group_party', label: { en: 'Group & Party', ja: '宴会' }, icon: '🎉', prices: { JP: '1500', US: '15', GB: '12', DE: '12', FR: '12', NL: '14', ES: '12', IT: '12', PT: '10', LU: '15', AT: '13', GR: '10', AU: '18', CA: '18', AE: '60', SG: '15', HK: '100', TW: '250', CH: '22', CZ: '300', HU: '3500', PL: '45', TR: '300', IL: '60', QA: '40', KW: '3', IN: '500', MX: '250', KR: '12000', NZ: '22' } },
    { key: 'solo_dining', label: { en: 'Solo Dining', ja: 'ひとり飯' }, icon: '🧑‍💻', prices: { JP: '1200', US: '12', GB: '10', DE: '10', FR: '10', NL: '11', ES: '10', IT: '10', PT: '8', LU: '12', AT: '11', GR: '8', AU: '15', CA: '15', AE: '40', SG: '10', HK: '60', TW: '150', CH: '18', CZ: '250', HU: '3000', PL: '35', TR: '250', IL: '45', QA: '30', KW: '2', IN: '350', MX: '180', KR: '8000', NZ: '16' } },
    { key: 'special_occasion', label: { en: 'Special Occasion', ja: '特別な日' }, icon: '🎂', prices: { JP: '5000', US: '50', GB: '40', DE: '40', FR: '40', NL: '45', ES: '40', IT: '40', PT: '35', LU: '50', AT: '45', GR: '35', AU: '60', CA: '60', AE: '180', SG: '50', HK: '300', TW: '800', CH: '70', CZ: '1000', HU: '12000', PL: '150', TR: '1000', IL: '200', QA: '140', KW: '10', IN: '1500', MX: '800', KR: '40000', NZ: '65' } },
  ];

  for (const country of insertedCountries) {
    purposes.forEach((p, i) => {
      bracketData.push({
        countryId: country.id,
        purposeKey: p.key,
        purposeLabel: p.label,
        maxPrice: p.prices[country.code as keyof typeof p.prices] || p.prices.US,
        icon: p.icon,
        sortOrder: i,
      });
    });
  }

  await db.insert(priceBrackets).values(bracketData);
  console.log(`Inserted ${bracketData.length} price brackets`);

  // Cities
  const cc = (code: string) => insertedCountries.find(c => c.code === code)?.id;

  const cityData = [
    // ===== JAPAN =====
    { countryId: cc('JP')!, name: { en: 'Tokyo', ja: '東京' }, lat: 35.6762, lng: 139.6503, isActive: true },
    { countryId: cc('JP')!, name: { en: 'Osaka', ja: '大阪' }, lat: 34.6937, lng: 135.5023, isActive: true },
    { countryId: cc('JP')!, name: { en: 'Kyoto', ja: '京都' }, lat: 35.0116, lng: 135.7681, isActive: true },
    { countryId: cc('JP')!, name: { en: 'Fukuoka', ja: '福岡' }, lat: 33.5904, lng: 130.4017, isActive: false },

    // ===== UNITED STATES (major metros + fast-growing Sun Belt) =====
    { countryId: cc('US')!, name: { en: 'New York City' }, lat: 40.7128, lng: -74.0060, isActive: true },
    { countryId: cc('US')!, name: { en: 'Los Angeles' }, lat: 34.0522, lng: -118.2437, isActive: true },
    { countryId: cc('US')!, name: { en: 'Chicago' }, lat: 41.8781, lng: -87.6298, isActive: true },
    { countryId: cc('US')!, name: { en: 'San Francisco' }, lat: 37.7749, lng: -122.4194, isActive: true },
    { countryId: cc('US')!, name: { en: 'Miami' }, lat: 25.7617, lng: -80.1918, isActive: true },
    { countryId: cc('US')!, name: { en: 'Austin' }, lat: 30.2672, lng: -97.7431, isActive: true },
    { countryId: cc('US')!, name: { en: 'Boston' }, lat: 42.3601, lng: -71.0589, isActive: true },
    { countryId: cc('US')!, name: { en: 'Houston' }, lat: 29.7604, lng: -95.3698, isActive: true },
    { countryId: cc('US')!, name: { en: 'Seattle' }, lat: 47.6062, lng: -122.3321, isActive: true },
    { countryId: cc('US')!, name: { en: 'Washington DC' }, lat: 38.9072, lng: -77.0369, isActive: true },
    // Fast-growing regional centers
    { countryId: cc('US')!, name: { en: 'Denver' }, lat: 39.7392, lng: -104.9903, isActive: true },
    { countryId: cc('US')!, name: { en: 'Nashville' }, lat: 36.1627, lng: -86.7816, isActive: true },
    { countryId: cc('US')!, name: { en: 'Atlanta' }, lat: 33.7490, lng: -84.3880, isActive: true },
    { countryId: cc('US')!, name: { en: 'Dallas' }, lat: 32.7767, lng: -96.7970, isActive: true },
    { countryId: cc('US')!, name: { en: 'Phoenix' }, lat: 33.4484, lng: -112.0740, isActive: true },
    { countryId: cc('US')!, name: { en: 'San Diego' }, lat: 32.7157, lng: -117.1611, isActive: true },
    { countryId: cc('US')!, name: { en: 'Philadelphia' }, lat: 39.9526, lng: -75.1652, isActive: true },
    { countryId: cc('US')!, name: { en: 'Charlotte' }, lat: 35.2271, lng: -80.8431, isActive: true },
    { countryId: cc('US')!, name: { en: 'Raleigh' }, lat: 35.7796, lng: -78.6382, isActive: true },
    { countryId: cc('US')!, name: { en: 'Salt Lake City' }, lat: 40.7608, lng: -111.8910, isActive: true },

    // ===== UNITED KINGDOM =====
    { countryId: cc('GB')!, name: { en: 'London' }, lat: 51.5074, lng: -0.1278, isActive: true },
    { countryId: cc('GB')!, name: { en: 'Manchester' }, lat: 53.4808, lng: -2.2426, isActive: true },
    { countryId: cc('GB')!, name: { en: 'Edinburgh' }, lat: 55.9533, lng: -3.1883, isActive: false },

    // ===== GERMANY =====
    { countryId: cc('DE')!, name: { en: 'Berlin' }, lat: 52.5200, lng: 13.4050, isActive: true },
    { countryId: cc('DE')!, name: { en: 'Munich' }, lat: 48.1351, lng: 11.5820, isActive: true },
    { countryId: cc('DE')!, name: { en: 'Frankfurt' }, lat: 50.1109, lng: 8.6821, isActive: true },

    // ===== FRANCE =====
    { countryId: cc('FR')!, name: { en: 'Paris' }, lat: 48.8566, lng: 2.3522, isActive: true },

    // ===== NETHERLANDS =====
    { countryId: cc('NL')!, name: { en: 'Amsterdam' }, lat: 52.3676, lng: 4.9041, isActive: true },

    // ===== SPAIN =====
    { countryId: cc('ES')!, name: { en: 'Madrid' }, lat: 40.4168, lng: -3.7038, isActive: true },
    { countryId: cc('ES')!, name: { en: 'Barcelona' }, lat: 41.3874, lng: 2.1686, isActive: true },

    // ===== PORTUGAL =====
    { countryId: cc('PT')!, name: { en: 'Lisbon' }, lat: 38.7223, lng: -9.1393, isActive: true },

    // ===== ITALY =====
    { countryId: cc('IT')!, name: { en: 'Rome' }, lat: 41.9028, lng: 12.4964, isActive: true },
    { countryId: cc('IT')!, name: { en: 'Milan' }, lat: 45.4642, lng: 9.1900, isActive: true },

    // ===== SWITZERLAND =====
    { countryId: cc('CH')!, name: { en: 'Zurich' }, lat: 47.3769, lng: 8.5417, isActive: true },
    { countryId: cc('CH')!, name: { en: 'Geneva' }, lat: 46.2044, lng: 6.1432, isActive: true },

    // ===== LUXEMBOURG =====
    { countryId: cc('LU')!, name: { en: 'Luxembourg City' }, lat: 49.6116, lng: 6.1319, isActive: true },

    // ===== CZECH REPUBLIC =====
    { countryId: cc('CZ')!, name: { en: 'Prague' }, lat: 50.0755, lng: 14.4378, isActive: true },

    // ===== AUSTRIA =====
    { countryId: cc('AT')!, name: { en: 'Vienna' }, lat: 48.2082, lng: 16.3738, isActive: true },

    // ===== HUNGARY =====
    { countryId: cc('HU')!, name: { en: 'Budapest' }, lat: 47.4979, lng: 19.0402, isActive: true },

    // ===== POLAND =====
    { countryId: cc('PL')!, name: { en: 'Warsaw' }, lat: 52.2297, lng: 21.0122, isActive: true },

    // ===== TURKEY =====
    { countryId: cc('TR')!, name: { en: 'Istanbul' }, lat: 41.0082, lng: 28.9784, isActive: true },

    // ===== GREECE =====
    { countryId: cc('GR')!, name: { en: 'Athens' }, lat: 37.9838, lng: 23.7275, isActive: true },

    // ===== AUSTRALIA =====
    { countryId: cc('AU')!, name: { en: 'Sydney' }, lat: -33.8688, lng: 151.2093, isActive: true },
    { countryId: cc('AU')!, name: { en: 'Melbourne' }, lat: -37.8136, lng: 144.9631, isActive: true },

    // ===== CANADA =====
    { countryId: cc('CA')!, name: { en: 'Toronto' }, lat: 43.6532, lng: -79.3832, isActive: true },
    { countryId: cc('CA')!, name: { en: 'Vancouver' }, lat: 49.2827, lng: -123.1207, isActive: true },
    { countryId: cc('CA')!, name: { en: 'Montreal' }, lat: 45.5017, lng: -73.5673, isActive: false },

    // ===== UAE =====
    { countryId: cc('AE')!, name: { en: 'Dubai' }, lat: 25.2048, lng: 55.2708, isActive: true },
    { countryId: cc('AE')!, name: { en: 'Abu Dhabi' }, lat: 24.4539, lng: 54.3773, isActive: true },

    // ===== SINGAPORE =====
    { countryId: cc('SG')!, name: { en: 'Singapore' }, lat: 1.3521, lng: 103.8198, isActive: true },

    // ===== HONG KONG =====
    { countryId: cc('HK')!, name: { en: 'Hong Kong' }, lat: 22.3193, lng: 114.1694, isActive: true },

    // ===== TAIWAN =====
    { countryId: cc('TW')!, name: { en: 'Taipei' }, lat: 25.0330, lng: 121.5654, isActive: true },

    // ===== ISRAEL =====
    { countryId: cc('IL')!, name: { en: 'Tel Aviv' }, lat: 32.0853, lng: 34.7818, isActive: true },

    // ===== QATAR =====
    { countryId: cc('QA')!, name: { en: 'Doha' }, lat: 25.2854, lng: 51.5310, isActive: true },

    // ===== KUWAIT =====
    { countryId: cc('KW')!, name: { en: 'Kuwait City' }, lat: 29.3759, lng: 47.9774, isActive: true },

    // ===== INDIA =====
    { countryId: cc('IN')!, name: { en: 'Mumbai' }, lat: 19.0760, lng: 72.8777, isActive: true },

    // ===== MEXICO =====
    { countryId: cc('MX')!, name: { en: 'Mexico City' }, lat: 19.4326, lng: -99.1332, isActive: true },
    { countryId: cc('MX')!, name: { en: 'Cancun' }, lat: 21.1619, lng: -86.8515, isActive: true },
  ];

  const insertedCities = await db.insert(cities).values(cityData).returning();
  console.log(`Inserted ${insertedCities.length} cities`);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
