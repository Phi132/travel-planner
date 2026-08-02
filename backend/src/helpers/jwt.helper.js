import jwt from 'jsonwebtoken';
import ms from 'ms';
import { env } from '../config/env.js';

/**
 * Ký Access Token — thời gian sống ngắn (mặc định 15 phút), dùng cho mọi
 * request cần xác thực (gửi qua header Authorization: Bearer <token>).
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn
  });
}

/**
 * Ký Refresh Token — thời gian sống dài (mặc định 30 ngày), dùng để cấp lại
 * Access Token mới. Token được lưu trong DB (bảng refresh_tokens) để có thể
 * thu hồi (revoke) khi logout hoặc phát hiện bất thường.
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

/**
 * Tính thời điểm hết hạn (Date) từ chuỗi thời lượng kiểu "30d", "15m"...
 * Dùng để lưu cột expiresAt của RefreshToken trong DB, đồng bộ với
 * thời gian sống thực tế của JWT.
 */
export function getExpiryDate(durationString) {
  return new Date(Date.now() + ms(durationString));
}
