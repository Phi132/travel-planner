import { AppError } from './errorHandler.middleware.js';
import { verifyAccessToken } from '../helpers/jwt.helper.js';

/**
 * Middleware xác thực — yêu cầu header `Authorization: Bearer <accessToken>`.
 * Nếu hợp lệ, gán req.user = { id, role } để các middleware/controller sau
 * dùng lại (ví dụ scope dữ liệu theo userId).
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Yêu cầu đăng nhập để tiếp tục.', 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    // errorHandler.middleware.js đã map sẵn JsonWebTokenError / TokenExpiredError
    next(err);
  }
}

/**
 * Middleware xác thực tùy chọn — dùng cho route công khai (ví dụ chi tiết
 * địa điểm) nhưng vẫn muốn biết req.user nếu người dùng đã đăng nhập.
 * Không báo lỗi nếu thiếu/token không hợp lệ, chỉ đơn giản bỏ qua req.user.
 */
export function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Token không hợp lệ/hết hạn -> coi như khách chưa đăng nhập, không throw.
  }
  next();
}

/**
 * Middleware phân quyền — dùng sau `authenticate`.
 * Ví dụ: router.delete('/places/:id', authenticate, authorize('ADMIN'), ...)
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Yêu cầu đăng nhập để tiếp tục.', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện hành động này.', 403));
    }
    next();
  };
}
