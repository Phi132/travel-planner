import { z } from 'zod';

const EXPENSE_CATEGORIES = ['FOOD', 'HOTEL', 'TRANSPORT', 'SHOPPING', 'TICKET', 'OTHER'];

export const createExpenseSchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  category: z.enum(EXPENSE_CATEGORIES, { required_error: 'Danh mục chi phí là bắt buộc.', invalid_type_error: 'Danh mục chi phí không hợp lệ.' }),
  amount: z.coerce.number({ required_error: 'Số tiền là bắt buộc.', invalid_type_error: 'Số tiền không hợp lệ.' }).positive('Số tiền phải lớn hơn 0.'),
  description: z.string().trim().max(500, 'Ghi chú tối đa 500 ký tự.').optional(),
  date: z.coerce.date({ required_error: 'Ngày chi tiêu là bắt buộc.', invalid_type_error: 'Ngày chi tiêu không hợp lệ.' })
});

export const updateExpenseSchema = z
  .object({
    category: z.enum(EXPENSE_CATEGORIES, { invalid_type_error: 'Danh mục chi phí không hợp lệ.' }).optional(),
    amount: z.coerce.number({ invalid_type_error: 'Số tiền không hợp lệ.' }).positive('Số tiền phải lớn hơn 0.').optional(),
    description: z.string().trim().max(500, 'Ghi chú tối đa 500 ký tự.').optional(),
    date: z.coerce.date({ invalid_type_error: 'Ngày chi tiêu không hợp lệ.' }).optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Cần ít nhất một trường để cập nhật.' });

export const listExpensesQuerySchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.'),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

export const expenseSummaryQuerySchema = z.object({
  tripId: z.string().uuid('Chuyến đi không hợp lệ.')
});

export const expenseIdParamSchema = z.object({
  id: z.string().uuid('ID khoản chi không hợp lệ.')
});
