# 03 — Cấu hình Cloudflare (Wrangler)

Trong repo có **nhiều file cấu hình Wrangler**. Wrangler sẽ chọn một file theo [quy tắc ưu tiên của phiên bản bạn đang dùng](https://developers.cloudflare.com/workers/wrangler/configuration/) — thông thường bạn nên **chỉ giữ một nguồn sự thật** để tránh deploy nhầm binding.

## `wrangler.jsonc` (bản đầy đủ)

Điểm chính:

- **`name`**: `moithue-base`.
- **`main`**: `src/index.ts`.
- **`compatibility_date`**: `2026-04-15`.
- **`compatibility_flags`**: `nodejs_compat`, `global_fetch_strictly_public`.
- **`assets.directory`**: `./public` — phục vụ tĩnh (ví dụ `index.html`).
- **`observability.enabled`**: bật quan sát Workers.
- **`upload_source_maps`**: gửi source map khi deploy.
- **`d1_databases`**: hai binding:
  - `moithue_base` → database `moithue-base`.
  - `moithue_base_preview` → database `moithue-base-preview`.
  - Cả hai có `"remote": true` (thao tác D1 qua mạng Cloudflare khi dev/deploy tùy ngữ cảnh).

## `wrangler.json` (bản rút gọn)

- Tên worker trong file này là **`hono-d1-drizzle`** (khác `moithue-base` trong `jsonc`).
- **`d1_databases`** dùng một binding duy nhất:
  - **`binding`: `DB_PROD`**
  - `database_name`: `moithue_base`
  - `database_id` và `preview_database_id` trùng UUID với production / preview trong `jsonc`.

Đây là file **khớp với mã** `src/index.ts`, vì code đọc `c.env.DB_PROD`.

## File `d1.md`

Nội dung thực tế là **JSON** (snippet `d1_databases`), không phải Markdown. Có thể dùng làm ghi nhớ thủ công khi tạo DB trên dashboard; không được Wrangler tự đọc trừ khi bạn đổi tên/định dạng theo chuẩn Wrangler.

## Ràng buộc quan trọng: binding vs `Env` trong code

Trong `src/index.ts`:

```typescript
export type Env = {
  DB_PROD: D1Database;
};
```

Mọi handler gọi `drizzle(c.env.DB_PROD)`.

- Nếu bạn deploy bằng **`wrangler.jsonc`** mà **không** định nghĩa `DB_PROD`, runtime sẽ thiếu binding (lỗi khi truy cập DB).
- Script `db:seed:preview` trong `package.json` cũng dùng tên binding **`DB_PROD`** trong lệnh `wrangler d1 execute`.

**Khuyến nghị:** chọn một tên binding (`DB_PROD` hoặc `moithue_base`) và cập nhật đồng bộ:

1. `wrangler.json` hoặc `wrangler.jsonc` (file đang dùng khi chạy lệnh; ưu tiên một nguồn — CI dùng `wrangler.json`).
2. `src/index.ts` (`Env` + mọi `c.env.*`).
3. `test/env.d.ts` nếu test cần mock D1.
4. Chạy lại `npm run cf-typegen` để `worker-configuration.d.ts` phản ánh binding.

## Biến môi trường local (Drizzle Kit)

`drizzle.config.ts` đọc **`.env.local`** (không commit secret). Các biến kỳ vọng:

- `ENVIRONMENT` — `preview` hoặc `production`.
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`.
- `CLOUDFLARE_DATABASE_ID_PREVIEW` hoặc `CLOUDFLARE_DATABASE_ID_PRODUCTION` tùy `ENVIRONMENT`.

Chi tiết luồng migration/seed: [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md).
