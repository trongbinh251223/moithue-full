import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { BlogListItem } from '@/types/blog/blogListing.types';

interface BlogPostGridSectionProps {
  posts: BlogListItem[];
}

export default function BlogPostGridSection({ posts }: BlogPostGridSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {posts.map((blog) => (
        <Link
          key={blog.id}
          to={ROUTES.blogDetail(blog.id)}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow group"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={blog.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {blog.category}
              </span>
              <span className="text-xs text-on-surface-variant">{blog.date}</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            <p className="text-on-surface-variant text-sm line-clamp-3">{blog.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
