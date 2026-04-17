import type { Context } from 'hono';
import { getDb } from '../lib/db';
import { Errors } from '../lib/errors';
import type { AppEnv, AuthUser } from '../types/app';

export function dbLog(c: Context<AppEnv>) {
  return { db: getDb(c), log: c.get('log') };
}

export function authServiceDeps(c: Context<AppEnv>) {
  return { db: getDb(c), env: c.env, log: c.get('log') };
}

export function requireAuthUser(c: Context<AppEnv>): AuthUser {
  const u = c.get('authUser');
  if (!u) throw Errors.unauthorized();
  return u;
}

/** Compact actor passed into services that enforce row-level auth. */
export function requireAuthActor(c: Context<AppEnv>) {
  const u = requireAuthUser(c);
  return { id: u.id, roleSlug: u.roleSlug };
}

export function optionalAuthUser(c: Context<AppEnv>): AuthUser | undefined {
  return c.get('authUser');
}
