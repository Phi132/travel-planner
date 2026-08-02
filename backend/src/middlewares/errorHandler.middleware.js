import { env } from '../config/env.js';

/**
 * Lớp lỗi nghiệp vụ dùng chung toàn bộ backend.
 * Cho phép controller/service throw lỗi có statusCode rõ ràng.
 */
export class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware bắt route không tồn tại (404).
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Không tìm thấy đường dẫn: ${req.originalUrl}`, 404));
}

/**
 * Middleware xử lý lỗi tập trung — chuẩn hóa toàn bộ response lỗi.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.';
  let details = err.details || null;

  // Lỗi Prisma: bản ghi không tồn tại
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Không tìm thấy dữ liệu.';
  }

  // Lỗi Prisma: vi phạm ràng buộc unique
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target;
    message = `Dữ liệu đã tồn tại${field ? ` (${field})` : ''}.`;
  }

  // Lỗi Prisma: vi phạm khóa ngoại
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Dữ liệu liên kết không hợp lệ.';
  }

  // Lỗi Multer (upload file) — nêu rõ nguyên nhân cụ thể thay vì message gốc
  // chung chung của thư viện, để không phải mò DevTools mới biết vì sao 400.
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `Ảnh vượt quá dung lượng cho phép (tối đa ${env.upload.maxFileSizeMb}MB/ảnh). Vui lòng chọn ảnh nhỏ hơn hoặc tăng MAX_FILE_SIZE_MB trong .env.`;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = `Sai tên field khi upload (field "${err.field}" không được server chấp nhận).`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Vượt quá số lượng ảnh cho phép trong 1 lần tải lên.';
    } else {
      message = `Lỗi tải lên tệp: ${err.message}`;
    }
  }

  // Lỗi JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn.';
  }

  // Dev mode: log MỌI lỗi (không chỉ 500) kèm method + path, để nhìn thấy
  // ngay trên terminal backend nguyên nhân thật sự thay vì phải mở DevTools.
  if (!env.isProduction) {
    // eslint-disable-next-line no-console
    console.error(`[${statusCode}] ${req.method} ${req.originalUrl} -> ${message}`, details ?? '', statusCode === 500 ? err : '');
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(env.isProduction ? {} : { stack: err.stack })
  });
}
