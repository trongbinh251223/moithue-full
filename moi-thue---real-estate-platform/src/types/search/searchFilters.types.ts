export interface PriceRangeOption {
  label: string;
  min: number;
  max: number;
}

export type AreaRangeMap = Record<string, { min: number; max: number }>;

export const SEARCH_FILTER_KEYS = [
  'Giá thuê',
  'Dự án',
  'Số phòng ngủ',
  'Số phòng vệ sinh',
  'Diện tích',
  'Loại hình nhà ở',
] as const;

export type SearchFilterKey = (typeof SEARCH_FILTER_KEYS)[number];

export type SelectedSearchFilters = Record<SearchFilterKey, string | null>;
