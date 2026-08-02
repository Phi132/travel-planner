import { api } from '@/lib/axios';

export const tripService = {
  list: (params) => api.get('/trips', { params }).then((res) => ({ trips: res.data.data.trips, meta: res.data.meta })),
  getById: (id) => api.get(`/trips/${id}`).then((res) => res.data.data.trip),
  create: (payload) => api.post('/trips', payload).then((res) => res.data.data.trip),
  update: ({ id, ...payload }) => api.patch(`/trips/${id}`, payload).then((res) => res.data.data.trip),
  remove: (id) => api.delete(`/trips/${id}`).then((res) => res.data),
  uploadCover: ({ id, file }) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api
      .post(`/trips/${id}/cover`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data.data.trip);
  }
};
