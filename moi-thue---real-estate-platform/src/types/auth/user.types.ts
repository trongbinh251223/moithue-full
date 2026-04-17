import type { AuthTokensResponse, PublicUser } from '@/lib/authApi';

export type User = PublicUser;

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerWithPassword: (name: string, email: string, password: string) => Promise<void>;
  setSessionFromTokens: (tokens: AuthTokensResponse) => void;
  /** Cập nhật user trong session (sau PATCH /users/me, v.v.). */
  updateSessionUser: (user: PublicUser) => void;
  logout: () => Promise<void>;
}
