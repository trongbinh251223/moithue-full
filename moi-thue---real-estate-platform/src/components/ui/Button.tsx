import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  primary:
    'bg-primary text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
  outline:
    'border border-outline-variant/40 bg-white text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50',
  ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer',
} as const;

export type ButtonVariant = keyof typeof variants;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
