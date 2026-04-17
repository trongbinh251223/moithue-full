import { apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import type { PublicUser } from '@/lib/authApi';

export async function fetchMe(token: string): Promise<PublicUser> {
  const res = await apiGet<{ data: PublicUser }>('/users/me', { token });
  return res.data;
}

export type PatchMeBody = {
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
};

export async function patchMeProfile(body: PatchMeBody, token: string): Promise<PublicUser> {
  const res = await apiPatch<{ data: PublicUser }>('/users/me', body, { token });
  return res.data;
}

export async function changePassword(
  body: { currentPassword: string; newPassword: string },
  token: string,
): Promise<void> {
  await apiPost<{ ok: boolean }>('/users/me/password', body, { token });
}
