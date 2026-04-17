import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full bg-transparent border-none focus:ring-0 text-sm outline-none transition-colors',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
