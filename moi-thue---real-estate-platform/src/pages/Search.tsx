import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Filter,
  Loader2,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { SearchFilterDrawer } from '@/components/search/SearchFilterDrawer';
import { SearchListingCard } from '@/components/search/SearchListingCard';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { SEARCH_FILTER_OPTIONS, SEARCH_PRICE_RANGES } from '@/constants/search/filters';
import { ROUTES } from '@/constants/routes';
import { usePropertySearchPage } from '@/hooks/search/usePropertySearchPage';
import { mergeSearchUrlState } from '@/utils/search/mergeSearchUrlState';
import { SEARCH_FILTER_KEYS } from '@/types/search/searchFilters.types';

export default function Search() {
  const navigate = useNavigate();
  const s = usePropertySearchPage();

  return (
    <PageShell
      className="bg-surface selection:bg-primary/10"
      mainClassName="flex-1 pt-28 pb-12 max-w-6xl w-full mx-auto px-8"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant mb-6">
        <span className="hover:text-primary cursor-pointer transition-colors">Moi Thue</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Thuê nhà</span>
        <span>/</span>
        <span className="text-on-surface font-semibold">Tìm kiếm</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">Danh sách cho thuê</h1>
        <button
          type="button"
          onClick={() => s.setIsSavedSearchUi(!s.isSavedSearchUi)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all font-medium text-sm cursor-pointer shadow-sm flex-shrink-0
              ${s.isSavedSearchUi ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/40 hover:border-primary hover:text-primary bg-white'}`}
        >
          <Bookmark className={`w-4 h-4 ${s.isSavedSearchUi ? 'fill-primary' : ''}`} />
          {s.isSavedSearchUi ? 'Đã lưu tìm kiếm' : 'Lưu tìm kiếm'}
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 flex items-center rounded-full border border-outline-variant/30 bg-white px-4 h-12 shadow-sm">
          <SearchIcon className="w-5 h-5 text-on-surface-variant mr-2 shrink-0" />
          <Input
            className="border-0 shadow-none focus-visible:ring-0 flex-1 h-10 px-0"
            placeholder="Từ khóa, khu vực, dự án…"
            value={s.keywordDraft}
            onChange={(e) => s.setKeywordDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                s.setUrlState(mergeSearchUrlState(s.urlState, { keyword: s.keywordDraft, page: 1 }));
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4" ref={s.dropdownRef}>
        <button
          type="button"
          onClick={() => s.setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-sm font-medium cursor-pointer"
        >
          <Filter className="w-4 h-4" /> Lọc
        </button>

        <AnimatePresence>
          {s.activeContextFilters.map((filter) => (
            <motion.button
              type="button"
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, width: 0, padding: 0, margin: 0 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium cursor-pointer hover:opacity-90 shadow-sm overflow-hidden whitespace-nowrap"
            >
              {filter}
              <X
                className="w-4 h-4 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  s.removeContextFilter(filter);
                }}
              />
            </motion.button>
          ))}
        </AnimatePresence>

        {SEARCH_FILTER_KEYS.map((filterName) => {
          const isActive =
            Boolean(s.urlState.selectedFilters[filterName]) ||
            (filterName === 'Giá thuê' && s.urlState.activePriceRange);
          const displayValue =
            s.urlState.selectedFilters[filterName] ||
            (filterName === 'Giá thuê' && s.urlState.activePriceRange) ||
            filterName;

          return (
            <div key={filterName} className="relative">
              <button
                type="button"
                onClick={() => s.setActiveDropdown(s.activeDropdown === filterName ? null : filterName)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {displayValue}
                {isActive ? (
                  <X
                    className="w-4 h-4 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      s.handleSelectFilter(filterName, null);
                    }}
                  />
                ) : (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${s.activeDropdown === filterName ? 'rotate-180' : 'text-on-surface-variant'}`}
                  />
                )}
              </button>

              <AnimatePresence>
                {s.activeDropdown === filterName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/20 py-2 z-50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => s.handleSelectFilter(filterName, null)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${
                        !s.urlState.selectedFilters[filterName] ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'
                      }`}
                    >
                      Tất cả
                    </button>
                    {SEARCH_FILTER_OPTIONS[filterName].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => s.handleSelectFilter(filterName, option)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${
                          s.urlState.selectedFilters[filterName] === option ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
          aria-hidden
        >
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>

        {s.hasActiveFilters && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={s.handleClearFilters}
            className="ml-auto text-sm font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            Xoá lọc
          </motion.button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-outline-variant/20">
        <span className="text-sm text-on-surface-variant font-medium mr-2">Giá thuê:</span>
        {SEARCH_PRICE_RANGES.map((range) => {
          const isActive = s.urlState.activePriceRange === range.label;
          return (
            <button
              type="button"
              key={range.label}
              onClick={() => {
                const newValue = isActive ? null : range.label;
                s.setUrlState(
                  mergeSearchUrlState(s.urlState, {
                    activePriceRange: newValue,
                    selectedFilters: { ...s.urlState.selectedFilters, 'Giá thuê': newValue },
                    page: 1,
                  }),
                );
              }}
              className={`px-4 py-1.5 rounded-full border text-sm transition-all cursor-pointer
                  ${isActive ? 'border-primary bg-primary text-white shadow-sm' : 'border-outline-variant/40 hover:border-primary hover:text-primary bg-white text-on-surface'}`}
            >
              {range.label}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-on-surface-variant">
          Tìm thấy <span className="font-bold text-on-surface">{s.totalListings}</span> kết quả
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label hidden sm:inline">
            Sắp xếp:
          </span>
          <select
            value={s.urlState.sortBy}
            onChange={(e) => s.setUrlState(mergeSearchUrlState(s.urlState, { sortBy: e.target.value, page: 1 }))}
            className="bg-surface-container-low border-none text-sm font-medium text-on-surface rounded-lg py-2 px-4 focus:ring-0 cursor-pointer outline-none hover:bg-surface-container-high transition-colors"
          >
            <option>Thông thường</option>
            <option>Mới nhất</option>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 relative min-h-[400px]">
        {s.isLoading ? (
          <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-surface/50 backdrop-blur-sm">
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-outline-variant/20 p-3 gap-4 animate-pulse"
              >
                <div className="sm:w-[280px] h-[200px] bg-surface-variant rounded-xl flex-shrink-0" />
                <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-surface-variant rounded w-3/4 mb-3" />
                    <div className="h-4 bg-surface-variant rounded w-1/4 mb-4" />
                    <div className="flex gap-4 mb-4">
                      <div className="h-6 bg-surface-variant rounded w-1/3" />
                      <div className="h-6 bg-surface-variant rounded w-1/4" />
                    </div>
                    <div className="h-4 bg-surface-variant rounded w-1/2" />
                  </div>
                  <div className="pt-4 border-t border-outline-variant/10 flex justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-surface-variant" />
                      <div className="h-4 bg-surface-variant rounded w-24" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-variant" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : s.properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <Filter className="w-10 h-10 text-on-surface-variant" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Không tìm thấy kết quả phù hợp</h3>
            <p className="text-on-surface-variant mb-6 max-w-md">
              Rất tiếc, không có bất động sản nào khớp với tiêu chí tìm kiếm của bạn. Vui lòng thử thay đổi bộ lọc.
            </p>
            <button
              type="button"
              onClick={s.handleClearFilters}
              className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Xóa tất cả bộ lọc
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {s.properties.map((property) => (
              <Fragment key={property.id}>
                <SearchListingCard
                  property={property}
                  onOpenDetail={(id) => {
                    void navigate(ROUTES.propertyDetail(id));
                  }}
                  onToggleSaved={s.togglePropertySaved}
                />
              </Fragment>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!s.isLoading && s.properties.length > 0 ? (
        <div className="mt-12">
          <Pagination
            variant="simple"
            page={s.urlState.page}
            totalPages={s.totalPages}
            onPageChange={(p) => s.setUrlState(mergeSearchUrlState(s.urlState, { page: p }))}
          />
        </div>
      ) : null}

      <SearchFilterDrawer
        open={s.isFilterModalOpen}
        onClose={() => s.setIsFilterModalOpen(false)}
        urlState={s.urlState}
        onSelectFilter={s.handleSelectFilter}
        onClearFilters={s.handleClearFilters}
      />
    </PageShell>
  );
}
