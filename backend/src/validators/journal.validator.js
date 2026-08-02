import { z } from 'zod';

const WEATHER_VALUES = ['SUNNY', 'CLOUDY', 'RAINY', 'STORMY', 'COOL', 'HOT', 'SNOWY'];

export const createJournalSchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  tripDayId: z.string().uuid('Ngày trong chuyến đi không hợp lệ.').optional().nullable(),
  date: z.coerce.date({ required_error: 'Ngày là bắt buộc.', invalid_type_error: 'Ngày không hợp lệ.' }),
  content: z.string().trim().max(5000, 'Nội dung tối đa 5000 ký tự.').optional(),
  mood: z.string().trim().max(50, 'Cảm xúc quá dài.').optional(),
  weather: z.enum(WEATHER_VALUES, { invalid_type_error: 'Thời tiết không hợp lệ.' }).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  placeIds: z.array(z.string().uuid()).max(20, 'Tối đa 20 địa điểm mỗi ngày.').optional()
});

export const updateJournalSchema = z
  .object({
    tripDayId: z.string().uuid().optional().nullable(),
    date: z.coerce.date().optional(),
    content: z.string().trim().max(5000).optional(),
    mood: z.string().trim().max(50).optional(),
    weather: z.enum(WEATHER_VALUES).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    placeIds: z.array(z.string().uuid()).max(20).optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' });

export const listJournalsQuerySchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20)
});

export const journalIdParamSchema = z.object({
  id: z.string().uuid('ID nhật ký không hợp lệ.')
});

export const journalPhotoParamSchema = z.object({
  id: z.string().uuid('ID nhật ký không hợp lệ.'),
  photoId: z.string().uuid('ID ảnh không hợp lệ.')
});
