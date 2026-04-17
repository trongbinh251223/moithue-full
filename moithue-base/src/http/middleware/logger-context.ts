import { createMiddleware } from 'hono/factory';
import { createLogger } from '../../lib/logger';
import type { AppEnv } from '../../types/app';

export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.set('log', createLogger(c.get('requestId')));
  const log = c.get('log');
  const start = Date.now();
  log.info('request.start', {
    method: c.req.method,
    path: c.req.path,
  });
  await next();
  log.info('request.end', {
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    ms: Date.now() - start,
  });
});
