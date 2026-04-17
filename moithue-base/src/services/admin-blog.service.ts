import { Errors } from '../lib/errors';
import type { Logger } from '../lib/logger';
import { BlogRepository } from '../repositories/blog.repository';
import { posts } from '../db/schema';
import type { Db } from '../types/app';

export function createAdminBlogService(db: Db, log: Logger) {
  const repo = new BlogRepository(db);

  return {
    async getOne(id: string) {
      const p = await repo.findByIdWithAuthorForAdmin(id);
      if (!p) throw Errors.notFound('Post');
      return {
        id: p.id,
        title: p.title,
        content: p.content,
        excerpt: p.excerpt ?? '',
        coverImage: p.coverImage ?? '',
        category: p.category ?? '',
        slug: p.slug ?? '',
        isPublished: p.isPublished,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        authorName: p.authorName,
      };
    },

    async list(page: number, limit: number) {
      const offset = (page - 1) * limit;
      const { rows, total } = await repo.listAllForAdmin(limit, offset);
      return {
        data: rows.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category ?? 'Tin tức',
          isPublished: p.isPublished,
          coverImage: p.coverImage ?? '',
          excerpt: p.excerpt ?? '',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          authorName: p.authorName,
        })),
        meta: { page, limit, total, offset },
      };
    },

    async create(
      actorId: string,
      body: {
        title: string;
        content: string;
        excerpt?: string | null;
        coverImage?: string | null;
        category?: string | null;
        slug?: string | null;
        isPublished?: boolean;
      },
    ) {
      const row = await repo.insertPost({
        userId: actorId,
        title: body.title.trim(),
        content: body.content,
        excerpt: body.excerpt?.trim() || null,
        coverImage: body.coverImage?.trim() || null,
        category: body.category?.trim() || null,
        slug: body.slug?.trim() || null,
        isPublished: body.isPublished ?? true,
      });
      log.info('blog.post.created', { postId: row.id, userId: actorId });
      return row;
    },

    async update(
      id: string,
      body: Partial<{
        title: string;
        content: string;
        excerpt: string | null;
        coverImage: string | null;
        category: string | null;
        slug: string | null;
        isPublished: boolean;
      }>,
    ) {
      const cur = await repo.findByIdRaw(id);
      if (!cur) throw Errors.notFound('Post');
      if (Object.keys(body).length === 0) return cur;
      const patch: Partial<typeof posts.$inferInsert> = {};
      if (body.title !== undefined) patch.title = body.title.trim();
      if (body.content !== undefined) patch.content = body.content;
      if (body.excerpt !== undefined) patch.excerpt = body.excerpt?.trim() || null;
      if (body.coverImage !== undefined) patch.coverImage = body.coverImage?.trim() || null;
      if (body.category !== undefined) patch.category = body.category?.trim() || null;
      if (body.slug !== undefined) patch.slug = body.slug?.trim() || null;
      if (body.isPublished !== undefined) patch.isPublished = body.isPublished;
      const row = await repo.updatePost(id, patch);
      if (!row) throw Errors.notFound('Post');
      log.info('blog.post.updated', { postId: id });
      return row;
    },

    async remove(id: string) {
      const ok = await repo.deletePost(id);
      if (!ok) throw Errors.notFound('Post');
      log.info('blog.post.deleted', { postId: id });
    },
  };
}
