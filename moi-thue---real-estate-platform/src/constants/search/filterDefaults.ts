import { SEARCH_FILTER_KEYS, type SelectedSearchFilters } from '@/types/search/searchFilters.types';

export function createEmptySelectedSearchFilters(): SelectedSearchFilters {
  return SEARCH_FILTER_KEYS.reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {} as SelectedSearchFilters);
}
