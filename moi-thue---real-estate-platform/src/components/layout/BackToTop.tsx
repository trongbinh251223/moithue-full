import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToTopSmooth } from '@/utils/scroll';

const SCROLL_THRESHOLD_PX = 300;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTopSmooth}
          className="fixed bottom-8 right-8 z-50 p-3.5 bg-primary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all cursor-pointer"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
