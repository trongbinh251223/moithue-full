-- Bước chính: roles + sessions + cột updated_at + cập nhật giá trị mặc định.
-- KHÔNG thêm password_hash / role_id (thường đã có sẵn → duplicate column).
--
--   npm run db:preview:align-auth
--
-- Thứ tự gợi ý (xem `PRAGMA table_info(users)` trên preview):
--   1) Thiếu password_hash → `npm run db:preview:add-password-hash`
--   2) Thiếu role_id       → `npm run db:preview:add-role-id`
--   3) Thêm updated_at + cập nhật → `npm run db:preview:align-auth` (file này)
--
-- Nếu `duplicate column name: updated_at` → cột đã có; chỉ cần chạy UPDATE (tách lệnh --command) hoặc bỏ qua seed đã chạy được.

CREATE TABLE IF NOT EXISTS `roles` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`slug` text(64) NOT NULL,
	`name` text(128) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `roles_slug_unique` ON `roles` (`slug`);

INSERT OR IGNORE INTO `roles` (`id`, `slug`, `name`) VALUES
	('00000000-0000-4000-8000-000000000001', 'user', 'User'),
	('00000000-0000-4000-8000-000000000002', 'admin', 'Administrator');

CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token_hash` text(128) NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`revoked_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

-- D1/SQLite: ALTER ADD COLUMN không cho DEFAULT kiểu CURRENT_TIMESTAMP (non-constant).
ALTER TABLE `users` ADD COLUMN `updated_at` text;

UPDATE `users` SET `role_id` = '00000000-0000-4000-8000-000000000001' WHERE `role_id` IS NULL;
UPDATE `users` SET `updated_at` = `created_at` WHERE `updated_at` IS NULL OR `updated_at` = '';
