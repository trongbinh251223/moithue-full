import type { Context } from 'hono';
import { createBlogService } from '../../services/blog.service';
import type { AppEnv } from '../../types/app';
import { dbLog, requireAuthUser } from '../controller-context';
import { readJson, readParam, readQuery } from '../read-validated';
import type { Validated } from '../validated-types';
import type {
  blogCommentCreateSchema,
  blogCommentsQuerySchema,
  blogListQuerySchema,
  blogPostIdParamSchema,
} from '../../validation/blog.schemas';

export const blogController = {
  listPosts: async (c: Context<AppEnv>) => {
    const q = readQuery<Validated<typeof blogListQuerySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createBlogService(db, log);
    const out = await svc.listPosts(q.category, q.page, q.limit);
    return c.json(out);
  },

  getPost: async (c: Context<AppEnv>) => {
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createBlogService(db, log);
    const data = await svc.getPost(id);
    return c.json({ data });
  },

  listComments: async (c: Context<AppEnv>) => {
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const q = readQuery<Validated<typeof blogCommentsQuerySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createBlogService(db, log);
    const out = await svc.listComments(id, q.page, q.limit);
    return c.json(out);
  },

  createComment: async (c: Context<AppEnv>) => {
    const u = requireAuthUser(c);
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const body = readJson<Validated<typeof blogCommentCreateSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createBlogService(db, log);
    const data = await svc.addComment(id, u.id, body.content);
    return c.json({ data }, 201);
  },
};
