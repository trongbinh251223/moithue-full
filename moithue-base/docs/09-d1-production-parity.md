# 09 — Đồng bộ D1 production với preview

Khi **production** thiếu bảng/cột so với **preview** (Worker preview DB), chạy chuỗi patch tương đương các lệnh đã dùng cho preview.

## Một lệnh (khuyến nghị)

Từ thư mục `moithue-base`, đã đăng nhập Wrangler (`npx wrangler login`) hoặc có `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`:

```bash
npm run db:prod:parity
```

Sau đó deploy Worker:

```bash
npm run deploy
```

Hoặc gộp:

```bash
npm run deploy:prod
```

`deploy:prod` = `db:prod:parity` + `wrangler deploy`.

## `db:prod:parity` làm gì

1. `wrangler d1 migrations apply DB_PROD --remote` — áp toàn bộ file trong `src/db/migrations/production/`.
2. Thử (bỏ qua lỗi *duplicate column* nếu đã có): thêm `password_hash`, `role_id` trên `users`.
3. Tạo `roles` / `sessions` + seed role `user`/`admin` nếu thiếu.
4. Thêm `updated_at` trên `users` nếu thiếu; backfill `role_id` và `updated_at`.

## Seed demo (tuỳ chọn — nguy hiểm trên prod có dữ liệu thật)

`seed.sql` **xóa** users, properties, posts, … rồi chèn tài khoản demo (Alice/Bob). **Chỉ** bật khi bạn chấp nhận mất dữ liệu hiện có:

```bash
RUN_SEED=1 npm run db:prod:parity
```

## Lệnh từng bước (debug)

Xem [`package.json`](../package.json): `db:prod:add-password-hash`, `db:prod:add-role-id`, `db:prod:roles-sessions`, v.v.

## Preview (đối chiếu)

Các lệnh `--remote --preview` tương ứng: `db:preview:align-auth`, `db:preview:add-role-id`, `db:preview:add-password-hash`, `db:seed:preview`.
