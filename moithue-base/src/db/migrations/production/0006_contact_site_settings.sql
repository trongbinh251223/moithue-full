CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`phone` text(64) NOT NULL,
	`email` text(256) NOT NULL,
	`topic` text(64) NOT NULL,
	`message` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX `contact_submissions_created_idx` ON `contact_submissions` (`created_at`);

INSERT INTO `site_settings` (`key`, `value`, `updated_at`) VALUES (
  'contact_page',
  '{"officeTitle":"Văn phòng chính","officeLines":["123 Đường Nguyễn Huệ, Phường Bến Nghé","Quận 1, TP. Hồ Chí Minh"],"hotlines":["1900 1234 (24/7)","028 3822 1234"],"emails":["support@moithue.com","partnership@moithue.com"],"hours":["Thứ 2 - Thứ 6: 08:00 - 18:00","Thứ 7: 08:00 - 12:00"]}',
  CURRENT_TIMESTAMP
);
