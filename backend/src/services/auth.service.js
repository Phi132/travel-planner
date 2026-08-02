import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getExpiryDate
} from '../helpers/jwt.helper.js';

const SALT_ROUNDS = 10;

/**
 * Loại bỏ các trường nhạy cảm trước khi trả về client.
 */
function toSafeUser(user) {
  // eslint-disable-next-line no-unused-vars
  const { password, deletedAt, ...safeUser } = user;
  return safeUser;
}

/**
 * Sinh cặp access/refresh token cho một user, đồng thời lưu refresh token
 * vào DB (bảng refresh_tokens) để có thể revoke sau này.
 */
async function issueTokenPair(user, meta = {}) {
  const payload = { sub: user.id, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      userAgent: meta.userAgent || null,
      ipAddress: meta.ipAddress || null,
      expiresAt: getExpiryDate(env.jwt.refreshExpiresIn)
    }
  });

  return { accessToken, refreshToken };
}

async function register(data, meta) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('Email này đã được sử dụng.', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone
    }
  });

  const tokens = await issueTokenPair(user, meta);

  return { user: toSafeUser(user), ...tokens };
}

async function login(data, meta) {
  const user = await prisma.user.findFirst({
    where: { email: data.email, deletedAt: null }
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError('Email hoặc mật khẩu không đúng.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Tài khoản của bạn đã bị vô hiệu hóa.', 403);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const tokens = await issueTokenPair(user, meta);

  return { user: toSafeUser(user), ...tokens };
}

/**
 * Cấp lại access token mới từ refresh token hợp lệ.
 * Áp dụng refresh token rotation: token cũ bị thu hồi ngay khi dùng,
 * token mới được cấp thay thế — giảm rủi ro nếu refresh token bị đánh cắp.
 */
async function refresh(oldToken, meta) {
  if (!oldToken) {
    throw new AppError('Không tìm thấy refresh token.', 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(oldToken);
  } catch {
    throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn.', 401);
  }

  const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: oldToken } });

  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
    throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn.', 401);
  }

  const user = await prisma.user.findFirst({ where: { id: payload.sub, deletedAt: null } });
  if (!user || !user.isActive) {
    throw new AppError('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.', 401);
  }

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { revokedAt: new Date() }
  });

  const tokens = await issueTokenPair(user, meta);

  return { user: toSafeUser(user), ...tokens };
}

async function logout(token) {
  if (!token) return;

  await prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

async function getMe(userId) {
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }
  return toSafeUser(user);
}

export const authService = { register, login, refresh, logout, getMe };
