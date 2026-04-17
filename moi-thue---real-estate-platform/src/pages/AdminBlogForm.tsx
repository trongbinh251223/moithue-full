import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';
import {
  createAdminBlogPost,
  fetchAdminBlogPost,
  updateAdminBlogPost,
} from '@/lib/adminBlogApi';

function isNewPath(pathname: string): boolean {
  return pathname === ROUTES.adminBlogNew || pathname.endsWith('/admin/blog/new');
}

function editIdFromPath(pathname: string): string | null {
  const m = pathname.match(/\/admin\/blog\/([^/]+)\/edit$/);
  return m?.[1] ?? null;
}

export default function AdminBlogForm() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { accessToken, isAuthenticated, user } = useAuth();
  const isNew = isNewPath(pathname);
  const editId = isNew ? null : editIdFromPath(pathname);

  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tin tức');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew || !editId || !accessToken) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminBlogPost(editId, accessToken);
        if (cancelled) return;
        const d = res.data;
        setTitle(d.title);
        setCategory(d.category || 'Tin tức');
        setSlug(d.slug || '');
        setCoverImage(d.coverImage || '');
        setExcerpt(d.excerpt || '');
        setContent(d.content);
        setIsPublished(d.isPublished);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof ApiError ? e.message : 'Không tải được bài viết.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [isNew, editId, accessToken]);

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

  if (!isNew && !editId) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-on-surface-variant">Đường dẫn không hợp lệ.</p>
        <Link to={ROUTES.adminBlog} className="text-primary font-bold mt-4 inline-block">
          Về danh sách blog
        </Link>
      </PageShell>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || null,
        coverImage: coverImage.trim() || null,
        category: category.trim() || null,
        slug: slug.trim() || null,
        isPublished,
      };
      if (isNew) {
        const res = await createAdminBlogPost(payload, accessToken);
        toast.success('Đã tạo bài viết.');
        navigate(ROUTES.adminBlogEdit(res.data.id), { replace: true });
      } else if (editId) {
        await updateAdminBlogPost(editId, payload, accessToken);
        toast.success('Đã cập nhật bài viết.');
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">{isNew ? 'Thêm bài blog' : 'Sửa bài blog'}</h1>
            <Link to={ROUTES.adminBlog} className="text-sm font-medium text-primary hover:underline">
              ← Danh sách
            </Link>
          </div>

          {loading ? (
            <p className="text-on-surface-variant">Đang tải…</p>
          ) : (
            <form onSubmit={(ev) => void onSubmit(ev)} className="bg-white rounded-[32px] border border-outline-variant/20 p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-title">
                  Tiêu đề
                </label>
                <input
                  id="ab-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                  maxLength={256}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-cat">
                    Danh mục
                  </label>
                  <input
                    id="ab-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                    maxLength={128}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-slug">
                    Slug (tuỳ chọn)
                  </label>
                  <input
                    id="ab-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                    maxLength={256}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-cover">
                  Ảnh bìa (URL)
                </label>
                <input
                  id="ab-cover"
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-excerpt">
                  Tóm tắt
                </label>
                <textarea
                  id="ab-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-none"
                  maxLength={2000}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ab-content">
                  Nội dung
                </label>
                <textarea
                  id="ab-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-y font-mono text-sm"
                  required
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-outline-variant/40 w-4 h-4 text-primary"
                />
                <span className="text-sm text-on-surface">Đăng công khai</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
