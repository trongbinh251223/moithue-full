import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { comments, posts, properties, roles, users } from '../db/schema';
import type { Db } from '../types/app';
import type { NewUser, User } from '../db/schema';

export type UserWithRole = User & { role: { slug: string; name: string } | null };

function mapJoined(
  u: typeof users.$inferSelect,
  r: typeof roles.$inferSelect | null | undefined,
): UserWithRole {
  return {
    ...u,
    role: r ? { slug: r.slug, name: r.name } : null,
  };
}

export class UserRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<UserWithRole | undefined> {
    const rows = await this.db
      .select({ u: users, r: roles })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, id))
      .all();
    const x = rows[0];
    if (!x) return undefined;
    return mapJoined(x.u, x.r);
  }

  async findByEmail(email: string): Promise<UserWithRole | undefined> {
    const rows = await this.db
      .select({ u: users, r: roles })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email))
      .all();
    const x = rows[0];
    if (!x) return undefined;
    return mapJoined(x.u, x.r);
  }

  async listPaged(limit: number, offset: number): Promise<UserWithRole[]> {
    const rows = await this.db
      .select({ u: users, r: roles })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)
      .all();
    return rows.map((x) => mapJoined(x.u, x.r));
  }

  async count(): Promise<number> {
    const r = await this.db
      .select({ n: sql<number>`count(*)` })
      .from(users)
      .get();
    return Number(r?.n ?? 0);
  }

  async create(values: NewUser): Promise<UserWithRole> {
    const [row] = await this.db.insert(users).values(values).returning();
    if (!row) throw new Error('User insert failed');
    const full = await this.findById(row.id);
    if (!full) throw new Error('User load after insert failed');
    return full;
  }

  async update(
    id: string,
    patch: Partial<
      Pick<User, 'email' | 'name' | 'phone' | 'avatar' | 'address' | 'passwordHash' | 'roleId' | 'updatedAt'>
    >,
  ): Promise<UserWithRole | undefined> {
    await this.db
      .update(users)
      .set({ ...patch, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    await this.db.delete(properties).where(eq(properties.userId, id));
    const userPostRows = await this.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.userId, id))
      .all();
    for (const row of userPostRows) {
      await this.db.delete(comments).where(eq(comments.postId, row.id));
    }
    await this.db.delete(comments).where(eq(comments.userId, id));
    await this.db.delete(posts).where(eq(posts.userId, id));
    const result = await this.db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async emailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    if (excludeUserId) {
      const row = await this.db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.email, email), ne(users.id, excludeUserId)))
        .get();
      return Boolean(row);
    }
    const row = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .get();
    return Boolean(row);
  }
}
