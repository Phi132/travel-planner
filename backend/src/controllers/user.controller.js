import { userService } from '../services/user.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { saveResizedImage } from '../helpers/image.helper.js';

export const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess(res, { message: 'Cập nhật hồ sơ thành công.', data: { user } });
});

export const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  sendSuccess(res, { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
});

export const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('Vui lòng chọn một tệp ảnh.', 400);
  }

  const avatarUrl = await saveResizedImage(req.file.buffer, { folder: 'avatars', size: 512 });
  const user = await userService.updateAvatar(req.user.id, avatarUrl);

  sendSuccess(res, { message: 'Cập nhật ảnh đại diện thành công.', data: { user } });
});
