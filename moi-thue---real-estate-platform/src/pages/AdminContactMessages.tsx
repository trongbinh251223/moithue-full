import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { Pagination } from '@/components/ui/Pagination';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';
import {
  deleteAdminContactSubmission,
  fetchAdminContactSubmissions,
  type ContactSubmissionDto,
} from '@/lib/contactApi';

const PAGE_SIZE = 20;

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN');
}

export default function AdminContactMessages() {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ContactSubmissionDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.contact}` : ROUTES.contact;

  const load = useCallback(async () => {
    if (!accessToken) {
      setRows([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchAdminContactSubmissions(page, accessToken, PAGE_SIZE);
      setRows(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setRows([]);
      setTotal(0);
      toast.error(e instanceof ApiError ? e.message : 'Không tải được tin nhắn.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onDelete = async (id: string) => {
    if (!accessToken || !confirm('Xóa tin nhắn này?')) return;
    try {
      await deleteAdminContactSubmission(id, accessToken);
      toast.success('Đã xóa.');
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
          </Link>
          .
        </p>
      </PageShell>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">Chỉ quản trị viên mới truy cập được trang này.</p>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Tin nhắn liên hệ</h1>
            <Link to={ROUTES.adminContact} className="text-sm font-medium text-primary hover:underline">
              ← Chỉnh sửa nội dung trang liên hệ
            </Link>
          </div>

          <p className="text-sm text-on-surface-variant mb-6 break-all">
            Form công khai: <span className="text-on-surface font-medium">{publicUrl}</span>
          </p>

          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-6 overflow-x-auto">
              {loading ? (
                <p className="text-center text-on-surface-variant py-12">Đang tải…</p>
              ) : rows.length === 0 ? (
                <p className="text-center text-on-surface-variant py-12">Chưa có tin nhắn nào.</p>
              ) : (
                <table className="w-full text-left text-sm border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-on-surface-variant">
                      <th className="py-3 pr-4 font-medium">Thời gian</th>
                      <th className="py-3 pr-4 font-medium">Người gửi</th>
                      <th className="py-3 pr-4 font-medium">Liên hệ</th>
                      <th className="py-3 pr-4 font-medium">Chủ đề</th>
                      <th className="py-3 pr-4 font-medium">Nội dung</th>
                      <th className="py-3 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-outline-variant/10 align-top">
                        <td className="py-3 pr-4 text-on-surface-variant whitespace-nowrap">{formatWhen(r.createdAt)}</td>
                        <td className="py-3 pr-4 font-medium text-on-surface">{r.name}</td>
                        <td className="py-3 pr-4 text-on-surface-variant">
                          <div>{r.phone}</div>
                          <div className="break-all">{r.email}</div>
                        </td>
                        <td className="py-3 pr-4 text-on-surface">{r.topic}</td>
                        <td className="py-3 pr-4 text-on-surface max-w-xs">
                          <p className="whitespace-pre-wrap break-words">{r.message}</p>
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => void onDelete(r.id)}
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            aria-label="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
