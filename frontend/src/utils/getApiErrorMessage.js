/**
 * Backend luôn trả lỗi dạng { success: false, message, details }
 * (xem backend/src/middlewares/errorHandler.middleware.js).
 */
export function getApiErrorMessage(error, fallback = 'Đã xảy ra lỗi, vui lòng thử lại.') {
  return error?.response?.data?.message || fallback;
}
