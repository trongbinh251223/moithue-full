import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { Logger } from '../lib/logger';
import type { schema } from '../db/schema';

export type Db = DrizzleD1Database<typeof schema>;

export type AuthUser = {
  id: string;
  email: string;
  roleSlug: string;
};

export type AppVariables = {
  requestId: string;
  log: Logger;
  db: Db;
  authUser?: AuthUser;
};

export type Env = {
  DB_PROD: D1Database;
  /** HS256 secret; use `wrangler secret put JWT_SECRET` in production. */
  JWT_SECRET: string;
  JWT_ISSUER?: string;
  ACCESS_TOKEN_TTL_SEC?: string;
  REFRESH_TOKEN_DAYS?: string;
  /** If set, CORS allows only this origin (exact match). Otherwise `*`. */
  ALLOW_ORIGIN?: string;
  /**
   * If `1` / `true` / `yes`, unhandled 500 responses omit `Error.message` / `detail`
   * (only generic text + optional schema `hint`).
   */
  SAFE_ERRORS?: string;
  /**
   * Optional SPA origin (no trailing slash), e.g. http://localhost:3000.
   * When set, `POST /auth/forgot-password` includes `resetUrl` in the JSON response
   * so you can test reset without email. Omit in production and send the link by email instead.
   */
  PASSWORD_RESET_APP_URL?: string;
};

export type AppEnv = { Bindings: Env; Variables: AppVariables };
