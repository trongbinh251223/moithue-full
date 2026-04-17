# Triển khai GitHub + Cloudflare (Pages + Worker + D1)

Monorepo gồm API Worker [`moithue-base/`](moithue-base/) và SPA Vite [`moi-thue---real-estate-platform/`](moi-thue---real-estate-platform/).

## 1. GitHub

1. Tạo repository mới (rỗng, không README nếu bạn sẽ push sẵn có).
2. Tại thư mục gốc `moithue-full`:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. Secret **không** được commit: dùng [`.gitignore`](.gitignore) gốc; JWT chỉ qua `.dev.vars` (dev) hoặc `wrangler secret` (prod). Sao chép [`moithue-base/.dev.vars.example`](moithue-base/.dev.vars.example) → `moithue-base/.dev.vars` khi dev local.

## 2. Cloudflare — Worker `moithue-base`

### Secrets & biến (Dashboard → Workers → moithue-base → Settings)

- **Secret** (bắt buộc): `JWT_SECRET` — từ thư mục `moithue-base`: `npx wrangler secret put JWT_SECRET` (hoặc Dashboard → Secrets).
- **Vars** (khuyến nghị production):
  - `ALLOW_ORIGIN` = origin chính xác của SPA, ví dụ `https://<project>.pages.dev` (CORS).
  - `PASSWORD_RESET_APP_URL` = URL SPA (bỏ nếu production chỉ gửi email reset).

Giá trị `JWT_ISSUER`, `ACCESS_TOKEN_TTL_SEC`, `REFRESH_TOKEN_DAYS` có thể đặt trong Dashboard hoặc giữ mặc định từ [`moithue-base/wrangler.json`](moithue-base/wrangler.json).

### D1 production

1. Trong Dashboard, tạo / chọn D1 có tên khớp `database_name` trong `wrangler.json` (`moithue_base`), cập nhật `database_id` trong [`moithue-base/wrangler.json`](moithue-base/wrangler.json) cho đúng **account của bạn** nếu khác.
2. Áp migration lên remote (một lần sau khi tạo DB, hoặc mỗi khi có migration mới):

   ```bash
   cd moithue-base
   npm run db:migrations:apply:remote
   ```

   Wrangler chỉ là dependency local của project: nếu gõ `wrangler` mà báo `command not found`, hãy **luôn** chạy trong `moithue-base` như trên, hoặc tương đương `npx wrangler d1 migrations apply DB_PROD --remote` (sau `npm ci`).

### Deploy tự động (GitHub Actions)

Workflow: [`.github/workflows/deploy-moithue-base.yml`](.github/workflows/deploy-moithue-base.yml).

Trên GitHub: **Settings → Secrets and variables → Actions**, thêm:

| Secret | Mô tả |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | API Token với quyền **Edit Cloudflare Workers** và **D1** (để `migrations apply` + `deploy`). |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID (Overview Dashboard). |

Mỗi push lên `main` có thay đổi trong `moithue-base/` sẽ: `npm ci` → `tsc` → `npx wrangler d1 migrations apply DB_PROD --remote` → `npx wrangler deploy` (CI đã cấu hình sẵn).

## 3. Cloudflare Pages (SPA)

1. **Workers & Pages → Create → Pages → Connect to Git** — chọn repo vừa tạo.
2. Cấu hình build:
   - **Root directory**: `moi-thue---real-estate-platform`
   - **Build command**: `npm ci && npm run build:web`
   - **Build output directory**: `dist`
3. **Environment variables** (Production / Preview):
   - `VITE_API_BASE` = `https://<worker-subdomain>.workers.dev/api/v1` (sau khi Worker deploy xong), hoặc custom domain API.
   - `VITE_SITE_URL` = URL Pages (vd. `https://<pages>.pages.dev`).
   - `GEMINI_API_KEY` nếu build cần (theo [`vite.config.ts`](moi-thue---real-estate-platform/vite.config.ts)).

SPA fallback: file [`moi-thue---real-estate-platform/public/_redirects`](moi-thue---real-estate-platform/public/_redirects) (`/*` → `/index.html` 200) để React Router hoạt động trên Pages.

Sau khi đổi URL Worker: cập nhật lại `VITE_API_BASE` trên Pages và **Redeploy** (biến `VITE_*` được embed lúc build).

## 4. Kiểm tra (E2E thủ công)

1. Mở URL Pages → Đăng ký / đăng nhập / tìm kiếm.
2. DevTools → Network: request API trỏ đúng `VITE_API_BASE`.
3. Nếu lỗi CORS: kiểm tra `ALLOW_ORIGIN` Worker khớp **chính xác** origin Pages (gồm `https://`, không slash cuối trừ khi app yêu cầu).
4. Worker: **Logs → Real-time** trên Dashboard khi debug.

## 5. Tuỳ chọn

- **Custom domain**: gắn cho Pages; Worker có thể dùng subdomain `api.` + route.
- **Preview PR**: bật trên Pages; đặt `VITE_API_BASE` preview trỏ Worker preview nếu có pipeline riêng.

NestJS trong `moi-thue---real-estate-platform/server/` không nằm trong flow Cloudflare mặc định; production SPA gọi trực tiếp Worker qua `VITE_API_BASE`.
