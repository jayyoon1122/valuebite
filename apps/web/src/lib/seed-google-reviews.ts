export interface GoogleReviewData {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
}

export interface RestaurantGoogleData {
  totalReviews: number;
  avgRating: number;
  reviews: GoogleReviewData[]; // top 3-5 most helpful reviews
}

export const GOOGLE_REVIEWS: Record<string, RestaurantGoogleData> = {

  // =====================================================================
  // TOKYO (seed-data.ts) - r1 to r28, i1 to i25
  // =====================================================================

  // r1 - Matsuya Shinjuku West (gyudon)
  "r1": {
    totalReviews: 1243,
    avgRating: 3.9,
    reviews: [
      { author: "James T.", rating: 4, text: "Unbeatable value at \u00A5450 for a filling beef bowl. Open 24 hours which is so convenient after a night out in Shinjuku.", timeAgo: "2 weeks ago" },
      { author: "Yuki Tanaka", rating: 4, text: "Standard gyudon chain but always reliable. The \u00A5490 set with miso soup and salad is a great deal.", timeAgo: "1 month ago" },
      { author: "Chen Wei", rating: 3, text: "Quick and cheap but nothing special. The rice could be better. Still, hard to complain at these prices.", timeAgo: "3 months ago" },
      { author: "Sarah K.", rating: 5, text: "My go-to for a fast cheap meal in Shinjuku. Ordering from the ticket machine is easy even for tourists.", timeAgo: "6 months ago" },
    ],
  },

  // r2 - Fuji Soba Shinjuku (soba)
  "r2": {
    totalReviews: 987,
    avgRating: 3.8,
    reviews: [
      { author: "David Park", rating: 4, text: "Standing soba for \u00A5420 is the ultimate budget meal in Tokyo. Hot broth and fresh noodles in under 3 minutes.", timeAgo: "1 month ago" },
      { author: "Kenji Suzuki", rating: 4, text: "Perfect for a quick breakfast before work. The tempura soba at \u00A5520 is my regular order.", timeAgo: "2 weeks ago" },
      { author: "Lisa Chen", rating: 3, text: "Very basic but does the job. Not the best soba texture but you are paying next to nothing.", timeAgo: "6 months ago" },
    ],
  },

  // r3 - Sukiya Shinjuku (gyudon)
  "r3": {
    totalReviews: 856,
    avgRating: 3.7,
    reviews: [
      { author: "Tom Wilson", rating: 4, text: "Cheapest gyudon chain in Tokyo. The \u00A5430 nami-mori is perfectly adequate for a budget lunch.", timeAgo: "3 months ago" },
      { author: "Mika Hayashi", rating: 4, text: "Love the cheese gyudon option for \u00A5530. Open 24/7 and always clean.", timeAgo: "1 month ago" },
      { author: "Ryan Lee", rating: 3, text: "Decent fast food but Matsuya edges it on taste. Good for late night eating though.", timeAgo: "6 months ago" },
    ],
  },

  // r4 - Hidakaya Shinjuku South (Chinese/ramen)
  "r4": {
    totalReviews: 654,
    avgRating: 3.8,
    reviews: [
      { author: "Akira Yamamoto", rating: 4, text: "The \u00A5490 ramen set with half fried rice is unbeatable value. Classic cheap Chinese in Japan.", timeAgo: "2 weeks ago" },
      { author: "Emily Zhang", rating: 4, text: "Gyoza plate for \u00A5270 is a steal. Perfect drinking snack spot near Shinjuku station.", timeAgo: "1 month ago" },
      { author: "Mark Johnson", rating: 3, text: "Nothing fancy but consistently good for the price. The tanmen is surprisingly tasty at \u00A5520.", timeAgo: "3 months ago" },
    ],
  },

  // r5 - CoCo Ichibanya Shinjuku (curry)
  "r5": {
    totalReviews: 543,
    avgRating: 4.0,
    reviews: [
      { author: "Sophie Martin", rating: 4, text: "Customizable curry is great. Base at \u00A5750 and you pick your spice level and toppings. Very filling.", timeAgo: "1 month ago" },
      { author: "Takeshi Ito", rating: 4, text: "Reliable curry chain. The cheese and hamburger curry at \u00A5880 is my comfort food.", timeAgo: "3 months ago" },
      { author: "Anna Kim", rating: 3, text: "Decent but a bit pricey for a chain. The portions could be bigger for the price you pay.", timeAgo: "6 months ago" },
    ],
  },

  // r6 - Tenya Shinjuku (tempura)
  "r6": {
    totalReviews: 478,
    avgRating: 4.1,
    reviews: [
      { author: "Mike Chen", rating: 5, text: "Tempura set for \u00A5550 is incredible value. Crispy batter, fresh shrimp, and unlimited rice. Best budget tempura.", timeAgo: "2 weeks ago" },
      { author: "Haruki Watanabe", rating: 4, text: "Good quality for a chain. The all-star tendon at \u00A5590 with shrimp, squid, and vegetables is perfect.", timeAgo: "1 month ago" },
      { author: "Jessica Liu", rating: 4, text: "Way better than expected for the price. The dipping sauce is flavorful and portions are generous.", timeAgo: "3 months ago" },
    ],
  },

  // r7 - Yoshinoya Shinjuku East (gyudon)
  "r7": {
    totalReviews: 712,
    avgRating: 3.6,
    reviews: [
      { author: "Daniel Kim", rating: 4, text: "The original gyudon chain. \u00A5480 for a classic beef bowl that has not changed in decades. Reliable.", timeAgo: "1 month ago" },
      { author: "Naomi Sato", rating: 3, text: "Okay but I prefer Matsuya or Sukiya these days. The meat is a bit thin for my taste.", timeAgo: "3 months ago" },
      { author: "Chris Brown", rating: 4, text: "Perfect post-drinking meal. Quick service and the \u00A5580 set with egg and miso soup fills you up.", timeAgo: "6 months ago" },
    ],
  },

  // r8 - Saizeriya Shibuya (Italian family)
  "r8": {
    totalReviews: 934,
    avgRating: 3.8,
    reviews: [
      { author: "Laura Garcia", rating: 5, text: "How is pizza and pasta this cheap in Japan? \u00A5580 for a margherita that is honestly pretty good. Wine from \u00A5200!", timeAgo: "2 weeks ago" },
      { author: "Yusuke Kato", rating: 4, text: "Great for students. The Milano Doria at \u00A5350 is the best deal in all of Tokyo dining.", timeAgo: "1 month ago" },
      { author: "Rachel Wong", rating: 4, text: "Not gourmet Italian but absurdly cheap. Good for a casual meal with friends.", timeAgo: "3 months ago" },
    ],
  },

  // r9 - Yayoiken Shibuya (teishoku)
  "r9": {
    totalReviews: 623,
    avgRating: 4.0,
    reviews: [
      { author: "Kevin Park", rating: 4, text: "Balanced teishoku set meals from \u00A5780. Rice refills are free which is amazing value.", timeAgo: "1 month ago" },
      { author: "Mai Fujita", rating: 5, text: "Love the grilled mackerel set. Real home-cooking taste for under \u00A51000. My lunch go-to.", timeAgo: "2 weeks ago" },
      { author: "Steve Miller", rating: 4, text: "Great set meals with multiple sides. Feels like a proper balanced meal unlike fast food.", timeAgo: "6 months ago" },
    ],
  },

  // r10 - Nakau Shibuya (udon/gyudon)
  "r10": {
    totalReviews: 445,
    avgRating: 3.7,
    reviews: [
      { author: "Amanda Lee", rating: 4, text: "The oyakodon for \u00A5490 is genuinely delicious. Silky egg over chicken and rice. Hidden gem.", timeAgo: "1 month ago" },
      { author: "Ryo Nakamura", rating: 4, text: "Good udon and donburi options. Cheaper than most competitors and open late.", timeAgo: "3 months ago" },
      { author: "Jenny Huang", rating: 3, text: "Decent but not exciting. Good fallback option when other places are full.", timeAgo: "6 months ago" },
    ],
  },

  // r11 - Tenkaippin Shibuya (ramen)
  "r11": {
    totalReviews: 534,
    avgRating: 4.1,
    reviews: [
      { author: "Brian Torres", rating: 5, text: "The kotteri broth is insanely thick and rich. \u00A5830 for a bowl of liquid gold. Not for the faint-hearted.", timeAgo: "2 weeks ago" },
      { author: "Satoshi Endo", rating: 4, text: "Love the thick chicken broth. Order kotteri for the full experience. Assari is for beginners.", timeAgo: "1 month ago" },
      { author: "Helen Wu", rating: 4, text: "Unique ramen experience. The broth is almost like a stew. Very filling for the price.", timeAgo: "3 months ago" },
    ],
  },

  // r12 - Hidakaya Ikebukuro East (Chinese/ramen)
  "r12": {
    totalReviews: 398,
    avgRating: 3.7,
    reviews: [
      { author: "Paul Anderson", rating: 4, text: "Same reliable Hidakaya quality. \u00A5490 ramen and gyoza combo is the standard order here.", timeAgo: "1 month ago" },
      { author: "Ayumi Honda", rating: 3, text: "Basic but cheap. Good for a quick fill near Ikebukuro station.", timeAgo: "3 months ago" },
      { author: "Tony Zhang", rating: 4, text: "The beer and gyoza set for \u00A5590 is perfect after work. No complaints.", timeAgo: "6 months ago" },
    ],
  },

  // r13 - Gusto Ikebukuro (family restaurant)
  "r13": {
    totalReviews: 567,
    avgRating: 3.6,
    reviews: [
      { author: "Michelle Lee", rating: 4, text: "Family restaurant with massive menu. The hamburg steak set at \u00A5650 is surprisingly good.", timeAgo: "2 weeks ago" },
      { author: "Taro Ishikawa", rating: 3, text: "Drink bar for \u00A5250 is great for studying. Food is okay, nothing amazing but very affordable.", timeAgo: "1 month ago" },
      { author: "Karen Smith", rating: 4, text: "Good for groups. Reasonable prices and lots of variety. Kids menu available too.", timeAgo: "6 months ago" },
    ],
  },

  // r14 - Matsunoya Ikebukuro (tonkatsu)
  "r14": {
    totalReviews: 456,
    avgRating: 4.1,
    reviews: [
      { author: "Alex Chen", rating: 5, text: "Tonkatsu set for \u00A5550 is the best deal in Ikebukuro. Crispy, juicy cutlet with free rice and cabbage refills.", timeAgo: "1 month ago" },
      { author: "Yumi Ogawa", rating: 4, text: "Sister chain of Matsuya doing tonkatsu right. The loin katsu is thick and well-cooked.", timeAgo: "3 months ago" },
      { author: "Dave Wilson", rating: 4, text: "Incredible value for tonkatsu. Comes with unlimited shredded cabbage and rice.", timeAgo: "6 months ago" },
    ],
  },

  // r15 - Marugame Seimen Tokyo Station (udon)
  "r15": {
    totalReviews: 1123,
    avgRating: 4.1,
    reviews: [
      { author: "Nina Patel", rating: 5, text: "Fresh udon made right in front of you for \u00A5450. Add a tempura for \u00A5130. Best quick meal at Tokyo Station.", timeAgo: "2 weeks ago" },
      { author: "Koji Matsuda", rating: 4, text: "Always a queue but moves fast. The kake udon at \u00A5390 is pure comfort food.", timeAgo: "1 month ago" },
      { author: "Sandra Lee", rating: 4, text: "Watching them make the noodles is half the experience. Great chewy texture every time.", timeAgo: "3 months ago" },
    ],
  },

  // r16 - Katsuya Otemachi (tonkatsu)
  "r16": {
    totalReviews: 389,
    avgRating: 4.0,
    reviews: [
      { author: "Robert Kim", rating: 4, text: "Katsudon for \u00A5590 near the business district. Quick, filling, and tasty. Perfect lunch.", timeAgo: "1 month ago" },
      { author: "Eri Shimizu", rating: 4, text: "The katsu curry at \u00A5650 is my go-to. Good portion size for office workers.", timeAgo: "3 months ago" },
      { author: "John Peters", rating: 4, text: "Solid tonkatsu chain. Not as good as specialty shops but great for the price point.", timeAgo: "6 months ago" },
    ],
  },

  // r17 - Matsuya Akihabara (gyudon)
  "r17": {
    totalReviews: 756,
    avgRating: 3.9,
    reviews: [
      { author: "Liam O'Brien", rating: 4, text: "Fuel up for \u00A5450 before exploring the electronics shops. Fast service even when busy.", timeAgo: "2 weeks ago" },
      { author: "Aiko Morita", rating: 4, text: "Same reliable Matsuya. The premium gyudon at \u00A5580 uses better quality beef.", timeAgo: "1 month ago" },
      { author: "Philip Wang", rating: 3, text: "Does what it says on the tin. Cheap beef bowl in a convenient location.", timeAgo: "6 months ago" },
    ],
  },

  // r18 - Go Go Curry Akihabara (curry)
  "r18": {
    totalReviews: 567,
    avgRating: 4.1,
    reviews: [
      { author: "Jake Thompson", rating: 5, text: "Thick Kanazawa-style curry with a huge tonkatsu on top for \u00A5780. The portions are massive.", timeAgo: "1 month ago" },
      { author: "Misaki Abe", rating: 4, text: "Dark, thick curry that is very filling. The Major curry at \u00A5850 could feed two people.", timeAgo: "2 weeks ago" },
      { author: "Diana Cruz", rating: 4, text: "Love the gorilla mascot and the heavy curry. Not subtle but very satisfying and cheap.", timeAgo: "3 months ago" },
    ],
  },

  // r19 - Ootoya Ueno (teishoku)
  "r19": {
    totalReviews: 445,
    avgRating: 4.1,
    reviews: [
      { author: "Hannah Kim", rating: 4, text: "Higher quality teishoku than Yayoiken. The charcoal-grilled chicken set at \u00A5850 is excellent.", timeAgo: "1 month ago" },
      { author: "Shota Kimura", rating: 5, text: "Like eating at a Japanese grandmother's house. The mackerel saba set is outstanding at \u00A5880.", timeAgo: "3 months ago" },
      { author: "Greg Patterson", rating: 4, text: "Worth the slightly higher prices for noticeably better food quality. Real home cooking.", timeAgo: "6 months ago" },
    ],
  },

  // r20 - Matsuya Shimbashi (gyudon)
  "r20": {
    totalReviews: 823,
    avgRating: 3.9,
    reviews: [
      { author: "Samantha Ford", rating: 4, text: "Salary man central. Quick \u00A5450 gyudon and back to the office. The curry is also decent at \u00A5550.", timeAgo: "2 weeks ago" },
      { author: "Hideki Noda", rating: 4, text: "Always packed at lunch but service is lightning fast. Great for a 10-minute meal.", timeAgo: "1 month ago" },
      { author: "Linda Chang", rating: 3, text: "Standard Matsuya. Convenient location near the station for commuters.", timeAgo: "6 months ago" },
    ],
  },

  // r21 - Sukiya Shimbashi (gyudon)
  "r21": {
    totalReviews: 612,
    avgRating: 3.7,
    reviews: [
      { author: "Matt Davis", rating: 4, text: "Best late-night option near Shimbashi. The \u00A5430 gyudon hits the spot after a long day.", timeAgo: "1 month ago" },
      { author: "Kana Uchida", rating: 3, text: "Slightly cheaper than competitors. Good enough for what it is.", timeAgo: "3 months ago" },
      { author: "Peter Ross", rating: 4, text: "The mega bowl at \u00A5620 is insane value if you are really hungry. Tons of beef.", timeAgo: "6 months ago" },
    ],
  },

  // r22 - Gyoza no Ohsho Kabukicho (Chinese/gyoza)
  "r22": {
    totalReviews: 678,
    avgRating: 4.0,
    reviews: [
      { author: "Victoria Lam", rating: 5, text: "Gyoza paradise. Six big dumplings for \u00A5290. Order two plates with rice and you have a feast for under \u00A5700.", timeAgo: "2 weeks ago" },
      { author: "Daiki Mori", rating: 4, text: "Classic gyoza chain. The garlic-heavy style is addictive. Great with a cold beer.", timeAgo: "1 month ago" },
      { author: "Olivia Chen", rating: 4, text: "Open late in Kabukicho which is perfect. The fried rice at \u00A5480 is solid too.", timeAgo: "3 months ago" },
    ],
  },

  // r23 - Bamiyan Shinjuku (Chinese family)
  "r23": {
    totalReviews: 398,
    avgRating: 3.6,
    reviews: [
      { author: "Nathan White", rating: 3, text: "Chinese family restaurant chain. The mapo tofu set at \u00A5680 is decent for a quick lunch.", timeAgo: "1 month ago" },
      { author: "Rina Takahashi", rating: 4, text: "Good variety of Chinese dishes at reasonable prices. The drink bar is a plus.", timeAgo: "3 months ago" },
      { author: "Eric Johnson", rating: 3, text: "Nothing exciting but cheap and filling. Good rainy day option.", timeAgo: "6 months ago" },
    ],
  },

  // r24 - Hanamaru Udon Shibuya (udon)
  "r24": {
    totalReviews: 756,
    avgRating: 3.9,
    reviews: [
      { author: "Michelle Park", rating: 5, text: "A warm bowl of udon from \u00A5380. Add tempura toppings from \u00A5110 each. Crazy cheap and cheerful.", timeAgo: "2 weeks ago" },
      { author: "Yuto Saito", rating: 4, text: "Self-service udon done right. Quick, cheap, and the noodles have good texture.", timeAgo: "1 month ago" },
      { author: "Amy Watson", rating: 4, text: "Like a budget Marugame. Great if you just need a quick warm meal for almost nothing.", timeAgo: "3 months ago" },
    ],
  },

  // r25 - Kappa Sushi Shinjuku (sushi)
  "r25": {
    totalReviews: 489,
    avgRating: 3.8,
    reviews: [
      { author: "Carlos Ramirez", rating: 4, text: "Conveyor belt sushi from \u00A5110 per plate. Not the best sushi but amazing value for Tokyo.", timeAgo: "1 month ago" },
      { author: "Sakura Yamada", rating: 4, text: "Good for families. Kids love the conveyor belt and prices are very reasonable.", timeAgo: "3 months ago" },
      { author: "Ben Taylor", rating: 3, text: "Basic kaiten sushi. Fine for satisfying a craving without spending much.", timeAgo: "6 months ago" },
    ],
  },

  // r26 - Ringer Hut Shinjuku (champon)
  "r26": {
    totalReviews: 367,
    avgRating: 4.0,
    reviews: [
      { author: "Patricia Kim", rating: 4, text: "Nagasaki champon for \u00A5690. Loaded with vegetables and the broth is creamy and satisfying.", timeAgo: "2 weeks ago" },
      { author: "Sho Tanaka", rating: 5, text: "Best value noodle chain for getting your vegetables in. The chanpon has so much cabbage and bean sprouts.", timeAgo: "1 month ago" },
      { author: "Grace Liu", rating: 4, text: "Surprisingly healthy for fast food. Good thick noodles and generous toppings.", timeAgo: "3 months ago" },
    ],
  },

  // r27 - Doutor Coffee Shinjuku (cafe)
  "r27": {
    totalReviews: 312,
    avgRating: 3.5,
    reviews: [
      { author: "Rebecca Jones", rating: 3, text: "Coffee from \u00A5250 and a hot dog for \u00A5390. Basic cafe chain but cheaper than Starbucks.", timeAgo: "1 month ago" },
      { author: "Koichi Inoue", rating: 4, text: "Good morning set deals. The Milano sandwich with coffee for \u00A5450 is my breakfast routine.", timeAgo: "3 months ago" },
      { author: "Tina Wang", rating: 3, text: "Functional cafe for a coffee break. Nothing special but gets the job done.", timeAgo: "6 months ago" },
    ],
  },

  // r28 - Torikizoku Shinjuku East (yakitori/izakaya)
  "r28": {
    totalReviews: 678,
    avgRating: 4.1,
    reviews: [
      { author: "Max Robertson", rating: 5, text: "Every item on the menu is \u00A5350 including drinks. The yakitori skewers are genuinely good at this price.", timeAgo: "2 weeks ago" },
      { author: "Manami Ueda", rating: 4, text: "Best budget izakaya chain. All-you-can-drink options make it even better value.", timeAgo: "1 month ago" },
      { author: "Jordan Lee", rating: 4, text: "Incredible deal for groups. Ordered tons of skewers and beer and the bill was shockingly low.", timeAgo: "3 months ago" },
    ],
  },

  // i1 - Menya Sho Roppongi (ramen)
  "i1": {
    totalReviews: 567,
    avgRating: 4.3,
    reviews: [
      { author: "Christine Park", rating: 5, text: "Rich yuzu shio ramen for \u00A5920. The citrus notes in the broth are incredible. Worth every yen.", timeAgo: "1 month ago" },
      { author: "Takashi Oda", rating: 4, text: "One of the best ramen shops in Roppongi. The chashu melts in your mouth.", timeAgo: "2 weeks ago" },
      { author: "Andrea Rossi", rating: 4, text: "Upscale ramen experience. Pricier than chains but the quality difference is clear.", timeAgo: "3 months ago" },
    ],
  },

  // i2 - Chai Khana Roppongi (Indian/Nepali)
  "i2": {
    totalReviews: 345,
    avgRating: 4.2,
    reviews: [
      { author: "Raj Mehta", rating: 5, text: "Authentic Nepali dal bhat set for \u00A5850. Reminds me of home. The naan is freshly baked.", timeAgo: "1 month ago" },
      { author: "Emma Scott", rating: 4, text: "Great lunch deal with curry, naan, and salad for \u00A5890. Generous portions.", timeAgo: "3 months ago" },
      { author: "Yuki Nishida", rating: 4, text: "Hidden gem in Roppongi. The butter chicken is rich and creamy.", timeAgo: "6 months ago" },
    ],
  },

  // i3 - Owariya Asakusa (soba)
  "i3": {
    totalReviews: 678,
    avgRating: 4.2,
    reviews: [
      { author: "George Mitchell", rating: 5, text: "Traditional soba shop near Sensoji. The tenzaru soba at \u00A5980 with crispy tempura is excellent.", timeAgo: "2 weeks ago" },
      { author: "Fumiko Sakai", rating: 4, text: "Historic atmosphere and handmade noodles. The cold soba at \u00A5680 is perfectly chewy.", timeAgo: "1 month ago" },
      { author: "Mike Sullivan", rating: 4, text: "Great stop during an Asakusa temple visit. Quality soba at fair prices.", timeAgo: "3 months ago" },
    ],
  },

  // i4 - Asakusa Monja (monja/okonomiyaki)
  "i4": {
    totalReviews: 456,
    avgRating: 4.0,
    reviews: [
      { author: "Sarah Thompson", rating: 4, text: "Fun DIY cooking experience. Monja from \u00A5780 and they help you make it. Very entertaining.", timeAgo: "1 month ago" },
      { author: "Daichi Kobayashi", rating: 4, text: "Authentic Tokyo-style monja. The mentaiko cheese monja at \u00A5890 is addictive.", timeAgo: "3 months ago" },
      { author: "Kate Williams", rating: 3, text: "Interesting cultural experience but monja takes some getting used to. Worth trying once.", timeAgo: "6 months ago" },
    ],
  },

  // i5 - Shimokita Curry Shokudo (curry)
  "i5": {
    totalReviews: 423,
    avgRating: 4.3,
    reviews: [
      { author: "Nate Robinson", rating: 5, text: "Best indie curry in Shimokitazawa. The spice blend at \u00A5850 has real depth. Small cozy shop.", timeAgo: "2 weeks ago" },
      { author: "Riko Matsui", rating: 4, text: "Unique curry recipes that change weekly. Always interesting and well-spiced.", timeAgo: "1 month ago" },
      { author: "Jess Carter", rating: 4, text: "Hip curry shop in a hip neighborhood. Good vegetarian options too.", timeAgo: "3 months ago" },
    ],
  },

  // i6 - Vietnam Kitchen Saigon Shimokitazawa (Vietnamese)
  "i6": {
    totalReviews: 289,
    avgRating: 4.1,
    reviews: [
      { author: "Linh Nguyen", rating: 4, text: "Decent pho for Tokyo at \u00A5780. Not quite like Saigon but the broth is well-made.", timeAgo: "1 month ago" },
      { author: "Kyle Harris", rating: 4, text: "Good banh mi and pho in a casual setting. The spring rolls are fresh and tasty.", timeAgo: "3 months ago" },
      { author: "Chie Watanabe", rating: 4, text: "Love coming here for lunch. The goi cuon at \u00A5480 is light and refreshing.", timeAgo: "6 months ago" },
    ],
  },

  // i7 - Nepal Shokudo Koenji (Nepali/Indian)
  "i7": {
    totalReviews: 467,
    avgRating: 4.4,
    reviews: [
      { author: "Sanjay Gupta", rating: 5, text: "Authentic dal bhat set for \u00A5750. Massive plate with rice, dal, pickles, and curry. Best value in Koenji.", timeAgo: "2 weeks ago" },
      { author: "Katie Brown", rating: 5, text: "Incredible portions and genuine Nepali flavors. The owner is super friendly.", timeAgo: "1 month ago" },
      { author: "Tomoki Arai", rating: 4, text: "Hidden gem that locals love. The momo dumplings at \u00A5550 are hand-made and delicious.", timeAgo: "3 months ago" },
    ],
  },

  // i8 - Tensuke Tempura Koenji (tempura)
  "i8": {
    totalReviews: 345,
    avgRating: 4.3,
    reviews: [
      { author: "Lauren White", rating: 5, text: "Counter-style tempura for \u00A5650. Watching the chef fry each piece to order is mesmerizing.", timeAgo: "1 month ago" },
      { author: "Daisuke Ono", rating: 4, text: "Proper tempura shop quality at budget prices. The tendon is beautifully arranged.", timeAgo: "3 months ago" },
      { author: "Sean Murphy", rating: 4, text: "Way better than Tenya. Small shop but the tempura is light and crispy perfection.", timeAgo: "6 months ago" },
    ],
  },

  // i9 - Afghan Ebisu (curry/lunch set)
  "i9": {
    totalReviews: 534,
    avgRating: 4.3,
    reviews: [
      { author: "Oliver Grant", rating: 5, text: "The \u00A5900 lunch set is legendary. Massive plate of curry, rice, and salad. Always a queue.", timeAgo: "2 weeks ago" },
      { author: "Megumi Ito", rating: 4, text: "Best value lunch in Ebisu. The curry has a unique Japanese-Western fusion taste.", timeAgo: "1 month ago" },
      { author: "Diana Hall", rating: 4, text: "Worth the wait. The curry is rich and the portion is enormous for the price.", timeAgo: "3 months ago" },
    ],
  },

  // i10 - Katsuichi Meguro (tonkatsu)
  "i10": {
    totalReviews: 356,
    avgRating: 4.4,
    reviews: [
      { author: "James McCarthy", rating: 5, text: "Proper artisan tonkatsu for \u00A5850. The pork is thick-cut and perfectly juicy inside.", timeAgo: "1 month ago" },
      { author: "Ayaka Murakami", rating: 5, text: "Worth the trip to Meguro. The loin katsu set with unlimited cabbage and rice is a feast.", timeAgo: "2 weeks ago" },
      { author: "Nick Cooper", rating: 4, text: "Much better than chain tonkatsu. You can taste the difference in pork quality.", timeAgo: "3 months ago" },
    ],
  },

  // i11 - Bangkok Thai Takadanobaba (Thai)
  "i11": {
    totalReviews: 489,
    avgRating: 4.3,
    reviews: [
      { author: "Pim Srisawan", rating: 5, text: "Most authentic Thai food in Tokyo. The pad kra pao at \u00A5780 has proper holy basil and real chili heat.", timeAgo: "2 weeks ago" },
      { author: "Ben Foster", rating: 4, text: "University area gem. The lunch set with Tom Yum soup and rice for \u00A5800 is excellent.", timeAgo: "1 month ago" },
      { author: "Nozomi Hara", rating: 4, text: "Love the green curry here. Coconut milk is rich and the spice level is adjustable.", timeAgo: "3 months ago" },
    ],
  },

  // i12 - Baba Nankai Curry (yoshoku curry)
  "i12": {
    totalReviews: 876,
    avgRating: 4.3,
    reviews: [
      { author: "Andrew Kim", rating: 5, text: "Famous student curry shop. The katsu curry at \u00A5600 is an absolute mountain of food. Insane value.", timeAgo: "1 month ago" },
      { author: "Shizuka Honda", rating: 5, text: "Been coming here since college. The portions have not shrunk. \u00A5600 feeds you for the whole day.", timeAgo: "2 weeks ago" },
      { author: "Tim Sullivan", rating: 4, text: "Old-school Japanese curry with gigantic portions. Bring your appetite.", timeAgo: "3 months ago" },
    ],
  },

  // i13 - Seikei Korean Kitchen (Korean)
  "i13": {
    totalReviews: 267,
    avgRating: 4.1,
    reviews: [
      { author: "Ji-yeon Park", rating: 4, text: "Good Korean food near Takadanobaba. The bibimbap lunch set at \u00A5820 comes with free banchan.", timeAgo: "1 month ago" },
      { author: "Dan Mitchell", rating: 4, text: "Authentic Korean flavors. The sundubu jjigae is spicy and comforting.", timeAgo: "3 months ago" },
      { author: "Yoko Aoki", rating: 4, text: "Nice little Korean place. Portions are generous for the student area.", timeAgo: "6 months ago" },
    ],
  },

  // i14 - Ginza Standing Sushi (tachigui sushi)
  "i14": {
    totalReviews: 678,
    avgRating: 4.5,
    reviews: [
      { author: "Michael Chen", rating: 5, text: "Standing sushi in Ginza for \u00A5980. The nigiri is hand-pressed and fish is incredibly fresh. A steal.", timeAgo: "2 weeks ago" },
      { author: "Kazuya Nishimura", rating: 5, text: "Best value sushi in Ginza by far. Standing format keeps prices low but quality is top notch.", timeAgo: "1 month ago" },
      { author: "Lisa Romano", rating: 4, text: "No frills sushi counter. You eat standing but the fish quality rivals sit-down places costing double.", timeAgo: "3 months ago" },
    ],
  },

  // i15 - Renga-tei Ginza (yoshoku)
  "i15": {
    totalReviews: 534,
    avgRating: 4.2,
    reviews: [
      { author: "Frank Miller", rating: 4, text: "Historic yoshoku restaurant since 1895. The pork cutlet at \u00A5950 is the original Japanese tonkatsu.", timeAgo: "1 month ago" },
      { author: "Asami Fukuda", rating: 5, text: "A piece of culinary history. The omurice and hayashi rice are classic comfort food.", timeAgo: "3 months ago" },
      { author: "Sandra Lin", rating: 4, text: "Old Ginza charm with reasonable prices. The croquettes are crispy and creamy inside.", timeAgo: "6 months ago" },
    ],
  },

  // i16 - Aoba Ramen Nakano (ramen)
  "i16": {
    totalReviews: 789,
    avgRating: 4.4,
    reviews: [
      { author: "Chris Yang", rating: 5, text: "The double soup ramen at \u00A5830 blends tonkotsu and fish broth perfectly. Nakano treasure.", timeAgo: "2 weeks ago" },
      { author: "Rina Sasaki", rating: 4, text: "Famous ramen shop that lives up to the hype. The tsukemen is equally good.", timeAgo: "1 month ago" },
      { author: "Jack Morrison", rating: 4, text: "Balanced, complex broth that keeps you coming back. Worth the trip to Nakano.", timeAgo: "3 months ago" },
    ],
  },

  // i17 - Iseya Yakitori Kichijoji (yakitori)
  "i17": {
    totalReviews: 987,
    avgRating: 4.2,
    reviews: [
      { author: "Stephanie Clark", rating: 5, text: "Yakitori skewers from \u00A590 each! Smoky charcoal flavor and they grill them right outside. Iconic.", timeAgo: "1 month ago" },
      { author: "Hiroshi Kondo", rating: 4, text: "Been here for decades. The cheap yakitori and beer combo is a Kichijoji tradition.", timeAgo: "2 weeks ago" },
      { author: "Paula Rodriguez", rating: 4, text: "Dirt cheap yakitori in a lively atmosphere. Order the tsukune and negima.", timeAgo: "3 months ago" },
    ],
  },

  // i18 - Omoide Yokocho Motsuyaki (yakitori/izakaya)
  "i18": {
    totalReviews: 1234,
    avgRating: 4.2,
    reviews: [
      { author: "Adam Wright", rating: 5, text: "Atmospheric alley dining near Shinjuku station. Smoky grilled offal skewers from \u00A5150. Pure old Tokyo.", timeAgo: "2 weeks ago" },
      { author: "Sachiko Endo", rating: 4, text: "Tight seating but incredible vibe. The motsuyaki with draft beer is perfect after work.", timeAgo: "1 month ago" },
      { author: "Derek Hansen", rating: 4, text: "Must-visit for the experience. Tiny stalls with charcoal grills and cold beer. Budget friendly.", timeAgo: "3 months ago" },
      { author: "Maria Santos", rating: 5, text: "Like stepping back in time. The yakitori master grills everything with incredible skill.", timeAgo: "6 months ago" },
    ],
  },

  // i19 - Menya Musashi Shinjuku (ramen/tsukemen)
  "i19": {
    totalReviews: 876,
    avgRating: 4.3,
    reviews: [
      { author: "Kevin Zhao", rating: 5, text: "The tsukemen at \u00A5950 has thick, chewy noodles and an intense dipping broth. Outstanding.", timeAgo: "1 month ago" },
      { author: "Noriko Yamashita", rating: 4, text: "One of Shinjuku's legendary ramen shops. The broth has incredible depth of flavor.", timeAgo: "2 weeks ago" },
      { author: "Brad Cooper", rating: 4, text: "Pricier than chains but the quality leap is massive. The chashu is melt-in-your-mouth.", timeAgo: "3 months ago" },
    ],
  },

  // i20 - Kabe no Ana Pasta Shibuya (Italian pasta)
  "i20": {
    totalReviews: 456,
    avgRating: 4.1,
    reviews: [
      { author: "Julia Sanders", rating: 4, text: "Japanese-Italian pasta fusion. The mentaiko pasta at \u00A5850 is a Tokyo classic. Creamy and umami-rich.", timeAgo: "1 month ago" },
      { author: "Tetsuya Kato", rating: 4, text: "Invented the tarako spaghetti. Historic shop with unique Japanese pasta creations.", timeAgo: "3 months ago" },
      { author: "Ashley Barnes", rating: 4, text: "Not traditional Italian but delicious in its own way. Generous portions for Shibuya.", timeAgo: "6 months ago" },
    ],
  },

  // i21 - Uoriki Kaisen-don Shibuya (seafood bowl)
  "i21": {
    totalReviews: 567,
    avgRating: 4.3,
    reviews: [
      { author: "Monica Lee", rating: 5, text: "Fresh kaisen-don for \u00A5880 in Shibuya. Piled high with sashimi over rice. Incredible freshness.", timeAgo: "2 weeks ago" },
      { author: "Yuichi Okada", rating: 4, text: "Best seafood bowl in the Shibuya area. The mixed sashimi donburi is always stacked.", timeAgo: "1 month ago" },
      { author: "Ivan Petrov", rating: 4, text: "Great quality fish for the price. The salmon ikura don at \u00A5980 is gorgeous.", timeAgo: "3 months ago" },
    ],
  },

  // i22 - Eiri Chinese Ikebukuro (Sichuan)
  "i22": {
    totalReviews: 423,
    avgRating: 4.4,
    reviews: [
      { author: "Wei Zhang", rating: 5, text: "Authentic Sichuan food in Ikebukuro Chinatown. Mapo tofu at \u00A5750 has real numbing spice. Like being in Chengdu.", timeAgo: "1 month ago" },
      { author: "Nancy Adams", rating: 4, text: "Fiery and flavorful. The dan dan noodles are properly spicy. Not toned down for Japanese tastes.", timeAgo: "2 weeks ago" },
      { author: "Kazuki Honda", rating: 4, text: "Best Chinese food in Ikebukuro. Huge portions and authentic flavors.", timeAgo: "3 months ago" },
    ],
  },

  // i23 - Thali-ya Indian Shinjuku (Indian thali)
  "i23": {
    totalReviews: 389,
    avgRating: 4.2,
    reviews: [
      { author: "Priya Sharma", rating: 5, text: "Real Indian thali in Shinjuku for \u00A5850. Three curries, dal, rice, naan, and raita. Proper meal.", timeAgo: "1 month ago" },
      { author: "Dan Foster", rating: 4, text: "Good value Indian lunch set. The butter chicken is creamy and the naan is freshly baked.", timeAgo: "3 months ago" },
      { author: "Miki Abe", rating: 4, text: "Authentic Indian flavors. The lunch set is very generous for the price.", timeAgo: "6 months ago" },
    ],
  },

  // i24 - Biton Korean BBQ Shinjuku (Korean BBQ)
  "i24": {
    totalReviews: 312,
    avgRating: 4.1,
    reviews: [
      { author: "Min-jun Kim", rating: 4, text: "Decent Korean BBQ lunch set for \u00A5980. The samgyeopsal is thick-cut and comes with banchan.", timeAgo: "1 month ago" },
      { author: "Amy Park", rating: 4, text: "Good Korean BBQ without breaking the bank. The kimchi is house-made and excellent.", timeAgo: "3 months ago" },
      { author: "Ryosuke Ota", rating: 4, text: "All-you-can-eat option at \u00A51980 is great value for dinner. Lots of meat choices.", timeAgo: "6 months ago" },
    ],
  },

  // i25 - Pho Vietnam Shinjuku (Vietnamese)
  "i25": {
    totalReviews: 289,
    avgRating: 4.1,
    reviews: [
      { author: "Thanh Le", rating: 4, text: "Decent pho at \u00A5820. The broth is clear and well-seasoned. Good banh mi for \u00A5550 too.", timeAgo: "2 weeks ago" },
      { author: "Holly Carter", rating: 4, text: "Nice change of pace from Japanese food. Fresh herbs and clean flavors.", timeAgo: "1 month ago" },
      { author: "Kengo Ito", rating: 4, text: "Good Vietnamese food near Shinjuku station. The summer rolls are fresh and tasty.", timeAgo: "3 months ago" },
    ],
  },

  // =====================================================================
  // NEW YORK CITY (seed-cities.ts) - nyc-1 to nyc-23
  // =====================================================================

  "nyc-1": {
    totalReviews: 4567,
    avgRating: 4.4,
    reviews: [
      { author: "Mike D.", rating: 5, text: "Best dollar slice in Manhattan. $3.50 for a huge, perfectly foldable NY slice. Cash only but worth it.", timeAgo: "2 weeks ago" },
      { author: "Sarah Chen", rating: 4, text: "The classic NYC pizza experience. Thin crust, great sauce, always hot and fresh.", timeAgo: "1 month ago" },
      { author: "Roberto Martinez", rating: 5, text: "Been coming here for 20 years. Never disappoints. The pepperoni slice at $4.50 is perfection.", timeAgo: "3 months ago" },
      { author: "Aisha Johnson", rating: 4, text: "Long lines but worth the wait. Grab a slice and eat walking down Carmine St.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-2": {
    totalReviews: 2345,
    avgRating: 3.8,
    reviews: [
      { author: "Dave Williams", rating: 4, text: "$1.50 slices are still alive in NYC. Not gourmet but hits the spot at 2am. Classic.", timeAgo: "1 month ago" },
      { author: "Priya Patel", rating: 3, text: "You get what you pay for. A $1.50 slice that is decent enough when you need cheap food.", timeAgo: "3 months ago" },
      { author: "Jason Lee", rating: 4, text: "The OG dollar slice chain. Multiple locations. Perfect for broke college students.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-3": {
    totalReviews: 3456,
    avgRating: 4.5,
    reviews: [
      { author: "Amanda Torres", rating: 5, text: "The spicy spring square at $5 is legendary. Thick, crispy, and loaded with pepperoni. Pure fire.", timeAgo: "2 weeks ago" },
      { author: "Chris Park", rating: 5, text: "Best Sicilian-style slice in NYC. The fresh mozz slice is incredible too.", timeAgo: "1 month ago" },
      { author: "Brittany Adams", rating: 4, text: "Long wait but the pizza is exceptional. The spicy spring is worth the hype.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-4": {
    totalReviews: 1234,
    avgRating: 3.9,
    reviews: [
      { author: "Tyler Brooks", rating: 4, text: "Consistent burrito bowl for $11. The double protein upgrade at $3 extra is worth it.", timeAgo: "1 month ago" },
      { author: "Maria Gonzalez", rating: 4, text: "Good fast-casual Mexican. The sofritas bowl is underrated. Always busy at lunch.", timeAgo: "3 months ago" },
      { author: "Evan Wright", rating: 3, text: "Reliable but not exciting. Gets the job done when you need a filling meal fast.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-5": {
    totalReviews: 4567,
    avgRating: 4.2,
    reviews: [
      { author: "Jess Martinez", rating: 5, text: "The original location in Madison Square Park. The ShackBurger at $7.50 is still the best fast-casual burger.", timeAgo: "2 weeks ago" },
      { author: "Kevin O'Neil", rating: 4, text: "Crinkle fries and a shake make it worth the $12 average. Outdoor seating is great in summer.", timeAgo: "1 month ago" },
      { author: "Lily Chang", rating: 4, text: "Pricey for fast food but the quality justifies it. The mushroom burger is underrated.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-6": {
    totalReviews: 876,
    avgRating: 3.8,
    reviews: [
      { author: "Rachel Green", rating: 4, text: "Healthy fast food done right. The harvest bowl at $14 is filling and nutritious.", timeAgo: "1 month ago" },
      { author: "Omar Hassan", rating: 3, text: "$14 for a salad is steep but ingredients are fresh and portions are decent.", timeAgo: "3 months ago" },
      { author: "Kelly Foster", rating: 4, text: "Good option when you want to eat clean. The dressings are excellent.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-7": {
    totalReviews: 2345,
    avgRating: 4.1,
    reviews: [
      { author: "Marcus White", rating: 5, text: "Best chicken sandwich in fast food. The spicy deluxe at $6.50 is perfectly crispy and juicy.", timeAgo: "2 weeks ago" },
      { author: "Sofia Garcia", rating: 4, text: "Always a massive line at this location but service is fast. Waffle fries never disappoint.", timeAgo: "1 month ago" },
      { author: "Derek Chang", rating: 4, text: "Consistent quality every time. The $9 meal deal with nuggets and a drink is solid.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-8": {
    totalReviews: 2876,
    avgRating: 4.4,
    reviews: [
      { author: "Jenny Liu", rating: 5, text: "The hand-pulled biang biang noodles at $9.50 are a must. Chewy, spicy, and absolutely addictive.", timeAgo: "2 weeks ago" },
      { author: "Brandon Kim", rating: 5, text: "Spicy cumin lamb noodles are life-changing. Real Shaanxi flavors in Midtown for under $10.", timeAgo: "1 month ago" },
      { author: "Nicole Adams", rating: 4, text: "Always busy but the line moves fast. The liang pi cold noodles are refreshing in summer.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-9": {
    totalReviews: 1234,
    avgRating: 4.2,
    reviews: [
      { author: "David Hong", rating: 4, text: "Huge bowls of wonton noodle soup for $7. Chinatown classic that has been here forever.", timeAgo: "1 month ago" },
      { author: "Laura Kim", rating: 5, text: "The shrimp wontons are plump and the broth is clear and flavorful. Best cheap eat in Chinatown.", timeAgo: "3 months ago" },
      { author: "Eddie Chen", rating: 4, text: "No frills, just great noodles. Cash only. The dry noodles with oyster sauce are excellent.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-10": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Catherine Wu", rating: 5, text: "The soup dumplings at $12 for 8 pieces are the best in Chinatown. Careful, they are scalding hot.", timeAgo: "2 weeks ago" },
      { author: "Phil Morgan", rating: 4, text: "Famous for their xiao long bao. The crab version is worth the splurge at $15.", timeAgo: "1 month ago" },
      { author: "Maggie Huang", rating: 4, text: "Old school Shanghainese. The braised pork belly is melt-in-your-mouth tender.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-11": {
    totalReviews: 5678,
    avgRating: 4.4,
    reviews: [
      { author: "Ryan Brooks", rating: 5, text: "The chicken and rice platter for $8 is the best deal in NYC. White sauce is legendary. The line is always insane.", timeAgo: "2 weeks ago" },
      { author: "Fatima Ali", rating: 5, text: "Get the combo platter with extra white sauce. The hot sauce has serious kick. A NYC institution.", timeAgo: "1 month ago" },
      { author: "Steve Kim", rating: 4, text: "Worth the 30-minute wait. Massive portions of perfectly seasoned chicken over rice.", timeAgo: "3 months ago" },
      { author: "Danielle Scott", rating: 4, text: "Make sure you go to the original cart on 53rd and 6th. The brick-and-mortar locations are not the same.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-12": {
    totalReviews: 987,
    avgRating: 4.0,
    reviews: [
      { author: "Ahmed Hassan", rating: 4, text: "Solid halal cart with a $7 chicken over rice combo. Not as famous as Halal Guys but shorter wait.", timeAgo: "1 month ago" },
      { author: "Nina Patel", rating: 4, text: "The lamb gyro at $8 is really good. Nice white sauce and plenty of hot sauce.", timeAgo: "3 months ago" },
      { author: "Jake Thomas", rating: 3, text: "Good but not exceptional. Reliable lunch option in the Midtown area.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-13": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Dorothy Smith", rating: 5, text: "The pastrami sandwich is $25 but it is enough for two people. Piled impossibly high with meat.", timeAgo: "2 weeks ago" },
      { author: "Vince Lombardi", rating: 5, text: "A NYC legend since 1888. The hot pastrami on rye is the gold standard. Worth every penny.", timeAgo: "1 month ago" },
      { author: "Hannah Rose", rating: 4, text: "Expensive but the quality and history justify it. Split a sandwich and add a pickle.", timeAgo: "3 months ago" },
      { author: "Leo Martinez", rating: 4, text: "Touristy but genuinely great. The matzo ball soup at $8 is also excellent.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-14": {
    totalReviews: 2345,
    avgRating: 4.4,
    reviews: [
      { author: "Rebecca Stone", rating: 5, text: "The lox and cream cheese platter at $14 is pure NYC brunch perfection. Silky fish.", timeAgo: "1 month ago" },
      { author: "Sam Goldstein", rating: 5, text: "Best smoked fish in the city. The Super Heebster at $16 is worth every cent.", timeAgo: "3 months ago" },
      { author: "Clara Watson", rating: 4, text: "A Lower East Side institution. The chocolate babka is incredible too.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-15": {
    totalReviews: 1876,
    avgRating: 4.5,
    reviews: [
      { author: "Katie Brown", rating: 5, text: "Best bagel in NYC hands down. Cream cheese bagel for $4.50 and it is the size of your head.", timeAgo: "2 weeks ago" },
      { author: "Jordan West", rating: 5, text: "The everything bagel with scallion cream cheese is my weekly ritual. Always fresh.", timeAgo: "1 month ago" },
      { author: "Michelle Park", rating: 4, text: "Worth the trip to UWS. The pumpernickel bagel toasted with butter is heavenly.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-16": {
    totalReviews: 1543,
    avgRating: 4.3,
    reviews: [
      { author: "Brandon Harris", rating: 5, text: "Massive bagels with generous schmear for $5. The sesame with veggie cream cheese is my go-to.", timeAgo: "1 month ago" },
      { author: "Amy Chen", rating: 4, text: "Solid Midtown bagel shop. The egg everything bagel sandwich at $7 is a beast.", timeAgo: "3 months ago" },
      { author: "Robert Klein", rating: 4, text: "Always consistent. Great texture and chew. Real NY bagels done right.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-17": {
    totalReviews: 3456,
    avgRating: 4.5,
    reviews: [
      { author: "Carlos Mendez", rating: 5, text: "The adobada taco at $4.50 is the best taco in NYC. Perfectly spiced pork on fresh tortillas. Incredible.", timeAgo: "2 weeks ago" },
      { author: "Lisa Chang", rating: 5, text: "Chelsea Market gem. The carne asada tacos at $5 are worth every penny. Always a line.", timeAgo: "1 month ago" },
      { author: "Danny O'Brien", rating: 4, text: "Authentic LA-style tacos in NYC. Fresh tortillas made in front of you.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-18": {
    totalReviews: 876,
    avgRating: 3.4,
    reviews: [
      { author: "Tim Walker", rating: 3, text: "It is Taco Bell. Crunchwrap Supreme for $6 at 2am hits different though.", timeAgo: "1 month ago" },
      { author: "Ashley Kim", rating: 4, text: "NYC Taco Bell Cantina with booze. The cheesy gordita crunch never fails.", timeAgo: "3 months ago" },
      { author: "Omar Davis", rating: 3, text: "When you need cheap Mexican-ish food fast. Does the job for under $8.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-19": {
    totalReviews: 1234,
    avgRating: 4.2,
    reviews: [
      { author: "Trang Nguyen", rating: 5, text: "Best pho in Chinatown. The large beef pho at $9 has rich broth and generous noodles.", timeAgo: "2 weeks ago" },
      { author: "Mike O'Malley", rating: 4, text: "Authentic Vietnamese in a no-frills setting. The banh mi is great too at $7.", timeAgo: "1 month ago" },
      { author: "Linda Wu", rating: 4, text: "Old-school Chinatown restaurant. The spring rolls are crispy perfection.", timeAgo: "3 months ago" },
    ],
  },

  "nyc-20": {
    totalReviews: 1456,
    avgRating: 4.1,
    reviews: [
      { author: "Deepak Kumar", rating: 5, text: "Insane decor with Christmas lights everywhere. The chicken tikka masala at $10 is legit. BYOB is a huge plus.", timeAgo: "1 month ago" },
      { author: "Sally Johnson", rating: 4, text: "The atmosphere alone is worth the visit. Good value Indian food on Curry Row at $10 per plate.", timeAgo: "3 months ago" },
      { author: "Frank Torres", rating: 4, text: "Over the top decor, solid food, cheap prices. The garlic naan is excellent.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-21": {
    totalReviews: 876,
    avgRating: 4.1,
    reviews: [
      { author: "Narin Suwan", rating: 4, text: "Good pad thai for $8.50. Authentic wok flavor and proper tamarind tang. Quick lunch spot.", timeAgo: "1 month ago" },
      { author: "Jen Cooper", rating: 4, text: "Reliable Thai in Hell's Kitchen. The green curry at $10 has real Thai basil.", timeAgo: "3 months ago" },
      { author: "Victor Lee", rating: 4, text: "Affordable Thai food. The drunken noodles are spicy and flavorful.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-22": {
    totalReviews: 2345,
    avgRating: 3.7,
    reviews: [
      { author: "Elaine Benes", rating: 4, text: "Famous from Seinfeld but genuinely decent diner food. The $10 breakfast special is filling.", timeAgo: "2 weeks ago" },
      { author: "George C.", rating: 3, text: "More of a tourist spot these days. Food is fine but nothing special. Classic NYC diner vibes.", timeAgo: "1 month ago" },
      { author: "Kramer J.", rating: 4, text: "The BLT at $9 is honest diner food. Great coffee refills.", timeAgo: "6 months ago" },
    ],
  },

  "nyc-23": {
    totalReviews: 1234,
    avgRating: 3.8,
    reviews: [
      { author: "Victoria Ross", rating: 4, text: "Renovated Chelsea diner with a modern twist. The burger at $13 is well-made.", timeAgo: "1 month ago" },
      { author: "Derek Stone", rating: 3, text: "Upscale diner pricing but decent food. The meatloaf is good comfort food.", timeAgo: "3 months ago" },
      { author: "Monica Bell", rating: 4, text: "Nice atmosphere and solid diner classics. The milkshakes are thick and creamy.", timeAgo: "6 months ago" },
    ],
  },

  // =====================================================================
  // LONDON (seed-cities.ts) - ldn-1 to ldn-21
  // =====================================================================

  "ldn-1": {
    totalReviews: 3456,
    avgRating: 4.2,
    reviews: [
      { author: "James H.", rating: 5, text: "Proper fish and chips for \u00A310.50. The cod was flaky and the batter was perfectly crispy. Mushy peas are a must.", timeAgo: "2 weeks ago" },
      { author: "Sophie Williams", rating: 4, text: "Retro 1950s decor and generous portions. The haddock is even better than the cod.", timeAgo: "1 month ago" },
      { author: "Chen Wei", rating: 4, text: "Best fish and chips near Spitalfields. The pickled onions are a nice touch.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-2": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "William Clarke", rating: 5, text: "Classic chippy since 1914. The cod and chips at \u00A311 is perfectly cooked. BYOB policy is brilliant.", timeAgo: "1 month ago" },
      { author: "Ingrid Larsson", rating: 4, text: "Authentic British fish and chips in Marylebone. Cozy atmosphere and friendly service.", timeAgo: "3 months ago" },
      { author: "Tom Baker", rating: 4, text: "The deep-fried Mars bar at \u00A33.50 is a guilty pleasure. Great traditional chippy.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-3": {
    totalReviews: 2345,
    avgRating: 4.0,
    reviews: [
      { author: "Oliver Smith", rating: 4, text: "Half chicken with 2 sides for \u00A310. The peri-peri is addictive. Good pre-theatre meal in Soho.", timeAgo: "2 weeks ago" },
      { author: "Priya Sharma", rating: 4, text: "Consistent quality across all locations. The mango and lime chicken is my favourite.", timeAgo: "1 month ago" },
      { author: "Jack Murray", rating: 3, text: "Solid chain restaurant. Nothing surprising but always reliable. Extra hot sauce is the way.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-4": {
    totalReviews: 3456,
    avgRating: 3.7,
    reviews: [
      { author: "Dave Thompson", rating: 4, text: "Sausage roll for \u00A31.65 is still the best deal on the high street. Hot, flaky, and satisfying.", timeAgo: "1 month ago" },
      { author: "Charlotte Brown", rating: 4, text: "The steak bake at \u00A32 is an institution. Perfect lunch grab on a cold day.", timeAgo: "3 months ago" },
      { author: "Amir Khan", rating: 3, text: "Basic but cheap. The meal deal at \u00A33.50 for a sandwich, drink, and snack is decent value.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-5": {
    totalReviews: 4567,
    avgRating: 3.5,
    reviews: [
      { author: "Gary Wilson", rating: 4, text: "Cheapest pint in central London at \u00A33.50 for a guest ale. The curry club at \u00A37.50 is unbeatable value.", timeAgo: "2 weeks ago" },
      { author: "Sarah Jones", rating: 3, text: "Not fancy but you cannot beat Spoons prices. The breakfast at \u00A34.50 is a lifesaver.", timeAgo: "1 month ago" },
      { author: "Tomasz Kowalski", rating: 4, text: "Fish and chips for \u00A37.50 with a pint. Where else in Leicester Square can you do that?", timeAgo: "3 months ago" },
    ],
  },

  "ldn-6": {
    totalReviews: 1456,
    avgRating: 3.6,
    reviews: [
      { author: "Emily Clark", rating: 4, text: "Reliable sandwiches and coffee. The \u00A36 baguette with a flat white is a solid quick lunch.", timeAgo: "1 month ago" },
      { author: "Raj Patel", rating: 3, text: "Convenient but a bit pricey for what it is. The salads are fresh though.", timeAgo: "3 months ago" },
      { author: "Anna Mueller", rating: 4, text: "Good coffee and the hot wrap at \u00A34.50 is decent. Reliable everywhere in London.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-7": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Aisha Khan", rating: 5, text: "The bacon naan roll at \u00A37 for breakfast is genius. The black daal at \u00A38 is the best in London. Always a queue.", timeAgo: "2 weeks ago" },
      { author: "Mark Henderson", rating: 5, text: "Worth every minute of waiting. The lamb chops at \u00A312 are smoky and tender. Beautiful decor.", timeAgo: "1 month ago" },
      { author: "Yuki Tanaka", rating: 4, text: "Bombay cafe vibes done perfectly. The chai is fragrant and the okra fries are addictive.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-8": {
    totalReviews: 3456,
    avgRating: 4.4,
    reviews: [
      { author: "Hassan Ali", rating: 5, text: "The lamb chops at \u00A38 are the best in London. Charcoal grilled and incredibly tender. No booking needed.", timeAgo: "1 month ago" },
      { author: "Lisa Morgan", rating: 4, text: "BYOB and incredibly cheap. The mixed grill at \u00A312 could feed two people. Cash only.", timeAgo: "2 weeks ago" },
      { author: "Daniel Smith", rating: 5, text: "Whitechapel legend. The seekh kebab at \u00A35 is smoky perfection. Best value meal in East London.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-9": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Mohammed Rahman", rating: 5, text: "Massive lamb chops at \u00A37.50. BYOB keeps costs low. Queue outside but worth every second.", timeAgo: "2 weeks ago" },
      { author: "Karen White", rating: 4, text: "Incredible value Pakistani food. The mixed kebab platter at \u00A310 is a feast for two.", timeAgo: "1 month ago" },
      { author: "Steve Rogers", rating: 4, text: "The karahi chicken is aromatic and the naan is freshly baked. Total bill under \u00A315 per head.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-10": {
    totalReviews: 1876,
    avgRating: 4.4,
    reviews: [
      { author: "Kemal Ozturk", rating: 5, text: "Best ocakbasi in London. The adana kebab at \u00A39 is charcoal-grilled to perfection. Authentic Turkish.", timeAgo: "1 month ago" },
      { author: "Ben Taylor", rating: 4, text: "Dalston gem. The mixed grill is enormous and everything is cooked over charcoal.", timeAgo: "3 months ago" },
      { author: "Nina Petrov", rating: 4, text: "Great Turkish bread and hummus to start. The lamb shish is juicy and well-seasoned.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-11": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Ali Demir", rating: 5, text: "The beyti kebab at \u00A38.50 is wrapped and grilled to perfection. Great yogurt sauce on the side.", timeAgo: "2 weeks ago" },
      { author: "Rachel Green", rating: 4, text: "Fulham Road treasure. The pide at \u00A37 is fresh from the stone oven. Generous portions.", timeAgo: "1 month ago" },
      { author: "Paul Harris", rating: 4, text: "Reliable Turkish grill. The chicken wings are crispy and well-marinated.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-12": {
    totalReviews: 2876,
    avgRating: 3.8,
    reviews: [
      { author: "Johnny Wu", rating: 4, text: "Famously rude waiters but the food is good and fast. Roast duck with rice for \u00A38. Chinatown classic.", timeAgo: "1 month ago" },
      { author: "Emma Scott", rating: 3, text: "Massive portions and cheap prices. The service is an experience in itself. Go with a group.", timeAgo: "3 months ago" },
      { author: "Liam O'Brien", rating: 4, text: "Four floors of no-nonsense Chinese food. The sweet and sour pork at \u00A37.50 is solid.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-13": {
    totalReviews: 1876,
    avgRating: 4.1,
    reviews: [
      { author: "Wei Chen", rating: 5, text: "Xian-style biang biang noodles for \u00A37. Hand-pulled and spicy. Best street food in Chinatown.", timeAgo: "2 weeks ago" },
      { author: "Sophie Brown", rating: 4, text: "The dan dan noodles are rich and nutty. Small space but great vibe and cheap prices.", timeAgo: "1 month ago" },
      { author: "Ravi Kumar", rating: 4, text: "Authentic Chinese street food. The mapo tofu is properly spicy.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-14": {
    totalReviews: 1567,
    avgRating: 4.0,
    reviews: [
      { author: "Linh Tran", rating: 4, text: "Good pho for London at \u00A39.50. The broth is fragrant and the portions are generous.", timeAgo: "1 month ago" },
      { author: "Jack Wilson", rating: 4, text: "Reliable Vietnamese chain. The summer rolls and bun cha are both excellent.", timeAgo: "3 months ago" },
      { author: "Mei Lin", rating: 3, text: "Decent but not as authentic as the smaller Vietnamese places. Good for a quick meal.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-15": {
    totalReviews: 1234,
    avgRating: 4.2,
    reviews: [
      { author: "Hannah Foster", rating: 4, text: "The grilled cheese toastie at \u00A36.50 from the market stall is melty perfection. Great with the tomato soup.", timeAgo: "2 weeks ago" },
      { author: "Pete Mason", rating: 4, text: "Borough Market is pricey but this stall is reasonable. The raclette at \u00A38 is brilliant.", timeAgo: "1 month ago" },
      { author: "Claudia Muller", rating: 5, text: "Saturday morning tradition. Fresh ingredients and friendly vendors. Love it.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-16": {
    totalReviews: 3876,
    avgRating: 4.5,
    reviews: [
      { author: "Giulia Romano", rating: 5, text: "Hand-rolled pappardelle with ragu for \u00A38. Fresh pasta made right in front of you. The queue is worth it.", timeAgo: "1 month ago" },
      { author: "Matt Harrison", rating: 5, text: "Best value Italian in London by a mile. The cacio e pepe at \u00A37 is simple perfection.", timeAgo: "2 weeks ago" },
      { author: "Sarah Mitchell", rating: 4, text: "No reservations so expect to wait but the pasta is genuinely excellent.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-17": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Angela Liu", rating: 5, text: "The classic bao bun with pork belly at \u00A34.50 is tiny but incredibly flavourful. Order three.", timeAgo: "2 weeks ago" },
      { author: "Nick Thomas", rating: 4, text: "Small portions but amazing flavour. The fried chicken bao is outstanding.", timeAgo: "1 month ago" },
      { author: "Diana Chen", rating: 4, text: "Trendy Soho spot. The lamb shoulder bao at \u00A35 is my pick. Daikon fries are great too.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-18": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Richard Brooks", rating: 5, text: "Flat iron steak for \u00A311 is insane value. Perfectly cooked with a great chopped salad.", timeAgo: "1 month ago" },
      { author: "Laura Adams", rating: 4, text: "Free ice cream cone at the end! The steak is simple but really well done for the price.", timeAgo: "2 weeks ago" },
      { author: "James Wong", rating: 4, text: "No menu, just great steak. Multiple locations across London. Always consistent.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-19": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Marco Rossi", rating: 5, text: "Sourdough pizza from \u00A37.50. The slow-proved base is light and airy. Best budget pizza in London.", timeAgo: "2 weeks ago" },
      { author: "Helen Clarke", rating: 4, text: "Neapolitan-style pizza done right at a fraction of the price. The chorizo topping is excellent.", timeAgo: "1 month ago" },
      { author: "David Peters", rating: 4, text: "Multiple locations but quality stays high. Great for a quick cheap dinner.", timeAgo: "3 months ago" },
    ],
  },

  "ldn-20": {
    totalReviews: 1876,
    avgRating: 4.1,
    reviews: [
      { author: "Kate Morgan", rating: 4, text: "Honest burger with rosemary fries for \u00A311.50. The beef is quality and the buns are soft.", timeAgo: "1 month ago" },
      { author: "Sam Butler", rating: 4, text: "Great burger chain. The plant burger is surprisingly good. Nice craft beer selection.", timeAgo: "3 months ago" },
      { author: "Alex Kim", rating: 4, text: "One of the better burger chains in London. The bacon and cheese upgrade is worth it.", timeAgo: "6 months ago" },
    ],
  },

  "ldn-21": {
    totalReviews: 1234,
    avgRating: 3.7,
    reviews: [
      { author: "Tyrone Johnson", rating: 4, text: "2-piece chicken and chips for \u00A34.50. South London institution. Hit the spot after a night out.", timeAgo: "2 weeks ago" },
      { author: "Becky Smith", rating: 4, text: "Better than KFC and half the price. The spicy wings at \u00A33.50 are properly seasoned.", timeAgo: "1 month ago" },
      { author: "Kwame Asante", rating: 3, text: "Classic fried chicken shop. Not gourmet but cheap, fast, and satisfying.", timeAgo: "3 months ago" },
    ],
  },

  // =====================================================================
  // PARIS (seed-cities.ts) - par-1 to par-20
  // =====================================================================

  "par-1": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Marie Dupont", rating: 5, text: "The jambon-beurre baguette at \u20AC5.50 is classic Parisian. Fresh baguette, quality ham, real butter.", timeAgo: "2 weeks ago" },
      { author: "Thomas Mueller", rating: 4, text: "Excellent croissants at \u20AC1.80. Flaky, buttery, and perfectly golden. Great morning stop.", timeAgo: "1 month ago" },
      { author: "Lisa Park", rating: 4, text: "Beautiful bakery with high quality bread. The pain au chocolat is divine.", timeAgo: "3 months ago" },
    ],
  },

  "par-2": {
    totalReviews: 1876,
    avgRating: 4.4,
    reviews: [
      { author: "Pierre Leclerc", rating: 5, text: "The sourdough bread at \u20AC3 is the best in the quartier. Perfect crust and airy crumb.", timeAgo: "1 month ago" },
      { author: "Jennifer Adams", rating: 4, text: "Lovely bakery near Odeon. The quiche lorraine at \u20AC4.50 makes a great quick lunch.", timeAgo: "3 months ago" },
      { author: "Hans Weber", rating: 4, text: "Reliably excellent pastries. The eclair au chocolat at \u20AC5 is a work of art.", timeAgo: "6 months ago" },
    ],
  },

  "par-3": {
    totalReviews: 2876,
    avgRating: 3.8,
    reviews: [
      { author: "Sophie Martin", rating: 4, text: "The croque-monsieur at \u20AC5 is a reliable quick lunch. Everywhere in Paris and consistently decent.", timeAgo: "2 weeks ago" },
      { author: "Marco Bianchi", rating: 3, text: "Chain bakery but good for a quick sandwich at \u20AC5. Better than most fast food options.", timeAgo: "1 month ago" },
      { author: "Yuki Saito", rating: 4, text: "Great coffee and pastries. The formule at \u20AC7 with sandwich, drink, and dessert is good value.", timeAgo: "3 months ago" },
    ],
  },

  "par-4": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Camille Rousseau", rating: 5, text: "The complete galette at \u20AC8.50 with ham, cheese, and egg is perfectly crispy. Best crepes in Paris.", timeAgo: "1 month ago" },
      { author: "Brian Foster", rating: 4, text: "Upscale creperie in Le Marais. The buckwheat galettes are authentic Breton style.", timeAgo: "3 months ago" },
      { author: "Akiko Tanaka", rating: 4, text: "Beautiful presentation. The salted caramel crepe at \u20AC7 is an incredible dessert.", timeAgo: "6 months ago" },
    ],
  },

  "par-5": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Jean-Luc Moreau", rating: 5, text: "The galette saucisse at \u20AC4 is a perfect snack. Montparnasse creperie tradition at its best.", timeAgo: "2 weeks ago" },
      { author: "Anna Schmidt", rating: 4, text: "Authentic Breton crepes for \u20AC7. The andouille galette is smoky and delicious.", timeAgo: "1 month ago" },
      { author: "David Chen", rating: 4, text: "Great value creperie. The cidre goes perfectly with the savoury galettes.", timeAgo: "3 months ago" },
    ],
  },

  "par-6": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Rachel Gold", rating: 5, text: "The falafel special at \u20AC7.50 is enormous. Best value lunch in the Marais. Always a massive queue.", timeAgo: "2 weeks ago" },
      { author: "Mohamed Benali", rating: 5, text: "Crispy falafel, creamy hummus, fresh salad in warm pita. A Paris institution since the 1970s.", timeAgo: "1 month ago" },
      { author: "Katie Williams", rating: 4, text: "Worth the 20-minute wait. The eggplant and falafel combo is incredible.", timeAgo: "3 months ago" },
      { author: "Tomas Garcia", rating: 4, text: "Huge portions and everything is freshly made. The hot sauce is addictive.", timeAgo: "6 months ago" },
    ],
  },

  "par-7": {
    totalReviews: 2345,
    avgRating: 4.2,
    reviews: [
      { author: "Claire Dubois", rating: 4, text: "Slightly smaller queues than the neighbour. The falafel at \u20AC6.50 is just as good. Great hummus.", timeAgo: "1 month ago" },
      { author: "Peter Johnson", rating: 4, text: "Good alternative to the more famous spot next door. The shawarma at \u20AC7 is excellent.", timeAgo: "3 months ago" },
      { author: "Yuna Kim", rating: 5, text: "The mixed plate at \u20AC8 with falafel, hummus, and tabbouleh is a perfect Marais lunch.", timeAgo: "6 months ago" },
    ],
  },

  "par-8": {
    totalReviews: 1234,
    avgRating: 3.8,
    reviews: [
      { author: "Lucas Bernard", rating: 4, text: "Classic Latin Quarter kebab for \u20AC6. Good meat, fresh vegetables, and garlicky sauce. Late night saviour.", timeAgo: "2 weeks ago" },
      { author: "Emily Wright", rating: 3, text: "Standard Parisian kebab. Does the job after a night out. The fries are decent.", timeAgo: "1 month ago" },
      { author: "Ahmed Khalil", rating: 4, text: "Generous portions for the price. The chicken kebab with harissa is my go-to.", timeAgo: "3 months ago" },
    ],
  },

  "par-9": {
    totalReviews: 3456,
    avgRating: 4.3,
    reviews: [
      { author: "Linh Tran", rating: 5, text: "Best pho in Paris at \u20AC8. The broth is clear and deeply flavored. Like being in Saigon.", timeAgo: "1 month ago" },
      { author: "Jacques Martin", rating: 4, text: "The 13th arrondissement gem. Authentic Vietnamese pho at excellent prices.", timeAgo: "2 weeks ago" },
      { author: "Sarah Kim", rating: 4, text: "Huge bowls of pho with generous portions of beef. No frills, just great food.", timeAgo: "3 months ago" },
    ],
  },

  "par-10": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Thanh Nguyen", rating: 5, text: "Authentic pho bo at \u20AC7.50. The bo kho is also excellent. Real Vietnamese home cooking.", timeAgo: "2 weeks ago" },
      { author: "Isabelle Petit", rating: 4, text: "Less known than Pho 14 but just as good. The spring rolls are fresh and delicious.", timeAgo: "1 month ago" },
      { author: "Mike Chen", rating: 4, text: "Great value Vietnamese in the 13th. The banh cuon is delicate and flavourful.", timeAgo: "6 months ago" },
    ],
  },

  "par-11": {
    totalReviews: 1456,
    avgRating: 4.1,
    reviews: [
      { author: "Huy Pham", rating: 5, text: "The banh mi at \u20AC4.50 is loaded with pate, pickled vegetables, and fresh cilantro. Best in Paris.", timeAgo: "1 month ago" },
      { author: "Marie Claire", rating: 4, text: "Incredible value. The bo bun at \u20AC6.50 is fresh and flavourful with lots of herbs.", timeAgo: "3 months ago" },
      { author: "James Murphy", rating: 4, text: "Hidden gem in the 13th. Proper Vietnamese street food flavours.", timeAgo: "6 months ago" },
    ],
  },

  "par-12": {
    totalReviews: 876,
    avgRating: 3.6,
    reviews: [
      { author: "Paul Leroy", rating: 3, text: "Chain steakhouse. The steak-frites at \u20AC11 is okay but nothing special. Convenient location.", timeAgo: "1 month ago" },
      { author: "Karen Anderson", rating: 4, text: "Decent value for a sit-down meal near Bastille. The salads are surprisingly good.", timeAgo: "3 months ago" },
      { author: "Ricardo Silva", rating: 3, text: "Average chain restaurant. The entrecote at \u20AC14 is decent if you want a quick steak.", timeAgo: "6 months ago" },
    ],
  },

  "par-13": {
    totalReviews: 654,
    avgRating: 3.5,
    reviews: [
      { author: "Antoine Girard", rating: 3, text: "American-style grill chain. The ribs at \u20AC10 are okay. Good for kids.", timeAgo: "1 month ago" },
      { author: "Monica Hill", rating: 4, text: "Decent burger for \u20AC9.50. Not gourmet but fills you up. Good salad bar.", timeAgo: "3 months ago" },
      { author: "Stefan Koch", rating: 3, text: "Standard chain food. Come for the unlimited salad bar at \u20AC4 extra.", timeAgo: "6 months ago" },
    ],
  },

  "par-14": {
    totalReviews: 4987,
    avgRating: 4.4,
    reviews: [
      { author: "Elena Moretti", rating: 5, text: "Three-course French meal for \u20AC9. The steak tartare and the chocolate mousse are both excellent. Magical atmosphere.", timeAgo: "2 weeks ago" },
      { author: "John Davis", rating: 5, text: "Historic Parisian bouillon since 1896. The roast chicken at \u20AC8 with frites is classic comfort food.", timeAgo: "1 month ago" },
      { author: "Naomi Watanabe", rating: 4, text: "Stunning Belle Epoque dining room. The prix fixe at \u20AC12 is the best value in Paris.", timeAgo: "3 months ago" },
      { author: "Carlos Lopez", rating: 4, text: "Expect a wait but the experience is unforgettable. Real French bistro cooking at budget prices.", timeAgo: "6 months ago" },
    ],
  },

  "par-15": {
    totalReviews: 3456,
    avgRating: 4.3,
    reviews: [
      { author: "Amelie Fontaine", rating: 5, text: "Modern bouillon with the same concept. The duck confit at \u20AC9.50 is perfectly crispy.", timeAgo: "1 month ago" },
      { author: "Ben Cooper", rating: 4, text: "Newer than Chartier but equally good value. The onion soup at \u20AC5 is rich and cheesy.", timeAgo: "2 weeks ago" },
      { author: "Mia Johansson", rating: 4, text: "Gorgeous Pigalle location. The three-course menu at \u20AC13 is extraordinary value.", timeAgo: "3 months ago" },
    ],
  },

  "par-16": {
    totalReviews: 2345,
    avgRating: 4.2,
    reviews: [
      { author: "Philippe Garnier", rating: 5, text: "The chocolate mousse is legendary and unlimited. Main courses like bavette at \u20AC11.50 are well-executed.", timeAgo: "2 weeks ago" },
      { author: "Linda White", rating: 4, text: "Charming Marais bistro. Great wine list and the duck breast at \u20AC14 is beautifully cooked.", timeAgo: "1 month ago" },
      { author: "Hiro Tanaka", rating: 4, text: "Lovely atmosphere and honest French cooking. Save room for the famous mousse au chocolat.", timeAgo: "3 months ago" },
    ],
  },

  "par-17": {
    totalReviews: 987,
    avgRating: 4.0,
    reviews: [
      { author: "Li Wei", rating: 4, text: "Good Cantonese food in the 17th. The dim sum lunch at \u20AC8 is authentic and well-priced.", timeAgo: "1 month ago" },
      { author: "Sophie Laurent", rating: 4, text: "Reliable Chinese restaurant. The crispy duck at \u20AC12 is the highlight.", timeAgo: "3 months ago" },
      { author: "Tom Hardy", rating: 3, text: "Decent Chinese food for Paris. The portions are generous but nothing extraordinary.", timeAgo: "6 months ago" },
    ],
  },

  "par-18": {
    totalReviews: 2876,
    avgRating: 4.2,
    reviews: [
      { author: "Aurelie Blanc", rating: 5, text: "The bo bun at \u20AC8.50 is loaded with fresh herbs and crispy spring rolls. Canal Saint-Martin favourite.", timeAgo: "2 weeks ago" },
      { author: "Oscar Martinez", rating: 4, text: "Great Cambodian-Vietnamese fusion. The bobun is the thing to order. Always busy.", timeAgo: "1 month ago" },
      { author: "Jenny Lee", rating: 4, text: "Trendy spot with genuinely good food. The curry is coconut-rich and aromatic.", timeAgo: "3 months ago" },
    ],
  },

  "par-19": {
    totalReviews: 1876,
    avgRating: 4.3,
    reviews: [
      { author: "Nicolas Petit", rating: 5, text: "The Moroccan sandwich at \u20AC7 from the Marche des Enfants Rouges is magnificent. Juicy merguez and fresh salad.", timeAgo: "1 month ago" },
      { author: "Rachel Foster", rating: 4, text: "Best market food in Paris. The couscous sandwich is legendary. Come early for shorter queues.", timeAgo: "2 weeks ago" },
      { author: "David Kim", rating: 4, text: "Worth the wait. The flavours are incredible and the portions generous for market food.", timeAgo: "3 months ago" },
    ],
  },

  "par-20": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Yael Cohen", rating: 5, text: "The cauliflower pita at \u20AC8 is a revelation. Charred, fluffy bread stuffed with roasted vegetables.", timeAgo: "2 weeks ago" },
      { author: "Marc Dubois", rating: 4, text: "Israeli street food done brilliantly. The lamb kebab pita at \u20AC9 is juicy and well-spiced.", timeAgo: "1 month ago" },
      { author: "Emma Johnson", rating: 4, text: "Trendy but genuinely good. The baby chicken pita is my favourite lunch in Le Marais.", timeAgo: "3 months ago" },
    ],
  },

  // =====================================================================
  // SINGAPORE (seed-cities.ts) - sg-1 to sg-20
  // =====================================================================

  "sg-1": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Wei Ming Tan", rating: 5, text: "The chicken rice here is legendary. S$5 for silky poached chicken and fragrant rice. Worth the long queue.", timeAgo: "2 weeks ago" },
      { author: "Sarah Williams", rating: 5, text: "Michelin-recommended hawker stall. The chicken is incredibly tender and the chili sauce is perfect.", timeAgo: "1 month ago" },
      { author: "Raj Krishnan", rating: 4, text: "Best chicken rice in Singapore. Come before 11am to avoid the worst of the queue.", timeAgo: "3 months ago" },
      { author: "Lisa Chen", rating: 4, text: "The roasted version at S$5.50 has crispy skin that is divine. A Maxwell Food Centre must-try.", timeAgo: "6 months ago" },
    ],
  },

  "sg-2": {
    totalReviews: 2876,
    avgRating: 4.4,
    reviews: [
      { author: "Lim Ah Kow", rating: 5, text: "Slightly pricier at S$5.50 but the chicken quality is top notch. The bean sprouts are fresh.", timeAgo: "1 month ago" },
      { author: "Dave Brown", rating: 4, text: "Multiple outlets across Singapore. Consistent quality. Great soy sauce chicken option.", timeAgo: "3 months ago" },
      { author: "Mei Ling", rating: 4, text: "My family has been coming here for decades. The rice is perfectly cooked with chicken fat.", timeAgo: "6 months ago" },
    ],
  },

  "sg-3": {
    totalReviews: 3876,
    avgRating: 4.6,
    reviews: [
      { author: "Kenneth Goh", rating: 5, text: "Michelin-starred hawker! The bak chor mee at S$8 has an intense vinegar-and-chili kick. Outstanding noodles.", timeAgo: "2 weeks ago" },
      { author: "Amanda Lee", rating: 5, text: "Best pork noodles in Singapore. The dry version with vinegar dressing is incredibly addictive.", timeAgo: "1 month ago" },
      { author: "Peter Tan", rating: 4, text: "Queue can be over an hour but the noodles are transcendent. Get the large size.", timeAgo: "3 months ago" },
    ],
  },

  "sg-4": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Siti Aminah", rating: 4, text: "Classic satay at Lau Pa Sat for S$0.70 per stick. Order 10 sticks with ketupat for a great meal at S$9.", timeAgo: "1 month ago" },
      { author: "Jack Thompson", rating: 4, text: "The night satay stalls are atmospheric. Good chicken and mutton satay. Peanut sauce is rich.", timeAgo: "2 weeks ago" },
      { author: "Kim Soo-young", rating: 5, text: "Iconic hawker centre experience. The satay with the charcoal grill flavour is unmatched.", timeAgo: "3 months ago" },
    ],
  },

  "sg-5": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Jocelyn Teo", rating: 5, text: "Chwee kueh at S$3 for 6 pieces. Simple rice cakes with preserved radish. Old-school hawker perfection.", timeAgo: "2 weeks ago" },
      { author: "Mark Williams", rating: 4, text: "Unique Singaporean dish you can only find at hawker centres. The radish topping is savoury and addictive.", timeAgo: "1 month ago" },
      { author: "Nurul Huda", rating: 4, text: "A Tiong Bahru institution. The chwee kueh here is the benchmark for all others.", timeAgo: "3 months ago" },
    ],
  },

  "sg-6": {
    totalReviews: 2876,
    avgRating: 4.5,
    reviews: [
      { author: "Daniel Lim", rating: 5, text: "The original Katong laksa at S$6. Thick, creamy coconut broth with prawns and cockles. No chopsticks needed.", timeAgo: "1 month ago" },
      { author: "Emma Scott", rating: 4, text: "Rich and spicy laksa. They cut the noodles short so you eat with a spoon. Clever and delicious.", timeAgo: "3 months ago" },
      { author: "Ahmad Bin Ali", rating: 5, text: "Best laksa in Singapore. The coconut broth is incredibly rich and the sambal gives it great heat.", timeAgo: "6 months ago" },
    ],
  },

  "sg-7": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Grace Tan", rating: 5, text: "Only S$3 for a bowl of lemak laksa. The cheapest and most authentic laksa you will find. Cash only.", timeAgo: "2 weeks ago" },
      { author: "Steve Baker", rating: 4, text: "The old uncle has been making this laksa for decades. Queue early because it sells out fast.", timeAgo: "1 month ago" },
      { author: "Priya Nair", rating: 4, text: "No frills laksa stall. The broth is coconut-rich and the cockles are fresh.", timeAgo: "3 months ago" },
    ],
  },

  "sg-8": {
    totalReviews: 1876,
    avgRating: 4.4,
    reviews: [
      { author: "Vikram Singh", rating: 5, text: "The crispiest prata in Singapore at S$1.50 per piece. Flaky layers with curry dipping sauce. Amazing.", timeAgo: "1 month ago" },
      { author: "Michelle Teo", rating: 5, text: "Worth the trek to Jalan Kayu. The coin prata at S$1.50 is perfectly crispy. Add a teh tarik for S$1.50.", timeAgo: "2 weeks ago" },
      { author: "Chris Lee", rating: 4, text: "Best prata in Singapore. The egg prata at S$2 is golden and flaky. Open early morning.", timeAgo: "3 months ago" },
    ],
  },

  "sg-9": {
    totalReviews: 1567,
    avgRating: 4.3,
    reviews: [
      { author: "Anand Kumar", rating: 5, text: "24-hour prata house! The murtabak at S$5.50 is stuffed with spiced mutton. Perfect supper spot.", timeAgo: "2 weeks ago" },
      { author: "Jenny Lim", rating: 4, text: "Classic plain prata at S$1.30 with fish curry. The tissue prata at S$3 is crispy and fun.", timeAgo: "1 month ago" },
      { author: "Sam Morrison", rating: 4, text: "Great late-night prata. The cheese prata at S$3 is gooey and delicious.", timeAgo: "3 months ago" },
    ],
  },

  "sg-10": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Rachel Goh", rating: 5, text: "The most premium nasi lemak at S$10. Uses fresh coconut milk for the rice. Every element is perfect.", timeAgo: "1 month ago" },
      { author: "Tom Baker", rating: 4, text: "Expensive for nasi lemak but the quality is undeniable. The fried chicken wing is exceptionally crispy.", timeAgo: "3 months ago" },
      { author: "Fatimah Ismail", rating: 4, text: "Beautiful presentation and superb sambal. Worth the splurge for special nasi lemak.", timeAgo: "6 months ago" },
    ],
  },

  "sg-11": {
    totalReviews: 1876,
    avgRating: 4.4,
    reviews: [
      { author: "Hafiz Rahman", rating: 5, text: "Classic nasi lemak at S$4.50. The sambal is fiery and the ikan bilis are crispy. Open 24 hours.", timeAgo: "2 weeks ago" },
      { author: "Lucy Chen", rating: 4, text: "Best value nasi lemak in Singapore. The curry chicken add-on at S$1.50 is a must.", timeAgo: "1 month ago" },
      { author: "Derek Tan", rating: 4, text: "Late night nasi lemak institution. The portions are generous and everything is fresh.", timeAgo: "3 months ago" },
    ],
  },

  "sg-12": {
    totalReviews: 1234,
    avgRating: 3.8,
    reviews: [
      { author: "Karen Wong", rating: 4, text: "Classic kaya toast set for S$5.50. Crunchy bread, sweet kaya, and half-boiled eggs with kopi.", timeAgo: "1 month ago" },
      { author: "Paul Henderson", rating: 3, text: "Decent kopitiam chain. Good for a quick traditional breakfast. Nothing spectacular.", timeAgo: "3 months ago" },
      { author: "Devi Nair", rating: 4, text: "Reliable breakfast spot. The laksa at S$6 is surprisingly good for a chain.", timeAgo: "6 months ago" },
    ],
  },

  "sg-13": {
    totalReviews: 1876,
    avgRating: 4.0,
    reviews: [
      { author: "Benjamin Tan", rating: 4, text: "Iconic kaya toast since 1944. The set with two soft-boiled eggs and kopi for S$4.80 is a must-try.", timeAgo: "2 weeks ago" },
      { author: "Hannah Lee", rating: 4, text: "Thin crispy toast with thick kaya spread. The coffee is strong and sweet. Classic Singapore.", timeAgo: "1 month ago" },
      { author: "Arun Sharma", rating: 4, text: "Traditional kopitiam experience. Affordable and nostalgic. Multiple outlets everywhere.", timeAgo: "3 months ago" },
    ],
  },

  "sg-14": {
    totalReviews: 1567,
    avgRating: 3.9,
    reviews: [
      { author: "Eunice Loh", rating: 4, text: "The nasi lemak at S$5 is good for a kopitiam chain. Proper sambal and crispy ikan bilis.", timeAgo: "1 month ago" },
      { author: "Mike Santos", rating: 4, text: "Reliable traditional breakfast. The curry chicken noodle at S$5.50 is comforting.", timeAgo: "3 months ago" },
      { author: "Lily Tan", rating: 3, text: "Decent kopitiam chain. Good kopi but food is average compared to hawker centres.", timeAgo: "6 months ago" },
    ],
  },

  "sg-15": {
    totalReviews: 1456,
    avgRating: 4.3,
    reviews: [
      { author: "Simon Teo", rating: 5, text: "The curry chicken bee hoon at S$4.50 has rich, coconut-based curry and silky noodles. Hong Lim Complex gem.", timeAgo: "2 weeks ago" },
      { author: "Jasmine Lim", rating: 4, text: "Thick curry gravy that coats every strand of noodle. Add a drumstick for S$1 extra. Brilliant.", timeAgo: "1 month ago" },
      { author: "Dave Cooper", rating: 4, text: "Amazing hawker food. The curry broth is aromatic and the noodles are perfectly cooked.", timeAgo: "3 months ago" },
    ],
  },

  "sg-16": {
    totalReviews: 1234,
    avgRating: 4.4,
    reviews: [
      { author: "Matthew Goh", rating: 5, text: "Best char kway teow around. S$5 for smoky, wok-fried noodles with cockles and Chinese sausage.", timeAgo: "1 month ago" },
      { author: "Nina Wong", rating: 4, text: "Classic wok hei flavour. The uncle fries each plate individually. Worth the wait.", timeAgo: "2 weeks ago" },
      { author: "Ravi Pillai", rating: 4, text: "Proper old-school char kway teow. Lard gives it that authentic taste. Not for the health-conscious.", timeAgo: "3 months ago" },
    ],
  },

  "sg-17": {
    totalReviews: 987,
    avgRating: 4.2,
    reviews: [
      { author: "Jennifer Tan", rating: 4, text: "Good roast duck noodle at S$4.50. The duck is tender and the sauce is savoury-sweet.", timeAgo: "2 weeks ago" },
      { author: "Alex Lim", rating: 4, text: "Maxwell Food Centre staple. The char siew is caramelised perfectly. Great with wonton noodles.", timeAgo: "1 month ago" },
      { author: "Su Lin", rating: 5, text: "The roast meat combo plate at S$5 gives you duck, char siew, and roast pork. Unbeatable.", timeAgo: "3 months ago" },
    ],
  },

  "sg-18": {
    totalReviews: 2876,
    avgRating: 4.4,
    reviews: [
      { author: "Brandon Teo", rating: 5, text: "The bak kut teh at S$7.50 has a clear peppery broth with fall-off-the-bone pork ribs. Outstanding.", timeAgo: "1 month ago" },
      { author: "Emma Chan", rating: 4, text: "Iconic Teochew-style bak kut teh. Order extra you tiao to dip in the broth. Perfect rainy day food.", timeAgo: "2 weeks ago" },
      { author: "Alan Morrison", rating: 4, text: "Multiple outlets now but the original is still the best. Peppery and aromatic.", timeAgo: "3 months ago" },
    ],
  },

  "sg-19": {
    totalReviews: 2345,
    avgRating: 4.5,
    reviews: [
      { author: "Cheryl Lim", rating: 5, text: "Singapore-style ramen at S$6. The wanton noodle with spring onion oil is a modern hawker masterpiece.", timeAgo: "2 weeks ago" },
      { author: "Patrick Wong", rating: 4, text: "Michelin Bib Gourmand hawker stall. Creative take on local noodles. Worth the queue.", timeAgo: "1 month ago" },
      { author: "Maria Santos", rating: 4, text: "Beautiful presentation for hawker food. The chili sauce on the side adds great kick.", timeAgo: "3 months ago" },
    ],
  },

  "sg-20": {
    totalReviews: 876,
    avgRating: 4.1,
    reviews: [
      { author: "Terence Loh", rating: 4, text: "Old-school Fuzhou oyster cake at S$3.50. Crispy exterior with savoury pork and vegetable filling.", timeAgo: "1 month ago" },
      { author: "Dorothy Tay", rating: 4, text: "A Maxwell Food Centre classic. Only a few dollars for a satisfying crispy snack.", timeAgo: "3 months ago" },
      { author: "Ken White", rating: 5, text: "Traditional hawker snack that is disappearing. Get it while you can. Crispy and delicious.", timeAgo: "6 months ago" },
    ],
  },

  // =====================================================================
  // DUBAI (seed-cities.ts) - dxb-1 to dxb-20
  // =====================================================================

  "dxb-1": {
    totalReviews: 3456,
    avgRating: 4.4,
    reviews: [
      { author: "Ahmed Al-Rashid", rating: 5, text: "Best shawarma in Satwa. 15 AED for a massive chicken wrap with garlic sauce. A Dubai institution.", timeAgo: "2 weeks ago" },
      { author: "Sarah Mitchell", rating: 4, text: "The falafel wrap at 12 AED is fresh and crunchy. Great juice bar too. Open late.", timeAgo: "1 month ago" },
      { author: "Raj Gupta", rating: 5, text: "The mixed grill plate at 35 AED could feed two. Everything is freshly grilled. Amazing value.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-2": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Omar Khalil", rating: 4, text: "Massive shawarma wraps for 12 AED. The garlic sauce is addictive. Fast service even when busy.", timeAgo: "1 month ago" },
      { author: "Lisa Anderson", rating: 4, text: "Multiple locations in Karama. The chicken shawarma plate with rice for 18 AED is filling.", timeAgo: "3 months ago" },
      { author: "Deepak Verma", rating: 5, text: "Best value shawarma chain in Dubai. Cannot go wrong with the classic wrap.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-3": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Hasan Sharif", rating: 4, text: "Good Lebanese wraps at 18 AED. The beef shawarma is well-seasoned. JBR location is convenient.", timeAgo: "2 weeks ago" },
      { author: "Emily Clark", rating: 4, text: "Decent Middle Eastern chain. The manousheh at 14 AED is freshly baked and delicious.", timeAgo: "1 month ago" },
      { author: "Faisal Khan", rating: 4, text: "Reliable Lebanese food. The fattoush salad and hummus are both good starters.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-4": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Pradeep Singh", rating: 5, text: "Legendary Satwa restaurant. Butter chicken and naan for 15 AED. Best value meal in all of Dubai.", timeAgo: "2 weeks ago" },
      { author: "Michael Brown", rating: 5, text: "Been going here since the 1990s. The dal and roti for 12 AED is soul food. No frills, just great food.", timeAgo: "1 month ago" },
      { author: "Aisha Mohammed", rating: 4, text: "The mutton karahi at 25 AED is enormous. Bring friends and share. Cash only.", timeAgo: "3 months ago" },
      { author: "Tom Harris", rating: 4, text: "A Dubai institution. Queue outside but moves fast. The seekh kebab is smoky and juicy.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-5": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Vijay Menon", rating: 5, text: "North Indian classics done right. The biryani at 18 AED is aromatic and loaded with tender meat.", timeAgo: "1 month ago" },
      { author: "Sandra White", rating: 4, text: "Great value Indian in Karama. The paneer butter masala and garlic naan are excellent.", timeAgo: "2 weeks ago" },
      { author: "Mohammed Ali", rating: 4, text: "Reliable Indian restaurant. The tandoori chicken at 20 AED is well-marinated and smoky.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-6": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Sanjay Pillai", rating: 5, text: "Best Kerala food in Dubai. The fish curry with appam at 20 AED is authentic and flavourful.", timeAgo: "2 weeks ago" },
      { author: "Rachel Green", rating: 4, text: "Amazing South Indian food. The dosa at 12 AED is crispy and comes with three chutneys.", timeAgo: "1 month ago" },
      { author: "Fahad Al-Thani", rating: 4, text: "The Malabar biryani at 18 AED is fragrant and perfectly spiced. Great value.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-7": {
    totalReviews: 3876,
    avgRating: 4.3,
    reviews: [
      { author: "Imran Abbas", rating: 5, text: "The biryani at 14 AED is massive. Serves two easily. Best Pakistani biryani in Dubai.", timeAgo: "1 month ago" },
      { author: "Laura Martinez", rating: 4, text: "Multiple branches. The chicken karahi at 20 AED is tender and well-spiced.", timeAgo: "2 weeks ago" },
      { author: "Tariq Hussain", rating: 4, text: "24-hour restaurant. The haleem at 12 AED is thick, rich, and perfect for late nights.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-8": {
    totalReviews: 1876,
    avgRating: 4.3,
    reviews: [
      { author: "Hamid Ahmadi", rating: 5, text: "Authentic Afghan kebabs grilled over charcoal. The lamb chopan at 25 AED is magnificent.", timeAgo: "2 weeks ago" },
      { author: "Catherine Moore", rating: 4, text: "The Afghan bread baked in clay oven is incredible. The kebab platter at 35 AED is generous.", timeAgo: "1 month ago" },
      { author: "Ali Reza", rating: 4, text: "Best Afghan food in Deira. The mantoo at 20 AED are hand-made and delicious.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-9": {
    totalReviews: 1234,
    avgRating: 4.1,
    reviews: [
      { author: "Zaheer Khan", rating: 5, text: "The nihari at 12 AED is slow-cooked overnight and intensely flavourful. Real Karachi taste.", timeAgo: "1 month ago" },
      { author: "Steve Patterson", rating: 4, text: "Authentic Pakistani in Al Fahidi. The biryani at 10 AED is incredible value.", timeAgo: "3 months ago" },
      { author: "Amina Malik", rating: 4, text: "No-frills restaurant with outstanding food. The chapli kebab is crispy and well-spiced.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-10": {
    totalReviews: 2345,
    avgRating: 4.4,
    reviews: [
      { author: "Reza Tehrani", rating: 5, text: "Iranian kebab perfection. The koobideh at 25 AED with saffron rice is the gold standard.", timeAgo: "2 weeks ago" },
      { author: "Jennifer Walsh", rating: 4, text: "The lamb kubideh is juicy and charcoal-grilled to perfection. The joojeh at 28 AED is also great.", timeAgo: "1 month ago" },
      { author: "Navid Hosseini", rating: 4, text: "Bur Dubai institution. The Iranian tea is fragrant and the portions are very generous.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-11": {
    totalReviews: 1234,
    avgRating: 4.1,
    reviews: [
      { author: "Lama Al-Khalil", rating: 4, text: "Fresh kunafa for 10 AED. Crunchy, cheesy, and drizzled with syrup. Best Lebanese dessert.", timeAgo: "1 month ago" },
      { author: "Mike Thompson", rating: 4, text: "Great for shawarma and sweets. The chicken shawarma at 12 AED and a juice for 8 AED. Quick meal.", timeAgo: "3 months ago" },
      { author: "Fatima Hassan", rating: 5, text: "The pistachio kunafa is divine. Perfect sweet treat after dinner.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-12": {
    totalReviews: 876,
    avgRating: 3.9,
    reviews: [
      { author: "Saeed Abdullah", rating: 4, text: "Basic cafeteria food at great prices. Full breakfast for 10 AED. Chai karak for 3 AED.", timeAgo: "2 weeks ago" },
      { author: "Paul Kennedy", rating: 4, text: "Authentic workers cafeteria. The chapati and daal for 8 AED is a filling honest meal.", timeAgo: "1 month ago" },
      { author: "Yasmin Iqbal", rating: 3, text: "Very basic but incredibly cheap. Good for a quick chai and sandwich.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-13": {
    totalReviews: 1567,
    avgRating: 4.1,
    reviews: [
      { author: "Nadia Haddad", rating: 4, text: "Fun falafel chain. The wrap at 20 AED is colourful and packed with fresh ingredients.", timeAgo: "1 month ago" },
      { author: "Chris Baker", rating: 4, text: "Good value Lebanese fast food. The hummus bowl at 15 AED is smooth and well-seasoned.", timeAgo: "3 months ago" },
      { author: "Reem Al-Mansoori", rating: 4, text: "The mango falafel wrap is creative and delicious. Great healthy option in JLT.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-14": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Waleed Nasser", rating: 5, text: "Late-night Levantine street food. The mixed grill platter at 45 AED feeds two. Shisha and food combo.", timeAgo: "2 weeks ago" },
      { author: "Sophie Turner", rating: 4, text: "Great atmosphere and authentic food. The fatteh at 25 AED is crunchy and creamy.", timeAgo: "1 month ago" },
      { author: "Hassan Youssef", rating: 4, text: "The manakeesh at 15 AED with zaatar is freshly baked and delicious. Open until 4am.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-15": {
    totalReviews: 1567,
    avgRating: 4.0,
    reviews: [
      { author: "Maria Santos", rating: 4, text: "Filipino comfort food in Karama. The Chickenjoy meal at 18 AED is crispy and juicy. Taste of home.", timeAgo: "1 month ago" },
      { author: "Jose Reyes", rating: 5, text: "Best fried chicken chain. The spaghetti at 12 AED is uniquely sweet Filipino style.", timeAgo: "3 months ago" },
      { author: "Andy Chen", rating: 4, text: "Always packed with Filipino families. The peach mango pie at 6 AED is a must-try dessert.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-16": {
    totalReviews: 876,
    avgRating: 4.0,
    reviews: [
      { author: "Elena Cruz", rating: 5, text: "Authentic Filipino home cooking. The sinigang at 15 AED is sour and comforting. Reminds me of Manila.", timeAgo: "2 weeks ago" },
      { author: "Mark Rivera", rating: 4, text: "Great value Filipino food in Al Rigga. The adobo at 15 AED is well-seasoned.", timeAgo: "1 month ago" },
      { author: "Grace Santos", rating: 4, text: "Affordable Filipino meals. The kare-kare at 20 AED is rich and flavourful.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-17": {
    totalReviews: 1876,
    avgRating: 4.1,
    reviews: [
      { author: "Layla Ibrahim", rating: 5, text: "Fresh manoushe zaatar for 5 AED from the bakery counter. Best breakfast deal in Dubai.", timeAgo: "1 month ago" },
      { author: "Dan Wilson", rating: 4, text: "Incredible value Lebanese bakery. The cheese manoushe at 8 AED is freshly baked.", timeAgo: "2 weeks ago" },
      { author: "Maryam Khalil", rating: 4, text: "Traditional Lebanese bakery chain. The bread is always fresh and the fatayer are excellent.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-18": {
    totalReviews: 987,
    avgRating: 4.1,
    reviews: [
      { author: "Khalid Al-Suwaidi", rating: 4, text: "Fresh catch cooked to order. The grilled hammour at 30 AED is perfectly seasoned with lime.", timeAgo: "2 weeks ago" },
      { author: "Amy Morrison", rating: 4, text: "Simple cafeteria near the fish market. The fried fish meal at 20 AED with rice is satisfying.", timeAgo: "1 month ago" },
      { author: "Rashid Khan", rating: 4, text: "Fresh seafood at reasonable prices. The fish biryani at 22 AED is aromatic and generous.", timeAgo: "3 months ago" },
    ],
  },

  "dxb-19": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Irfan Malik", rating: 5, text: "The biryani at 16 AED is fragrant and loaded with tender chunks of meat. Karama legend.", timeAgo: "1 month ago" },
      { author: "Rachel Adams", rating: 4, text: "Great Indian-Pakistani food. The seekh kebab roll at 12 AED is smoky and perfectly spiced.", timeAgo: "3 months ago" },
      { author: "Samira Shah", rating: 4, text: "Reliable and affordable. The nihari on weekends at 18 AED is a must-try.", timeAgo: "6 months ago" },
    ],
  },

  "dxb-20": {
    totalReviews: 2876,
    avgRating: 4.5,
    reviews: [
      { author: "Noura Al-Harthi", rating: 5, text: "Fresh seafood cooked right on the beach. The fried fish platter at 35 AED is the freshest in Dubai.", timeAgo: "2 weeks ago" },
      { author: "James Cooper", rating: 5, text: "No menu, just point at the fish. Simple, fresh, and incredible. The shrimp at 40 AED is outstanding.", timeAgo: "1 month ago" },
      { author: "Priti Sharma", rating: 4, text: "Hidden gem in Jumeirah. Plastic chairs and paper plates but the seafood quality is unmatched.", timeAgo: "3 months ago" },
    ],
  },

  // =====================================================================
  // SYDNEY (seed-cities.ts) - syd-1 to syd-20
  // =====================================================================

  "syd-1": {
    totalReviews: 3456,
    avgRating: 4.4,
    reviews: [
      { author: "Michelle Tran", rating: 5, text: "Chat Thai pad see ew for A$14 is worth the queue. Fresh wok flavour every time. Haymarket legend.", timeAgo: "2 weeks ago" },
      { author: "David Park", rating: 4, text: "The green curry at A$16 is authentic Thai with proper heat. Best Thai in Sydney CBD.", timeAgo: "1 month ago" },
      { author: "Sophie Williams", rating: 4, text: "Always a queue but it moves fast. The som tum is perfectly sour and spicy.", timeAgo: "3 months ago" },
    ],
  },

  "syd-2": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Narin Suwannarat", rating: 4, text: "Solid Thai in Surry Hills. The basil chicken stir-fry at A$13 is properly spicy with Thai basil.", timeAgo: "1 month ago" },
      { author: "Jake Morrison", rating: 4, text: "Good value Thai food. The pad kra pao at A$14 has real holy basil flavour.", timeAgo: "3 months ago" },
      { author: "Lucy Chen", rating: 4, text: "Nice neighbourhood Thai spot. The pineapple fried rice at A$13 is a crowd pleaser.", timeAgo: "6 months ago" },
    ],
  },

  "syd-3": {
    totalReviews: 1876,
    avgRating: 4.3,
    reviews: [
      { author: "Trang Pham", rating: 5, text: "Rich pho bo at A$12 with clear, beefy broth and generous noodles. Closest to Vietnam in Sydney.", timeAgo: "2 weeks ago" },
      { author: "Ben Cooper", rating: 4, text: "Great pho and banh mi spot in Haymarket. The rare beef pho is perfectly done.", timeAgo: "1 month ago" },
      { author: "Linda Nguyen", rating: 4, text: "Authentic Vietnamese flavours. The beef stew pho at A$13 is rich and satisfying.", timeAgo: "3 months ago" },
    ],
  },

  "syd-4": {
    totalReviews: 2345,
    avgRating: 4.4,
    reviews: [
      { author: "Jason Lee", rating: 5, text: "The pork roll at A$8.50 is perfection. Crunchy baguette, pate, pickled carrot, and chili. Best banh mi in Sydney.", timeAgo: "1 month ago" },
      { author: "Kim Nguyen", rating: 5, text: "Worth the trip to Marrickville. Fresh baguettes and generous fillings. Cash only.", timeAgo: "2 weeks ago" },
      { author: "Emma Brown", rating: 4, text: "Legendary Vietnamese bakery. The special roll with all the extras at A$9.50 is incredible.", timeAgo: "3 months ago" },
    ],
  },

  "syd-5": {
    totalReviews: 2345,
    avgRating: 4.2,
    reviews: [
      { author: "Johnny Chan", rating: 4, text: "Late-night BBQ duck on rice for A$15. Been here since forever. Chinatown institution.", timeAgo: "2 weeks ago" },
      { author: "Pete Wilson", rating: 4, text: "The roast pork and duck combo at A$16 is enormous. Crispy skin on both.", timeAgo: "1 month ago" },
      { author: "Wei Lin", rating: 5, text: "Open till late. The BBQ pork is perfectly caramelised. Real Cantonese roast meat.", timeAgo: "3 months ago" },
    ],
  },

  "syd-6": {
    totalReviews: 1456,
    avgRating: 4.1,
    reviews: [
      { author: "Grace Zhang", rating: 4, text: "Hand-pulled noodles made fresh for A$12. The dan dan noodles are properly numbing.", timeAgo: "1 month ago" },
      { author: "Mark Harris", rating: 4, text: "Great Chinese noodle shop. The wonton noodle soup at A$11 is comforting and generous.", timeAgo: "3 months ago" },
      { author: "Mei Ling Tan", rating: 5, text: "Watching them pull the noodles is mesmerising. Chewy texture and flavourful broth.", timeAgo: "6 months ago" },
    ],
  },

  "syd-7": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Hannah Baker", rating: 4, text: "Fresh fish and chips from A$15. The barramundi is flaky and the chips are thick-cut.", timeAgo: "2 weeks ago" },
      { author: "Chris O'Donnell", rating: 4, text: "Best value at the fish market. Skip the restaurants and go to the takeaway counter.", timeAgo: "1 month ago" },
      { author: "Sophie Turner", rating: 5, text: "The oyster plate at A$18 for a dozen is incredibly fresh. Eat by the water.", timeAgo: "3 months ago" },
    ],
  },

  "syd-8": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Ian McGregor", rating: 4, text: "Classic fish and chips at A$14 after a day at Manly Beach. The battered flathead is crispy and fresh.", timeAgo: "1 month ago" },
      { author: "Kate Rogers", rating: 4, text: "Great location near the beach. The calamari at A$12 is tender and well-seasoned.", timeAgo: "3 months ago" },
      { author: "Tom Lee", rating: 4, text: "Reliable fish and chips. The grilled fish option at A$15 is lighter and just as good.", timeAgo: "6 months ago" },
    ],
  },

  "syd-9": {
    totalReviews: 1234,
    avgRating: 4.1,
    reviews: [
      { author: "Ali Demir", rating: 4, text: "Great kebab in Newtown. The mixed plate at A$15 has juicy meat and fresh salad. Open late.", timeAgo: "2 weeks ago" },
      { author: "Samantha Ross", rating: 4, text: "The lamb kebab wrap at A$11 is massive. Garlic sauce is garlicky perfection.", timeAgo: "1 month ago" },
      { author: "Dylan Moore", rating: 5, text: "Best late-night kebab in the inner west. The HSP at A$14 is loaded.", timeAgo: "3 months ago" },
    ],
  },

  "syd-10": {
    totalReviews: 1567,
    avgRating: 4.0,
    reviews: [
      { author: "Hassan Ali", rating: 4, text: "Reliable Lebanese fast food chain. The mixed plate at A$10.50 is good value near Town Hall.", timeAgo: "1 month ago" },
      { author: "Karen White", rating: 4, text: "Quick Lebanese lunch. The falafel wrap at A$9 is fresh and filling.", timeAgo: "3 months ago" },
      { author: "James Park", rating: 3, text: "Decent chain Lebanese. Nothing amazing but consistent and affordable.", timeAgo: "6 months ago" },
    ],
  },

  "syd-11": {
    totalReviews: 2345,
    avgRating: 4.1,
    reviews: [
      { author: "Bruce Henderson", rating: 4, text: "Iconic Sydney pie cart since 1938. The tiger pie at A$9.50 with mushy peas is a classic.", timeAgo: "2 weeks ago" },
      { author: "Jenny Mitchell", rating: 4, text: "Tourist spot but the pies are genuinely good. The chunky beef pie is filled to the brim.", timeAgo: "1 month ago" },
      { author: "Oliver Wright", rating: 5, text: "A Sydney institution. Grab a pie and sit by the harbour. The potato pie is excellent.", timeAgo: "3 months ago" },
    ],
  },

  "syd-12": {
    totalReviews: 987,
    avgRating: 3.7,
    reviews: [
      { author: "Nick Taylor", rating: 4, text: "Quick pie fix for A$8. The mince and cheese is a solid everyday pie. Multiple locations.", timeAgo: "1 month ago" },
      { author: "Lisa Brown", rating: 3, text: "Chain pie shop. Decent for a quick lunch. The coffee is better than expected.", timeAgo: "3 months ago" },
      { author: "Steve Chen", rating: 4, text: "Good late-night option. The sausage roll at A$6 is flaky and well-seasoned.", timeAgo: "6 months ago" },
    ],
  },

  "syd-13": {
    totalReviews: 1234,
    avgRating: 4.0,
    reviews: [
      { author: "Rebecca Foster", rating: 4, text: "Half chicken with sides for A$15. Classic peri-peri. Good option in the CBD.", timeAgo: "2 weeks ago" },
      { author: "Dan Cooper", rating: 4, text: "Reliable chicken chain. The lemon and herb butterfly is my go-to. Good value.", timeAgo: "1 month ago" },
      { author: "Sarah Kim", rating: 3, text: "Standard chain quality but always consistent. The corn on the cob is surprisingly good.", timeAgo: "3 months ago" },
    ],
  },

  "syd-14": {
    totalReviews: 2876,
    avgRating: 4.4,
    reviews: [
      { author: "Lina Tan", rating: 5, text: "Best Malaysian in Sydney. The roti canai at A$6 is flaky and the curry is rich. Always queuing.", timeAgo: "1 month ago" },
      { author: "Andrew Park", rating: 4, text: "The nasi lemak at A$14 is excellent. Proper sambal and crispy ikan bilis. Worth the wait.", timeAgo: "2 weeks ago" },
      { author: "Mei Wong", rating: 4, text: "Authentic Malaysian flavours. The satay is charcoal-grilled and the peanut sauce is perfect.", timeAgo: "3 months ago" },
    ],
  },

  "syd-15": {
    totalReviews: 1234,
    avgRating: 4.0,
    reviews: [
      { author: "Carlos Mendez", rating: 4, text: "Aussie Chipotle-style Mexican. The burrito at A$14 is loaded with fresh ingredients.", timeAgo: "2 weeks ago" },
      { author: "Jen Morrison", rating: 4, text: "Good fast-casual Mexican. The nachos at A$13 are great for sharing. Free chips with the app.", timeAgo: "1 month ago" },
      { author: "Harry Wilson", rating: 3, text: "Reliable chain Mexican. Nothing revolutionary but fills the gap.", timeAgo: "3 months ago" },
    ],
  },

  "syd-16": {
    totalReviews: 876,
    avgRating: 4.0,
    reviews: [
      { author: "Tara Brown", rating: 4, text: "Great vegan burgers that even non-vegans enjoy. The classic at A$16 is juicy and well-seasoned.", timeAgo: "1 month ago" },
      { author: "Mike Santos", rating: 4, text: "Best plant-based burger in Sydney. The loaded fries are incredible too.", timeAgo: "3 months ago" },
      { author: "Emily Green", rating: 3, text: "A bit pricey for a burger but the quality is there. Good for a treat.", timeAgo: "6 months ago" },
    ],
  },

  "syd-17": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Yuki Tanaka", rating: 5, text: "Fresh udon for A$13. You watch them make the noodles. The cold tsukimi udon is silky smooth.", timeAgo: "2 weeks ago" },
      { author: "James Lee", rating: 4, text: "Best value Japanese in the CBD. The curry udon at A$14 is thick, warming, and satisfying.", timeAgo: "1 month ago" },
      { author: "Annie Chen", rating: 4, text: "Self-service udon shop. Quick, cheap, and the noodles have great chewy texture.", timeAgo: "3 months ago" },
    ],
  },

  "syd-18": {
    totalReviews: 1876,
    avgRating: 4.3,
    reviews: [
      { author: "Scott Williams", rating: 4, text: "The shiromaru tonkotsu at A$18 has a rich, creamy pork broth. Premium ramen chain quality.", timeAgo: "1 month ago" },
      { author: "Naomi Kato", rating: 5, text: "Best ramen in Sydney CBD. The akamaru modern with garlic oil is incredible.", timeAgo: "2 weeks ago" },
      { author: "Peter Davis", rating: 4, text: "Pricier than other noodle shops but the broth quality is noticeably superior.", timeAgo: "3 months ago" },
    ],
  },

  "syd-19": {
    totalReviews: 3456,
    avgRating: 4.6,
    reviews: [
      { author: "Lauren Mitchell", rating: 5, text: "Best gelato in Sydney at A$8.50. The salted caramel and dark chocolate are extraordinary.", timeAgo: "2 weeks ago" },
      { author: "Dan Thompson", rating: 5, text: "Always a queue but the flavours are worth it. The panna cotta gelato is silky smooth.", timeAgo: "1 month ago" },
      { author: "Mei Lin", rating: 4, text: "Creative flavours that change regularly. The specials board always has something exciting.", timeAgo: "3 months ago" },
    ],
  },

  "syd-20": {
    totalReviews: 1567,
    avgRating: 4.3,
    reviews: [
      { author: "Chaminda Fernando", rating: 5, text: "Authentic Sri Lankan for A$15. The lamprais is wrapped in banana leaf and bursting with flavour.", timeAgo: "1 month ago" },
      { author: "Kate Robinson", rating: 4, text: "The kottu roti at A$14 is noisy and delicious. Chopped flatbread with curried vegetables.", timeAgo: "2 weeks ago" },
      { author: "Mark Santos", rating: 4, text: "Great hop of curry rice at A$13. Multiple curries, sambols, and perfectly cooked rice.", timeAgo: "3 months ago" },
    ],
  },

  // =====================================================================
  // TAIPEI (seed-cities.ts) - tpe-1 to tpe-21
  // =====================================================================

  "tpe-1": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Kevin Lin", rating: 5, text: "Crispy on the outside, chewy inside. NT$60 for this massive flatbread snack at Shilin Night Market. Must-try.", timeAgo: "2 weeks ago" },
      { author: "Sarah Johnson", rating: 4, text: "Unique night market snack. Fun to watch them make it. The scallion version is best.", timeAgo: "1 month ago" },
      { author: "Tomoki Sato", rating: 4, text: "Classic Shilin experience. Great value snack while exploring the night market.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-2": {
    totalReviews: 2876,
    avgRating: 4.3,
    reviews: [
      { author: "Michelle Chen", rating: 5, text: "Giant fried chicken bigger than your face at NT$70. Crispy, juicy, and perfectly spiced. Iconic.", timeAgo: "1 month ago" },
      { author: "James Park", rating: 4, text: "The original Hot Star chicken. Queue is long but moves fast. Best with extra pepper.", timeAgo: "2 weeks ago" },
      { author: "Yui Nakamura", rating: 4, text: "Must-eat at Shilin. The XXL size is absurd. Share with a friend if you want other food too.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-3": {
    totalReviews: 3876,
    avgRating: 4.5,
    reviews: [
      { author: "David Wong", rating: 5, text: "The pepper bun at NT$60 is Raohe Night Market essential. Crispy clay-oven crust with juicy pork filling.", timeAgo: "2 weeks ago" },
      { author: "Amy Zhang", rating: 5, text: "Watch them stick the buns in the clay oven. The black pepper and scallion filling is divine.", timeAgo: "1 month ago" },
      { author: "Ben Miller", rating: 4, text: "Worth the 30-minute queue. Hot, fragrant, and bursting with pepper flavour.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-4": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Tracy Lin", rating: 5, text: "Crispy taro balls at NT$50 for 4 pieces. Crunchy outside, creamy taro inside. Ningxia must-eat.", timeAgo: "1 month ago" },
      { author: "Mark Davis", rating: 4, text: "Unique night market treat. The egg yolk version is even better but sells out fast.", timeAgo: "2 weeks ago" },
      { author: "Haruki Yamada", rating: 4, text: "Get here early as the line gets crazy long. Worth the wait for these golden taro balls.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-5": {
    totalReviews: 4567,
    avgRating: 4.5,
    reviews: [
      { author: "Christine Wu", rating: 5, text: "The beef noodle soup at NT$200 has the richest broth in Taipei. Generous meat portions and chewy noodles.", timeAgo: "2 weeks ago" },
      { author: "Tom Anderson", rating: 5, text: "Best beef noodle in Yongkang Street area. The half-tendon half-meat version is incredible.", timeAgo: "1 month ago" },
      { author: "Mei-Ling Chang", rating: 4, text: "Iconic Taipei restaurant. The broth is deeply savoury and the braised beef is tender.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-6": {
    totalReviews: 2876,
    avgRating: 4.6,
    reviews: [
      { author: "Jason Huang", rating: 5, text: "The clear broth beef noodle at NT$180 is a masterpiece. Clean, beefy flavour with perfectly cooked tendons.", timeAgo: "1 month ago" },
      { author: "Kate Wilson", rating: 5, text: "Queue around the block but moves fast. The beef is incredibly tender and the noodles are hand-pulled.", timeAgo: "2 weeks ago" },
      { author: "Ryota Suzuki", rating: 4, text: "Worth the wait. The chili oil on the side adds great depth. Best beef noodle I have had.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-7": {
    totalReviews: 1567,
    avgRating: 4.3,
    reviews: [
      { author: "Steven Chen", rating: 5, text: "Hidden gem with beef noodle soup at NT$150. Incredibly rich broth and generous portions. No tourists.", timeAgo: "2 weeks ago" },
      { author: "Jessica Kim", rating: 4, text: "Local favourite. The red braised version is deeply flavourful. Good side dishes too.", timeAgo: "1 month ago" },
      { author: "Peter Liu", rating: 4, text: "Best value beef noodle in the area. The pickled vegetables on the side are a nice touch.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-8": {
    totalReviews: 1876,
    avgRating: 4.1,
    reviews: [
      { author: "Annie Lin", rating: 4, text: "Classic Taiwanese bento for NT$80. Pork chop over rice with pickled veg in a wooden box. Nostalgic.", timeAgo: "1 month ago" },
      { author: "Mike Chen", rating: 4, text: "Quick and cheap near Taipei Main Station. The fried chicken leg bento at NT$90 is excellent.", timeAgo: "3 months ago" },
      { author: "Sakura Ito", rating: 5, text: "Love the wooden bento box presentation. The flavours are simple but well-executed.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-9": {
    totalReviews: 2876,
    avgRating: 3.9,
    reviews: [
      { author: "Frank Wang", rating: 4, text: "Taiwan Railway bento at NT$60 is a national treasure. Simple pork chop rice that hits the spot every time.", timeAgo: "2 weeks ago" },
      { author: "Sarah Park", rating: 4, text: "Buy it at Taipei Station for the train. The NT$80 upgraded version has braised egg and tofu.", timeAgo: "1 month ago" },
      { author: "Kenji Tanaka", rating: 3, text: "Basic but nostalgic. Every Taiwanese person has memories of this bento. Good value.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-10": {
    totalReviews: 2345,
    avgRating: 4.2,
    reviews: [
      { author: "Diana Lee", rating: 4, text: "The original bubble tea shop. Pearl milk tea at NT$90 and the noodle set at NT$180 is a good combo.", timeAgo: "1 month ago" },
      { author: "Chris Brown", rating: 4, text: "Sit-down tea house with great food. The sun cake at NT$45 is a nice souvenir too.", timeAgo: "3 months ago" },
      { author: "Yuki Yamada", rating: 5, text: "Invented bubble tea! The original milk tea here tastes different from everywhere else. Worth visiting.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-11": {
    totalReviews: 1567,
    avgRating: 4.2,
    reviews: [
      { author: "Tony Chen", rating: 4, text: "Best bubble tea chain. Large pearl milk tea at NT$50 is perfectly sweet with chewy tapioca.", timeAgo: "2 weeks ago" },
      { author: "Emma Wright", rating: 4, text: "The yakult green tea at NT$45 is refreshing. Consistently good across all branches.", timeAgo: "1 month ago" },
      { author: "Hiro Takahashi", rating: 5, text: "Much better than the international chains. Fresh tea brewed daily and perfect sweetness level.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-12": {
    totalReviews: 4987,
    avgRating: 4.5,
    reviews: [
      { author: "Linda Wang", rating: 5, text: "Wake up at 5am for the thick soy milk and shaobing at NT$60. Flaky, sesame-crusted perfection.", timeAgo: "1 month ago" },
      { author: "Jake Morrison", rating: 5, text: "Best traditional breakfast in Taipei. The you tiao dipped in warm soy milk is incredible.", timeAgo: "2 weeks ago" },
      { author: "Saki Tanaka", rating: 4, text: "Iconic breakfast spot. Queue starts before 6am. The egg crepe at NT$35 is a must.", timeAgo: "3 months ago" },
      { author: "Dan Foster", rating: 4, text: "Worth the early morning wait. Authentic Taiwanese breakfast that you cannot get anywhere else.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-13": {
    totalReviews: 1876,
    avgRating: 4.0,
    reviews: [
      { author: "Grace Huang", rating: 4, text: "Classic soy milk breakfast. The sweet soy milk with you tiao for NT$55 is a perfect morning combo.", timeAgo: "2 weeks ago" },
      { author: "Paul Roberts", rating: 4, text: "Multiple locations. Good consistent Taiwanese breakfast at budget prices.", timeAgo: "1 month ago" },
      { author: "Miki Ota", rating: 3, text: "Standard breakfast chain. The shaobing with egg at NT$45 is decent but not as good as Fu Hang.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-14": {
    totalReviews: 1234,
    avgRating: 3.8,
    reviews: [
      { author: "Eric Chen", rating: 4, text: "Classic Taiwanese breakfast shop. The egg and corn toast at NT$50 is surprisingly good.", timeAgo: "1 month ago" },
      { author: "Kelly Adams", rating: 3, text: "Basic breakfast chain. The ham and egg burger at NT$45 is decent. Very affordable.", timeAgo: "3 months ago" },
      { author: "Takashi Mori", rating: 4, text: "Good for a quick cheap breakfast. The dan bing at NT$30 is the classic order.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-15": {
    totalReviews: 4567,
    avgRating: 4.6,
    reviews: [
      { author: "Angela Wu", rating: 5, text: "The braised pork rice at NT$50 is the benchmark. Rich, savoury, and the pork melts on your tongue.", timeAgo: "2 weeks ago" },
      { author: "Mike Johnson", rating: 5, text: "Best lu rou fan in Taipei. NT$50 for a bowl that tastes like it was simmered for days. Incredible.", timeAgo: "1 month ago" },
      { author: "Haruki Sato", rating: 4, text: "Long queue but fast turnover. The side dishes are also excellent. A Taipei must-eat.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-16": {
    totalReviews: 2876,
    avgRating: 4.1,
    reviews: [
      { author: "William Chen", rating: 4, text: "Classic chain lu rou fan at NT$55. Reliable and tasty. Multiple locations across Taipei.", timeAgo: "1 month ago" },
      { author: "Sandra Lee", rating: 4, text: "Good consistent braised pork rice. The braised egg at NT$15 extra is a must-add.", timeAgo: "3 months ago" },
      { author: "Yumi Nakagawa", rating: 4, text: "Not as legendary as Jin Feng but available everywhere. Solid comfort food.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-17": {
    totalReviews: 1876,
    avgRating: 4.2,
    reviews: [
      { author: "Danny Lin", rating: 5, text: "The lu rou fan with half-boiled egg at NT$60 in Ximending is perfect. Rich and savoury.", timeAgo: "2 weeks ago" },
      { author: "Rachel Kim", rating: 4, text: "Ximending night market staple. The oyster omelette at NT$65 is crispy and full of oysters.", timeAgo: "1 month ago" },
      { author: "Tom Williams", rating: 4, text: "Multiple dishes to try. The braised pork is the star but the soups are also great.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-18": {
    totalReviews: 4987,
    avgRating: 4.7,
    reviews: [
      { author: "Jennifer Chang", rating: 5, text: "10 pieces of xiao long bao at NT$200 is a fair price for perfection. Thin skin, rich broth inside.", timeAgo: "2 weeks ago" },
      { author: "Sam Mitchell", rating: 5, text: "The original Din Tai Fung experience. The truffle dumplings at NT$380 are next level.", timeAgo: "1 month ago" },
      { author: "Yuki Suzuki", rating: 5, text: "Worth the 45-minute wait. The shrimp and pork dumplings are my favourite in the world.", timeAgo: "3 months ago" },
      { author: "Laura Torres", rating: 4, text: "More expensive than street food but the quality is extraordinary. Fried rice is also excellent.", timeAgo: "6 months ago" },
    ],
  },

  "tpe-19": {
    totalReviews: 2345,
    avgRating: 4.3,
    reviews: [
      { author: "Brian Huang", rating: 4, text: "The danzai noodle at NT$80 is a small but flavourful bowl. The minced pork sauce is rich.", timeAgo: "1 month ago" },
      { author: "Kate Morrison", rating: 4, text: "Historic Tainan-style noodle shop. The shrimp broth adds incredible depth of flavour.", timeAgo: "2 weeks ago" },
      { author: "Kenichi Oda", rating: 4, text: "Small portions but big on taste. Order a few side dishes to make a full meal.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-20": {
    totalReviews: 1456,
    avgRating: 4.2,
    reviews: [
      { author: "Cindy Chen", rating: 5, text: "Pick your ingredients and they braise it all in lu wei sauce for NT$70 up. Fun and customizable.", timeAgo: "2 weeks ago" },
      { author: "Jason Park", rating: 4, text: "Night market experience at Shida. Choose tofu, vegetables, and meat, all braised together. Great value.", timeAgo: "1 month ago" },
      { author: "Mika Tanaka", rating: 4, text: "Unique DIY night market food. The braised duck blood and tofu are surprisingly delicious.", timeAgo: "3 months ago" },
    ],
  },

  "tpe-21": {
    totalReviews: 987,
    avgRating: 3.9,
    reviews: [
      { author: "Albert Lin", rating: 4, text: "Chain beef noodle for NT$100. Consistent and affordable. Good for a quick reliable lunch.", timeAgo: "1 month ago" },
      { author: "Nancy Wu", rating: 4, text: "Not the best beef noodle in Taipei but very convenient and well-priced. Multiple locations.", timeAgo: "3 months ago" },
      { author: "Shinji Yamamoto", rating: 3, text: "Standard chain quality. The broth is decent and the noodles are okay. Good value for the price.", timeAgo: "6 months ago" },
    ],
  },
};
