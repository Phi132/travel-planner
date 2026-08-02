import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import tripRoutes from './trip.routes.js';
import catalogRoutes from './catalog.routes.js';
import placeRoutes from './place.routes.js';
import journalRoutes from './journal.routes.js';
import photoRoutes from './photo.routes.js';
import expenseRoutes from './expense.routes.js';
import favoriteRoutes from './favorite.routes.js';
import scheduleRoutes from './schedule.routes.js';
import statisticsRoutes from './statistics.routes.js';

const router = Router();

/**
 * Đăng ký router gốc. Các module nghiệp vụ còn lại (notifications, admin...)
 * sẽ được gắn vào đây lần lượt ở các bước tiếp theo.
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/trips', scheduleRoutes); // /trips/:tripId/days, /trips/:tripId/schedules
router.use('/', catalogRoutes); // /provinces, /categories
router.use('/places', placeRoutes);
router.use('/journals', journalRoutes);
router.use('/photos', photoRoutes);
router.use('/expenses', expenseRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/statistics', statisticsRoutes);

export default router;
