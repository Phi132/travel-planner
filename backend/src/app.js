import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- Bảo mật cơ bản ----
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);

// ---- Rate limit chống spam / brute force ----
const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau.' }
});
app.use('/api', limiter);

// ---- Parser ----
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// ---- Logging ----
if (!env.isProduction) {
  app.use(morgan('dev'));
}

// ---- Static files (ảnh upload) ----
app.use('/uploads', express.static(path.join(__dirname, '..', env.upload.dir)));

// ---- Routes ----
app.use('/api', routes);

// ---- Xử lý lỗi ----
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
