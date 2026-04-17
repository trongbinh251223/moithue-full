import { z } from 'zod';
import { emailSchema, passwordSchema, uuidParam } from './common';

export const createUserBodySchema = z.object({
  email: emailSchema,
  name: z.string().min(1).max(256),
  password: passwordSchema,
  roleSlug: z.enum(['user', 'admin']).default('user'),
});

export const updateUserBodySchema = z
  .object({
    email: emailSchema.optional(),
    name: z.string().min(1).max(256).optional(),
    phone: z.union([z.string().max(32).regex(/^[0-9+\s().-]*$/), z.null()]).optional(),
    password: passwordSchema.optional(),
    roleSlug: z.enum(['user', 'admin']).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field required' });

export const patchMeBodySchema = z
  .object({
    name: z.string().min(1).max(256).optional(),
    email: emailSchema.optional(),
    phone: z.union([z.string().max(32).regex(/^[0-9+\s().-]*$/), z.null()]).optional(),
    avatar: z.preprocess(
      (v) => (v === '' ? null : v),
      z.union([z.string().url().max(2048), z.null()]).optional(),
    ),
    address: z.preprocess(
      (v) => (v === '' ? null : v),
      z.union([z.string().max(512), z.null()]).optional(),
    ),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field required' });

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: passwordSchema,
});

export const userIdParamSchema = z.object({
  id: uuidParam,
});

export const savedPropertyBodySchema = z.object({
  propertyId: uuidParam,
});

export const savedPropertyDeleteParamSchema = z.object({
  propertyId: uuidParam,
});
