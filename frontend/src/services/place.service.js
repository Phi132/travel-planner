import { api } from '@/lib/axios';

export const placeService = {
  list: (params) => api.get('/places', { params }).then((res) => ({ places: res.data.data.places, meta: res.data.meta })),
  getById: (id) => api.get(`/places/${id}`).then((res) => res.data.data.place),
  listProvinces: () => api.get('/provinces').then((res) => res.data.data.provinces),
  listDistricts: (provinceSlug) =>
    api.get(`/provinces/${provinceSlug}/districts`).then((res) => res.data.data.districts),
  listCategories: () => api.get('/categories').then((res) => res.data.data.categories)
};
