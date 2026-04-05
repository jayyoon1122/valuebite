import { pgTable, serial, integer, varchar, jsonb, decimal, timestamp } from 'drizzle-orm/pg-core';
import { countries } from './countries';
import { cities } from './cities';

export const priceBrackets = pgTable('price_brackets', {
  id: serial('id').primaryKey(),
  countryId: integer('country_id').references(() => countries.id),
  cityId: integer('city_id').references(() => cities.id), // city-level brackets override country defaults
  purposeKey: varchar('purpose_key', { length: 50 }).notNull(),
  purposeLabel: jsonb('purpose_label').notNull().$type<Record<string, string>>(),
  maxPrice: decimal('max_price', { precision: 10, scale: 2 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  description: jsonb('description').$type<Record<string, string>>(),
  sortOrder: integer('sort_order').default(0),
  lastAdjusted: timestamp('last_adjusted', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
