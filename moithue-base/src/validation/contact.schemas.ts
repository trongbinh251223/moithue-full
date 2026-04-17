import { z } from 'zod';
import { uuidParam } from './common';

export const contactSubmissionBodySchema = z.object({
  name: z.string().min(1).max(256),
  phone: z.string().min(6).max(64),
  email: z.string().email().max(256),
  topic: z.string().min(1).max(64),
  message: z.string().min(10).max(5000),
});

export const contactPageSettingsSchema = z.object({
  officeTitle: z.string().max(256),
  officeLines: z.array(z.string().max(512)).max(20),
  hotlines: z.array(z.string().max(128)).max(20),
  emails: z.array(z.string().email().max(256)).max(20),
  hours: z.array(z.string().max(256)).max(20),
});

export const contactPagePatchSchema = contactPageSettingsSchema.partial();

export const contactSubmissionIdParamSchema = z.object({
  id: uuidParam,
});
