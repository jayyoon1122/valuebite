import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, desc, sql } from 'drizzle-orm';
import { reviews, restaurants } from '@valuebite/db';

const quickReviewSchema = z.object({
  restaurantId: z.string().uuid(),
  wasWorthIt: z.boolean(),
  pricePaid: z.number().optional(),
  currency: z.string().length(3).optional(),
});

const fullReviewSchema = z.object({
  restaurantId: z.string().uuid(),
  wasWorthIt: z.boolean().optional(),
  pricePaid: z.number().optional(),
  currency: z.string().length(3).optional(),
  tasteRating: z.number().min(1).max(5).optional(),
  portionRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  content: z.string().optional(),
  visitDate: z.string().optional(),
  visitPurpose: z.string().optional(),
});

export async function reviewRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Get reviews for a restaurant
  app.get('/restaurant/:restaurantId', async (request) => {
    const { restaurantId } = request.params as { restaurantId: string };
    const query = z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
      sortBy: z.enum(['recent', 'helpful']).default('recent'),
    }).parse(request.query);

    const orderBy = query.sortBy === 'helpful'
      ? desc(reviews.helpfulCount)
      : desc(reviews.createdAt);

    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.restaurantId, restaurantId))
      .orderBy(orderBy)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit);

    return { success: true, data: results, meta: { page: query.page, limit: query.limit, total: results.length, hasNext: results.length === query.limit } };
  });

  // Quick review ("Was it worth it?")
  app.post('/quick', { preHandler: [(app as any).authenticate] }, async (request) => {
    const body = quickReviewSchema.parse(request.body);
    const userId = (request as any).user.id;

    const [review] = await db.insert(reviews).values({
      restaurantId: body.restaurantId,
      userId,
      wasWorthIt: body.wasWorthIt,
      pricePaid: body.pricePaid ? String(body.pricePaid) : undefined,
      currency: body.currency,
    }).returning();

    // Update restaurant review count
    await db.update(restaurants)
      .set({ totalReviews: sql`${restaurants.totalReviews} + 1`, updatedAt: new Date() })
      .where(eq(restaurants.id, body.restaurantId));

    return { success: true, data: review };
  });

  // Full review
  app.post('/', { preHandler: [(app as any).authenticate] }, async (request) => {
    const body = fullReviewSchema.parse(request.body);
    const userId = (request as any).user.id;

    const [review] = await db.insert(reviews).values({
      restaurantId: body.restaurantId,
      userId,
      wasWorthIt: body.wasWorthIt,
      pricePaid: body.pricePaid ? String(body.pricePaid) : undefined,
      currency: body.currency,
      tasteRating: body.tasteRating,
      portionRating: body.portionRating,
      valueRating: body.valueRating,
      content: body.content,
      visitDate: body.visitDate ? new Date(body.visitDate) : undefined,
      visitPurpose: body.visitPurpose,
    }).returning();

    await db.update(restaurants)
      .set({ totalReviews: sql`${restaurants.totalReviews} + 1`, updatedAt: new Date() })
      .where(eq(restaurants.id, body.restaurantId));

    return { success: true, data: review };
  });

  // Mark review helpful
  app.post('/:id/helpful', { preHandler: [(app as any).authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    await db.update(reviews)
      .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
      .where(eq(reviews.id, id));
    return { success: true };
  });
}
