import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';

/**
 * Lấy danh sách tỉnh/thành. Có thể lọc isFeatured để hiển thị ở trang chủ.
 * Kèm số lượng địa điểm để hiển thị badge trên UI Khám phá.
 */
async function listProvinces({ featuredOnly } = {}) {
  const provinces = await prisma.province.findMany({
    where: {
      deletedAt: null,
      ...(featuredOnly ? { isFeatured: true } : {})
    },
    orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
    include: {
      _count: { select: { places: { where: { deletedAt: null } } } }
    }
  });

  return provinces.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    region: p.region,
    description: p.description,
    imageUrl: p.imageUrl,
    isFeatured: p.isFeatured,
    placeCount: p._count.places
  }));
}

async function getProvinceBySlug(slug) {
  const province = await prisma.province.findFirst({ where: { slug, deletedAt: null } });
  if (!province) {
    throw new AppError('Không tìm thấy tỉnh/thành.', 404);
  }
  return province;
}

/**
 * Lấy danh sách quận/huyện theo tỉnh/thành (dùng slug cho URL thân thiện).
 * Ví dụ: TP Hồ Chí Minh -> Quận 1, Quận 3, Quận 5...
 */
async function listDistrictsByProvinceSlug(provinceSlug) {
  const province = await getProvinceBySlug(provinceSlug);

  const districts = await prisma.district.findMany({
    where: { provinceId: province.id, deletedAt: null },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { places: { where: { deletedAt: null } } } }
    }
  });

  return {
    province: { id: province.id, name: province.name, slug: province.slug },
    districts: districts.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      placeCount: d._count.places
    }))
  };
}

async function listCategories() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { places: { where: { deletedAt: null } } } }
    }
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    colorHex: c.colorHex,
    placeCount: c._count.places
  }));
}

export const catalogService = {
  listProvinces,
  getProvinceBySlug,
  listDistrictsByProvinceSlug,
  listCategories
};
