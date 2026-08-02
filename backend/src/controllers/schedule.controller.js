import { scheduleService } from '../services/schedule.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listDays = catchAsync(async (req, res) => {
  const days = await scheduleService.listDays(req.user.id, req.params.tripId);
  sendSuccess(res, { message: 'Lấy lịch trình thành công.', data: { days } });
});

export const createSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.createSchedule(req.user.id, req.params.tripId, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Thêm hoạt động vào lịch trình thành công.', data: { schedule } });
});

export const updateSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.updateSchedule(req.user.id, req.params.tripId, req.params.scheduleId, req.body);
  sendSuccess(res, { message: 'Cập nhật lịch trình thành công.', data: { schedule } });
});

export const deleteSchedule = catchAsync(async (req, res) => {
  await scheduleService.deleteSchedule(req.user.id, req.params.tripId, req.params.scheduleId);
  sendSuccess(res, { message: 'Xoá hoạt động khỏi lịch trình thành công.' });
});

export const reorderSchedules = catchAsync(async (req, res) => {
  const days = await scheduleService.reorderSchedules(req.user.id, req.params.tripId, req.body.items);
  sendSuccess(res, { message: 'Sắp xếp lịch trình thành công.', data: { days } });
});
