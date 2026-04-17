import { Errors } from '../lib/errors';
import type { Logger } from '../lib/logger';
import { BlogRepository } from '../repositories/blog.repository';
import type { Db } from '../types/app';

function formatDateVi(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function createBlogService(db: Db, _log: Logger) {
  const repo = new BlogRepository(db);

  return {
    async listPosts(category: string | undefined, page: number, limit: number) {
      const offset = (page - 1) * limit;
      const { rows, total } = await repo.listPublished(category, limit, offset);
      return {
        data: rows.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category ?? 'Tin tức',
          date: formatDateVi(p.createdAt),
          image: p.coverImage ?? '',
          excerpt: p.excerpt ?? p.content.slice(0, 220),
          createdAt: p.createdAt,
        })),
        meta: { page, limit, total, offset },
      };
    },

    async getPost(id: string) {
      const p = await repo.findByIdForPublic(id);
      if (!p) throw Errors.notFound('Post');
      return {
        id: p.id,
        title: p.title,
        category: p.category ?? 'Tin tức',
        date: formatDateVi(p.createdAt),
        coverImage: p.coverImage ?? '',
        excerpt: p.excerpt ?? '',
        content: p.content,
        authorName: p.authorName,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    },

    async listComments(postId: string, page: number, limit: number) {
      const post = await repo.findByIdRaw(postId);
      if (!post || !post.isPublished) throw Errors.notFound('Post');
      const offset = (page - 1) * limit;
      const [rows, total] = await Promise.all([
        repo.listComments(postId, limit, offset),
        repo.countComments(postId),
      ]);
      return {
        data: rows.map((c) => ({
          id: c.id,
          content: c.content,
          authorName: c.authorName,
          createdAt: c.createdAt,
          date: formatDateVi(c.createdAt),
        })),
        meta: { page, limit, total, offset },
      };
    },

    async addComment(postId: string, userId: string, content: string) {
      const post = await repo.findByIdRaw(postId);
      if (!post || !post.isPublished) throw Errors.notFound('Post');
      const row = await repo.createComment({ userId, postId, content });
      return {
        id: row.id,
        content: row.content,
        authorName: row.authorName,
        createdAt: row.createdAt,
        date: formatDateVi(row.createdAt),
      };
    },
  };
}
