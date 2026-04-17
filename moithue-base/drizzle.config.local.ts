import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

config({ path: '.env.local' });

/**
 * Drizzle Studio trỏ vào **file SQLite D1 local** (Wrangler), không dùng D1 HTTP remote.
 *
 * - Mặc định: tự tìm `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite`
 *   (bỏ qua `metadata.sqlite`). Nếu có nhiều file, chọn file sửa gần đây nhất.
 * - Hoặc đặt `D1_LOCAL_SQLITE` trong `.env.local` = đường dẫn tuyệt đối hoặc tương đối từ root project.
 */
function resolveLocalD1DatabaseFile(): string {
  const explicit = process.env.D1_LOCAL_SQLITE?.trim();
  if (explicit) {
    const abs = explicit.startsWith('/') ? explicit : join(process.cwd(), explicit);
    if (!existsSync(abs)) {
      throw new Error(`[drizzle.config.local] Không thấy file D1_LOCAL_SQLITE: ${abs}`);
    }
    return abs;
  }

  const base = join(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  if (!existsSync(base)) {
    throw new Error(
      '[drizzle.config.local] Chưa có thư mục D1 local. Hãy chạy `npm run dev` hoặc `npm run db:local:apply-all` (có `wrangler d1 … --local`) ít nhất một lần, rồi chạy lại `npm run db:studio:local`.',
    );
  }

  const names = readdirSync(base).filter((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
  if (names.length === 0) {
    throw new Error(
      `[drizzle.config.local] Trong ${base} không có file *.sqlite dữ liệu (chỉ thấy metadata?). Chạy migration/seed local trước.`,
    );
  }

  const scored = names.map((name) => {
    const p = join(base, name);
    try {
      return { p, m: statSync(p).mtimeMs };
    } catch {
      return { p, m: 0 };
    }
  });
  scored.sort((a, b) => b.m - a.m);
  return scored[0]!.p;
}

const dbFile = resolveLocalD1DatabaseFile();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations/production',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbFile,
  },
  verbose: true,
  strict: true,
});
