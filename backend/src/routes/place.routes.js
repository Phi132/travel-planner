import { Router } from 'express';
import * as placeController from '../controllers/place.controller.js';
import { authenticate, authorize, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { createPlaceSchema, updatePlaceSchema, listPlacesQuerySchema, placeIdParamSchema } from '../validators/place.validator.js';

const router = Router();

// ---- Công khai (không cần đăng nhập) ----
router.get('/', validate(listPlacesQuerySchema, 'query'), placeController.list);
router.get('/:id', validate(placeIdParamSchema, 'params'), optionalAuthenticate, placeController.getOne);

// ---- Chỉ ADMIN được tạo/sửa/xoá địa điểm ----
router.post('/', authenticate, authorize('ADMIN'), validate(createPlaceSchema), placeController.create);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(placeIdParamSchema, 'params'),
  validate(updatePlaceSchema),
  placeController.update
);
router.delete('/:id', authenticate, authorize('ADMIN'), validate(placeIdParamSchema, 'params'), placeController.remove);
router.post(
  '/:id/cover',
  authenticate,
  authorize('ADMIN'),
  validate(placeIdParamSchema, 'params'),
  uploadImage.single('cover'),
  placeController.uploadCover
);
router.post(
  '/:id/images',
  authenticate,
  authorize('ADMIN'),
  validate(placeIdParamSchema, 'params'),
  uploadImage.array('images', 10),
  placeController.uploadGallery
);

export default router;
