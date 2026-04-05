import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as countriesSchema from './schema/countries';
import * as priceBracketsSchema from './schema/price-brackets';
import * as citiesSchema from './schema/cities';
import * as restaurantsSchema from './schema/restaurants';
import * as menuItemsSchema from './schema/menu-items';
import * as usersSchema from './schema/users';
import * as reviewsSchema from './schema/reviews';
import * as communitySchema from './schema/community';
import * as adsSchema from './schema/ads';

export const schema = {
  ...countriesSchema,
  ...priceBracketsSchema,
  ...citiesSchema,
  ...restaurantsSchema,
  ...menuItemsSchema,
  ...usersSchema,
  ...reviewsSchema,
  ...communitySchema,
  ...adsSchema,
};

export function createDb(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;

export * from './schema/countries';
export * from './schema/price-brackets';
export * from './schema/cities';
export * from './schema/restaurants';
export * from './schema/menu-items';
export * from './schema/users';
export * from './schema/reviews';
export * from './schema/community';
export * from './schema/ads';
