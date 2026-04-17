import type { SearchUrlState } from '@/constants/search/searchUrlState';

export function mergeSearchUrlState(base: SearchUrlState, patch: Partial<SearchUrlState>): SearchUrlState {
  const selectedFilters = patch.selectedFilters ?? base.selectedFilters;
  const activePriceRange =
    patch.activePriceRange !== undefined
      ? patch.activePriceRange
      : patch.selectedFilters
        ? (selectedFilters['Giá thuê'] ?? null)
        : base.activePriceRange;
  return {
    keyword: patch.keyword ?? base.keyword,
    selectedFilters,
    activePriceRange,
    sortBy: patch.sortBy ?? base.sortBy,
    page: patch.page ?? base.page,
  };
}
