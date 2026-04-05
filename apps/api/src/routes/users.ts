import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users, userFavorites, userVisits, restaurants } from '@valuebite/db';

export async function userRoutes(app: FastifyInstance) {
  const db = (app as any).db;
  const auth = (app as any).authenticate;

  // Get profile
  app.get('/profile', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return { success: false, error: 'User not found' };
    const { passwordHash, ...safeUser } = user;
    return { success: true, data: safeUser };
  });

  // Update profile
  app.patch('/profile', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const body = z.object({
      displayName: z.string().optional(),
      homeCountryId: z.number().optional(),
      homeCityId: z.number().optional(),
      preferredLocale: z.string().optional(),
      preferredPurposes: z.array(z.string()).optional(),
      dietaryPrefs: z.array(z.string()).optional(),
      monthlyBudget: z.number().optional(),
    }).parse(request.body);

    const updateData: any = { ...body, updatedAt: new Date() };
    if (body.monthlyBudget !== undefined) updateData.monthlyBudget = String(body.monthlyBudget);

    const [user] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning();
    const { passwordHash, ...safeUser } = user;
    return { success: true, data: safeUser };
  });

  // Get favorites
  app.get('/favorites', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const favs = await db.select({
      restaurantId: userFavorites.restaurantId,
      listName: userFavorites.listName,
      notes: userFavorites.notes,
      createdAt: userFavorites.createdAt,
      restaurant: {
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        avgMealPrice: restaurants.avgMealPrice,
        valueScore: restaurants.valueScore,
        lat: restaurants.lat,
        lng: restaurants.lng,
      },
    })
    .from(userFavorites)
    .innerJoin(restaurants, eq(userFavorites.restaurantId, restaurants.id))
    .where(eq(userFavorites.userId, userId));

    return { success: true, data: favs };
  });

  // Add favorite
  app.post('/favorites', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const body = z.object({
      restaurantId: z.string().uuid(),
      listName: z.string().default('favorites'),
      notes: z.string().optional(),
    }).parse(request.body);

    await db.insert(userFavorites).values({ userId, ...body });
    return { success: true };
  });

  // Remove favorite
  app.delete('/favorites/:restaurantId', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const { restaurantId } = request.params as { restaurantId: string };
    await db.delete(userFavorites)
      .where(eq(userFavorites.userId, userId));
    return { success: true };
  });

  // Budget summary
  app.get('/budget', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const visits = await db.select().from(userVisits).where(eq(userVisits.userId, userId));

    const totalSpent = visits.reduce((sum, v) => sum + (parseFloat(v.amountSpent as string) || 0), 0);

    return {
      success: true,
      data: {
        monthlyBudget: user?.monthlyBudget ? parseFloat(user.monthlyBudget) : null,
        totalSpent,
        remaining: user?.monthlyBudget ? parseFloat(user.monthlyBudget) - totalSpent : null,
        visitCount: visits.length,
      },
    };
  });

  // Log expense
  app.post('/budget/log', { preHandler: [auth] }, async (request) => {
    const userId = (request as any).user.id;
    const body = z.object({
      restaurantId: z.string().uuid(),
      amountSpent: z.number(),
      currency: z.string().length(3),
      purpose: z.string().optional(),
    }).parse(request.body);

    const [visit] = await db.insert(userVisits).values({
      userId,
      restaurantId: body.restaurantId,
      amountSpent: String(body.amountSpent),
      currency: body.currency,
      purpose: body.purpose,
    }).returning();

    return { success: true, data: visit };
  });
}
