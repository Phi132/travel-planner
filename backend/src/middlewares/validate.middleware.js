import { ZodError } from 'zod';
import { AppError } from './errorHandler.middleware.js';

/**
 * Middleware validate dùng chung cho toàn bộ module (Auth, Users, Trips...).
 * Truyền vào một Zod schema, middleware sẽ parse phần `source` tương ứng
 * của request (mặc định 'body'), gán lại giá trị đã được Zod coerce/strip,
 * và trả lỗi 422 chuẩn hóa nếu không hợp lệ.
 *
 * Cách dùng: router.post('/register', validate(registerSchema), controller.register)
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      return next(new AppError('Dữ liệu gửi lên không hợp lệ.', 422, details));
    }
    next(err);
  }
};
