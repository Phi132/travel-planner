import { Router } from 'express';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  sendSuccess(res, {
    message: 'Travel Planner API đang hoạt động',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
