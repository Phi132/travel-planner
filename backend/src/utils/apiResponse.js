/**
 * Chuẩn hóa toàn bộ response thành công của API, đảm bảo mọi endpoint
 * trả về cùng một cấu trúc JSON.
 */
export function sendSuccess(res, { statusCode = 200, message = 'Thành công', data = null, meta = null }) {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
}

/**
 * Chuẩn hóa meta phân trang.
 */
export function buildPaginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}
