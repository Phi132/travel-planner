import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ required_error: 'Email là bắt buộc.' }).email('Email không hợp lệ.').trim().toLowerCase(),
  password: z
    .string({ required_error: 'Mật khẩu là bắt buộc.' })
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
    .max(100, 'Mật khẩu quá dài.'),
  fullName: z
    .string({ required_error: 'Họ tên là bắt buộc.' })
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự.')
    .max(100, 'Họ tên quá dài.'),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ.')
    .optional()
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email là bắt buộc.' }).email('Email không hợp lệ.').trim().toLowerCase(),
  password: z.string({ required_error: 'Mật khẩu là bắt buộc.' }).min(1, 'Mật khẩu là bắt buộc.')
});
