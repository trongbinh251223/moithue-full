import type { Context } from 'hono';
import { createPropertyService } from '../../services/property.service';
import type { AppEnv } from '../../types/app';
import {
  dbLog,
  optionalAuthUser,
  requireAuthActor,
  requireAuthUser,
} from '../controller-context';
import { readJson, readParam, readQuery } from '../read-validated';
import type { Validated } from '../validated-types';
import type {
  propertyCreateBodySchema,
  propertyListQuerySchema,
  propertyMineQuerySchema,
  propertyUpdateBodySchema,
} from '../../validation/property.schemas';

export const propertyController = {
  search: async (c: Context<AppEnv>) => {
    const q = readQuery<Validated<typeof propertyListQuerySchema>>(c);
    const filters = {
      q: q.q,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      project: q.project,
      bedrooms: q.bedrooms,
      minBedrooms: q.minBedrooms,
      bathrooms: q.bathrooms,
      minBathrooms: q.minBathrooms,
      minArea: q.minArea,
      maxArea: q.maxArea,
      propertyType: q.propertyType,
    };
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const viewerId = optionalAuthUser(c)?.id;
    const out = await svc.searchPublic(filters, q.sort, q.page, q.limit, viewerId);
    return c.json(out);
  },

  mine: async (c: Context<AppEnv>) => {
    const u = requireAuthUser(c);
    const q = readQuery<Validated<typeof propertyMineQuerySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const out = await svc.listMine(u.id, q.status, q.page, q.limit);
    return c.json(out);
  },

  create: async (c: Context<AppEnv>) => {
    const u = requireAuthUser(c);
    const body = readJson<Validated<typeof propertyCreateBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const data = await svc.create(u.id, body, { initialStatus: 'active' });
    return c.json({ data }, 201);
  },

  getById: async (c: Context<AppEnv>) => {
    const { id } = readParam<{ id: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const data = await svc.getById(id, optionalAuthUser(c));
    return c.json({ data });
  },

  similar: async (c: Context<AppEnv>) => {
    const { id } = readParam<{ id: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const out = await svc.similar(id);
    return c.json(out);
  },

  update: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { id } = readParam<{ id: string }>(c);
    const body = readJson<Validated<typeof propertyUpdateBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    const data = await svc.update(id, actor, body);
    return c.json({ data });
  },

  remove: async (c: Context<AppEnv>) => {
    const actor = requireAuthActor(c);
    const { id } = readParam<{ id: string }>(c);
    const { db, log } = dbLog(c);
    const svc = createPropertyService(db, log);
    await svc.delete(id, actor);
    return c.body(null, 204);
  },
};
