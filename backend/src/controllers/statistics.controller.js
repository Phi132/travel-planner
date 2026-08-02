import { statisticsService } from '../services/statistics.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const overview = catchAsync(async (req, res) => {
  const data = await statisticsService.getOverview(req.user.id);
  sendSuccess(res, { message: 'Lấy thống kê thành công.', data });
});
