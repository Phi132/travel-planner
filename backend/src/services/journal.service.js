import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';

const JOURNAL_INCLUDE = {
  places: { include: { place: { select: { id: true, name: true, slug: true, coverImageUrl: true } } } },
  photos: { include: { photo: true } }
};

/**
 * Chuẩn hóa 1 nhật ký trả về client: gộp `places`/`photos` (bảng trung gian)
 * thành mảng phẳng dễ dùng ở Frontend thay vì lộ cấu trúc JournalPlace/JournalPhoto.
 */
function serializeJournal(journal) {
  if (!journal) return journal;
  return {
    id: journal.id,
    tripId: journal.tripId,
    tripDayId: journal.tripDayId,
    date: journal.date,
    content: journal.content,
    mood: journal.mood,
    weather: journal.weather,
    rating: journal.rating,
    places: (journal.places ?? []).map((jp) => jp.place),
    photos: (journal.photos ?? []).map((jp) => jp.photo),
    createdAt: journal.createdAt,
    updatedAt: journal.updatedAt
  };
}

/**
 * Xác thực chuyến đi thuộc về user (dùng chung cho create/list vì Journal
 * không có userId trực tiếp trên input mà phải suy ra qua tripId).
 */
async function findOwnedTripOrThrow(userId, tripId) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId, deletedAt: null } });
  if (!trip) throw new AppError('Không tìm thấy chuyến đi.', 404);
  return trip;
}

async function findOwnedJournalOrThrow(userId, journalId) {
  const journal = await prisma.journal.findFirst({
    where: { id: journalId, userId, deletedAt: null },
    include: JOURNAL_INCLUDE
  });
  if (!journal) throw new AppError('Không tìm thấy nhật ký.', 404);
  return journal;
}

/**
 * Kiểm tra tripDayId (nếu có) thực sự thuộc về tripId đã cho — tránh trường
 * hợp gán nhầm nhật ký của chuyến đi này vào ngày của chuyến đi khác.
 */
async function assertTripDayBelongsToTrip(tripDayId, tripId) {
  if (!tripDayId) return;
  const tripDay = await prisma.tripDay.findFirst({ where: { id: tripDayId, tripId } });
  if (!tripDay) throw new AppError('Ngày trong lịch trình không thuộc chuyến đi này.', 422);
}

async function createJournal(userId, data) {
  await findOwnedTripOrThrow(userId, data.tripId);
  await assertTripDayBelongsToTrip(data.tripDayId, data.tripId);

  const journal = await prisma.journal.create({
    data: {
      tripId: data.tripId,
      tripDayId: data.tripDayId ?? null,
      userId,
      date: data.date,
      content: data.content ?? null,
      mood: data.mood ?? null,
      weather: data.weather ?? null,
      rating: data.rating ?? null,
      places: data.placeIds?.length ? { create: data.placeIds.map((placeId) => ({ placeId })) } : undefined
    },
    include: JOURNAL_INCLUDE
  });

  return serializeJournal(journal);
}

async function listJournals(userId, { tripId, page, limit }) {
  await findOwnedTripOrThrow(userId, tripId);

  const where = { tripId, userId, deletedAt: null };

  const [journals, total] = await prisma.$transaction([
    prisma.journal.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: JOURNAL_INCLUDE
    }),
    prisma.journal.count({ where })
  ]);

  return {
    journals: journals.map(serializeJournal),
    meta: buildPaginationMeta({ page, limit, total })
  };
}

async function getJournalById(userId, journalId) {
  const journal = await findOwnedJournalOrThrow(userId, journalId);
  return serializeJournal(journal);
}

async function updateJournal(userId, journalId, data) {
  const existing = await findOwnedJournalOrThrow(userId, journalId);
  await assertTripDayBelongsToTrip(data.tripDayId, existing.tripId);

  // Nếu placeIds được gửi lên, thay thế toàn bộ danh sách địa điểm đã ghé
  // thăm bằng danh sách mới (đơn giản, tránh phải diff thêm/bớt phức tạp).
  if (data.placeIds !== undefined) {
    await prisma.journalPlace.deleteMany({ where: { journalId } });
  }

  const journal = await prisma.journal.update({
    where: { id: journalId },
    data: {
      ...(data.tripDayId !== undefined ? { tripDayId: data.tripDayId } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
      ...(data.mood !== undefined ? { mood: data.mood } : {}),
      ...(data.weather !== undefined ? { weather: data.weather } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.placeIds !== undefined
        ? { places: { create: data.placeIds.map((placeId) => ({ placeId })) } }
        : {})
    },
    include: JOURNAL_INCLUDE
  });

  return serializeJournal(journal);
}

async function deleteJournal(userId, journalId) {
  await findOwnedJournalOrThrow(userId, journalId);
  await prisma.journal.update({ where: { id: journalId }, data: { deletedAt: new Date() } });
}

export const journalService = {
  createJournal,
  listJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  findOwnedTripOrThrow
};
