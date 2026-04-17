import { relations, sql } from 'drizzle-orm';
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const generateUUID = sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`;

/** Role codes used in RBAC middleware (slug). */
export const roles = sqliteTable('roles', {
  id: text('id').primaryKey().default(generateUUID),
  slug: text('slug', { length: 64 }).notNull().unique(),
  name: text('name', { length: 128 }).notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey().default(generateUUID),
  email: text('email', { length: 256 }).notNull().unique(),
  name: text('name', { length: 256 }).notNull(),
  phone: text('phone', { length: 32 }),
  avatar: text('avatar', { length: 2048 }),
  address: text('address', { length: 512 }),
  passwordHash: text('password_hash'),
  roleId: text('role_id').references(() => roles.id),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().default(generateUUID),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshTokenHash: text('refresh_token_hash', { length: 128 }).notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revokedAt: text('revoked_at'),
});

export const passwordResets = sqliteTable('password_resets', {
  id: text('id').primaryKey().default(generateUUID),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash', { length: 128 }).notNull(),
  expiresAt: text('expires_at').notNull(),
  usedAt: text('used_at'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().default(generateUUID),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title', { length: 256 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  category: text('category', { length: 128 }),
  slug: text('slug', { length: 256 }),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

/** Cho thuê nhà — tin đăng bất động sản. */
export const properties = sqliteTable('properties', {
  id: text('id').primaryKey().default(generateUUID),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title', { length: 512 }).notNull(),
  propertyType: text('property_type', { length: 128 }).notNull(),
  project: text('project', { length: 256 }),
  bedrooms: integer('bedrooms').notNull().default(0),
  bathrooms: integer('bathrooms').notNull().default(0),
  floors: integer('floors'),
  areaValue: real('area_value').notNull(),
  priceValue: real('price_value').notNull(),
  depositText: text('deposit_text', { length: 256 }),
  location: text('location', { length: 512 }).notNull(),
  locationExtra: text('location_extra', { length: 256 }),
  description: text('description').notNull(),
  contactPhone: text('contact_phone', { length: 64 }),
  imagesJson: text('images_json').notNull().default('[]'),
  status: text('status', { length: 32 }).notNull().default('pending'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().default(generateUUID),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  postId: text('post_id')
    .notNull()
    .references(() => posts.id),
  content: text('content').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

/** Tin yêu thích — mỗi user một dòng duy nhất theo property. */
export const savedProperties = sqliteTable(
  'saved_properties',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    propertyId: text('property_id')
      .notNull()
      .references(() => properties.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.propertyId] }),
  }),
);

/** Cấu hình trang (JSON theo key), ví dụ `contact_page`. */
export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

/** Tin nhắn gửi từ form liên hệ công khai. */
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: text('id').primaryKey().default(generateUUID),
  name: text('name', { length: 256 }).notNull(),
  phone: text('phone', { length: 64 }).notNull(),
  email: text('email', { length: 256 }).notNull(),
  topic: text('topic', { length: 64 }).notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  sessions: many(sessions),
  passwordResets: many(passwordResets),
  posts: many(posts),
  comments: many(comments),
  properties: many(properties),
  savedProperties: many(savedProperties),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, { fields: [passwordResets.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, { fields: [properties.userId], references: [users.id] }),
  savedBy: many(savedProperties),
}));

export const savedPropertiesRelations = relations(savedProperties, ({ one }) => ({
  user: one(users, { fields: [savedProperties.userId], references: [users.id] }),
  property: one(properties, { fields: [savedProperties.propertyId], references: [properties.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, { fields: [comments.userId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));

export const schema = {
  roles,
  users,
  sessions,
  passwordResets,
  posts,
  properties,
  comments,
  savedProperties,
  siteSettings,
  contactSubmissions,
  rolesRelations,
  usersRelations,
  sessionsRelations,
  passwordResetsRelations,
  postsRelations,
  propertiesRelations,
  commentsRelations,
  savedPropertiesRelations,
};

export type Role = typeof roles.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type PasswordReset = typeof passwordResets.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type SavedProperty = typeof savedProperties.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
