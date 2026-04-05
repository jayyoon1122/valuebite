import {
  pgTable, uuid, varchar, integer, boolean, timestamp,
  decimal, text,
} from 'drizzle-orm/pg-core';
import { countries } from './countries';
import { cities } from './cities';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  authProvider: varchar('auth_provider', { length: 20 }),
  authProviderId: varchar('auth_provider_id', { length: 255 }),

  homeCountryId: integer('home_country_id').references(() => countries.id),
  homeCityId: integer('home_city_id').references(() => cities.id),
  preferredLocale: varchar('preferred_locale', { length: 10 }),
  preferredPurposes: text('preferred_purposes').array(),
  dietaryPrefs: text('dietary_prefs').array(),
  monthlyBudget: decimal('monthly_budget', { precision: 10, scale: 2 }),

  contributionPoints: integer('contribution_points').default(0),
  level: integer('level').default(1),
  badges: text('badges').array(),
  totalReviews: integer('total_reviews').default(0),
  totalPhotos: integer('total_photos').default(0),

  monthlySpent: decimal('monthly_spent', { precision: 10, scale: 2 }).default('0'),
  monthlyResetDay: integer('monthly_reset_day').default(1),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  lastActive: timestamp('last_active', { withTimezone: true }),
});
