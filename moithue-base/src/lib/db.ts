import { drizzle } from 'drizzle-orm/d1';
import type { Context } from 'hono';
import { schema } from '../db/schema';
import type { AppEnv, Db } from '../types/app';

export function createDb(d1: D1Database): Db {
  return drizzle(d1, { schema });
}

export function getDb(c: Context<AppEnv>): Db {
  return c.get('db');
}
