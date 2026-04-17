import { z } from 'zod';
import { emailSchema, passwordSchema } from './common';

export const registerBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(256),
});

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(256),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(10),
});

export const forgotPasswordBodySchema = z.object({
  email: emailSchema,
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(16).max(512),
  password: passwordSchema,
});
