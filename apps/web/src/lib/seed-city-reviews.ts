/**
 * Reviews and AI summaries for multi-city restaurant data
 * ~2-3 reviews per restaurant, AI summaries for all restaurants
 */

export const CITY_REVIEWS: Array<{
  id: string;
  restaurantId: string;
  userName: string;
  userLevel: number;
  wasWorthIt: boolean;
  pricePaid: number;
  currency: string;
  tasteRating?: number;
  portionRating?: number;
  valueRating?: number;
  content: string;
  visitPurpose?: string;
  aiSummary?: string;
  helpfulCount: number;
  createdAt: string;
}> = [
  // =====================================================================
  // NEW YORK CITY
  // =====================================================================

  // nyc-1: Joe's Pizza
  { id: "nyc-r1", restaurantId: "nyc-1", userName: "NYCFoodie", userLevel: 3, wasWorthIt: true, pricePaid: 3.50, currency: "USD", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.8, content: "Best dollar slice in the Village. $3.50 gets you a massive NY-style fold-able slice with perfectly charred crust and tangy sauce. No frills, just great pizza.", visitPurpose: "daily_eats", helpfulCount: 34, createdAt: "2026-03-12T14:30:00Z" },
  { id: "nyc-r2", restaurantId: "nyc-1", userName: "ManhattanMike", userLevel: 2, wasWorthIt: true, pricePaid: 7.00, currency: "USD", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.5, content: "Grabbed two slices after a long walk through Washington Square. Still the benchmark for NYC pizza. Line moves fast even when it looks long.", visitPurpose: "solo_dining", helpfulCount: 18, createdAt: "2026-03-20T19:15:00Z" },

  // nyc-2: 2 Bros Pizza
  { id: "nyc-r3", restaurantId: "nyc-2", userName: "BudgetBitesBrooklyn", userLevel: 1, wasWorthIt: true, pricePaid: 1.50, currency: "USD", tasteRating: 3.5, portionRating: 4.0, valueRating: 5.0, content: "A dollar fifty for a full slice of pizza in midtown Manhattan. Is it the best pizza? No. Is it the best value in the city? Absolutely.", visitPurpose: "daily_eats", helpfulCount: 42, createdAt: "2026-03-05T12:00:00Z" },
  { id: "nyc-r4", restaurantId: "nyc-2", userName: "TouristTom_Ohio", userLevel: 1, wasWorthIt: true, pricePaid: 3.00, currency: "USD", tasteRating: 3.2, portionRating: 3.8, valueRating: 4.8, content: "Two slices for $3 total when you are hungry and broke in Times Square. Does the job perfectly. Just do not expect artisan quality.", visitPurpose: "daily_eats", helpfulCount: 15, createdAt: "2026-04-01T13:45:00Z" },

  // nyc-3: Prince St Pizza
  { id: "nyc-r5", restaurantId: "nyc-3", userName: "SliceHunterNYC", userLevel: 3, wasWorthIt: true, pricePaid: 5.50, currency: "USD", tasteRating: 4.8, portionRating: 4.2, valueRating: 4.5, content: "The spicy spring pepperoni square is worth every penny. Thick, crispy, loaded with cup-and-char pepperoni and chili oil. At $5.50 it is a premium slice but an absolute standout.", visitPurpose: "solo_dining", helpfulCount: 56, createdAt: "2026-03-18T18:00:00Z" },
  { id: "nyc-r6", restaurantId: "nyc-3", userName: "FoodieFromBK", userLevel: 2, wasWorthIt: true, pricePaid: 5.00, currency: "USD", tasteRating: 4.6, portionRating: 4.0, valueRating: 4.3, content: "Line was about 20 minutes on a Saturday but moved steadily. The pepperoni square lives up to the hype. Greasy in the best way possible.", visitPurpose: "date_night", helpfulCount: 22, createdAt: "2026-03-25T20:30:00Z" },

  // nyc-4: Chipotle
  { id: "nyc-r7", restaurantId: "nyc-4", userName: "QuickLunchMidtown", userLevel: 1, wasWorthIt: true, pricePaid: 11.50, currency: "USD", tasteRating: 3.8, portionRating: 4.5, valueRating: 4.0, content: "Reliable burrito bowl near Union Square. Ask for extra rice and beans for free. The portions are huge and it fills you up for the afternoon.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-10T12:30:00Z" },
  { id: "nyc-r8", restaurantId: "nyc-4", userName: "GymBroNYC", userLevel: 2, wasWorthIt: true, pricePaid: 12.00, currency: "USD", tasteRating: 3.5, portionRating: 4.8, valueRating: 3.8, content: "Double chicken bowl with fajita veggies. Great macros for the price. Not exciting but dependable post-workout fuel.", visitPurpose: "healthy_budget", helpfulCount: 12, createdAt: "2026-04-02T14:00:00Z" },

  // nyc-5: Shake Shack
  { id: "nyc-r9", restaurantId: "nyc-5", userName: "BurgerNerd212", userLevel: 3, wasWorthIt: true, pricePaid: 12.50, currency: "USD", tasteRating: 4.5, portionRating: 3.5, valueRating: 3.8, content: "The ShackBurger with cheese fries in Madison Square Park on a warm day is peak NYC lunch. Patty is juicy, the special sauce is addictive. Pricey for fast casual though.", visitPurpose: "date_night", helpfulCount: 29, createdAt: "2026-03-22T13:00:00Z" },
  { id: "nyc-r10", restaurantId: "nyc-5", userName: "VisitorFromLA", userLevel: 1, wasWorthIt: false, pricePaid: 15.00, currency: "USD", tasteRating: 4.0, portionRating: 3.0, valueRating: 3.2, content: "Good burger but $15 for a single burger and fries is steep. In-N-Out gives you more for less. The concrete shake was great though.", visitPurpose: "solo_dining", helpfulCount: 21, createdAt: "2026-03-28T17:30:00Z" },

  // nyc-6: Sweetgreen
  { id: "nyc-r11", restaurantId: "nyc-6", userName: "HealthyEatsEmma", userLevel: 2, wasWorthIt: false, pricePaid: 15.50, currency: "USD", tasteRating: 4.0, portionRating: 3.0, valueRating: 3.2, content: "Fresh salad with good ingredients but $15+ for a bowl of greens and grains feels excessive. The harvest bowl is tasty though.", visitPurpose: "healthy_budget", helpfulCount: 14, createdAt: "2026-03-15T12:15:00Z" },
  { id: "nyc-r12", restaurantId: "nyc-6", userName: "LunchBreakAnna", userLevel: 1, wasWorthIt: true, pricePaid: 14.00, currency: "USD", tasteRating: 4.2, portionRating: 3.5, valueRating: 3.5, content: "When you need something healthy in NoMad this is the go-to. The warm bowls are more filling than the salads. Mobile order to skip the line.", visitPurpose: "daily_eats", helpfulCount: 7, createdAt: "2026-04-03T12:45:00Z" },

  // nyc-7: Chick-fil-A
  { id: "nyc-r13", restaurantId: "nyc-7", userName: "ChickenFanatic", userLevel: 2, wasWorthIt: true, pricePaid: 9.50, currency: "USD", tasteRating: 4.3, portionRating: 3.8, valueRating: 4.2, content: "The spicy deluxe sandwich meal is consistently good. Friendly service even when the line wraps around the block. Lemonade is a must.", visitPurpose: "daily_eats", helpfulCount: 11, createdAt: "2026-03-08T18:30:00Z" },

  // nyc-8: Xi'an Famous Foods
  { id: "nyc-r14", restaurantId: "nyc-8", userName: "NoodleLoverNYC", userLevel: 3, wasWorthIt: true, pricePaid: 11.00, currency: "USD", tasteRating: 4.7, portionRating: 4.2, valueRating: 4.5, content: "The cumin lamb hand-pulled noodles for $11 are incredible. Chewy, bouncy noodles with fragrant cumin spice and tender lamb. One of the best budget meals in midtown.", visitPurpose: "solo_dining", helpfulCount: 67, createdAt: "2026-03-14T13:00:00Z" },
  { id: "nyc-r15", restaurantId: "nyc-8", userName: "SpiceSeeker", userLevel: 2, wasWorthIt: true, pricePaid: 9.50, currency: "USD", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.6, content: "Liang pi cold skin noodles are my go-to summer lunch. Spicy, tangy, refreshing. The portions are generous and everything is made fresh. Absolute gem.", visitPurpose: "daily_eats", helpfulCount: 31, createdAt: "2026-03-30T12:30:00Z" },

  // nyc-9: Wonton Noodle
  { id: "nyc-r16", restaurantId: "nyc-9", userName: "ChinatownRegular", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "USD", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.7, content: "Wonton noodle soup for under $8 in Manhattan. Plump shrimp wontons, thin egg noodles, clear savory broth. Old school Chinatown at its finest.", visitPurpose: "daily_eats", helpfulCount: 19, createdAt: "2026-03-11T11:30:00Z" },
  { id: "nyc-r17", restaurantId: "nyc-9", userName: "NYCSoupDumpling", userLevel: 1, wasWorthIt: true, pricePaid: 7.00, currency: "USD", tasteRating: 4.2, portionRating: 3.8, valueRating: 4.5, content: "Cash only, no frills, just excellent wonton noodles. The kind of place your Chinese grandma would approve of. Get there early before the lunch rush.", visitPurpose: "solo_dining", helpfulCount: 14, createdAt: "2026-04-01T12:00:00Z" },

  // nyc-10: Joe's Shanghai
  { id: "nyc-r18", restaurantId: "nyc-10", userName: "XLBExpert", userLevel: 3, wasWorthIt: true, pricePaid: 14.00, currency: "USD", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.2, content: "The soup dumplings here are the real deal. Thin skin, rich pork broth inside, served piping hot. Split a few dishes with friends and you eat well for under $15 each.", visitPurpose: "group_party", helpfulCount: 38, createdAt: "2026-03-16T19:00:00Z" },
  { id: "nyc-r19", restaurantId: "nyc-10", userName: "DateNightDuo", userLevel: 2, wasWorthIt: true, pricePaid: 12.00, currency: "USD", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.0, content: "Shared the crab and pork soup dumplings plus turnip shortcakes. Every dish delivered. Communal seating adds to the bustling Chinatown vibe.", visitPurpose: "date_night", helpfulCount: 16, createdAt: "2026-03-29T20:00:00Z" },

  // nyc-11: The Halal Guys
  { id: "nyc-r20", restaurantId: "nyc-11", userName: "LateNightMuncher", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "USD", tasteRating: 4.5, portionRating: 4.9, valueRating: 4.7, content: "The combo platter with white sauce at 2am is a NYC rite of passage. Mountains of chicken and rice for $8.50. Warning: the hot sauce is seriously hot.", visitPurpose: "late_night", helpfulCount: 52, createdAt: "2026-03-21T02:30:00Z" },
  { id: "nyc-r21", restaurantId: "nyc-11", userName: "MidtownWorker", userLevel: 1, wasWorthIt: true, pricePaid: 8.00, currency: "USD", tasteRating: 4.3, portionRating: 4.8, valueRating: 4.6, content: "Best value near Rockefeller Center. The chicken platter is enormous. Bring your own drink to save a couple bucks. Line looks long but moves fast.", visitPurpose: "daily_eats", helpfulCount: 23, createdAt: "2026-04-02T12:45:00Z" },

  // nyc-12: Rafiqi's Halal Food
  { id: "nyc-r22", restaurantId: "nyc-12", userName: "CartConnoisseur", userLevel: 1, wasWorthIt: true, pricePaid: 7.00, currency: "USD", tasteRating: 4.0, portionRating: 4.5, valueRating: 4.5, content: "Solid halal cart chicken over rice for $7. Not as famous as the Halal Guys but shorter wait and the lamb gyro combo is really good.", visitPurpose: "daily_eats", helpfulCount: 9, createdAt: "2026-03-19T13:00:00Z" },

  // nyc-13: Katz's Delicatessen
  { id: "nyc-r23", restaurantId: "nyc-13", userName: "DeliDaveNYC", userLevel: 3, wasWorthIt: true, pricePaid: 24.00, currency: "USD", tasteRating: 4.9, portionRating: 4.8, valueRating: 3.8, content: "The pastrami sandwich is $24 but it is a full pound of hand-cut meat. Split one with someone and add a knish on the side. Iconic for a reason.", visitPurpose: "family_dinner", helpfulCount: 44, createdAt: "2026-03-09T13:30:00Z" },
  { id: "nyc-r24", restaurantId: "nyc-13", userName: "FirstTimerSarah", userLevel: 1, wasWorthIt: false, pricePaid: 28.00, currency: "USD", tasteRating: 4.7, portionRating: 4.5, valueRating: 3.2, content: "Amazing pastrami but $28 with a drink and tip makes this a splurge, not a budget eat. Worth trying once for the experience though.", visitPurpose: "solo_dining", helpfulCount: 18, createdAt: "2026-04-01T14:00:00Z" },

  // nyc-14: Russ & Daughters
  { id: "nyc-r25", restaurantId: "nyc-14", userName: "BagelQueen", userLevel: 2, wasWorthIt: true, pricePaid: 14.00, currency: "USD", tasteRating: 4.8, portionRating: 3.8, valueRating: 4.0, content: "The classic bagel with lox and cream cheese is a work of art. Silky smoked salmon, pillowy cream cheese, everything bagel. Worth every cent.", visitPurpose: "solo_dining", helpfulCount: 27, createdAt: "2026-03-23T10:30:00Z" },

  // nyc-15: Absolute Bagels
  { id: "nyc-r26", restaurantId: "nyc-15", userName: "UWSMorningPerson", userLevel: 2, wasWorthIt: true, pricePaid: 4.50, currency: "USD", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.8, content: "Fresh-baked everything bagel with scallion cream cheese for $4.50. Warm, chewy, perfectly toasted. Best bagel on the Upper West Side.", visitPurpose: "daily_eats", helpfulCount: 33, createdAt: "2026-03-13T08:15:00Z" },
  { id: "nyc-r27", restaurantId: "nyc-15", userName: "ColumbiaStudent", userLevel: 1, wasWorthIt: true, pricePaid: 5.00, currency: "USD", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.7, content: "My go-to breakfast before class. The egg and cheese on a sesame bagel is filling and cheap. Cash only so come prepared.", visitPurpose: "daily_eats", helpfulCount: 11, createdAt: "2026-03-31T07:45:00Z" },

  // nyc-16: Ess-a-Bagel
  { id: "nyc-r28", restaurantId: "nyc-16", userName: "BagelPurist", userLevel: 3, wasWorthIt: true, pricePaid: 5.50, currency: "USD", tasteRating: 4.5, portionRating: 4.5, valueRating: 4.5, content: "These bagels are comically large. A pumpernickel everything with veggie cream cheese barely fits in your hand. Perfect Sunday morning fuel.", visitPurpose: "daily_eats", helpfulCount: 20, createdAt: "2026-03-16T09:00:00Z" },

  // nyc-17: Los Tacos No.1
  { id: "nyc-r29", restaurantId: "nyc-17", userName: "TacoTuesdayNYC", userLevel: 2, wasWorthIt: true, pricePaid: 9.00, currency: "USD", tasteRating: 4.8, portionRating: 3.8, valueRating: 4.5, content: "Three adobada tacos for $9 in Chelsea Market. Perfectly charred pork, fresh corn tortillas, great salsa verde. These compete with LA tacos honestly.", visitPurpose: "solo_dining", helpfulCount: 41, createdAt: "2026-03-17T13:30:00Z" },
  { id: "nyc-r30", restaurantId: "nyc-17", userName: "WeekendWanderer", userLevel: 1, wasWorthIt: true, pricePaid: 8.00, currency: "USD", tasteRating: 4.6, portionRating: 3.9, valueRating: 4.5, content: "The cactus taco is surprisingly good. Simple, fresh, and packed with flavor. Chelsea Market is touristy but these tacos are the real thing.", visitPurpose: "date_night", helpfulCount: 15, createdAt: "2026-04-03T14:00:00Z" },

  // nyc-18: Taco Bell
  { id: "nyc-r31", restaurantId: "nyc-18", userName: "BrokeSeniorNYU", userLevel: 1, wasWorthIt: true, pricePaid: 5.50, currency: "USD", tasteRating: 3.0, portionRating: 4.0, valueRating: 4.2, content: "The Cravings Value Menu is unbeatable when you are a student on a budget. Two burritos and a drink for under $6 near Union Square. It is what it is.", visitPurpose: "late_night", helpfulCount: 8, createdAt: "2026-03-26T23:30:00Z" },

  // nyc-19: Thai Son
  { id: "nyc-r32", restaurantId: "nyc-19", userName: "PhoPhilosopher", userLevel: 2, wasWorthIt: true, pricePaid: 9.50, currency: "USD", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.4, content: "Big bowl of rare beef pho for under $10 in Chinatown. The broth has real depth, star anise and cinnamon notes. Add hoisin and sriracha to taste. Comforting.", visitPurpose: "solo_dining", helpfulCount: 17, createdAt: "2026-03-12T18:00:00Z" },

  // nyc-20: Panna II Garden
  { id: "nyc-r33", restaurantId: "nyc-20", userName: "CurryKingEV", userLevel: 2, wasWorthIt: true, pricePaid: 10.00, currency: "USD", tasteRating: 4.0, portionRating: 4.5, valueRating: 4.3, content: "The decor alone is worth the visit, Christmas lights everywhere. Chicken tikka masala with naan for $10 is a steal for the East Village. BYOB to save more.", visitPurpose: "date_night", helpfulCount: 25, createdAt: "2026-03-20T19:30:00Z" },

  // nyc-21: Pad Thai
  { id: "nyc-r34", restaurantId: "nyc-21", userName: "HellsKitchenHank", userLevel: 1, wasWorthIt: true, pricePaid: 8.50, currency: "USD", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.4, content: "Generous pad thai with shrimp for $8.50. Nothing fancy but consistently good. Great option before a show in the theater district.", visitPurpose: "daily_eats", helpfulCount: 10, createdAt: "2026-03-24T17:00:00Z" },

  // nyc-22: Tom's Restaurant
  { id: "nyc-r35", restaurantId: "nyc-22", userName: "SeinfeldPilgrim", userLevel: 1, wasWorthIt: false, pricePaid: 12.00, currency: "USD", tasteRating: 3.5, portionRating: 4.0, valueRating: 3.5, content: "Famous from the TV show but the food is average diner fare. Pancakes are decent, coffee is bottomless. Come for the nostalgia, not the food.", visitPurpose: "solo_dining", helpfulCount: 13, createdAt: "2026-03-15T10:00:00Z" },
  { id: "nyc-r36", restaurantId: "nyc-22", userName: "MorningsideResident", userLevel: 2, wasWorthIt: true, pricePaid: 10.00, currency: "USD", tasteRating: 3.8, portionRating: 4.3, valueRating: 4.0, content: "Solid neighborhood diner. The eggs and hash browns plate with toast is $10 and fills you up. Not trendy but reliable.", visitPurpose: "daily_eats", helpfulCount: 6, createdAt: "2026-04-02T09:30:00Z" },

  // nyc-23: Empire Diner
  { id: "nyc-r37", restaurantId: "nyc-23", userName: "ChelseaCreative", userLevel: 2, wasWorthIt: false, pricePaid: 14.00, currency: "USD", tasteRating: 3.8, portionRating: 3.8, valueRating: 3.5, content: "Cool retro diner vibe but prices are a bit high for what you get. The meatloaf is good, the milkshakes are thick. More of a scene than a deal.", visitPurpose: "date_night", helpfulCount: 9, createdAt: "2026-03-27T20:00:00Z" },

  // =====================================================================
  // LONDON
  // =====================================================================

  // ldn-1: Poppies Fish & Chips
  { id: "ldn-r1", restaurantId: "ldn-1", userName: "LondonEats", userLevel: 3, wasWorthIt: true, pricePaid: 11.00, currency: "GBP", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.2, content: "The fish and chips at Poppies is the real deal. Crispy batter, fresh cod, proper mushy peas and a pickled egg on the side. Retro Spitalfields charm.", visitPurpose: "solo_dining", helpfulCount: 38, createdAt: "2026-03-10T13:00:00Z" },
  { id: "ldn-r2", restaurantId: "ldn-1", userName: "ChipShopCharlie", userLevel: 2, wasWorthIt: true, pricePaid: 10.50, currency: "GBP", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.0, content: "Proper East End fish and chips. The haddock is even better than the cod. Splash of malt vinegar, chunk of lemon, sorted for the day.", visitPurpose: "daily_eats", helpfulCount: 22, createdAt: "2026-03-28T12:30:00Z" },

  // ldn-2: The Golden Hind
  { id: "ldn-r3", restaurantId: "ldn-2", userName: "MarylebneFoodie", userLevel: 2, wasWorthIt: true, pricePaid: 11.50, currency: "GBP", tasteRating: 4.6, portionRating: 4.2, valueRating: 4.3, content: "Been coming here for years. The chips are hand-cut and the batter is light and crispy. Proper old-school chippy that has not changed. Brilliant.", visitPurpose: "family_dinner", helpfulCount: 19, createdAt: "2026-03-14T18:30:00Z" },

  // ldn-3: Nando's
  { id: "ldn-r4", restaurantId: "ldn-3", userName: "NandosNathan", userLevel: 1, wasWorthIt: true, pricePaid: 10.50, currency: "GBP", tasteRating: 4.0, portionRating: 4.0, valueRating: 4.0, content: "The butterfly chicken with extra hot peri-peri and a side of corn is my go-to. Unlimited refills on the soft drinks. Decent lunch in Soho.", visitPurpose: "group_party", helpfulCount: 12, createdAt: "2026-03-20T13:15:00Z" },
  { id: "ldn-r5", restaurantId: "ldn-3", userName: "UniStudentLou", userLevel: 1, wasWorthIt: true, pricePaid: 9.00, currency: "GBP", tasteRating: 4.1, portionRating: 3.8, valueRating: 4.2, content: "Quarter chicken with rice and a bottomless drink for under a tenner. Consistent quality and the chilli jam is addictive. Student staple.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-04-01T12:45:00Z" },

  // ldn-4: Greggs
  { id: "ldn-r6", restaurantId: "ldn-4", userName: "GreggsFanatic", userLevel: 1, wasWorthIt: true, pricePaid: 3.50, currency: "GBP", tasteRating: 3.5, portionRating: 3.8, valueRating: 4.8, content: "Sausage roll and a coffee for under four quid on the Strand. Not gourmet but it is hot, flaky, and hits the spot on a cold London morning.", visitPurpose: "daily_eats", helpfulCount: 25, createdAt: "2026-03-07T08:30:00Z" },
  { id: "ldn-r7", restaurantId: "ldn-4", userName: "CommuterCarl", userLevel: 1, wasWorthIt: true, pricePaid: 4.00, currency: "GBP", tasteRating: 3.6, portionRating: 3.5, valueRating: 4.7, content: "The steak bake is properly filling for the price. Grab one before the train. The vegan sausage roll is surprisingly decent too.", visitPurpose: "daily_eats", helpfulCount: 15, createdAt: "2026-03-22T07:45:00Z" },

  // ldn-5: Wetherspoons
  { id: "ldn-r8", restaurantId: "ldn-5", userName: "PubGrubPete", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 3.3, portionRating: 4.5, valueRating: 4.5, content: "Full English breakfast with a pint for under eight quid near Leicester Square. The food is basic but the portions are massive and the price is unbeatable.", visitPurpose: "daily_eats", helpfulCount: 30, createdAt: "2026-03-09T09:30:00Z" },
  { id: "ldn-r9", restaurantId: "ldn-5", userName: "BudgetBritBlogger", userLevel: 2, wasWorthIt: true, pricePaid: 8.00, currency: "GBP", tasteRating: 3.2, portionRating: 4.6, valueRating: 4.3, content: "Burger and chips with a cheap pint. You know what you are getting with Spoons. Massive portions, carpet of questionable vintage, reliable value.", visitPurpose: "group_party", helpfulCount: 18, createdAt: "2026-04-02T18:00:00Z" },

  // ldn-6: Pret A Manger
  { id: "ldn-r10", restaurantId: "ldn-6", userName: "OfficeLunchLisa", userLevel: 1, wasWorthIt: true, pricePaid: 6.50, currency: "GBP", tasteRating: 3.8, portionRating: 3.3, valueRating: 3.8, content: "The baguettes are fresh and the coffee is better than most chains. Good quick lunch option near Victoria station. Subscribe for cheaper coffees.", visitPurpose: "daily_eats", helpfulCount: 7, createdAt: "2026-03-18T12:30:00Z" },

  // ldn-7: Dishoom
  { id: "ldn-r11", restaurantId: "ldn-7", userName: "BombayDreamer", userLevel: 3, wasWorthIt: true, pricePaid: 13.00, currency: "GBP", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.0, content: "The bacon naan roll at brunch is legendary. Black daal cooked for 24 hours is silky perfection. Queue at opening to avoid the hour-long wait.", visitPurpose: "date_night", helpfulCount: 45, createdAt: "2026-03-15T11:00:00Z" },
  { id: "ldn-r12", restaurantId: "ldn-7", userName: "CoventGardenChloe", userLevel: 2, wasWorthIt: true, pricePaid: 12.00, currency: "GBP", tasteRating: 4.5, portionRating: 3.8, valueRating: 4.0, content: "The chicken ruby curry is rich and aromatic. Share a few small plates and it works out to about 12 quid each. Buzzy atmosphere, great chai.", visitPurpose: "group_party", helpfulCount: 28, createdAt: "2026-03-30T19:30:00Z" },

  // ldn-8: Tayyabs
  { id: "ldn-r13", restaurantId: "ldn-8", userName: "CurryMileKing", userLevel: 3, wasWorthIt: true, pricePaid: 8.00, currency: "GBP", tasteRating: 4.6, portionRating: 4.5, valueRating: 4.7, content: "Tayyabs is always packed but the lamb chops at 4.50 are legendary. Sizzling, charred, tender. Add a biryani to share and you feast for under a tenner each.", visitPurpose: "group_party", helpfulCount: 55, createdAt: "2026-03-11T19:00:00Z" },
  { id: "ldn-r14", restaurantId: "ldn-8", userName: "WhitechapelWendy", userLevel: 2, wasWorthIt: true, pricePaid: 9.00, currency: "GBP", tasteRating: 4.4, portionRating: 4.3, valueRating: 4.5, content: "The mixed grill platter is enormous. Dry meat curry with naan is authentic Punjabi flavors. BYO to save on drinks. Cash only.", visitPurpose: "family_dinner", helpfulCount: 22, createdAt: "2026-04-03T20:00:00Z" },

  // ldn-9: Lahore Kebab House
  { id: "ldn-r15", restaurantId: "ldn-9", userName: "KebabKingLDN", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 4.5, portionRating: 4.6, valueRating: 4.8, content: "Seekh kebab with naan and chutney for 7.50. The lamb is fresh off the grill, smoky and spiced perfectly. Best kebab house in East London, full stop.", visitPurpose: "late_night", helpfulCount: 37, createdAt: "2026-03-13T22:00:00Z" },
  { id: "ldn-r16", restaurantId: "ldn-9", userName: "EastLondonEater", userLevel: 1, wasWorthIt: true, pricePaid: 8.00, currency: "GBP", tasteRating: 4.3, portionRating: 4.5, valueRating: 4.6, content: "The karahi is brilliant. Rich, tomatoey, with chunks of tender lamb. Massive naan to mop it all up. Queue out the door on weekends but it moves.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-29T13:30:00Z" },

  // ldn-10: Mangal 1
  { id: "ldn-r17", restaurantId: "ldn-10", userName: "DalstonDiner", userLevel: 2, wasWorthIt: true, pricePaid: 9.50, currency: "GBP", tasteRating: 4.7, portionRating: 4.3, valueRating: 4.5, content: "The mixed grill is incredible value. Juicy chicken wings, lamb kofte, and adana kebab over charcoal. The bread comes fresh off the ocakbasi grill.", visitPurpose: "date_night", helpfulCount: 21, createdAt: "2026-03-17T20:00:00Z" },

  // ldn-11: Best Mangal
  { id: "ldn-r18", restaurantId: "ldn-11", userName: "FulhamFoodie", userLevel: 2, wasWorthIt: true, pricePaid: 9.00, currency: "GBP", tasteRating: 4.3, portionRating: 4.5, valueRating: 4.4, content: "Huge chicken shish wrap with salad and garlic sauce for under nine quid. Portions are very generous. Great after a night out in Fulham.", visitPurpose: "late_night", helpfulCount: 12, createdAt: "2026-03-22T23:30:00Z" },

  // ldn-12: Wong Kei
  { id: "ldn-r19", restaurantId: "ldn-12", userName: "ChinatownCharles", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "GBP", tasteRating: 3.9, portionRating: 4.5, valueRating: 4.5, content: "Four floors of no-nonsense Chinese food. Wonton noodle soup is proper. Staff are famously rude but it is part of the charm. Portions are huge.", visitPurpose: "daily_eats", helpfulCount: 26, createdAt: "2026-03-08T19:00:00Z" },

  // ldn-13: Baozi Inn
  { id: "ldn-r20", restaurantId: "ldn-13", userName: "StreetFoodSam", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 4.3, portionRating: 3.8, valueRating: 4.5, content: "The dan dan noodles are fiery and addictive. Sichuan street food vibes in the heart of Chinatown. Small portions but big flavors. Order a couple dishes.", visitPurpose: "solo_dining", helpfulCount: 16, createdAt: "2026-03-25T13:00:00Z" },

  // ldn-14: Pho
  { id: "ldn-r21", restaurantId: "ldn-14", userName: "SohoSlurper", userLevel: 1, wasWorthIt: true, pricePaid: 10.00, currency: "GBP", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.0, content: "Solid pho in Soho. The rare beef version is fragrant with star anise and the portions are generous. Good value for the area. Nice fresh spring rolls too.", visitPurpose: "solo_dining", helpfulCount: 10, createdAt: "2026-03-19T12:30:00Z" },

  // ldn-15: Borough Market Stall
  { id: "ldn-r22", restaurantId: "ldn-15", userName: "MarketMaven", userLevel: 2, wasWorthIt: true, pricePaid: 7.00, currency: "GBP", tasteRating: 4.5, portionRating: 3.5, valueRating: 4.2, content: "The raclette grilled cheese at Borough Market is gooey, stretchy perfection. Best enjoyed sitting by the river. Get there before noon to avoid the crush.", visitPurpose: "date_night", helpfulCount: 19, createdAt: "2026-03-15T11:30:00Z" },

  // ldn-16: Padella
  { id: "ldn-r23", restaurantId: "ldn-16", userName: "PastaPatricia", userLevel: 3, wasWorthIt: true, pricePaid: 8.50, currency: "GBP", tasteRating: 4.8, portionRating: 3.8, valueRating: 4.7, content: "Fresh handmade pici cacio e pepe for 8 quid in central London. The pasta is silky, the sauce is peppery and rich. Queue for 30 minutes but so worth it.", visitPurpose: "date_night", helpfulCount: 62, createdAt: "2026-03-12T18:30:00Z" },
  { id: "ldn-r24", restaurantId: "ldn-16", userName: "BoroughBridget", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 4.6, portionRating: 3.5, valueRating: 4.5, content: "The beef shin pappardelle is rich and deeply savory. Incredible value for handmade pasta. Come at opening or prepare to wait.", visitPurpose: "solo_dining", helpfulCount: 30, createdAt: "2026-04-01T12:00:00Z" },

  // ldn-17: Bao
  { id: "ldn-r25", restaurantId: "ldn-17", userName: "BaoLover", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 4.5, portionRating: 3.3, valueRating: 4.2, content: "The classic pork bao is pillowy soft with braised pork belly and crushed peanuts. Small but perfectly formed. Order a few with the fried chicken too.", visitPurpose: "solo_dining", helpfulCount: 18, createdAt: "2026-03-21T13:00:00Z" },

  // ldn-18: Flat Iron
  { id: "ldn-r26", restaurantId: "ldn-18", userName: "SteakSteveUK", userLevel: 2, wasWorthIt: true, pricePaid: 11.00, currency: "GBP", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.6, content: "A flat iron steak with a side salad for 11 quid in Soho. Properly cooked, rested, served on a wooden board. Free ice cream cone at the end. Absolute steal.", visitPurpose: "date_night", helpfulCount: 35, createdAt: "2026-03-16T19:30:00Z" },

  // ldn-19: Franco Manca
  { id: "ldn-r27", restaurantId: "ldn-19", userName: "PizzaPilgrimFan", userLevel: 1, wasWorthIt: true, pricePaid: 7.50, currency: "GBP", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.6, content: "Sourdough pizza for under 8 quid. The number 4 with nduja and mozzarella is my favourite. Blistered crust, tangy dough, no fuss. Brilliant chain.", visitPurpose: "family_dinner", helpfulCount: 14, createdAt: "2026-03-24T18:00:00Z" },

  // ldn-20: Honest Burgers
  { id: "ldn-r28", restaurantId: "ldn-20", userName: "BurgerBenLDN", userLevel: 2, wasWorthIt: true, pricePaid: 12.00, currency: "GBP", tasteRating: 4.3, portionRating: 4.0, valueRating: 3.8, content: "The tribute burger with bacon and pickled onion is great. Rosemary salted chips are the real star. A bit pricey but quality beef and good bun.", visitPurpose: "group_party", helpfulCount: 11, createdAt: "2026-03-26T19:00:00Z" },

  // ldn-21: Morleys
  { id: "ldn-r29", restaurantId: "ldn-21", userName: "SouthLondonSam", userLevel: 1, wasWorthIt: true, pricePaid: 4.50, currency: "GBP", tasteRating: 3.5, portionRating: 4.5, valueRating: 4.6, content: "Two pieces of fried chicken, chips, and a drink for 4.50. South London institution. Crispy, greasy, exactly what you need after a night out.", visitPurpose: "late_night", helpfulCount: 20, createdAt: "2026-03-23T01:00:00Z" },
  { id: "ldn-r30", restaurantId: "ldn-21", userName: "PeckhamPete", userLevel: 1, wasWorthIt: true, pricePaid: 5.00, currency: "GBP", tasteRating: 3.7, portionRating: 4.3, valueRating: 4.5, content: "The chicken burger meal deal is unbeatable for the price. Not fancy but it does the job. Every south Londoner has their local Morleys.", visitPurpose: "daily_eats", helpfulCount: 9, createdAt: "2026-04-02T20:30:00Z" },

  // =====================================================================
  // PARIS
  // =====================================================================

  // par-1: Maison Kayser
  { id: "par-r1", restaurantId: "par-1", userName: "ParisiennePatricia", userLevel: 2, wasWorthIt: true, pricePaid: 5.50, currency: "EUR", tasteRating: 4.5, portionRating: 3.5, valueRating: 4.3, content: "A jambon-beurre on fresh baguette for 5.50. The butter is real, the ham is quality. Simple French perfection in the Marais.", visitPurpose: "daily_eats", helpfulCount: 18, createdAt: "2026-03-10T12:00:00Z" },
  { id: "par-r2", restaurantId: "par-1", userName: "CroissantCritic", userLevel: 3, wasWorthIt: true, pricePaid: 6.00, currency: "EUR", tasteRating: 4.6, portionRating: 3.4, valueRating: 4.2, content: "The almond croissant is heavenly. Flaky, buttery layers with fragrant almond cream. Pair it with an espresso for the perfect Parisian morning.", visitPurpose: "solo_dining", helpfulCount: 24, createdAt: "2026-03-28T08:30:00Z" },

  // par-2: Eric Kayser
  { id: "par-r3", restaurantId: "par-2", userName: "BoulangerieNerd", userLevel: 2, wasWorthIt: true, pricePaid: 6.00, currency: "EUR", tasteRating: 4.6, portionRating: 3.4, valueRating: 4.2, content: "The pain au chocolat here is one of the best in Paris. Perfectly laminated, dark chocolate, shatteringly crisp exterior. Also try the tartines.", visitPurpose: "daily_eats", helpfulCount: 15, createdAt: "2026-03-14T09:00:00Z" },

  // par-3: Paul
  { id: "par-r4", restaurantId: "par-3", userName: "TouristeTina", userLevel: 1, wasWorthIt: true, pricePaid: 5.50, currency: "EUR", tasteRating: 3.8, portionRating: 3.5, valueRating: 4.0, content: "Reliable chain bakery near Chatelet. The croque monsieur is hot and cheesy. Not the most exciting but good value in a very touristy area.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-20T13:00:00Z" },

  // par-4: Breizh Cafe
  { id: "par-r5", restaurantId: "par-4", userName: "CrepeLover", userLevel: 2, wasWorthIt: true, pricePaid: 9.00, currency: "EUR", tasteRating: 4.5, portionRating: 3.8, valueRating: 4.0, content: "The buckwheat galette with egg, ham, and gruyere is perfectly crispy on the edges and soft in the center. Proper Breton style. The cider is great too.", visitPurpose: "date_night", helpfulCount: 20, createdAt: "2026-03-16T19:00:00Z" },

  // par-5: La Creperie de Josselin
  { id: "par-r6", restaurantId: "par-5", userName: "MontparnasseLocal", userLevel: 2, wasWorthIt: true, pricePaid: 7.00, currency: "EUR", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.5, content: "The complete galette for 7 euros near Montparnasse is excellent. Crispy edges, runny egg, salty ham. Follow with a sweet Nutella crepe for dessert.", visitPurpose: "solo_dining", helpfulCount: 16, createdAt: "2026-03-22T12:30:00Z" },

  // par-6: L'As du Fallafel
  { id: "par-r7", restaurantId: "par-6", userName: "MaraisMichel", userLevel: 3, wasWorthIt: true, pricePaid: 7.50, currency: "EUR", tasteRating: 4.7, portionRating: 4.5, valueRating: 4.8, content: "The special falafel at 7 euros is massive and delicious. Crispy falafel, grilled eggplant, hummus, tahini, all stuffed into warm pita. Queue is worth it.", visitPurpose: "daily_eats", helpfulCount: 72, createdAt: "2026-03-08T13:00:00Z" },
  { id: "par-r8", restaurantId: "par-6", userName: "VeganVoyageur", userLevel: 2, wasWorthIt: true, pricePaid: 7.00, currency: "EUR", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.7, content: "Best falafel I have ever had. The veggie version is packed with fried eggplant and cabbage. Eat it on the street in the Marais. Pure joy.", visitPurpose: "solo_dining", helpfulCount: 35, createdAt: "2026-04-01T12:30:00Z" },

  // par-7: Maison du Falafel
  { id: "par-r9", restaurantId: "par-7", userName: "FalafelFighter", userLevel: 1, wasWorthIt: true, pricePaid: 6.50, currency: "EUR", tasteRating: 4.3, portionRating: 4.2, valueRating: 4.5, content: "Just across from the more famous one but shorter queue and nearly as good. The schnitzel falafel combo is a hidden gem. Cheaper too.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-19T14:00:00Z" },

  // par-8: Kebab de la Huchette
  { id: "par-r10", restaurantId: "par-8", userName: "LatinQuarterLuc", userLevel: 1, wasWorthIt: true, pricePaid: 6.00, currency: "EUR", tasteRating: 3.8, portionRating: 4.2, valueRating: 4.3, content: "Solid doner kebab for 6 euros in the Latin Quarter. Not gourmet but the meat is freshly carved and the frites are crispy. Good late-night option.", visitPurpose: "late_night", helpfulCount: 10, createdAt: "2026-03-25T23:00:00Z" },

  // par-9: Pho 14
  { id: "par-r11", restaurantId: "par-9", userName: "ParisPhoFan", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "EUR", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.6, content: "The pho in the 13th arrondissement is as good as anything in Saigon. Rich beef broth, generous noodles, fresh herbs. Big bowl for 8.50 euros is a steal.", visitPurpose: "solo_dining", helpfulCount: 28, createdAt: "2026-03-11T12:00:00Z" },
  { id: "par-r12", restaurantId: "par-9", userName: "AsianFoodParis", userLevel: 3, wasWorthIt: true, pricePaid: 8.00, currency: "EUR", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.5, content: "Consistently the best Vietnamese in Paris. The broth simmers for hours and you can tell. Order the rare beef pho with extra lime. Cash only.", visitPurpose: "daily_eats", helpfulCount: 20, createdAt: "2026-03-30T13:00:00Z" },

  // par-10: Pho Tai
  { id: "par-r13", restaurantId: "par-10", userName: "Quartier13Adrien", userLevel: 1, wasWorthIt: true, pricePaid: 7.50, currency: "EUR", tasteRating: 4.3, portionRating: 4.2, valueRating: 4.5, content: "Similar quality to Pho 14 next door but usually a shorter queue. The chicken pho is lighter and fragrant. Great budget meal in Chinatown.", visitPurpose: "daily_eats", helpfulCount: 11, createdAt: "2026-03-18T12:30:00Z" },

  // par-11: Song Huong
  { id: "par-r14", restaurantId: "par-11", userName: "BanhMiBrigitte", userLevel: 2, wasWorthIt: true, pricePaid: 4.50, currency: "EUR", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.8, content: "The banh mi here is incredible. Crispy baguette, pork pate, pickled daikon and carrot, cilantro, all for 4.50 euros. Unbeatable value.", visitPurpose: "daily_eats", helpfulCount: 32, createdAt: "2026-03-13T11:30:00Z" },

  // par-12: Hippopotamus
  { id: "par-r15", restaurantId: "par-12", userName: "BistroBlaise", userLevel: 1, wasWorthIt: false, pricePaid: 12.00, currency: "EUR", tasteRating: 3.5, portionRating: 4.0, valueRating: 3.5, content: "Basic grill chain. The steak is overcooked and the frites are frozen. Save your euros for a proper bistro. Only good if you need a quick sit-down.", visitPurpose: "family_dinner", helpfulCount: 7, createdAt: "2026-03-21T19:30:00Z" },

  // par-13: Buffalo Grill
  { id: "par-r16", restaurantId: "par-13", userName: "TexMexTheo", userLevel: 1, wasWorthIt: false, pricePaid: 11.00, currency: "EUR", tasteRating: 3.3, portionRating: 4.2, valueRating: 3.6, content: "French attempt at an American grill. The ribs are decent but nothing special. Good for kids who want burgers. Better options nearby for the price.", visitPurpose: "family_dinner", helpfulCount: 5, createdAt: "2026-03-27T18:30:00Z" },

  // par-14: Bouillon Chartier
  { id: "par-r17", restaurantId: "par-14", userName: "ParisBistro", userLevel: 3, wasWorthIt: true, pricePaid: 9.00, currency: "EUR", tasteRating: 4.3, portionRating: 4.5, valueRating: 4.7, content: "A three-course French meal for under 15 euros in a stunning Belle Epoque dining room. The steak tartare is classic, the profiteroles are generous. An essential Paris experience.", visitPurpose: "date_night", helpfulCount: 58, createdAt: "2026-03-09T19:30:00Z" },
  { id: "par-r18", restaurantId: "par-14", userName: "BudgetTravelerJan", userLevel: 1, wasWorthIt: true, pricePaid: 10.00, currency: "EUR", tasteRating: 4.0, portionRating: 4.3, valueRating: 4.8, content: "Onion soup, duck confit, and a glass of wine for 15 euros total. The dining room is gorgeous. Service is brisk but friendly. Book ahead or queue early.", visitPurpose: "solo_dining", helpfulCount: 33, createdAt: "2026-04-02T20:00:00Z" },

  // par-15: Bouillon Pigalle
  { id: "par-r19", restaurantId: "par-15", userName: "PigallePaul", userLevel: 2, wasWorthIt: true, pricePaid: 10.00, currency: "EUR", tasteRating: 4.3, portionRating: 4.4, valueRating: 4.5, content: "Newer than Chartier but same concept. The oeuf mayo starter is perfect, the blanquette de veau is comforting. All at prices your grandparents would recognise.", visitPurpose: "group_party", helpfulCount: 25, createdAt: "2026-03-23T19:00:00Z" },

  // par-16: Chez Janou
  { id: "par-r20", restaurantId: "par-16", userName: "ChocolateMousseQueen", userLevel: 2, wasWorthIt: true, pricePaid: 12.00, currency: "EUR", tasteRating: 4.5, portionRating: 4.2, valueRating: 4.0, content: "Famous for the giant bowl of chocolate mousse they bring to the table and you serve yourself. The duck confit is also excellent. Charming terrace.", visitPurpose: "date_night", helpfulCount: 22, createdAt: "2026-03-17T20:30:00Z" },

  // par-17: Chez Ly
  { id: "par-r21", restaurantId: "par-17", userName: "DimSumDiane", userLevel: 1, wasWorthIt: true, pricePaid: 8.50, currency: "EUR", tasteRating: 4.0, portionRating: 4.0, valueRating: 4.2, content: "Good Cantonese cooking in the 17th. The fried rice with shrimp is simple but well-executed. A nice change from French food at reasonable prices.", visitPurpose: "daily_eats", helpfulCount: 6, createdAt: "2026-03-26T19:30:00Z" },

  // par-18: Le Cambodge
  { id: "par-r22", restaurantId: "par-18", userName: "CanalStMartinMax", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "EUR", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.4, content: "The bobun is legendary. Rice vermicelli, spring rolls, pickled veg, lemongrass beef all in one bowl. Massive portions near Canal Saint-Martin.", visitPurpose: "solo_dining", helpfulCount: 26, createdAt: "2026-03-14T12:30:00Z" },

  // par-19: Chez Alain Miam Miam
  { id: "par-r23", restaurantId: "par-19", userName: "MarcheFoodie", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "EUR", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.5, content: "The grilled sandwiches at Marche des Enfants Rouges are incredible. Melted raclette, ham, fresh bread grilled over charcoal. Worth the queue.", visitPurpose: "daily_eats", helpfulCount: 20, createdAt: "2026-03-20T12:00:00Z" },

  // par-20: Miznon
  { id: "par-r24", restaurantId: "par-20", userName: "PitaPrincess", userLevel: 2, wasWorthIt: true, pricePaid: 8.00, currency: "EUR", tasteRating: 4.6, portionRating: 3.8, valueRating: 4.3, content: "The whole roasted cauliflower in pita is a revelation. Crispy, caramelized, packed with tahini. Israeli street food done right in the heart of the Marais.", visitPurpose: "solo_dining", helpfulCount: 18, createdAt: "2026-03-29T13:30:00Z" },

  // =====================================================================
  // SINGAPORE
  // =====================================================================

  // sg-1: Tian Tian Chicken Rice
  { id: "sg-r1", restaurantId: "sg-1", userName: "HawkerHunter", userLevel: 3, wasWorthIt: true, pricePaid: 5.00, currency: "SGD", tasteRating: 4.8, portionRating: 4.0, valueRating: 4.9, content: "Tian Tian chicken rice is worth the queue. Silky poached chicken, fragrant rice cooked in chicken fat, chilli sauce on the side. S$5 for perfection.", visitPurpose: "daily_eats", helpfulCount: 78, createdAt: "2026-03-07T11:30:00Z" },
  { id: "sg-r2", restaurantId: "sg-1", userName: "SingaporeLocal", userLevel: 2, wasWorthIt: true, pricePaid: 5.50, currency: "SGD", tasteRating: 4.7, portionRating: 3.8, valueRating: 4.8, content: "Come before 11am to avoid the worst of the queue. The chicken is always moist and the rice is aromatic. Add a plate of bean sprouts for a complete meal.", visitPurpose: "daily_eats", helpfulCount: 35, createdAt: "2026-03-25T10:45:00Z" },

  // sg-2: Boon Tong Kee
  { id: "sg-r3", restaurantId: "sg-2", userName: "ChickenRiceRanker", userLevel: 2, wasWorthIt: true, pricePaid: 6.00, currency: "SGD", tasteRating: 4.5, portionRating: 4.2, valueRating: 4.5, content: "Slightly more upmarket than hawker stalls but the chicken is tender and the rice is fragrant. Good option if you want air conditioning with your chicken rice.", visitPurpose: "family_dinner", helpfulCount: 14, createdAt: "2026-03-18T12:00:00Z" },

  // sg-3: Hill Street Tai Hwa Pork Noodle
  { id: "sg-r4", restaurantId: "sg-3", userName: "MichelinHawkerFan", userLevel: 3, wasWorthIt: true, pricePaid: 8.00, currency: "SGD", tasteRating: 4.9, portionRating: 3.8, valueRating: 4.2, content: "Michelin-starred hawker stall. The bak chor mee with chilli and vinegar is extraordinary. Rich, spicy, complex. S$8 is pricier for hawker food but it is exceptional.", visitPurpose: "solo_dining", helpfulCount: 45, createdAt: "2026-03-12T10:00:00Z" },
  { id: "sg-r5", restaurantId: "sg-3", userName: "NoodleNomad", userLevel: 2, wasWorthIt: true, pricePaid: 8.00, currency: "SGD", tasteRating: 4.8, portionRating: 3.5, valueRating: 4.0, content: "Queue is 45 minutes minimum but the dry noodles are unlike anything else. Vinegary, spicy, with perfectly cooked minced pork. Once you try it you are hooked.", visitPurpose: "solo_dining", helpfulCount: 28, createdAt: "2026-04-01T09:30:00Z" },

  // sg-4: Lau Pa Sat Satay
  { id: "sg-r6", restaurantId: "sg-4", userName: "SatayAddict", userLevel: 2, wasWorthIt: true, pricePaid: 6.00, currency: "SGD", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.5, content: "10 sticks of chicken satay with peanut sauce and ketupat for S$6. The smoky charcoal grilled flavor is incredible. Best enjoyed after dark when the whole street sets up.", visitPurpose: "late_night", helpfulCount: 22, createdAt: "2026-03-15T21:00:00Z" },

  // sg-5: Tiong Bahru Chwee Kueh
  { id: "sg-r7", restaurantId: "sg-5", userName: "TiongBahruLocal", userLevel: 2, wasWorthIt: true, pricePaid: 3.00, currency: "SGD", tasteRating: 4.3, portionRating: 3.8, valueRating: 4.9, content: "S$3 for 5 pieces of steamed rice cake with preserved radish topping. Cheap, delicious, uniquely Singaporean. The best breakfast in Tiong Bahru.", visitPurpose: "daily_eats", helpfulCount: 18, createdAt: "2026-03-20T07:30:00Z" },

  // sg-6: 328 Katong Laksa
  { id: "sg-r8", restaurantId: "sg-6", userName: "LaksaLover", userLevel: 3, wasWorthIt: true, pricePaid: 6.50, currency: "SGD", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.6, content: "The best Katong laksa. Creamy coconut curry broth, cut noodles you eat with a spoon, prawns and cockles. Rich and satisfying for just S$6.50.", visitPurpose: "solo_dining", helpfulCount: 40, createdAt: "2026-03-10T12:30:00Z" },
  { id: "sg-r9", restaurantId: "sg-6", userName: "EastSideEater", userLevel: 1, wasWorthIt: true, pricePaid: 6.00, currency: "SGD", tasteRating: 4.6, portionRating: 3.8, valueRating: 4.5, content: "Worth the trip to Katong. The broth is thick, spicy, and fragrant with rempah. Served in a small bowl but incredibly rich. Two bowls might be too much.", visitPurpose: "daily_eats", helpfulCount: 15, createdAt: "2026-03-28T11:30:00Z" },

  // sg-7: Sungei Road Laksa
  { id: "sg-r10", restaurantId: "sg-7", userName: "OldSchoolHawker", userLevel: 2, wasWorthIt: true, pricePaid: 3.00, currency: "SGD", tasteRating: 4.5, portionRating: 3.5, valueRating: 4.9, content: "S$3 laksa that punches way above its weight. Simple setup, paper bowls, but the curry broth is intense. One of the last old-school hawker stalls left.", visitPurpose: "daily_eats", helpfulCount: 34, createdAt: "2026-03-09T10:30:00Z" },

  // sg-8: Mr and Mrs Mohgan
  { id: "sg-r11", restaurantId: "sg-8", userName: "PrataPatrol", userLevel: 2, wasWorthIt: true, pricePaid: 4.50, currency: "SGD", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.7, content: "The crispiest prata in Singapore. Layers of flaky dough fried to golden perfection. Dip in fish curry and you are in heaven. Worth the trip to Jalan Kayu.", visitPurpose: "daily_eats", helpfulCount: 30, createdAt: "2026-03-14T08:00:00Z" },

  // sg-9: The Roti Prata House
  { id: "sg-r12", restaurantId: "sg-9", userName: "MidnightPrata", userLevel: 1, wasWorthIt: true, pricePaid: 3.50, currency: "SGD", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.8, content: "Open 24 hours, fluffy prata with curry for S$3.50. The egg prata is the classic order. Perfect supper spot after a late night out.", visitPurpose: "late_night", helpfulCount: 16, createdAt: "2026-03-22T01:00:00Z" },

  // sg-10: The Coconut Club
  { id: "sg-r13", restaurantId: "sg-10", userName: "NasiLemakSnob", userLevel: 3, wasWorthIt: true, pricePaid: 10.50, currency: "SGD", tasteRating: 4.7, portionRating: 3.8, valueRating: 4.0, content: "Premium nasi lemak with properly squeezed coconut milk rice. The fried chicken is crispy and juicy. S$10 is steep for nasi lemak but the quality justifies it.", visitPurpose: "date_night", helpfulCount: 22, createdAt: "2026-03-16T12:30:00Z" },

  // sg-11: Ponggol Nasi Lemak
  { id: "sg-r14", restaurantId: "sg-11", userName: "HeartlandHawker", userLevel: 1, wasWorthIt: true, pricePaid: 4.50, currency: "SGD", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.7, content: "The old-school nasi lemak with fried wing, ikan bilis, egg, and sambal for S$4.50. Fragrant coconut rice, fiery sambal. This is what nasi lemak should be.", visitPurpose: "daily_eats", helpfulCount: 19, createdAt: "2026-03-24T07:00:00Z" },

  // sg-12: Toast Box
  { id: "sg-r15", restaurantId: "sg-12", userName: "KopiBro", userLevel: 1, wasWorthIt: true, pricePaid: 5.50, currency: "SGD", tasteRating: 3.8, portionRating: 3.5, valueRating: 4.2, content: "Kaya toast set with soft-boiled eggs and kopi for S$5.50. Reliable kopitiam chain. Good for a quick traditional breakfast near the office.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-19T07:45:00Z" },

  // sg-13: Ya Kun Kaya Toast
  { id: "sg-r16", restaurantId: "sg-13", userName: "KayaToastKing", userLevel: 2, wasWorthIt: true, pricePaid: 4.80, currency: "SGD", tasteRating: 4.0, portionRating: 3.5, valueRating: 4.4, content: "The original kaya toast. Thin crispy bread, cold butter, sweet kaya jam. Dip the soft-boiled eggs in dark soy sauce and white pepper. S$4.80 for the set. Essential Singapore.", visitPurpose: "daily_eats", helpfulCount: 25, createdAt: "2026-03-11T08:00:00Z" },

  // sg-14: Killiney Kopitiam
  { id: "sg-r17", restaurantId: "sg-14", userName: "KopiCConnoisseur", userLevel: 1, wasWorthIt: true, pricePaid: 5.00, currency: "SGD", tasteRating: 3.9, portionRating: 3.6, valueRating: 4.3, content: "Classic kopitiam experience. The nasi lemak set is decent and the kopi C is strong and smooth. Air-conditioned which is a bonus in Singapore heat.", visitPurpose: "daily_eats", helpfulCount: 7, createdAt: "2026-03-27T09:00:00Z" },

  // sg-15: Ah Heng Curry Chicken Bee Hoon
  { id: "sg-r18", restaurantId: "sg-15", userName: "HongLimHero", userLevel: 2, wasWorthIt: true, pricePaid: 4.50, currency: "SGD", tasteRating: 4.5, portionRating: 4.0, valueRating: 4.6, content: "The curry chicken bee hoon is rich and aromatic. Tender chicken pieces in a thick coconut curry with rice noodles. S$4.50 at Hong Lim food center.", visitPurpose: "daily_eats", helpfulCount: 18, createdAt: "2026-03-13T11:00:00Z" },

  // sg-16: Outram Park Fried Kway Teow
  { id: "sg-r19", restaurantId: "sg-16", userName: "WokHeiChaser", userLevel: 3, wasWorthIt: true, pricePaid: 5.00, currency: "SGD", tasteRating: 4.7, portionRating: 3.8, valueRating: 4.5, content: "Incredible wok hei on the char kway teow. You can taste the smoky charred goodness in every bite. Cockles, Chinese sausage, bean sprouts all perfectly fried.", visitPurpose: "solo_dining", helpfulCount: 26, createdAt: "2026-03-17T12:00:00Z" },

  // sg-17: Heng Huat
  { id: "sg-r20", restaurantId: "sg-17", userName: "MaxwellRegular", userLevel: 1, wasWorthIt: true, pricePaid: 4.50, currency: "SGD", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.5, content: "Tender roast duck over rice with a sweet soy glaze for S$4.50. One of Maxwell Food Centre lesser-known gems. Arrive before the duck sells out.", visitPurpose: "daily_eats", helpfulCount: 11, createdAt: "2026-03-21T11:30:00Z" },

  // sg-18: Song Fa Bak Kut Teh
  { id: "sg-r21", restaurantId: "sg-18", userName: "PepperyBrothFan", userLevel: 2, wasWorthIt: true, pricePaid: 7.50, currency: "SGD", tasteRating: 4.6, portionRating: 4.0, valueRating: 4.4, content: "The peppery pork rib soup is deeply comforting. Tender ribs in a clear, peppery broth with garlic. Free refills on soup and rice. Great rainy day meal.", visitPurpose: "solo_dining", helpfulCount: 20, createdAt: "2026-03-10T11:00:00Z" },

  // sg-19: A Noodle Story
  { id: "sg-r22", restaurantId: "sg-19", userName: "ModernHawkerFan", userLevel: 2, wasWorthIt: true, pricePaid: 6.50, currency: "SGD", tasteRating: 4.7, portionRating: 3.8, valueRating: 4.5, content: "Singapore-style ramen at hawker prices. Springy noodles, umami broth, crispy wonton, onsen egg. S$6.50 for something that could be in a proper restaurant.", visitPurpose: "solo_dining", helpfulCount: 24, createdAt: "2026-03-23T12:00:00Z" },

  // sg-20: Maxwell Fuzhou Oyster Cake
  { id: "sg-r23", restaurantId: "sg-20", userName: "MaxwellMarathoner", userLevel: 1, wasWorthIt: true, pricePaid: 3.50, currency: "SGD", tasteRating: 4.2, portionRating: 3.8, valueRating: 4.8, content: "Crispy oyster cakes for S$3.50. Crunchy on the outside, soft and savory inside with tiny oysters. A unique hawker snack you will not find elsewhere.", visitPurpose: "daily_eats", helpfulCount: 10, createdAt: "2026-03-29T11:00:00Z" },

  // =====================================================================
  // DUBAI
  // =====================================================================

  // dxb-1: Al Mallah
  { id: "dxb-r1", restaurantId: "dxb-1", userName: "DubaiFoodDude", userLevel: 3, wasWorthIt: true, pricePaid: 15, currency: "AED", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.7, content: "Al Mallah shawarma at 15 AED is the best late-night option in Satwa. Juicy chicken, garlic sauce, pickles, all wrapped tight. The falafel wrap is great too.", visitPurpose: "late_night", helpfulCount: 45, createdAt: "2026-03-08T23:00:00Z" },
  { id: "dxb-r2", restaurantId: "dxb-1", userName: "SatwaLocal", userLevel: 2, wasWorthIt: true, pricePaid: 12, currency: "AED", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.6, content: "Fresh fruit juices for 10 AED and a shawarma for 12. Best affordable meal on Al Dhiyafah Street. Cash is king here. Open late every night.", visitPurpose: "daily_eats", helpfulCount: 22, createdAt: "2026-03-26T21:30:00Z" },

  // dxb-2: Shawarma King
  { id: "dxb-r3", restaurantId: "dxb-2", userName: "KaramaCraver", userLevel: 1, wasWorthIt: true, pricePaid: 12, currency: "AED", tasteRating: 4.3, portionRating: 4.5, valueRating: 4.6, content: "Massive meat shawarma plate with hummus, pickles, and fresh bread for 12 AED. Portions are very generous. One of the best deals in Karama.", visitPurpose: "daily_eats", helpfulCount: 16, createdAt: "2026-03-14T13:00:00Z" },

  // dxb-3: Laffah
  { id: "dxb-r4", restaurantId: "dxb-3", userName: "JBRJess", userLevel: 2, wasWorthIt: true, pricePaid: 18, currency: "AED", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.2, content: "Excellent Lebanese wraps near JBR. The chicken laffah wrap is loaded with garlic sauce and pickles. A bit more expensive than Satwa spots but still great value.", visitPurpose: "solo_dining", helpfulCount: 12, createdAt: "2026-03-19T20:00:00Z" },

  // dxb-4: Ravi Restaurant
  { id: "dxb-r5", restaurantId: "dxb-4", userName: "RaviRegular", userLevel: 3, wasWorthIt: true, pricePaid: 15, currency: "AED", tasteRating: 4.6, portionRating: 4.7, valueRating: 4.9, content: "Ravi is a Dubai institution. Butter chicken, naan, and a dal for 15 AED total. The portions are enormous and the food is consistently excellent. Open since 1978.", visitPurpose: "daily_eats", helpfulCount: 68, createdAt: "2026-03-07T19:00:00Z" },
  { id: "dxb-r6", restaurantId: "dxb-4", userName: "ExpatsInDubai", userLevel: 2, wasWorthIt: true, pricePaid: 18, currency: "AED", tasteRating: 4.4, portionRating: 4.8, valueRating: 4.8, content: "Everyone from laborers to Lamborghini drivers eats here. The mutton karahi is rich and hearty. Three people can eat well for 50 AED. Legendary.", visitPurpose: "group_party", helpfulCount: 40, createdAt: "2026-04-01T20:30:00Z" },

  // dxb-5: Delhi Darbar
  { id: "dxb-r7", restaurantId: "dxb-5", userName: "BiryaniBeliever", userLevel: 2, wasWorthIt: true, pricePaid: 18, currency: "AED", tasteRating: 4.4, portionRating: 4.5, valueRating: 4.5, content: "The chicken biryani is fragrant and loaded with tender pieces. Huge portion for 18 AED. The butter naan fresh from the tandoor is fluffy perfection.", visitPurpose: "family_dinner", helpfulCount: 18, createdAt: "2026-03-16T19:30:00Z" },

  // dxb-6: Calicut Paragon
  { id: "dxb-r8", restaurantId: "dxb-6", userName: "KeralaDiner", userLevel: 2, wasWorthIt: true, pricePaid: 22, currency: "AED", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.3, content: "Authentic Kerala fish curry with parotta. The fish is fresh and the curry has real coconut and curry leaf flavor. Reminds me of home cooking in Calicut.", visitPurpose: "daily_eats", helpfulCount: 15, createdAt: "2026-03-21T13:00:00Z" },

  // dxb-7: Karachi Darbar
  { id: "dxb-r9", restaurantId: "dxb-7", userName: "DeiraFoodWalker", userLevel: 2, wasWorthIt: true, pricePaid: 14, currency: "AED", tasteRating: 4.3, portionRating: 4.8, valueRating: 4.7, content: "The chicken biryani for 14 AED feeds two people easily. Smoky, spiced rice with generous chunks of chicken. Open 24 hours which is perfect for late shifts.", visitPurpose: "late_night", helpfulCount: 25, createdAt: "2026-03-12T02:00:00Z" },
  { id: "dxb-r10", restaurantId: "dxb-7", userName: "BudgetDXB", userLevel: 1, wasWorthIt: true, pricePaid: 12, currency: "AED", tasteRating: 4.2, portionRating: 4.9, valueRating: 4.8, content: "A full meal of dal, rice, naan, and a kebab for 12 AED. You simply cannot eat cheaper in Dubai. Multiple branches across the city. All reliable.", visitPurpose: "daily_eats", helpfulCount: 30, createdAt: "2026-03-30T13:00:00Z" },

  // dxb-8: Afghan Khorasan
  { id: "dxb-r11", restaurantId: "dxb-8", userName: "KababConnoisseur", userLevel: 2, wasWorthIt: true, pricePaid: 22, currency: "AED", tasteRating: 4.5, portionRating: 4.5, valueRating: 4.4, content: "The lamb chapli kebab is outstanding. Charcoal-grilled, seasoned with coriander and green chillies. Served with fresh naan and Afghan green chutney.", visitPurpose: "group_party", helpfulCount: 17, createdAt: "2026-03-18T20:00:00Z" },

  // dxb-9: Pak Liyari
  { id: "dxb-r12", restaurantId: "dxb-9", userName: "OldDubaiExplorer", userLevel: 1, wasWorthIt: true, pricePaid: 12, currency: "AED", tasteRating: 4.2, portionRating: 4.7, valueRating: 4.7, content: "Hidden gem in Al Fahidi. The biryani is smoky and the portions are absurdly large. 12 AED for enough food for two. No frills, just good honest Pakistani food.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-23T13:30:00Z" },

  // dxb-10: Al Ustad Special Kabab
  { id: "dxb-r13", restaurantId: "dxb-10", userName: "IranianFoodFan", userLevel: 3, wasWorthIt: true, pricePaid: 25, currency: "AED", tasteRating: 4.7, portionRating: 4.3, valueRating: 4.2, content: "The kubideh kebab is juicy and perfectly spiced. Iranian-style cooking with saffron rice. A bit pricier at 25 AED but the quality of the meat is excellent.", visitPurpose: "date_night", helpfulCount: 20, createdAt: "2026-03-15T19:30:00Z" },

  // dxb-11: Firas Sweets
  { id: "dxb-r14", restaurantId: "dxb-11", userName: "SweetToothSara", userLevel: 1, wasWorthIt: true, pricePaid: 10, currency: "AED", tasteRating: 4.3, portionRating: 3.8, valueRating: 4.5, content: "Fresh knafeh for 10 AED. Stretchy cheese, crispy semolina, sweet syrup. They make it in front of you on a huge circular tray. Perfect dessert stop.", visitPurpose: "daily_eats", helpfulCount: 13, createdAt: "2026-03-20T21:00:00Z" },

  // dxb-12: Ashwaq Cafeteria
  { id: "dxb-r15", restaurantId: "dxb-12", userName: "LocalCafeteriaFan", userLevel: 1, wasWorthIt: true, pricePaid: 10, currency: "AED", tasteRating: 3.8, portionRating: 4.5, valueRating: 4.8, content: "A karak chai and a paratha egg roll for 10 AED. Simple, filling, and cheap. This is how Dubai locals actually eat. No Instagram, just good food.", visitPurpose: "daily_eats", helpfulCount: 11, createdAt: "2026-03-27T07:30:00Z" },

  // dxb-13: Operation Falafel
  { id: "dxb-r16", restaurantId: "dxb-13", userName: "JLTLunchbreak", userLevel: 1, wasWorthIt: true, pricePaid: 20, currency: "AED", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.3, content: "Good falafel wrap for 20 AED in JLT. The hummus plate is creamy and generous. Clean, modern, fast service. Decent healthy option in the business district.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-24T12:30:00Z" },

  // dxb-14: Zaroob
  { id: "dxb-r17", restaurantId: "dxb-14", userName: "StreetFoodSheikh", userLevel: 2, wasWorthIt: true, pricePaid: 25, currency: "AED", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.0, content: "Lebanese street food with a modern twist. The manakeesh with za'atar and cheese is excellent. Open late and has a great casual vibe for groups.", visitPurpose: "group_party", helpfulCount: 14, createdAt: "2026-03-17T22:00:00Z" },

  // dxb-15: Jollibee
  { id: "dxb-r18", restaurantId: "dxb-15", userName: "PinoyInDubai", userLevel: 1, wasWorthIt: true, pricePaid: 18, currency: "AED", tasteRating: 4.0, portionRating: 4.2, valueRating: 4.2, content: "Chickenjoy combo with rice and gravy for 18 AED. A taste of home for the Filipino community in Dubai. The spaghetti is sweet like it should be.", visitPurpose: "family_dinner", helpfulCount: 15, createdAt: "2026-03-22T18:30:00Z" },

  // dxb-16: Pinoy Pamilya
  { id: "dxb-r19", restaurantId: "dxb-16", userName: "KababayanKate", userLevel: 1, wasWorthIt: true, pricePaid: 15, currency: "AED", tasteRating: 4.0, portionRating: 4.5, valueRating: 4.6, content: "Sinigang, adobo, and rice for 15 AED. Generous portions of home-style Filipino cooking. A comforting taste of the Philippines in Al Rigga.", visitPurpose: "daily_eats", helpfulCount: 10, createdAt: "2026-03-29T19:00:00Z" },

  // dxb-17: Al Reef Bakery
  { id: "dxb-r20", restaurantId: "dxb-17", userName: "ManakeeshMorning", userLevel: 1, wasWorthIt: true, pricePaid: 8, currency: "AED", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.7, content: "Fresh manakeesh with za'atar for just 8 AED. Straight from the oven, crispy and fragrant. The cheese and turkey version is also excellent.", visitPurpose: "daily_eats", helpfulCount: 16, createdAt: "2026-03-11T08:00:00Z" },

  // dxb-18: Fish Market Cafe
  { id: "dxb-r21", restaurantId: "dxb-18", userName: "SeafoodSulaiman", userLevel: 2, wasWorthIt: true, pricePaid: 22, currency: "AED", tasteRating: 4.3, portionRating: 4.2, valueRating: 4.2, content: "Pick your fish, choose your cooking style. Grilled hammour with rice for 22 AED is fresh and well-seasoned. No fancy decor but great fresh seafood.", visitPurpose: "family_dinner", helpfulCount: 12, createdAt: "2026-03-25T13:00:00Z" },

  // dxb-19: Jaffer Bhai's
  { id: "dxb-r22", restaurantId: "dxb-19", userName: "BiryaniHunterDXB", userLevel: 2, wasWorthIt: true, pricePaid: 16, currency: "AED", tasteRating: 4.5, portionRating: 4.6, valueRating: 4.5, content: "The mutton biryani is aromatic and packed with tender meat. 16 AED for a generous portion. The raita and pickle on the side make it perfect.", visitPurpose: "solo_dining", helpfulCount: 19, createdAt: "2026-03-13T13:00:00Z" },

  // dxb-20: Bu Qtair
  { id: "dxb-r23", restaurantId: "dxb-20", userName: "DubaiSeafoodDiver", userLevel: 3, wasWorthIt: true, pricePaid: 35, currency: "AED", tasteRating: 4.7, portionRating: 4.5, valueRating: 4.0, content: "No menu, just point at the fish. Fried or grilled, served with rice, salad, and fresh bread. The jumbo shrimp platter for 35 AED is incredible by the beach.", visitPurpose: "date_night", helpfulCount: 33, createdAt: "2026-03-16T20:00:00Z" },
  { id: "dxb-r24", restaurantId: "dxb-20", userName: "JumeirahJasmine", userLevel: 2, wasWorthIt: true, pricePaid: 40, currency: "AED", tasteRating: 4.6, portionRating: 4.3, valueRating: 3.8, content: "Iconic beach-side fish shack. Simple but the freshness is unmatched. Pricier than other budget spots but worth it for the experience and sunset views.", visitPurpose: "group_party", helpfulCount: 18, createdAt: "2026-04-03T19:00:00Z" },

  // =====================================================================
  // SYDNEY
  // =====================================================================

  // syd-1: Chat Thai
  { id: "syd-r1", restaurantId: "syd-1", userName: "SydneyFoodie", userLevel: 3, wasWorthIt: true, pricePaid: 14.00, currency: "AUD", tasteRating: 4.5, portionRating: 4.2, valueRating: 4.5, content: "Chat Thai pad see ew is addictive. A$14 for a generous serve near Central station. Smoky wok-fried noodles, tender chicken, perfect sauce. Always buzzing.", visitPurpose: "daily_eats", helpfulCount: 38, createdAt: "2026-03-09T18:00:00Z" },
  { id: "syd-r2", restaurantId: "syd-1", userName: "ThailandStreet", userLevel: 2, wasWorthIt: true, pricePaid: 15.00, currency: "AUD", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.3, content: "The green curry is rich and fragrant. Also try the papaya salad with salted crab. Authentic Thai flavors in the heart of Haymarket. Open late.", visitPurpose: "late_night", helpfulCount: 19, createdAt: "2026-03-28T22:00:00Z" },

  // syd-2: Home Thai
  { id: "syd-r3", restaurantId: "syd-2", userName: "SurryHillsSam", userLevel: 1, wasWorthIt: true, pricePaid: 13.00, currency: "AUD", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.4, content: "Solid Thai in Surry Hills. The basil chicken stir-fry with rice is A$13 and very filling. Quick service, no fuss, good for a weeknight dinner.", visitPurpose: "daily_eats", helpfulCount: 10, createdAt: "2026-03-18T19:00:00Z" },

  // syd-3: Pho An
  { id: "syd-r4", restaurantId: "syd-3", userName: "PhoPhanaticSyd", userLevel: 2, wasWorthIt: true, pricePaid: 12.50, currency: "AUD", tasteRating: 4.4, portionRating: 4.3, valueRating: 4.6, content: "Big bowl of rare beef pho for A$12.50. The broth is rich and aromatic. Pile on the bean sprouts and Thai basil. One of the best in Haymarket.", visitPurpose: "solo_dining", helpfulCount: 20, createdAt: "2026-03-12T12:30:00Z" },

  // syd-4: Marrickville Pork Roll
  { id: "syd-r5", restaurantId: "syd-4", userName: "BanhMiBandit", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "AUD", tasteRating: 4.6, portionRating: 4.5, valueRating: 4.8, content: "Best banh mi in Sydney, arguably Australia. A$8.50 for a crusty roll packed with pate, pork, pickled veggies, chilli, and coriander. Worth the trip to Marrickville.", visitPurpose: "daily_eats", helpfulCount: 45, createdAt: "2026-03-15T12:00:00Z" },
  { id: "syd-r6", restaurantId: "syd-4", userName: "InnerWestIan", userLevel: 1, wasWorthIt: true, pricePaid: 9.00, currency: "AUD", tasteRating: 4.5, portionRating: 4.3, valueRating: 4.7, content: "The combination pork roll is an absolute unit. Fresh baked bread, layers of different meats, crunchy vegetables. Line can be long on weekends.", visitPurpose: "daily_eats", helpfulCount: 22, createdAt: "2026-04-02T11:30:00Z" },

  // syd-5: BBQ King
  { id: "syd-r7", restaurantId: "syd-5", userName: "LateNightBBQ", userLevel: 2, wasWorthIt: true, pricePaid: 15.00, currency: "AUD", tasteRating: 4.4, portionRating: 4.5, valueRating: 4.3, content: "The roast duck on rice is A$15 and worth every cent. Crispy skin, tender meat, rich soy glaze. Open late which makes it a Sydney institution for after-hours eating.", visitPurpose: "late_night", helpfulCount: 25, createdAt: "2026-03-20T23:30:00Z" },

  // syd-6: Chinese Noodle House
  { id: "syd-r8", restaurantId: "syd-6", userName: "HaymarketHiker", userLevel: 1, wasWorthIt: true, pricePaid: 12.00, currency: "AUD", tasteRating: 4.2, portionRating: 4.3, valueRating: 4.5, content: "Hand-pulled noodles in soup for A$12. You can watch them stretch the noodles fresh. Beef brisket version is hearty and satisfying. Cash preferred.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-24T12:30:00Z" },

  // syd-7: Sydney Fish Market
  { id: "syd-r9", restaurantId: "syd-7", userName: "PyrmontPete", userLevel: 2, wasWorthIt: true, pricePaid: 16.00, currency: "AUD", tasteRating: 4.5, portionRating: 4.2, valueRating: 4.2, content: "Fish and chips from the market takeaway counter. The barramundi is fresh and perfectly battered. Sit by the water and watch the boats. A$16 well spent.", visitPurpose: "family_dinner", helpfulCount: 18, createdAt: "2026-03-14T12:30:00Z" },

  // syd-8: Fisherman's Wharf
  { id: "syd-r10", restaurantId: "syd-8", userName: "ManlyBeachMike", userLevel: 1, wasWorthIt: true, pricePaid: 14.50, currency: "AUD", tasteRating: 4.3, portionRating: 4.4, valueRating: 4.3, content: "Classic fish and chips after a walk along the Manly beachfront. Generous battered flathead with crispy chips. A$14.50 for a solid beach lunch.", visitPurpose: "family_dinner", helpfulCount: 12, createdAt: "2026-03-22T13:00:00Z" },

  // syd-9: Kebab Station
  { id: "syd-r11", restaurantId: "syd-9", userName: "NewtownNightOwl", userLevel: 1, wasWorthIt: true, pricePaid: 11.00, currency: "AUD", tasteRating: 4.2, portionRating: 4.5, valueRating: 4.5, content: "Mixed kebab plate with garlic sauce, tabouli, and hot chips for A$11. Generous portions on King Street. Perfect post-pub fuel in Newtown.", visitPurpose: "late_night", helpfulCount: 15, createdAt: "2026-03-27T00:30:00Z" },

  // syd-10: Ali Baba
  { id: "syd-r12", restaurantId: "syd-10", userName: "CBDLunchRunner", userLevel: 1, wasWorthIt: true, pricePaid: 10.50, currency: "AUD", tasteRating: 4.0, portionRating: 4.3, valueRating: 4.4, content: "Quick and filling Lebanese plate near Town Hall for A$10.50. Falafel, hummus, tabbouleh, and pita. Not fancy but reliable and good value in the CBD.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-19T12:15:00Z" },

  // syd-11: Harry's Cafe de Wheels
  { id: "syd-r13", restaurantId: "syd-11", userName: "AussiePieFan", userLevel: 2, wasWorthIt: true, pricePaid: 9.50, currency: "AUD", tasteRating: 4.1, portionRating: 4.0, valueRating: 4.2, content: "The tiger pie with mushy peas, mash, and gravy is a classic Sydney experience. A$9.50 at the Woolloomooloo cart. Been here since 1938. Grab one after the art gallery.", visitPurpose: "solo_dining", helpfulCount: 16, createdAt: "2026-03-11T14:00:00Z" },

  // syd-12: Pie Face
  { id: "syd-r14", restaurantId: "syd-12", userName: "QuickBiteGeorge", userLevel: 1, wasWorthIt: true, pricePaid: 8.00, currency: "AUD", tasteRating: 3.7, portionRating: 3.8, valueRating: 4.2, content: "Grab and go meat pie for A$8 on George Street. The chunky steak is decent. Not gourmet but a filling quick lunch when you are short on time.", visitPurpose: "daily_eats", helpfulCount: 5, createdAt: "2026-03-25T12:30:00Z" },

  // syd-13: Nando's
  { id: "syd-r15", restaurantId: "syd-13", userName: "ChickenChampSyd", userLevel: 1, wasWorthIt: true, pricePaid: 15.00, currency: "AUD", tasteRating: 4.1, portionRating: 3.9, valueRating: 4.0, content: "Quarter chicken and chips with peri-peri for A$15. Reliable chain option in the city. The whole chicken to share is better value if you have a mate.", visitPurpose: "group_party", helpfulCount: 7, createdAt: "2026-03-30T18:30:00Z" },

  // syd-14: Mamak
  { id: "syd-r16", restaurantId: "syd-14", userName: "MamakMaven", userLevel: 3, wasWorthIt: true, pricePaid: 12.00, currency: "AUD", tasteRating: 4.6, portionRating: 4.2, valueRating: 4.5, content: "The roti canai at Mamak is flaky, buttery perfection. Dip it in the dhal curry and you are in Malaysian hawker heaven. A$12 for roti and a teh tarik.", visitPurpose: "date_night", helpfulCount: 32, createdAt: "2026-03-10T19:30:00Z" },
  { id: "syd-r17", restaurantId: "syd-14", userName: "HaymarketRegular", userLevel: 2, wasWorthIt: true, pricePaid: 13.00, currency: "AUD", tasteRating: 4.4, portionRating: 4.0, valueRating: 4.3, content: "The mee goreng mamak is wok-fried to perfection. Smoky, spicy, sweet all at once. Queue can be 30+ minutes on weekends but the food is worth it.", visitPurpose: "solo_dining", helpfulCount: 18, createdAt: "2026-04-01T20:00:00Z" },

  // syd-15: Guzman y Gomez
  { id: "syd-r18", restaurantId: "syd-15", userName: "MexicanFoodSyd", userLevel: 1, wasWorthIt: true, pricePaid: 14.50, currency: "AUD", tasteRating: 4.0, portionRating: 4.0, valueRating: 4.0, content: "Burrito bowl with pulled pork, black beans, and guac for A$14.50. Fast service near Town Hall. Not authentic Mexican but tasty and filling.", visitPurpose: "daily_eats", helpfulCount: 6, createdAt: "2026-03-21T12:30:00Z" },

  // syd-16: Soul Burger
  { id: "syd-r19", restaurantId: "syd-16", userName: "VeganVibes", userLevel: 2, wasWorthIt: true, pricePaid: 16.50, currency: "AUD", tasteRating: 4.3, portionRating: 3.8, valueRating: 3.9, content: "Best plant-based burger in Sydney. The Soul Burger with vegan cheese and secret sauce actually tastes like a real burger. A$16.50 is fair for the quality.", visitPurpose: "healthy_budget", helpfulCount: 12, createdAt: "2026-03-17T18:30:00Z" },

  // syd-17: Mappen
  { id: "syd-r20", restaurantId: "syd-17", userName: "UdonUnderground", userLevel: 2, wasWorthIt: true, pricePaid: 13.00, currency: "AUD", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.4, content: "Thick chewy udon in a rich curry broth for A$13 at World Square. Add a tempura prawn on top. Fast, filling, and great value for the CBD.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-13T12:30:00Z" },

  // syd-18: Ippudo
  { id: "syd-r21", restaurantId: "syd-18", userName: "RamenRickSyd", userLevel: 2, wasWorthIt: true, pricePaid: 18.00, currency: "AUD", tasteRating: 4.5, portionRating: 3.8, valueRating: 4.0, content: "The shiromaru classic is a perfect bowl of tonkotsu ramen. Creamy pork bone broth, thin noodles, chashu pork. A$18 is mid-range but the quality is high.", visitPurpose: "solo_dining", helpfulCount: 16, createdAt: "2026-03-23T19:00:00Z" },

  // syd-19: Gelato Messina
  { id: "syd-r22", restaurantId: "syd-19", userName: "GelatoGuru", userLevel: 2, wasWorthIt: true, pricePaid: 8.50, currency: "AUD", tasteRating: 4.8, portionRating: 3.5, valueRating: 4.3, content: "Two scoops for A$8.50 of the most creative gelato in Sydney. The salted caramel and white chocolate is incredible. Queue is part of the experience.", visitPurpose: "date_night", helpfulCount: 20, createdAt: "2026-03-16T15:00:00Z" },

  // syd-20: Lankan Filling Station
  { id: "syd-r23", restaurantId: "syd-20", userName: "CurryLoverSyd", userLevel: 2, wasWorthIt: true, pricePaid: 15.00, currency: "AUD", tasteRating: 4.5, portionRating: 4.2, valueRating: 4.4, content: "Sri Lankan hoppers with egg and coconut sambol are amazing. The devilled prawns are spicy and addictive. A$15 for a feast of flavors in Darlinghurst.", visitPurpose: "date_night", helpfulCount: 18, createdAt: "2026-03-26T19:30:00Z" },

  // =====================================================================
  // TAIPEI
  // =====================================================================

  // tpe-1: Shilin Night Market
  { id: "tpe-r1", restaurantId: "tpe-1", userName: "TaipeiNightHawk", userLevel: 2, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 4.3, portionRating: 3.8, valueRating: 4.7, content: "Big cake wraps small cake at Shilin for NT$60. Crispy sesame flatbread filled with a fluffy pastry inside. Classic night market snack. Best eaten hot.", visitPurpose: "late_night", helpfulCount: 18, createdAt: "2026-03-10T21:00:00Z" },

  // tpe-2: Hot Star Chicken
  { id: "tpe-r2", restaurantId: "tpe-2", userName: "FriedChickenTaipei", userLevel: 2, wasWorthIt: true, pricePaid: 70, currency: "TWD", tasteRating: 4.4, portionRating: 4.5, valueRating: 4.6, content: "Giant fried chicken cutlet bigger than your face for NT$70. Crispy, juicy, seasoned with five-spice and white pepper. The iconic Taiwan night market snack.", visitPurpose: "late_night", helpfulCount: 30, createdAt: "2026-03-15T20:30:00Z" },
  { id: "tpe-r3", restaurantId: "tpe-2", userName: "NightMarketNovice", userLevel: 1, wasWorthIt: true, pricePaid: 70, currency: "TWD", tasteRating: 4.3, portionRating: 4.6, valueRating: 4.5, content: "Cannot visit Shilin without getting a Hot Star chicken. It is enormous and costs about two dollars. The spicy version packs a proper kick.", visitPurpose: "solo_dining", helpfulCount: 14, createdAt: "2026-04-01T21:30:00Z" },

  // tpe-3: Raohe Pepper Bun
  { id: "tpe-r4", restaurantId: "tpe-3", userName: "PepperBunPilgrim", userLevel: 3, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 4.8, portionRating: 3.5, valueRating: 4.8, content: "The pepper bun at Raohe is legendary. NT$60 for a clay-oven baked bun stuffed with peppery pork and green onion. Crispy outside, juicy inside. Queue is always long but moves fast.", visitPurpose: "daily_eats", helpfulCount: 52, createdAt: "2026-03-08T19:00:00Z" },
  { id: "tpe-r5", restaurantId: "tpe-3", userName: "TaiwanTraveler", userLevel: 1, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 4.7, portionRating: 3.5, valueRating: 4.7, content: "The best two dollars you will spend in Taipei. Watch them slap the buns onto the inside of the clay oven. The filling is peppery and aromatic.", visitPurpose: "solo_dining", helpfulCount: 25, createdAt: "2026-03-30T18:30:00Z" },

  // tpe-4: Ningxia Taro Balls
  { id: "tpe-r6", restaurantId: "tpe-4", userName: "NingxiaNomad", userLevel: 2, wasWorthIt: true, pricePaid: 50, currency: "TWD", tasteRating: 4.5, portionRating: 3.5, valueRating: 4.7, content: "Crispy fried taro balls stuffed with minced pork at Ningxia night market. NT$50 for a bag. Crunchy exterior, creamy taro inside. Addictive snack.", visitPurpose: "late_night", helpfulCount: 16, createdAt: "2026-03-20T20:00:00Z" },

  // tpe-5: Yongkang Beef Noodle
  { id: "tpe-r7", restaurantId: "tpe-5", userName: "BeefNoodleBoss", userLevel: 3, wasWorthIt: true, pricePaid: 200, currency: "TWD", tasteRating: 4.8, portionRating: 4.2, valueRating: 4.3, content: "The beef noodle soup at Yongkang is NT$200 but the broth is absolutely incredible. Rich, beefy, aromatic with star anise and soy. Tender beef shank and hand-pulled noodles.", visitPurpose: "solo_dining", helpfulCount: 60, createdAt: "2026-03-09T12:00:00Z" },
  { id: "tpe-r8", restaurantId: "tpe-5", userName: "NoodleNerdTW", userLevel: 2, wasWorthIt: true, pricePaid: 200, currency: "TWD", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.2, content: "Always a queue but worth waiting. The half-tendon half-meat version has the best texture variety. Add pickled mustard greens on the side. Taipei essential.", visitPurpose: "daily_eats", helpfulCount: 28, createdAt: "2026-03-27T11:30:00Z" },

  // tpe-6: Lin Dong Fang
  { id: "tpe-r9", restaurantId: "tpe-6", userName: "TaipeiBeefHunter", userLevel: 2, wasWorthIt: true, pricePaid: 180, currency: "TWD", tasteRating: 4.8, portionRating: 4.3, valueRating: 4.5, content: "Many locals prefer Lin Dong Fang over Yongkang. The broth is darker and richer, with more chili heat. NT$180 for generous chunks of beef. Late night hours are a bonus.", visitPurpose: "late_night", helpfulCount: 35, createdAt: "2026-03-14T22:00:00Z" },

  // tpe-7: Old Zhang Beef Noodle
  { id: "tpe-r10", restaurantId: "tpe-7", userName: "BudgetBeefBowl", userLevel: 1, wasWorthIt: true, pricePaid: 150, currency: "TWD", tasteRating: 4.5, portionRating: 4.4, valueRating: 4.6, content: "More affordable than the famous shops but just as tasty. NT$150 for a big bowl of tomato beef noodle soup. The broth is lighter and tangy. Great value.", visitPurpose: "daily_eats", helpfulCount: 14, createdAt: "2026-03-22T12:00:00Z" },

  // tpe-8: Chishang Bento
  { id: "tpe-r11", restaurantId: "tpe-8", userName: "BentoBoxFan", userLevel: 1, wasWorthIt: true, pricePaid: 80, currency: "TWD", tasteRating: 4.1, portionRating: 4.3, valueRating: 4.7, content: "Classic wooden box bento with pork chop, egg, pickled veggies, and rice for NT$80. Simple, nostalgic, and filling. Perfect grab-and-go near Taipei station.", visitPurpose: "daily_eats", helpfulCount: 12, createdAt: "2026-03-17T12:00:00Z" },

  // tpe-9: Taiwan Railway Bento
  { id: "tpe-r12", restaurantId: "tpe-9", userName: "TrainFoodFan", userLevel: 1, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 3.9, portionRating: 4.2, valueRating: 4.8, content: "NT$60 for a complete meal in a box. Braised pork, pickled radish, boiled egg, cabbage, and rice. The ultimate Taiwan travel food. Buy one before your train ride.", visitPurpose: "daily_eats", helpfulCount: 20, createdAt: "2026-03-11T14:00:00Z" },

  // tpe-10: Chun Shui Tang
  { id: "tpe-r13", restaurantId: "tpe-10", userName: "BubbleTeaOG", userLevel: 2, wasWorthIt: true, pricePaid: 150, currency: "TWD", tasteRating: 4.4, portionRating: 3.5, valueRating: 4.0, content: "The birthplace of bubble tea. NT$150 for the original pearl milk tea and a noodle dish. The tea is balanced and the tapioca pearls are perfectly chewy.", visitPurpose: "solo_dining", helpfulCount: 22, createdAt: "2026-03-19T15:00:00Z" },

  // tpe-11: 50 Lan
  { id: "tpe-r14", restaurantId: "tpe-11", userName: "BobaDaily", userLevel: 1, wasWorthIt: true, pricePaid: 50, currency: "TWD", tasteRating: 4.3, portionRating: 3.5, valueRating: 4.6, content: "NT$50 for a large green tea with tapioca. One of the best bubble tea chains in Taiwan. The Sihji Spring Tea with pearl is my go-to order. Refreshing.", visitPurpose: "daily_eats", helpfulCount: 10, createdAt: "2026-03-25T14:30:00Z" },

  // tpe-12: Fu Hang Soy Milk
  { id: "tpe-r15", restaurantId: "tpe-12", userName: "TaipeiBreakfastClub", userLevel: 3, wasWorthIt: true, pricePaid: 65, currency: "TWD", tasteRating: 4.7, portionRating: 4.0, valueRating: 4.8, content: "Queue starts at 5am but the shao bing you tiao (sesame flatbread with fried dough stick) is worth waking up for. Fresh warm soy milk on the side. NT$65 for the set.", visitPurpose: "daily_eats", helpfulCount: 58, createdAt: "2026-03-07T06:30:00Z" },
  { id: "tpe-r16", restaurantId: "tpe-12", userName: "EarlyBirdEater", userLevel: 2, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 4.5, portionRating: 3.8, valueRating: 4.7, content: "The salty soy milk with vinegar, dried shrimp, and you tiao pieces is unlike anything else. Rich, savory, comforting. Arrive before 7am or queue for an hour.", visitPurpose: "daily_eats", helpfulCount: 30, createdAt: "2026-03-28T06:00:00Z" },

  // tpe-13: Yonghe Soy Milk King
  { id: "tpe-r17", restaurantId: "tpe-13", userName: "SoyMilkSam", userLevel: 1, wasWorthIt: true, pricePaid: 55, currency: "TWD", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.7, content: "Open 24 hours. The dan bing (egg crepe) with corn and cheese is NT$55 and delicious. Less crowded than Fu Hang but similarly good traditional breakfast.", visitPurpose: "daily_eats", helpfulCount: 12, createdAt: "2026-03-21T07:00:00Z" },

  // tpe-14: Mei Er Mei
  { id: "tpe-r18", restaurantId: "tpe-14", userName: "BreakfastChainFan", userLevel: 1, wasWorthIt: true, pricePaid: 50, currency: "TWD", tasteRating: 3.8, portionRating: 3.8, valueRating: 4.6, content: "Egg and cheese toast sandwich for NT$50. Every neighborhood in Taipei has a Mei Er Mei. Not fancy but it is the everyday Taiwan breakfast experience.", visitPurpose: "daily_eats", helpfulCount: 6, createdAt: "2026-03-26T08:00:00Z" },

  // tpe-15: Jin Feng Lu Rou Fan
  { id: "tpe-r19", restaurantId: "tpe-15", userName: "LuRouFanLover", userLevel: 3, wasWorthIt: true, pricePaid: 50, currency: "TWD", tasteRating: 4.8, portionRating: 4.0, valueRating: 4.9, content: "A bowl of braised pork rice for NT$50 that is absolutely heavenly. Meltingly tender pork belly in a sweet soy sauce over fluffy white rice. The benchmark for lu rou fan.", visitPurpose: "daily_eats", helpfulCount: 75, createdAt: "2026-03-08T11:30:00Z" },
  { id: "tpe-r20", restaurantId: "tpe-15", userName: "ComfortFoodTW", userLevel: 2, wasWorthIt: true, pricePaid: 50, currency: "TWD", tasteRating: 4.7, portionRating: 3.8, valueRating: 4.9, content: "Under two dollars for one of the best dishes in Taipei. Add a bowl of bamboo shoot soup for another NT$30. Simple, humble, perfect. Near Chiang Kai-shek Memorial.", visitPurpose: "solo_dining", helpfulCount: 38, createdAt: "2026-03-29T12:00:00Z" },

  // tpe-16: Formosa Chang
  { id: "tpe-r21", restaurantId: "tpe-16", userName: "ChainComparer", userLevel: 1, wasWorthIt: true, pricePaid: 55, currency: "TWD", tasteRating: 4.2, portionRating: 4.0, valueRating: 4.5, content: "The chain version of lu rou fan. NT$55 for a good-sized bowl. Consistent quality across all locations. Not as complex as Jin Feng but satisfying and convenient.", visitPurpose: "daily_eats", helpfulCount: 8, createdAt: "2026-03-18T12:30:00Z" },

  // tpe-17: Tian Tian Li
  { id: "tpe-r22", restaurantId: "tpe-17", userName: "XimendingXplorer", userLevel: 2, wasWorthIt: true, pricePaid: 60, currency: "TWD", tasteRating: 4.4, portionRating: 4.2, valueRating: 4.5, content: "Lu rou fan with a fried egg on top for NT$60 in Ximending. The pork is well-braised and the egg yolk mixes into the rice beautifully. Open late for night market crowds.", visitPurpose: "late_night", helpfulCount: 14, createdAt: "2026-03-23T22:00:00Z" },

  // tpe-18: Din Tai Fung
  { id: "tpe-r23", restaurantId: "tpe-18", userName: "XLBWorldTour", userLevel: 3, wasWorthIt: true, pricePaid: 200, currency: "TWD", tasteRating: 4.9, portionRating: 3.8, valueRating: 4.0, content: "The original Din Tai Fung xiao long bao. 10 pieces for NT$200. Paper-thin skin, scalding hot soup inside, perfectly seasoned pork. The global standard for soup dumplings.", visitPurpose: "family_dinner", helpfulCount: 48, createdAt: "2026-03-12T12:00:00Z" },
  { id: "tpe-r24", restaurantId: "tpe-18", userName: "DumplingDetective", userLevel: 2, wasWorthIt: true, pricePaid: 220, currency: "TWD", tasteRating: 4.8, portionRating: 3.5, valueRating: 3.8, content: "Every fold is exactly 18 pleats. The truffle xiao long bao is an indulgence but the classic pork is the true star. Queue system works well. Book ahead on weekends.", visitPurpose: "date_night", helpfulCount: 25, createdAt: "2026-04-03T12:30:00Z" },

  // tpe-19: Du Xiao Yue
  { id: "tpe-r25", restaurantId: "tpe-19", userName: "TainanFlavors", userLevel: 2, wasWorthIt: true, pricePaid: 80, currency: "TWD", tasteRating: 4.4, portionRating: 3.5, valueRating: 4.3, content: "The original danzai noodle from Tainan. Small bowl of thin noodles in a shrimp and pork broth for NT$80. Delicate and flavorful. Order a couple of sides to make a meal.", visitPurpose: "solo_dining", helpfulCount: 15, createdAt: "2026-03-16T13:00:00Z" },

  // tpe-20: Shida Night Market Lu Wei
  { id: "tpe-r26", restaurantId: "tpe-20", userName: "ShidaStudentLife", userLevel: 1, wasWorthIt: true, pricePaid: 70, currency: "TWD", tasteRating: 4.3, portionRating: 4.0, valueRating: 4.5, content: "Pick your own ingredients from the tray, they stew them in a spiced broth. NT$70 for a basket of tofu, mushrooms, and noodles. Perfect student meal near NTNU.", visitPurpose: "daily_eats", helpfulCount: 12, createdAt: "2026-03-24T20:00:00Z" },

  // tpe-21: San Shang Qiao Fu
  { id: "tpe-r27", restaurantId: "tpe-21", userName: "FastFoodTaipei", userLevel: 1, wasWorthIt: true, pricePaid: 100, currency: "TWD", tasteRating: 3.9, portionRating: 4.0, valueRating: 4.4, content: "Chain beef noodle soup for NT$100. Not the best in Taipei but reliable and quick. Good for a weekday lunch when you do not want to queue. Air conditioned.", visitPurpose: "daily_eats", helpfulCount: 5, createdAt: "2026-03-31T12:00:00Z" },
];


