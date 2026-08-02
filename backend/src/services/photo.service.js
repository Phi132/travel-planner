import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';
import { deleteUploadedFile } from '../helpers/image.helper.js';

async function findOwnedTripOrThrow(userId, tripId) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId, deletedAt: null } });
  if (!trip) throw new AppError('Không tìm thấy chuyến đi.', 404);
  return trip;
}

/**
 * Album ảnh: liệt kê toàn bộ ảnh của 1 chuyến đi, có thể lọc theo ngày.
 * Sắp xếp theo takenAt/createdAt mới nhất trước để giống trải nghiệm
 * "xem lại kỷ niệm" của Album điện thoại.
 */
async function listPhotos(userId, { tripId, tripDayId, page, limit }) {
  await findOwnedTripOrThrow(userId, tripId);

  const where = {
    tripId,
    userId,
    deletedAt: null,
    ...(tripDayId ? { tripDayId } : {})
  };

  const [photos, total] = await prisma.$transaction([
    prisma.photo.findMany({
      where,
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.photo.count({ where })
  ]);

  return { photos, meta: buildPaginationMeta({ page, limit, total }) };
}

/**
 * Tải lên nhiều ảnh cùng lúc, gắn vào 1 chuyến đi (và tuỳ chọn 1 ngày/địa
 * điểm cụ thể). Nhận vào mảng URL đã được xử lý sẵn (resize + convert webp)
 * ở tầng controller/helper, service chỉ lo phần ghi DB.
 */
async function createPhotos(userId, { tripId, tripDayId, placeId, caption }, urls) {
  await findOwnedTripOrThrow(userId, tripId);

  if (tripDayId) {
    const tripDay = await prisma.tripDay.findFirst({ where: { id: tripDayId, tripId } });
    if (!tripDay) throw new AppError('Ngày trong lịch trình không thuộc chuyến đi này.', 422);
  }

  const created = await prisma.$transaction(
    urls.map((url) =>
      prisma.photo.create({
        data: {
          userId,
          tripId,
          tripDayId: tripDayId ?? null,
          placeId: placeId ?? null,
          url,
          caption: caption ?? null,
          type: 'PHOTO',
          takenAt: new Date()
        }
      })
    )
  );

  return created;
}

async function findOwnedPhotoOrThrow(userId, photoId) {
  const photo = await prisma.photo.findFirst({ where: { id: photoId, userId, deletedAt: null } });
  if (!photo) throw new AppError('Không tìm thấy ảnh.', 404);
  return photo;
}

async function deletePhoto(userId, photoId) {
  const photo = await findOwnedPhotoOrThrow(userId, photoId);
  await prisma.photo.update({ where: { id: photoId }, data: { deletedAt: new Date() } });
  await deleteUploadedFile(photo.url);
}

export const photoService = { listPhotos, createPhotos, findOwnedPhotoOrThrow, deletePhoto };
