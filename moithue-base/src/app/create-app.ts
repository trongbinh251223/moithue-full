import { Hono } from 'hono';
import { onErrorHandler } from '../http/middleware/on-error';
import type { AppEnv } from '../types/app';
import { createV1Router } from '../routes/v1.routes';

export function createApp() {
  const app = new Hono<AppEnv>();
  app.onError(onErrorHandler);
  app.route('/api/v1', createV1Router());
  return app;
}