export const CITY_AI_SUMMARIES: Record<string, {
  summary: string;
  bestItems: string[];
  bestFor: string[];
  commonComplaints: string[];
  bestTimeToVisit?: string;
  worthItPercentage: number;
  avgPricePaid?: number;
}> = {
  // =====================================================================
  // NEW YORK CITY
  // =====================================================================

  "nyc-1": {
    summary: "Iconic Greenwich Village pizza slice shop known for perfectly charred NY-style pizza at unbeatable prices. A local favorite for decades.",
    bestItems: ["Classic cheese slice", "Pepperoni slice"],
    bestFor: ["daily_eats", "solo_dining", "late_night"],
    commonComplaints: ["Line can be long during peak hours"],
    bestTimeToVisit: "Weekday afternoons",
    worthItPercentage: 95,
    avgPricePaid: 3.50,
  },
  "nyc-2": {
    summary: "Rock-bottom priced pizza chain in midtown. Not the best taste but unmatched value for a quick, filling slice in Manhattan.",
    bestItems: ["Plain cheese slice"],
    bestFor: ["daily_eats", "late_night"],
    commonComplaints: ["Quality is basic", "Not artisan pizza"],
    bestTimeToVisit: "Anytime",
    worthItPercentage: 92,
    avgPricePaid: 1.50,
  },
  "nyc-3": {
    summary: "Cult-favorite Nolita pizza shop famous for thick, crispy pepperoni squares loaded with cup-and-char pepperoni and chili oil.",
    bestItems: ["Spicy spring pepperoni square", "Classic slice"],
    bestFor: ["solo_dining", "date_night"],
    commonComplaints: ["Long lines on weekends", "Premium pricing for a slice"],
    bestTimeToVisit: "Weekday evenings",
    worthItPercentage: 90,
    avgPricePaid: 5.25,
  },
  "nyc-4": {
    summary: "Reliable fast-casual Mexican chain near Union Square with customizable bowls and burritos. Great portions for the price.",
    bestItems: ["Burrito bowl with double protein", "Chicken burrito"],
    bestFor: ["daily_eats", "healthy_budget"],
    commonComplaints: ["Not exciting or unique", "Prices keep rising"],
    bestTimeToVisit: "Off-peak lunch hours",
    worthItPercentage: 82,
    avgPricePaid: 11.75,
  },
  "nyc-5": {
    summary: "Premium fast-casual burger chain in Madison Square Park. Juicy patties and addictive sauce but prices are steep for the portion size.",
    bestItems: ["ShackBurger", "Cheese fries", "Concrete shake"],
    bestFor: ["date_night", "solo_dining"],
    commonComplaints: ["Expensive for fast casual", "Small portions for the price"],
    bestTimeToVisit: "Early afternoon",
    worthItPercentage: 65,
    avgPricePaid: 13.75,
  },
  "nyc-6": {
    summary: "Health-focused salad chain with fresh ingredients. Good quality greens and grains but the price-to-volume ratio feels high.",
    bestItems: ["Harvest bowl", "Warm bowls"],
    bestFor: ["healthy_budget", "daily_eats"],
    commonComplaints: ["Overpriced for salad", "Portions feel small"],
    bestTimeToVisit: "Order on mobile to skip lines",
    worthItPercentage: 55,
    avgPricePaid: 14.75,
  },
  "nyc-7": {
    summary: "Popular chicken sandwich chain with consistently good food and friendly service despite long lines.",
    bestItems: ["Spicy deluxe sandwich", "Lemonade"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Line wraps around the block"],
    bestTimeToVisit: "Mid-afternoon",
    worthItPercentage: 85,
    avgPricePaid: 9.50,
  },
  "nyc-8": {
    summary: "Hand-pulled noodle chain serving bold, spicy Chinese flavors. The cumin lamb noodles are a midtown lunch essential at a great price.",
    bestItems: ["Cumin lamb hand-pulled noodles", "Liang pi cold skin noodles"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Seating can be tight"],
    bestTimeToVisit: "Early lunch before rush",
    worthItPercentage: 95,
    avgPricePaid: 10.25,
  },
  "nyc-9": {
    summary: "Old-school Chinatown wonton noodle shop with plump shrimp wontons and thin egg noodles in clear savory broth. Cash only.",
    bestItems: ["Wonton noodle soup", "Shrimp wonton"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Cash only", "No frills decor"],
    bestTimeToVisit: "Before 11:30am",
    worthItPercentage: 92,
    avgPricePaid: 7.25,
  },
  "nyc-10": {
    summary: "Chinatown institution famous for its soup dumplings with thin skin and rich pork broth. Great for sharing with a group.",
    bestItems: ["Soup dumplings (xiao long bao)", "Turnip shortcakes"],
    bestFor: ["group_party", "date_night"],
    commonComplaints: ["Communal seating", "Can get crowded"],
    bestTimeToVisit: "Early dinner",
    worthItPercentage: 88,
    avgPricePaid: 13.00,
  },
  "nyc-11": {
    summary: "Legendary halal cart serving mountains of chicken and rice with signature white sauce. Massive portions at unbeatable prices near Rockefeller Center.",
    bestItems: ["Chicken over rice combo platter", "White sauce"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Hot sauce is extremely spicy", "Lines at peak hours"],
    bestTimeToVisit: "Late night or off-peak lunch",
    worthItPercentage: 95,
    avgPricePaid: 8.25,
  },
  "nyc-12": {
    summary: "Reliable halal food cart with good chicken and lamb gyro combos. Less famous than Halal Guys but shorter wait and solid value.",
    bestItems: ["Chicken over rice", "Lamb gyro combo"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not as flavorful as top-tier carts"],
    worthItPercentage: 88,
    avgPricePaid: 7.00,
  },
  "nyc-13": {
    summary: "Iconic Lower East Side deli with legendary hand-cut pastrami. Expensive but the massive sandwiches are shareable and an unforgettable NYC experience.",
    bestItems: ["Pastrami sandwich", "Knish"],
    bestFor: ["family_dinner", "solo_dining"],
    commonComplaints: ["Very expensive for a sandwich", "Touristy"],
    bestTimeToVisit: "Weekday lunch",
    worthItPercentage: 60,
    avgPricePaid: 26.00,
  },
  "nyc-14": {
    summary: "Classic Lower East Side appetizing shop with superlative lox and cream cheese on fresh bagels. A NYC breakfast institution.",
    bestItems: ["Bagel with lox and cream cheese", "Classic plate"],
    bestFor: ["solo_dining", "date_night"],
    commonComplaints: ["Pricey for a bagel"],
    bestTimeToVisit: "Morning weekdays",
    worthItPercentage: 82,
    avgPricePaid: 14.00,
  },
  "nyc-15": {
    summary: "Beloved Upper West Side bagel shop baking fresh, chewy bagels with generous cream cheese spreads. Cash only.",
    bestItems: ["Everything bagel with scallion cream cheese", "Egg and cheese bagel"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Cash only", "Can have a line in mornings"],
    bestTimeToVisit: "Early morning",
    worthItPercentage: 95,
    avgPricePaid: 4.75,
  },
  "nyc-16": {
    summary: "Midtown bagel institution known for oversized, hand-rolled bagels with a wide variety of cream cheese spreads.",
    bestItems: ["Pumpernickel everything bagel", "Veggie cream cheese"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can be very crowded on weekends"],
    bestTimeToVisit: "Early Sunday morning",
    worthItPercentage: 90,
    avgPricePaid: 5.50,
  },
  "nyc-17": {
    summary: "Chelsea Market taco stand with authentic charred adobada pork tacos on fresh corn tortillas. Competes with the best LA tacos.",
    bestItems: ["Adobada tacos", "Cactus taco"],
    bestFor: ["solo_dining", "date_night"],
    commonComplaints: ["Chelsea Market is touristy", "Small tacos"],
    bestTimeToVisit: "Weekday lunch",
    worthItPercentage: 92,
    avgPricePaid: 8.50,
  },
  "nyc-18": {
    summary: "Fast food taco chain near Union Square. Not exciting but the value menu is hard to beat for broke students and late-night cravings.",
    bestItems: ["Cravings Value Menu items", "Bean burrito"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Generic fast food quality"],
    worthItPercentage: 78,
    avgPricePaid: 5.50,
  },
  "nyc-19": {
    summary: "Chinatown Vietnamese spot serving comforting bowls of pho with deep, aromatic broth and fresh herbs.",
    bestItems: ["Rare beef pho", "Spring rolls"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Can be slow during rush"],
    worthItPercentage: 88,
    avgPricePaid: 9.50,
  },
  "nyc-20": {
    summary: "East Village Indian restaurant famous for its dazzling Christmas light decor and affordable curry dishes. BYOB to save money.",
    bestItems: ["Chicken tikka masala", "Naan bread"],
    bestFor: ["date_night"],
    commonComplaints: ["Noisy", "Cramped seating"],
    worthItPercentage: 85,
    avgPricePaid: 10.00,
  },
  "nyc-21": {
    summary: "No-frills Thai restaurant in Hell's Kitchen with generous pad thai portions. Great pre-theater dinner option.",
    bestItems: ["Pad thai with shrimp"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Nothing exceptional, just solid"],
    worthItPercentage: 85,
    avgPricePaid: 8.50,
  },
  "nyc-22": {
    summary: "Famous diner from the TV show near Morningside Heights. Food is average but the nostalgic experience and reliable diner fare keep locals coming back.",
    bestItems: ["Pancakes", "Eggs and hash browns"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Overrated for tourists", "Average food quality"],
    worthItPercentage: 55,
    avgPricePaid: 11.00,
  },
  "nyc-23": {
    summary: "Retro Chelsea diner with cool vibes but elevated prices. Good for atmosphere but not the best value for budget-conscious diners.",
    bestItems: ["Meatloaf", "Milkshakes"],
    bestFor: ["date_night"],
    commonComplaints: ["Overpriced for diner food", "More style than substance"],
    worthItPercentage: 42,
    avgPricePaid: 14.00,
  },

  // =====================================================================
  // LONDON
  // =====================================================================

  "ldn-1": {
    summary: "Retro East End fish and chip shop in Spitalfields serving proper cod and haddock with crispy batter, mushy peas, and pickled eggs.",
    bestItems: ["Cod and chips", "Haddock and chips"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Touristy area"],
    bestTimeToVisit: "Weekday lunch",
    worthItPercentage: 90,
    avgPricePaid: 10.75,
  },
  "ldn-2": {
    summary: "Old-school Marylebone chippy with hand-cut chips and light, crispy batter. A proper traditional fish and chip experience.",
    bestItems: ["Fish and chips with hand-cut chips"],
    bestFor: ["family_dinner", "daily_eats"],
    commonComplaints: ["Small seating area"],
    worthItPercentage: 92,
    avgPricePaid: 11.50,
  },
  "ldn-3": {
    summary: "Popular chicken chain in Soho with peri-peri grilled chicken. Consistent quality, unlimited drink refills, and good group dining value.",
    bestItems: ["Butterfly chicken extra hot", "Quarter chicken meal"],
    bestFor: ["group_party", "daily_eats"],
    commonComplaints: ["Can be crowded at lunch"],
    worthItPercentage: 85,
    avgPricePaid: 9.75,
  },
  "ldn-4": {
    summary: "Britain's favorite bakery chain on the Strand. Hot sausage rolls and steak bakes for under four quid. Not gourmet but unbeatable for a quick, warm bite.",
    bestItems: ["Sausage roll", "Steak bake", "Vegan sausage roll"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not gourmet quality"],
    bestTimeToVisit: "Morning commute",
    worthItPercentage: 95,
    avgPricePaid: 3.75,
  },
  "ldn-5": {
    summary: "Budget pub chain near Leicester Square with massive portions and cheap pints. The food is basic but the value is extraordinary for central London.",
    bestItems: ["Full English breakfast", "Burger and chips"],
    bestFor: ["daily_eats", "group_party"],
    commonComplaints: ["Quality is basic pub grub", "Atmosphere is what it is"],
    worthItPercentage: 90,
    avgPricePaid: 7.75,
  },
  "ldn-6": {
    summary: "Upscale sandwich chain near Victoria with fresh baguettes and better-than-average coffee. Good quick option for commuters.",
    bestItems: ["Baguettes", "Coffee"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Pricey for a sandwich chain"],
    worthItPercentage: 75,
    avgPricePaid: 6.50,
  },
  "ldn-7": {
    summary: "Beloved Bombay-inspired cafe in Covent Garden with legendary bacon naan rolls and 24-hour slow-cooked black daal. Queue early to avoid the wait.",
    bestItems: ["Bacon naan roll", "Black daal", "Chicken ruby curry"],
    bestFor: ["date_night", "group_party"],
    commonComplaints: ["Very long queues", "Slightly pricey"],
    bestTimeToVisit: "Arrive at opening time",
    worthItPercentage: 88,
    avgPricePaid: 12.50,
  },
  "ldn-8": {
    summary: "Whitechapel institution serving legendary sizzling lamb chops and authentic Punjabi cooking at remarkably low prices. BYO and cash only.",
    bestItems: ["Lamb chops", "Biryani", "Dry meat curry"],
    bestFor: ["group_party", "family_dinner"],
    commonComplaints: ["Cash only", "Always packed", "No booking"],
    bestTimeToVisit: "Arrive before 7pm",
    worthItPercentage: 95,
    avgPricePaid: 8.50,
  },
  "ldn-9": {
    summary: "Top-tier East London kebab house with fresh-off-the-grill seekh kebabs and rich karahi curries. Massive naan and incredible value.",
    bestItems: ["Seekh kebab with naan", "Lamb karahi"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Queue on weekends"],
    bestTimeToVisit: "Evening",
    worthItPercentage: 95,
    avgPricePaid: 7.75,
  },
  "ldn-10": {
    summary: "Dalston ocakbasi grill with juicy charcoal-grilled meats and fresh bread. Excellent mixed grill value in a vibrant neighborhood.",
    bestItems: ["Mixed grill", "Adana kebab", "Chicken wings"],
    bestFor: ["date_night"],
    commonComplaints: ["Out of central London"],
    worthItPercentage: 90,
    avgPricePaid: 9.50,
  },
  "ldn-11": {
    summary: "Generous Turkish kebab shop in Fulham with huge wraps and good late-night options.",
    bestItems: ["Chicken shish wrap"],
    bestFor: ["late_night"],
    commonComplaints: ["Nothing exceptional"],
    worthItPercentage: 85,
    avgPricePaid: 9.00,
  },
  "ldn-12": {
    summary: "Four-floor Chinatown institution famous for no-nonsense service and massive portions of Cantonese food at low prices.",
    bestItems: ["Wonton noodle soup"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Famously rude staff (part of the charm)"],
    worthItPercentage: 85,
    avgPricePaid: 8.50,
  },
  "ldn-13": {
    summary: "Sichuan street food spot in Chinatown with fiery dan dan noodles and bold flavors. Small plates packed with spice.",
    bestItems: ["Dan dan noodles"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Small portions"],
    worthItPercentage: 88,
    avgPricePaid: 7.50,
  },
  "ldn-14": {
    summary: "Reliable Vietnamese chain in Soho with fragrant pho and fresh spring rolls. Good value for the location.",
    bestItems: ["Rare beef pho", "Spring rolls"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Chain feel"],
    worthItPercentage: 82,
    avgPricePaid: 10.00,
  },
  "ldn-15": {
    summary: "Borough Market food stall with gooey raclette grilled cheese. Great for a casual market lunch by the river.",
    bestItems: ["Raclette grilled cheese"],
    bestFor: ["date_night"],
    commonComplaints: ["Crowded on weekends"],
    bestTimeToVisit: "Before noon",
    worthItPercentage: 85,
    avgPricePaid: 7.00,
  },
  "ldn-16": {
    summary: "Borough Market pasta gem serving handmade pici cacio e pepe for under 9 quid. Silky pasta with rich, peppery sauce. Queue is part of the experience.",
    bestItems: ["Pici cacio e pepe", "Beef shin pappardelle"],
    bestFor: ["date_night", "solo_dining"],
    commonComplaints: ["Long queues", "No reservations"],
    bestTimeToVisit: "Arrive at opening",
    worthItPercentage: 95,
    avgPricePaid: 8.00,
  },
  "ldn-17": {
    summary: "Trendy Soho spot for pillowy Taiwanese bao buns with braised pork belly and crushed peanuts. Small but perfectly formed portions.",
    bestItems: ["Classic pork bao", "Fried chicken"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Small portions for the price"],
    worthItPercentage: 85,
    avgPricePaid: 7.50,
  },
  "ldn-18": {
    summary: "Soho steak spot offering a properly cooked flat iron steak with salad for 11 quid, plus a free ice cream cone. Outstanding value.",
    bestItems: ["Flat iron steak", "Free ice cream cone"],
    bestFor: ["date_night"],
    commonComplaints: ["Limited menu options"],
    worthItPercentage: 92,
    avgPricePaid: 11.00,
  },
  "ldn-19": {
    summary: "Sourdough pizza chain with blistered crusts and tangy dough for under 8 quid. Excellent value for quality pizza in London.",
    bestItems: ["Number 4 with nduja", "Margherita"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Seating can be cramped"],
    worthItPercentage: 90,
    avgPricePaid: 7.50,
  },
  "ldn-20": {
    summary: "British burger chain with quality beef patties and signature rosemary salted chips. Good but on the pricier side of casual dining.",
    bestItems: ["Tribute burger", "Rosemary salted chips"],
    bestFor: ["group_party"],
    commonComplaints: ["A bit pricey for a burger"],
    worthItPercentage: 78,
    avgPricePaid: 12.00,
  },
  "ldn-21": {
    summary: "South London fried chicken institution. Crispy, greasy, cheap. Every south Londoner has their local Morleys for late-night cravings.",
    bestItems: ["Two-piece chicken and chips", "Chicken burger meal deal"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Not the healthiest option"],
    worthItPercentage: 92,
    avgPricePaid: 4.75,
  },

  // =====================================================================
  // PARIS
  // =====================================================================

  "par-1": {
    summary: "Quality Marais bakery chain with fresh baguettes and exceptional almond croissants. Simple jambon-beurre sandwiches at their best.",
    bestItems: ["Jambon-beurre", "Almond croissant"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Can be busy at lunch"],
    worthItPercentage: 90,
    avgPricePaid: 5.75,
  },
  "par-2": {
    summary: "Artisan bakery near Odeon with some of the best pain au chocolat in Paris. Perfectly laminated pastries and excellent tartines.",
    bestItems: ["Pain au chocolat", "Tartines"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Slightly pricey for a bakery"],
    worthItPercentage: 88,
    avgPricePaid: 6.00,
  },
  "par-3": {
    summary: "Reliable bakery chain near Chatelet with decent croque monsieur and standard French cafe fare. Good value in a touristy area.",
    bestItems: ["Croque monsieur"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Generic chain quality"],
    worthItPercentage: 78,
    avgPricePaid: 5.50,
  },
  "par-4": {
    summary: "Marais creperie serving proper Breton-style buckwheat galettes with crispy edges and soft centers. Great paired with cidre.",
    bestItems: ["Complete galette (egg, ham, gruyere)"],
    bestFor: ["date_night"],
    commonComplaints: ["Pricier than average creperies"],
    worthItPercentage: 85,
    avgPricePaid: 9.00,
  },
  "par-5": {
    summary: "Authentic creperie near Montparnasse with excellent buckwheat galettes and sweet crepes at reasonable prices.",
    bestItems: ["Complete galette", "Nutella crepe"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Seating is limited"],
    worthItPercentage: 90,
    avgPricePaid: 7.00,
  },
  "par-6": {
    summary: "Legendary Marais falafel shop with massive, overstuffed pitas at incredible prices. Crispy falafel, grilled eggplant, and tahini in every bite.",
    bestItems: ["Special falafel pita", "Veggie falafel"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Long queue on weekends"],
    bestTimeToVisit: "Weekday lunch",
    worthItPercentage: 95,
    avgPricePaid: 7.25,
  },
  "par-7": {
    summary: "Solid falafel alternative in the Marais with shorter lines and nearly equal quality. The schnitzel falafel combo is a hidden gem.",
    bestItems: ["Schnitzel falafel combo"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Less well-known"],
    worthItPercentage: 88,
    avgPricePaid: 6.50,
  },
  "par-8": {
    summary: "Standard doner kebab shop in the Latin Quarter. Freshly carved meat and crispy frites. Good late-night fuel at student-friendly prices.",
    bestItems: ["Doner kebab", "Frites"],
    bestFor: ["late_night"],
    commonComplaints: ["Nothing extraordinary"],
    worthItPercentage: 82,
    avgPricePaid: 6.00,
  },
  "par-9": {
    summary: "Outstanding Vietnamese pho in the 13th arrondissement with rich beef broth simmered for hours. Big bowls at small prices. Cash only.",
    bestItems: ["Rare beef pho", "Chicken pho"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Cash only", "Queue at lunch"],
    worthItPercentage: 95,
    avgPricePaid: 8.25,
  },
  "par-10": {
    summary: "Slightly less crowded alternative to Pho 14 with similarly good Vietnamese pho. Lighter chicken pho option available.",
    bestItems: ["Chicken pho", "Beef pho"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Slightly less well-known"],
    worthItPercentage: 88,
    avgPricePaid: 7.50,
  },
  "par-11": {
    summary: "Vietnamese shop in Chinatown making incredible banh mi sandwiches. Crispy baguette with pate, pickled vegetables, and cilantro at unbeatable prices.",
    bestItems: ["Banh mi"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Limited seating"],
    worthItPercentage: 92,
    avgPricePaid: 4.50,
  },
  "par-12": {
    summary: "Basic French grill chain near Bastille. Overcooked steaks and frozen frites. Better options available nearby for the same price.",
    bestItems: ["Steak and frites (if you must)"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Overcooked meat", "Frozen frites", "Chain quality"],
    worthItPercentage: 35,
    avgPricePaid: 12.00,
  },
  "par-13": {
    summary: "French-American grill chain. Decent ribs and burgers but nothing to write home about. Adequate for families with kids wanting burgers.",
    bestItems: ["Ribs", "Burgers"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Generic quality", "Better options nearby"],
    worthItPercentage: 38,
    avgPricePaid: 11.00,
  },
  "par-14": {
    summary: "Historic Belle Epoque dining room serving classic French three-course meals for under 15 euros. Essential Paris budget dining experience.",
    bestItems: ["Steak tartare", "Duck confit", "Profiteroles"],
    bestFor: ["date_night", "solo_dining"],
    commonComplaints: ["Very busy", "Brisk service"],
    bestTimeToVisit: "Book ahead or arrive at opening",
    worthItPercentage: 95,
    avgPricePaid: 9.50,
  },
  "par-15": {
    summary: "Newer bouillon concept near Pigalle with classic French dishes at throwback prices. Excellent oeuf mayo and blanquette de veau.",
    bestItems: ["Oeuf mayo", "Blanquette de veau"],
    bestFor: ["group_party"],
    commonComplaints: ["Can be loud"],
    worthItPercentage: 92,
    avgPricePaid: 10.00,
  },
  "par-16": {
    summary: "Charming Marais bistro famous for its bottomless bowl of chocolate mousse. Excellent duck confit and lovely terrace.",
    bestItems: ["Chocolate mousse", "Duck confit"],
    bestFor: ["date_night"],
    commonComplaints: ["Slightly pricier than bouillons"],
    worthItPercentage: 85,
    avgPricePaid: 12.00,
  },
  "par-17": {
    summary: "Solid Cantonese restaurant in the 17th with well-executed fried rice and classic dishes. Good alternative to French food.",
    bestItems: ["Fried rice with shrimp"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not the most exciting"],
    worthItPercentage: 80,
    avgPricePaid: 8.50,
  },
  "par-18": {
    summary: "Legendary Cambodian restaurant near Canal Saint-Martin with massive bobun bowls. Rice vermicelli, spring rolls, and lemongrass beef in one epic bowl.",
    bestItems: ["Bobun"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Queue at lunch"],
    worthItPercentage: 88,
    avgPricePaid: 8.50,
  },
  "par-19": {
    summary: "Charcoal-grilled sandwiches at Marche des Enfants Rouges with melted raclette. One of the best market food stalls in Paris.",
    bestItems: ["Raclette grilled sandwich"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Queue can be long"],
    worthItPercentage: 90,
    avgPricePaid: 7.50,
  },
  "par-20": {
    summary: "Israeli street food in the Marais with inventive pita stuffings. The whole roasted cauliflower pita is a standout vegetarian option.",
    bestItems: ["Roasted cauliflower pita"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Portions could be larger"],
    worthItPercentage: 85,
    avgPricePaid: 8.00,
  },

  // =====================================================================
  // SINGAPORE
  // =====================================================================

  "sg-1": {
    summary: "The most famous chicken rice stall in Singapore at Maxwell Food Centre. Silky poached chicken, fragrant rice, and perfect chilli sauce.",
    bestItems: ["Chicken rice"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Long queue especially on weekends"],
    bestTimeToVisit: "Before 11am",
    worthItPercentage: 97,
    avgPricePaid: 5.25,
  },
  "sg-2": {
    summary: "Slightly upscale chicken rice chain with tender poached chicken and aromatic rice. Good air-conditioned option.",
    bestItems: ["Chicken rice"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Pricier than hawker stalls"],
    worthItPercentage: 88,
    avgPricePaid: 6.00,
  },
  "sg-3": {
    summary: "Michelin-starred hawker stall with extraordinary bak chor mee. Vinegary, spicy dry noodles with perfectly cooked minced pork. Worth the 45-minute queue.",
    bestItems: ["Dry bak chor mee"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Very long queue", "Pricier for hawker food"],
    bestTimeToVisit: "Arrive at opening",
    worthItPercentage: 90,
    avgPricePaid: 8.00,
  },
  "sg-4": {
    summary: "Atmospheric satay street at Lau Pa Sat. Smoky charcoal-grilled chicken satay with peanut sauce. Best enjoyed after dark.",
    bestItems: ["Chicken satay", "Mutton satay"],
    bestFor: ["late_night"],
    commonComplaints: ["Touristy area"],
    bestTimeToVisit: "After 7pm when the street sets up",
    worthItPercentage: 88,
    avgPricePaid: 6.00,
  },
  "sg-5": {
    summary: "Tiong Bahru Market stall serving steamed rice cakes with savory preserved radish topping. Uniquely Singaporean breakfast at rock-bottom prices.",
    bestItems: ["Chwee kueh"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Might not appeal to all palates"],
    bestTimeToVisit: "Early morning",
    worthItPercentage: 95,
    avgPricePaid: 3.00,
  },
  "sg-6": {
    summary: "Premier Katong laksa with creamy coconut curry broth and cut noodles eaten with a spoon. Rich, satisfying, and worth the trip east.",
    bestItems: ["Katong laksa"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Not centrally located"],
    worthItPercentage: 92,
    avgPricePaid: 6.25,
  },
  "sg-7": {
    summary: "Old-school laksa hawker stall with intense curry broth at unbelievably low prices. Served in paper bowls. One of the last of its kind.",
    bestItems: ["Laksa"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Simple setup", "Paper bowls"],
    worthItPercentage: 97,
    avgPricePaid: 3.00,
  },
  "sg-8": {
    summary: "Home of the crispiest prata in Singapore. Layers of flaky dough fried to golden perfection. Worth the trip to Jalan Kayu.",
    bestItems: ["Plain prata", "Egg prata"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Far from city center"],
    worthItPercentage: 92,
    avgPricePaid: 4.50,
  },
  "sg-9": {
    summary: "24-hour prata house with fluffy, crispy prata and flavorful curry dipping sauce. Perfect late-night supper spot.",
    bestItems: ["Egg prata", "Plain prata"],
    bestFor: ["late_night"],
    commonComplaints: ["Far from center"],
    worthItPercentage: 92,
    avgPricePaid: 3.50,
  },
  "sg-10": {
    summary: "Premium nasi lemak restaurant with properly squeezed coconut milk rice and crispy fried chicken. Pricier but noticeably higher quality.",
    bestItems: ["Nasi lemak set"],
    bestFor: ["date_night"],
    commonComplaints: ["Expensive for nasi lemak"],
    worthItPercentage: 78,
    avgPricePaid: 10.50,
  },
  "sg-11": {
    summary: "Traditional nasi lemak stall with fragrant coconut rice, crispy ikan bilis, and fiery sambal. The real deal at old-school prices.",
    bestItems: ["Nasi lemak with fried wing"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can sell out early"],
    worthItPercentage: 92,
    avgPricePaid: 4.50,
  },
  "sg-12": {
    summary: "Kopitiam chain serving traditional kaya toast sets with soft-boiled eggs and coffee. Good for a quick breakfast near the office.",
    bestItems: ["Kaya toast set"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Chain quality"],
    worthItPercentage: 82,
    avgPricePaid: 5.50,
  },
  "sg-13": {
    summary: "The original kaya toast chain. Thin crispy bread with cold butter and sweet kaya jam. Essential Singapore breakfast experience.",
    bestItems: ["Kaya toast set", "Soft-boiled eggs with soy sauce"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Portions are small"],
    worthItPercentage: 90,
    avgPricePaid: 4.80,
  },
  "sg-14": {
    summary: "Classic kopitiam with decent kaya toast, nasi lemak, and strong kopi C. Air-conditioned comfort in Singapore heat.",
    bestItems: ["Nasi lemak set", "Kopi C"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Nothing exceptional"],
    worthItPercentage: 82,
    avgPricePaid: 5.00,
  },
  "sg-15": {
    summary: "Hong Lim food center stall with rich, aromatic curry chicken bee hoon. Thick coconut curry with tender chicken at hawker prices.",
    bestItems: ["Curry chicken bee hoon"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can sell out"],
    worthItPercentage: 92,
    avgPricePaid: 4.50,
  },
  "sg-16": {
    summary: "Wok hei masters. The char kway teow here has incredible smoky, charred flavor with cockles, Chinese sausage, and bean sprouts.",
    bestItems: ["Char kway teow"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Queue can be long"],
    worthItPercentage: 92,
    avgPricePaid: 5.00,
  },
  "sg-17": {
    summary: "Maxwell Food Centre stall with tender roast duck over rice in sweet soy glaze. A lesser-known gem that sells out quickly.",
    bestItems: ["Roast duck rice"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Sells out early"],
    bestTimeToVisit: "Before noon",
    worthItPercentage: 88,
    avgPricePaid: 4.50,
  },
  "sg-18": {
    summary: "Peppery pork rib soup chain with tender ribs in clear broth. Free refills on soup and rice make it excellent value.",
    bestItems: ["Pork ribs bak kut teh"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Queue at peak hours"],
    worthItPercentage: 88,
    avgPricePaid: 7.50,
  },
  "sg-19": {
    summary: "Modern Singapore-style ramen at hawker prices. Springy noodles, umami broth, crispy wontons, and onsen egg. Restaurant quality at hawker prices.",
    bestItems: ["Singapore-style ramen"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Long queue"],
    worthItPercentage: 90,
    avgPricePaid: 6.50,
  },
  "sg-20": {
    summary: "Maxwell Food Centre stall serving crispy fried oyster cakes. A unique hawker snack with crunchy exterior and savory oyster filling.",
    bestItems: ["Fuzhou oyster cake"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not for everyone"],
    worthItPercentage: 88,
    avgPricePaid: 3.50,
  },

  // =====================================================================
  // DUBAI
  // =====================================================================

  "dxb-1": {
    summary: "Satwa institution for late-night shawarma and fresh fruit juices. Juicy chicken shawarma with garlic sauce at unbeatable prices on Al Dhiyafah Street.",
    bestItems: ["Chicken shawarma", "Falafel wrap", "Fresh fruit juice"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Can be very busy late at night"],
    bestTimeToVisit: "Late evening",
    worthItPercentage: 95,
    avgPricePaid: 13.50,
  },
  "dxb-2": {
    summary: "Karama shawarma chain with massive meat platters and generous portions. One of the best deals in the neighborhood.",
    bestItems: ["Meat shawarma plate"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Nothing extraordinary"],
    worthItPercentage: 90,
    avgPricePaid: 12.00,
  },
  "dxb-3": {
    summary: "Lebanese wrap spot near JBR with loaded chicken laffah wraps. A bit pricier than Satwa spots but still great value near the beach.",
    bestItems: ["Chicken laffah wrap"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Higher prices than old Dubai spots"],
    worthItPercentage: 85,
    avgPricePaid: 18.00,
  },
  "dxb-4": {
    summary: "Dubai institution since 1978 where everyone from laborers to luxury car drivers eats together. Enormous portions of Pakistani-Indian food at incredible prices.",
    bestItems: ["Butter chicken", "Mutton karahi", "Dal and naan"],
    bestFor: ["daily_eats", "group_party"],
    commonComplaints: ["Can be very crowded"],
    bestTimeToVisit: "Early evening",
    worthItPercentage: 97,
    avgPricePaid: 16.50,
  },
  "dxb-5": {
    summary: "Karama Indian restaurant with fragrant biryani and fluffy tandoor naan. Generous portions of classic North Indian dishes.",
    bestItems: ["Chicken biryani", "Butter naan"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Nothing unique"],
    worthItPercentage: 88,
    avgPricePaid: 18.00,
  },
  "dxb-6": {
    summary: "Authentic Kerala restaurant in Karama with fresh fish curry and parotta. Real coconut and curry leaf flavors reminiscent of home cooking.",
    bestItems: ["Fish curry with parotta"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can be slow at peak times"],
    worthItPercentage: 85,
    avgPricePaid: 22.00,
  },
  "dxb-7": {
    summary: "24-hour Pakistani chain in Deira with absurdly large biryani portions. A full meal for 12-14 AED makes it one of the cheapest eats in Dubai.",
    bestItems: ["Chicken biryani", "Dal with naan"],
    bestFor: ["late_night", "daily_eats"],
    commonComplaints: ["Very basic setup"],
    worthItPercentage: 95,
    avgPricePaid: 13.00,
  },
  "dxb-8": {
    summary: "Deira Afghan restaurant with outstanding charcoal-grilled chapli kebabs. Hearty, authentic Afghan cooking with fresh naan and green chutney.",
    bestItems: ["Lamb chapli kebab", "Afghan green chutney"],
    bestFor: ["group_party"],
    commonComplaints: ["Far from new Dubai"],
    worthItPercentage: 88,
    avgPricePaid: 22.00,
  },
  "dxb-9": {
    summary: "Hidden gem in Al Fahidi with smoky, oversized biryani portions. No frills Pakistani cooking at very low prices.",
    bestItems: ["Biryani"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Basic decor"],
    worthItPercentage: 90,
    avgPricePaid: 12.00,
  },
  "dxb-10": {
    summary: "Iranian kebab specialist in Bur Dubai with juicy kubideh and saffron rice. Higher quality meat makes the premium price worthwhile.",
    bestItems: ["Kubideh kebab", "Saffron rice"],
    bestFor: ["date_night"],
    commonComplaints: ["Pricier than other budget spots"],
    worthItPercentage: 82,
    avgPricePaid: 25.00,
  },
  "dxb-11": {
    summary: "Lebanese sweets shop with fresh knafeh made on a huge circular tray in front of you. Stretchy cheese, crispy semolina, sweet syrup.",
    bestItems: ["Knafeh"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Very sweet"],
    worthItPercentage: 88,
    avgPricePaid: 10.00,
  },
  "dxb-12": {
    summary: "Authentic Deira cafeteria serving karak chai and simple, filling meals. This is how Dubai locals actually eat, far from the glitz.",
    bestItems: ["Karak chai", "Paratha egg roll"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Very basic"],
    worthItPercentage: 92,
    avgPricePaid: 10.00,
  },
  "dxb-13": {
    summary: "Clean, modern falafel chain in JLT with good wraps and creamy hummus. Decent healthy option in the business district.",
    bestItems: ["Falafel wrap", "Hummus plate"],
    bestFor: ["daily_eats"],
    commonComplaints: ["A bit pricey for falafel"],
    worthItPercentage: 82,
    avgPricePaid: 20.00,
  },
  "dxb-14": {
    summary: "Modern Lebanese street food on Sheikh Zayed Road with excellent manakeesh and a great late-night casual vibe for groups.",
    bestItems: ["Manakeesh with zaatar and cheese"],
    bestFor: ["group_party"],
    commonComplaints: ["Can get expensive quickly"],
    worthItPercentage: 80,
    avgPricePaid: 25.00,
  },
  "dxb-15": {
    summary: "Filipino fast food chain in Karama serving Chickenjoy and sweet spaghetti. A taste of home for the large Filipino community in Dubai.",
    bestItems: ["Chickenjoy combo"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Acquired taste for non-Filipinos"],
    worthItPercentage: 82,
    avgPricePaid: 18.00,
  },
  "dxb-16": {
    summary: "Home-style Filipino restaurant in Al Rigga with comforting sinigang and adobo. Generous portions at fair prices.",
    bestItems: ["Sinigang", "Adobo"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Basic decor"],
    worthItPercentage: 88,
    avgPricePaid: 15.00,
  },
  "dxb-17": {
    summary: "Lebanese bakery chain with fresh-from-the-oven manakeesh at very low prices. The zaatar version is a perfect breakfast staple.",
    bestItems: ["Zaatar manakeesh", "Cheese and turkey manakeesh"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Basic options"],
    bestTimeToVisit: "Morning",
    worthItPercentage: 92,
    avgPricePaid: 8.00,
  },
  "dxb-18": {
    summary: "Pick-your-fish cafeteria in Bur Dubai where you choose your catch and cooking style. Fresh, well-seasoned seafood without the fancy markup.",
    bestItems: ["Grilled hammour with rice"],
    bestFor: ["family_dinner"],
    commonComplaints: ["No fancy decor"],
    worthItPercentage: 85,
    avgPricePaid: 22.00,
  },
  "dxb-19": {
    summary: "Karama biryani specialist with aromatic mutton biryani packed with tender meat. The raita and pickle complete the meal perfectly.",
    bestItems: ["Mutton biryani"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Can be heavy"],
    worthItPercentage: 90,
    avgPricePaid: 16.00,
  },
  "dxb-20": {
    summary: "Iconic beach-side fish shack in Jumeirah. No menu, just point at the fish. Fried or grilled with rice and salad. Simple but unmatched freshness.",
    bestItems: ["Jumbo shrimp platter", "Grilled fish"],
    bestFor: ["date_night", "group_party"],
    commonComplaints: ["Pricier than other budget spots", "No menu can be confusing"],
    bestTimeToVisit: "Sunset",
    worthItPercentage: 82,
    avgPricePaid: 37.50,
  },

  // =====================================================================
  // SYDNEY
  // =====================================================================

  "syd-1": {
    summary: "Haymarket Thai institution near Central Station with addictive pad see ew and authentic curries. Buzzing atmosphere and open late.",
    bestItems: ["Pad see ew", "Green curry", "Papaya salad"],
    bestFor: ["daily_eats", "late_night"],
    commonComplaints: ["Can be crowded"],
    worthItPercentage: 92,
    avgPricePaid: 14.50,
  },
  "syd-2": {
    summary: "Solid Thai restaurant in Surry Hills with filling basil chicken stir-fry. Good for a no-fuss weeknight dinner.",
    bestItems: ["Basil chicken stir-fry"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Nothing exceptional"],
    worthItPercentage: 85,
    avgPricePaid: 13.00,
  },
  "syd-3": {
    summary: "Haymarket Vietnamese pho specialist with rich, aromatic beef broth and generous noodle bowls. One of the best in the neighborhood.",
    bestItems: ["Rare beef pho"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Basic decor"],
    worthItPercentage: 90,
    avgPricePaid: 12.50,
  },
  "syd-4": {
    summary: "Legendary Marrickville banh mi shop making the best pork roll in Sydney. Crusty bread, layered meats, pickled veggies, chilli, and coriander.",
    bestItems: ["Combination pork roll"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Long line on weekends", "Trip to Marrickville required"],
    worthItPercentage: 95,
    avgPricePaid: 8.75,
  },
  "syd-5": {
    summary: "Late-night Chinatown institution with crispy-skinned roast duck on rice. A Sydney classic that has been feeding night owls for decades.",
    bestItems: ["Roast duck on rice"],
    bestFor: ["late_night"],
    commonComplaints: ["Aging decor"],
    worthItPercentage: 88,
    avgPricePaid: 15.00,
  },
  "syd-6": {
    summary: "Haymarket noodle shop where you can watch them hand-pull the noodles fresh. Hearty beef brisket soup at fair prices.",
    bestItems: ["Hand-pulled beef brisket noodle soup"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Cash preferred"],
    worthItPercentage: 88,
    avgPricePaid: 12.00,
  },
  "syd-7": {
    summary: "Fish Market takeaway counter in Pyrmont with fresh barramundi and chips. Enjoy by the water watching the boats come in.",
    bestItems: ["Barramundi fish and chips"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Seagulls are aggressive"],
    worthItPercentage: 85,
    avgPricePaid: 16.00,
  },
  "syd-8": {
    summary: "Classic fish and chips on the Manly beachfront. Generous battered flathead with crispy chips. Perfect beach lunch.",
    bestItems: ["Battered flathead and chips"],
    bestFor: ["family_dinner"],
    commonComplaints: ["Out of the way if not in Manly"],
    worthItPercentage: 85,
    avgPricePaid: 14.50,
  },
  "syd-9": {
    summary: "Newtown kebab shop with generous mixed plates and garlic sauce. Perfect post-pub fuel on King Street.",
    bestItems: ["Mixed kebab plate"],
    bestFor: ["late_night"],
    commonComplaints: ["Late-night crowd can be rowdy"],
    worthItPercentage: 88,
    avgPricePaid: 11.00,
  },
  "syd-10": {
    summary: "Reliable Lebanese chain near Town Hall with quick falafel plates and hummus. Good value in the CBD.",
    bestItems: ["Falafel plate", "Hummus"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Chain feel"],
    worthItPercentage: 85,
    avgPricePaid: 10.50,
  },
  "syd-11": {
    summary: "Iconic Sydney pie cart at Woolloomooloo serving tiger pies with mushy peas, mash, and gravy since 1938.",
    bestItems: ["Tiger pie with mushy peas and gravy"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Touristy"],
    worthItPercentage: 85,
    avgPricePaid: 9.50,
  },
  "syd-12": {
    summary: "Grab-and-go meat pie chain on George Street. Decent chunky steak pies for a quick lunch when short on time.",
    bestItems: ["Chunky steak pie"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Nothing special"],
    worthItPercentage: 78,
    avgPricePaid: 8.00,
  },
  "syd-13": {
    summary: "Peri-peri chicken chain in the city. Reliable quarter chicken meals. Better value when sharing a whole chicken.",
    bestItems: ["Quarter chicken and chips"],
    bestFor: ["group_party"],
    commonComplaints: ["Generic chain"],
    worthItPercentage: 78,
    avgPricePaid: 15.00,
  },
  "syd-14": {
    summary: "Haymarket Malaysian restaurant with legendary flaky roti canai and rich curries. Queue-worthy for buttery, crispy perfection.",
    bestItems: ["Roti canai", "Mee goreng mamak", "Teh tarik"],
    bestFor: ["date_night", "solo_dining"],
    commonComplaints: ["30+ minute queue on weekends"],
    bestTimeToVisit: "Weekday evening",
    worthItPercentage: 92,
    avgPricePaid: 12.50,
  },
  "syd-15": {
    summary: "Mexican fast-casual chain near Town Hall. Tasty burrito bowls and burritos. Not authentic but filling and convenient.",
    bestItems: ["Burrito bowl"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not authentic Mexican"],
    worthItPercentage: 78,
    avgPricePaid: 14.50,
  },
  "syd-16": {
    summary: "Plant-based burger spot in Randwick. The vegan burgers actually taste like real burgers. Fair pricing for the quality.",
    bestItems: ["Soul Burger with vegan cheese"],
    bestFor: ["healthy_budget"],
    commonComplaints: ["Pricey for fast food"],
    worthItPercentage: 72,
    avgPricePaid: 16.50,
  },
  "syd-17": {
    summary: "World Square udon chain with thick, chewy noodles in rich curry broth. Fast, filling CBD lunch at good value.",
    bestItems: ["Curry udon with tempura prawn"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can be crowded at lunch"],
    worthItPercentage: 88,
    avgPricePaid: 13.00,
  },
  "syd-18": {
    summary: "Japanese ramen chain with excellent creamy tonkotsu broth. Mid-range pricing but the quality of the broth justifies it.",
    bestItems: ["Shiromaru classic tonkotsu"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Not cheap for ramen"],
    worthItPercentage: 80,
    avgPricePaid: 18.00,
  },
  "syd-19": {
    summary: "Creative gelato institution in Darlinghurst with inventive flavors. Queue is part of the experience. Worth every cent.",
    bestItems: ["Salted caramel and white chocolate"],
    bestFor: ["date_night"],
    commonComplaints: ["Queue can be long", "Not a full meal"],
    worthItPercentage: 88,
    avgPricePaid: 8.50,
  },
  "syd-20": {
    summary: "Sri Lankan restaurant in Darlinghurst with incredible hoppers, sambols, and spicy devilled prawns. A feast of flavors.",
    bestItems: ["Hoppers with egg", "Devilled prawns", "Coconut sambol"],
    bestFor: ["date_night"],
    commonComplaints: ["Can be spicy"],
    worthItPercentage: 88,
    avgPricePaid: 15.00,
  },

  // =====================================================================
  // TAIPEI
  // =====================================================================

  "tpe-1": {
    summary: "Classic Shilin Night Market snack. Crispy sesame flatbread filled with a fluffy pastry inside. Best eaten piping hot from the stall.",
    bestItems: ["Big cake wraps small cake"],
    bestFor: ["late_night"],
    commonComplaints: ["Only one item available"],
    worthItPercentage: 88,
    avgPricePaid: 60,
  },
  "tpe-2": {
    summary: "Giant fried chicken cutlet bigger than your face. Crispy five-spice seasoned chicken at an unbelievably low price. Iconic Taiwan night market snack.",
    bestItems: ["Giant fried chicken cutlet"],
    bestFor: ["late_night", "solo_dining"],
    commonComplaints: ["Very oily"],
    worthItPercentage: 92,
    avgPricePaid: 70,
  },
  "tpe-3": {
    summary: "Legendary clay-oven baked pepper buns at Raohe Night Market. Peppery pork filling, crispy dough, green onion. Line is always long but moves fast.",
    bestItems: ["Pepper bun (hu jiao bing)"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Long queue"],
    bestTimeToVisit: "Early evening before the rush",
    worthItPercentage: 97,
    avgPricePaid: 60,
  },
  "tpe-4": {
    summary: "Ningxia Night Market stall with crispy fried taro balls stuffed with minced pork. Addictive snack with creamy taro interior.",
    bestItems: ["Fried taro balls"],
    bestFor: ["late_night"],
    commonComplaints: ["Small snack, not a full meal"],
    worthItPercentage: 90,
    avgPricePaid: 50,
  },
  "tpe-5": {
    summary: "The most famous beef noodle soup in Taipei. Rich, beefy broth with star anise, tender beef shank, and hand-pulled noodles. Worth the queue.",
    bestItems: ["Beef noodle soup", "Half-tendon half-meat version"],
    bestFor: ["solo_dining", "daily_eats"],
    commonComplaints: ["Always a queue", "Pricier than average"],
    bestTimeToVisit: "Weekday lunch",
    worthItPercentage: 92,
    avgPricePaid: 200,
  },
  "tpe-6": {
    summary: "Many locals consider this the best beef noodle soup in Taipei. Darker, richer broth with more chili heat. Open late for night owls.",
    bestItems: ["Beef noodle soup"],
    bestFor: ["late_night"],
    commonComplaints: ["Long queue"],
    worthItPercentage: 92,
    avgPricePaid: 180,
  },
  "tpe-7": {
    summary: "More affordable beef noodle shop with a lighter, tangier tomato-based broth. Great value with generous portions.",
    bestItems: ["Tomato beef noodle soup"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Less well-known"],
    worthItPercentage: 90,
    avgPricePaid: 150,
  },
  "tpe-8": {
    summary: "Classic wooden box bento with pork chop, egg, and pickled vegetables near Taipei Station. Nostalgic, filling grab-and-go meal.",
    bestItems: ["Pork chop bento"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Simple food"],
    worthItPercentage: 90,
    avgPricePaid: 80,
  },
  "tpe-9": {
    summary: "The ultimate Taiwan travel food. Complete bento box for NT$60 with braised pork, egg, cabbage, and rice. Buy before your train ride.",
    bestItems: ["Railway bento"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Can sell out on busy travel days"],
    worthItPercentage: 95,
    avgPricePaid: 60,
  },
  "tpe-10": {
    summary: "The birthplace of bubble tea. The original pearl milk tea is balanced with perfectly chewy tapioca. Also serves decent noodle dishes.",
    bestItems: ["Original pearl milk tea", "Noodle sets"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Pricier than other boba shops"],
    worthItPercentage: 82,
    avgPricePaid: 150,
  },
  "tpe-11": {
    summary: "One of the best bubble tea chains in Taiwan. The Sihji Spring Tea with pearl is refreshing and perfectly brewed at great prices.",
    bestItems: ["Sihji Spring Tea with pearl", "Green tea with tapioca"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Just a drink, not a meal"],
    worthItPercentage: 88,
    avgPricePaid: 50,
  },
  "tpe-12": {
    summary: "Legendary Taipei breakfast spot with shao bing you tiao and warm soy milk. Queue starts at 5am but the flaky sesame flatbread is worth waking up for.",
    bestItems: ["Shao bing you tiao", "Salty soy milk"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Extremely long queue", "Early morning only"],
    bestTimeToVisit: "Before 7am",
    worthItPercentage: 95,
    avgPricePaid: 62.50,
  },
  "tpe-13": {
    summary: "24-hour soy milk and breakfast shop with good dan bing and traditional Taiwanese breakfast items. Less crowded alternative to Fu Hang.",
    bestItems: ["Dan bing with corn and cheese", "Soy milk"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Not as exceptional as Fu Hang"],
    worthItPercentage: 88,
    avgPricePaid: 55,
  },
  "tpe-14": {
    summary: "Ubiquitous Taiwanese breakfast chain found in every neighborhood. Simple egg and cheese toast sandwiches for the everyday morning routine.",
    bestItems: ["Egg and cheese toast"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Very basic chain quality"],
    worthItPercentage: 82,
    avgPricePaid: 50,
  },
  "tpe-15": {
    summary: "The gold standard for lu rou fan (braised pork rice). Meltingly tender pork belly in sweet soy sauce over white rice for under two dollars. Unmissable.",
    bestItems: ["Lu rou fan", "Bamboo shoot soup"],
    bestFor: ["daily_eats", "solo_dining"],
    commonComplaints: ["Queue at peak hours"],
    bestTimeToVisit: "Off-peak lunch",
    worthItPercentage: 98,
    avgPricePaid: 50,
  },
  "tpe-16": {
    summary: "Chain version of lu rou fan found across Taipei. Consistent quality and convenient locations. Not as complex as Jin Feng but satisfying.",
    bestItems: ["Lu rou fan"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Chain quality, lacks artisanal touch"],
    worthItPercentage: 82,
    avgPricePaid: 55,
  },
  "tpe-17": {
    summary: "Ximending snack shop with excellent lu rou fan topped with a fried egg. Good late-night option near the shopping district.",
    bestItems: ["Lu rou fan with fried egg"],
    bestFor: ["late_night"],
    commonComplaints: ["Small shop, limited seating"],
    worthItPercentage: 88,
    avgPricePaid: 60,
  },
  "tpe-18": {
    summary: "The original Din Tai Fung with 18-pleat xiao long bao. Paper-thin skin, scalding soup inside, perfectly seasoned pork. The global standard for soup dumplings.",
    bestItems: ["Pork xiao long bao", "Truffle xiao long bao"],
    bestFor: ["family_dinner", "date_night"],
    commonComplaints: ["Queue on weekends", "Pricier than street food"],
    bestTimeToVisit: "Book ahead or go on weekday",
    worthItPercentage: 88,
    avgPricePaid: 210,
  },
  "tpe-19": {
    summary: "Original Tainan-style danzai noodles. Small bowls of thin noodles in shrimp and pork broth. Delicate and flavorful. Order sides to complete the meal.",
    bestItems: ["Danzai noodle"],
    bestFor: ["solo_dining"],
    commonComplaints: ["Small portions", "Need to order sides"],
    worthItPercentage: 85,
    avgPricePaid: 80,
  },
  "tpe-20": {
    summary: "Shida Night Market stewed snack stall where you pick your own ingredients. Perfect student meal near NTNU at night market prices.",
    bestItems: ["Lu wei (pick your own stewed snacks)"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Crowded night market"],
    worthItPercentage: 88,
    avgPricePaid: 70,
  },
  "tpe-21": {
    summary: "Chain beef noodle soup shop found across Taipei. Reliable, quick, air-conditioned. Not the best but good for a weekday lunch without queuing.",
    bestItems: ["Beef noodle soup"],
    bestFor: ["daily_eats"],
    commonComplaints: ["Chain quality", "Not exceptional"],
    worthItPercentage: 80,
    avgPricePaid: 100,
  },
};
