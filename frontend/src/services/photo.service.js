import { api } from '@/lib/axios';

export const photoService = {
  list: (params) =>
    api.get('/photos', { params }).then((res) => ({ photos: res.data.data.photos, meta: res.data.meta })),
  upload: ({ tripId, tripDayId, files }) => {
    const formData = new FormData();
    formData.append('tripId', tripId);
    if (tripDayId) formData.append('tripDayId', tripDayId);
    Array.from(files).forEach((file) => formData.append('photos', file));
    // Không tự set Content-Type: để axios/trình duyệt tự thêm "boundary"
    // của multipart/form-data — set tay ở đây sẽ làm mất boundary, khiến
    // backend (multer/busboy) không đọc được field nào, trả về lỗi 400.
    return api.post('/photos', formData).then((res) => res.data.data.photos);
  },
  remove: (id) => api.delete(`/photos/${id}`).then((res) => res.data)
};
