# Hướng dẫn sử dụng moithue-base (API Workers)

Tài liệu tổng hợp: **chuẩn bị môi trường**, **cấu hình**, **chạy dev/deploy**, **database**, **auth & API**, **kiểm thử**, **xử lý sự cố**.

---

## 1. Yêu cầu hệ thống

| Thành phần | Ghi chú |
|------------|---------|
| **Node.js** | **≥ 20.10** (khuyến nghị 22 LTS). Vitest 4 + Wrangler 4 + `undici` 7 không chạy ổn trên Node 18. |
| **npm** | Đi kèm Node. |
| **Tài khoản Cloudflare** | Cho `wrangler login`, D1 từ xa, deploy. |

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

---

## 2. Cài đặt & script npm

```bash
cd moithue-base
npm install
```

| Script | Mô tả |
|--------|--------|
| `npm run dev` / `start` | `wrangler dev` — Worker + D1 **local** (miniflare), trừ khi bạn thêm `--remote`. |
| `npm run deploy` | Deploy lên Cloudflare. |
| `npm test` | Vitest + `@cloudflare/vitest-pool-workers` (cần Node ≥ 20). |
| `npm run check` | `tsc --noEmit` + `generate:seed` (kiểm tra type + sinh lại `seed.sql`). |
| `npm run cf-typegen` | Sinh/cập nhật `worker-configuration.d.ts`. |
| `npm run db:generate` | Drizzle Kit: sinh migration từ `src/db/schema.ts` (`.env.local`; mặc định **preview**, chỉ production khi `ENVIRONMENT=production`). |
| `npm run db:migrate` | Drizzle Kit: apply migration qua D1 HTTP. |
| `npm run db:studio` | Drizzle Studio trên **D1 remote** (preview/prod theo `.env.local`). |
| `npm run db:studio:local` | Drizzle Studio trên **file SQLite D1 local** (`.wrangler/state/...`; cần `better-sqlite3`). |
| `npm run db:studio:local:rebuild` | Biên dịch lại `better-sqlite3` cho **đúng phiên bản Node** hiện tại (khi đổi Node mà Studio báo `NODE_MODULE_VERSION`). |
| `npm run generate:seed` | Sinh `src/db/migrations/seed.sql` (PBKDF2; cần Web Crypto — Node có `globalThis.crypto`). |
| `npm run db:seed:local` | Chạy `seed.sql` lên **D1 local** (`wrangler dev` đọc DB này). |
| `npm run db:seed:preview` | Chạy `seed.sql` lên **D1 preview remote** (`--remote --preview`) — **không** phải DB local của dev. |
| `npm run db:seed:remote` | Chạy `seed.sql` lên **D1 production remote** (`--remote`) — **xóa** dữ liệu demo cũ rồi nạp lại; chỉ khi bạn chấp nhận ghi đè. |

---

## 3. Cấu hình Wrangler & biến môi trường

### 3.1 File cấu hình

- **`wrangler.jsonc`**: cấu hình đầy đủ (assets `public/`, observability, D1, `vars`). Vitest mặc định đọc file này (`vitest.config.mts`).
- **`wrangler.json`**: bản rút gọn dùng cho `wrangler deploy` / CI (D1 + `vars` không chứa bí mật).

Binding D1 dùng trong code: **`DB_PROD`** (`src/types/app.ts`).

### 3.2 D1 & migration

Trong `wrangler.json` / `wrangler.jsonc`:

- `d1_databases[].binding` = `DB_PROD`
- `migrations_dir` = `./src/db/migrations/production` — Wrangler/Miniflare có thể áp migration khi dev (tùy phiên bản và định dạng file SQL).

Migration Drizzle thường có dòng `--> statement-breakpoint`. **Wrangler D1 migrations** đôi khi yêu cầu file SQL “chuẩn Wrangler”; nếu `wrangler d1 migrations apply` báo lỗi, xem [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) và có thể tách câu lệnh thủ công.

### 3.3 JWT & bí mật

- **Local**: đặt `JWT_SECRET` trong **`.dev.vars`** (sao chép từ `.dev.vars.example`), không commit.
- **Production**: `wrangler secret put JWT_SECRET` hoặc Dashboard → Worker → Secrets.
- Biến không bí mật (`JWT_ISSUER`, `ACCESS_TOKEN_TTL_SEC`, `REFRESH_TOKEN_DAYS`): trong `wrangler.json` hoặc Dashboard **Vars**.

### 3.4 CORS

- Nếu set `ALLOW_ORIGIN` (một origin cố định), CORS chỉ cho origin đó.
- Không set → cho phép `*` (không gửi cookie cross-site).

### 3.5 D1 từ xa khi dev

