import { createMiddleware } from 'hono/factory';
import { Errors } from '../../lib/errors';
import type { AppEnv } from '../../types/app';

/** Must run after `requireAuthMiddleware`. */
export function requireRoles(...allowedSlugs: string[]) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get('authUser');
    if (!user) throw Errors.unauthorized();
    if (!allowedSlugs.includes(user.roleSlug)) {
      c.get('log').warn('rbac.denied', {
        userId: user.id,
        role: user.roleSlug,
        allowed: allowedSlugs,
      });
      throw Errors.forbidden('Insufficient role');
    }
    await next();
  });
}
