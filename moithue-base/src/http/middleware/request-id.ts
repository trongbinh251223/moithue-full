import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../../types/app';

export const requestIdMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = c.req.header('X-Request-Id') ?? crypto.randomUUID();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);
  await next();
});
