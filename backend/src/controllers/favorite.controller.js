import { favoriteService } from '../services/favorite.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const set = catchAsync(async (req, res) => {
  const favorite = await favoriteService.setFavorite(req.user.id, req.params.placeId, req.body.status);
  sendSuccess(res, { message: 'Cập nhật yêu thích thành công.', data: { favorite } });
});

export const remove = catchAsync(async (req, res) => {
  await favoriteService.removeFavorite(req.user.id, req.params.placeId);
  sendSuccess(res, { message: 'Đã bỏ yêu thích.' });
});

export const list = catchAsync(async (req, res) => {
  const { favorites, meta } = await favoriteService.listFavorites(req.user.id, req.query);
  sendSuccess(res, { message: 'Lấy danh sách yêu thích thành công.', data: { favorites }, meta });
});
