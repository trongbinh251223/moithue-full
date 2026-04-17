import { createMiddleware } from 'hono/factory';
import { createDb } from '../../lib/db';
import type { AppEnv } from '../../types/app';

export const dbContextMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('db', createDb(c.env.DB_PROD));
  await next();
});