Trước đây `wrangler.jsonc` có `"remote": true` trên D1 khiến Vitest cần `wrangler login`. Hiện đã **bỏ `remote: true`** để test local không cần đăng nhập.

Khi bạn **muốn** trỏ D1 production/preview từ máy:

```bash
npx wrangler dev --remote
```

(hoặc thêm lại `"remote": true` trong binding D1 — cân nhắc CI và Vitest.)

---

## 4. Drizzle Kit (`.env.local`)

Sao chép [`.env.local.example`](../.env.local.example) → `.env.local` và điền giá trị.

`drizzle.config.ts` đọc `.env.local`:

- `ENVIRONMENT`: chỉ đặt **`production`** (đúng chữ, không phân biệt hoa thường) khi cần **D1 production**; **bỏ hoặc giá trị khác** → Drizzle dùng **preview** (`CLOUDFLARE_DATABASE_ID_PREVIEW` + thư mục `migrations/preview`).
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_DATABASE_ID_PREVIEW` **hoặc** (khi production) `CLOUDFLARE_DATABASE_ID_PRODUCTION`

### 4.1 Drizzle Studio — **remote preview** vs **remote production**

| Mục tiêu | Lệnh | Điều kiện `.env.local` |
|---------|------|-------------------------|
| Xem / migrate **preview** (D1 trên Cloudflare, branch preview Worker) | `npm run db:studio` | **Không** đặt `ENVIRONMENT=production`. Có `CLOUDFLARE_DATABASE_ID_PREVIEW` = UUID preview (trùng `preview_database_id` trong `wrangler.json`). |
| Xem / migrate **production** | `npm run db:studio` | **`ENVIRONMENT=production`** + `CLOUDFLARE_DATABASE_ID_PRODUCTION` = UUID **production** (trùng `database_id` trong `wrangler.json`, **không** nhầm với preview). |
| Chỉ SQLite **local** (`wrangler dev`) | `npm run db:studio:local` | **Không** kết nối remote — nếu bạn đang chạy lệnh này thì sẽ **không bao giờ** thấy DB prod. |

**Lỗi thường gặp khi “không xem được DB prod”:**

1. Đang dùng `db:studio:local` thay vì `db:studio`.
2. Thiếu `ENVIRONMENT=production` nên Drizzle vẫn trỏ **preview**.
3. `CLOUDFLARE_DATABASE_ID_PRODUCTION` sai UUID hoặc trùng với preview.
4. `CLOUDFLARE_API_TOKEN` hết hạn / thiếu quyền đọc D1.

Chi tiết thư mục migration preview/production: xem [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md). **Local vs remote, seed/migrate tách bạch:** [08-d1-local-remote-migration-va-seed.md](./08-d1-local-remote-migration-va-seed.md).

---

## 5. Luồng khởi tạo database (tóm tắt)

1. Tạo / liên kết database D1 trên Cloudflare, cập nhật `database_id` trong Wrangler.
2. Apply migration (Wrangler hoặc Drizzle Kit — chọn **một** luồng bạn tin dùng).
3. (Tuỳ chọn) `npm run generate:seed` rồi chạy `seed.sql` lên **đúng** môi trường: dev cục bộ → `npm run db:seed:local`; preview → `npm run db:seed:preview`; **production** → `npm run db:seed:remote` (xem doc 08 và [09-d1-production-parity.md](./09-d1-production-parity.md)).

**Tài khoản demo** sau khi seed đã chạy thành công trên **đúng** DB mà Worker đang dùng (local / preview / prod):

- `alice.admin@example.com` / **`Admin1234`** (admin)
- `bob.user@example.com` / **`User1234`** (user)

Nếu đăng nhập báo lỗi: kiểm tra SPA gọi đúng `VITE_API_BASE` (Worker prod), Worker prod có **`JWT_SECRET`** (Dashboard Secret), **`ALLOW_ORIGIN`** trùng origin SPA, và bảng `users` trên **cùng** D1 đó đã có 2 user seed (chưa seed → không đăng nhập được).

---

## 6. Kiến trúc HTTP (tóm tắt)

Thứ tự xử lý gần đúng:

1. `requestId` → `cors` → **security headers** → **logger** → **D1 (drizzle)** → **optional JWT**  
2. Route + **`zValidator` (Zod)**  
3. **Controller** → **Service** → **Repository**  
4. Lỗi: `AppError` / lỗi không bắt → **`onError`** JSON + `requestId`

RBAC:

- `requireAuthMiddleware` — bắt buộc Bearer JWT access token.
- `requireRoles('admin')` — chỉ role slug `admin`.

---

## 7. API REST (`/api/v1`)

Base URL ví dụ dev: `http://127.0.0.1:8787/api/v1` (cổng xem log Wrangler).

### 7.1 Công khai (không cần JWT)

