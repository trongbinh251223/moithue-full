import { clearAllAuthLocalState } from '@/lib/authStorage';
import { emitAuthForceLogout } from '@/lib/authEvents';

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '/api/v1';

function handleUnauthorizedFromApi(token?: string | null) {
  if (!token) return;
  clearAllAuthLocalState();
  emitAuthForceLogout();
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function errMessage(status: number, body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error?: { message?: string } }).error;
    if (err?.message) return err.message;
  }
  if (status === 401) return 'Phiên đăng nhập không hợp lệ.';
  if (status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
  if (status === 404) return 'Không tìm thấy dữ liệu.';
  return 'Đã có lỗi xảy ra.';
}

async function parseJson(res: Response): Promise<unknown> {
  const t = await res.text();
  if (!t) return {};
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return {};
  }
}

export async function apiGet<T>(path: string, init?: RequestInit & { token?: string | null }): Promise<T> {
  const { token, ...rest } = init ?? {};
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(rest.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const body = await parseJson(res);
  if (!res.ok) {
    if (res.status === 401 && token) handleUnauthorizedFromApi(token);
    throw new ApiError(res.status, errMessage(res.status, body), body);
  }
  return body as T;
}

export async function apiPost<T>(
  path: string,
  json: unknown,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const { token, ...rest } = init ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(rest.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    ...rest,
    headers,
    body: JSON.stringify(json),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    if (res.status === 401 && token) handleUnauthorizedFromApi(token);
    throw new ApiError(res.status, errMessage(res.status, body), body);
  }
  return body as T;
}

export async function apiPatch<T>(
  path: string,
  json: unknown,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const { token, ...rest } = init ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(rest.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    ...rest,
    headers,
    body: JSON.stringify(json),
  });
  const body = await parseJson(res);
  if (!res.ok) {
    if (res.status === 401 && token) handleUnauthorizedFromApi(token);
    throw new ApiError(res.status, errMessage(res.status, body), body);
  }
  return body as T;
}

export async function apiDelete(path: string, init?: RequestInit & { token?: string | null }): Promise<void> {
  const { token, ...rest } = init ?? {};
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(rest.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', ...rest, headers });
  if (res.status === 204) return;
  const body = await parseJson(res);
  if (!res.ok) {
    if (res.status === 401 && token) handleUnauthorizedFromApi(token);
    throw new ApiError(res.status, errMessage(res.status, body), body);
  }
}
