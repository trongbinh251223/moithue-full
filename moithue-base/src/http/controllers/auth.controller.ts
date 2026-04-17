import type { Context } from 'hono';
import { createAuthService } from '../../services/auth.service';
import type { AppEnv } from '../../types/app';
import { authServiceDeps } from '../controller-context';
import { readJson } from '../read-validated';
import type { Validated } from '../validated-types';
import type {
  forgotPasswordBodySchema,
  loginBodySchema,
  logoutBodySchema,
  refreshBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
} from '../../validation/auth.schemas';

export const authController = {
  register: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof registerBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.register(body);
    return c.json(out, 201);
  },

  login: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof loginBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.login(body);
    return c.json(out);
  },

  refresh: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof refreshBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.refresh(body.refreshToken);
    return c.json(out);
  },

  logout: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof logoutBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.logout(body.refreshToken);
    return c.json(out);
  },

  forgotPassword: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof forgotPasswordBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.forgotPassword(body);
    return c.json(out);
  },

  resetPassword: async (c: Context<AppEnv>) => {
    const body = readJson<Validated<typeof resetPasswordBodySchema>>(c);
    const { db, env, log } = authServiceDeps(c);
    const svc = createAuthService(db, env, log);
    const out = await svc.resetPassword(body);
    return c.json(out);
  },
};
