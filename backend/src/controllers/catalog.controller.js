import { catalogService } from '../services/catalog.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const listProvinces = catchAsync(async (req, res) => {
  const provinces = await catalogService.listProvinces({ featuredOnly: req.query.featured === 'true' });
  sendSuccess(res, { message: 'Lấy danh sách tỉnh/thành thành công.', data: { provinces } });
});

export const listDistricts = catchAsync(async (req, res) => {
  const result = await catalogService.listDistrictsByProvinceSlug(req.params.slug);
  sendSuccess(res, { message: 'Lấy danh sách quận/huyện thành công.', data: result });
});

export const listCategories = catchAsync(async (req, res) => {
  const categories = await catalogService.listCategories();
  sendSuccess(res, { message: 'Lấy danh sách danh mục thành công.', data: { categories } });
});
