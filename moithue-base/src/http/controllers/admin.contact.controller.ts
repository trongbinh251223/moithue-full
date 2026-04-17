import type { Context } from 'hono';
import { parsePagination, type PaginationQuery } from '../../validation/common';
import { createSiteContactService } from '../../services/site-contact.service';
import type { AppEnv } from '../../types/app';
import { dbLog, requireAuthUser } from '../controller-context';
import { readJson, readParam, readQuery } from '../read-validated';
import type { Validated } from '../validated-types';
import type { contactPagePatchSchema, contactSubmissionIdParamSchema } from '../../validation/contact.schemas';

export const adminContactController = {
  getPage: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    const data = await svc.getContactPage();
    return c.json({ data });
  },

  patchPage: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const body = readJson<Validated<typeof contactPagePatchSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    const data = await svc.patchContactPage(body);
    return c.json({ data });
  },

  listSubmissions: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const q = readQuery<PaginationQuery>(c);
    const { page, limit } = parsePagination(q);
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    return c.json(await svc.listSubmissions(page, limit));
  },

  deleteSubmission: async (c: Context<AppEnv>) => {
    requireAuthUser(c);
    const { id } = readParam<Validated<typeof contactSubmissionIdParamSchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    await svc.deleteSubmission(id);
    return c.body(null, 204);
  },
};
