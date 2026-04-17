# 08 — D1: local vs remote, migration, seed (luồng tách bạch)

Tài liệu này trả lời ba câu hỏi:

1. **Cái gì là “local”**, **cái gì là “remote”**, và chúng **không tự đồng bộ** với nhau.
2. **Migration** trong repo này đi theo **đường nào** (Wrangler vs Drizzle Kit).
3. **Seed**: file nào được **sinh ra** trên đĩa, lệnh nào **đẩy SQL** vào **DB nào**.

---

## 1. Bốn “đích” khác nhau (đừng gộp một chỗ)

| # | Tên gọi | Ai dùng | Dữ liệu nằm ở đâu |
|---|---------|---------|-------------------|
| A | **D1 local** (dev) | `npm run dev` (`wrangler dev`) | Máy bạn, thường dưới `.wrangler/state/` (SQLite do Wrangler quản) |
| B | **D1 preview (remote)** | Worker **preview** trên Cloudflare, hoặc `wrangler d1 execute … --remote --preview` | Cloudflare, `preview_database_id` trong `wrangler.jsonc` |
| C | **D1 production (remote)** | Worker **production** đã deploy, hoặc lệnh D1 remote **không** `--preview` | Cloudflare, `database_id` trong `wrangler.jsonc` |
| D | **D1 qua Drizzle Kit HTTP** | `npm run db:generate` / `npm run db:migrate` (đọc `drizzle.config.ts` + `.env.local`) | Đúng **một** DB mà bạn chỉ bằng `CLOUDFLARE_DATABASE_ID_PREVIEW` hoặc `…_PRODUCTION` — **không** phải D1 local của wrangler dev |

**Điểm mấu chốt:** Bạn có thể seed **preview remote** thành công, nhưng `wrangler dev` vẫn đọc **local (A)** → login 500 nếu (A) chưa có đủ bảng/cột.

### Drizzle Studio xem bảng trên **D1 local (A)**

- `npm run db:studio` → vẫn là **D (remote)** qua `drizzle.config.ts` (`d1-http`).
- `npm run db:studio:local` → mở **file SQLite** dưới `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/` (cấu hình `drizzle.config.local.ts`; Drizzle Kit dùng **`better-sqlite3`** — addon native, **phải khớp phiên bản Node**).

**Lỗi `NODE_MODULE_VERSION` / `ERR_DLOPEN_FAILED`:** bạn đã đổi Node (ví dụ 18 ↔ 22) sau khi `npm install`. Trong `moithue-base` chạy: `npm run db:studio:local:rebuild` (hoặc `npm rebuild better-sqlite3`).

Trước đó cần đã tạo DB local (ví dụ `npm run db:local:apply-all` hoặc chạy `wrangler dev` ít nhất một lần). Nếu Wrangler tạo nhiều file `.sqlite`, script chọn file dữ liệu mới sửa nhất; hoặc bạn đặt trong `.env.local`:

`D1_LOCAL_SQLITE=.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<tên-file>.sqlite`

---

## 2. Cấu hình Wrangler (`wrangler.jsonc`) — mỗi field tạo ra ý nghĩa gì

Trong mảng `d1_databases` (rút gọn ý nghĩa):

| Field | Được dùng để | Ghi chú |
|-------|----------------|---------|
| `binding`: `DB_PROD` | Tên biến trong Worker: `env.DB_PROD` | Code và CLI **phải** cùng tên binding này khi `d1 execute`. |
| `database_name` | Tên hiển thị trên dashboard | Không quyết định file SQLite local. |
| `database_id` | UUID DB **production** trên Cloudflare | Remote production. |
| `preview_database_id` | UUID DB **preview** trên Cloudflare | Remote preview (cặp với `--remote --preview`). |
| `migrations_dir` | Thư mục chứa file `.sql` cho lệnh **`wrangler d1 migrations apply`** | Hiện repo trỏ `./src/db/migrations/preview`. **Lưu ý:** thư mục đó chủ yếu có `meta/` (Drizzle Kit); file SQL “Wrangler migration” có thể thiếu — khi đó `migrations apply` không thay cho việc tự `d1 execute --file` các file trong `production/` nếu team chọn luồng đó. |

