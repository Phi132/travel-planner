import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { createTripSchema, updateTripSchema, listTripsQuerySchema, tripIdParamSchema } from '../validators/trip.validator.js';

const router = Router();

// Toàn bộ route Trips đều thao tác trên dữ liệu của chính user đang đăng nhập.
router.use(authenticate);

router.get('/', validate(listTripsQuerySchema, 'query'), tripController.list);
router.post('/', validate(createTripSchema), tripController.create);
router.get('/:id', validate(tripIdParamSchema, 'params'), tripController.getOne);
router.patch('/:id', validate(tripIdParamSchema, 'params'), validate(updateTripSchema), tripController.update);
router.delete('/:id', validate(tripIdParamSchema, 'params'), tripController.remove);
router.post('/:id/cover', validate(tripIdParamSchema, 'params'), uploadImage.single('cover'), tripController.uploadCover);

export default router;
