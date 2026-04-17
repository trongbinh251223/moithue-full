import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { buildPropertySearchQueryString } from '@/constants/search/mapSearchToApi';
import { PROPERTY_SEARCH_PAGE_SIZE } from '@/constants/search/pageSize';
import { createEmptySelectedSearchFilters } from '@/constants/search/filterDefaults';
import {
  DEFAULT_SORT_LABEL,
  parseSearchUrlState,
  searchUrlStateHasActiveFilters,
  serializeSearchUrlState,
  type SearchUrlState,
} from '@/constants/search/searchUrlState';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';
import {
  addSavedProperty,
  fetchPropertySearch,
  mapListingDtoToUi,
  removeSavedProperty,
} from '@/lib/propertiesApi';
import type { PropertyListing } from '@/types/property/property.types';
import type { SearchFilterKey } from '@/types/search/searchFilters.types';
import type { UsePropertySearchPageResult } from '@/types/search/searchPage.types';
import { mergeSearchUrlState } from '@/utils/search/mergeSearchUrlState';

export function usePropertySearchPage(): UsePropertySearchPageResult {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { accessToken } = useAuth();
  const searchStr = searchParams.toString();
  const urlState = useMemo(() => parseSearchUrlState(new URLSearchParams(searchStr)), [searchStr]);

  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [isSavedSearchUi, setIsSavedSearchUi] = useState(false);
  const [activeContextFilters, setActiveContextFilters] = useState(['Cho thuê', 'Nhà ở']);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [keywordDraft, setKeywordDraft] = useState(urlState.keyword);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const setUrlState = useCallback(
    (next: SearchUrlState) => {
      setSearchParams(new URLSearchParams(serializeSearchUrlState(next)), { replace: true });
    },
    [setSearchParams],
  );

  const totalPages = Math.max(1, Math.ceil(totalListings / PROPERTY_SEARCH_PAGE_SIZE));

  useEffect(() => {
    setKeywordDraft(urlState.keyword);
  }, [urlState.keyword]);

  useEffect(() => {
    if (keywordDraft === urlState.keyword) return;
    const t = window.setTimeout(() => {
      const cur = parseSearchUrlState(new URLSearchParams(searchParams.toString()));
      setUrlState(mergeSearchUrlState(cur, { keyword: keywordDraft, page: 1 }));
    }, 400);
    return () => window.clearTimeout(t);
  }, [keywordDraft, urlState.keyword, searchParams, setUrlState]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const qs = buildPropertySearchQueryString(
          urlState.keyword,
          urlState.selectedFilters,
          urlState.activePriceRange,
          urlState.sortBy,
          urlState.page,
        );
        const res = await fetchPropertySearch(qs, accessToken);
        if (cancelled) return;
        setProperties(res.data.map(mapListingDtoToUi));
        setTotalListings(res.meta.total);
      } catch (e) {
        if (!cancelled) {
          setProperties([]);
          setTotalListings(0);
          toast.error(e instanceof ApiError ? e.message : 'Không tải được danh sách.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [searchStr, accessToken]);

  const handleClearFilters = useCallback(() => {
    setUrlState({
      keyword: '',
      selectedFilters: createEmptySelectedSearchFilters(),
      activePriceRange: null,
      sortBy: DEFAULT_SORT_LABEL,
      page: 1,
    });
    setKeywordDraft('');
    setActiveContextFilters(['Cho thuê', 'Nhà ở']);
  }, [setUrlState]);

  const handleSelectFilter = useCallback(
    (filterName: SearchFilterKey, value: string | null) => {
      const nextFilters = { ...urlState.selectedFilters, [filterName]: value };
      setUrlState(mergeSearchUrlState(urlState, { selectedFilters: nextFilters, page: 1 }));
      setActiveDropdown(null);
    },
    [setUrlState, urlState],
  );

  const togglePropertySaved = useCallback(
    async (e: ReactMouseEvent, id: string) => {
      e.stopPropagation();
      if (!accessToken) {
        navigate(ROUTES.login);
        return;
      }
      const current = properties.find((p) => p.id === id)?.isSaved ?? false;
      const next = !current;
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, isSaved: next } : p)));
      try {
        if (next) await addSavedProperty(id, accessToken);
        else await removeSavedProperty(id, accessToken);
      } catch (err) {
        setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, isSaved: current } : p)));
        const msg = err instanceof ApiError ? err.message : 'Không cập nhật được tin yêu thích.';
        toast.error(msg);
      }
    },
    [accessToken, navigate, properties],
  );

  const removeContextFilter = useCallback((filter: string) => {
    setActiveContextFilters((prev) => prev.filter((f) => f !== filter));
  }, []);

  const hasActiveFilters = searchUrlStateHasActiveFilters(urlState, activeContextFilters.length);

  return {
    urlState,
    setUrlState,
    keywordDraft,
    setKeywordDraft,
    isLoading,
    properties,
    totalListings,
    totalPages,
    isSavedSearchUi,
    setIsSavedSearchUi,
    activeContextFilters,
    removeContextFilter,
    isFilterModalOpen,
    setIsFilterModalOpen,
    activeDropdown,
    setActiveDropdown,
    dropdownRef,
    hasActiveFilters,
    handleClearFilters,
    handleSelectFilter,
    togglePropertySaved,
  };
}
