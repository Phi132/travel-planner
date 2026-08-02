import { z } from 'zod';

const FAVORITE_STATUSES = ['WANT_TO_GO', 'VISITED', 'LOVED'];

export const setFavoriteSchema = z.object({
  status: z.enum(FAVORITE_STATUSES, { invalid_type_error: 'Trạng thái không hợp lệ.' }).optional().default('WANT_TO_GO')
});

export const listFavoritesQuerySchema = z.object({
  status: z.enum(FAVORITE_STATUSES).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20)
});

export const placeIdParamSchema = z.object({
  placeId: z.string().uuid('ID địa điểm không hợp lệ.')
});
