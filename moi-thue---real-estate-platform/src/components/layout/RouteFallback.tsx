import { Loader2 } from 'lucide-react';

export default function RouteFallback() {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-on-surface-variant"
      role="status"
      aria-live="polite"
      aria-label="Đang tải trang"
    >
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <span className="text-sm font-medium">Đang tải…</span>
    </div>
  );
}
