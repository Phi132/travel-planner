import { prisma } from '../config/prisma.js';

/**
 * Gộp chi phí theo tháng (YYYY-MM) để vẽ biểu đồ xu hướng chi tiêu theo thời
 * gian. Gộp bằng JS thay vì raw SQL group-by-date để giữ code portable, và
 * vì khối lượng chi phí của 1 người dùng cá nhân không đủ lớn để cần tối ưu
 * ở tầng database.
 */
function groupExpensesByMonth(expenses) {
  const map = new Map();
  for (const expense of expenses) {
    const monthKey = expense.date.toISOString().slice(0, 7); // "YYYY-MM"
    map.set(monthKey, (map.get(monthKey) ?? 0) + Number(expense.amount));
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}

async function getOverview(userId) {
  const [totalTrips, totalDays, expenseAgg, expenses, visitedFavorites, trips] = await Promise.all([
    prisma.trip.count({ where: { userId, deletedAt: null } }),
    prisma.tripDay.count({ where: { trip: { userId, deletedAt: null } } }),
    prisma.expense.aggregate({ where: { userId, deletedAt: null }, _sum: { amount: true } }),
    prisma.expense.findMany({
      where: { userId, deletedAt: null },
      select: { date: true, amount: true },
      orderBy: { date: 'asc' }
    }),
    prisma.favorite.findMany({
      where: { userId, status: 'VISITED' },
      select: {
        place: { select: { provinceId: true, districtId: true } }
      }
    }),
    prisma.trip.findMany({
      where: { userId, deletedAt: null },
      orderBy: { startDate: 'desc' },
      take: 50,
      select: { id: true, name: true, startDate: true, endDate: true, status: true, coverImageUrl: true }
    })
  ]);

  const provincesVisited = new Set(visitedFavorites.map((f) => f.place.provinceId)).size;
  const districtsVisited = new Set(visitedFavorites.filter((f) => f.place.districtId).map((f) => f.place.districtId)).size;
  const placesVisited = visitedFavorites.length;

  return {
    totalTrips,
    totalDays,
    totalExpense: Number(expenseAgg._sum.amount ?? 0),
    provincesVisited,
    districtsVisited,
    placesVisited,
    monthlyExpenses: groupExpensesByMonth(expenses),
    timeline: trips
  };
}

export const statisticsService = { getOverview };
