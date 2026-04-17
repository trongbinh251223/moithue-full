import type { Context } from 'hono';
import { parsePagination, type PaginationQuery } from '../../validation/common';
import { createUserService } from '../../services/user.service';
import type { AppEnv } from '../../types/app';
import { dbLog, requireAuthActor } from '../controller-context';
import { readJson, readParam, readQuery } from '../read-validated';
import type { Validated } from '../validated-types';
import type {
  changePasswordBodySchema,
  createUserBodySchema,
  patchMeBodySchema,
  savedPropertyBodySchema,
  updateUserBodySchema,
} from '../../validation/user.schemas';

export const userController = {
  list: async (c: Context<AppEnv>) => {
    const q = readQuery<PaginationQuery>(c);
    const { page, limit, offset } = parsePagination(q);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const { items, total } = await svc.list(page, limit);
    return c.json({ data: items, meta: { page, limit, total, offset } });
  },

  me: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const data = await svc.getMe(actor.id);
    return c.json({ data });
  },

  patchMe: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const body = readJson<Validated<typeof patchMeBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const data = await svc.patchMe(actor.id, body);
    return c.json({ data });
  },

  changePassword: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const body = readJson<Validated<typeof changePasswordBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const out = await svc.changePassword(actor.id, body);
    return c.json(out);
  },

  listSavedProperties: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const q = readQuery<PaginationQuery>(c);
    const { page, limit } = parsePagination(q);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const out = await svc.listSaved(actor.id, page, limit);
    return c.json(out);
  },

  addSavedProperty: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const body = readJson<Validated<typeof savedPropertyBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    await svc.addSaved(actor.id, body.propertyId);
    return c.json({ ok: true as const });
  },

  removeSavedProperty: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { propertyId } = readParam<{ propertyId: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    await svc.removeSaved(actor.id, propertyId);
    return c.body(null, 204);
  },

  clearAllSavedProperties: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const out = await svc.removeAllSaved(actor.id);
    return c.json({ data: out });
  },

  getById: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { id } = readParam<{ id: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const data = await svc.getById(id, actor);
    return c.json({ data });
  },

  create: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const body = readJson<Validated<typeof createUserBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const data = await svc.createByAdmin(body);
    return c.json({ data }, 201);
  },

  update: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { id } = readParam<{ id: string }>(c);
    const body = readJson<Validated<typeof updateUserBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    const data = await svc.update(id, actor, body);
    return c.json({ data });
  },

  delete: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { id } = readParam<{ id: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createUserService(db, log);
    await svc.delete(id, actor);
    return c.body(null, 204);
  },
};
