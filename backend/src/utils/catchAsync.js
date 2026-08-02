/**
 * Bọc các hàm controller async để tự động bắt lỗi và chuyển vào errorHandler,
 * tránh phải viết try/catch lặp lại ở mọi controller (nguyên tắc DRY).
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
