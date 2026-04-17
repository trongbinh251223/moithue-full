# 07 — Tài nguyên tĩnh và kiểm thử

## `public/index.html`

Trang HTML đơn giản:

- Tiêu đề và đoạn mô tả nói rõ file được phục vụ từ `public/` theo `wrangler.jsonc`.
- Script gọi **`fetch('/message')`** để đặt nội dung heading.
- Nút gọi **`fetch('/random')`** để hiển thị UUID.

**Không khớp với Worker hiện tại:** `src/index.ts` chỉ đăng ký route dưới **`/api/v1`** và không có handler `/message` hay `/random`. Kết quả: trang tĩnh có thể nhận **404** hoặc phản hồi không mong đợi tùy cách Workers + assets routing kết hợp.

**Hướng xử lý khi phát triển tiếp:**

- Hoặc thêm route Hono cho `/message` và `/random` (ngoài `basePath` hoặc dùng app gốc không `basePath` cho các route này).
- Hoặc sửa `index.html` để gọi API thật, ví dụ `GET /api/v1/`.

## `worker-configuration.d.ts`

- Được tạo / cập nhật bởi **`wrangler types`** (ghi chú đầu file).
- Khai báo `Cloudflare.Env` và `interface Env extends Cloudflare.Env`.
- Phần đầu file hiện có `interface Env` **rỗng** trong namespace `Cloudflare` — nghĩa là sau `cf-typegen` bạn có thể cần merge binding D1 vào đây, hoặc dùng `src/index.ts` `export type Env` làm nguồn kiểu ứng dụng.

Khi binding trong Wrangler khớp và chạy lại `npm run cf-typegen`, phần `Env` generated thường chứa các field như `DB_PROD: D1Database`.

## Thư mục `test/`

### `test/env.d.ts`

```typescript
declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
```

Module `cloudflare:test` mong `Env` — cần đồng bộ với kiểu Worker thật (bao gồm `DB_PROD` nếu test chạm DB).

### `test/index.spec.ts`

- Import `worker` từ `../src` (default export Hono).
- Dùng `cloudflare:test`: `env`, `createExecutionContext`, `waitOnExecutionContext`, `SELF`.
- Test mô tả "Hello World user worker" với URL **`http://example.com/message`** và **`/random`**, kỳ vọng snapshot `"Hello, World!"` và regex UUID.

**Mâu thuẫn với `src/index.ts` hiện tại:** Worker không còn route `/message` / `/random`; default export là Hono với `basePath('/api/v1')`. Test có khả năng **fail** hoặc cần cập nhật để gọi `http://example.com/api/v1/` và assert `Hello Hono!`, đồng thời mock `env.DB_PROD` nếu test CRUD.

### `test/tsconfig.json`

`types`: `@cloudflare/vitest-pool-workers` — tách khỏi `tsconfig.json` gốc (`exclude: ["test"]`).

## Gợi ý làm sạch kỹ thuật nợ

1. Thống nhất **một** file Wrangler chính và binding D1.
2. Cập nhật **`public/index.html`** và **`test/index.spec.ts`** theo API `/api/v1`.
3. Chạy **`npm run cf-typegen`** sau khi sửa binding, rồi chỉnh `Env` nếu cần.
