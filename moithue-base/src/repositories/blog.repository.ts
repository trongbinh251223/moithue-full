import { and, count, desc, eq } from 'drizzle-orm';
import { comments, posts, users } from '../db/schema';
import type { Db } from '../types/app';
import type { Comment, Post } from '../db/schema';

export type PostWithAuthor = Post & { authorName: string };

export type CommentWithAuthor = Comment & { authorName: string };

export class BlogRepository {
  constructor(private readonly db: Db) {}

  async listPublished(
    category: string | undefined,
    limit: number,
    offset: number,
  ): Promise<{ rows: PostWithAuthor[]; total: number }> {
    const conds = [eq(posts.isPublished, true)];
    if (category?.trim()) conds.push(eq(posts.category, category.trim()));
    const whereClause = and(...conds)!;

    const [rows, totalRow] = await Promise.all([
      this.db
        .select({ p: posts, authorName: users.name })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .where(whereClause)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      this.db
        .select({ n: count() })
        .from(posts)
        .where(whereClause)
        .get(),
    ]);

    const mapped = rows.map((x) => ({ ...x.p, authorName: x.authorName }));
    return { rows: mapped, total: Number(totalRow?.n ?? 0) };
  }

  async findByIdForPublic(id: string): Promise<PostWithAuthor | undefined> {
    const rows = await this.db
      .select({ p: posts, authorName: users.name })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(and(eq(posts.id, id), eq(posts.isPublished, true)))
      .all();
    const x = rows[0];
    if (!x) return undefined;
    return { ...x.p, authorName: x.authorName };
  }

  async findByIdRaw(id: string): Promise<Post | undefined> {
    return this.db.query.posts.findFirst({ where: eq(posts.id, id) });
  }

  async findByIdWithAuthorForAdmin(id: string): Promise<PostWithAuthor | undefined> {
    const rows = await this.db
      .select({ p: posts, authorName: users.name })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id))
      .all();
    const x = rows[0];
    if (!x) return undefined;
    return { ...x.p, authorName: x.authorName };
  }

  async listComments(postId: string, limit: number, offset: number): Promise<CommentWithAuthor[]> {
    const rows = await this.db
      .select({ c: comments, authorName: users.name })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset)
      .all();
    return rows.map((x) => ({ ...x.c, authorName: x.authorName }));
  }

  async countComments(postId: string): Promise<number> {
    const r = await this.db
      .select({ n: count() })
      .from(comments)
      .where(eq(comments.postId, postId))
      .get();
    return Number(r?.n ?? 0);
  }

  async createComment(data: typeof comments.$inferInsert): Promise<CommentWithAuthor> {
    const [row] = await this.db.insert(comments).values(data).returning();
    if (!row) throw new Error('Comment insert failed');
    const u = await this.db.query.users.findFirst({
      where: eq(users.id, row.userId),
      columns: { name: true },
    });
    return { ...row, authorName: u?.name ?? '—' };
  }

  async listAllForAdmin(limit: number, offset: number): Promise<{ rows: PostWithAuthor[]; total: number }> {
    const [rows, totalRow] = await Promise.all([
      this.db
        .select({ p: posts, authorName: users.name })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      this.db.select({ n: count() }).from(posts).get(),
    ]);
    const mapped = rows.map((x) => ({ ...x.p, authorName: x.authorName }));
    return { rows: mapped, total: Number(totalRow?.n ?? 0) };
  }

  async insertPost(values: typeof posts.$inferInsert): Promise<Post> {
    const [row] = await this.db.insert(posts).values(values).returning();
    if (!row) throw new Error('Post insert failed');
    return row;
  }

  async updatePost(id: string, patch: Partial<typeof posts.$inferInsert>): Promise<Post | undefined> {
    await this.db
      .update(posts)
      .set({ ...patch, updatedAt: new Date().toISOString() })
      .where(eq(posts.id, id));
    return this.findByIdRaw(id);
  }

  async deletePost(id: string): Promise<boolean> {
    await this.db.delete(comments).where(eq(comments.postId, id));
    const r = await this.db.delete(posts).where(eq(posts.id, id)).returning();
    return r.length > 0;
  }
}
