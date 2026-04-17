import { DoorOpen, Users, Home, Bed, Store, Building } from 'lucide-react';
import type { HomeCategoryItem } from '@/types/content/homeContent.types';

export const HOME_RENT_CATEGORIES: HomeCategoryItem[] = [
  {
    icon: DoorOpen,
    title: 'Phòng khép kín',
    description: 'Không gian riêng tư hoàn toàn với đầy đủ tiện ích bên trong.',
  },
  {
    icon: Users,
    title: 'Phòng vệ sinh chung',
    description: 'Lựa chọn tiết kiệm cho sinh viên và người mới đi làm.',
  },
  {
    icon: Home,
    title: 'Nhà nguyên căn',
    description: 'Phù hợp cho hộ gia đình hoặc nhóm bạn ở đông người.',
  },
  {
    icon: Bed,
    title: 'Ký túc xá',
    description: 'Giải pháp chỗ ở hiện đại, kết nối cộng đồng năng động.',
  },
  {
    icon: Store,
    title: 'Cửa hàng',
    description: 'Mặt bằng kinh doanh tại các vị trí đắc địa, giao thông thuận tiện.',
  },
  {
    icon: Building,
    title: 'Văn phòng',
    description: 'Không gian làm việc chuyên nghiệp, đầy đủ tiện ích văn phòng.',
  },
];
