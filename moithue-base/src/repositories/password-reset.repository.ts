import { and, eq, isNull } from 'drizzle-orm';
import { passwordResets } from '../db/schema';
import type { Db } from '../types/app';
import type { PasswordReset } from '../db/schema';

export class PasswordResetRepository {
  constructor(private readonly db: Db) {}

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: string;
  }): Promise<PasswordReset> {
    const [row] = await this.db.insert(passwordResets).values(data).returning();
    if (!row) throw new Error('Password reset insert failed');
    return row;
  }

  /** Invalidate pending tokens for a user before issuing a new one. */
  async markAllPendingUsed(userId: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(passwordResets)
      .set({ usedAt: now })
      .where(
        and(eq(passwordResets.userId, userId), isNull(passwordResets.usedAt)),
      );
  }

  async findValidByTokenHash(hash: string): Promise<PasswordReset | undefined> {
    const row = await this.db.query.passwordResets.findFirst({
      where: and(eq(passwordResets.tokenHash, hash), isNull(passwordResets.usedAt)),
    });
    if (!row) return undefined;
    if (row.expiresAt <= new Date().toISOString()) return undefined;
    return row;
  }

  async markUsedById(id: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(passwordResets)
      .set({ usedAt: now })
      .where(eq(passwordResets.id, id));
  }
}
