import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { placeService } from '@/services/place.service';

const PLACES_KEY = 'places';
const PROVINCES_KEY = 'provinces';
const CATEGORIES_KEY = 'categories';

export function usePlaces(params) {
  return useQuery({
    queryKey: [PLACES_KEY, params],
    queryFn: () => placeService.list(params),
    placeholderData: keepPreviousData
  });
}

export function usePlace(id) {
  return useQuery({
    queryKey: [PLACES_KEY, id],
    queryFn: () => placeService.getById(id),
    enabled: !!id
  });
}

// Danh sách tỉnh/thành + danh mục hầu như không đổi trong phiên làm việc,
// giữ cache lâu (staleTime) để tránh gọi lại API mỗi lần chuyển trang.
export function useProvinces() {
  return useQuery({
    queryKey: [PROVINCES_KEY],
    queryFn: placeService.listProvinces,
    staleTime: 1000 * 60 * 30
  });
}

export function useDistricts(provinceSlug) {
  return useQuery({
    queryKey: [PROVINCES_KEY, provinceSlug, 'districts'],
    queryFn: () => placeService.listDistricts(provinceSlug),
    enabled: !!provinceSlug,
    staleTime: 1000 * 60 * 30
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: placeService.listCategories,
    staleTime: 1000 * 60 * 30
  });
}
