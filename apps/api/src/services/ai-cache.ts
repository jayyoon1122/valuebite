/**
 * AI Summary Cache & Smart Refresh System
 *
 * Strategy:
 * 1. Store AI summaries in restaurants table (aiSummary JSONB column)
 * 2. Track reviewsSinceLastSummary counter
 * 3. Event-driven: regenerate when threshold reached
 *    - Popular (>50 reviews): every 3 new reviews
 *    - Medium (10-50 reviews): every 5 new reviews
 *    - New (<10 reviews): every review (build trust fast)
 * 4. Also regenerate if summary is >7 days old AND has any new reviews
 * 5. Use Haiku for all summary generation (~$0.001 per summary)
 *
 * Estimated cost: 10K restaurants × avg 2 refreshes/month = ~$20/month
 */

import { eq, and, lt, gt, or, sql } from 'drizzle-orm';
import { restaurants, reviews } from '@valuebite/db';
import { generateRestaurantSummary } from '../ai/summary-generator';

interface RefreshDecision {
  shouldRefresh: boolean;
  reason: string;
}

export function shouldRefreshSummary(
  totalReviews: number,
  reviewsSinceLastSummary: number,
  lastGeneratedAt: Date | null,
): RefreshDecision {
  // Never generated — always generate
  if (!lastGeneratedAt) {
    return { shouldRefresh: true, reason: 'never_generated' };
  }

  const daysSinceGenerated = (Date.now() - lastGeneratedAt.getTime()) / (1000 * 60 * 60 * 24);

  // Threshold based on popularity
  let reviewThreshold: number;
  if (totalReviews > 50) {
    reviewThreshold = 3; // popular: refresh every 3 new reviews
  } else if (totalReviews > 10) {
    reviewThreshold = 5; // medium: every 5
  } else {
    reviewThreshold = 1; // new: every review
  }

  // Enough new reviews to justify regeneration
  if (reviewsSinceLastSummary >= reviewThreshold) {
    return { shouldRefresh: true, reason: `${reviewsSinceLastSummary} new reviews (threshold: ${reviewThreshold})` };
  }

  // Stale summary (>7 days) with at least 1 new review
  if (daysSinceGenerated > 7 && reviewsSinceLastSummary > 0) {
    return { shouldRefresh: true, reason: `stale (${Math.floor(daysSinceGenerated)}d) with ${reviewsSinceLastSummary} new reviews` };
  }

  return { shouldRefresh: false, reason: 'up_to_date' };
}

/**
 * Get cached AI summary for a restaurant, regenerate if needed
 */
export async function getCachedAISummary(
  restaurantId: string,
  db: any,
  apiKey: string,
): Promise<any> {
  const [restaurant] = await db.select().from(restaurants)
    .where(eq(restaurants.id, restaurantId)).limit(1);

  if (!restaurant) return null;

  const decision = shouldRefreshSummary(
    restaurant.totalReviews || 0,
    restaurant.reviewsSinceLastSummary || 0,
    restaurant.aiSummaryGeneratedAt,
  );

  // Return cached if fresh
  if (!decision.shouldRefresh && restaurant.aiSummary) {
    return { ...restaurant.aiSummary, _cached: true, _reason: decision.reason };
  }

  // No API key — return cached even if stale, or null
  if (!apiKey) {
    return restaurant.aiSummary || null;
  }

  // Regenerate
  try {
    const restaurantReviews = await db.select().from(reviews)
      .where(eq(reviews.restaurantId, restaurantId))
      .limit(30); // last 30 reviews for context

    const name = restaurant.name?.en || restaurant.name?.original || '';
    const summary = await generateRestaurantSummary(
      name,
      restaurantReviews.map((r: any) => ({
        content: r.content,
        tasteRating: r.tasteRating,
        portionRating: r.portionRating,
        valueRating: r.valueRating,
        wasWorthIt: r.wasWorthIt,
        pricePaid: r.pricePaid ? parseFloat(r.pricePaid) : undefined,
        visitPurpose: r.visitPurpose,
      })),
      apiKey,
    );

    // Cache in DB
    await db.update(restaurants).set({
      aiSummary: summary,
      aiSummaryGeneratedAt: new Date(),
      reviewsSinceLastSummary: 0,
    }).where(eq(restaurants.id, restaurantId));

    return { ...summary, _cached: false, _reason: decision.reason };
  } catch (err) {
    console.error(`Failed to regenerate summary for ${restaurantId}:`, err);
    return restaurant.aiSummary || null;
  }
}

/**
 * Increment review counter (called when a new review is posted)
 */
export async function onNewReview(restaurantId: string, db: any) {
  await db.update(restaurants).set({
    reviewsSinceLastSummary: sql`COALESCE(${restaurants.reviewsSinceLastSummary}, 0) + 1`,
    totalReviews: sql`COALESCE(${restaurants.totalReviews}, 0) + 1`,
  }).where(eq(restaurants.id, restaurantId));
}

/**
 * Batch job: find restaurants that need summary refresh
 * Run this as a cron job (e.g., daily) to catch any that slipped through
 */
export async function findRestaurantsNeedingRefresh(db: any): Promise<string[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const results = await db.select({ id: restaurants.id })
    .from(restaurants)
    .where(and(
      eq(restaurants.isActive, true),
      gt(restaurants.totalReviews, 0),
      or(
        // Never had a summary
        sql`${restaurants.aiSummary} IS NULL`,
        // Has new reviews and summary is stale
        and(
          gt(restaurants.reviewsSinceLastSummary, 0),
          or(
            lt(restaurants.aiSummaryGeneratedAt, sevenDaysAgo),
            sql`${restaurants.aiSummaryGeneratedAt} IS NULL`,
          ),
        ),
      ),
    ))
    .limit(100); // process 100 at a time

  return results.map((r: any) => r.id);
}
