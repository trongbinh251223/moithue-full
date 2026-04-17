import { ROLE_SLUGS } from '../db/constants';
import { Errors } from '../lib/errors';
import type { Logger } from '../lib/logger';
import { PropertyRepository } from '../repositories/property.repository';
import { SavedPropertyRepository } from '../repositories/saved-property.repository';
import type { Db } from '../types/app';
import { toPropertyDetailDto, toPropertyListingDto, toSimilarPropertyDto } from './property.dto';

const ALLOWED_STATUS = new Set(['draft', 'pending', 'active', 'rejected']);

export function createPropertyService(db: Db, log: Logger) {
  const repo = new PropertyRepository(db);
  const savedRepo = new SavedPropertyRepository(db);

  return {
    async searchPublic(
      filters: import('../repositories/property.repository').PropertySearchFilters,
      sort: 'new' | 'price_asc' | 'price_desc',
      page: number,
      limit: number,
      viewerUserId?: string | null,
    ) {
      const offset = (page - 1) * limit;
      const { rows, total } = await repo.searchPublic(filters, sort, limit, offset);
      const ids = rows.map((r) => r.id);
      const savedSet =
        viewerUserId && ids.length > 0
          ? await savedRepo.findPropertyIdsSavedByUser(viewerUserId, ids)
          : new Set<string>();
      return {
        data: rows.map((r) => ({
          ...toPropertyListingDto(r),
          isSaved: savedSet.has(r.id),
        })),
        meta: { page, limit, total, offset },
      };
    },

    async getById(
      id: string,
      viewer: { id: string; roleSlug: string } | undefined,
    ) {
      const row = await repo.findByIdWithOwner(id);
      if (!row) throw Errors.notFound('Property');
      const isOwner = viewer?.id === row.userId;
      const isAdmin = viewer?.roleSlug === ROLE_SLUGS.admin;
      if (row.status !== 'active' && !isOwner && !isAdmin) {
        throw Errors.notFound('Property');
      }
      const isSaved = viewer?.id ? await savedRepo.exists(viewer.id, id) : false;
      return { ...toPropertyDetailDto(row), isSaved };
    },

    async similar(id: string) {
      const row = await repo.findById(id);
      if (!row || row.status !== 'active') throw Errors.notFound('Property');
      const sim = await repo.findSimilar(id, row.propertyType, 8);
      return { data: sim.map(toSimilarPropertyDto) };
    },

    async listMine(
      userId: string,
      status: string | undefined,
      page: number,
      limit: number,
    ) {
      const offset = (page - 1) * limit;
      let statusIn: string[] | undefined;
      if (status === 'active') statusIn = ['active'];
      else if (status === 'pending') statusIn = ['pending', 'draft'];
      else if (status === 'rejected') statusIn = ['rejected'];
      const { rows, total } = await repo.listForOwner(userId, statusIn, limit, offset);
      return {
        data: rows.map((r) => ({
          ...toPropertyListingDto(r),
          status: r.status,
          depositText: r.depositText,
          description: (r.description ?? '').slice(0, 200),
        })),
        meta: { page, limit, total, offset },
      };
    },

    async create(
      userId: string,
      input: {
        title: string;
        propertyType: string;
        project?: string | null;
        bedrooms: number;
        bathrooms: number;
        floors?: number | null;
        areaValue: number;
        priceValue: number;
        depositText?: string | null;
        location: string;
        locationExtra?: string | null;
        description: string;
        contactPhone?: string | null;
        images: string[];
      },
      opts?: { initialStatus?: 'pending' | 'active' },
    ) {
      const status = opts?.initialStatus ?? 'pending';
      const row = await repo.create({
        userId,
        title: input.title,
        propertyType: input.propertyType,
        project: input.project ?? null,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        floors: input.floors ?? null,
        areaValue: input.areaValue,
        priceValue: input.priceValue,
        depositText: input.depositText ?? null,
        location: input.location,
        locationExtra: input.locationExtra ?? null,
        description: input.description,
        contactPhone: input.contactPhone ?? null,
        imagesJson: JSON.stringify(input.images.filter((u) => typeof u === 'string' && u.length > 0)),
        status,
      });
      log.info('property.created', { propertyId: row.id, userId });
      const full = await repo.findByIdWithOwner(row.id);
      if (!full) throw Errors.internal('Property load failed');
      return { ...toPropertyDetailDto(full), isSaved: false };
    },

    async update(
      id: string,
      actor: { id: string; roleSlug: string },
      patch: {
        title?: string;
        propertyType?: string;
        project?: string | null;
        bedrooms?: number;
        bathrooms?: number;
        floors?: number | null;
        areaValue?: number;
        priceValue?: number;
        depositText?: string | null;
        location?: string;
        locationExtra?: string | null;
        description?: string;
        contactPhone?: string | null;
        images?: string[];
        status?: string;
      },
    ) {
      const row = await repo.findById(id);
      if (!row) throw Errors.notFound('Property');
      const isOwner = actor.id === row.userId;
      const isAdmin = actor.roleSlug === ROLE_SLUGS.admin;
      if (!isOwner && !isAdmin) throw Errors.forbidden();
      if (patch.status !== undefined) {
        if (!isAdmin) throw Errors.forbidden('Only admins can change listing status');
        if (!ALLOWED_STATUS.has(patch.status)) throw Errors.badRequest('Invalid status');
      }
      const nextImages =
        patch.images !== undefined
          ? JSON.stringify(patch.images.filter((u) => typeof u === 'string' && u.length > 0))
          : undefined;
      const updated = await repo.update(id, {
        ...(patch.title !== undefined ? { title: patch.title } : {}),
        ...(patch.propertyType !== undefined ? { propertyType: patch.propertyType } : {}),
        ...(patch.project !== undefined ? { project: patch.project } : {}),
        ...(patch.bedrooms !== undefined ? { bedrooms: patch.bedrooms } : {}),
        ...(patch.bathrooms !== undefined ? { bathrooms: patch.bathrooms } : {}),
        ...(patch.floors !== undefined ? { floors: patch.floors } : {}),
        ...(patch.areaValue !== undefined ? { areaValue: patch.areaValue } : {}),
        ...(patch.priceValue !== undefined ? { priceValue: patch.priceValue } : {}),
        ...(patch.depositText !== undefined ? { depositText: patch.depositText } : {}),
        ...(patch.location !== undefined ? { location: patch.location } : {}),
        ...(patch.locationExtra !== undefined ? { locationExtra: patch.locationExtra } : {}),
        ...(patch.description !== undefined ? { description: patch.description } : {}),
        ...(patch.contactPhone !== undefined ? { contactPhone: patch.contactPhone } : {}),
        ...(nextImages !== undefined ? { imagesJson: nextImages } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
      });
      if (!updated) throw Errors.notFound('Property');
      log.info('property.updated', { propertyId: id, by: actor.id });
      const full = await repo.findByIdWithOwner(id);
      if (!full) throw Errors.internal('Property load failed');
      const isSaved = actor.id ? await savedRepo.exists(actor.id, id) : false;
      return { ...toPropertyDetailDto(full), isSaved };
    },

    async delete(id: string, actor: { id: string; roleSlug: string }) {
      const row = await repo.findById(id);
      if (!row) throw Errors.notFound('Property');
      const isOwner = actor.id === row.userId;
      const isAdmin = actor.roleSlug === ROLE_SLUGS.admin;
      if (!isOwner && !isAdmin) throw Errors.forbidden();
      await repo.delete(id);
      log.info('property.deleted', { propertyId: id, by: actor.id });
    },
  };
}
