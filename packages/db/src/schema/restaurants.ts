import {
  pgTable, uuid, integer, varchar, jsonb, boolean, timestamp,
  doublePrecision, decimal, text, index,
} from 'drizzle-orm/pg-core';
import { countries } from './countries';
import { cities } from './cities';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  countryId: integer('country_id').references(() => countries.id),
  cityId: integer('city_id').references(() => cities.id),
  neighborhoodId: integer('neighborhood_id'),

  name: jsonb('name').notNull().$type<Record<string, string>>(),
  slug: varchar('slug', { length: 255 }).unique(),
  description: jsonb('description').$type<Record<string, string>>(),
  cuisineType: text('cuisine_type').array(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  address: jsonb('address').notNull().$type<Record<string, string>>(),
  phone: varchar('phone', { length: 30 }),
  website: varchar('website', { length: 500 }),

  operatingHours: jsonb('operating_hours').$type<Record<string, { open: string; close: string }>>(),
  is24h: boolean('is_24h').default(false),
  acceptsCards: boolean('accepts_cards'),
  acceptsMobilePay: boolean('accepts_mobile_pay'),

  avgMealPrice: decimal('avg_meal_price', { precision: 10, scale: 2 }),
  priceRangeMin: decimal('price_range_min', { precision: 10, scale: 2 }),
  priceRangeMax: decimal('price_range_max', { precision: 10, scale: 2 }),
  priceLastVerified: timestamp('price_last_verified', { withTimezone: true }),
  priceCurrency: varchar('price_currency', { length: 3 }),

  valueScore: decimal('value_score', { precision: 3, scale: 2 }),
  tasteScore: decimal('taste_score', { precision: 3, scale: 2 }),
  portionScore: decimal('portion_score', { precision: 3, scale: 2 }),
  cleanlinessScore: decimal('cleanliness_score', { precision: 3, scale: 2 }),
  atmosphereScore: decimal('atmosphere_score', { precision: 3, scale: 2 }),
  nutritionScore: decimal('nutrition_score', { precision: 3, scale: 2 }),

  fitDailyEats: decimal('fit_daily_eats', { precision: 3, scale: 2 }).default('0'),
  fitDateNight: decimal('fit_date_night', { precision: 3, scale: 2 }).default('0'),
  fitFamilyDinner: decimal('fit_family_dinner', { precision: 3, scale: 2 }).default('0'),
  fitLateNight: decimal('fit_late_night', { precision: 3, scale: 2 }).default('0'),
  fitHealthyBudget: decimal('fit_healthy_budget', { precision: 3, scale: 2 }).default('0'),
  fitGroupParty: decimal('fit_group_party', { precision: 3, scale: 2 }).default('0'),
  fitSoloDining: decimal('fit_solo_dining', { precision: 3, scale: 2 }).default('0'),
  fitSpecialOccasion: decimal('fit_special_occasion', { precision: 3, scale: 2 }).default('0'),

  source: varchar('source', { length: 50 }),
  externalIds: jsonb('external_ids').$type<Record<string, string>>(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  totalReviews: integer('total_reviews').default(0),
  totalVisits: integer('total_visits').default(0),
  photoCount: integer('photo_count').default(0),

  // Cached AI summary (regenerated on event-driven schedule)
  aiSummary: jsonb('ai_summary').$type<{
    summary: string;
    bestItems: string[];
    bestFor: string[];
    commonComplaints: string[];
    bestTimeToVisit?: string;
    worthItPercentage: number;
    avgPricePaid?: number;
  }>(),
  aiSummaryGeneratedAt: timestamp('ai_summary_generated_at', { withTimezone: true }),
  reviewsSinceLastSummary: integer('reviews_since_last_summary').default(0),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  lastUserUpdate: timestamp('last_user_update', { withTimezone: true }),
}, (table) => [
  index('idx_restaurants_city').on(table.cityId, table.isActive),
  index('idx_restaurants_location').on(table.lat, table.lng),
  index('idx_restaurants_value').on(table.valueScore),
]);
