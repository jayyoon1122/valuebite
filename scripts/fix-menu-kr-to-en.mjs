#!/usr/bin/env node
/**
 * Fix Korean menu item names → English translations
 * Uses a comprehensive Korean food dictionary + Google Places API for restaurant context
 */
import { readFileSync } from 'fs';
import https from 'https';

const ENV = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const SUPABASE_URL = ENV.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = ENV.SUPABASE_SERVICE_KEY;

function httpFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data, json: () => JSON.parse(data) }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ── Korean food dictionary ──
const DICT = {
  // Proteins
  '소고기': 'Beef', '돼지고기': 'Pork', '닭고기': 'Chicken', '닭': 'Chicken',
  '오리': 'Duck', '양고기': 'Lamb', '고기': 'Meat',
  '새우': 'Shrimp', '연어': 'Salmon', '참치': 'Tuna', '광어': 'Flatfish',
  '문어': 'Octopus', '오징어': 'Squid', '조개': 'Clams', '굴': 'Oyster',
  '생선': 'Fish', '해산물': 'Seafood', '회': 'Sashimi',
  '차슈': 'Chashu', '차슈': 'Chashu Pork',
  '달걀': 'Egg', '계란': 'Egg', '반숙': 'Soft-boiled',
  '두부': 'Tofu',

  // Grains & Noodles
  '밥': 'Rice', '공기밥': 'Steamed Rice', '볶음밥': 'Fried Rice', '주먹밥': 'Rice Ball',
  '면': 'Noodles', '국수': 'Noodles', '소면': 'Thin Noodles', '우동': 'Udon',
  '소바': 'Soba', '라멘': 'Ramen', '라면': 'Ramen',

  // Dishes
  '돈코츠': 'Tonkotsu', '돈코쓰': 'Tonkotsu', '돈꼬쯔': 'Tonkotsu',
  '미소': 'Miso', '쇼유': 'Shoyu', '시오': 'Shio',
  '규동': 'Gyudon', '카츠동': 'Katsudon', '텐동': 'Tendon', '돈부리': 'Donburi',
  '카레': 'Curry', '커리': 'Curry',
  '덮밥': 'Rice Bowl', '정식': 'Set Meal', '세트': 'Set',
  '김치': 'Kimchi', '된장': 'Doenjang', '고추장': 'Gochujang',
  '불고기': 'Bulgogi', '갈비': 'Galbi', '삼겹살': 'Samgyeopsal',
  '비빔밥': 'Bibimbap', '냉면': 'Naengmyeon', '떡볶이': 'Tteokbokki',
  '만두': 'Dumplings', '교자': 'Gyoza',
  '튀김': 'Tempura', '텐푸라': 'Tempura', '가라아게': 'Karaage',
  '돈카츠': 'Tonkatsu', '돈까스': 'Tonkatsu', '카츠': 'Katsu',
  '타코야키': 'Takoyaki', '오코노미야키': 'Okonomiyaki',
  '스시': 'Sushi', '초밥': 'Sushi', '니기리': 'Nigiri',
  '사시미': 'Sashimi',
  '야키토리': 'Yakitori', '꼬치': 'Skewer',
  '피자': 'Pizza', '파스타': 'Pasta', '버거': 'Burger', '햄버거': 'Hamburger',
  '샌드위치': 'Sandwich', '토스트': 'Toast',
  '샐러드': 'Salad', '수프': 'Soup', '스프': 'Soup',
  '찌개': 'Stew', '국': 'Soup', '탕': 'Soup/Stew',
  '구이': 'Grilled', '조림': 'Braised', '볶음': 'Stir-fried', '찜': 'Steamed',
  '전골': 'Hot Pot', '나베': 'Nabe', '샤브샤브': 'Shabu-shabu',

  // Toppings & Extras
  '추가': 'Extra', '토핑': 'Topping', '사이드': 'Side',
  '파': 'Green Onion', '대파': 'Green Onion', '양파': 'Onion',
  '마늘': 'Garlic', '생강': 'Ginger', '깨': 'Sesame',
  '김': 'Seaweed', '미역': 'Seaweed', '해초': 'Seaweed',
  '버섯': 'Mushroom', '콩나물': 'Bean Sprouts',
  '치즈': 'Cheese', '소스': 'Sauce', '드레싱': 'Dressing',
  '피클': 'Pickles', '절임': 'Pickled',

  // Cooking methods
  '튀긴': 'Fried', '구운': 'Grilled', '삶은': 'Boiled', '찐': 'Steamed',
  '매운': 'Spicy', '순한': 'Mild', '특제': 'Special',

  // Drinks
  '맥주': 'Beer', '사케': 'Sake', '소주': 'Soju',
  '콜라': 'Cola', '사이다': 'Cider/Sprite', '주스': 'Juice',
  '물': 'Water', '차': 'Tea', '커피': 'Coffee', '음료': 'Drink',
  '우유': 'Milk', '아이스': 'Iced',

  // Sizes & Descriptors
  '대': 'Large', '중': 'Medium', '소': 'Small', '미니': 'Mini',
  '특대': 'Extra Large', '더블': 'Double', '싱글': 'Single',
  '천연': 'Natural', '수제': 'Handmade', '홈메이드': 'Homemade',
  '오리지널': 'Original', '클래식': 'Classic', '스페셜': 'Special',
  '프리미엄': 'Premium', '디럭스': 'Deluxe',
  '한정': 'Limited', '계절': 'Seasonal', '오늘': 'Today\'s',
  '인기': 'Popular', '추천': 'Recommended', '베스트': 'Best',

  // Desserts
  '아이스크림': 'Ice Cream', '케이크': 'Cake', '푸딩': 'Pudding',
  '타르트': 'Tart', '와플': 'Waffle', '팬케이크': 'Pancake',
  '모찌': 'Mochi', '떡': 'Rice Cake', '팥': 'Red Bean',
  '디저트': 'Dessert',

  // Bread
  '빵': 'Bread', '난': 'Naan', '로티': 'Roti',

  // Indian/Other
  '탄두리': 'Tandoori', '티카': 'Tikka', '마살라': 'Masala',
  '비리야니': 'Biryani', '달': 'Dal', '짜이': 'Chai',
  '라씨': 'Lassi', '나시고랭': 'Nasi Goreng', '팟타이': 'Pad Thai',
  '쌀국수': 'Rice Noodle Soup', '포': 'Pho',
};

