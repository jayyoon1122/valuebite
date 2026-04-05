import { pgTable, serial, varchar, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 2 }).unique().notNull(),
  name: jsonb('name').notNull().$type<Record<string, string>>(),
  currencyCode: varchar('currency_code', { length: 3 }).notNull(),
  currencySymbol: varchar('currency_symbol', { length: 5 }).notNull(),
  defaultLocale: varchar('default_locale', { length: 10 }).notNull(),
  timezone: varchar('timezone', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
