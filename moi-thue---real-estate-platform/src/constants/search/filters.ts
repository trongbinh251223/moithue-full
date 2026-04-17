import type { AreaRangeMap, PriceRangeOption } from '@/types/search/searchFilters.types';

export const SEARCH_PRICE_RANGES: PriceRangeOption[] = [
  { label: 'Dưới 5 triệu', min: 0, max: 5 },
  { label: '5 - 10 triệu', min: 5, max: 10 },
  { label: '10 - 15 triệu', min: 10, max: 15 },
  { label: '15 - 20 triệu', min: 15, max: 20 },
  { label: '20 - 30 triệu', min: 20, max: 30 },
  { label: '30 - 50 triệu', min: 30, max: 50 },
  { label: '50 - 70 triệu', min: 50, max: 70 },
  { label: 'Trên 70 triệu', min: 70, max: 9999 },
];

export const SEARCH_FILTER_OPTIONS: Record<string, string[]> = {
  'Giá thuê': SEARCH_PRICE_RANGES.map((r) => r.label),
  'Dự án': ['Vinhomes Central Park', 'KĐT Sala', 'Vườn Đào'],
  'Số phòng ngủ': ['1', '2', '3', '4', '5+'],
  'Số phòng vệ sinh': ['1', '2', '3', '4+'],
  'Diện tích': ['Dưới 30 m²', '30 - 50 m²', '50 - 80 m²', '80 - 100 m²', 'Trên 100 m²'],
  'Loại hình nhà ở': [
    'Căn hộ chung cư',
    'Nhà mặt phố',
    'Nhà biệt thự',
    'Phòng trọ',
    'Căn hộ mini',
  ],
};

export const SEARCH_AREA_RANGES: AreaRangeMap = {
  'Dưới 30 m²': { min: 0, max: 30 },
  '30 - 50 m²': { min: 30, max: 50 },
  '50 - 80 m²': { min: 50, max: 80 },
  '80 - 100 m²': { min: 80, max: 100 },
  'Trên 100 m²': { min: 100, max: 9999 },
};
