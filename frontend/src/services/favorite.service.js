import { api } from '@/lib/axios';

export const favoriteService = {
  list: (params) =>
    api.get('/favorites', { params }).then((res) => ({ favorites: res.data.data.favorites, meta: res.data.meta })),
  set: ({ placeId, status }) => api.put(`/favorites/${placeId}`, { status }).then((res) => res.data.data.favorite),
  remove: (placeId) => api.delete(`/favorites/${placeId}`).then((res) => res.data)
};
