import { Search, Shield, Home, CreditCard } from 'lucide-react';

export const GUIDE_PAGE_TOPIC_GROUPS = [
  {
    icon: Search,
    title: 'Dành cho người đi thuê',
    items: [
      'Cách tìm kiếm nhà hiệu quả',
      'Lưu ý khi đi xem nhà thực tế',
      'Thủ tục ký hợp đồng thuê nhà',
      'Cách nhận biết tin đăng lừa đảo',
    ],
  },
  {
    icon: Home,
    title: 'Dành cho chủ nhà',
    items: [
      'Hướng dẫn đăng tin cho thuê',
      'Mẹo chụp ảnh nhà đẹp thu hút',
      'Quản lý tin đăng và khách hàng',
      'Mẫu hợp đồng cho thuê chuẩn',
    ],
  },
  {
    icon: Shield,
    title: 'Quy định & Chính sách',
    items: [
      'Quy định đăng tin',
      'Chính sách giải quyết khiếu nại',
      'Quy chế hoạt động',
      'Chính sách bảo mật thông tin',
    ],
  },
  {
    icon: CreditCard,
    title: 'Thanh toán & Dịch vụ',
    items: [
      'Bảng giá dịch vụ đăng tin',
      'Hướng dẫn nạp tiền vào tài khoản',
      'Các hình thức thanh toán',
      'Gói dịch vụ đẩy tin VIP',
    ],
  },
] as const;
