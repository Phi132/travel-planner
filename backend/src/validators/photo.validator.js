import { z } from 'zod';

export const listPhotosQuerySchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  tripDayId: z.string().uuid('Ngày không hợp lệ.').optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(40)
});

export const uploadPhotosBodySchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  tripDayId: z.string().uuid('Ngày không hợp lệ.').optional(),
  placeId: z.string().uuid('Địa điểm không hợp lệ.').optional(),
  caption: z.string().trim().max(300, 'Chú thích quá dài.').optional()
});

export const photoIdParamSchema = z.object({
  id: z.string().uuid('ID ảnh không hợp lệ.')
});
