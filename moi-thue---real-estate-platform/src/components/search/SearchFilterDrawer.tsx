import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { SEARCH_FILTER_OPTIONS } from '@/constants/search/filters';
import type { SearchUrlState } from '@/constants/search/searchUrlState';
import { SEARCH_FILTER_KEYS, type SearchFilterKey } from '@/types/search/searchFilters.types';

type Props = {
  open: boolean;
  onClose: () => void;
  urlState: SearchUrlState;
  onSelectFilter: (filterName: SearchFilterKey, value: string | null) => void;
  onClearFilters: () => void;
};

export function SearchFilterDrawer({ open, onClose, urlState, onSelectFilter, onClearFilters }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <h2 className="text-xl font-bold text-on-surface">Bộ lọc nâng cao</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {SEARCH_FILTER_KEYS.map((filterName) => (
                <div key={filterName} className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface font-label">{filterName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {SEARCH_FILTER_OPTIONS[filterName].map((option) => {
                      const isActive =
                        urlState.selectedFilters[filterName] === option ||
                        (filterName === 'Giá thuê' && urlState.activePriceRange === option);
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => onSelectFilter(filterName, isActive ? null : option)}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-outline-variant/20 bg-surface flex gap-4">
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  onClose();
                }}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Xóa bộ lọc
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Áp dụng
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
