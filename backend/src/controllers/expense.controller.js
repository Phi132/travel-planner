import { expenseService } from '../services/expense.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const create = catchAsync(async (req, res) => {
  const expense = await expenseService.createExpense(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, message: 'Thêm khoản chi thành công.', data: { expense } });
});

export const list = catchAsync(async (req, res) => {
  const { expenses, meta } = await expenseService.listExpenses(req.user.id, req.query);
  sendSuccess(res, { message: 'Lấy danh sách chi phí thành công.', data: { expenses }, meta });
});

export const getOne = catchAsync(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Lấy thông tin khoản chi thành công.', data: { expense } });
});

export const update = catchAsync(async (req, res) => {
  const expense = await expenseService.updateExpense(req.user.id, req.params.id, req.body);
  sendSuccess(res, { message: 'Cập nhật khoản chi thành công.', data: { expense } });
});

export const remove = catchAsync(async (req, res) => {
  await expenseService.deleteExpense(req.user.id, req.params.id);
  sendSuccess(res, { message: 'Xoá khoản chi thành công.' });
});

export const summary = catchAsync(async (req, res) => {
  const data = await expenseService.getSummary(req.user.id, req.query.tripId);
  sendSuccess(res, { message: 'Lấy tổng quan chi phí thành công.', data });
});
