import { ROLE_SLUGS } from '../db/constants';
import { Errors } from '../lib/errors';
import { hashPassword, verifyPassword } from '../lib/password';
import {
  accessTtlSec,
  refreshTtlDays,
  signAccessToken,
} from '../lib/jwt';
import type { Logger } from '../lib/logger';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { RoleRepository } from '../repositories/role.repository';
import { SessionRepository } from '../repositories/session.repository';
import { UserRepository, type UserWithRole } from '../repositories/user.repository';
import type { Db } from '../types/app';
import type { Env } from '../types/app';
import { toPublicUser } from './user.dto';

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomRefreshToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomPasswordResetToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function passwordResetExpiresAt(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d.toISOString();
}

function refreshExpiresAt(env: Env): string {
  const d = new Date();
  d.setDate(d.getDate() + refreshTtlDays(env));
  return d.toISOString();
}

export function createAuthService(db: Db, env: Env, log: Logger) {
  const users = new UserRepository(db);
  const sessions = new SessionRepository(db);
  const passwordResets = new PasswordResetRepository(db);
  const roles = new RoleRepository(db);

  async function issueTokens(user: UserWithRole) {
    const roleSlug = user.role?.slug ?? ROLE_SLUGS.user;
    const refreshToken = randomRefreshToken();
    const refreshTokenHash = await sha256hex(refreshToken);
    const row = await sessions.create({
      userId: user.id,
      refreshTokenHash,
      expiresAt: refreshExpiresAt(env),
    });
    const accessToken = await signAccessToken(env, {
      sub: user.id,
      email: user.email,
      role: roleSlug,
    });
    log.info('auth.tokens_issued', { userId: user.id, sessionId: row.id });
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: accessTtlSec(env),
      user: toPublicUser(user),
    };
  }

  return {
    async register(input: { email: string; password: string; name: string }) {
      if (await users.findByEmail(input.email)) {
        throw Errors.conflict('Email already registered');
      }
      const role = await roles.findBySlug(ROLE_SLUGS.user);
      if (!role) throw Errors.internal('Default role missing; run migrations');
      const passwordHash = await hashPassword(input.password);
      const user = await users.create({
        email: input.email,
        name: input.name,
        passwordHash,
        roleId: role.id,
      });
      return issueTokens(user);
    },

    async login(input: { email: string; password: string }) {
      const user = await users.findByEmail(input.email);
      if (!user?.passwordHash) {
        throw Errors.unauthorized('Invalid email or password');
      }
      const ok = await verifyPassword(input.password, user.passwordHash);
      if (!ok) throw Errors.unauthorized('Invalid email or password');
      return issueTokens(user);
    },

    async refresh(refreshToken: string) {
      const hash = await sha256hex(refreshToken);
      const session = await sessions.findActiveByRefreshHash(hash);
      if (!session) throw Errors.unauthorized('Invalid or expired refresh token');
      const user = await users.findById(session.userId);
      if (!user) throw Errors.unauthorized('User no longer exists');
      await sessions.revokeById(session.id);
      return issueTokens(user);
    },

    async logout(refreshToken: string) {
      const hash = await sha256hex(refreshToken);
      const session = await sessions.findActiveByRefreshHash(hash);
      if (session) await sessions.revokeById(session.id);
      return { ok: true as const };
    },

    /**
     * Always returns a neutral message (no email enumeration).
     * If `PASSWORD_RESET_APP_URL` is set, includes `resetUrl` when the user exists (dev / no mailer).
     */
    async forgotPassword(input: { email: string }) {
      const neutral = {
        ok: true as const,
        message:
          'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
      };
      const user = await users.findByEmail(input.email);
      if (!user?.passwordHash) {
        return neutral;
      }
      await passwordResets.markAllPendingUsed(user.id);
      const plainToken = randomPasswordResetToken();
      const tokenHash = await sha256hex(plainToken);
      await passwordResets.create({
        userId: user.id,
        tokenHash,
        expiresAt: passwordResetExpiresAt(),
      });
      log.info('auth.password_reset_requested', { userId: user.id });
      const base = env.PASSWORD_RESET_APP_URL?.replace(/\/$/, '');
      if (!base) return neutral;
      const resetUrl = `${base}/reset-password?token=${encodeURIComponent(plainToken)}`;
      return { ...neutral, resetUrl };
    },

    async resetPassword(input: { token: string; password: string }) {
      const hash = await sha256hex(input.token);
      const row = await passwordResets.findValidByTokenHash(hash);
      if (!row) throw Errors.badRequest('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
      const user = await users.findById(row.userId);
      if (!user) throw Errors.badRequest('Tài khoản không còn tồn tại');
      const passwordHash = await hashPassword(input.password);
      await users.update(user.id, { passwordHash });
      await passwordResets.markUsedById(row.id);
      await sessions.revokeAllForUser(user.id);
      log.info('auth.password_reset_completed', { userId: user.id });
      return { ok: true as const, message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.' };
    },
  };
}
