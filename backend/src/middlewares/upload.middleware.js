import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler.middleware.js';
import { env } from '../config/env.js';

// HEIC/HEIF: định dạng mặc định của ảnh chụp trên iPhone (đối tượng chính của
// app là "Mobile First iPhone" nên bắt buộc phải chấp nhận). sharp >= 0.32 đọc
// được HEIC/HEIF qua libheif tích hợp sẵn trong libvips prebuilt binary, nên
// vẫn resize + convert sang WebP như các định dạng khác, không cần cài thêm gì.
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// Một số trình duyệt/thiết bị (đặc biệt vài phiên bản Safari/iOS) không set
// đúng mimetype cho HEIC mà trả về 'application/octet-stream' hoặc rỗng — khi
// đó phải fallback kiểm tra theo phần mở rộng file để không chặn nhầm.
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

// Dùng memoryStorage vì ảnh cần qua sharp xử lý (resize + convert) trước khi
// ghi ra đĩa, không cần multer ghi file tạm trung gian.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);

  if (!isMimeAllowed && !isExtAllowed) {
    return cb(new AppError('Chỉ chấp nhận ảnh định dạng JPEG, PNG, WEBP hoặc HEIC.', 400));
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxFileSizeMb * 1024 * 1024 }
});
