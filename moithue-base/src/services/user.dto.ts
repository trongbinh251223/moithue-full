import type { UserWithRole } from '../repositories/user.repository';

export function toPublicUser(u: UserWithRole) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone ?? null,
    avatar: u.avatar ?? null,
    address: u.address ?? null,
    role: u.role?.slug ?? null,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export type PublicUser = ReturnType<typeof toPublicUser>;
