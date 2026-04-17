import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { properties, savedProperties } from '../db/schema';
import type { Property } from '../db/schema';
import type { Db } from '../types/app';

export class SavedPropertyRepository {
  constructor(private readonly db: Db) {}

  async exists(userId: string, propertyId: string): Promise<boolean> {
    const r = await this.db
      .select({ one: savedProperties.userId })
      .from(savedProperties)
      .where(and(eq(savedProperties.userId, userId), eq(savedProperties.propertyId, propertyId)))
      .get();
    return Boolean(r);
  }

  async findPropertyIdsSavedByUser(userId: string, propertyIds: string[]): Promise<Set<string>> {
    if (!propertyIds.length) return new Set();
    const rows = await this.db
      .select({ propertyId: savedProperties.propertyId })
      .from(savedProperties)
      .where(and(eq(savedProperties.userId, userId), inArray(savedProperties.propertyId, propertyIds)))
      .all();
    return new Set(rows.map((x) => x.propertyId));
  }

  async insertIgnore(userId: string, propertyId: string): Promise<void> {
    await this.db.insert(savedProperties).values({ userId, propertyId }).onConflictDoNothing();
  }

  async delete(userId: string, propertyId: string): Promise<boolean> {
    const r = await this.db
      .delete(savedProperties)
      .where(and(eq(savedProperties.userId, userId), eq(savedProperties.propertyId, propertyId)))
      .returning();
    return r.length > 0;
  }

  async deleteAllForUser(userId: string): Promise<number> {
    const r = await this.db.delete(savedProperties).where(eq(savedProperties.userId, userId)).returning();
    return r.length;
  }

  async listPropertiesForUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<{ rows: Property[]; total: number }> {
    const where = eq(savedProperties.userId, userId);
    const [joined, totalRow] = await Promise.all([
      this.db
        .select({ p: properties })
        .from(savedProperties)
        .innerJoin(properties, eq(properties.id, savedProperties.propertyId))
        .where(where)
        .orderBy(desc(savedProperties.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      this.db.select({ n: count() }).from(savedProperties).where(where).get(),
    ]);
    return { rows: joined.map((j) => j.p), total: Number(totalRow?.n ?? 0) };
  }
}
