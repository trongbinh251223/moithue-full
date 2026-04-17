-- Chỉ thêm cột updated_at nếu chưa có. Nếu lỗi "duplicate column" → bỏ qua (preview đã có).
ALTER TABLE `users` ADD COLUMN `updated_at` text;
