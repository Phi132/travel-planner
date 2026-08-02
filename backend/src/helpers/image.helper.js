import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getUploadDir } from './uploadPath.helper.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';

/**
 * Bọc lỗi sharp (thường xảy ra khi buffer không phải ảnh hợp lệ, hoặc — hiếm
 * gặp — môi trường server dùng bản libvips không build kèm hỗ trợ đọc HEIC)
 * thành AppError dễ hiểu, thay vì để lỗi gốc rơi xuống thành 500 khó debug.
 */
function wrapSharpError(err) {
  throw new AppError(
    'Không thể xử lý tệp ảnh này. Ảnh có thể bị lỗi hoặc định dạng chưa được hỗ trợ trên máy chủ.',
    422,
    process.env.NODE_ENV === 'production' ? null : [{ field: 'file', message: err.message }]
  );
}

/**
 * Resize ảnh về kích thước vuông (cover), convert sang WebP để giảm dung
 * lượng, lưu vào `backend/uploads/<folder>/`, trả về URL tương đối để lưu
 * vào DB (ví dụ: /uploads/avatars/xxx.webp — khớp với static route trong app.js).
 */
export async function saveResizedImage(buffer, { folder, size = 512 }) {
  const dir = getUploadDir(folder);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(dir, filename);

  try {
    await sharp(buffer).resize(size, size, { fit: 'cover' }).webp({ quality: 80 }).toFile(filepath);
  } catch (err) {
    wrapSharpError(err);
  }

  return `/uploads/${folder}/${filename}`;
}

/**
 * Resize ảnh giữ nguyên tỉ lệ (không crop vuông như saveResizedImage) — dùng
 * cho ảnh nhật ký/album, nơi bố cục gốc của bức ảnh cần được giữ nguyên.
 * Giới hạn cạnh dài nhất để tối ưu dung lượng, không phóng to ảnh nhỏ hơn.
 */
export async function saveOriginalRatioImage(buffer, { folder, maxDimension = 1600 }) {
  const dir = getUploadDir(folder);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(dir, filename);

  try {
    await sharp(buffer)
      .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(filepath);
  } catch (err) {
    wrapSharpError(err);
  }

  return `/uploads/${folder}/${filename}`;
}

/**
 * Xoá file upload cũ dựa theo URL tương đối lưu trong DB. Không throw nếu
 * file không tồn tại (ví dụ đã bị xoá thủ công) — chỉ best-effort cleanup.
 */
export async function deleteUploadedFile(relativeUrl) {
  if (!relativeUrl || !relativeUrl.startsWith('/uploads/')) return;

  const relativePath = relativeUrl.replace('/uploads/', '');
  const filepath = path.join(getUploadDir(), relativePath);

  try {
    await fs.unlink(filepath);
  } catch {
    // File không tồn tại hoặc đã bị xoá — bỏ qua.
  }
}