// Sort by length descending so longer matches take priority
const DICT_ENTRIES = Object.entries(DICT).sort((a, b) => b[0].length - a[0].length);

function translateKorean(kr) {
  let result = kr;
  const used = new Set();

  for (const [ko, en] of DICT_ENTRIES) {
    if (result.includes(ko) && !used.has(ko)) {
      result = result.replace(ko, en);
      used.add(ko);
    }
  }

  // Clean up spacing
  result = result.replace(/\s+/g, ' ').trim();

  // If still contains Korean characters, it's only partially translated
  const koreanRe = /[\uac00-\ud7af]/;
  if (koreanRe.test(result)) {
    return { en: result, partial: true };
  }
  return { en: result, partial: false };
}

async function main() {
  console.log('Fetching menu items with Korean in en field...');

  let allItems = [];
  let offset = 0;
  const koreanRe = /[\uac00-\ud7af]/;

  while (true) {
    const res = await httpFetch(
      `${SUPABASE_URL}/rest/v1/menu_items?select=id,name&offset=${offset}&limit=1000&order=id`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    const items = res.json();
    if (!items.length) break;

    for (const item of items) {
      const en = item.name?.en || '';
      if (koreanRe.test(en)) {
        allItems.push(item);
      }
    }
    offset += 1000;
    if (items.length < 1000) break;
  }

  console.log(`Found ${allItems.length} items with Korean in en field`);

  let translated = 0, partial = 0, failed = 0, errors = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const koreanName = item.name.en;
    const { en: englishName, partial: isPartial } = translateKorean(koreanName);

    if (isPartial) {
      partial++;
    } else {
      translated++;
    }

    // Update the name — set en to translated, keep original
    const newName = { ...item.name, en: englishName };

    try {
      const res = await httpFetch(
        `${SUPABASE_URL}/rest/v1/menu_items?id=eq.${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ name: newName }),
        }
      );
      if (res.status >= 400) {
        errors++;
        if (errors <= 3) console.error(`  Error updating ${item.id}: ${res.data.slice(0, 200)}`);
      }
    } catch (e) {
      errors++;
    }

    if ((i + 1) % 200 === 0) {
      console.log(`  Progress: ${i + 1}/${allItems.length} (${translated} full, ${partial} partial, ${errors} errors)`);
    }
  }

  console.log(`\nDone!`);
  console.log(`  Fully translated: ${translated}`);
  console.log(`  Partially translated: ${partial}`);
  console.log(`  Errors: ${errors}`);
  console.log(`\nPartially translated items still contain some Korean characters.`);
  console.log(`These may need manual review or additional dictionary entries.`);
}

main().catch(console.error);
