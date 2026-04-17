import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { Home, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { deleteProperty, fetchMyProperties, type ManageRentalRow } from '@/lib/propertiesApi';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 20;

function formatPostedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN');
}

export default function ManageRentals() {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'rejected'>('active');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ManageRentalRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusParam = activeTab;

  const load = useCallback(async () => {
    if (!accessToken) {
      setRows([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyProperties(statusParam, page, accessToken, PAGE_SIZE);
      setRows(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Không tải được danh sách.');
      setRows([]);
      setTotal(0);
      toast.error(e instanceof ApiError ? e.message : 'Không tải được danh sách.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusParam, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onDelete = async (id: string) => {
    if (!accessToken || !confirm('Xóa tin đăng này?')) return;
    try {
      await deleteProperty(id, accessToken);
      toast.success('Đã xóa tin.');
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Xóa thất bại.');
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  if (!isAuthenticated) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">
          Vui lòng{' '}
          <Link to={ROUTES.login} className="font-bold text-primary">
            đăng nhập
          </Link>{' '}
          để quản lý tin đăng.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Quản lý thuê nhà</h1>
            <div className="flex flex-wrap gap-2">
              {user?.role === 'admin' ? (
                <>
                  <Link
                    to={ROUTES.adminPostProperty}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity text-center"
                  >
                    Đăng tin mới
                  </Link>
                  <Link
                    to={ROUTES.adminBlog}
                    className="border border-primary text-primary px-6 py-2.5 rounded-xl font-medium hover:bg-primary/5 transition-colors text-center"
                  >
                    Quản lý blog
                  </Link>
                  <Link
                    to={ROUTES.adminContact}
                    className="border border-outline-variant/40 text-on-surface px-6 py-2.5 rounded-xl font-medium hover:bg-surface-container-low transition-colors text-center"
                  >
                    Trang liên hệ
                  </Link>
                </>
              ) : null}
              <Link
                to={ROUTES.search}
                className="border border-outline-variant/40 text-on-surface px-6 py-2.5 rounded-xl font-medium hover:bg-surface-container-low transition-colors text-center"
              >
                Xem tin công khai
              </Link>
            </div>
          </div>

          {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-outline-variant/20 custom-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-bold transition-colors cursor-pointer ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Tin đang đăng{activeTab === 'active' ? ` (${total})` : ''}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-bold transition-colors cursor-pointer ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Chờ duyệt{activeTab === 'pending' ? ` (${total})` : ''}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rejected')}
                className={`flex-1 py-4 px-4 whitespace-nowrap text-center font-bold transition-colors cursor-pointer ${activeTab === 'rejected' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Đã ẩn/Từ chối{activeTab === 'rejected' ? ` (${total})` : ''}
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <p className="text-center text-on-surface-variant py-12">Đang tải…</p>
              ) : (
                <div className="space-y-4">
                  {rows.length > 0 ? (
                    rows.map((rental) => (
                      <div
                        key={rental.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-outline-variant/40 rounded-2xl hover:bg-surface-container-lowest transition-colors"
                      >
                        <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={rental.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                            alt={rental.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <Link
                                to={ROUTES.propertyDetail(rental.id)}
                                className="font-bold text-lg text-on-surface line-clamp-2 hover:text-primary"
                              >
                                {rental.title}
                              </Link>
                              {rental.status === 'active' && (
                                <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                                  <CheckCircle2 className="w-4 h-4" /> Đang hiển thị
                                </span>
                              )}
                              {(rental.status === 'pending' || rental.status === 'draft') && (
                                <span className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full whitespace-nowrap">
                                  <Clock className="w-4 h-4" /> Chờ duyệt
                                </span>
                              )}
                              {rental.status === 'rejected' && (
                                <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full whitespace-nowrap">
                                  <XCircle className="w-4 h-4" /> Từ chối
                                </span>
                              )}
                            </div>
                            <div className="text-[#e03c31] font-bold text-lg mb-2">{rental.priceDisplay}</div>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/20">
                            <span className="text-sm text-on-surface-variant">
                              Cập nhật: {formatPostedDate(rental.createdAt)}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={ROUTES.propertyDetail(rental.id)}
                                className="px-4 py-1.5 text-sm font-medium text-on-surface border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors"
                              >
                                Xem
                              </Link>
                              <button
                                type="button"
                                onClick={() => onDelete(rental.id)}
                                className="px-4 py-1.5 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Home className="w-12 h-12 mx-auto text-on-surface-variant mb-3" />
                      <p className="text-on-surface-variant">Không có tin đăng nào trong mục này.</p>
                    </div>
                  )}
                </div>
              )}
              {!loading && rows.length > 0 ? (
                <div className="mt-8 pb-2">
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="numbered" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
