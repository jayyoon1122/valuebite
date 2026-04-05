import {
  pgTable, uuid, varchar, boolean, timestamp,
  decimal, integer, text, smallint, index,
} from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants';
import { users } from './users';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),

  wasWorthIt: boolean('was_worth_it'),
  pricePaid: decimal('price_paid', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }),

  tasteRating: smallint('taste_rating'),
  portionRating: smallint('portion_rating'),
  valueRating: smallint('value_rating'),

  content: text('content'),
  language: varchar('language', { length: 10 }),

  aiSentiment: decimal('ai_sentiment', { precision: 3, scale: 2 }),
  aiKeywords: text('ai_keywords').array(),
  aiSummary: text('ai_summary'),

  visitDate: timestamp('visit_date'),
  visitPurpose: varchar('visit_purpose', { length: 50 }),
  photos: text('photos').array(),
  helpfulCount: integer('helpful_count').default(0),
  isFlagged: boolean('is_flagged').default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_reviews_restaurant').on(table.restaurantId, table.createdAt),
]);

export const userVisits = pgTable('user_visits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id),
  visitedAt: timestamp('visited_at', { withTimezone: true }).defaultNow(),
  amountSpent: decimal('amount_spent', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }),
  purpose: varchar('purpose', { length: 50 }),
  quickRating: boolean('quick_rating'),
});

export const userFavorites = pgTable('user_favorites', {
  userId: uuid('user_id').references(() => users.id),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id),
  listName: varchar('list_name', { length: 100 }).default('favorites'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
