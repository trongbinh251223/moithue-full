import { and, eq, isNull } from 'drizzle-orm';
import { sessions } from '../db/schema';
import type { Db } from '../types/app';
import type { Session } from '../db/schema';

export class SessionRepository {
  constructor(private readonly db: Db) {}

  async create(data: {
    userId: string;
    refreshTokenHash: string;
    expiresAt: string;
  }): Promise<Session> {
    const [row] = await this.db.insert(sessions).values(data).returning();
    if (!row) throw new Error('Session insert failed');
    return row;
  }

  async findActiveByRefreshHash(hash: string): Promise<Session | undefined> {
    const row = await this.db.query.sessions.findFirst({
      where: and(eq(sessions.refreshTokenHash, hash), isNull(sessions.revokedAt)),
    });
    if (!row) return undefined;
    if (row.expiresAt <= new Date().toISOString()) return undefined;
    return row;
  }

  async revokeById(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(sessions)
      .set({ revokedAt: now })
      .where(eq(sessions.id, id));
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(sessions)
      .set({ revokedAt: now })
      .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
  }
}
