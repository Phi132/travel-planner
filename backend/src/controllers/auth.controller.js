import { authService } from '../services/auth.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE } from '../helpers/cookie.helper.js';

function getRequestMeta(req) {
  return { userAgent: req.headers['user-agent'], ipAddress: req.ip };
}

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body, getRequestMeta(req));
  setRefreshTokenCookie(res, refreshToken);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Đăng ký tài khoản thành công.',
    data: { user, accessToken }
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, getRequestMeta(req));
  setRefreshTokenCookie(res, refreshToken);
  sendSuccess(res, {
    message: 'Đăng nhập thành công.',
    data: { user, accessToken }
  });
});

export const refresh = catchAsync(async (req, res) => {
  const oldToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
  const { user, accessToken, refreshToken } = await authService.refresh(oldToken, getRequestMeta(req));
  setRefreshTokenCookie(res, refreshToken);
  sendSuccess(res, {
    message: 'Làm mới token thành công.',
    data: { user, accessToken }
  });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
  await authService.logout(token);
  clearRefreshTokenCookie(res);
  sendSuccess(res, { message: 'Đăng xuất thành công.' });
});

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendSuccess(res, { message: 'Lấy thông tin người dùng thành công.', data: { user } });
});
