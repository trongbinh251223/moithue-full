/** CustomEvent name: xóa session ở client (401, hết hạn, v.v.). */
export const AUTH_FORCE_LOGOUT_EVENT = 'moithue:auth-force-logout';

export function emitAuthForceLogout(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_FORCE_LOGOUT_EVENT));
}
