import { count, desc, eq } from 'drizzle-orm';
import { contactSubmissions, siteSettings } from '../db/schema';
import type { Db } from '../types/app';

const CONTACT_PAGE_KEY = 'contact_page';

export class ContactRepository {
  constructor(private readonly db: Db) {}

  async getSetting(key: string): Promise<string | undefined> {
    const r = await this.db.select().from(siteSettings).where(eq(siteSettings.key, key)).get();
    return r?.value;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .insert(siteSettings)
      .values({ key, value, updatedAt: now })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: now },
      });
  }

  getContactPageKey(): string {
    return CONTACT_PAGE_KEY;
  }

  async insertSubmission(row: typeof contactSubmissions.$inferInsert) {
    const [r] = await this.db.insert(contactSubmissions).values(row).returning();
    if (!r) throw new Error('contact submission insert failed');
    return r;
  }

  async listSubmissions(limit: number, offset: number) {
    const [rows, totalRow] = await Promise.all([
      this.db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(limit)
        .offset(offset)
        .all(),
      this.db.select({ n: count() }).from(contactSubmissions).get(),
    ]);
    return { rows, total: Number(totalRow?.n ?? 0) };
  }

  async deleteSubmission(id: string): Promise<boolean> {
    const r = await this.db.delete(contactSubmissions).where(eq(contactSubmissions.id, id)).returning();
    return r.length > 0;
  }
}
