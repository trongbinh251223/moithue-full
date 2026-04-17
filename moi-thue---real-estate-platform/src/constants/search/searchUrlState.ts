import { SEARCH_AREA_RANGES, SEARCH_PRICE_RANGES } from '@/constants/search/filters';
import { createEmptySelectedSearchFilters } from '@/constants/search/filterDefaults';
import type { SelectedSearchFilters, SearchFilterKey } from '@/types/search/searchFilters.types';

export const DEFAULT_SORT_LABEL = 'Thông thường';

export type SearchUrlState = {
  keyword: string;
  selectedFilters: SelectedSearchFilters;
  activePriceRange: string | null;
  sortBy: string;
  page: number;
};

const SORT_LABEL_TO_API: Record<string, 'new' | 'price_asc' | 'price_desc'> = {
  [DEFAULT_SORT_LABEL]: 'new',
  'Mới nhất': 'new',
  'Giá thấp đến cao': 'price_asc',
  'Giá cao đến thấp': 'price_desc',
};

function sortLabelFromParam(sortRaw: string | null): string {
  if (!sortRaw) return DEFAULT_SORT_LABEL;
  if (sortRaw === 'new') return 'Mới nhất';
  if (sortRaw === 'price_asc') return 'Giá thấp đến cao';
  if (sortRaw === 'price_desc') return 'Giá cao đến thấp';
  return DEFAULT_SORT_LABEL;
}

function priceLabelFromParams(minRaw: string | null, maxRaw: string | null): string | null {
  if (minRaw === null && maxRaw === null) return null;
  const min = minRaw !== null ? Number(minRaw) : NaN;
  const max = maxRaw !== null ? Number(maxRaw) : NaN;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  const hit = SEARCH_PRICE_RANGES.find((r) => r.min === min && r.max === max);
  return hit?.label ?? null;
}

function areaLabelFromParams(minRaw: string | null, maxRaw: string | null): string | null {
  if (minRaw === null && maxRaw === null) return null;
  const min = minRaw !== null ? Number(minRaw) : NaN;
  const max = maxRaw !== null ? Number(maxRaw) : NaN;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  for (const [label, range] of Object.entries(SEARCH_AREA_RANGES)) {
    if (range.min === min && range.max === max) return label;
  }
  return null;
}

/** Đọc state tìm kiếm từ query string (đồng bộ với API `/properties`). */
export function parseSearchUrlState(sp: URLSearchParams): SearchUrlState {
  const keyword = (sp.get('q') ?? '').trim();
  const page = Math.max(1, Number.parseInt(sp.get('page') ?? '1', 10) || 1);
  const sortBy = sortLabelFromParam(sp.get('sort'));

  const selectedFilters = createEmptySelectedSearchFilters();

  const priceLabel = priceLabelFromParams(sp.get('minPrice'), sp.get('maxPrice'));
  if (priceLabel) {
    selectedFilters['Giá thuê'] = priceLabel;
  }

  const project = sp.get('project');
  if (project) selectedFilters['Dự án'] = project;

  const minBr = sp.get('minBedrooms');
  const br = sp.get('bedrooms');
  if (minBr === '5') selectedFilters['Số phòng ngủ'] = '5+';
  else if (br) selectedFilters['Số phòng ngủ'] = br;

  const minBt = sp.get('minBathrooms');
  const bt = sp.get('bathrooms');
  if (minBt === '4') selectedFilters['Số phòng vệ sinh'] = '4+';
  else if (bt) selectedFilters['Số phòng vệ sinh'] = bt;

  const areaLabel = areaLabelFromParams(sp.get('minArea'), sp.get('maxArea'));
  if (areaLabel) selectedFilters['Diện tích'] = areaLabel;

  const pt = sp.get('propertyType');
  if (pt) selectedFilters['Loại hình nhà ở'] = pt;

  return {
    keyword,
    selectedFilters,
    activePriceRange: priceLabel,
    sortBy,
    page,
  };
}

function setIfTruthy(q: URLSearchParams, key: string, value: string | null | undefined) {
  if (value && value.trim()) q.set(key, value.trim());
}

/** Ghi state tìm kiếm ra query string. */
export function serializeSearchUrlState(s: SearchUrlState): string {
  const q = new URLSearchParams();

  if (s.page > 1) q.set('page', String(s.page));

  if (s.sortBy === 'Mới nhất') q.set('sort', 'new');
  else {
    const sortApi = SORT_LABEL_TO_API[s.sortBy];
    if (sortApi && sortApi !== 'new') q.set('sort', sortApi);
  }

  const kw = s.keyword.trim();
  if (kw) q.set('q', kw);

  const priceFilter = s.selectedFilters['Giá thuê' as SearchFilterKey] || s.activePriceRange;
  if (priceFilter) {
    const range = SEARCH_PRICE_RANGES.find((r) => r.label === priceFilter);
    if (range) {
      q.set('minPrice', String(range.min));
      q.set('maxPrice', String(range.max));
    }
  }

  setIfTruthy(q, 'project', s.selectedFilters['Dự án']);
  const br = s.selectedFilters['Số phòng ngủ'];
  if (br) {
    if (br === '5+') q.set('minBedrooms', '5');
    else q.set('bedrooms', br);
  }
  const bt = s.selectedFilters['Số phòng vệ sinh'];
  if (bt) {
    if (bt === '4+') q.set('minBathrooms', '4');
    else q.set('bathrooms', bt);
  }
  const area = s.selectedFilters['Diện tích'];
  if (area) {
    const range = SEARCH_AREA_RANGES[area];
    if (range) {
      q.set('minArea', String(range.min));
      q.set('maxArea', String(range.max));
    }
  }
  setIfTruthy(q, 'propertyType', s.selectedFilters['Loại hình nhà ở']);

  return q.toString();
}

export function searchUrlStateHasActiveFilters(
  s: SearchUrlState,
  activeContextCount: number,
  defaultContextCount = 2,
): boolean {
  const sortActive =
    s.sortBy === 'Mới nhất' || s.sortBy === 'Giá thấp đến cao' || s.sortBy === 'Giá cao đến thấp';
  const filtersActive = Object.values(s.selectedFilters).some((v) => v !== null);
  return Boolean(
    s.keyword.trim() ||
      filtersActive ||
      sortActive ||
      s.page > 1 ||
      activeContextCount < defaultContextCount,
  );
}
