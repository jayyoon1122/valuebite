import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import { promotedListings, restaurants } from '@valuebite/db';

export async function businessRoutes(app: FastifyInstance) {
  const db = (app as any).db;
  const auth = (app as any).authenticate;

  // Create promoted listing campaign
  app.post('/promote', { preHandler: [auth] }, async (request) => {
    const body = z.object({
      restaurantId: z.string().uuid(),
      campaignName: z.string().min(1),
      budgetTotal: z.number().min(1000),
      targetPurposes: z.array(z.string()).optional(),
      targetCityIds: z.array(z.number()).optional(),
      targetRadiusKm: z.number().default(3),
      durationDays: z.number().default(7),
    }).parse(request.body);

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + body.durationDays * 24 * 60 * 60 * 1000);

    // Calculate CPC from budget and estimated impressions
    const estimatedImpressions = body.budgetTotal * 1.2;
    const estimatedClicks = estimatedImpressions * 0.028;
    const cpc = body.budgetTotal / Math.max(1, estimatedClicks);

    const [campaign] = await db.insert(promotedListings).values({
      restaurantId: body.restaurantId,
      campaignName: body.campaignName,
      budgetTotal: String(body.budgetTotal),
      costPerClick: String(Math.round(cpc * 100) / 100),
      targetPurposes: body.targetPurposes,
      targetCityIds: body.targetCityIds,
      targetRadiusKm: String(body.targetRadiusKm),
      status: 'active',
      startsAt,
      endsAt,
    }).returning();

    return { success: true, data: campaign };
  });

  // Get campaigns for a restaurant owner
  app.get('/campaigns', { preHandler: [auth] }, async (request) => {
    const query = z.object({
      restaurantId: z.string().uuid().optional(),
    }).parse(request.query);

    let campaigns;
    if (query.restaurantId) {
      campaigns = await db.select().from(promotedListings)
        .where(eq(promotedListings.restaurantId, query.restaurantId));
    } else {
      campaigns = await db.select().from(promotedListings).limit(20);
    }

    return { success: true, data: campaigns };
  });

  // Pause/resume campaign
  app.patch('/campaigns/:id', { preHandler: [auth] }, async (request) => {
    const { id } = request.params as { id: string };
    const body = z.object({
      status: z.enum(['active', 'paused', 'ended']),
    }).parse(request.body);

    const [campaign] = await db.update(promotedListings)
      .set({ status: body.status })
      .where(eq(promotedListings.id, id))
      .returning();

    return { success: true, data: campaign };
  });

  // Log ad impression
  app.post('/impression', async (request) => {
    const body = z.object({ campaignId: z.string().uuid() }).parse(request.body);
    await db.update(promotedListings)
      .set({ impressions: sql`${promotedListings.impressions} + 1` })
      .where(eq(promotedListings.id, body.campaignId));
    return { success: true };
  });

  // Log ad click
  app.post('/click', async (request) => {
    const body = z.object({ campaignId: z.string().uuid() }).parse(request.body);

    const [campaign] = await db.select().from(promotedListings)
      .where(eq(promotedListings.id, body.campaignId)).limit(1);

    if (campaign) {
      const cpc = parseFloat(campaign.costPerClick || '0');
      await db.update(promotedListings).set({
        clicks: sql`${promotedListings.clicks} + 1`,
        budgetSpent: sql`CAST(${promotedListings.budgetSpent} AS DECIMAL) + ${cpc}`,
      }).where(eq(promotedListings.id, body.campaignId));
    }
    return { success: true };
  });

  // Get ad analytics
  app.get('/analytics', { preHandler: [auth] }, async (request) => {
    const campaigns = await db.select().from(promotedListings).limit(50);

    const totalSpent = campaigns.reduce((s, c) => s + parseFloat(c.budgetSpent || '0'), 0);
    const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
    const totalClicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;

    return {
      success: true,
      data: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalSpent: Math.round(totalSpent),
        totalImpressions,
        totalClicks,
        avgCTR: Math.round(ctr * 100) / 100,
        campaigns,
      },
    };
  });
}
