import { SITE_NAME, SITE_TAGLINE } from '@/constants/site';

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords?: string;
}

export function getPublicSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined;
  return (raw?.replace(/\/$/, '') || 'https://moithue.com').trim();
}

/** Default Open Graph image (absolute URL). */
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

const defaultMeta: PageSeoMeta = {
  title: `${SITE_NAME} — Thuê nhà, căn hộ uy tín`,
  description: SITE_TAGLINE,
  keywords: 'thuê nhà, cho thuê, căn hộ, Moi Thue, bất động sản',
};

const staticRoutes: Record<string, PageSeoMeta> = {
  '/': {
    title: `${SITE_NAME} — An tâm tìm nhà thuê`,
    description: SITE_TAGLINE,
    keywords: 'thuê nhà, tìm phòng trọ, căn hộ cho thuê, Hà Nội, TP.HCM',
  },
  '/search': {
    title: `Tìm thuê nhà — ${SITE_NAME}`,
    description: 'Lọc theo giá, khu vực, loại hình. Danh sách tin cho thuê cập nhật liên tục.',
    keywords: 'tìm thuê nhà, lọc giá thuê, quận Tây Hồ, Bình Thạnh',
  },
  '/guide': {
    title: `Hướng dẫn — ${SITE_NAME}`,
    description: 'Hướng dẫn người thuê, chủ nhà và chính sách sử dụng nền tảng.',
    keywords: 'hướng dẫn thuê nhà, đăng tin cho thuê',
  },
  '/blog': {
    title: `Blog & tin tức — ${SITE_NAME}`,
    description: 'Kinh nghiệm thuê nhà, pháp lý, phong thủy và cập nhật thị trường.',
    keywords: 'blog thuê nhà, kinh nghiệm thuê trọ',
  },
  '/about': {
    title: `Về chúng tôi — ${SITE_NAME}`,
    description: 'Sứ mệnh và giá trị cốt lõi của nền tảng kết nối thuê nhà Moi Thue.',
    keywords: 'Moi Thue, về chúng tôi',
  },
  '/contact': {
    title: `Liên hệ — ${SITE_NAME}`,
    description: 'Liên hệ hỗ trợ, hợp tác và gửi góp ý tới đội ngũ Moi Thue.',
    keywords: 'liên hệ Moi Thue, hotline',
  },
  '/privacy': {
    title: `Chính sách bảo mật — ${SITE_NAME}`,
    description: 'Cách chúng tôi thu thập, lưu trữ và bảo vệ dữ liệu cá nhân của bạn.',
    keywords: 'chính sách bảo mật, GDPR, dữ liệu cá nhân',
  },
  '/login': {
    title: `Đăng nhập — ${SITE_NAME}`,
    description: 'Đăng nhập tài khoản để lưu tin, quản lý thuê nhà và nhận thông báo.',
    keywords: 'đăng nhập Moi Thue',
  },
  '/register': {
    title: `Đăng ký — ${SITE_NAME}`,
    description: 'Tạo tài khoản miễn phí để sử dụng đầy đủ tính năng nền tảng.',
    keywords: 'đăng ký Moi Thue',
  },
  '/forgot-password': {
    title: `Quên mật khẩu — ${SITE_NAME}`,
    description: 'Khôi phục mật khẩu tài khoản Moi Thue.',
    keywords: 'quên mật khẩu',
  },
  '/reset-password': {
    title: `Đặt lại mật khẩu — ${SITE_NAME}`,
    description: 'Đặt mật khẩu mới cho tài khoản Moi Thue.',
    keywords: 'đặt lại mật khẩu',
  },
  '/verify-email': {
    title: `Xác thực email — ${SITE_NAME}`,
    description: 'Xác nhận địa chỉ email cho tài khoản Moi Thue.',
    keywords: 'xác thực email',
  },
  '/profile': {
    title: `Thông tin cá nhân — ${SITE_NAME}`,
    description: 'Cập nhật hồ sơ và thông tin liên hệ của bạn.',
    keywords: 'hồ sơ người dùng',
  },
  '/saved': {
    title: `Tin đã lưu — ${SITE_NAME}`,
    description: 'Danh sách bất động sản bạn đã lưu để xem lại sau.',
    keywords: 'tin đã lưu',
  },
  '/notifications': {
    title: `Thông báo — ${SITE_NAME}`,
    description: 'Thông báo hệ thống và cập nhật liên quan tới tài khoản của bạn.',
    keywords: 'thông báo',
  },
  '/settings': {
    title: `Cài đặt tài khoản — ${SITE_NAME}`,
    description: 'Bảo mật, mật khẩu và tùy chọn tài khoản.',
    keywords: 'cài đặt tài khoản',
  },
  '/manage-rentals': {
    title: `Quản lý thuê nhà — ${SITE_NAME}`,
    description: 'Quản lý tin đăng cho thuê và trạng thái duyệt tin.',
    keywords: 'quản lý tin đăng',
  },
};

export function resolvePageSeo(pathname: string): PageSeoMeta {
  if (staticRoutes[pathname]) {
    return staticRoutes[pathname];
  }
  if (pathname.startsWith('/blog/')) {
    return {
      title: `Bài viết — ${SITE_NAME}`,
      description: 'Chi tiết bài viết blog: kinh nghiệm thuê nhà và pháp lý.',
      keywords: 'blog Moi Thue, bài viết',
    };
  }
  if (pathname.startsWith('/property/')) {
    return {
      title: `Chi tiết tin cho thuê — ${SITE_NAME}`,
      description: 'Thông tin mô tả, hình ảnh và liên hệ chủ nhà.',
      keywords: 'chi tiết cho thuê, BĐS',
    };
  }
  return defaultMeta;
}
