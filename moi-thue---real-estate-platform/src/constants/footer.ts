import { ROUTES } from '@/constants/routes';

export const FOOTER_EXPLORE_LINKS = [
  { to: ROUTES.search, label: 'Loại hình nhà' },
  { to: ROUTES.about, label: 'Về chúng tôi' },
  { to: ROUTES.blog, label: 'Blog & Tin tức' },
] as const;

export const FOOTER_SUPPORT_LINKS = [
  { to: ROUTES.contact, label: 'Liên hệ' },
  { to: ROUTES.guide, label: 'Hướng dẫn' },
  { to: ROUTES.privacy, label: 'Chính sách bảo mật' },
] as const;
