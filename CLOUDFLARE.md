# Triển khai GitHub + Cloudflare (Pages + Worker + D1)

Monorepo gồm API Worker [`moithue-base/`](moithue-base/) và SPA Vite [`moi-thue---real-estate-platform/`](moi-thue---real-estate-platform/).

**Luồng khuyến nghị (Cách A):** Pages chỉ build & publish SPA; Worker + D1 deploy bằng [GitHub Actions](.github/workflows/deploy-moithue-base.yml). Không bật Deploy command Wrangler trên Pages; có thể tắt **Worker Builds** (Git trên Worker) nếu không dùng để tránh lỗi build token trùng pipeline.

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

1. **Workers & Pages → Create → Pages → Connect to Git** — chọn repo.

2. **Cách A (mặc định — khuyến nghị)** — Pages chỉ đóng gói SPA; API do GitHub Actions deploy (mục §2).

   **Build configuration:**

   - **Root directory**: `moi-thue---real-estate-platform`
   - **Build command**: `npm ci && npm run build:web`
   - **Build output directory**: `dist`
   - **Deploy command**: nếu Dashboard **bắt buộc** có giá trị, dùng **chính xác** một trong hai (không deploy Worker):
     - `npm run cf:pages-static-only` — script trong [`package.json`](moi-thue---real-estate-platform/package.json) chỉ là `exit 0` (tránh `node -e "..."` bị shell Cloudflare parse sai dấu `(`).
     - `true` — lệnh shell no-op.
     - **Không** dán nguyên nội dung `node -e ...` vào ô Deploy command (dễ lỗi `Syntax error: "(" unexpected`).

   **Environment variables** (Production / Preview):

   | Biến | Mục đích |
   |------|-----------|
   | `VITE_API_BASE` | URL Worker public + `/api/v1`, vd. `https://moithue-base.<account>.workers.dev/api/v1` (lấy sau khi Actions deploy xong lần đầu). |
   | `VITE_SITE_URL` | URL Pages, vd. `https://<project>.pages.dev`. |
   | `GEMINI_API_KEY` | Chỉ nếu build cần ([`vite.config.ts`](moi-thue---real-estate-platform/vite.config.ts)). |

   **Không** thêm `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` trên Pages khi dùng Cách A (chúng chỉ dùng trong GitHub Secrets cho Worker).

3. **Cách B (tuỳ chọn)** — deploy Worker trong cùng job Pages: **Deploy command** = `npm run cf:deploy-worker` (xem [`package.json`](moi-thue---real-estate-platform/package.json)). Khi đó thêm `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` trên Pages; **nên tắt** workflow GitHub Actions để không deploy Worker hai lần. **Không** dùng `npx wrangler deploy` trực tiếp tại root app (lỗi npm `workspaces`).

SPA fallback: [`moi-thue---real-estate-platform/public/_redirects`](moi-thue---real-estate-platform/public/_redirects) (`/*` → `/index.html` 200).

Sau khi đổi URL Worker: cập nhật `VITE_API_BASE` trên Pages và **Redeploy** (biến `VITE_*` embed lúc build).

### Deploy Pages từ máy local (Direct Upload — Wrangler)

