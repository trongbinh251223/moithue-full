import type { BlogCommentItem } from '@/types/blog/blogComment.types';

export const BLOG_DETAIL_MOCK_COMMENTS: BlogCommentItem[] = [
  {
    id: 1,
    user: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?u=1',
    date: '15/04/2024 14:30',
    content: 'Bài viết rất hữu ích, cảm ơn tác giả đã chia sẻ!',
  },
  {
    id: 2,
    user: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?u=2',
    date: '15/04/2024 15:45',
    content: 'Mình cũng từng bị lừa khi thuê nhà, đọc bài này thấy đồng cảm quá.',
  },
  {
    id: 3,
    user: 'Phạm Thị D',
    avatar: 'https://i.pravatar.cc/150?u=3',
    date: '16/04/2024 09:15',
    content: 'Cho mình hỏi thêm về phần hợp đồng cọc với ạ?',
  },
  {
    id: 4,
    user: 'Hoàng Văn E',
    avatar: 'https://i.pravatar.cc/150?u=4',
    date: '16/04/2024 10:20',
    content: 'Lưu lại để mốt đi thuê nhà áp dụng.',
  },
];

export const BLOG_DETAIL_COVER_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
