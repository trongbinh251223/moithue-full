# 04 — Worker API (Hono)

File: **`src/index.ts`**.

## Khởi tạo ứng dụng

- Import `Hono` từ `hono`, `drizzle` từ `drizzle-orm/d1`, schema `users`, `posts`, `comments` từ `./db/schema`, toán tử `eq` từ `drizzle-orm`.
- Generic `Hono<{ Bindings: Env }>` để `c.env` có kiểu `Env` (hiện chỉ có `DB_PROD`).
- **`.basePath('/api/v1')`**: mọi route bên dưới đều có tiền tố `/api/v1`. Ví dụ `app.get('/')` thực tế là **`GET /api/v1/`**.

## Health check

| Method | Đường dẫn đầy đủ | Phản hồi |
|--------|------------------|----------|
| GET | `/api/v1/` | Text plain: `Hello Hono!` |

## Users

| Method | Đường dẫn | Body JSON | Hành vi |
|--------|-----------|-----------|---------|
| GET | `/api/v1/users` | — | `select` toàn bộ `users`. |
| GET | `/api/v1/users/:id` | — | Một user theo `id`; **404** nếu không có. |
| POST | `/api/v1/users` | `{ email, name }` | `insert`; trả mảng từ `.returning()`. **409** nếu trùng email (bắt chuỗi `UNIQUE constraint failed`). **500** lỗi khác. |
| PUT | `/api/v1/users/:id` | `{ email, name }` | `update`; **404** nếu không hàng nào; **409** trùng email. |
| DELETE | `/api/v1/users/:id` | — | `delete`; **404** nếu không có; thành công trả JSON message. |

**Lưu ý:** `id` là UUID do DB gán default (xem schema); client không cần gửi `id` khi tạo user.

## Posts

| Method | Đường dẫn | Body / Query | Hành vi |
|--------|-----------|--------------|---------|
| GET | `/api/v1/posts` | — | Danh sách tất cả post. |
| GET | `/api/v1/posts/:id` | — | Một post; **404** nếu không có. |
| GET | `/api/v1/users/:userId/posts` | — | Post của một user (`posts.userId`). |
| POST | `/api/v1/posts` | `{ userId, title, content }` | Tạo post (không kiểm tra tồn tại `userId` ở tầng app — có thể lỗi FK từ D1). |
| PUT | `/api/v1/posts/:id` | `{ title, content }` | Cập nhật; **404** nếu không có. |
| DELETE | `/api/v1/posts/:id` | — | Xóa; **404** nếu không có. |

## Comments

| Method | Đường dẫn | Body | Hành vi |
|--------|-----------|------|---------|
| GET | `/api/v1/posts/:postId/comments` | — | Comment theo `postId`. |
| GET | `/api/v1/comments/:id` | — | Một comment; **404**. |
| POST | `/api/v1/comments` | `{ userId, postId, content }` | Tạo comment. |
| PUT | `/api/v1/comments/:id` | `{ content }` | Sửa nội dung; **404**. |
| DELETE | `/api/v1/comments/:id` | — | Xóa; **404**. |

## Pattern lặp trong code

Mỗi handler thường:

1. `const db = drizzle(c.env.DB_PROD);`
2. Đọc `c.req.param(...)` hoặc `await c.req.json()`.
3. Gọi `db.select` / `insert` / `update` / `delete` với `.all()`, `.get()`, hoặc `.returning()`.
4. Trả `c.json(...)` với mã status tùy kết quả.

**Validation:** hiện không có middleware validate body (email format, độ dài chuỗi, v.v.); chỉ dựa vào schema DB và try/catch cho user.

## Export

`export default app` — Wrangler/Hono Workers dùng default export làm fetch handler.
