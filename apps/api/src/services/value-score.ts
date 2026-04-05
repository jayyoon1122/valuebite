/**
 * Value Score Calculation Engine
 * The CORE differentiator — not just cheap, but VALUE.
 * Range: 0.00 - 5.00
 */

interface RestaurantScoreInput {
  tasteScore: number | null;
  portionScore: number | null;
  nutritionScore: number | null;
  cleanlinessScore: number | null;
  avgMealPrice: number | null;
  totalReviews: number;
  countryCode: string;
}

interface PriceBracketInfo {
  maxPrice: number;
}

// Default daily_eats brackets per country
const DEFAULT_BRACKETS: Record<string, PriceBracketInfo> = {
  JP: { maxPrice: 1000 },
  US: { maxPrice: 10 },
  GB: { maxPrice: 8 },
  DE: { maxPrice: 8 },
  KR: { maxPrice: 7000 },
  FR: { maxPrice: 8 },
};

export function calculateValueScore(
  restaurant: RestaurantScoreInput,
  worthItRatio: number, // 0-1, percentage of "was it worth it" = yes
  bracket?: PriceBracketInfo,
): number {
  // Quality metrics (from AI analysis of reviews + community ratings)
  const taste = restaurant.tasteScore ?? 3.0;
  const portion = restaurant.portionScore ?? 3.0;
  const nutrition = restaurant.nutritionScore ?? 3.0;
  const cleanliness = restaurant.cleanlinessScore ?? 3.0;

  const qualityComposite =
    taste * 0.35 + portion * 0.25 + nutrition * 0.2 + cleanliness * 0.2;

  // Price factor: how cheap relative to the bracket ceiling
  const bracketInfo =
    bracket || DEFAULT_BRACKETS[restaurant.countryCode] || DEFAULT_BRACKETS.US;
  const price = restaurant.avgMealPrice ?? bracketInfo.maxPrice;
  const priceRatio = price / bracketInfo.maxPrice;

  let priceFactor: number;
  if (priceRatio <= 0) {
    priceFactor = 1.0;
  } else if (priceRatio <= 0.5) {
    priceFactor = 1.5; // significantly under budget = bonus
  } else if (priceRatio <= 1.0) {
    priceFactor = 1.0 + (1.0 - priceRatio) * 0.5; // under budget = slight bonus
  } else {
    priceFactor = Math.max(0.3, 1.0 / priceRatio); // over budget = penalty
  }

  // Community validation
  const confidence = Math.min(1.0, restaurant.totalReviews / 20);
  const communityFactor = 0.5 + worthItRatio * confidence * 0.5;

  // Final score
  const rawScore = qualityComposite * priceFactor * communityFactor;
  return Math.min(5.0, Math.round(rawScore * 100) / 100);
}

/**
 * Update all sub-scores from aggregated review data
 */
export function aggregateReviewScores(
  reviews: Array<{
    tasteRating?: number | null;
    portionRating?: number | null;
    valueRating?: number | null;
    wasWorthIt?: boolean | null;
    aiSentiment?: number | null;
    pricePaid?: number | null;
  }>,
): {
  tasteScore: number;
  portionScore: number;
  cleanlinessScore: number;
  atmosphereScore: number;
  nutritionScore: number;
  worthItRatio: number;
  avgPricePaid: number | null;
} {
  const tasteRatings = reviews.filter((r) => r.tasteRating).map((r) => r.tasteRating!);
  const portionRatings = reviews.filter((r) => r.portionRating).map((r) => r.portionRating!);
  const valueRatings = reviews.filter((r) => r.valueRating).map((r) => r.valueRating!);
  const worthItVotes = reviews.filter((r) => r.wasWorthIt !== null && r.wasWorthIt !== undefined);
  const prices = reviews.filter((r) => r.pricePaid).map((r) => Number(r.pricePaid));

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 3.0;

  const worthItYes = worthItVotes.filter((r) => r.wasWorthIt === true).length;
  const worthItRatio = worthItVotes.length > 0 ? worthItYes / worthItVotes.length : 0.5;

  // Sentiment-based scores for aspects not directly rated
  const sentiments = reviews.filter((r) => r.aiSentiment != null).map((r) => Number(r.aiSentiment));
  const avgSentiment = sentiments.length > 0 ? avg(sentiments) : 0;
  const sentimentScore = 3.0 + avgSentiment * 2.0; // map -1..1 to 1..5

  return {
    tasteScore: Math.round(avg(tasteRatings) * 100) / 100,
    portionScore: Math.round(avg(portionRatings) * 100) / 100,
    cleanlinessScore: Math.round(sentimentScore * 100) / 100, // derived from sentiment
    atmosphereScore: Math.round(sentimentScore * 100) / 100,
    nutritionScore: 3.0, // will be improved by AI menu analysis
    worthItRatio: Math.round(worthItRatio * 100) / 100,
    avgPricePaid: prices.length > 0 ? Math.round(avg(prices) * 100) / 100 : null,
  };
}
