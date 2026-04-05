import { pgTable, serial, integer, varchar, jsonb, boolean, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
import { countries } from './countries';

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  countryId: integer('country_id').references(() => countries.id),
  name: jsonb('name').notNull().$type<Record<string, string>>(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  isActive: boolean('is_active').default(false),
  restaurantCount: integer('restaurant_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const neighborhoods = pgTable('neighborhoods', {
  id: serial('id').primaryKey(),
  cityId: integer('city_id').references(() => cities.id),
  name: jsonb('name').notNull().$type<Record<string, string>>(),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  avgMealPrice: decimal('avg_meal_price', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

import { decimal } from 'drizzle-orm/pg-core';
