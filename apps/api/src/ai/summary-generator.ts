/**
 * Restaurant AI Summary Generation
 * Generates an "AI Summary" like Amazon's AI review summary
 */

interface ReviewData {
  content: string;
  tasteRating?: number;
  portionRating?: number;
  valueRating?: number;
  wasWorthIt?: boolean;
  pricePaid?: number;
  visitPurpose?: string;
}

interface AISummary {
  summary: string;
  bestItems: string[];
  bestFor: string[];
  commonComplaints: string[];
  bestTimeToVisit?: string;
  worthItPercentage: number;
  avgPricePaid?: number;
}

const SUMMARY_PROMPT = `Based on these restaurant reviews, generate a concise AI summary.

Return JSON:
{
  "summary": "A 2-3 sentence overview of the restaurant's strengths and value proposition",
  "bestItems": ["Beef Bowl (¥450)", "Curry Set (¥580)"],
  "bestFor": ["Quick solo lunch", "Budget daily meals"],
  "commonComplaints": ["Can be crowded at peak hours"],
  "bestTimeToVisit": "Weekday lunch, avoid 12-1pm rush",
  "worthItPercentage": 87,
  "avgPricePaid": 550
}

Rules:
- summary: 2-3 sentences, honest and helpful, NOT promotional
- bestItems: top 3 menu items mentioned positively, with prices if available
- bestFor: which dining purposes this restaurant is best suited for
- commonComplaints: honest issues mentioned by multiple reviewers (empty array if none)
- bestTimeToVisit: when to go for best experience
- worthItPercentage: percentage of reviewers who said "worth it"
- avgPricePaid: average amount paid by reviewers
- Keep it under 150 words total
- Be specific, not generic`;

export async function generateRestaurantSummary(
  restaurantName: string,
  reviews: ReviewData[],
  apiKey: string,
): Promise<AISummary> {
  if (reviews.length === 0) {
    return {
      summary: 'No reviews yet. Be the first to share your experience!',
      bestItems: [],
      bestFor: [],
      commonComplaints: [],
      worthItPercentage: 0,
    };
  }

  const worthItCount = reviews.filter((r) => r.wasWorthIt === true).length;
  const totalWorthIt = reviews.filter((r) => r.wasWorthIt !== undefined).length;
  const worthItPct = totalWorthIt > 0 ? Math.round((worthItCount / totalWorthIt) * 100) : 0;

  const prices = reviews.filter((r) => r.pricePaid).map((r) => r.pricePaid!);
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : undefined;

  const reviewTexts = reviews
    .filter((r) => r.content)
    .slice(0, 20) // limit to 20 most recent
    .map((r, i) => `Review ${i + 1}: "${r.content}" (taste: ${r.tasteRating || 'n/a'}, portion: ${r.portionRating || 'n/a'}, value: ${r.valueRating || 'n/a'}, worth it: ${r.wasWorthIt ?? 'n/a'}, paid: ${r.pricePaid || 'n/a'})`)
    .join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Restaurant: ${restaurantName}\nNumber of reviews: ${reviews.length}\nWorth it: ${worthItPct}%\nAvg price paid: ${avgPrice || 'unknown'}\n\nReviews:\n${reviewTexts}\n\n${SUMMARY_PROMPT}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      summary: `Based on ${reviews.length} reviews, this restaurant has a ${worthItPct}% "worth it" rating.`,
      bestItems: [],
      bestFor: [],
      commonComplaints: [],
      worthItPercentage: worthItPct,
      avgPricePaid: avgPrice,
    };
  }

  const result: AISummary = JSON.parse(jsonMatch[0]);
  result.worthItPercentage = worthItPct;
  result.avgPricePaid = avgPrice;
  return result;
}
