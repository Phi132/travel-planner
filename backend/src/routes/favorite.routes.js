import { Router } from 'express';
import * as favoriteController from '../controllers/favorite.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { setFavoriteSchema, listFavoritesQuerySchema, placeIdParamSchema } from '../validators/favorite.validator.js';

const router = Router();

// Toàn bộ route Favorites đều thao tác trên dữ liệu của chính user đang đăng nhập.
router.use(authenticate);

router.get('/', validate(listFavoritesQuerySchema, 'query'), favoriteController.list);
router.put('/:placeId', validate(placeIdParamSchema, 'params'), validate(setFavoriteSchema), favoriteController.set);
router.delete('/:placeId', validate(placeIdParamSchema, 'params'), favoriteController.remove);

export default router;
