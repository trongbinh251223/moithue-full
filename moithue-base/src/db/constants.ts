/** Deterministic role IDs (match migration + seed). */
export const ROLE_IDS = {
  user: '00000000-0000-4000-8000-000000000001',
  admin: '00000000-0000-4000-8000-000000000002',
} as const;

export const ROLE_SLUGS = {
  user: 'user',
  admin: 'admin',
} as const;
