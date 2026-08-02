import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/**
 * Singleton Prisma Client — tránh tạo nhiều kết nối khi nodemon reload.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isProduction ? ['error'] : ['query', 'error', 'warn']
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