**Không có gì trong file JSON tự “copy” production → local.** Mỗi lệnh CLI (có/không `--local`, có/không `--remote --preview`) quyết định **một** đích.

---

## 3. Hai công cụ migration (tách bạch)

### 3.1. Wrangler — `wrangler d1 …`

- **`wrangler d1 execute DB_PROD --local --file=…`**: chạy file SQL vào **D1 local (A)**.
- **`wrangler d1 execute DB_PROD --remote --preview --file=…`**: chạy file SQL vào **D1 preview remote (B)**.
- **`wrangler d1 execute DB_PROD --remote --file=…`** (không `--preview`): vào **production remote (C)** — **cực kỳ cẩn thận**.
- **`wrangler d1 migrations apply DB_PROD --local`**: áp các file `.sql` trong `migrations_dir` lên **local**, có bảng meta (thường `d1_migrations`) để không chạy lại file cũ.

**Sau mỗi lệnh execute thành công:** schema và/hoặc dữ liệu **trong đúng DB đích** thay đổi (bảng mới, cột mới, dòng insert…). **Không** sinh thêm file TypeScript; có thể có log Wrangler.

### 3.2. Drizzle Kit — `drizzle.config.ts` + `.env.local`

- **`npm run db:generate`**: đọc `src/db/schema.ts`, so với snapshot trong `src/db/migrations/<preview|production>/meta/`, **sinh file SQL mới** + cập nhật `meta/` (journal, snapshot) **trên đĩa repo**.
- **`npm run db:migrate`**: Drizzle Kit dùng **`driver: 'd1-http'`** — nói chuyện với **một** DB Cloudflare qua API (D ở bảng trên), **không** phải SQLite local của `wrangler dev`.

Biến quyết định:

- `ENVIRONMENT` ≠ `production` (mặc định) → thư mục output: `migrations/preview`, `databaseId` = `CLOUDFLARE_DATABASE_ID_PREVIEW`.
- `ENVIRONMENT=production` → `migrations/production`, `CLOUDFLARE_DATABASE_ID_PRODUCTION`.

**Tóm lại:** `db:migrate` = “áp migration lên **một** DB remote qua HTTP theo `.env.local`”. Nó **không** thay cho `db:seed:local` và **không** sửa D1 local của `wrangler dev`, trừ khi bạn cố tình dùng công cụ khác trỏ vào local (repo này không cấu hình Drizzle Kit trỏ local file).

---

## 4. Seed — từng bước “cái gì được sinh ra”

### Bước 4.1 — `npm run generate:seed` (`src/db/seed-generator.ts`)

| Đầu vào | Đầu ra (đĩa) | Đầu ra (DB) |
|---------|----------------|-------------|
| `schema.ts` (để build câu lệnh), mật khẩu cố định trong script (`Admin1234`, `User1234`), `new Date().toISOString()` | File **`src/db/migrations/seed.sql`** được **ghi đè** | **Không** — script chỉ chạy trên Node, không kết nối D1 |

Nội dung `seed.sql` kiểu:

- `DELETE` các bảng (thứ tự an toàn FK).
- `INSERT` roles (nếu có trong file), users, posts, comments với UUID cố định và **hash mật khẩu** tương ứng lúc generate.

**Mỗi lần chạy `generate:seed`:** timestamp trong file seed đổi theo thời điểm chạy (đã ghi trong [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md)).

### Bước 4.2 — Đẩy `seed.sql` vào DB

