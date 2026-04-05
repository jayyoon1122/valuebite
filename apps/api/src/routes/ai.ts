import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { restaurants, reviews, menuItems, menuPhotos } from '@valuebite/db';
import { analyzeMenuPhoto, checkPhotoStaleness } from '../ai/menu-analyzer';
import { analyzeReview } from '../ai/review-analyzer';
import { generateRestaurantSummary } from '../ai/summary-generator';
import { calculateValueScore, aggregateReviewScores } from '../services/value-score';
import { calculateAllPurposeFits } from '../services/purpose-fit';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

export async function aiRoutes(app: FastifyInstance) {
  const db = (app as any).db;
  const auth = (app as any).authenticate;

  // Analyze a menu photo
  app.post('/menu-photo/analyze', { preHandler: [auth] }, async (request, reply) => {
    if (!ANTHROPIC_API_KEY) {
      return reply.status(503).send({ success: false, error: 'AI service not configured. Set ANTHROPIC_API_KEY.' });
    }

    const body = z.object({
      restaurantId: z.string().uuid(),
      imageBase64: z.string(),
      photoDate: z.string().optional(),
    }).parse(request.body);

    // Check photo staleness
    const photoDate = body.photoDate ? new Date(body.photoDate) : null;
    const staleness = checkPhotoStaleness(photoDate);

    // Analyze with Claude Vision
    const analysis = await analyzeMenuPhoto(body.imageBase64, ANTHROPIC_API_KEY);

    // Store extracted menu items
    for (const item of analysis.items) {
      await db.insert(menuItems).values({
        restaurantId: body.restaurantId,
        name: item.name,
        description: item.description,
        category: item.category,
        price: String(item.price),
        currency: item.currency,
        estimatedCalories: item.estimatedCalories,
        hasProtein: item.hasProtein,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
        isLunchSpecial: item.isLunchSpecial || false,
        isSeasonal: item.isSeasonal || false,
        source: 'ai_photo_extract',
        lastVerified: new Date(),
      });
    }

    // Store menu photo record
    await db.insert(menuPhotos).values({
      restaurantId: body.restaurantId,
      uploadedBy: (request as any).user.id,
      photoUrl: `menu-photos/${body.restaurantId}/${Date.now()}.jpg`, // placeholder
      aiProcessed: true,
      aiExtractedItems: analysis.items,
      aiConfidence: String(analysis.confidence),
      aiLanguageDetected: analysis.language,
      photoDate: photoDate,
      isStale: staleness.isStale,
      stalenessWarning: staleness.warning,
    });

    // Update restaurant avg price from extracted items
    if (analysis.items.length > 0) {
      const avgPrice = analysis.items.reduce((sum, i) => sum + i.price, 0) / analysis.items.length;
      await db.update(restaurants)
        .set({
          avgMealPrice: String(Math.round(avgPrice)),
          priceLastVerified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(restaurants.id, body.restaurantId));
    }

    return {
      success: true,
      data: {
        itemsExtracted: analysis.items.length,
        language: analysis.language,
        confidence: analysis.confidence,
        warnings: [...analysis.warnings, ...(staleness.warning ? [staleness.warning] : [])],
        items: analysis.items,
      },
    };
  });

  // Analyze a single review
  app.post('/review/analyze', { preHandler: [auth] }, async (request, reply) => {
    if (!ANTHROPIC_API_KEY) {
      return reply.status(503).send({ success: false, error: 'AI service not configured' });
    }

    const body = z.object({
      reviewId: z.string().uuid(),
      content: z.string(),
    }).parse(request.body);

    const analysis = await analyzeReview(body.content, ANTHROPIC_API_KEY);

    // Update review with AI analysis
    await db.update(reviews)
      .set({
        aiSentiment: String(analysis.sentiment),
        aiKeywords: analysis.keywords,
        aiSummary: analysis.summary,
      })
      .where(eq(reviews.id, body.reviewId));

    return { success: true, data: analysis };
  });

  // Generate/regenerate restaurant AI summary
  app.post('/restaurant/:id/summary', async (request, reply) => {
    if (!ANTHROPIC_API_KEY) {
      return reply.status(503).send({ success: false, error: 'AI service not configured' });
    }

    const { id } = request.params as { id: string };

    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
    if (!restaurant) return reply.status(404).send({ success: false, error: 'Not found' });

    const restaurantReviews = await db.select().from(reviews).where(eq(reviews.restaurantId, id));

    const summary = await generateRestaurantSummary(
      restaurant.name.en || restaurant.name.original || '',
      restaurantReviews.map((r: any) => ({
        content: r.content,
        tasteRating: r.tasteRating,
        portionRating: r.portionRating,
        valueRating: r.valueRating,
        wasWorthIt: r.wasWorthIt,
        pricePaid: r.pricePaid ? parseFloat(r.pricePaid) : undefined,
        visitPurpose: r.visitPurpose,
      })),
      ANTHROPIC_API_KEY,
    );

    return { success: true, data: summary };
  });

  // Recalculate value score and purpose fit for a restaurant
  app.post('/restaurant/:id/recalculate', async (request) => {
    const { id } = request.params as { id: string };

    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
    if (!restaurant) return { success: false, error: 'Not found' };

    const restaurantReviews = await db.select().from(reviews).where(eq(reviews.restaurantId, id));

    // Aggregate review scores
    const aggregated = aggregateReviewScores(restaurantReviews);

    // Calculate value score
    const countryResult = await db.query.countries?.findFirst?.({
      where: (t: any, { eq: e }: any) => e(t.id, restaurant.countryId),
    });
    const countryCode = countryResult?.code || 'JP';

    const valueScore = calculateValueScore(
      {
        tasteScore: aggregated.tasteScore,
        portionScore: aggregated.portionScore,
        nutritionScore: aggregated.nutritionScore,
        cleanlinessScore: aggregated.cleanlinessScore,
        avgMealPrice: restaurant.avgMealPrice ? parseFloat(restaurant.avgMealPrice) : null,
        totalReviews: restaurant.totalReviews || 0,
        countryCode,
      },
      aggregated.worthItRatio,
    );

    // Calculate purpose fit scores
    const purposeFits = calculateAllPurposeFits(
      {
        avgMealPrice: restaurant.avgMealPrice ? parseFloat(restaurant.avgMealPrice) : null,
        cuisineType: restaurant.cuisineType || [],
        operatingHours: restaurant.operatingHours as any,
        is24h: restaurant.is24h || false,
        atmosphereScore: aggregated.atmosphereScore,
        portionScore: aggregated.portionScore,
        nutritionScore: aggregated.nutritionScore,
        totalReviews: restaurant.totalReviews || 0,
        countryCode,
      },
    );

    // Update restaurant
    await db.update(restaurants)
      .set({
        valueScore: String(valueScore),
        tasteScore: String(aggregated.tasteScore),
        portionScore: String(aggregated.portionScore),
        cleanlinessScore: String(aggregated.cleanlinessScore),
        atmosphereScore: String(aggregated.atmosphereScore),
        nutritionScore: String(aggregated.nutritionScore),
        avgMealPrice: aggregated.avgPricePaid ? String(aggregated.avgPricePaid) : restaurant.avgMealPrice,
        ...Object.fromEntries(
          Object.entries(purposeFits).map(([k, v]) => [k, String(v)]),
        ),
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, id));

    return {
      success: true,
      data: {
        valueScore,
        scores: aggregated,
        purposeFits,
      },
    };
  });
}
