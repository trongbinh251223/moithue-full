import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export interface PageShellProps {
  children: ReactNode;
  /** Classes on outer wrapper (e.g. background, min-height) */
  className?: string;
  /** Classes on `<main>` (padding, max-width, etc.) */
  mainClassName?: string;
}

/**
 * Standard site chrome: fixed header, scrollable main, footer.
 */
export default function PageShell({ children, className, mainClassName }: PageShellProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <Header />
      <main className={cn('flex-1 w-full', mainClassName)}>{children}</main>
      <Footer />
    </div>
  );
}
