-- Chạy sau khi users đã có role_id và (tuỳ chọn) updated_at.
UPDATE `users` SET `role_id` = '00000000-0000-4000-8000-000000000001' WHERE `role_id` IS NULL;
UPDATE `users` SET `updated_at` = `created_at` WHERE `updated_at` IS NULL OR `updated_at` = '';
