/**
 * Review Sentiment Analysis Pipeline
 * Uses Claude Haiku for fast, cheap analysis at scale
 */

interface ReviewAnalysisResult {
  sentiment: number; // -1.0 to 1.0
  keywords: string[];
  summary: string;
  scores: {
    taste?: number; // 1-5
    portion?: number;
    value?: number;
    cleanliness?: number;
    service?: number;
    atmosphere?: number;
  };
  purposeFitSignals: {
    dailyEats: number; // 0-1 signal strength
    dateNight: number;
    familyDinner: number;
    lateNight: number;
    healthyBudget: number;
    soloDining: number;
    groupParty: number;
  };
  language: string;
  isSpam: boolean;
}

const REVIEW_ANALYSIS_PROMPT = `Analyze this restaurant review. Return a JSON object:

{
  "sentiment": 0.7,
  "keywords": ["generous portions", "fast service", "good value"],
  "summary": "Affordable gyudon with generous portions and fast service. Great for quick solo lunch.",
  "scores": {
    "taste": 4,
    "portion": 5,
    "value": 5,
    "cleanliness": 3,
    "service": 4,
    "atmosphere": 2
  },
  "purposeFitSignals": {
    "dailyEats": 0.9,
    "dateNight": 0.1,
    "familyDinner": 0.3,
    "lateNight": 0.6,
    "healthyBudget": 0.4,
    "soloDining": 0.9,
    "groupParty": 0.2
  },
  "language": "en",
  "isSpam": false
}

Rules:
- sentiment: -1.0 (very negative) to 1.0 (very positive)
- scores: only include aspects mentioned in the review, 1-5 scale
- keywords: 3-5 short phrases capturing key points
- summary: one concise sentence summarizing the review
- purposeFitSignals: 0-1 for how much this review suggests the restaurant fits each purpose
  - dailyEats: quick, affordable, near offices, consistent
  - dateNight: romantic, nice atmosphere, unique
  - familyDinner: kid-friendly, spacious, variety
  - lateNight: open late, comfort food, quick
  - healthyBudget: nutritious, fresh, healthy options
  - soloDining: counter seating, no awkward minimum, solo-friendly
  - groupParty: sharing menu, festive, large tables
- isSpam: true if review appears fake, promotional, or irrelevant
- Detect the review language`;

export async function analyzeReview(
  reviewText: string,
  apiKey: string,
): Promise<ReviewAnalysisResult> {
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
          content: `Review to analyze:\n"${reviewText}"\n\n${REVIEW_ANALYSIS_PROMPT}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse review analysis response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Batch analyze multiple reviews for a restaurant
 */
export async function analyzeReviewBatch(
  reviews: { id: string; content: string }[],
  apiKey: string,
): Promise<Map<string, ReviewAnalysisResult>> {
  const results = new Map<string, ReviewAnalysisResult>();

  // Process in parallel with concurrency limit
  const concurrency = 5;
  for (let i = 0; i < reviews.length; i += concurrency) {
    const batch = reviews.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(async (review) => {
        const result = await analyzeReview(review.content, apiKey);
        return { id: review.id, result };
      }),
    );

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.set(r.value.id, r.value.result);
      }
    }
  }

  return results;
}
