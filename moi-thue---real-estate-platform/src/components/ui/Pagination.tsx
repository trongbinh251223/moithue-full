import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** `numbered`: nút tròn như trang Blog. `simple`: chỉ Trước/Sau + chữ. */
  variant?: 'numbered' | 'simple';
  className?: string;
  /** Số nút trang tối đa (variant numbered). */
  maxNumeric?: number;
};

function pageWindow(current: number, total: number, max: number): number[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  variant = 'numbered',
  className,
  maxNumeric = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const btn =
    'w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  if (variant === 'simple') {
    return (
      <nav className={cn('flex justify-center items-center gap-2', className)} aria-label="Phân trang">
        <button
          type="button"
          className={btn}
          aria-label="Trang trước"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-3 py-2 text-sm text-on-surface-variant min-w-[8rem] text-center">
          Trang {page} / {totalPages}
        </span>
        <button
          type="button"
          className={btn}
          aria-label="Trang sau"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    );
  }

  const nums = pageWindow(page, totalPages, maxNumeric);

  return (
    <nav className={cn('flex justify-center items-center gap-2 flex-wrap', className)} aria-label="Phân trang">
      <button
        type="button"
        className={btn}
        aria-label="Trang trước"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {nums.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-medium cursor-pointer transition-colors',
            p === page
              ? 'bg-primary text-white shadow-sm'
              : 'border border-outline-variant/40 text-on-surface hover:bg-surface-container-low',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className={btn}
        aria-label="Trang sau"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
