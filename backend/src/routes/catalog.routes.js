import { Router } from 'express';
import * as catalogController from '../controllers/catalog.controller.js';

const router = Router();

// Dữ liệu tham chiếu công khai — không cần đăng nhập để xem.
router.get('/provinces', catalogController.listProvinces);
router.get('/provinces/:slug/districts', catalogController.listDistricts);
router.get('/categories', catalogController.listCategories);

export default router;
