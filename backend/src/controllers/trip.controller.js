import { tripService } from '../services/trip.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { saveResizedImage } from '../helpers/image.helper.js';

export const create = catchAsync(async (req, res) => {
  const trip = await tripService.createTrip(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Tạo chuyến đi thành công.', data: { trip } });
});

export const list = catchAsync(async (req, res) => {
  const { trips, meta } = await tripService.listTrips(req.user.id, req.query);
  sendSuccess(res, { message: 'Lấy danh sách chuyến đi thành công.', data: { trips }, meta });
});

export const getOne = catchAsync(async (req, res) => {
  const trip = await tripService.getTripById(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Lấy thông tin chuyến đi thành công.', data: { trip } });
});

export const update = catchAsync(async (req, res) => {
  const trip = await tripService.updateTrip(req.user.id, req.params.id, req.body);
  sendSuccess(res, { message: 'Cập nhật chuyến đi thành công.', data: { trip } });
});

export const remove = catchAsync(async (req, res) => {
  await tripService.deleteTrip(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Xoá chuyến đi thành công.' });
});

export const uploadCover = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('Vui lòng chọn một tệp ảnh.', 400);
  }

  const coverImageUrl = await saveResizedImage(req.file.buffer, { folder: 'trips', size: 900 });
  const trip = await tripService.updateCover(req.user.id, req.params.id, coverImageUrl);

  sendSuccess(res, { message: 'Cập nhật ảnh bìa thành công.', data: { trip } });
});
