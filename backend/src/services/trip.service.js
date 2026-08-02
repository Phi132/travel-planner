import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';
import { deleteUploadedFile } from '../helpers/image.helper.js';

/**
 * Chuẩn hóa 1 bản ghi Trip trả về cho client:
 * - companions lưu dạng JSON string trong DB -> parse lại thành mảng.
 * - budget là Prisma.Decimal -> convert về Number cho dễ dùng ở Frontend.
 */
function serializeTrip(trip) {
  if (!trip) return trip;

  let companions = [];
  try {
    companions = trip.companions ? JSON.parse(trip.companions) : [];
  } catch {
    companions = [];
  }

  return {
    ...trip,
    companions,
    budget: trip.budget === null || trip.budget === undefined ? null : Number(trip.budget)
  };
}

/**
 * Đảm bảo trip tồn tại, thuộc về đúng user và chưa bị xoá mềm.
 * Dùng chung cho getOne/update/delete/uploadCover để tránh lặp code.
 */
async function findOwnedTripOrThrow(userId, tripId) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId, deletedAt: null } });
  if (!trip) {
    throw new AppError('Không tìm thấy chuyến đi.', 404);
  }
  return trip;
}

/**
 * Sinh danh sách TripDay (Ngày 1, Ngày 2...) tương ứng khoảng startDate -> endDate.
 * Dùng chung cho tạo mới và đồng bộ lại khi người dùng đổi ngày chuyến đi.
 */
function buildDayRange(startDate, endDate) {
  const days = [];
  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  let dayNumber = 1;
  while (cursor <= end) {
    days.push({ dayNumber, date: new Date(cursor) });
    cursor.setDate(cursor.getDate() + 1);
    dayNumber += 1;
  }
  return days;
}

/**
 * Đồng bộ lại TripDay khi khoảng ngày của chuyến đi thay đổi: thêm ngày còn
 * thiếu, xoá ngày không còn nằm trong khoảng mới, và cập nhật lại dayNumber
 * cho đúng thứ tự.
 *
 * LƯU Ý AN TOÀN DỮ LIỆU: chỉ xoá những ngày KHÔNG nằm trong khoảng mới VÀ
 * chưa có hoạt động nào trong lịch trình (TripSchedule). TripSchedule cấu
 * hình onDelete: Cascade theo TripDay, nên nếu xoá vô điều kiện, người dùng
 * rút ngắn ngày chuyến đi sẽ mất trắng lịch trình đã kéo-thả của những ngày
 * đó mà không có cảnh báo nào. Ngày có hoạt động sẽ được giữ lại (dù nằm
 * ngoài khoảng ngày mới) cho tới khi người dùng tự xoá hết hoạt động của
 * ngày đó — lúc đó lần đồng bộ tiếp theo mới dọn được.
 */
async function syncTripDays(tripId, startDate, endDate) {
  const targetDays = buildDayRange(startDate, endDate);
  const existingDays = await prisma.tripDay.findMany({
    where: { tripId },
    orderBy: { date: 'asc' },
    include: { _count: { select: { schedules: true } } }
  });

  const targetDateKeys = new Set(targetDays.map((d) => d.date.toDateString()));
  const existingDateKeys = new Set(existingDays.map((d) => d.date.toDateString()));

  const daysToDelete = existingDays.filter(
    (d) => !targetDateKeys.has(d.date.toDateString()) && d._count.schedules === 0
  );
  const daysToCreate = targetDays.filter((d) => !existingDateKeys.has(d.date.toDateString()));

  await prisma.$transaction([
    ...daysToDelete.map((d) => prisma.tripDay.delete({ where: { id: d.id } })),
    ...daysToCreate.map((d) => prisma.tripDay.create({ data: { tripId, dayNumber: d.dayNumber, date: d.date } })),
  ]);

  // Đánh lại số thứ tự ngày (dayNumber) cho toàn bộ ngày còn lại theo đúng thứ tự thời gian.
  const remainingDays = await prisma.tripDay.findMany({ where: { tripId }, orderBy: { date: 'asc' } });
  await prisma.$transaction(
    remainingDays.map((d, index) =>
      prisma.tripDay.update({ where: { id: d.id }, data: { dayNumber: index + 1 } })
    )
  );
}

async function createTrip(userId, data) {
  const trip = await prisma.trip.create({
    data: {
      userId,
      name: data.name,
      description: data.description ?? null,
      startDate: data.startDate,
      endDate: data.endDate,
      companions: JSON.stringify(data.companions ?? []),
      budget: data.budget ?? null,
      transportation: data.transportation ?? null,
      days: { create: buildDayRange(data.startDate, data.endDate) }
    }
  });

  return serializeTrip(trip);
}

async function listTrips(userId, { page, limit, status, search }) {
  const where = {
    userId,
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(search ? { name: { contains: search } } : {})
  };

  const [trips, total] = await prisma.$transaction([
    prisma.trip.findMany({
      where,
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.trip.count({ where })
  ]);

  return {
    trips: trips.map(serializeTrip),
    meta: buildPaginationMeta({ page, limit, total })
  };
}

async function getTripById(userId, tripId) {
  const trip = await findOwnedTripOrThrow(userId, tripId);
  return serializeTrip(trip);
}

async function updateTrip(userId, tripId, data) {
  const existing = await findOwnedTripOrThrow(userId, tripId);

  // Nếu chỉ 1 trong 2 mốc ngày được gửi lên, phải đối chiếu với ngày còn lại
  // đang lưu trong DB để tránh lưu khoảng ngày vô lý (end < start).
  const nextStartDate = data.startDate ?? existing.startDate;
  const nextEndDate = data.endDate ?? existing.endDate;
  if (nextEndDate < nextStartDate) {
    throw new AppError('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.', 422, [
      { field: 'endDate', message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.' }
    ]);
  }

  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
      ...(data.companions !== undefined ? { companions: JSON.stringify(data.companions) } : {}),
      ...(data.budget !== undefined ? { budget: data.budget } : {}),
      ...(data.transportation !== undefined ? { transportation: data.transportation } : {}),
      ...(data.status !== undefined ? { status: data.status } : {})
    }
  });

  // Nếu khoảng ngày thay đổi, đồng bộ lại danh sách TripDay tương ứng.
  if (data.startDate !== undefined || data.endDate !== undefined) {
    await syncTripDays(tripId, nextStartDate, nextEndDate);
  }

  return serializeTrip(trip);
}

async function deleteTrip(userId, tripId) {
  await findOwnedTripOrThrow(userId, tripId);
  await prisma.trip.update({ where: { id: tripId }, data: { deletedAt: new Date() } });
}

async function updateCover(userId, tripId, coverImageUrl) {
  const existing = await findOwnedTripOrThrow(userId, tripId);

  if (existing.coverImageUrl) {
    await deleteUploadedFile(existing.coverImageUrl);
  }

  const trip = await prisma.trip.update({ where: { id: tripId }, data: { coverImageUrl } });
  return serializeTrip(trip);
}

export const tripService = { createTrip, listTrips, getTripById, updateTrip, deleteTrip, updateCover };
