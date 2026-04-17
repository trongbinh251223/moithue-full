# 02 — Cấu trúc thư mục và phụ thuộc

## Cây thư mục (mã nguồn chính)

Bỏ qua `node_modules/`, cấu trúc ý nghĩa của dự án:

```
moithue-base/
├── docs/                          # Tài liệu hướng dẫn (thư mục này)
├── public/
│   └── index.html                 # Trang tĩnh mẫu
├── src/
│   ├── index.ts                   # Worker entry: Hono app + export default
│   └── db/
│       ├── schema.ts              # Định nghĩa bảng Drizzle (SQLite/D1)
│       ├── seed-generator.ts      # Script sinh file SQL seed
│       └── migrations/
│           ├── seed.sql           # Dữ liệu mẫu (sinh bởi seed-generator)
│           ├── preview/           # Migration cho môi trường preview (Drizzle Kit)
│           │   ├── *.sql
│           │   └── meta/
│           └── production/        # Migration cho production
│               ├── *.sql
│               └── meta/
├── test/
│   ├── index.spec.ts              # Vitest
│   ├── env.d.ts                   # Mở rộng Env cho cloudflare:test
│   └── tsconfig.json
├── drizzle.config.ts              # Cấu hình drizzle-kit (D1 HTTP)
├── package.json
├── package-lock.json
├── tsconfig.json
├── worker-configuration.d.ts      # Types Worker (thường do `wrangler types`)
├── wrangler.json                  # Cấu hình Wrangler (binding DB_PROD)
├── wrangler.jsonc                 # Cấu hình Wrangler đầy đủ hơn (assets, 2 D1)
└── d1.md                          # Nội dung JSON mẫu binding D1 (không phải Markdown)
```

## `package.json` — dependencies

**Runtime (`dependencies`):**

- `hono` — web framework.
- `drizzle-orm` — ORM, module `drizzle-orm/d1` cho D1.
- `dotenv` — chủ yếu dùng trong `drizzle.config.ts` khi chạy CLI trên máy local (đọc `.env.local`).

**Dev (`devDependencies`):**

- `wrangler` — CLI Cloudflare.
- `typescript`, `@types/node`.
- `drizzle-kit` — migration / studio.
- `tsx` — chạy TypeScript cho `generate:seed`.
- `vitest`, `@cloudflare/vitest-pool-workers` — test.

## Scripts npm

| Script | Ý nghĩa |
|--------|---------|
| `npm run dev` / `start` | `wrangler dev` — chạy Worker local (kết nối remote D1 nếu cấu hình `remote: true`). |
| `npm run deploy` | `wrangler deploy`. |
| `npm run cf-typegen` | `wrangler types` — cập nhật `worker-configuration.d.ts`. |
| `npm run db:generate` | `drizzle-kit generate` — tạo file SQL migration từ `schema.ts`. |
| `npm run db:migrate` | `drizzle-kit migrate` — áp migration lên DB (theo credentials trong config). |
| `npm run db:studio` | `drizzle-kit studio` — UI xem/sửa dữ liệu. |
| `npm run generate:seed` | `tsx src/db/seed-generator.ts` — ghi `src/db/migrations/seed.sql`. |
| `npm run db:seed:preview` | `wrangler d1 execute ...` — chạy `seed.sql` lên DB preview (xem ghi chú binding trong tài liệu Wrangler). |
| `npm test` | `vitest`. |

## TypeScript

- `tsconfig.json`: `include` là `worker-configuration.d.ts` và `src/**/*.ts`; **`exclude`: `test`** — test dùng `test/tsconfig.json` riêng.
- `jsx: react-jsx` được bật dù Worker chính không dùng React trong `src/`; có thể phục vụ tooling hoặc mở rộng sau.
