import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '../../lib/jwt';
import { Errors } from '../../lib/errors';
import type { AppEnv } from '../../types/app';

/** Optional: if Bearer present and valid, sets `authUser`. */
export const optionalAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  const m = header?.match(/^Bearer\s+(.+)$/i);
  if (!m?.[1]) {
    await next();
    return;
  }
  try {
    const payload = await verifyAccessToken(c.env, m[1]);
    c.set('authUser', {
      id: payload.sub,
      email: payload.email,
      roleSlug: payload.role,
    });
  } catch {
    // invalid token: treat as anonymous unless route requires auth
  }
  await next();
});

/** Requires valid Bearer access JWT. */
export const requireAuthMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  const m = header?.match(/^Bearer\s+(.+)$/i);
  if (!m?.[1]) throw Errors.unauthorized('Missing or invalid Authorization header');
  try {
    const payload = await verifyAccessToken(c.env, m[1]);
    c.set('authUser', {
      id: payload.sub,
      email: payload.email,
      roleSlug: payload.role,
    });
  } catch (e) {
    c.get('log').warn('auth.invalid_token', { err: String(e) });
    throw Errors.unauthorized('Invalid or expired access token');
  }
  await next();
});
