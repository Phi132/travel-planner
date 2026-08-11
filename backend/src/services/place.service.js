import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { buildPaginationMeta } from '../utils/apiResponse.js';
import { deleteUploadedFile } from '../helpers/image.helper.js';

/**
 * Chuẩn hóa 1 địa điểm trả về client: convert Decimal (lat/lng/rating) sang
 * Number, gộp thông tin tỉnh/quận/danh mục vào dạng phẳng dễ dùng ở Frontend.
 */
function serializePlace(place) {
  if (!place) return place;
  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    description: place.description,
    address: place.address,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    googleMapsUrl: place.googleMapsUrl,
    openHours: place.openHours,
    ticketPrice: place.ticketPrice,
    ratingAvg: Number(place.ratingAvg),
    ratingCount: place.ratingCount,
    isFeatured: place.isFeatured,
    coverImageUrl: place.coverImageUrl,
    province: place.province ? { id: place.province.id, name: place.province.name, slug: place.province.slug } : null,
    district: place.district ? { id: place.district.id, name: place.district.name, slug: place.district.slug } : null,
    category: place.category
      ? { id: place.category.id, name: place.category.name, slug: place.category.slug, icon: place.category.icon }
      : null,
    images: place.images ? place.images.map((img) => img.url) : undefined,
    createdAt: place.createdAt,
    updatedAt: place.updatedAt
  };
}

const PLACE_INCLUDE = {
  province: { select: { id: true, name: true, slug: true } },
  district: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true, icon: true } },
  images: {
    orderBy: { sortOrder: 'asc' },
    select: { id: true, url: true, sortOrder: true }
  }
};

async function resolveSlugFilters({ provinceSlug, districtSlug, categorySlug }) {
  const where = {};

  if (provinceSlug) {
    const province = await prisma.province.findFirst({ where: { slug: provinceSlug, deletedAt: null } });
    if (!province) throw new AppError('Không tìm thấy tỉnh/thành.', 404);
    where.provinceId = province.id;
  }

  if (districtSlug) {
    const district = await prisma.district.findFirst({ where: { slug: districtSlug, deletedAt: null } });
    if (!district) throw new AppError('Không tìm thấy quận/huyện.', 404);
    where.districtId = district.id;
  }

  if (categorySlug) {
    const category = await prisma.category.findFirst({ where: { slug: categorySlug, deletedAt: null } });
    if (!category) throw new AppError('Không tìm thấy danh mục.', 404);
    where.categoryId = category.id;
  }

  return where;
}

const SORT_MAP = {
  rating: [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }],
  newest: [{ createdAt: 'desc' }],
  name: [{ name: 'asc' }]
};

async function listPlaces({ page, limit, provinceSlug, districtSlug, categorySlug, search, featured, sort }) {
  const slugWhere = await resolveSlugFilters({ provinceSlug, districtSlug, categorySlug });

  const where = {
    deletedAt: null,
    ...slugWhere,
    ...(featured !== undefined ? { isFeatured: featured } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { address: { contains: search } },
            { description: { contains: search } }
          ]
        }
      : {})
  };

  const [places, total] = await prisma.$transaction([
    prisma.place.findMany({
      where,
      orderBy: SORT_MAP[sort] ?? SORT_MAP.rating,
      skip: (page - 1) * limit,
      take: limit,
      include: PLACE_INCLUDE
    }),
    prisma.place.count({ where })
  ]);

  return {
    places: places.map(serializePlace),
    meta: buildPaginationMeta({ page, limit, total })
  };
}

async function getPlaceById(placeId, userId) {
  const place = await prisma.place.findFirst({
    where: { id: placeId, deletedAt: null },
    include: { ...PLACE_INCLUDE, images: { orderBy: { sortOrder: 'asc' } } }
  });

  if (!place) {
    throw new AppError('Không tìm thấy địa điểm.', 404);
  }

  const result = serializePlace(place);

  // Nếu đã đăng nhập, kèm theo trạng thái yêu thích + ghi chú cá nhân (nếu có)
  // để Frontend hiển thị luôn nút "Đã lưu" / "Muốn đi" mà không cần gọi thêm API.
  if (userId) {
    const [favorite, note] = await prisma.$transaction([
      prisma.favorite.findUnique({ where: { userId_placeId: { userId, placeId } } }),
      prisma.placeUserNote.findUnique({ where: { userId_placeId: { userId, placeId } } })
    ]);
    result.favoriteStatus = favorite?.status ?? null;
    result.userNote = note ? { note: note.note, rating: note.rating } : null;
  }

  return result;
}

