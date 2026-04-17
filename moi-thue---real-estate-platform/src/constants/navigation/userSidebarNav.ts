import { User, Home, Heart, Bell, Settings } from 'lucide-react';

export const USER_SIDEBAR_ITEMS = [
  { path: '/profile', icon: User, label: 'Thông tin cá nhân' },
  { path: '/manage-rentals', icon: Home, label: 'Quản lý thuê nhà' },
  { path: '/saved', icon: Heart, label: 'Tin đã lưu' },
  { path: '/notifications', icon: Bell, label: 'Thông báo' },
  { path: '/settings', icon: Settings, label: 'Cài đặt tài khoản' },
] as const;
