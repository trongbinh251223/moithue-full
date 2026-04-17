import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError } from '@/lib/apiClient';
import {
  addSavedProperty,
  fetchPropertyDetail,
  fetchSimilarProperties,
  removeSavedProperty,
} from '@/lib/propertiesApi';
import type { PropertyDetailViewModel, SimilarPropertyCard } from '@/types/property/propertyDetail.types';
import {
  mapPropertyDetailDtoToViewModel,
  mapSimilarListingToCard,
} from '@/utils/property/mapPropertyDetailViewModel';

export type PropertyDetailPageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      property: PropertyDetailViewModel;
      similar: SimilarPropertyCard[];
      isSaved: boolean;
    };

export function usePropertyDetailPage(accessToken: string | null) {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<PropertyDetailPageState>({ status: 'loading' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      setState({ status: 'loading' });
      try {
        const [detailRes, simRes] = await Promise.all([
          fetchPropertyDetail(id, accessToken),
          fetchSimilarProperties(id),
        ]);
        if (cancelled) return;
        setState({
          status: 'ready',
          property: mapPropertyDetailDtoToViewModel(detailRes.data),
          isSaved: Boolean(detailRes.data.isSaved),
          similar: simRes.data.map(mapSimilarListingToCard),
        });
        setCurrentImageIndex(0);
      } catch (e) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: e instanceof ApiError ? e.message : 'Không tải được tin đăng.',
          });
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

  const toggleSaved = useCallback(async (propertyId: string, currentSaved: boolean) => {
    if (!accessToken) return;
    const prev = currentSaved;
    setState((s) => (s.status === 'ready' ? { ...s, isSaved: !prev } : s));
    try {
      if (!prev) await addSavedProperty(propertyId, accessToken);
      else await removeSavedProperty(propertyId, accessToken);
    } catch (e) {
      setState((s) => (s.status === 'ready' ? { ...s, isSaved: prev } : s));
      alert(e instanceof ApiError ? e.message : 'Không cập nhật được tin yêu thích.');
    }
  }, [accessToken]);

  const imageCount =
    state.status === 'ready' ? state.property.images.length : 0;

  const nextImage = useCallback(() => {
    if (imageCount <= 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const prevImage = useCallback(() => {
    if (imageCount <= 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  return {
    id,
    state,
    currentImageIndex,
    setCurrentImageIndex,
    nextImage,
    prevImage,
    toggleSaved,
  };
}
