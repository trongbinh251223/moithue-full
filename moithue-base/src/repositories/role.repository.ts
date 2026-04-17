import { eq } from 'drizzle-orm';
import { roles } from '../db/schema';
import type { Db } from '../types/app';
import type { Role } from '../db/schema';

export class RoleRepository {
  constructor(private readonly db: Db) {}

  async findBySlug(slug: string): Promise<Role | undefined> {
    return this.db.query.roles.findFirst({
      where: eq(roles.slug, slug),
    });
  }

  async findById(id: string): Promise<Role | undefined> {
    return this.db.query.roles.findFirst({
      where: eq(roles.id, id),
    });
  }

  async listAll(): Promise<Role[]> {
    return this.db.select().from(roles).all();
  }
}
