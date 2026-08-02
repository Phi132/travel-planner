import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự.').max(100, 'Họ tên quá dài.').optional(),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ.')
      .optional(),
    bio: z.string().trim().max(500, 'Giới thiệu tối đa 500 ký tự.').optional(),
    dateOfBirth: z.coerce.date({ invalid_type_error: 'Ngày sinh không hợp lệ.' }).optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc.'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.').max(100, 'Mật khẩu mới quá dài.')
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
    path: ['newPassword']
  });
