import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';

const SCHEDULE_INCLUDE = {
  place: {
    select: { id: true, name: true, slug: true, coverImageUrl: true, address: true, latitude: true, longitude: true }
  }
};

function serializeSchedule(schedule) {
  if (!schedule) return schedule;
  return {
    ...schedule,
    place: schedule.place
      ? { ...schedule.place, latitude: Number(schedule.place.latitude), longitude: Number(schedule.place.longitude) }
      : null
  };
}

async function findOwnedTripOrThrow(userId, tripId) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId, deletedAt: null } });
  if (!trip) throw new AppError('Không tìm thấy chuyến đi.', 404);
  return trip;
}

/**
 * Lấy toàn bộ lịch trình của 1 chuyến đi, gộp theo từng ngày — đúng cấu trúc
 * Frontend cần để hiển thị Tab "Ngày 1 / Ngày 2..." kèm Timeline bên trong.
 */
async function listDays(userId, tripId) {
  await findOwnedTripOrThrow(userId, tripId);

  const days = await prisma.tripDay.findMany({
    where: { tripId },
    orderBy: { dayNumber: 'asc' },
    include: { schedules: { orderBy: { sortOrder: 'asc' }, include: SCHEDULE_INCLUDE } }
  });

  return days.map((day) => ({
    ...day,
    schedules: day.schedules.map(serializeSchedule)
  }));
}

async function assertTripDayBelongsToTrip(tripDayId, tripId) {
  const tripDay = await prisma.tripDay.findFirst({ where: { id: tripDayId, tripId } });
  if (!tripDay) throw new AppError('Ngày trong lịch trình không thuộc chuyến đi này.', 422);
  return tripDay;
}

async function assertPlaceExists(placeId) {
  if (!placeId) return;
  const place = await prisma.place.findFirst({ where: { id: placeId, deletedAt: null } });
  if (!place) throw new AppError('Không tìm thấy địa điểm.', 422);
}

async function createSchedule(userId, tripId, data) {
  await findOwnedTripOrThrow(userId, tripId);
  await assertTripDayBelongsToTrip(data.tripDayId, tripId);
  await assertPlaceExists(data.placeId);

  const lastItem = await prisma.tripSchedule.findFirst({
    where: { tripDayId: data.tripDayId },
    orderBy: { sortOrder: 'desc' }
  });

  const schedule = await prisma.tripSchedule.create({
    data: {
      tripDayId: data.tripDayId,
      placeId: data.placeId ?? null,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      note: data.note ?? null,
      travelTimeMinutes: data.travelTimeMinutes ?? null,
      sortOrder: (lastItem?.sortOrder ?? -1) + 1
    },
    include: SCHEDULE_INCLUDE
  });

  return serializeSchedule(schedule);
}

/**
 * Xác thực 1 hoạt động lịch trình thuộc về chuyến đi của user hiện tại —
 * đi qua quan hệ TripSchedule -> TripDay -> Trip vì TripSchedule không lưu
 * trực tiếp userId/tripId.
 */
async function findOwnedScheduleOrThrow(userId, tripId, scheduleId) {
  const schedule = await prisma.tripSchedule.findFirst({
    where: { id: scheduleId, tripDay: { tripId, trip: { userId, deletedAt: null } } },
    include: SCHEDULE_INCLUDE
  });
  if (!schedule) throw new AppError('Không tìm thấy hoạt động trong lịch trình.', 404);
  return schedule;
}

async function updateSchedule(userId, tripId, scheduleId, data) {
  await findOwnedScheduleOrThrow(userId, tripId, scheduleId);

  if (data.tripDayId !== undefined) {
    await assertTripDayBelongsToTrip(data.tripDayId, tripId);
  }
  if (data.placeId !== undefined) {
    await assertPlaceExists(data.placeId);
  }

  const schedule = await prisma.tripSchedule.update({
    where: { id: scheduleId },
    data: {
      ...(data.tripDayId !== undefined ? { tripDayId: data.tripDayId } : {}),
      ...(data.placeId !== undefined ? { placeId: data.placeId } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
      ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
      ...(data.note !== undefined ? { note: data.note } : {}),
      ...(data.travelTimeMinutes !== undefined ? { travelTimeMinutes: data.travelTimeMinutes } : {}),
      ...(data.isCompleted !== undefined ? { isCompleted: data.isCompleted } : {})
    },
    include: SCHEDULE_INCLUDE
  });

  return serializeSchedule(schedule);
}

async function deleteSchedule(userId, tripId, scheduleId) {
  await findOwnedScheduleOrThrow(userId, tripId, scheduleId);
  await prisma.tripSchedule.delete({ where: { id: scheduleId } });
}

/**
 * Cập nhật hàng loạt vị trí (sortOrder) và ngày (tripDayId) sau khi người
 * dùng kéo-thả sắp xếp lại lịch trình ở Frontend. Chạy trong 1 transaction
 * để đảm bảo toàn bộ thứ tự được cập nhật đồng nhất, tránh trạng thái nửa vời.
 */
async function reorderSchedules(userId, tripId, items) {
  await findOwnedTripOrThrow(userId, tripId);

  const scheduleIds = items.map((i) => i.id);
  const owned = await prisma.tripSchedule.findMany({
    where: { id: { in: scheduleIds }, tripDay: { tripId, trip: { userId, deletedAt: null } } },
    select: { id: true }
  });
  if (owned.length !== items.length) {
    throw new AppError('Một số hoạt động không hợp lệ hoặc không thuộc chuyến đi này.', 422);
  }

  const dayIds = [...new Set(items.map((i) => i.tripDayId))];
  const validDays = await prisma.tripDay.findMany({ where: { id: { in: dayIds }, tripId }, select: { id: true } });
  if (validDays.length !== dayIds.length) {
    throw new AppError('Một số ngày trong lịch trình không hợp lệ.', 422);
  }

  await prisma.$transaction(
    items.map((item) =>
      prisma.tripSchedule.update({
        where: { id: item.id },
        data: { tripDayId: item.tripDayId, sortOrder: item.sortOrder }
      })
    )
  );

  return listDays(userId, tripId);
}

export const scheduleService = {
  listDays,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  reorderSchedules
};
