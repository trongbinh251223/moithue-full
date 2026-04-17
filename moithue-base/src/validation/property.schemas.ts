import { z } from 'zod';

export const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(['new', 'price_asc', 'price_desc']).default('new'),
  q: z.string().max(256).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  project: z.string().max(256).optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  propertyType: z.string().max(128).optional(),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  minBedrooms: z.coerce.number().int().min(0).max(50).optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional(),
  minBathrooms: z.coerce.number().int().min(0).max(50).optional(),
});

export const propertyIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const propertyMineQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['active', 'pending', 'rejected']).optional(),
});

const imageUrl = z.string().url().max(2048);

export const propertyCreateBodySchema = z.object({
  title: z.string().min(3).max(512),
  propertyType: z.string().min(1).max(128),
  project: z.string().max(256).nullable().optional(),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  floors: z.coerce.number().int().min(0).max(200).nullable().optional(),
  areaValue: z.coerce.number().positive().max(100000),
  priceValue: z.coerce.number().positive().max(100000),
  depositText: z.string().max(256).nullable().optional(),
  location: z.string().min(1).max(512),
  locationExtra: z.string().max(256).nullable().optional(),
  description: z.string().min(10).max(20000),
  contactPhone: z.string().max(64).nullable().optional(),
  images: z.array(imageUrl).max(30).default([]),
});

export const propertyUpdateBodySchema = z
  .object({
    title: z.string().min(3).max(512).optional(),
    propertyType: z.string().min(1).max(128).optional(),
    project: z.string().max(256).nullable().optional(),
    bedrooms: z.coerce.number().int().min(0).max(50).optional(),
    bathrooms: z.coerce.number().int().min(0).max(50).optional(),
    floors: z.coerce.number().int().min(0).max(200).nullable().optional(),
    areaValue: z.coerce.number().positive().max(100000).optional(),
    priceValue: z.coerce.number().positive().max(100000).optional(),
    depositText: z.string().max(256).nullable().optional(),
    location: z.string().min(1).max(512).optional(),
    locationExtra: z.string().max(256).nullable().optional(),
    description: z.string().min(10).max(20000).optional(),
    contactPhone: z.string().max(64).nullable().optional(),
    images: z.array(imageUrl).max(30).optional(),
    status: z.enum(['draft', 'pending', 'active', 'rejected']).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field required' });
