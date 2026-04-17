import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({
  path: '.env.local',
});

/**
 * Mặc định: **preview** (phù hợp làm việc trên D1 preview).
 * Chỉ khi `ENVIRONMENT=production` (đúng chữ, không phân biệt hoa thường) mới dùng DB + thư mục migration production.
 */
const env: 'preview' | 'production' =
  process.env.ENVIRONMENT?.trim().toLowerCase() === 'production'
    ? 'production'
    : 'preview';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(
      `[drizzle.config] Thiếu ${name} trong .env.local (ENVIRONMENT=${env}).`,
    );
  }
  return v.trim();
}

const getDatabaseId = () => {
  if (env === 'production') {
    return requireEnv('CLOUDFLARE_DATABASE_ID_PRODUCTION');
  }
  return requireEnv('CLOUDFLARE_DATABASE_ID_PREVIEW');
};

/** Thư mục migration Drizzle Kit — luôn khớp `env` ở trên. */
const getMigrationsDir = () =>
  env === 'production'
    ? './src/db/migrations/production'
    : './src/db/migrations/preview';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: getMigrationsDir(),
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: requireEnv('CLOUDFLARE_ACCOUNT_ID'),
    databaseId: getDatabaseId(),
    token: requireEnv('CLOUDFLARE_API_TOKEN'),
  },
  verbose: true,
  strict: true,
});
