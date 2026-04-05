import {
  pgTable, uuid, varchar, jsonb, boolean, timestamp,
  decimal, integer, text,
} from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),

  name: jsonb('name').notNull().$type<Record<string, string>>(),
  description: jsonb('description').$type<Record<string, string>>(),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),

  estimatedCalories: integer('estimated_calories'),
  hasProtein: boolean('has_protein'),
  isVegetarian: boolean('is_vegetarian'),
  isVegan: boolean('is_vegan'),
  allergens: text('allergens').array(),

  isLunchSpecial: boolean('is_lunch_special').default(false),
  isSeasonal: boolean('is_seasonal').default(false),
  availableHours: jsonb('available_hours'),
  lastVerified: timestamp('last_verified', { withTimezone: true }),
  source: varchar('source', { length: 50 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const menuPhotos = pgTable('menu_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  uploadedBy: uuid('uploaded_by'),
  photoUrl: varchar('photo_url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

  aiProcessed: boolean('ai_processed').default(false),
  aiExtractedItems: jsonb('ai_extracted_items'),
  aiConfidence: decimal('ai_confidence', { precision: 3, scale: 2 }),
  aiLanguageDetected: varchar('ai_language_detected', { length: 10 }),

  photoDate: timestamp('photo_date'),
  isStale: boolean('is_stale').default(false),
  stalenessWarning: varchar('staleness_warning', { length: 200 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
