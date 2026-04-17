#!/usr/bin/env node
/**
 * Translate Korean cuisine_type values to English in Supabase
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

// Korean → English cuisine mapping
const KR_TO_EN = {
  // Common
  '멕시칸': 'Mexican', '피자': 'Pizza', '햄버거': 'Burger', '라멘': 'Ramen',
  '스시': 'Sushi', '우동': 'Udon', '소바': 'Soba', '교자': 'Gyoza',
  '딤섬': 'Dim Sum', '파스타': 'Pasta', '카레': 'Curry', '디저트': 'Dessert',
  '베이커리': 'Bakery', '샌드위치': 'Sandwich', '핫도그': 'Hot Dog',
  '베이글': 'Bagel', '도넛': 'Donut', '바비큐': 'BBQ', '해산물': 'Seafood',
  '만두': 'Dumplings', '콘지': 'Congee', '국수': 'Noodles', '떡': 'Rice Cake',

  // By country
  '한국 요리': 'Korean', '중국 요리': 'Chinese', '일본 요리': 'Japanese',
  '태국 요리': 'Thai', '베트남': 'Vietnamese', '베트남 요리': 'Vietnamese',
  '인도': 'Indian', '인도 요리': 'Indian', '인도 커리': 'Indian Curry',
  '인도 카레': 'Indian Curry', '인도 다이닝': 'Indian Dining',
  '말레이시아': 'Malaysian', '말레이시아 요리': 'Malaysian',
  '대만 요리': 'Taiwanese', '대만식 요리': 'Taiwanese', '대만식': 'Taiwanese',
  '필리핀 요리': 'Filipino', '네팔 요리': 'Nepalese',
  '쿠바': 'Cuban', '쿠바 요리': 'Cuban', '페루 요리': 'Peruvian',
  '브라질': 'Brazilian', '그리스': 'Greek', '폴란드': 'Polish',
  '이탈리안': 'Italian', '이탈리아 요리': 'Italian',
  '프랜차이즈': 'Chain', '패스트푸드': 'Fast Food',
  '우크라이나': 'Ukrainian', '에티오피아': 'Ethiopian',
  '나이지리아': 'Nigerian', '스리랑카 요리': 'Sri Lankan',
  '페루 요리': 'Peruvian',

  // Japanese specifics
  '돈코츠 라멘': 'Tonkotsu Ramen', '규카츠': 'Gyukatsu', '돈카츠': 'Tonkatsu',
  '규동': 'Gyudon', '텐동': 'Tendon', '야키토리': 'Yakitori',
  '회전초밥': 'Conveyor Belt Sushi', '카이센동': 'Kaisendon',
  '츠케멘': 'Tsukemen', '오코노미야키': 'Okonomiyaki',
  '야키니쿠': 'Yakiniku', '오야코동': 'Oyakodon', '쿠시카츠': 'Kushikatsu',
  '가츠동': 'Katsudon', '함바그': 'Hamburg Steak', '스키야키': 'Sukiyaki',
  '샤부샤부': 'Shabu-shabu', '오무라이스': 'Omurice', '경양식': 'Yoshoku',
  '장어덮밥': 'Unagi Don', '장어 구이': 'Grilled Eel',
  '주먹밥': 'Onigiri', '텐동 (튀김덮밥)': 'Tempura Don',
  '카이센동(덮밥)': 'Kaisendon', '고기 덮밥': 'Meat Bowl',
  '우설 정식': 'Beef Tongue Set', '우설 구이': 'Grilled Beef Tongue', '우설': 'Beef Tongue',
  '서서먹는 스시': 'Standing Sushi', '스시 오마카세': 'Sushi Omakase',
  '스시 무한리필': 'All-You-Can-Eat Sushi', '가성비 오마카세': 'Budget Omakase',
  '넓적 우동': 'Flat Udon', '소금 라멘': 'Shio Ramen',
  '탄탄멘': 'Tantanmen', '비빔 라멘': 'Mazesoba', '니보시 라멘': 'Niboshi Ramen',
  '멘치카츠': 'Menchikatsu', '레몬 라멘': 'Lemon Ramen',
  '트러플 라멘': 'Truffle Ramen', '유즈라멘': 'Yuzu Ramen',
  '아부라소바': 'Abura Soba', '랍스터 라멘': 'Lobster Ramen',
  '해산물 이자카야': 'Seafood Izakaya', '생선구이': 'Grilled Fish',
  '이나니와 우동': 'Inaniwa Udon', '나폴리 피자': 'Neapolitan Pizza',
  '교자 (만두)': 'Gyoza', '츠케멘/라멘': 'Tsukemen / Ramen',
  '규동/우동': 'Gyudon / Udon', '돈카츠/카레': 'Tonkatsu / Curry',
  '소바/우동': 'Soba / Udon', '서서먹는 소바': 'Standing Soba',
  '일본식 카레': 'Japanese Curry', '일본식 경양식': 'Yoshoku',
  '일본식 백반': 'Japanese Set Meal', '일본식 베이커리': 'Japanese Bakery',
  '수제 햄버거': 'Gourmet Burger', '화덕 피자': 'Wood-Fired Pizza',
  '500엔 피자': 'Budget Pizza', '인도식 바': 'Indian Bar',
  '일식 (정식)': 'Japanese Set Meal',
  '야키토리 덮밥': 'Yakitori Don', '성게알 덮밥': 'Uni Don',
  '중화 라멘': 'Chinese-style Ramen', '우설/정식': 'Beef Tongue Set',
  '고로케/육류': 'Croquette / Meat', '돼지덮밥': 'Pork Bowl',
  '지로 라멘': 'Jiro Ramen', '비건 라멘': 'Vegan Ramen',
  '혁신 라멘': 'Creative Ramen', '싱가포르식 라멘': 'Singapore Ramen',
  '나베/이자카야': 'Nabe / Izakaya', '샤브 무한리필': 'All-You-Can-Eat Shabu',
  '덴푸라': 'Tempura', '반미 (샌드위치)': 'Banh Mi',
  '가이세키/정식': 'Kaiseki Set', '스테이크동': 'Steak Don',
  '베이커리/브런치': 'Bakery / Brunch', '베이커리/카페': 'Bakery / Cafe',

  // Singapore / HK specifics
  '차찬텡': 'Cha Chaan Teng', '홍콩 차찬텡': 'HK Cha Chaan Teng',
  '다이파이동': 'Dai Pai Dong', '완탕면': 'Wonton Noodles',
  '로스트 미트': 'Roast Meats', '치킨 라이스': 'Chicken Rice',
  '차퀘이테오': 'Char Kway Teow', '쯔차 (Tze Char)': 'Tze Char',
  '카트 누들': 'Cart Noodles', '새우 국수': 'Prawn Noodles',
  '나시 레막': 'Nasi Lemak', '바초미': 'Bak Chor Mee',
  '피쉬볼 누들': 'Fishball Noodles', '호키엔미': 'Hokkien Mee',
  '바쿠테': 'Bak Kut Teh', '락사': 'Laksa', '로티 프라타': 'Roti Prata',
  '사테': 'Satay', '브리야니': 'Biryani', '클레이팟 라이스': 'Claypot Rice',
  '로미 (Lor Mee)': 'Lor Mee', '윈난 쌀국수': 'Yunnan Rice Noodles',
  '뽀짜이판': 'Bo Zai Fan', '퀘이찹': 'Kway Chap', '거리 음식': 'Street Food',
  '성전바오': 'Steamed Bao', '카톡 락사': 'Katong Laksa',
  '소이 소스 치킨': 'Soy Sauce Chicken', '커리 퍼프': 'Curry Puff',
  'BBQ 씨푸드': 'BBQ Seafood', '소고기 국수': 'Beef Noodles',
  '쇠고기 국수': 'Beef Noodles', '피쉬볼 국수': 'Fishball Noodles',
  '대만식 요리': 'Taiwanese', '길거리 스낵': 'Street Snacks',
  '카야 토스트': 'Kaya Toast', '전통 카야 토스트': 'Kaya Toast',
  '로작': 'Rojak', '인도식 로작': 'Indian Rojak', '전통 디저트': 'Traditional Dessert',
  '퓨전 디저트': 'Fusion Dessert', '우육면': 'Beef Noodle Soup',
  '콘지/면': 'Congee / Noodles', '개구리 죽': 'Frog Porridge',
  '커리 치킨 누들': 'Curry Chicken Noodles', '대나무면': 'Bamboo Noodles',
  '콘지 (죽)': 'Congee', '츄이쿠에': 'Chwee Kueh',
  '나시 파당': 'Nasi Padang', '피쉬 수프': 'Fish Soup',
  '오이스터 오믈렛': 'Oyster Omelette', '남인도 채식': 'South Indian Vegetarian',

  // Multi-word Korean cuisine descriptions
  '멕시칸 (타코)': 'Mexican Tacos', '멕시칸 (해산물)': 'Mexican Seafood',
  '멕시칸 (푸드트럭)': 'Mexican Food Truck', '멕시칸 (비리아)': 'Mexican Birria',
  '멕시칸 (오아하카)': 'Mexican Oaxacan', '멕시칸 (패스트캐주얼)': 'Mexican Fast Casual',
  '멕시칸 (유카탄)': 'Mexican Yucatan', '멕시칸 (유카스)': 'Mexican Yucas',
  '멕시칸 (퓨전 타코)': 'Fusion Tacos', '멕시칸 (노점 타코)': 'Street Tacos',
  '멕시칸 (하드쉘 타코)': 'Mexican Hard Shell Tacos',
  '멕시칸 (올베라 거리)': 'Mexican (Olvera St)', '멕시칸 (그랜드 센트럴)': 'Mexican (Grand Central)',
  '멕시칸 요리': 'Mexican', '멕시칸 부리또': 'Mexican Burrito',
  '아메리칸 (버거)': 'American Burger', '아메리칸 (다이너)': 'American Diner',
  '아메리칸 (샌드위치)': 'American Sandwich', '아메리칸 (핫치킨)': 'Hot Chicken',
  '아메리칸 (BBQ)': 'American BBQ', '아메리칸 (핫도그)': 'Hot Dog',
  '아메리칸 (치킨)': 'Fried Chicken', '아메리칸 (소울푸드)': 'Soul Food',
  '아메리칸 (소시지)': 'American Sausage', '아메리칸 (패스트캐주얼)': 'Fast Casual',
  '아메리칸 (프라이드 치킨)': 'Fried Chicken', '아메리칸 (파스트라미)': 'Pastrami',
  '아메리칸 (버거/다이너)': 'American Diner', '아메리칸 (핫도그/버거)': 'Hot Dog / Burger',
  '아메리칸 (버거/파이)': 'Burger / Pie', '아메리칸': 'American',
  '아메리칸/카페': 'American / Cafe', '아메리칸 다이너': 'American Diner',
  '중식 (BBQ)': 'Chinese BBQ', '중식 (만두)': 'Chinese Dumplings',
  '중식 (면)': 'Chinese Noodles', '중식 (수타면)': 'Hand-Pulled Noodles',
  '중식 (창펀)': 'Cheung Fun', '중식 (광둥식 창펀)': 'Cantonese Cheung Fun',
  '중식 (홍콩식)': 'Hong Kong Chinese', '중식 (푸저우)': 'Fuzhou Chinese',
  '중식 (두부/디저트)': 'Tofu Dessert', '중식 (해산물/면)': 'Chinese Seafood Noodles',
  '중식 (베이커리)': 'Chinese Bakery', '중식 (상하이 딤섬)': 'Shanghai Dim Sum',
  '중식 (쓰촨성)': 'Sichuan', '중식 (광둥식 면)': 'Cantonese Noodles',
  '중식 (쓰촨성 만두)': 'Sichuan Dumplings', '중식 (딤섬)': 'Dim Sum',
  '중식 (허난성)': 'Henan Chinese', '중화요리': 'Chinese',
  '중동': 'Middle Eastern', '중동 요리': 'Middle Eastern',
  '중동 (할랄)': 'Halal Middle Eastern', '중동 (할랄 카트)': 'Halal Cart',
  '지중해/중동': 'Mediterranean / Middle Eastern', '지중해 요리': 'Mediterranean',
  '텍스멕스': 'Tex-Mex', '프라이드 치킨': 'Fried Chicken',
  '일본 (라멘)': 'Japanese Ramen', '일본 (카레)': 'Japanese Curry',
  '일본 (우동)': 'Japanese Udon', '일본 (핸드롤)': 'Hand Roll',
  '일본 (가정식)': 'Japanese Home Cooking', '일본 (초밥/사시미)': 'Sushi & Sashimi',
  '일본 (경양식/라멘)': 'Yoshoku / Ramen', '일본 (초시/롤)': 'Sushi Roll',
  '일본 (초밥)': 'Sushi', '일본 (회전초밥)': 'Conveyor Belt Sushi',
  '일본 (샌드위치)': 'Japanese Sandwich',
  '한국 (분식)': 'Korean Snacks', '한국식 중화요리': 'Korean-Chinese',
  '한국식 돈까스': 'Korean Tonkatsu', '한국 (프라이드 치킨)': 'Korean Fried Chicken',
  '한식 (델리)': 'Korean Deli', '한식 (김밥)': 'Korean Kimbap', '한식 (분식)': 'Korean Snacks',
  '한국/멕시칸 퓨전': 'Korean-Mexican Fusion', '한국 요리 (명인만두)': 'Korean Dumplings',
  '인도 (스트리트)': 'Indian Street Food', '인도 (남인도)': 'South Indian',
  '인도 (프랭키)': 'Indian Frankie', '인도 요리 (채식)': 'Indian Vegetarian',
  '인도/파키스탄 요리': 'Indian / Pakistani', '인도 채식 뷔페': 'Indian Veg Buffet',
  '남인도 (스트리트 벤더)': 'South Indian Street Food',
  '이탈리안 델리': 'Italian Deli', '이탈리안 샌드위치': 'Italian Sandwich',
  '이탈리안 (샌드위치)': 'Italian Sandwich', '이탈리안 (나폴리 피자)': 'Neapolitan Pizza',
  '이탈리안 (생파스타)': 'Fresh Pasta', '이탈리안 (파스타)': 'Italian Pasta',
  '이탈리안 파스타': 'Italian Pasta',
  '유대인 베이커리': 'Jewish Bakery', '유대인 코셔': 'Jewish Kosher', '유대인 델리': 'Jewish Deli',
  '델리 (샌드위치)': 'Deli Sandwich', '델리 샌드위치': 'Deli Sandwich',
  '다이너/샌드위치': 'Diner / Sandwich', '다이너 (Diner)': 'Diner', '다이너 햄버거': 'Diner Burger',
  '남미 (엠파나다)': 'Empanadas', '베네수엘라': 'Venezuelan',
  '콜롬비아 (아레파)': 'Colombian Arepa', '콜롬비아 (엠파나다)': 'Colombian Empanada',
  '가성비 피자': 'Budget Pizza', '피자 (점보 슬라이스)': 'Jumbo Slice Pizza',
  '피자 (스위트 소스)': 'Sweet Sauce Pizza', '피자 (나폴리식)': 'Neapolitan Pizza',
  '피자 (로만 스타일)': 'Roman Style Pizza', '피자 (NY 스타일)': 'NY Style Pizza',
  '피자/디저트': 'Pizza / Dessert', '피자 / 이탈리안 아이스': 'Pizza / Italian Ice',
  '캐주얼 피자': 'Casual Pizza',
  '도미니카 공화국': 'Dominican', '푸에르토리코': 'Puerto Rican', '푸에르토리코 요리': 'Puerto Rican',
  '하와이안 요리': 'Hawaiian', '쿠바 요리': 'Cuban', '쿠바/멕시칸': 'Cuban / Mexican',
  '쿠바 요리 / 베이커리': 'Cuban / Bakery',
  '자메이카 (바비큐)': 'Jamaican BBQ', '트리니다드 토바고': 'Trinidadian',
  '페루 (로티세리 치킨)': 'Peruvian Rotisserie', '페루 (해산물)': 'Peruvian Seafood',
  '치킨 텐더': 'Chicken Tenders', '인도식 치킨': 'Indian Chicken',
  '벨기에식 감자튀김': 'Belgian Fries', '벨기에 와플': 'Belgian Waffle',
  '대만식 만두': 'Taiwanese Dumplings', '대만식 조찬': 'Taiwanese Breakfast',
  '대만/중식': 'Taiwanese / Chinese',
  '티베트/네팔': 'Tibetan / Nepalese', '파키스탄/인도': 'Pakistani / Indian',
  '햄버거/다이너': 'Burger / Diner', '퓨전 햄버거/타코': 'Fusion Burger / Taco',
  '퓨전 반미': 'Fusion Banh Mi', '퓨전 (코리안 멕시칸)': 'Korean-Mexican Fusion',
  '아시안 퓨전 다이너': 'Asian Fusion Diner',
  '태국 (백반식)': 'Thai Set Meal', '태국 (커리 보울)': 'Thai Curry',
  '태국 (디저트)': 'Thai Dessert', '태국 (남부) 요리': 'Southern Thai',
  '비건 태국 요리': 'Vegan Thai', '비건 아메리칸': 'Vegan American',
  '비건 아메리칸/태국': 'Vegan American / Thai', '비건 / 채식': 'Vegan / Vegetarian',
  '중국 (퓨전)': 'Chinese Fusion', '중국 (사천요리)': 'Sichuan',
  '중국 요리 (수타면)': 'Hand-Pulled Noodles', '중식/치킨': 'Chinese / Chicken',
  '필리핀 (치킨)': 'Filipino Chicken', '필리핀 (스트릿푸드)': 'Filipino Street Food',
  '중식 (상하이)': 'Shanghai Chinese',
  '파니니 (샌드위치)': 'Panini', '샌드위치/디저트': 'Sandwich / Dessert',
  '말레이시아/동남아': 'Malaysian / Southeast Asian',
  '뉴올리언스식': 'New Orleans', '케이준/크리올': 'Cajun / Creole',
  '지중해 / 햄버거': 'Mediterranean / Burger',
  '멕시칸 (타코/정육점)': 'Mexican Taqueria',
  '베트남 (샌드위치)': 'Banh Mi', '베트남 쌀국수': 'Pho',
  '하이난/아시안': 'Hainanese / Asian',
  '카리브해 요리': 'Caribbean', '카리브해식 베이글': 'Caribbean Bagel',
  '펀자브/파키스탄': 'Punjabi / Pakistani', '파키스탄 다이닝': 'Pakistani',
  '스테이크': 'Steak', '뉴욕식 버거': 'NY Burger',
  '모던 브리티시 카페': 'Modern British Cafe', '영국 전통 다이너': 'British Diner',
  '피시 앤 칩스': 'Fish & Chips', '파이 앤 매시': 'Pie & Mash',
  '전통 영국식/이탈리안': 'British / Italian',
  '광둥식 중식': 'Cantonese', '광둥식 요리': 'Cantonese',
  '대만식 바오바오': 'Taiwanese Bao',
  '딤섬 / 중식': 'Dim Sum / Chinese', '전통 딤섬': 'Traditional Dim Sum',
  '딤섬/카페': 'Dim Sum / Cafe', '딤섬/순더요리': 'Dim Sum / Shunde',
  '딤섬 / 바오(만두)': 'Dim Sum / Bao',
  '신장/위구르 중식': 'Xinjiang / Uyghur', '신장 요리': 'Xinjiang',
  '일본식 우동': 'Japanese Udon', '캐주얼 일식': 'Casual Japanese',
  '광둥식 바오쯔': 'Cantonese Bao', '인도식 롤': 'Indian Roll',
  '샨시성 중식': 'Shanxi Chinese', '포르투갈식 치킨': 'Portuguese Chicken',
  '홍콩 다이너': 'HK Diner', '크로넛/베이커리': 'Cronut / Bakery',
  '타이 요리/카페': 'Thai / Cafe', '로티세리 치킨': 'Rotisserie Chicken',
  '홍콩식 카페': 'HK Cafe', '홍콩식 바비큐 고기': 'HK BBQ Meats',
  '홍콩식 바비큐 국수': 'HK BBQ Noodles', '홍콩식 디저트': 'HK Dessert',

  // Singapore/HK specific foods
  '바초미 (돼지고기 국수)': 'Bak Chor Mee', '바쿠테 (돼지갈비탕)': 'Bak Kut Teh',
  '츄이쿠에 (무 케이크)': 'Chwee Kueh', '오리 고기 덮밥': 'Duck Rice',
  '클레이팟 락사': 'Claypot Laksa', '화이트 캐럿 케이크': 'White Carrot Cake',
  '피시 탕/죽': 'Fish Soup / Congee', '찹쌀떡(바창)': 'Rice Dumpling (Ba Zhang)',
  '호펀 (Hor Fun)': 'Hor Fun', '창펀 (Chee Cheong Fun)': 'Chee Cheong Fun', '창펀': 'Cheung Fun',
  '브레이즈드 덕': 'Braised Duck', '페라나칸 커리': 'Peranakan Curry',
  '생선 커리 / 쯔차': 'Fish Curry / Tze Char', '치즈 국수': 'Cheese Noodles',
  '두부 요리': 'Tofu', '두부 전문점': 'Tofu Shop', '포피아 (Popiah)': 'Popiah', '포피아': 'Popiah',
  '찹쌀밥': 'Glutinous Rice', '완탕/콘지': 'Wonton / Congee', '완탕/죽': 'Wonton / Congee',
  '사테 / BBQ 치킨윙': 'Satay / BBQ Wings', '한방 수프 (Herbal Soup)': 'Herbal Soup',
  '한방 수프 / 면': 'Herbal Soup / Noodles',
  '퀘이찹 / 오리고기': 'Kway Chap / Duck', '퀘이찹 (Kway Chap)': 'Kway Chap',
  '무슬림/중식': 'Muslim Chinese', '무슬림 식당': 'Muslim Restaurant',
  '무슬림 심야 식당': 'Muslim Late Night',
  '차슈 / 로스트 포크': 'Char Siu / Roast Pork',
  '완탕/대나무면': 'Wonton Bamboo Noodles',
  '전통 디저트 (당수)': 'Traditional Dessert', '우유 디저트': 'Milk Dessert',
  '샤오롱바오 / 면': 'Xiao Long Bao / Noodles', '샤오롱바오': 'Xiao Long Bao',
  '춘권/국수': 'Spring Roll / Noodles', '락사 / 미시암': 'Laksa / Mee Siam',
  '푸투 피링 (쌀가루 떡)': 'Putu Piring', '프리미엄 피시 수프': 'Premium Fish Soup',
  '돼지 부속 국밥': 'Pork Offal Soup', '광둥식 로스트 덕': 'Cantonese Roast Duck',
  '로작 (Rojak, 현지식 샐러드)': 'Rojak', '현지 디저트 빙수': 'Shaved Ice Dessert',
  '돼지간 국수': 'Pork Liver Noodles', '토마토 국수': 'Tomato Noodles',
  '프라타 / 커리': 'Roti Prata / Curry', '사테 (Satay)': 'Satay',
  '광둥식 치킨 라이스': 'Cantonese Chicken Rice', '대하 국수': 'Prawn Noodles',
  '오이스터 케이크 (굴 튀김)': 'Oyster Cake', '치킨 덮밥': 'Chicken Rice',
  '치킨 덮밥 / 치킨 라이스': 'Chicken Rice',
  '락사 / 렌당': 'Laksa / Rendang', '피시 헤드 커리': 'Fish Head Curry',
  '전통 떡': 'Traditional Rice Cake', '국수/콘지': 'Noodles / Congee',
  '칠리 크랩 / 씨푸드': 'Chilli Crab / Seafood',
  '차찬텡/베이커리': 'Cha Chaan Teng / Bakery', '차찬텡/국수': 'Cha Chaan Teng / Noodles',
  '차찬텡/빵': 'Cha Chaan Teng / Bread', '복고 차찬텡': 'Retro Cha Chaan Teng',
  '태국식 소고기 국수': 'Thai Beef Noodles', '태국식 완탕면': 'Thai Wonton Noodles',
  '락사 / 새우 국수': 'Laksa / Prawn Noodles', '사테 국수': 'Satay Noodles',
  '로스트 밋 덮밥': 'Roast Meat Rice', '교자/만두': 'Gyoza / Dumplings',
  '전통 & 빙수 디저트': 'Traditional / Shaved Ice Dessert', '현지식 디저트': 'Local Dessert',
  '로컬 디저트': 'Local Dessert', '심야 퀘이찹': 'Late Night Kway Chap',
  '북경식 만두': 'Beijing Dumplings', '야식 바쿠테': 'Late Night Bak Kut Teh',
  '콘지/오리': 'Congee / Duck', '전통 푼초이': 'Traditional Poon Choi',
  '호커 수제버거': 'Hawker Burger', '조주식 떡': 'Teochew Cake',
  '조주식 거위': 'Teochew Goose', '조주식 국수': 'Teochew Noodles',
  '조주식 떡/만두': 'Teochew Cake / Dumplings',
  '양고기 수프': 'Lamb Soup', '투투 쿠에 (쌀떡)': 'Tutu Kueh',
  '숯불 호키엔미': 'Charcoal Hokkien Mee', '페라나칸 뇨냐 쿠에': 'Peranakan Nyonya Kueh',
  '용타푸 (Yong Tau Foo)': 'Yong Tau Foo', '몐젠궈 (팬케이크)': 'Mian Jian Guo',
  '몐젠궈': 'Mian Jian Guo', '반몐 (수제 면)': 'Ban Mian',
  '말레이 현지식': 'Malay Local', '뱀 수프/로스트': 'Snake Soup / Roast',
  '뱀 수프/보양': 'Snake Soup / Tonic',
  '첸돌 (전통 빙수)': 'Chendol', '인도/말레이 퓨전': 'Indian / Malay Fusion',
  '전통 제과': 'Traditional Pastry', '광둥식 쯔차': 'Cantonese Tze Char',
  '거리 스낵': 'Street Snacks', '프라이드 캐럿 케이크': 'Fried Carrot Cake',
  '바쿠테 / 족발': 'Bak Kut Teh / Trotters', '오리고기 덮밥': 'Duck Rice',
  '국물 바초미': 'Soup Bak Chor Mee', '광둥식 돼지고기 죽': 'Cantonese Pork Congee',
  '소고기 완자': 'Beef Balls', '탕위안 (새알심 수프)': 'Tang Yuan',
  '할랄 포피아 / 나시 레막': 'Halal Popiah / Nasi Lemak',
  '음료 스낵': 'Drinks & Snacks', '포피아 / 락사': 'Popiah / Laksa',
  '타우 후아이 (순두부 디저트)': 'Tau Huay', '무르타박 / 브리야니': 'Murtabak / Biryani',
  '소야 빈 / 꽈배기': 'Soy Milk / Dough Fritters', '돼지고기 땅콩 죽': 'Pork Peanut Congee',
  '클레이팟 바쿠테': 'Claypot Bak Kut Teh', '타우 사 피아 (콩 앙금 빵)': 'Tau Sar Piah',
  '딘타이펑 스타일 볶음밥': 'Din Tai Fung Style Fried Rice', '볶음밥 전문점': 'Fried Rice',
  '브리야니 / 프라타': 'Biryani / Prata', '피쉬마우 / 바초미': 'Fish Maw / Bak Chor Mee',
  '크리스피 로티 프라타': 'Crispy Roti Prata', '코인 프라타': 'Coin Prata',
  '로스트 구스': 'Roast Goose', '디저트/크레페': 'Dessert / Crepe',
  '하이난식 커리 밥': 'Hainanese Curry Rice', '카톡 락사': 'Katong Laksa',

  // London specific
  '인도식 로자크': 'Indian Rojak',
};

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: options.method || 'GET', headers: options.headers || {} };
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

async function main() {
  // Get all verified restaurants
  let all = [];
  for (let offset = 0; offset < 2000; offset += 500) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?source=eq.verified_import&select=id,cuisine_type&limit=500&offset=${offset}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    const batch = res.json();
    if (!batch || batch.length === 0) break;
    all = all.concat(batch);
  }

  console.log(`Found ${all.length} restaurants to translate`);

  let updated = 0, skipped = 0, unmapped = new Set();

  for (const r of all) {
    const ct = r.cuisine_type || [];
    const translated = ct.map(c => {
      if (KR_TO_EN[c]) return KR_TO_EN[c];
      // Already English?
      if (/^[A-Za-z\s\/&\-\(\).,]+$/.test(c)) return c;
      unmapped.add(c);
      // Fallback: keep original
      return c;
    });

    // Only update if changed
    if (JSON.stringify(translated) !== JSON.stringify(ct)) {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/restaurants?id=eq.${r.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json', 'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ cuisine_type: translated }),
      });
      if (patchRes.status < 300) updated++;
    } else {
      skipped++;
    }
  }

  console.log(`Updated: ${updated}, Skipped: ${skipped}`);
  if (unmapped.size > 0) {
    console.log(`\nUnmapped (${unmapped.size}):`);
    for (const u of unmapped) console.log(`  '${u}'`);
  }
}

main().catch(console.error);
