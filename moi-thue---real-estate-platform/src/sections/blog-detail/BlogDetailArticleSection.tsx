import { Calendar, User, Share2 } from 'lucide-react';
import type { BlogPostDetailDto } from '@/lib/blogApi';

interface BlogDetailArticleSectionProps {
  post: BlogPostDetailDto;
}

export default function BlogDetailArticleSection({ post }: BlogDetailArticleSectionProps) {
  return (
    <article className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 overflow-hidden mb-8">
      <div className="h-64 sm:h-96 overflow-hidden">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6 sm:p-10">
        <div className="flex items-center gap-4 mb-6 text-sm text-on-surface-variant flex-wrap">
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" /> {post.authorName}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-on-surface mb-6 leading-tight">{post.title}</h1>

        <div
          className="prose prose-lg max-w-none text-on-surface-variant blog-detail-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
