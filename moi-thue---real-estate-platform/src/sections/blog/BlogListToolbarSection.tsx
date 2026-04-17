import { Search } from 'lucide-react';
import { BLOG_PAGE_CATEGORIES } from '@/constants/blog/listPage';

interface BlogListToolbarSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogListToolbarSection({
  activeCategory,
  onCategoryChange,
}: BlogListToolbarSectionProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 hide-scrollbar">
        {BLOG_PAGE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-white border border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="search"
          placeholder="Tìm kiếm bài viết..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-outline-variant/40 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
      </div>
    </div>
  );
}
