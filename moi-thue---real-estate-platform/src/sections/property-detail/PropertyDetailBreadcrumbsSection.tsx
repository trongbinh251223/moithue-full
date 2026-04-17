import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface PropertyDetailBreadcrumbsSectionProps {
  title: string;
}

export default function PropertyDetailBreadcrumbsSection({
  title,
}: PropertyDetailBreadcrumbsSectionProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant mb-6">
      <Link to={ROUTES.home} className="hover:text-primary transition-colors">
        Nhà Tốt
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to={ROUTES.search} className="hover:text-primary transition-colors">
        Thuê Nhà ở
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to={ROUTES.search} className="hover:text-primary transition-colors">
        Thuê Nhà ở Hà Nội
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to={ROUTES.search} className="hover:text-primary transition-colors">
        Thuê Nhà ở Quận Tây Hồ
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-md">{title}</span>
    </div>
  );
}
