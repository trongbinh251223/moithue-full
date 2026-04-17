import type { Context } from 'hono';

/** Lấy body JSON đã qua `zValidator('json', …)` (tránh generic `Context` mất kiểu `valid`). */
export function readJson<T>(c: Context): T {
  return (c.req as { valid: (k: 'json') => T }).valid('json');
}

export function readParam<T>(c: Context): T {
  return (c.req as { valid: (k: 'param') => T }).valid('param');
}

export function readQuery<T>(c: Context): T {
  return (c.req as { valid: (k: 'query') => T }).valid('query');
}
