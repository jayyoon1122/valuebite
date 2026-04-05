import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { menuItems } from '@valuebite/db';

const createMenuItemSchema = z.object({
  restaurantId: z.string().uuid(),
  name: z.record(z.string()),
  description: z.record(z.string()).optional(),
  category: z.string().optional(),
  price: z.number(),
  currency: z.string().length(3),
  estimatedCalories: z.number().optional(),
  hasProtein: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  allergens: z.array(z.string()).optional(),
  isLunchSpecial: z.boolean().optional(),
  isSeasonal: z.boolean().optional(),
});

export async function menuRoutes(app: FastifyInstance) {
  const db = (app as any).db;

  // Get menu for a restaurant
  app.get('/restaurant/:restaurantId', async (request) => {
    const { restaurantId } = request.params as { restaurantId: string };
    const items = await db.select().from(menuItems)
      .where(eq(menuItems.restaurantId, restaurantId));

    // Group by category
    const grouped: Record<string, typeof items> = {};
    for (const item of items) {
      const cat = item.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }

    return { success: true, data: { items, grouped } };
  });

  // Add menu item
  app.post('/', { preHandler: [(app as any).authenticate] }, async (request) => {
    const body = createMenuItemSchema.parse(request.body);
    const [item] = await db.insert(menuItems).values({
      ...body,
      price: String(body.price),
      source: 'user_input',
    }).returning();

    return { success: true, data: item };
  });

  // Update menu item
  app.patch('/:id', { preHandler: [(app as any).authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    const body = createMenuItemSchema.partial().parse(request.body);
    const updateData: any = { ...body, updatedAt: new Date() };
    if (body.price !== undefined) updateData.price = String(body.price);

    const [item] = await db.update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();

    return { success: true, data: item };
  });

  // Delete menu item
  app.delete('/:id', { preHandler: [(app as any).authenticate] }, async (request) => {
    const { id } = request.params as { id: string };
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return { success: true };
  });
}
