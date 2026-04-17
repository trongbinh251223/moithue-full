import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { fetchBlogPostsPreview, type BlogListItemDto } from '@/lib/blogApi';
import { ApiError } from '@/lib/apiClient';

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchBlogPostsPreview(4);
        if (!cancelled) setPosts(res.data);
      } catch (e) {
        if (!cancelled) {
          setPosts([]);
          toast.error(e instanceof ApiError ? e.message : 'Không tải được bài viết.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight">Chuyện nhà mình</h2>
        <Link
          className="text-primary font-bold hover:text-brand-yellow hover:underline transition-colors cursor-pointer"
          to={ROUTES.blog}
        >
          Xem tất cả bài viết
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl overflow-hidden bg-surface-container-high aspect-[4/3]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link to={ROUTES.blogDetail(post.id)} className="block cursor-pointer">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">
                  {post.category}
                </p>
                <h3 className="font-bold text-lg mb-2 leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-on-surface-variant/60">{post.date}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
