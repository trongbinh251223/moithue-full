-- Phần schema idempotent: roles + sessions + seed roles (không đụng cột users).
-- Chạy sau migrations + (tuỳ chọn) add-password-hash / add-role-id.

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
