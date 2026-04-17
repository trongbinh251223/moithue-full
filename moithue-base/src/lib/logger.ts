import type { AppVariables } from '../types/app';
import type { Context } from 'hono';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type Logger = {
  debug: (msg: string, extra?: Record<string, unknown>) => void;
  info: (msg: string, extra?: Record<string, unknown>) => void;
  warn: (msg: string, extra?: Record<string, unknown>) => void;
  error: (msg: string, extra?: Record<string, unknown>) => void;
};

function line(
  level: LogLevel,
  requestId: string,
  msg: string,
  extra?: Record<string, unknown>,
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    requestId,
    msg,
    ...extra,
  };
  const s = JSON.stringify(payload);
  switch (level) {
    case 'error':
      console.error(s);
      break;
    case 'warn':
      console.warn(s);
      break;
    default:
      console.log(s);
  }
}

export function createLogger(requestId: string): Logger {
  return {
    debug: (msg, extra) => line('debug', requestId, msg, extra),
    info: (msg, extra) => line('info', requestId, msg, extra),
    warn: (msg, extra) => line('warn', requestId, msg, extra),
    error: (msg, extra) => line('error', requestId, msg, extra),
  };
}

export function getLog(c: Context<{ Variables: AppVariables }>): Logger {
  return c.get('log');
}
