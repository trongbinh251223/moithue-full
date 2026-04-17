import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import {
  BlogDetailArticleSection,
  BlogDetailBackNavSection,
  BlogDetailCommentsSection,
} from '@/sections/blog-detail';
import { fetchBlogPost } from '@/lib/blogApi';
import type { BlogPostDetailDto } from '@/lib/blogApi';
import { ApiError } from '@/lib/apiClient';
import { ROUTES } from '@/constants/routes';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchBlogPost(id);
        if (!cancelled) setPost(res.data);
      } catch (e) {
        if (!cancelled) {
          setPost(null);
          setError(e instanceof ApiError ? e.message : 'Không tải được bài viết.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-3xl w-full mx-auto px-4 sm:px-8">
      <BlogDetailBackNavSection />
      {loading ? (
        <p className="text-center text-on-surface-variant py-12">Đang tải bài viết…</p>
      ) : error || !post ? (
        <div className="rounded-2xl border border-outline-variant/30 bg-white p-8 text-center">
          <p className="text-on-surface-variant mb-4">{error ?? 'Không có bài viết.'}</p>
          <Link to={ROUTES.blog} className="font-bold text-primary hover:underline">
            Về danh sách blog
          </Link>
        </div>
      ) : (
        <>
          <BlogDetailArticleSection post={post} />
          {id ? <BlogDetailCommentsSection postId={id} /> : null}
        </>
      )}
    </PageShell>
  );
}
