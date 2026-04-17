import type { PublicUser } from '@/lib/authApi';

export const AUTH_SESSION_STORAGE_KEY = 'moithue_auth_session';
const STORAGE_KEY = AUTH_SESSION_STORAGE_KEY;

export type AuthSession = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
  /** Epoch ms when access token is expected to expire (client-side hint). */
  accessExpiresAt: number;
};

export function loadAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AuthSession;
    if (!data?.user?.id || !data.accessToken || !data.refreshToken) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Xóa toàn bộ dữ liệu đăng nhập đã lưu ở client (mở rộng sau nếu có thêm key). */
export function clearAllAuthLocalState(): void {
  clearAuthSession();
}

export function buildSessionFromAuthResponse(
  user: PublicUser,
  accessToken: string,
  refreshToken: string,
  expiresInSec: number,
): AuthSession {
  return {
    user,
    accessToken,
    refreshToken,
    accessExpiresAt: Date.now() + expiresInSec * 1000,
  };
}
