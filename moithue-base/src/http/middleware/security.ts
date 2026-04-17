import { createMiddleware } from 'hono/factory';
import { cors } from 'hono/cors';
import type { AppEnv } from '../../types/app';

/** API-oriented security headers + optional CORS. */
export const securityHeadersMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  c.header(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  );
  await next();
});

/** CORS: set `ALLOW_ORIGIN` binding (plain var) to a single origin, or omit for `*`. */
export const corsMiddleware = cors({
  origin: (origin, c) => {
    const allowed = c.env.ALLOW_ORIGIN;
    if (allowed) return allowed === origin ? origin : null;
    return '*';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposeHeaders: ['X-Request-Id'],
  maxAge: 86400,
  credentials: false,
});
