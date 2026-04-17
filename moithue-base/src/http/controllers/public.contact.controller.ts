import type { Context } from 'hono';
import { createSiteContactService } from '../../services/site-contact.service';
import type { AppEnv } from '../../types/app';
import { dbLog } from '../controller-context';
import { readJson } from '../read-validated';
import type { Validated } from '../validated-types';
import type { contactSubmissionBodySchema } from '../../validation/contact.schemas';

export const publicContactController = {
  getPage: async (c: Context<AppEnv>) => {
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    const data = await svc.getContactPage();
    return c.json({ data });
  },

  submit: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof contactSubmissionBodySchema>>(c);
    const { db, log } = dbLog(c);
    const svc = createSiteContactService(db, log);
    const data = await svc.submit(body);
    return c.json({ data }, 201);
  },
};
