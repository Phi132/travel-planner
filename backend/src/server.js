import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

async function startServer() {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('✅ Kết nối MySQL (Prisma) thành công.');

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Travel Planner API đang chạy tại http://localhost:${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`   Môi trường: ${env.nodeEnv}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Không thể kết nối database. Kiểm tra lại DATABASE_URL trong file .env:', err.message);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', err);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
