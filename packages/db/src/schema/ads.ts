import {
  pgTable, uuid, varchar, decimal, integer, boolean, timestamp, text,
} from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';

export const promotedListings = pgTable('promoted_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id),
  campaignName: varchar('campaign_name', { length: 200 }),
  budgetTotal: decimal('budget_total', { precision: 10, scale: 2 }),
  budgetSpent: decimal('budget_spent', { precision: 10, scale: 2 }).default('0'),
  costPerClick: decimal('cost_per_click', { precision: 6, scale: 4 }),
  costPerImpression: decimal('cost_per_impression', { precision: 6, scale: 4 }),
  targetPurposes: text('target_purposes').array(),
  targetCityIds: integer('target_city_ids').array(),
  targetRadiusKm: decimal('target_radius_km', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).default('pending'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const priceAlerts = pgTable('price_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  restaurantId: uuid('restaurant_id'),
  menuItemId: uuid('menu_item_id'),
  previousPrice: decimal('previous_price', { precision: 10, scale: 2 }),
  newPrice: decimal('new_price', { precision: 10, scale: 2 }),
  changePct: decimal('change_pct', { precision: 5, scale: 2 }),
  alertType: varchar('alert_type', { length: 20 }),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
