import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validator.js';

const router = Router();

// Toàn bộ route Users đều thao tác trên chính user đang đăng nhập.
router.use(authenticate);

router.patch('/me', validate(updateProfileSchema), userController.updateProfile);
router.patch('/me/password', validate(changePasswordSchema), userController.changePassword);
router.post('/me/avatar', uploadImage.single('avatar'), userController.uploadAvatar);

export default router;
