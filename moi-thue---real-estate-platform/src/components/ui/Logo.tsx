import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/constants/site';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  /** Larger variant for auth cards */
  size?: 'default' | 'large';
}

export function Logo({ className, size = 'default' }: LogoProps) {
  return (
    <Link
      to={ROUTES.home}
      className={cn(
        'font-black tracking-tighter text-primary inline-block',
        size === 'large' ? 'text-3xl' : 'text-2xl',
        className,
      )}
    >
      {SITE_NAME}
    </Link>
  );
}
