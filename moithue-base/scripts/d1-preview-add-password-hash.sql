-- Chỉ khi cột password_hash CHƯA có. Nếu duplicate column → bỏ qua.
ALTER TABLE `users` ADD COLUMN `password_hash` text;
