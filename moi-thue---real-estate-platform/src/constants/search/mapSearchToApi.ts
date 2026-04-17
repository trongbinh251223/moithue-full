import { SEARCH_AREA_RANGES, SEARCH_PRICE_RANGES } from '@/constants/search/filters';
import type { SelectedSearchFilters, SearchFilterKey } from '@/types/search/searchFilters.types';

const SORT_MAP: Record<string, 'new' | 'price_asc' | 'price_desc'> = {
  'Thông thường': 'new',
  'Mới nhất': 'new',
  'Giá thấp đến cao': 'price_asc',
  'Giá cao đến thấp': 'price_desc',
};

export function buildPropertySearchQueryString(
  keyword: string,
  selectedFilters: SelectedSearchFilters,
  activePriceRange: string | null,
  sortBy: string,
  page: number,
): string {
  const q = new URLSearchParams();
  q.set('page', String(page));
  q.set('limit', '24');

  const sort = SORT_MAP[sortBy];
  if (sort) q.set('sort', sort);

  const kw = keyword.trim();
  if (kw) q.set('q', kw);

  const priceFilter = selectedFilters['Giá thuê' as SearchFilterKey] || activePriceRange;
  if (priceFilter) {
    const range = SEARCH_PRICE_RANGES.find((r) => r.label === priceFilter);
    if (range) {
      q.set('minPrice', String(range.min));
      q.set('maxPrice', String(range.max));
    }
  }

  const proj = selectedFilters['Dự án'];
  if (proj) q.set('project', proj);

  const br = selectedFilters['Số phòng ngủ'];
  if (br) {
    if (br === '5+') q.set('minBedrooms', '5');
    else q.set('bedrooms', br);
  }

  const bt = selectedFilters['Số phòng vệ sinh'];
  if (bt) {
    if (bt === '4+') q.set('minBathrooms', '4');
    else q.set('bathrooms', bt);
  }

  const area = selectedFilters['Diện tích'];
  if (area) {
    const range = SEARCH_AREA_RANGES[area];
    if (range) {
      q.set('minArea', String(range.min));
      q.set('maxArea', String(range.max));
    }
  }

  const typ = selectedFilters['Loại hình nhà ở'];
  if (typ) q.set('propertyType', typ);

  return q.toString();
}
