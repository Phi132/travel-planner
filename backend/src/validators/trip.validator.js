import { z } from 'zod';

const TRIP_STATUSES = ['PREPARING', 'ONGOING', 'COMPLETED'];

const baseTripFields = {
  name: z.string().trim().min(3, 'Tên chuyến đi phải có ít nhất 3 ký tự.').max(150, 'Tên chuyến đi quá dài.'),
  description: z.string().trim().max(2000, 'Mô tả tối đa 2000 ký tự.').optional(),
  startDate: z.coerce.date({ invalid_type_error: 'Ngày bắt đầu không hợp lệ.', required_error: 'Ngày bắt đầu là bắt buộc.' }),
  endDate: z.coerce.date({ invalid_type_error: 'Ngày kết thúc không hợp lệ.', required_error: 'Ngày kết thúc là bắt buộc.' }),
  companions: z.array(z.string().trim().min(1)).max(30, 'Tối đa 30 người đi cùng.').optional(),
  budget: z.coerce.number({ invalid_type_error: 'Ngân sách không hợp lệ.' }).nonnegative('Ngân sách không được âm.').optional(),
  transportation: z.string().trim().max(100, 'Phương tiện di chuyển quá dài.').optional()
};

function refineDateRange(schema) {
  return schema.refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
    path: ['endDate']
  });
}

export const createTripSchema = refineDateRange(z.object(baseTripFields));

export const updateTripSchema = refineDateRange(
  z
    .object({
      ...baseTripFields,
      name: baseTripFields.name.optional(),
      startDate: baseTripFields.startDate.optional(),
      endDate: baseTripFields.endDate.optional(),
      status: z.enum(TRIP_STATUSES, { invalid_type_error: 'Trạng thái không hợp lệ.' }).optional()
    })
    .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' })
);

export const listTripsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  status: z.enum(TRIP_STATUSES).optional(),
  search: z.string().trim().max(150).optional()
});

export const tripIdParamSchema = z.object({
  id: z.string().uuid('ID chuyến đi không hợp lệ.')
});
