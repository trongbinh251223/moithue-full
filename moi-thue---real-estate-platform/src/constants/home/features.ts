import { Home, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import type { HomeFeatureItem } from '@/types/content/homeContent.types';

export const HOME_FEATURES: HomeFeatureItem[] = [
  {
    icon: Home,
    title: 'Tìm nhà dễ dàng',
    description: 'Hệ thống lọc thông minh giúp bạn tìm thấy căn hộ ưng ý chỉ trong vài phút.',
  },
  {
    icon: MessageSquare,
    title: 'Liên hệ trực tiếp',
    description: 'Trao đổi nhanh chóng với chủ nhà mà không qua bất kỳ khâu trung gian nào.',
  },
  {
    icon: ShieldCheck,
    title: 'Tư vấn chuyên sâu',
    description: 'Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ các thủ tục pháp lý và hợp đồng.',
  },
  {
    icon: Star,
    title: 'Trải nghiệm tốt',
    description: 'Chúng tôi cam kết mang lại sự hài lòng tối đa cho hành trình tìm tổ ấm.',
  },
];
