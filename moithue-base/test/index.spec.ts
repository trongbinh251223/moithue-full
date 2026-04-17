import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

/**
 * Vitest + @cloudflare/vitest-pool-workers chạy Worker trong miniflare.
 * Schema D1 đầy đủ (roles, sessions, cột user mở rộng) cần migration đã apply;
 * file SQL do Drizzle sinh có `--> statement-breakpoint` — khi chạy test pool,
 * bạn có thể cần cấu hình migration tương thích Wrangler hoặc seed DB local.
 * Các test dưới đây không phụ thuộc bảng đã migrate.
 */
describe('moithue-base API (smoke)', () => {
  it('GET /api/v1/health returns ok', async () => {
    const request = new Request('http://example.com/api/v1/health');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { ok: boolean; requestId: string };
    expect(body.ok).toBe(true);
    expect(body.requestId).toBeDefined();
  });

  it('GET /api/v1/health (integration)', async () => {
    const response = await SELF.fetch('http://example.com/api/v1/health');
    expect(response.status).toBe(200);
  });

  it('GET /api/v1 returns service metadata', async () => {
    const response = await SELF.fetch('http://example.com/api/v1');
    expect(response.status).toBe(200);
    const body = (await response.json()) as { service: string; version: number };
    expect(body.service).toBe('moithue-base-api');
    expect(body.version).toBe(1);
  });

  it('POST /auth/register rejects invalid body (validation)', async () => {
    const response = await SELF.fetch('http://example.com/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad', password: 'short', name: '' }),
    });
    expect(response.status).toBe(400);
  });

  it('POST /auth/forgot-password rejects invalid body (validation)', async () => {
    const response = await SELF.fetch('http://example.com/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    expect(response.status).toBe(400);
  });
});
