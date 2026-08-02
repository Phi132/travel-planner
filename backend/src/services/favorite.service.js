import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';

// Chỉ lấy các field cần thiết để hiển thị ở danh sách Yêu thích, tránh kéo
// theo toàn bộ quan hệ nặng của Place (đồng bộ cách làm với journal.service.js).
const FAVORITE_PLACE_SELECT = {
  id: true,
  name: true,
  slug: true,
  address: true,
  coverImageUrl: true,
  ratingAvg: true,
  province: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true, icon: true } }
};

function serializeFavorite(favorite) {
  if (!favorite) return favorite;
  return {
    placeId: favorite.placeId,
    status: favorite.status,
    createdAt: favorite.createdAt,
    updatedAt: favorite.updatedAt,
    place: favorite.place
      ? { ...favorite.place, ratingAvg: Number(favorite.place.ratingAvg) }
      : null
  };
}

async function assertPlaceExists(placeId) {
  const place = await prisma.place.findFirst({ where: { id: placeId, deletedAt: null } });
  if (!place) throw new AppError('Không tìm thấy địa điểm.', 404);
}

/**
 * Thêm/cập nhật trạng thái yêu thích cho 1 địa điểm — dùng upsert vì
 * (userId, placeId) là unique: gọi lại API này chỉ đổi status, không tạo
 * bản ghi trùng.
 */
async function setFavorite(userId, placeId, status) {
  await assertPlaceExists(placeId);

  const favorite = await prisma.favorite.upsert({
    where: { userId_placeId: { userId, placeId } },
    create: { userId, placeId, status },
    update: { status },
    include: { place: { select: FAVORITE_PLACE_SELECT } }
  });

  return serializeFavorite(favorite);
}

async function removeFavorite(userId, placeId) {
  const favorite = await prisma.favorite.findUnique({ where: { userId_placeId: { userId, placeId } } });
  if (!favorite) {
    throw new AppError('Địa điểm này chưa có trong danh sách yêu thích.', 404);
  }
  await prisma.favorite.delete({ where: { userId_placeId: { userId, placeId } } });
}

async function listFavorites(userId, { status, page, limit }) {
  const where = { userId, ...(status ? { status } : {}) };

  const [favorites, total] = await prisma.$transaction([
    prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { place: { select: FAVORITE_PLACE_SELECT } }
    }),
    prisma.favorite.count({ where })
  ]);

  return {
    favorites: favorites.map(serializeFavorite),
    meta: buildPaginationMeta({ page, limit, total })
  };
}

export const favoriteService = { setFavorite, removeFavorite, listFavorites };
