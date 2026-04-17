import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function BlogDetailBackNavSection() {
  return (
    <Link
      to={ROUTES.blog}
      className="inline-flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
    >
      <ArrowLeft className="w-4 h-4" />
      Quay lại danh sách
    </Link>
  );
}
