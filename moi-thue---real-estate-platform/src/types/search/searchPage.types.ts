import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import type { SearchUrlState } from '@/constants/search/searchUrlState';
import type { PropertyListing } from '@/types/property/property.types';
import type { SearchFilterKey } from '@/types/search/searchFilters.types';

export type SearchPageDropdown = string | null;

export interface UsePropertySearchPageResult {
  urlState: SearchUrlState;
  setUrlState: (next: SearchUrlState) => void;
  keywordDraft: string;
  setKeywordDraft: (v: string) => void;
  isLoading: boolean;
  properties: PropertyListing[];
  totalListings: number;
  totalPages: number;
  isSavedSearchUi: boolean;
  setIsSavedSearchUi: (v: boolean) => void;
  activeContextFilters: string[];
  removeContextFilter: (filter: string) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (v: boolean) => void;
  activeDropdown: SearchPageDropdown;
  setActiveDropdown: (v: SearchPageDropdown) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
  hasActiveFilters: boolean;
  handleClearFilters: () => void;
  handleSelectFilter: (filterName: SearchFilterKey, value: string | null) => void;
  togglePropertySaved: (e: ReactMouseEvent, id: string) => void;
}
