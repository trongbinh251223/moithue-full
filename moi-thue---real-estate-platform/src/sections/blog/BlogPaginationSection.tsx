import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogPaginationSection() {
  return (
    <div className="flex justify-center items-center gap-2">
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-medium cursor-pointer"
      >
        1
      </button>
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface hover:bg-surface-container-low transition-colors font-medium cursor-pointer"
      >
        2
      </button>
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface hover:bg-surface-container-low transition-colors font-medium cursor-pointer"
      >
        3
      </button>
      <button
        type="button"
        className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
        aria-label="Trang sau"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
