ALTER TABLE `users` ADD COLUMN `phone` text;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `excerpt` text;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `cover_image` text;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `category` text(128);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `slug` text(256);
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `is_published` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
ALTER TABLE `posts` ADD COLUMN `updated_at` text;
--> statement-breakpoint
UPDATE `posts` SET `updated_at` = `created_at` WHERE `updated_at` IS NULL OR `updated_at` = '';
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))) NOT NULL,
	`user_id` text NOT NULL,
	`title` text(512) NOT NULL,
	`property_type` text(128) NOT NULL,
	`project` text(256),
	`bedrooms` integer DEFAULT 0 NOT NULL,
	`bathrooms` integer DEFAULT 0 NOT NULL,
	`floors` integer,
	`area_value` real NOT NULL,
	`price_value` real NOT NULL,
	`deposit_text` text(256),
	`location` text(512) NOT NULL,
	`location_extra` text(256),
	`description` text NOT NULL,
	`contact_phone` text(64),
	`images_json` text NOT NULL DEFAULT '[]',
	`status` text(32) NOT NULL DEFAULT 'pending',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `properties_status_idx` ON `properties` (`status`);
--> statement-breakpoint
CREATE INDEX `properties_type_idx` ON `properties` (`property_type`);
--> statement-breakpoint
CREATE INDEX `properties_user_idx` ON `properties` (`user_id`);
--> statement-breakpoint
CREATE INDEX `properties_price_idx` ON `properties` (`price_value`);
--> statement-breakpoint
CREATE INDEX `properties_created_idx` ON `properties` (`created_at`);
