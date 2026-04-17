# Chiến lược migration (D1 + Drizzle Kit) — giống tinh thần Laravel

## Có phải “tạo lại DB từ đầu” mỗi lần thêm bảng không?

**Không.** Luồng chuẩn là **tăng dần (incremental)** giống Laravel:

1. **Cloudflare D1** (khi dùng `wrangler d1 migrations apply`): ghi nhận migration nào **đã chạy** trong bảng meta (mặc định thường là `d1_migrations`). Các file cũ **không chạy lại**; chỉ các file **chưa có trong lịch sử apply** mới được thực thi theo **thứ tự tên file** (thường là `0000_…`, `0001_…`, …).

2. **Drizzle Kit** (`npm run db:generate`): so sánh `src/db/schema.ts` với **snapshot** trong `migrations/<env>/meta/` rồi sinh **một file SQL mới** chứa **phần chênh lệch** so với lần generate trước. Nó **không** xóa và viết lại toàn bộ lịch sử migration cũ.

Kết luận: bảng đã tạo từ migration cũ **vẫn nằm trong DB**; migration mới chỉ thêm/đổi phần bạn vừa khai báo trong schema (hoặc SQL bạn tự thêm nếu làm tay).

---

## Vì sao đôi khi thấy “một file migration rất lớn”?

Drizzle gom **mọi thay đổi chưa snapshot** vào **một** file cho lần `generate` đó. Nếu bạn:

- sửa **nhiều bảng** cùng lúc trong `schema.ts`, rồi
- chỉ chạy **`db:generate` một lần**,

thì một file `0003_….sql` có thể chứa nhiều `CREATE TABLE` / `ALTER` — **đúng về mặt kỹ thuật**, nhưng khó đọc và khó review (không giống “một migration = một thay đổi nhỏ”).

---

## Cách tách “theo từng bảng / từng thay đổi” (giống Laravel)

Mục tiêu: **nhiều file nhỏ**, mỗi file một ý nghĩa rõ (vd: chỉ thêm bảng `widgets`, chỉ thêm cột `…`).

### Cách 1 — Khuyến nghị: nhiều lần `db:generate` (an toàn với Drizzle)

1. Chỉ sửa **một** phần schema (vd: thêm đúng bảng `widgets`).
2. Chạy `npm run db:generate` → ra file `0002_….sql` gần như chỉ việc đó.
3. Commit file SQL + thư mục `meta/` (snapshot, journal) theo đúng output của Drizzle.
4. Lặp lại cho bảng / thay đổi tiếp theo.

Như vậy lịch sử migration trong repo sẽ **dài theo số lần thay đổi** (giống Laravel), nhưng **mỗi file vẫn nhỏ, dễ đọc** — đó là điều “hay” bạn muốn, không cần framework khác.

### Cách 2 — Tách file SQL thủ công (nâng cao, dễ lỗi)

- Chia nội dung một file `0003_big.sql` thành `0003a.sql` / `0003b.sql` **không** được Wrangler/Drizzle tự hiểu nếu bạn không cập nhật đúng cơ chế đánh số và journal.
- Với **Drizzle Kit**: `_journal.json` và snapshot phải **khớp** từng file; tự tách tay dễ làm lệch `drizzle-kit` / CI.
- Chỉ nên làm khi bạn thật sự hiểu `meta/_journal.json` và chưa apply migration đó lên production.

### Cách 3 — Đặt tên file dễ đọc (sau khi generate)

Drizzle thường tạo tag kiểu `0002_random_words`. Bạn **có thể** đổi tên file thành dạng mô tả, ví dụ `0002_create_widgets.sql`, **miễn là**:

- giữ **thứ tự số** (`0002` không đổi so với journal),
- cập nhật **`tag` trong `meta/_journal.json`** cho khớp tên file (nếu Drizzle/team dựa vào tag),
- **không** đổi thứ tự các migration **đã apply** trên DB thật.

Trên môi trường đã chạy `0002_oldname.sql`, **không được** đổi tên file đó thành tên khác mà vẫn giữ nội dung — Cloudflare coi đó là migration khác và dễ gây lỗi / trùng.

---

## Thư mục migration trong repo này

- **`src/db/migrations/production/`** — output mặc định khi `ENVIRONMENT` không phải `preview` (xem `drizzle.config.ts`).
- **`src/db/migrations/preview/`** — khi `ENVIRONMENT=preview`.
- **`wrangler.json` / `wrangler.jsonc`**: `migrations_dir` trỏ `./src/db/migrations/preview` (Wrangler `d1 migrations apply` đọc thư mục đó). **Khác** với thư mục Drizzle Kit khi `ENVIRONMENT=production` — xem [08-d1-local-remote-migration-va-seed.md](./08-d1-local-remote-migration-va-seed.md).

**Lưu ý Wrangler:** thường kỳ vọng **các file `.sql` nằm phẳng trong `migrations_dir`**, sắp xếp theo prefix số. **Không** dựa vào subfolder kiểu `migrations/widgets/` trừ khi bạn xác nhận rõ phiên bản Wrangler hỗ trợ (thường là không). Cách “Laravel” ở đây = **nhiều file số tuần tự trong một thư mục**, không phải nhiều thư mục con.

---

## So sánh nhanh với Laravel

| Laravel | Dự án này (Drizzle + D1) |
|---------|-------------------------|
| `database/migrations/xxxx_create_…_table.php` | `000n_….sql` + (tuỳ chọn) đổi tên mô tả sau generate |
| Bảng `migrations` lưu batch đã chạy | D1: `d1_migrations`; Drizzle meta: `_journal.json` + snapshot |
| Mỗi lần `php artisan migrate` chỉ chạy file chưa có | `wrangler d1 migrations apply` / `db:migrate` tương tự ý tưởng |
| Một migration = một thay đổi (quy ước team) | **Quy ước tương tự**: ít thay đổi mỗi lần `db:generate` |

---

## Tóm tắt thực hành

1. **Không** chạy lại toàn bộ migration cũ trên DB đang dùng — chỉ chạy **file mới**.
2. Muốn **file nhỏ, tách theo bảng/thay đổi**: sửa schema **từng bước** + `db:generate` **nhiều lần**, hoặc chấp nhận một file lớn nếu bạn cố tình gom nhiều thay đổi một lần.
3. Giữ **`migrations_dir` phẳng**, prefix số tăng dần; tránh đổi tên/ thứ tự file **đã** apply production.
4. File SQL có thể dài nếu bạn alter bảng lớn (SQLite đôi khi recreate bảng) — đó là bản chất SQLite/Drizzle, không phải “một file cho mọi thứ” bắt buộc.

Chi tiết chạy lệnh: xem [HUONG-DAN-SU-DUNG.md](./HUONG-DAN-SU-DUNG.md) và [06-migration-seed-va-drizzle-kit.md](./06-migration-seed-va-drizzle-kit.md).
