import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.')
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.').max(100),
    email: z.string().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
    phone: z
      .string()
      .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ.')
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp.',
    path: ['confirmPassword']
  });

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.').max(100),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ.')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Giới thiệu tối đa 500 ký tự.').optional().or(z.literal(''))
});

export const scheduleSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tên hoạt động.').max(150, 'Tên hoạt động quá dài.'),
  startTime: z.string().min(1, 'Vui lòng chọn giờ bắt đầu.'),
  endTime: z.string().optional().or(z.literal('')),
  placeId: z.string().optional().or(z.literal('')),
  travelTimeMinutes: z.string().optional().or(z.literal('')),
  note: z.string().max(1000, 'Ghi chú quá dài.').optional().or(z.literal(''))
});

export const tripSchema = z
  .object({
    name: z.string().min(3, 'Tên chuyến đi phải có ít nhất 3 ký tự.').max(150, 'Tên chuyến đi quá dài.'),
    startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu.'),
    endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc.'),
    transportation: z.string().max(100, 'Quá dài.').optional().or(z.literal('')),
    budget: z.string().optional().or(z.literal('')),
    companions: z.string().max(500, 'Quá dài.').optional().or(z.literal('')),
    description: z.string().max(2000, 'Mô tả tối đa 2000 ký tự.').optional().or(z.literal('')),
    status: z.enum(['PREPARING', 'ONGOING', 'COMPLETED']).optional()
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
    path: ['endDate']
  });

export const expenseSchema = z.object({
  category: z.enum(['FOOD', 'HOTEL', 'TRANSPORT', 'SHOPPING', 'TICKET', 'OTHER'], {
    invalid_type_error: 'Vui lòng chọn danh mục.'
  }),
  amount: z
    .string()
    .min(1, 'Vui lòng nhập số tiền.')
    .refine((v) => Number(v) > 0, 'Số tiền phải lớn hơn 0.'),
  date: z.string().min(1, 'Vui lòng chọn ngày.'),
  description: z.string().max(500, 'Ghi chú tối đa 500 ký tự.').optional().or(z.literal(''))
});

export const JOURNAL_WEATHER_VALUES = ['SUNNY', 'CLOUDY', 'RAINY', 'STORMY', 'COOL', 'HOT', 'SNOWY'];

export const journalSchema = z.object({
  date: z.string().min(1, 'Vui lòng chọn ngày.'),
  weather: z.enum(JOURNAL_WEATHER_VALUES).optional().or(z.literal('')),
  mood: z.string().max(50, 'Cảm xúc quá dài.').optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  content: z.string().max(5000, 'Nội dung tối đa 5000 ký tự.').optional().or(z.literal(''))
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại.'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),
    confirmNewPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu mới.')
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu nhập lại không khớp.',
    path: ['confirmNewPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
    path: ['newPassword']
  });
