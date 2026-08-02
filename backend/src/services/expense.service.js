import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';

/**
 * amount là Prisma.Decimal -> convert về Number cho dễ dùng ở Frontend
 * (đồng bộ cách làm với trip.service.js cho field budget).
 */
function serializeExpense(expense) {
  if (!expense) return expense;
  return { ...expense, amount: Number(expense.amount) };
}

/**
 * Xác thực chuyến đi thuộc về user (Expense không có sẵn userId trên input,
 * phải suy ra qua tripId) — đồng bộ cách làm với journal.service.js.
 */
async function findOwnedTripOrThrow(userId, tripId) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId, deletedAt: null } });
  if (!trip) throw new AppError('Không tìm thấy chuyến đi.', 404);
  return trip;
}

async function findOwnedExpenseOrThrow(userId, expenseId) {
  const expense = await prisma.expense.findFirst({ where: { id: expenseId, userId, deletedAt: null } });
  if (!expense) throw new AppError('Không tìm thấy khoản chi.', 404);
  return expense;
}

async function createExpense(userId, data) {
  await findOwnedTripOrThrow(userId, data.tripId);

  const expense = await prisma.expense.create({
    data: {
      tripId: data.tripId,
      userId,
      category: data.category,
      amount: data.amount,
      description: data.description ?? null,
      date: data.date
    }
  });

  return serializeExpense(expense);
}

async function listExpenses(userId, { tripId, category, page, limit }) {
  await findOwnedTripOrThrow(userId, tripId);

  const where = { tripId, userId, deletedAt: null, ...(category ? { category } : {}) };

  const [expenses, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.expense.count({ where })
  ]);

  return {
    expenses: expenses.map(serializeExpense),
    meta: buildPaginationMeta({ page, limit, total })
  };
}

async function getExpenseById(userId, expenseId) {
  const expense = await findOwnedExpenseOrThrow(userId, expenseId);
  return serializeExpense(expense);
}

async function updateExpense(userId, expenseId, data) {
  await findOwnedExpenseOrThrow(userId, expenseId);

  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.amount !== undefined ? { amount: data.amount } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.date !== undefined ? { date: data.date } : {})
    }
  });

  return serializeExpense(expense);
}

async function deleteExpense(userId, expenseId) {
  await findOwnedExpenseOrThrow(userId, expenseId);
  await prisma.expense.update({ where: { id: expenseId }, data: { deletedAt: new Date() } });
}

/**
 * Tổng chi phí + phân bổ theo từng danh mục cho 1 chuyến đi — phục vụ biểu
 * đồ/tổng quan ở trang Chi phí, tránh Frontend phải tự cộng dồn từ danh sách.
 */
async function getSummary(userId, tripId) {
  await findOwnedTripOrThrow(userId, tripId);

  const where = { tripId, userId, deletedAt: null };

  const grouped = await prisma.expense.groupBy({
    by: ['category'],
    where,
    _sum: { amount: true },
    _count: { _all: true }
  });

  const byCategory = grouped.map((g) => ({
    category: g.category,
    total: Number(g._sum.amount ?? 0),
    count: g._count._all
  }));

  const total = byCategory.reduce((sum, item) => sum + item.total, 0);

  return { total, byCategory };
}

export const expenseService = {
  createExpense,
  listExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getSummary
};
