import { Router } from 'express';
import * as scheduleController from '../controllers/schedule.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  tripIdParamSchema,
  scheduleIdParamSchema,
  createScheduleSchema,
  updateScheduleSchema,
  reorderSchedulesSchema
} from '../validators/schedule.validator.js';

const router = Router();

router.use(authenticate);

// GET  /trips/:tripId/days                    -> toàn bộ lịch trình theo từng ngày
// POST /trips/:tripId/schedules                -> thêm hoạt động vào 1 ngày
// PATCH /trips/:tripId/schedules/reorder        -> kéo-thả sắp xếp lại (đặt trước /:scheduleId để không bị nuốt route)
// PATCH /trips/:tripId/schedules/:scheduleId    -> sửa 1 hoạt động
// DELETE /trips/:tripId/schedules/:scheduleId   -> xoá 1 hoạt động

router.get('/:tripId/days', validate(tripIdParamSchema, 'params'), scheduleController.listDays);

router.post(
  '/:tripId/schedules',
  validate(tripIdParamSchema, 'params'),
  validate(createScheduleSchema),
  scheduleController.createSchedule
);

router.patch(
  '/:tripId/schedules/reorder',
  validate(tripIdParamSchema, 'params'),
  validate(reorderSchedulesSchema),
  scheduleController.reorderSchedules
);

router.patch(
  '/:tripId/schedules/:scheduleId',
  validate(scheduleIdParamSchema, 'params'),
  validate(updateScheduleSchema),
  scheduleController.updateSchedule
);

router.delete(
  '/:tripId/schedules/:scheduleId',
  validate(scheduleIdParamSchema, 'params'),
  scheduleController.deleteSchedule
);

export default router;
