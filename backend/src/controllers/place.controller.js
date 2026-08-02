import { placeService } from '../services/place.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { saveResizedImage } from '../helpers/image.helper.js';

export const list = catchAsync(async (req, res) => {
  const { places, meta } = await placeService.listPlaces(req.query);
  sendSuccess(res, { message: 'Lấy danh sách địa điểm thành công.', data: { places }, meta });
});

export const getOne = catchAsync(async (req, res) => {
  // req.user chỉ tồn tại nếu có middleware authenticate (route chi tiết là public
  // nhưng vẫn muốn biết trạng thái yêu thích nếu người dùng đã đăng nhập).
  const place = await placeService.getPlaceById(req.params.id, req.user?.id);
  sendSuccess(res, { message: 'Lấy thông tin địa điểm thành công.', data: { place } });
});

export const create = catchAsync(async (req, res) => {
  const place = await placeService.createPlace(req.body);
  sendSuccess(res, { statusCode: 201, message: 'Tạo địa điểm thành công.', data: { place } });
});

export const update = catchAsync(async (req, res) => {
  const place = await placeService.updatePlace(req.params.id, req.body);
  sendSuccess(res, { message: 'Cập nhật địa điểm thành công.', data: { place } });
});

export const remove = catchAsync(async (req, res) => {
  await placeService.deletePlace(req.params.id);
  sendSuccess(res, { message: 'Xoá địa điểm thành công.' });
});

export const uploadCover = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('Vui lòng chọn một tệp ảnh.', 400);
  const coverImageUrl = await saveResizedImage(req.file.buffer, { folder: 'places', size: 1000 });
  const place = await placeService.setCoverImage(req.params.id, coverImageUrl);
  sendSuccess(res, { message: 'Cập nhật ảnh bìa thành công.', data: { place } });
});

export const uploadGallery = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) throw new AppError('Vui lòng chọn ít nhất một tệp ảnh.', 400);

  const urls = [];
  for (const file of req.files) {
    // eslint-disable-next-line no-await-in-loop
    const url = await saveResizedImage(file.buffer, { folder: 'places', size: 1000 });
    urls.push(url);
  }

  const images = await placeService.addGalleryImages(req.params.id, urls);
  sendSuccess(res, { statusCode: 201, message: 'Tải ảnh lên thành công.', data: { images } });
});
