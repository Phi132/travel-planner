import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[CẢNH BÁO] Thiếu biến môi trường bắt buộc: ${key}. Hãy kiểm tra file .env`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10
  },
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: Number(process.env.RATE_LIMIT_MAX) || 300
  },
  isProduction: process.env.NODE_ENV === 'production'
};
