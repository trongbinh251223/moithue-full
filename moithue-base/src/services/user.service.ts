import { ROLE_SLUGS } from '../db/constants';
import { Errors } from '../lib/errors';
import { hashPassword, verifyPassword } from '../lib/password';
import type { Logger } from '../lib/logger';
import { PropertyRepository } from '../repositories/property.repository';
import { RoleRepository } from '../repositories/role.repository';
import { SavedPropertyRepository } from '../repositories/saved-property.repository';
import { UserRepository } from '../repositories/user.repository';
import type { Db } from '../types/app';
import { toPropertyListingDto } from './property.dto';
import { toPublicUser, type PublicUser } from './user.dto';

export function createUserService(db: Db, log: Logger) {
  const users = new UserRepository(db);
  const roles = new RoleRepository(db);

  return {
    async list(page: number, limit: number): Promise<{ items: PublicUser[]; total: number }> {
      const offset = (page - 1) * limit;
      const [items, total] = await Promise.all([
        users.listPaged(limit, offset),
        users.count(),
      ]);
      return { items: items.map(toPublicUser), total };
    },

    async getById(id: string, actor: { id: string; roleSlug: string }): Promise<PublicUser> {
      const row = await users.findById(id);
      if (!row) throw Errors.notFound('User');
      if (actor.roleSlug !== ROLE_SLUGS.admin && actor.id !== id) {
        throw Errors.forbidden('You can only read your own profile');
      }
      return toPublicUser(row);
    },

    async getMe(actorId: string): Promise<PublicUser> {
      const row = await users.findById(actorId);
      if (!row) throw Errors.notFound('User');
      return toPublicUser(row);
    },

    async createByAdmin(input: {
      email: string;
      name: string;
      password: string;
      roleSlug: 'user' | 'admin';
    }): Promise<PublicUser> {
      if (await users.findByEmail(input.email)) {
        throw Errors.conflict('Email already in use');
      }
      const role = await roles.findBySlug(input.roleSlug);
      if (!role) throw Errors.badRequest('Unknown role');
      const passwordHash = await hashPassword(input.password);
      const user = await users.create({
        email: input.email,
        name: input.name,
        passwordHash,
        roleId: role.id,
      });
      log.info('user.created_by_admin', { userId: user.id });
      return toPublicUser(user);
    },

    async patchMe(
      actorId: string,
      patch: {
        name?: string;
        email?: string;
        phone?: string | null;
        avatar?: string | null;
        address?: string | null;
      },
    ): Promise<PublicUser> {
      const row = await users.findById(actorId);
      if (!row) throw Errors.notFound('User');
      if (patch.email && (await users.emailTaken(patch.email, actorId))) {
        throw Errors.conflict('Email already in use');
      }
      const avatarNext =
        patch.avatar !== undefined
          ? patch.avatar === '' || patch.avatar === null
            ? null
            : patch.avatar
          : undefined;
      const addressNext =
        patch.address !== undefined
          ? patch.address === '' || patch.address === null
            ? null
            : patch.address
          : undefined;
      const updated = await users.update(actorId, {
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.email !== undefined ? { email: patch.email } : {}),
        ...(patch.phone !== undefined ? { phone: patch.phone ?? null } : {}),
        ...(avatarNext !== undefined ? { avatar: avatarNext } : {}),
        ...(addressNext !== undefined ? { address: addressNext } : {}),
      });
      if (!updated) throw Errors.notFound('User');
      log.info('user.patch_me', { userId: actorId });
      return toPublicUser(updated);
    },

    async changePassword(actorId: string, input: { currentPassword: string; newPassword: string }) {
      const row = await users.findById(actorId);
      if (!row?.passwordHash) {
        throw Errors.badRequest('Account has no password set; use reset password instead');
      }
      const ok = await verifyPassword(input.currentPassword, row.passwordHash);
      if (!ok) throw Errors.unauthorized('Current password is incorrect');
      const passwordHash = await hashPassword(input.newPassword);
      const updated = await users.update(actorId, { passwordHash });
      if (!updated) throw Errors.notFound('User');
      log.info('user.password_changed', { userId: actorId });
      return { ok: true as const };
    },

    async update(
      id: string,
      actor: { id: string; roleSlug: string },
      patch: {
        email?: string;
        name?: string;
        phone?: string | null;
        password?: string;
        roleSlug?: 'user' | 'admin';
      },
    ): Promise<PublicUser> {
      const row = await users.findById(id);
      if (!row) throw Errors.notFound('User');
      const isAdmin = actor.roleSlug === ROLE_SLUGS.admin;
      const isSelf = actor.id === id;
      if (!isAdmin && !isSelf) throw Errors.forbidden();
      if (!isAdmin && patch.roleSlug !== undefined) {
        throw Errors.forbidden('Only admins can change roles');
      }
      if (patch.email && (await users.emailTaken(patch.email, id))) {
        throw Errors.conflict('Email already in use');
      }
      let roleId: string | undefined;
      if (patch.roleSlug) {
        const role = await roles.findBySlug(patch.roleSlug);
        if (!role) throw Errors.badRequest('Unknown role');
        roleId = role.id;
      }
      const updated = await users.update(id, {
        ...(patch.email !== undefined ? { email: patch.email } : {}),
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.phone !== undefined ? { phone: patch.phone ?? null } : {}),
        ...(patch.password !== undefined
          ? { passwordHash: await hashPassword(patch.password) }
          : {}),
        ...(roleId !== undefined ? { roleId } : {}),
      });
      if (!updated) throw Errors.notFound('User');
      log.info('user.updated', { userId: id, by: actor.id });
      return toPublicUser(updated);
    },

    async delete(id: string, actor: { id: string; roleSlug: string }): Promise<void> {
      if (actor.roleSlug !== ROLE_SLUGS.admin) {
        throw Errors.forbidden('Only admins can delete users');
      }
      if (actor.id === id) {
        throw Errors.badRequest('Cannot delete your own account via this endpoint');
      }
      const ok = await users.delete(id);
      if (!ok) throw Errors.notFound('User');
      log.info('user.deleted', { userId: id, by: actor.id });
    },

    async listSaved(
      actorId: string,
      page: number,
      limit: number,
    ): Promise<{
      data: ReturnType<typeof toPropertyListingDto>[];
      meta: { page: number; limit: number; total: number; offset: number };
    }> {
      const offset = (page - 1) * limit;
      const savedRepo = new SavedPropertyRepository(db);
      const propRepo = new PropertyRepository(db);
      const { rows, total } = await savedRepo.listPropertiesForUser(actorId, limit, offset);
      const enriched = await Promise.all(rows.map((p) => propRepo.enrichWithOwner(p)));
      return {
        data: enriched.map(toPropertyListingDto),
        meta: { page, limit, total, offset },
      };
    },

    async addSaved(actorId: string, propertyId: string): Promise<void> {
      const propRepo = new PropertyRepository(db);
      const row = await propRepo.findById(propertyId);
      if (!row) throw Errors.notFound('Property');
      if (row.status !== 'active') {
        throw Errors.badRequest('Only published listings can be saved');
      }
      const savedRepo = new SavedPropertyRepository(db);
      await savedRepo.insertIgnore(actorId, propertyId);
      log.info('saved_property.added', { userId: actorId, propertyId });
    },

    async removeSaved(actorId: string, propertyId: string): Promise<void> {
      const savedRepo = new SavedPropertyRepository(db);
      await savedRepo.delete(actorId, propertyId);
      log.info('saved_property.removed', { userId: actorId, propertyId });
    },

    async removeAllSaved(actorId: string): Promise<{ removed: number }> {
      const savedRepo = new SavedPropertyRepository(db);
      const n = await savedRepo.deleteAllForUser(actorId);
      log.info('saved_property.cleared', { userId: actorId, removed: n });
      return { removed: n };
    },
  };
}
