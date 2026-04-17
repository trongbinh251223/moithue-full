CREATE TABLE `saved_properties` (
	`user_id` text NOT NULL,
	`property_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (`user_id`, `property_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `saved_properties_user_idx` ON `saved_properties` (`user_id`);
--> statement-breakpoint
CREATE INDEX `saved_properties_property_idx` ON `saved_properties` (`property_id`);