| Lệnh (trong `package.json`) | DB đích | Kết quả |
|----------------------------|---------|---------|
| `npm run db:seed:local` | **Local (A)** | Dữ liệu trong `seed.sql` được thực thi trên SQLite local — `wrangler dev` đọc đúng chỗ này. |
| `npm run db:seed:preview` | **Preview remote (B)** | Cùng file SQL nhưng chạy trên Cloudflare preview. |

**Không** có lệnh “seed production” trong script mặc định — cố ý để tránh nhầm.

---

## 5. Checklist thực tế (tách bạch dev vs preview remote)

### 5.1. Chỉ làm việc với **`wrangler dev`** (login local, test API local)

1. Đảm bảo schema local khớp code (bảng `users` có `password_hash`, `role_id`, `updated_at`, có `roles`, …). Trong repo có sẵn:
   - `npm run db:local:apply-0000`
   - `npm run db:local:apply-0001`  
   (chỉ chạy khi DB local còn trống hoặc chưa có các bảng đó; lỗi “already exists” → không chạy lại 0000.)
2. `npm run generate:seed` → cập nhật `seed.sql`.
3. `npm run db:seed:local` → nạp dữ liệu vào **local**.
4. `npm run dev` → gọi API (vd. `POST /api/v1/auth/login`).

### 5.2. Chỉ làm việc với **D1 preview trên Cloudflare**

1. Schema preview đã đúng (migration/repair tùy team — có script `db:preview:*` trong `package.json`).
2. `npm run generate:seed` (nếu cần file mới).
3. `npm run db:seed:preview`.

### 5.3. Production

- Chỉ migrate/seed khi có quy trình release rõ (thường migration qua CI/CD, seed production **hiếm** và phải có phê duyệt).
- Không mô tả một lệnh “một phát” ở đây để tránh vô tình chạy nhầm.

---

## 6. Bảng tổng hợp lệnh npm liên quan (nhớ đích DB)

| Script | Tác động lên đĩa | Tác động lên DB |
|--------|------------------|-----------------|
| `npm run db:generate` | Sinh/sửa file SQL + `meta/` trong `migrations/preview` hoặc `production` | **Không** (chỉ generate) |
| `npm run db:migrate` | Có thể cập nhật meta tùy phiên bản Drizzle | **Có** — DB remote theo `.env.local` (D) |
| `npm run generate:seed` | Ghi `src/db/migrations/seed.sql` | **Không** |
| `npm run db:seed:local` | Không | **Local (A)** |
| `npm run db:seed:preview` | Không | **Preview remote (B)** |
| `npm run db:local:apply-0000` / `…0001` | Không | **Local (A)** |
| `npm run db:local:align-auth` (+ add-*) | Không | **Local (A)** |
| `npm run db:preview:align-auth` (+ add-*) | Không | **Preview remote (B)** |

---

## 7. Một câu hỏi thường gặp

**“Tôi đã seed preview rồi mà dev vẫn lỗi?”**  
Vì seed preview chỉ sửa **(B)**. Dev dùng **(A)**. Cần thêm `db:seed:local` (và schema local đầy đủ) như mục 5.1.

**“`db:migrate` có làm local dev giống cloud không?”**  
`db:migrate` trong cấu hình hiện tại nhắm **D1 qua HTTP (D)**, không phải file SQLite của `wrangler dev` **(A)**. Muốn local giống cloud: áp **cùng một chuỗi file SQL** lên local bằng `wrangler d1 execute … --local`, hoặc dùng `migrations apply --local` nếu thư mục `migrations_dir` có đủ file `.sql` Wrangler.

---

## 8. Đọc thêm (trong repo)

- [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md) — chi tiết `drizzle.config`, `seed-generator`, `seed.sql`.
- [CHIEN-LUOC-MIGRATION.md](./CHIEN-LUOC-MIGRATION.md) — migration tăng dần, journal, quy ước tách file.
- [03-cau-hinh-cloudflare-wrangler.md](./03-cau-hinh-cloudflare-wrangler.md) — binding, biến môi trường Wrangler.
