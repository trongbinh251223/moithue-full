-- Chỉ khi cột role_id CHƯA có (lỗi seed / schema). Nếu duplicate column → bỏ qua.
ALTER TABLE `users` ADD COLUMN `role_id` text;
