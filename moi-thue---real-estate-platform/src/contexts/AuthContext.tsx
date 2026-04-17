import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthTokensResponse, PublicUser } from '@/lib/authApi';
import { loginRequest, logoutRequest, registerRequest } from '@/lib/authApi';
import { AUTH_FORCE_LOGOUT_EVENT } from '@/lib/authEvents';
import {
  buildSessionFromAuthResponse,
  clearAllAuthLocalState,
  loadAuthSession,
  saveAuthSession,
  type AuthSession,
} from '@/lib/authStorage';
import type { AuthContextValue, User } from '@/types/auth/user.types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toUser(session: AuthSession): User {
  return { ...session.user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => loadAuthSession());

  useEffect(() => {
    const onForceLogout = () => setSession(null);
    window.addEventListener(AUTH_FORCE_LOGOUT_EVENT, onForceLogout);
    return () => window.removeEventListener(AUTH_FORCE_LOGOUT_EVENT, onForceLogout);
  }, []);

  const setSessionFromTokens = useCallback((tokens: AuthTokensResponse) => {
    const next = buildSessionFromAuthResponse(
      tokens.user,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
    );
    saveAuthSession(next);
    setSession(next);
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const tokens = await loginRequest(email, password);
    setSessionFromTokens(tokens);
  }, [setSessionFromTokens]);

  const registerWithPassword = useCallback(async (name: string, email: string, password: string) => {
    const tokens = await registerRequest(name, email, password);
    setSessionFromTokens(tokens);
  }, [setSessionFromTokens]);

  const logout = useCallback(async () => {
    const rt = session?.refreshToken;
    clearAllAuthLocalState();
    setSession(null);
    if (rt) await logoutRequest(rt);
  }, [session?.refreshToken]);

  const updateSessionUser = useCallback((user: PublicUser) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user };
      saveAuthSession(next);
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session ? toUser(session) : null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session?.accessToken),
      loginWithPassword,
      registerWithPassword,
      setSessionFromTokens,
      updateSessionUser,
      logout,
    }),
    [session, loginWithPassword, registerWithPassword, setSessionFromTokens, updateSessionUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