async function createPlace(data) {
  const category = await prisma.category.findFirst({ where: { id: data.categoryId, deletedAt: null } });
  if (!category) throw new AppError('Danh mục không tồn tại.', 422);

  const province = await prisma.province.findFirst({ where: { id: data.provinceId, deletedAt: null } });
  if (!province) throw new AppError('Tỉnh/thành không tồn tại.', 422);

  if (data.districtId) {
    const district = await prisma.district.findFirst({
      where: { id: data.districtId, provinceId: data.provinceId, deletedAt: null }
    });
    if (!district) throw new AppError('Quận/huyện không thuộc tỉnh/thành đã chọn.', 422);
  }

  const baseSlug = data.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Đảm bảo slug duy nhất trong phạm vi tỉnh/thành (khớp @@unique([provinceId, slug]))
  let slug = baseSlug;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.place.findFirst({ where: { provinceId: data.provinceId, slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const place = await prisma.place.create({
    data: {
      name: data.name,
      slug,
      description: data.description ?? null,
      address: data.address,
      provinceId: data.provinceId,
      districtId: data.districtId ?? null,
      categoryId: data.categoryId,
      latitude: data.latitude,
      longitude: data.longitude,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`,
      openHours: data.openHours ?? null,
      ticketPrice: data.ticketPrice ?? null,
      isFeatured: data.isFeatured ?? false
    },
    include: PLACE_INCLUDE
  });

  return serializePlace(place);
}

async function findExistingOrThrow(placeId) {
  const place = await prisma.place.findFirst({ where: { id: placeId, deletedAt: null } });
  if (!place) throw new AppError('Không tìm thấy địa điểm.', 404);
  return place;
}

async function updatePlace(placeId, data) {
  await findExistingOrThrow(placeId);

  if (data.latitude !== undefined || data.longitude !== undefined) {
    const current = await prisma.place.findUnique({ where: { id: placeId } });
    const lat = data.latitude ?? Number(current.latitude);
    const lng = data.longitude ?? Number(current.longitude);
    data.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const place = await prisma.place.update({
    where: { id: placeId },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.provinceId !== undefined ? { provinceId: data.provinceId } : {}),
      ...(data.districtId !== undefined ? { districtId: data.districtId } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
      ...(data.googleMapsUrl !== undefined ? { googleMapsUrl: data.googleMapsUrl } : {}),
      ...(data.openHours !== undefined ? { openHours: data.openHours } : {}),
      ...(data.ticketPrice !== undefined ? { ticketPrice: data.ticketPrice } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {})
    },
    include: PLACE_INCLUDE
  });

  return serializePlace(place);
}

async function deletePlace(placeId) {
  await findExistingOrThrow(placeId);
  await prisma.place.update({ where: { id: placeId }, data: { deletedAt: new Date() } });
}

async function setCoverImage(placeId, coverImageUrl) {
  const existing = await findExistingOrThrow(placeId);
  if (existing.coverImageUrl) {
    await deleteUploadedFile(existing.coverImageUrl);
  }
  const place = await prisma.place.update({ where: { id: placeId }, data: { coverImageUrl }, include: PLACE_INCLUDE });
  return serializePlace(place);
}

async function addGalleryImages(placeId, urls) {
  await findExistingOrThrow(placeId);
  const currentCount = await prisma.placeImage.count({ where: { placeId } });

  await prisma.placeImage.createMany({
    data: urls.map((url, index) => ({ placeId, url, sortOrder: currentCount + index }))
  });

  return prisma.placeImage.findMany({ where: { placeId }, orderBy: { sortOrder: 'asc' } });
}

export const placeService = {
  listPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  setCoverImage,
  addGalleryImages
};
