import { z } from 'zod';

const basePlaceFields = {
  name: z.string().trim().min(2, 'Tên địa điểm phải có ít nhất 2 ký tự.').max(200, 'Tên địa điểm quá dài.'),
  description: z.string().trim().max(3000, 'Mô tả tối đa 3000 ký tự.').optional(),
  address: z.string().trim().min(5, 'Địa chỉ phải có ít nhất 5 ký tự.').max(500, 'Địa chỉ quá dài.'),
  provinceId: z.string().uuid('Tỉnh/thành không hợp lệ.'),
  districtId: z.string().uuid('Quận/huyện không hợp lệ.').optional().nullable(),
  categoryId: z.string().uuid('Danh mục không hợp lệ.'),
  latitude: z.coerce.number({ required_error: 'Vĩ độ là bắt buộc.' }).min(-90).max(90),
  longitude: z.coerce.number({ required_error: 'Kinh độ là bắt buộc.' }).min(-180).max(180),
  openHours: z.string().trim().max(200).optional(),
  ticketPrice: z.string().trim().max(100).optional(),
  isFeatured: z.coerce.boolean().optional()
};

export const createPlaceSchema = z.object(basePlaceFields);

export const updatePlaceSchema = z
  .object({
    ...basePlaceFields,
    name: basePlaceFields.name.optional(),
    address: basePlaceFields.address.optional(),
    provinceId: basePlaceFields.provinceId.optional(),
    categoryId: basePlaceFields.categoryId.optional(),
    latitude: basePlaceFields.latitude.optional(),
    longitude: basePlaceFields.longitude.optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' });

export const listPlacesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  provinceSlug: z.string().trim().optional(),
  districtSlug: z.string().trim().optional(),
  categorySlug: z.string().trim().optional(),
  search: z.string().trim().max(150).optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  sort: z.enum(['rating', 'newest', 'name']).optional().default('rating')
});

export const placeIdParamSchema = z.object({
  id: z.string().uuid('ID địa điểm không hợp lệ.')
});
