import { and, asc, count, desc, eq, gte, inArray, like, lte, ne, or } from 'drizzle-orm';
import { properties, users } from '../db/schema';
import type { Db } from '../types/app';
import type { Property } from '../db/schema';

export type PropertyWithOwner = Property & {
  ownerName: string;
  ownerListingCount: number;
};

export type PropertySearchFilters = {
  /** Từ khóa: khớp một phần tiêu đề, địa chỉ, mô tả, dự án */
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  project?: string;
  /** Exact bedroom count when minBedrooms unset. */
  bedrooms?: number;
  /** e.g. 5 for "5+". */
  minBedrooms?: number;
  /** Exact bathroom count when minBathrooms unset. */
  bathrooms?: number;
  /** e.g. 4 for "4+". */
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  propertyType?: string;
};

function parseImages(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export { parseImages };

export class PropertyRepository {
  constructor(private readonly db: Db) {}

  async countActiveByUserId(userId: string): Promise<number> {
    const r = await this.db
      .select({ n: count() })
      .from(properties)
      .where(and(eq(properties.userId, userId), eq(properties.status, 'active')))
      .get();
    return Number(r?.n ?? 0);
  }

  async enrichWithOwner(row: Property): Promise<PropertyWithOwner> {
    const owner = await this.db.query.users.findFirst({
      where: eq(users.id, row.userId),
      columns: { name: true },
    });
    const ownerListingCount = await this.countActiveByUserId(row.userId);
    return {
      ...row,
      ownerName: owner?.name ?? '—',
      ownerListingCount,
    };
  }

  async findById(id: string): Promise<Property | undefined> {
    return this.db.query.properties.findFirst({ where: eq(properties.id, id) });
  }

  async findByIdWithOwner(id: string): Promise<PropertyWithOwner | undefined> {
    const row = await this.findById(id);
    if (!row) return undefined;
    return this.enrichWithOwner(row);
  }

  private buildPublicFilterConditions(filters: PropertySearchFilters) {
    const conds = [eq(properties.status, 'active')];
    const kw = filters.q?.trim();
    if (kw) {
      const t = `%${kw.replace(/%/g, '\\%')}%`;
      conds.push(
        or(
          like(properties.title, t),
          like(properties.location, t),
          like(properties.locationExtra, t),
          like(properties.description, t),
          like(properties.project, t),
        )!,
      );
    }
    if (filters.minPrice !== undefined) conds.push(gte(properties.priceValue, filters.minPrice));
    if (filters.maxPrice !== undefined) conds.push(lte(properties.priceValue, filters.maxPrice));
    if (filters.project?.trim()) {
      conds.push(like(properties.project, `%${filters.project.trim().replace(/%/g, '\\%')}%`));
    }
    if (filters.minBedrooms !== undefined) {
      conds.push(gte(properties.bedrooms, filters.minBedrooms));
    } else if (filters.bedrooms !== undefined) {
      conds.push(eq(properties.bedrooms, filters.bedrooms));
    }
    if (filters.minBathrooms !== undefined) {
      conds.push(gte(properties.bathrooms, filters.minBathrooms));
    } else if (filters.bathrooms !== undefined) {
      conds.push(eq(properties.bathrooms, filters.bathrooms));
    }
    if (filters.minArea !== undefined) conds.push(gte(properties.areaValue, filters.minArea));
    if (filters.maxArea !== undefined) conds.push(lte(properties.areaValue, filters.maxArea));
    if (filters.propertyType?.trim()) {
      conds.push(eq(properties.propertyType, filters.propertyType.trim()));
    }
    return and(...conds)!;
  }

  async searchPublic(
    filters: PropertySearchFilters,
    sort: 'new' | 'price_asc' | 'price_desc',
    limit: number,
    offset: number,
  ): Promise<{ rows: PropertyWithOwner[]; total: number }> {
    const whereClause = this.buildPublicFilterConditions(filters);

    const order =
      sort === 'price_asc'
        ? asc(properties.priceValue)
        : sort === 'price_desc'
          ? desc(properties.priceValue)
          : desc(properties.createdAt);

    const [rows, totalRow] = await Promise.all([
      this.db
        .select()
        .from(properties)
        .where(whereClause)
        .orderBy(order)
        .limit(limit)
        .offset(offset)
        .all(),
      this.db.select({ n: count() }).from(properties).where(whereClause).get(),
    ]);

    const enriched = await Promise.all(rows.map((r) => this.enrichWithOwner(r)));
    return { rows: enriched, total: Number(totalRow?.n ?? 0) };
  }

  async listForOwner(
    userId: string,
    statusIn: string[] | undefined,
    limit: number,
    offset: number,
  ): Promise<{ rows: PropertyWithOwner[]; total: number }> {
    const conds = [eq(properties.userId, userId)];
    if (statusIn?.length) conds.push(inArray(properties.status, statusIn));
    const whereClause = and(...conds)!;

    const [rows, totalRow] = await Promise.all([
      this.db
        .select()
        .from(properties)
        .where(whereClause)
        .orderBy(desc(properties.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      this.db.select({ n: count() }).from(properties).where(whereClause).get(),
    ]);
    const enriched = await Promise.all(rows.map((r) => this.enrichWithOwner(r)));
    return { rows: enriched, total: Number(totalRow?.n ?? 0) };
  }

  async findSimilar(excludeId: string, propertyType: string, limit: number): Promise<PropertyWithOwner[]> {
    const rows = await this.db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.status, 'active'),
          eq(properties.propertyType, propertyType),
          ne(properties.id, excludeId),
        ),
      )
      .orderBy(desc(properties.createdAt))
      .limit(limit)
      .all();
    return Promise.all(rows.map((r) => this.enrichWithOwner(r)));
  }

  async create(values: typeof properties.$inferInsert): Promise<Property> {
    const [row] = await this.db.insert(properties).values(values).returning();
    if (!row) throw new Error('Property insert failed');
    return row;
  }

  async update(id: string, patch: Partial<typeof properties.$inferInsert>): Promise<Property | undefined> {
    await this.db
      .update(properties)
      .set({ ...patch, updatedAt: new Date().toISOString() })
      .where(eq(properties.id, id));
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const r = await this.db.delete(properties).where(eq(properties.id, id)).returning();
    return r.length > 0;
  }
}
