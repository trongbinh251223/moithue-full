import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopSmooth } from '@/utils/scroll';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTopSmooth();
  }, [pathname]);

  return null;
}
