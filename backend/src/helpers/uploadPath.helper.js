import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helpers/ -> src/ -> backend/  (khớp với cách app.js tính __dirname/../uploads)
const backendRoot = path.join(__dirname, '..', '..');

/**
 * Trả về đường dẫn tuyệt đối tới thư mục upload (hoặc thư mục con của nó),
 * luôn tính từ vị trí file này chứ không phụ thuộc `process.cwd()` — đảm bảo
 * đúng thư mục dù lệnh `npm run dev` được chạy từ đâu.
 */
export function getUploadDir(...subpaths) {
  return path.join(backendRoot, env.upload.dir, ...subpaths);
}
