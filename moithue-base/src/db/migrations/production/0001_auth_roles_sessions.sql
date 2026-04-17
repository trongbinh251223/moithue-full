CREATE TABLE `roles` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`slug` text(64) NOT NULL,
	`name` text(128) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_slug_unique` ON `roles` (`slug`);
--> statement-breakpoint
INSERT INTO `roles` (`id`, `slug`, `name`) VALUES
	('00000000-0000-4000-8000-000000000001', 'user', 'User'),
	('00000000-0000-4000-8000-000000000002', 'admin', 'Administrator');
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token_hash` text(128) NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`revoked_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `password_hash` text;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `role_id` text;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `updated_at` text;
--> statement-breakpoint
UPDATE `users` SET `role_id` = '00000000-0000-4000-8000-000000000001' WHERE `role_id` IS NULL;
--> statement-breakpoint
UPDATE `users` SET `updated_at` = `created_at` WHERE `updated_at` IS NULL OR `updated_at` = '';
