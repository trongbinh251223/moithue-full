# 05 — Cơ sở dữ liệu (Drizzle + D1)

File định nghĩa bảng: **`src/db/schema.ts`**.

## SQLite / D1

D1 tương thích SQLite. Drizzle dùng module **`drizzle-orm/sqlite-core`** (`sqliteTable`, `text`).

## UUID mặc định

Biến `generateUUID` là biểu thức SQL raw (`sql` template) tạo chuỗi UUID v4 kiểu text bằng `randomblob`, `hex`, `substr` — chạy **trên SQLite** khi insert không có `id`.

Cùng một biểu thức xuất hiện trong file migration SQL sinh bởi Drizzle Kit (cột `DEFAULT (...)`).

## Bảng `users`

| Cột | Kiểu Drizzle | Ràng buộc |
|-----|----------------|------------|
| `id` | `text('id').primaryKey().default(generateUUID)` | PK, UUID tự sinh. |
| `email` | `text('email', { length: 256 }).notNull().unique()` | Bắt buộc, duy nhất. |
| `name` | `text('name', { length: 256 }).notNull()` | Bắt buộc. |
| `created_at` | `text('created_at').default(sql\`CURRENT_TIMESTAMP\`).notNull()` | ISO/text timestamp. |

Export: `export const users = sqliteTable('users', { ... })`.

## Bảng `posts`

| Cột | Ý nghĩa |
|-----|---------|
| `id` | PK, UUID default. |
| `user_id` | FK → `users.id`, `notNull()`. |
| `title` | `text`, max 256. |
| `content` | `text`, không giới hạn độ dài trong schema. |
| `created_at` | Giống users. |

Quan hệ: **nhiều post → một user** (phía ORM dùng `.references(() => users.id)`).

## Bảng `comments`

| Cột | Ý nghĩa |
|-----|---------|
| `id` | PK, UUID default. |
| `user_id` | Người viết comment → `users.id`. |
| `post_id` | Post được comment → `posts.id`. |
| `content` | Nội dung. |
| `created_at` | Timestamp tạo. |

Quan hệ: comment thuộc một **post** và một **user**.

## Foreign keys trên D1

Trong file migration SQL, FK được tạo với `ON UPDATE no action ON DELETE no action` (mặc định Drizzle). Ứng dụng không triển khai cascade xóa (xóa user có thể bị chặn nếu còn post/comment — tùy SQLite/D1 và dữ liệu).

## Lịch sử schema (preview migrations)

Thư mục **`src/db/migrations/preview/`** phản ánh tiến hóa schema:

1. **`0000_romantic_malice.sql`**: bản đầu dùng **`integer` AUTOINCREMENT** cho `id` cả ba bảng.
2. **`0001_polite_romulus.sql`**: migrate sang **`text` PK** với default UUID expression; dùng bảng tạm `__new_*`, copy dữ liệu, drop, rename (pattern SQLite khi đổi kiểu cột phức tạp).

Production có migration **`0000_thankful_freak.sql`** tạo thẳng schema UUID (không qua bước integer), phù hợp khi DB production được tạo mới theo schema hiện tại.

Chi tiết chạy migration và seed: [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md).
