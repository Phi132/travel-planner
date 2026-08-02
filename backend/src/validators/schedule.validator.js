import { z } from 'zod';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeField = (msg) => z.string().regex(TIME_REGEX, msg);

export const tripIdParamSchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.')
});

export const scheduleIdParamSchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  scheduleId: z.string().uuid('Hoạt động trong lịch trình không hợp lệ.')
});

export const createScheduleSchema = z.object({
  tripDayId: z.string().uuid('Ngày trong lịch trình không hợp lệ.'),
  placeId: z.string().uuid('Địa điểm không hợp lệ.').optional().nullable(),
  title: z.string().trim().min(1, 'Tên hoạt động là bắt buộc.').max(150, 'Tên hoạt động quá dài.'),
  startTime: timeField('Giờ bắt đầu không hợp lệ (định dạng HH:mm).'),
  endTime: timeField('Giờ kết thúc không hợp lệ (định dạng HH:mm).').optional().nullable(),
  note: z.string().trim().max(1000, 'Ghi chú quá dài.').optional().nullable(),
  travelTimeMinutes: z.coerce.number().int().min(0).max(1440).optional().nullable()
});

export const updateScheduleSchema = z
  .object({
    tripDayId: z.string().uuid('Ngày trong lịch trình không hợp lệ.').optional(),
    placeId: z.string().uuid('Địa điểm không hợp lệ.').optional().nullable(),
    title: z.string().trim().min(1).max(150).optional(),
    startTime: timeField('Giờ bắt đầu không hợp lệ (định dạng HH:mm).').optional(),
    endTime: timeField('Giờ kết thúc không hợp lệ (định dạng HH:mm).').optional().nullable(),
    note: z.string().trim().max(1000).optional().nullable(),
    travelTimeMinutes: z.coerce.number().int().min(0).max(1440).optional().nullable(),
    isCompleted: z.coerce.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' });

// Dùng cho kéo-thả (Drag & Drop): nhận danh sách các hoạt động đã được sắp
// xếp lại (có thể đổi cả ngày lẫn thứ tự), cập nhật đồng loạt trong 1 transaction.
export const reorderSchedulesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        tripDayId: z.string().uuid(),
        sortOrder: z.coerce.number().int().min(0)
      })
    )
    .min(1, 'Danh sách sắp xếp không được rỗng.')
    .max(200, 'Số lượng hoạt động vượt giới hạn cho phép.')
});
