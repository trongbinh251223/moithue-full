# 06 — Migration, seed và Drizzle Kit

## `drizzle.config.ts`

- Gọi `dotenv` với path **`.env.local`**.
- Đọc **`process.env.ENVIRONMENT`**: chỉ khi giá trị (trim, không phân biệt hoa thường) đúng **`production`** thì dùng DB + thư mục migration **production**; **mọi trường hợp khác (kể cả thiếu biến)** → mặc định **`preview`**.
- **`getDatabaseId()`**: `preview` → `CLOUDFLARE_DATABASE_ID_PREVIEW`; `production` → `CLOUDFLARE_DATABASE_ID_PRODUCTION` (thiếu biến tương ứng → throw rõ tên biến).
- **`getMigrationsDir()`**: khớp với `env` — `preview` → `./src/db/migrations/preview`, `production` → `./src/db/migrations/production`.
- **`defineConfig`**: `schema: ./src/db/schema.ts`, `dialect: 'sqlite'`, **`driver: 'd1-http'`** — Drizzle Kit nói chuyện với D1 qua HTTP API bằng `accountId`, `databaseId`, `token`.
- `verbose: true`, `strict: true`.

**Quy trình thường gặp:**

1. Sửa `src/db/schema.ts`.
2. Trong `.env.local`: luôn cần `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_DATABASE_ID_PREVIEW`. Chỉ khi làm việc production thì thêm `ENVIRONMENT=production` và `CLOUDFLARE_DATABASE_ID_PRODUCTION`.
3. Chạy `npm run db:generate` để tạo file SQL mới trong đúng thư mục `preview` hoặc `production`.
4. Chạy `npm run db:migrate` khi muốn áp dụng lên DB tương ứng.

## Thư mục `meta/` và `_journal.json`

Trong mỗi `migrations/preview` và `migrations/production` có **`meta/_journal.json`**: danh sách migration theo thứ tự (tag tên file), và các **`*_snapshot.json`**: snapshot schema cho Drizzle Kit — **không sửa tay** trừ khi bạn biết rõ hậu quả.

## `src/db/migrations/seed.sql`

File SQL thuần:

- `DELETE` theo thứ tự: `comments` → `posts` → `users` (tránh vi phạm FK khi xóa).
- `INSERT` users, posts, comments với **UUID cố định** khớp với script generator.

Dùng để reset / nạp dữ liệu demo trên một DB đã có bảng đúng schema.

## `src/db/seed-generator.ts`

Script chạy trên **Node** (`tsx`), không chạy trong Worker.

**Luồng:**

1. `drizzle({} as any)` — client “giả” chỉ để gọi `.toSQL()` (không kết nối D1 thật).
2. Định nghĩa `sampleUsers`, `samplePosts`, `sampleComments` với UUID cố định (`aliceId`, `bobId`, `postIds`, …).
3. Với mỗi bảng `comments`, `posts`, `users`: `db.delete(table).toSQL()` → đưa câu `DELETE` vào mảng.
4. `processInsert`: `db.insert(...).values(...).toSQL()` rồi **`replaceParams`**: thay `?` trong SQL bằng giá trị đã escape dấu nháy cho chuỗi.
5. Nối các câu lệnh bằng `;\n`, ghi **`src/db/migrations/seed.sql`**.

**Lưu ý:** `createdAt` dùng `new Date().toISOString()` tại thời điểm chạy script — mỗi lần `npm run generate:seed` sẽ đổi timestamp trong file seed.

## Script `db:seed:preview` và `db:seed:local`

Trong `package.json`:

```json
"db:seed:preview": "wrangler d1 execute DB_PROD --remote --preview --file=./src/db/migrations/seed.sql",
"db:seed:local": "wrangler d1 execute DB_PROD --local --file=./src/db/migrations/seed.sql"
```

- **`db:seed:preview`**: binding **`DB_PROD`**, `--remote --preview` → **D1 preview trên Cloudflare** (`preview_database_id` trong Wrangler). **`wrangler dev` không đọc DB này.**
- **`db:seed:local`**: `--local` → **D1 local** mà `wrangler dev` dùng (SQLite trên máy).

Luôn kiểm tra lại tên binding và `database_id` / `preview_database_id` trước khi chạy trên môi trường thật.

**Luồng tách bạch local vs remote (bảng đích, Drizzle Kit vs Wrangler):** xem [08-d1-local-remote-migration-va-seed.md](./08-d1-local-remote-migration-va-seed.md).
