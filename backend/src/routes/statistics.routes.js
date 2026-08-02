import { Router } from 'express';
import * as statisticsController from '../controllers/statistics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/overview', statisticsController.overview);

export default router;
