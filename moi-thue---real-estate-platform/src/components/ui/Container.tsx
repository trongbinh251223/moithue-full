import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  /** Narrower reading width */
  narrow?: boolean;
}

export function Container({ children, className, narrow, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-7xl px-8',
        narrow && 'max-w-3xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
