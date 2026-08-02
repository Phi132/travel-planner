import { photoService } from '../services/photo.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { saveOriginalRatioImage } from '../helpers/image.helper.js';

export const list = catchAsync(async (req, res) => {
  const { photos, meta } = await photoService.listPhotos(req.user.id, req.query);
  sendSuccess(res, { message: 'Lấy album ảnh thành công.', data: { photos }, meta });
});

export const upload = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('Vui lòng chọn ít nhất một tệp ảnh.', 400);
  }

  const urls = [];
  for (const file of req.files) {
    // eslint-disable-next-line no-await-in-loop
    const url = await saveOriginalRatioImage(file.buffer, { folder: 'photos' });
    urls.push(url);
  }

  const photos = await photoService.createPhotos(req.user.id, req.body, urls);
  sendSuccess(res, { statusCode: 201, message: `Tải lên ${photos.length} ảnh thành công.`, data: { photos } });
});

export const remove = catchAsync(async (req, res) => {
  await photoService.deletePhoto(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Xoá ảnh thành công.' });
});
