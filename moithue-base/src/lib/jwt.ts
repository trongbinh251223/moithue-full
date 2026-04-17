import { SignJWT, jwtVerify } from 'jose';
import type { Env } from '../types/app';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  typ: 'access';
};

function getSecret(env: Env) {
  return new TextEncoder().encode(env.JWT_SECRET);
}

function issuer(env: Env) {
  return env.JWT_ISSUER ?? 'moithue-base';
}

export function accessTtlSec(env: Env): number {
  const raw = env.ACCESS_TOKEN_TTL_SEC;
  const n = raw ? Number(raw) : 900;
  return Number.isFinite(n) && n > 0 ? n : 900;
}

export function refreshTtlDays(env: Env): number {
  const raw = env.REFRESH_TOKEN_DAYS;
  const n = raw ? Number(raw) : 7;
  return Number.isFinite(n) && n > 0 ? n : 7;
}

export async function signAccessToken(
  env: Env,
  payload: Omit<AccessTokenPayload, 'typ'>,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + accessTtlSec(env);
  return new SignJWT({ ...payload, typ: 'access' as const })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer(issuer(env))
    .sign(getSecret(env));
}

export async function verifyAccessToken(
  env: Env,
  token: string,
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(env), {
    issuer: issuer(env),
    algorithms: ['HS256'],
  });
  if (payload.typ !== 'access') throw new Error('Invalid token type');
  const sub = payload.sub;
  const email = typeof payload.email === 'string' ? payload.email : '';
  const role = typeof payload.role === 'string' ? payload.role : '';
  if (!sub || !email || !role) throw new Error('Invalid access token claims');
  return { sub, email, role, typ: 'access' };
}