| Phương thức | Đường dẫn | Mô tả |
|-------------|-----------|--------|
| GET | `/api/v1` | Metadata service. |
| GET | `/api/v1/health` | Health + `requestId`. |
| POST | `/api/v1/auth/register` | Body: `{ "email", "password", "name" }`. Password: ≥8 ký tự, có chữ **và** số. |
| POST | `/api/v1/auth/login` | Body: `{ "email", "password" }`. |
| POST | `/api/v1/auth/refresh` | Body: `{ "refreshToken" }`. |
| POST | `/api/v1/auth/logout` | Body: `{ "refreshToken" }` (thu hồi session). |

**Đăng nhập thành công** trả: `accessToken`, `refreshToken`, `tokenType`, `expiresIn`, `user` (không có password hash).

Header API có JWT:

```http
Authorization: Bearer <accessToken>
```

### 7.2 User (cần JWT)

| Phương thức | Đường dẫn | Quyền | Ghi chú |
|-------------|-----------|--------|---------|
| GET | `/api/v1/users/me` | Đã đăng nhập | Profile người gọi. |
| GET | `/api/v1/users` | **admin** | Query: `page`, `limit` (mặc định 1 / 20). |
| POST | `/api/v1/users` | **admin** | Tạo user: `email`, `name`, `password`, `roleSlug?` (`user` \| `admin`). |
| GET | `/api/v1/users/:id` | admin **hoặc** chính mình | |
| PATCH | `/api/v1/users/:id` | admin **hoặc** chính mình | Chỉ admin được đổi `roleSlug`. |
| DELETE | `/api/v1/users/:id` | **admin** | Không cho xóa chính mình qua endpoint này. |

### 7.3 Lỗi & log

JSON lỗi dạng:

```json
{
  "error": { "code": "NOT_FOUND", "message": "...", "details": null },
  "requestId": "..."
}
```

Log dạng JSON một dòng trên `stdout` (level, `requestId`, `msg`, …).

---

## 8. Kiểm thử (`npm test`)

### 8.1 Điều kiện

- **Node ≥ 20** (đã thử thành công với **Node 22**).
- Chạy trong thư mục project; Vitest đọc `wrangler.jsonc` (pool Workers).

### 8.2 Phạm vi test hiện tại

Các test **smoke** không cần D1 đã có đầy đủ bảng sau migration:

- `GET /api/v1/health`
- `GET /api/v1` (metadata)
- `POST /auth/register` với body sai → **400** (Zod)

**Auth/register/login đầy đờ** trên DB đã migrate **nên kiểm thử thủ công** bằng `wrangler dev` + `curl`/Thunder Client sau khi bạn đã `migrations apply` + (tuỳ chọn) seed. Lý do: pool Vitest dùng miniflare; file migration Drizzle có thể không được áp giống môi trường dev/deploy thật — tránh test flake / false negative.

### 8.3 Lệnh bổ trợ

```bash
npm run check   # TypeScript + sinh seed.sql
```

---

## 9. Xử lý sự cố thường gặp

| Hiện tượng | Hướng xử lý |
|------------|-------------|
| `npm test` lỗi `styleText` / `rolldown` | Nâng Node lên **20+**. |
| Vitest: phải đăng nhập Wrangler / remote proxy | Tránh `remote: true` trên D1 khi chạy test; hoặc `wrangler login`. |
| `Failed query` / không có bảng | Apply migration lên D1 đúng môi trường; kiểm tra `migrations_dir`. |
| JWT invalid | Kiểm tra `JWT_SECRET` thống nhất giữa dev/prod; thời gian hết hạn access token. |
| **Đăng nhập / đăng ký trả 500** | Thường do **thiếu `JWT_SECRET`** trên Worker prod (sau khi bỏ khỏi `wrangler.json` vars) → cấu hình Secret. Hoặc DB: thiếu bảng `roles` / migration chưa apply → response JSON có `hint` (schema). Hoặc `Default role missing` → chưa có dòng `user` trong `roles` (chạy migration + seed). Xem response trong DevTools → Network. |
| CORS chặn browser | Set `ALLOW_ORIGIN` đúng origin frontend hoặc dùng proxy dev. |

---

## 10. Tài liệu chi tiết mã nguồn (cũ)

Các file phân tách chủ đề trong `docs/` (một số mô tả có thể đã cũ so với kiến trúc controller/service/repository mới):

- [README.md](./README.md) — mục lục tài liệu cũ.

Khi mâu thuẫn giữa tài liệu cũ và file này, **ưu tiên `HUONG-DAN-SU-DUNG.md` và mã trong `src/`**.

---

## 11. Liên kết ngoài

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1](https://developers.cloudflare.com/d1/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vitest pool Workers](https://developers.cloudflare.com/workers/testing/vitest-integration/)
