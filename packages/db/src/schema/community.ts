import {
  pgTable, uuid, integer, varchar, text, boolean, timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { cities } from './cities';
import { restaurants } from './restaurants';

export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  cityId: integer('city_id').references(() => cities.id),
  postType: varchar('post_type', { length: 30 }).notNull(),
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  photos: text('photos').array(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id),
  upvotes: integer('upvotes').default(0),
  commentCount: integer('comment_count').default(0),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
