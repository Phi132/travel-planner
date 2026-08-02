import { Router } from 'express';
import * as photoController from '../controllers/photo.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { listPhotosQuerySchema, uploadPhotosBodySchema, photoIdParamSchema } from '../validators/photo.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(listPhotosQuerySchema, 'query'), photoController.list);
router.post('/', uploadImage.array('photos', 20), validate(uploadPhotosBodySchema), photoController.upload);
router.delete('/:id', validate(photoIdParamSchema, 'params'), photoController.remove);

export default router;
