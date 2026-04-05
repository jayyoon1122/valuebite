import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, and, sql, desc, asc, lte, ilike } from 'drizzle-orm';
import { restaurants, menuItems, reviews } from '@valuebite/db';
import { slugify } from '@valuebite/utils';

const nearbySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radiusKm: z.coerce.number().default(3),
  purpose: z.string().optional(),
  priceMax: z.coerce.number().optional(),
  cuisine: z.string().optional(),
  sortBy: z.enum(['value_score', 'distance', 'price']).default('distance'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createSchema = z.object({
  name: z.record(z.string()),
  description: z.record(z.string()).optional(),
  cuisineType: z.array(z.string()).optional(),
  lat: z.number(),
  lng: z.number(),
  address: z.record(z.string()),
  phone: z.string().optional(),
  website: z.string().optional(),
  countryId: z.number(),
  cityId: z.number(),
  avgMealPrice: z.number().optional(),
  priceCurrency: z.string().optional(),
  operatingHours: z.record(z.object({ open: z.string(), close: z.string() })).optional(),
  is24h: z.boolean().optional(),
});

export async function restaurantRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Nearby restaurants
  app.get('/nearby', async (request) => {
    const query = nearbySchema.parse(request.query);
    const { lat, lng, radiusKm, purpose, priceMax, sortBy, page, limit } = query;
    const offset = (page - 1) * limit;

    // Haversine-based distance in SQL (approximate for performance)
    const distanceExpr = sql<number>`(
      6371000 * acos(
        cos(radians(${lat})) * cos(radians(${restaurants.lat})) *
        cos(radians(${restaurants.lng}) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(${restaurants.lat}))
      )
    )`;

    const conditions = [
      eq(restaurants.isActive, true),
      sql`${distanceExpr} < ${radiusKm * 1000}`,
    ];

    if (priceMax) {
      conditions.push(lte(restaurants.avgMealPrice, String(priceMax)));
    }

    let orderBy;
    if (sortBy === 'distance') orderBy = asc(distanceExpr);
    else if (sortBy === 'price') orderBy = asc(restaurants.avgMealPrice);
    else orderBy = desc(restaurants.valueScore);

    const results = await db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        cuisineType: restaurants.cuisineType,
        lat: restaurants.lat,
        lng: restaurants.lng,
        avgMealPrice: restaurants.avgMealPrice,
        priceCurrency: restaurants.priceCurrency,
        valueScore: restaurants.valueScore,
        tasteScore: restaurants.tasteScore,
        portionScore: restaurants.portionScore,
        totalReviews: restaurants.totalReviews,
        priceLastVerified: restaurants.priceLastVerified,
        distance: distanceExpr,
        fitDailyEats: restaurants.fitDailyEats,
        fitDateNight: restaurants.fitDateNight,
        fitFamilyDinner: restaurants.fitFamilyDinner,
        fitLateNight: restaurants.fitLateNight,
        fitHealthyBudget: restaurants.fitHealthyBudget,
        fitGroupParty: restaurants.fitGroupParty,
        fitSoloDining: restaurants.fitSoloDining,
        fitSpecialOccasion: restaurants.fitSpecialOccasion,
      })
      .from(restaurants)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const total = results.length; // simplified; real impl would do a count query

    return {
      success: true,
      data: results,
      meta: { page, limit, total, hasNext: results.length === limit },
    };
  });

  // Search
  app.get('/search', async (request) => {
    const query = z.object({
      q: z.string(),
      cityId: z.coerce.number().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
    }).parse(request.query);

    const { q, cityId, page, limit } = query;
    const offset = (page - 1) * limit;

    const conditions = [eq(restaurants.isActive, true)];
    if (cityId) conditions.push(eq(restaurants.cityId, cityId));

    // Simple text search on name JSONB (will be replaced by Meilisearch)
    const results = await db
      .select()
      .from(restaurants)
      .where(and(
        ...conditions,
        sql`${restaurants.name}::text ILIKE ${'%' + q + '%'}`,
      ))
      .orderBy(desc(restaurants.valueScore))
      .limit(limit)
      .offset(offset);

    return { success: true, data: results, meta: { page, limit, total: results.length, hasNext: results.length === limit } };
  });

  // Get by ID
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
    if (!restaurant) return reply.status(404).send({ success: false, error: 'Not found' });

    const menu = await db.select().from(menuItems).where(eq(menuItems.restaurantId, id));
    const recentReviews = await db.select().from(reviews)
      .where(eq(reviews.restaurantId, id))
      .orderBy(desc(reviews.createdAt))
      .limit(5);

    return { success: true, data: { ...restaurant, menu, recentReviews } };
  });

  // Get by purpose
  app.get('/purpose/:purposeKey', async (request) => {
    const { purposeKey } = request.params as { purposeKey: string };
    const query = z.object({
      cityId: z.coerce.number().optional(),
      lat: z.coerce.number().optional(),
      lng: z.coerce.number().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
    }).parse(request.query);

    const fitColumn = {
      daily_eats: restaurants.fitDailyEats,
      date_night: restaurants.fitDateNight,
      family_dinner: restaurants.fitFamilyDinner,
      late_night: restaurants.fitLateNight,
      healthy_budget: restaurants.fitHealthyBudget,
      group_party: restaurants.fitGroupParty,
      solo_dining: restaurants.fitSoloDining,
      special_occasion: restaurants.fitSpecialOccasion,
    }[purposeKey];

    if (!fitColumn) {
      return { success: false, error: 'Invalid purpose key' };
    }

    const conditions = [eq(restaurants.isActive, true)];
    if (query.cityId) conditions.push(eq(restaurants.cityId, query.cityId));

    const results = await db
      .select()
      .from(restaurants)
      .where(and(...conditions))
      .orderBy(desc(fitColumn))
      .limit(query.limit)
      .offset((query.page - 1) * query.limit);

    return { success: true, data: results, meta: { page: query.page, limit: query.limit, total: results.length, hasNext: results.length === query.limit } };
  });

  // Create restaurant (auth required)
  app.post('/', { preHandler: [(app as any).authenticate] }, async (request) => {
    const body = createSchema.parse(request.body);
    const nameEn = body.name.en || body.name.original || Object.values(body.name)[0] || '';
    const slug = slugify(nameEn) + '-' + Date.now().toString(36);

    const [restaurant] = await db.insert(restaurants).values({
      ...body,
      slug,
      source: 'user',
    }).returning();

    return { success: true, data: restaurant };
  });

  // Trending
  app.get('/trending', async (request) => {
    const query = z.object({
      cityId: z.coerce.number().optional(),
      limit: z.coerce.number().default(10),
    }).parse(request.query);

    const conditions = [eq(restaurants.isActive, true)];
    if (query.cityId) conditions.push(eq(restaurants.cityId, query.cityId));

    const results = await db
      .select()
      .from(restaurants)
      .where(and(...conditions))
      .orderBy(desc(restaurants.totalReviews), desc(restaurants.valueScore))
      .limit(query.limit);

    return { success: true, data: results };
  });
}
