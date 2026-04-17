import type { Context } from 'hono';
import { parsePagination, type PaginationQuery } from '../../validation/common';
import { createAdminBlogService } from '../../services/admin-blog.service';
import type { AppEnv } from '../../types/app';
import { dbLog, requireAuthUser } from '../controller-context';
import { readJson, readParam, readQuery } from '../read-validated';
import type { Validated } from '../validated-types';
import type {
  adminBlogPostCreateSchema,
  adminBlogPostUpdateSchema,
  blogPostIdParamSchema,
} from '../../validation/blog.schemas';

export const adminBlogController = {
  getOne: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createAdminBlogService(db, log);
    const data = await svc.getOne(id);
    return c.json({ data });
  },

  list: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const q = readQuery<PaginationQuery>(c);
    const { page, limit } = parsePagination(q);
    const { db, log } = dbLog(c);
    const svc = createAdminBlogService(db, log);
    return c.json(await svc.list(page, limit));
  },

  create: async (c: Context<AppEnv>) => {
    const u = requireAuthUser(c);
    const body = readJson<Validated<typeof adminBlogPostCreateSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createAdminBlogService(db, log);
    const row = await svc.create(u.id, body);
    return c.json({ data: row }, 201);
  },

  update: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const body = readJson<Validated<typeof adminBlogPostUpdateSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createAdminBlogService(db, log);
    const row = await svc.update(id, body);
    return c.json({ data: row });
  },

  remove: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const { id } = readParam<Validated<typeof blogPostIdParamSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createAdminBlogService(db, log);
    await svc.remove(id);
    return c.body(null, 204);
  },
};
