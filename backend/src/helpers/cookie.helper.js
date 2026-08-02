import ms from 'ms';
import { env } from '../config/env.js';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

/**
 * Refresh token được lưu ở httpOnly cookie (không thể đọc bằng JS phía
 * client) để giảm rủi ro XSS đánh cắp token. Access token thì trả về trong
 * body response, frontend tự lưu ở bộ nhớ (Zustand store), không lưu cookie.
 */
export function setRefreshTokenCookie(res, token) {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: ms(env.jwt.refreshExpiresIn),
    path: '/api/auth'
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    path: '/api/auth'
  });
}
