import { z } from 'zod';
import { uuidParam } from './common';

export const blogListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().max(128).optional(),
});

export const blogPostIdParamSchema = z.object({
  id: uuidParam,
});

export const blogCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const blogCommentCreateSchema = z.object({
  content: z.string().min(1).max(4000),
});

const optionalCover = z.union([z.literal(''), z.string().url().max(2048)]);

export const adminBlogPostCreateSchema = z.object({
  title: z.string().min(1).max(256),
  content: z.string().min(1),
  excerpt: z.string().max(2000).nullable().optional(),
  coverImage: optionalCover.nullable().optional(),
  category: z.string().max(128).nullable().optional(),
  slug: z.string().max(256).nullable().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const adminBlogPostUpdateSchema = adminBlogPostCreateSchema.partial();
