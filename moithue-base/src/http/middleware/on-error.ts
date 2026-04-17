import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppError } from '../../lib/errors';
import type { AppEnv } from '../../types/app';

/** Chuỗi lỗi gốc (D1/SQLite thường nằm trong `cause`). */
function fullErrorText(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const parts: string[] = [err.message];
  let c: unknown = err.cause;
  let depth = 0;
  while (c instanceof Error && depth < 8) {
    parts.push(c.message);
    c = c.cause;
    depth += 1;
  }
  return parts.join(' | ');
}

function schemaMismatchHint(full: string): string | undefined {
  if (/no such column|no such table|SQLITE_ERROR|Failed query/i.test(full)) {
    return 'D1 local chưa khớp schema. Trong moithue-base: npm run db:local:reset (xóa DB local + apply 0000–0004 + seed). Nếu DB đã đúng bản chỉ thiếu bước: npm run db:local:apply-all; cần Node 20+ cho wrangler.';
  }
  return undefined;
}

function safeErrorsMode(safeErrors: string | undefined): boolean {
  const v = safeErrors?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

export const onErrorHandler: ErrorHandler<AppEnv> = (err, c) => {
  const log = c.get('log');
  const requestId = c.get('requestId');

  if (err instanceof AppError) {
    log.warn('app.error', {
      code: err.code,
      status: err.status,
      message: err.message,
    });
    return c.json(
      { error: err.toJSON(), requestId },
      err.status as ContentfulStatusCode,
    );
  }

  const full = fullErrorText(err);
  const hint = schemaMismatchHint(full);
  const topMsg = err instanceof Error ? err.message : String(err);
  const safe = safeErrorsMode(c.env.SAFE_ERRORS);

  log.error('unhandled.error', {
    message: topMsg,
    detail: full !== topMsg ? full : undefined,
    stack: err instanceof Error ? err.stack : undefined,
  });

  const publicMessage = safe
    ? 'Internal server error'
    : topMsg || 'Internal server error';
  const publicDetail =
    !safe && full !== topMsg && full.length > 0 ? full.slice(0, 2000) : undefined;

  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: publicMessage,
        ...(hint ? { hint } : {}),
        ...(publicDetail ? { detail: publicDetail } : {}),
      },
      requestId,
    },
    500,
  );
};
