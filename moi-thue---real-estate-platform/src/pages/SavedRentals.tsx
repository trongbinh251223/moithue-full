import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  clearAllSavedProperties,
  fetchSavedProperties,
  mapListingDtoToUi,
  removeSavedProperty,
} from '@/lib/propertiesApi';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';
import type { PropertyListing } from '@/types/property/property.types';
import { MapPin, Image as ImageIcon, Loader2, HeartOff, Trash2 } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 12;

export default function SavedRentals() {
  const { accessToken, isAuthenticated } = useAuth();
  const [items, setItems] = useState<PropertyListing[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSavedProperties(page, accessToken, PAGE_SIZE);
      setItems(res.data.map((row) => ({ ...mapListingDtoToUi(row), isSaved: true })));
      setTotal(res.meta.total);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách.');
      setItems([]);
      setTotal(0);
      toast.error(e instanceof ApiError ? e.message : 'Không tải được danh sách.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onRemoveOne = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!accessToken) return;
    try {
      await removeSavedProperty(id, accessToken);
      toast.success('Đã bỏ lưu tin.');
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Không xóa được.');
    }
  };

  const onClearAll = async () => {
    if (!accessToken || items.length === 0) return;
    if (!confirm('Xóa tất cả tin đã lưu?')) return;
    try {
      await clearAllSavedProperties(accessToken);
      toast.success('Đã xóa toàn bộ tin đã lưu.');
      setPage(1);
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Không xóa hết được.');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">
          Vui lòng{' '}
          <Link to={ROUTES.login} className="font-bold text-primary">
            đăng nhập
          </Link>{' '}
          để xem tin đã lưu.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Tin đã lưu</h1>
            {!loading && items.length > 0 ? (
              <button
                type="button"
                onClick={() => void onClearAll()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                title="Xóa tất cả tin đã lưu"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-outline-variant/20 bg-white p-8 text-center text-on-surface-variant">{error}</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 text-center">
              <p className="text-on-surface-variant">Bạn chưa lưu tin đăng nào.</p>
              <Link to={ROUTES.search} className="mt-4 inline-block font-bold text-primary hover:underline">
                Tìm kiếm cho thuê
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {items.map((property) => (
                  <li key={property.id}>
                    <div className="relative rounded-2xl border border-outline-variant/20 bg-white shadow-sm hover:border-primary/40 transition-colors">
                      <Link
                        to={ROUTES.propertyDetail(property.id)}
                        className="flex flex-col sm:flex-row gap-4 p-4 pr-14 sm:pr-16"
                      >
                        <div className="relative w-full sm:w-48 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low">
                          {property.image ? (
                            <img src={property.image} alt="" className="w-full h-full object-cover" />
                          ) : null}
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                            {property.imageCount} <ImageIcon className="w-3 h-3" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-on-surface line-clamp-2 mb-1">{property.title}</h2>
                          <p className="text-sm text-on-surface-variant mb-2">
                            {property.bedrooms} PN · {property.bathrooms} WC · {property.type}
                          </p>
                          <p className="text-xl font-bold text-[#e03c31] mb-2">{property.priceDisplay}</p>
                          <p className="flex items-center gap-1 text-sm text-on-surface-variant truncate">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {property.location}
                          </p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => void onRemoveOne(e, property.id)}
                        className="absolute top-3 right-3 p-2 rounded-full border border-outline-variant/30 bg-white text-on-surface-variant hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Bỏ lưu"
                      >
                        <HeartOff className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="numbered" />
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
