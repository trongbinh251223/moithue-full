const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '/api/v1';

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
  role: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: PublicUser;
};

export type ApiErrorBody = {
  error?: { code?: string; message?: string };
  requestId?: string;
};

export class AuthApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.body = body;
  }
}

function getErrorMessage(status: number, body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as ApiErrorBody).error;
    if (err?.message) return err.message;
  }
  if (status === 401) return 'Email hoặc mật khẩu không đúng.';
  if (status === 409) return 'Email này đã được đăng ký.';
  if (status === 422 || status === 400) return 'Dữ liệu không hợp lệ. Kiểm tra lại các trường.';
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

async function postJson<T>(path: string, payload: unknown, okStatuses: number[] = [200]): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await parseJson(res);
  if (!okStatuses.includes(res.status)) {
    throw new AuthApiError(res.status, getErrorMessage(res.status, body), body);
  }
  return body as T;
}

export async function loginRequest(email: string, password: string): Promise<AuthTokensResponse> {
  return postJson<AuthTokensResponse>('/auth/login', { email, password });
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<AuthTokensResponse> {
  return postJson<AuthTokensResponse>('/auth/register', { name, email, password }, [200, 201]);
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  try {
    await postJson('/auth/logout', { refreshToken });
  } catch {
    /* best-effort */
  }
}

export type ForgotPasswordResponse = {
  ok: true;
  message: string;
  resetUrl?: string;
};

export async function forgotPasswordRequest(email: string): Promise<ForgotPasswordResponse> {
  return postJson<ForgotPasswordResponse>('/auth/forgot-password', { email });
}

export type ResetPasswordResponse = {
  ok: true;
  message: string;
};

export async function resetPasswordRequest(token: string, password: string): Promise<ResetPasswordResponse> {
  return postJson<ResetPasswordResponse>('/auth/reset-password', { token, password });
}
