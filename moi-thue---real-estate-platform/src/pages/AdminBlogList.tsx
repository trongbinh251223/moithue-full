import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { Pagination } from '@/components/ui/Pagination';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';
import {
  deleteAdminBlogPost,
  fetchAdminBlogPosts,
  type AdminBlogListRow,
} from '@/lib/adminBlogApi';

const PAGE_SIZE = 12;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN');
}

export default function AdminBlogList() {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminBlogListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken) {
      setRows([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchAdminBlogPosts(page, accessToken, PAGE_SIZE);
      setRows(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setRows([]);
      setTotal(0);
      toast.error(e instanceof ApiError ? e.message : 'Không tải được danh sách blog.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onDelete = async (id: string, title: string) => {
    if (!accessToken || !confirm(`Xóa bài "${title}"?`)) return;
    try {
      await deleteAdminBlogPost(id, accessToken);
      toast.success('Đã xóa bài viết.');
      await load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Xóa thất bại.');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">
          Vui lòng{' '}
          <Link to={ROUTES.login} className="font-bold text-primary">
            đăng nhập
          </Link>{' '}
          để quản lý blog.
        </p>
      </PageShell>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">Chỉ quản trị viên mới truy cập được trang này.</p>
        <Link to={ROUTES.search} className="block text-center mt-4 font-bold text-primary">
          Về trang chủ
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Quản lý blog</h1>
            <Link
              to={ROUTES.adminBlogNew}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Thêm bài viết
            </Link>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-6">
              {loading ? (
                <p className="text-center text-on-surface-variant py-12">Đang tải…</p>
              ) : rows.length === 0 ? (
                <p className="text-center text-on-surface-variant py-12">Chưa có bài viết nào.</p>
              ) : (
                <ul className="space-y-4">
                  {rows.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-outline-variant/40 rounded-2xl hover:bg-surface-container-lowest transition-colors"
                    >
                      <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-variant">
                        {row.coverImage ? (
                          <img
                            src={row.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                            {row.category}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              row.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {row.isPublished ? 'Đã đăng' : 'Nháp'}
                          </span>
                        </div>
                        <h2 className="font-bold text-on-surface line-clamp-2">{row.title}</h2>
                        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{row.excerpt}</p>
                        <p className="text-xs text-on-surface-variant mt-2">
                          {row.authorName} · {formatDate(row.updatedAt)}
                        </p>
                      </div>
                      <div className="flex sm:flex-col gap-2 justify-end sm:justify-center flex-shrink-0">
                        <Link
                          to={ROUTES.adminBlogEdit(row.id)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-container-low"
                          aria-label="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void onDelete(row.id, row.title)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          aria-label="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {!loading && rows.length > 0 ? (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="numbered" />
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
