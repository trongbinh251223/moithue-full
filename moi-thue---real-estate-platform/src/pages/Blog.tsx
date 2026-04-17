import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import { Pagination } from '@/components/ui/Pagination';
import {
  BlogListToolbarSection,
  BlogPageIntroSection,
  BlogPostGridSection,
} from '@/sections/blog';
import { fetchBlogPosts } from '@/lib/blogApi';
import { ApiError } from '@/lib/apiClient';
import type { BlogListItem } from '@/types/blog/blogListing.types';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const categoryParam = activeCategory === 'Tất cả' ? undefined : activeCategory;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetchBlogPosts(categoryParam, page);
        if (cancelled) return;
        setPosts(
          res.data.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            date: p.date,
            image: p.image,
            excerpt: p.excerpt,
          })),
        );
        setTotal(res.meta.total);
      } catch (e) {
        if (!cancelled) {
          setPosts([]);
          setTotal(0);
          toast.error(e instanceof ApiError ? e.message : 'Không tải được bài viết.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [categoryParam, page]);

  const filteredBlogs = useMemo(() => posts, [posts]);

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
      <BlogPageIntroSection />
      <BlogListToolbarSection
        activeCategory={activeCategory}
        onCategoryChange={(c) => {
          setActiveCategory(c);
          setPage(1);
        }}
      />
      {loading ? (
        <p className="text-center text-on-surface-variant py-16">Đang tải bài viết…</p>
      ) : (
        <BlogPostGridSection posts={filteredBlogs} />
      )}
      {!loading ? (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} variant="numbered" />
        </div>
      ) : null}
    </PageShell>
  );
}
