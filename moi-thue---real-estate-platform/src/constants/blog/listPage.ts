import type { BlogListItem } from '@/types/blog/blogListing.types';

export const BLOG_PAGE_CATEGORIES = [
  'Tất cả',
  'Kinh nghiệm thuê',
  'Phong thủy',
  'Pháp lý',
  'Tin tức',
] as const;

export const BLOG_PAGE_POSTS: BlogListItem[] = [
  {
    id: '1',
    title: 'Kinh nghiệm thuê nhà nguyên căn giá rẻ tại Hà Nội',
    category: 'Kinh nghiệm thuê',
    date: '15/04/2024',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400',
    excerpt:
      'Những lưu ý quan trọng khi tìm thuê nhà nguyên căn để tránh bị lừa đảo và tìm được căn nhà ưng ý.',
  },
  {
    id: '2',
    title: 'Cách bố trí phòng trọ hợp phong thủy thu hút tài lộc',
    category: 'Phong thủy',
    date: '14/04/2024',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400',
    excerpt: 'Hướng dẫn cách sắp xếp đồ đạc trong phòng trọ nhỏ sao cho hợp phong thủy, mang lại may mắn.',
  },
  {
    id: '3',
    title: 'Hợp đồng thuê nhà: Những điều khoản cần đặc biệt chú ý',
    category: 'Pháp lý',
    date: '12/04/2024',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400',
    excerpt: 'Phân tích chi tiết các điều khoản trong hợp đồng thuê nhà để bảo vệ quyền lợi của người đi thuê.',
  },
  {
    id: '4',
    title: 'Thị trường cho thuê căn hộ chung cư tăng nhiệt',
    category: 'Tin tức',
    date: '10/04/2024',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    excerpt: 'Cập nhật tình hình thị trường cho thuê căn hộ chung cư tại các thành phố lớn trong quý 2/2024.',
  },
  {
    id: '5',
    title: 'Mẹo trang trí phòng trọ siêu đẹp với chi phí thấp',
    category: 'Kinh nghiệm thuê',
    date: '08/04/2024',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
    excerpt: 'Gợi ý các món đồ decor giá rẻ giúp biến hóa căn phòng trọ nhàm chán trở nên lung linh.',
  },
  {
    id: '6',
    title: 'Quy định mới về đăng ký tạm trú cho người thuê nhà',
    category: 'Pháp lý',
    date: '05/04/2024',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    excerpt: 'Cập nhật những thay đổi mới nhất về thủ tục đăng ký tạm trú mà người đi thuê cần biết.',
  },
];
