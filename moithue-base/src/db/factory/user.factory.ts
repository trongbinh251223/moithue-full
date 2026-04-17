import { ROLE_IDS } from '../constants';
import type { NewUser } from '../schema';

/** Build insert payload for tests / seed scripts (no password hashing). */
export function buildUserInsert(overrides: Partial<NewUser> = {}): NewUser {
  return {
    email: `user-${crypto.randomUUID().slice(0, 8)}@example.com`,
    name: 'Test User',
    roleId: ROLE_IDS.user,
    passwordHash: null,
    ...overrides,
  };
}
