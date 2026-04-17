# Tài liệu mã nguồn moithue-base

Bộ hướng dẫn này mô tả **cấu trúc**, **luồng xử lý** và **từng phần quan trọng** của dự án Cloudflare Workers (Hono + D1 + Drizzle ORM).

## Hướng dẫn sử dụng tổng hợp (ưu tiên đọc)

→ **[HUONG-DAN-SU-DUNG.md](./HUONG-DAN-SU-DUNG.md)** — cài đặt, cấu hình Wrangler/JWT, API, migration/seed, kiểm thử, xử lý sự cố.

→ **[08-d1-local-remote-migration-va-seed.md](./08-d1-local-remote-migration-va-seed.md)** — nếu bạn nhầm **D1 local** (`wrangler dev`) với **D1 preview remote** hoặc Drizzle Kit `db:migrate`: đọc file này trước.

→ **[CHIEN-LUOC-MIGRATION.md](./CHIEN-LUOC-MIGRATION.md)** — migration tăng dần (không chạy lại từ đầu), tách file theo bảng/thay đổi giống tinh thần Laravel, giới hạn thư mục Wrangler.

## Mục lục (phân tích theo chủ đề)

| File | Nội dung |
|------|----------|
| [01-tong-quan-du-an.md](./01-tong-quan-du-an.md) | Mục tiêu dự án, stack kỹ thuật, luồng request tổng thể |
| [02-cau-truc-thu-muc-va-phu-thuoc.md](./02-cau-truc-thu-muc-va-phu-thuoc.md) | Cây thư mục, `package.json`, script npm |
| [03-cau-hinh-cloudflare-wrangler.md](./03-cau-hinh-cloudflare-wrangler.md) | Wrangler (`json` / `jsonc` / `toml`), binding D1, biến môi trường |
| [04-worker-api-hono.md](./04-worker-api-hono.md) | `src/index.ts`: REST API, mã HTTP, xử lý lỗi |
| [05-co-so-du-lieu-drizzle-d1.md](./05-co-so-du-lieu-drizzle-d1.md) | `schema.ts`: bảng, khóa, quan hệ, UUID |
| [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md) | Thư mục migration preview/production, `seed-generator`, `drizzle.config` |
| [07-tai-nguyen-tinh-va-kiem-thu.md](./07-tai-nguyen-tinh-va-kiem-thu.md) | `public/`, `worker-configuration.d.ts`, thư mục `test/` |
| [08-d1-local-remote-migration-va-seed.md](./08-d1-local-remote-migration-va-seed.md) | D1 **local vs remote**, Drizzle Kit vs Wrangler, seed sinh file vs áp vào DB |

## Đọc nhanh

- **Entry Worker**: `src/index.ts` (export default Hono app).
- **Schema DB**: `src/db/schema.ts`.
- **Cấu hình Wrangler chính (đầy đủ)**: `wrangler.jsonc` (assets, observability, hai DB D1).
- **Cấu hình Drizzle Kit**: `drizzle.config.ts` (đọc `.env.local`, `ENVIRONMENT` = `preview` | `production`).

Nếu bạn chỉnh sửa binding D1, hãy đồng bộ tên binding giữa Wrangler và `Env` trong `src/index.ts` (xem chi tiết trong [03-cau-hinh-cloudflare-wrangler.md](./03-cau-hinh-cloudflare-wrangler.md)).
