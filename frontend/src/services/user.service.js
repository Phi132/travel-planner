import { api } from '@/lib/axios';

export const userService = {
  updateProfile: (payload) => api.patch('/users/me', payload).then((res) => res.data.data),
  changePassword: (payload) => api.patch('/users/me/password', payload).then((res) => res.data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    // Không tự set Content-Type — xem giải thích trong photo.service.js
    return api.post('/users/me/avatar', formData).then((res) => res.data.data);
  }
};
