import { z } from 'zod';

/** RFC-like email; refine as needed. */
export const emailSchema = z
  .string()
  .min(3)
  .max(256)
  .email({ message: 'Invalid email' });

export const uuidParam = z.string().uuid({ message: 'Invalid id' });

const num = (fallback: number, max?: number) =>
  z.preprocess((v) => {
    if (v === undefined || v === '' || v === null) return fallback;
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return n;
  }, max !== undefined ? z.number().int().min(1).max(max) : z.number().int().min(1));

export const paginationQuery = z.object({
  page: num(1),
  limit: num(20, 100),
});

export type PaginationQuery = z.infer<typeof paginationQuery>;

export function parsePagination(q: PaginationQuery) {
  const page = q.page;
  const limit = q.limit;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/** Shared password rules for register / change password. */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a digit');