Không cần push Git: build SPA rồi đẩy thư mục `dist` lên Cloudflare Pages bằng [Wrangler](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

1. Trên Dashboard: tạo project **Pages** (Workers & Pages → Create → Pages) với **tên trùng** trường `name` trong [`moi-thue---real-estate-platform/wrangler.toml`](moi-thue---real-estate-platform/wrangler.toml) (mặc định `moithue-spa` — đổi một trong hai cho khớp).
2. **Đăng nhập Wrangler** (một lần trên máy): `cd moi-thue---real-estate-platform && npx wrangler login`  
   Hoặc dùng token: `export CLOUDFLARE_API_TOKEN=...` và `export CLOUDFLARE_ACCOUNT_ID=...` (quyền **Account → Cloudflare Pages → Edit**).
3. **Biến build production** (`VITE_*` được nhúng lúc build): tạo file `.env.production` trong app Vite (không commit) hoặc export trước khi chạy, ví dụ:
   ```bash
   cd moi-thue---real-estate-platform
   export VITE_API_BASE="https://<worker>.workers.dev/api/v1"
   export VITE_SITE_URL="https://<project>.pages.dev"
   npm run cf:pages:deploy
   ```
   Script [`cf:pages:deploy`](moi-thue---real-estate-platform/package.json): `npm run build:web && wrangler pages deploy dist` (đọc `wrangler.toml`).
4. **Preview branch** (tuỳ chọn): `npx wrangler pages deploy dist --branch=preview`.

**Node:** Wrangler 4 yêu cầu **Node ≥ 20.3** (xem cảnh báo khi `npm install` nếu máy dùng Node 18).

## 4. Kiểm tra (E2E thủ công)

1. Mở URL Pages → Đăng ký / đăng nhập / tìm kiếm.
2. DevTools → Network: request API trỏ đúng `VITE_API_BASE`.
3. Nếu lỗi CORS: kiểm tra `ALLOW_ORIGIN` Worker khớp **chính xác** origin Pages (gồm `https://`, không slash cuối trừ khi app yêu cầu).
4. Worker: **Logs → Real-time** trên Dashboard khi debug.

## 5. Tuỳ chọn

- **Custom domain**: gắn cho Pages; Worker có thể dùng subdomain `api.` + route.
- **Preview PR**: bật trên Pages; đặt `VITE_API_BASE` preview trỏ Worker preview nếu có pipeline riêng.

NestJS trong `moi-thue---real-estate-platform/server/` không nằm trong flow Cloudflare mặc định; production SPA gọi trực tiếp Worker qua `VITE_API_BASE`.

## 6. Sự cố: `error occurred while updating repository submodules` (Pages / clone)

Xảy ra khi Git lưu thư mục dạng **submodule** (mode `160000`, gitlink) nhưng **không có** `.gitmodules`, hoặc trong thư mục con vẫn còn `.git` riêng (repo lồng repo). Cloudflare chạy `submodule update` và thất bại.

**Cách xử lý (một repo monorepo thật sự):**

1. Xóa `.git` bên trong `moi-thue---real-estate-platform/` và `moithue-base/` (nếu có).
2. Ở repo gốc: `git rm --cached moi-thue---real-estate-platform moithue-base` rồi `git add moi-thue---real-estate-platform/ moithue-base/` để index là file thường (blob), không còn gitlink.
3. Commit và push lại — build Pages sẽ clone bình thường.

## 7. Sự cố: *The build token selected for this build has been deleted or rolled* (Worker Builds)

Thông báo này đến từ **Cloudflare Worker Builds** (Workers → project `moithue-base` → tích hợp Git để Cloudflare tự clone repo và build/deploy). Cloudflare dùng một **Git build token** (thường là GitHub App / PAT) để đọc repo; token đó đã **bị xóa, hết hạn hoặc bị rotate** nên build không chạy được.

**Cách xử lý (trên Cloudflare Dashboard):**

1. Vào **Workers & Pages** → chọn Worker **`moithue-base`** (hoặc đúng tên project Worker Builds của bạn).
2. Mở **Settings** (hoặc **Builds** / **Git repository** — tùy giao diện hiện tại).
3. Phần liên kết **GitHub / Git**:
   - **Disconnect** repository (nếu có), rồi **Connect repository** lại và cấp quyền mới cho Cloudflare; **hoặc**
   - Dùng mục **Update credentials** / **Reconnect** / **Regenerate token** nếu Dashboard hiển thị.
4. Lưu → **Retry deployment** / push commit mới để chạy build lại.

**Không liên quan** tới `CLOUDFLARE_API_TOKEN` trong GitHub Actions hay biến môi trường Pages — đó là token API Cloudflare khác. Build token chỉ dùng cho luồng **Worker Builds nối Git**.

**Nếu bạn không cần Worker Builds** (đã deploy bằng [GitHub Actions](.github/workflows/deploy-moithue-base.yml) hoặc `npm run cf:deploy-worker` trên Pages): có thể **gỡ liên kết Git** khỏi Worker Builds để tránh build tự động trùng và lỗi token; chỉ giữ một pipeline deploy.
