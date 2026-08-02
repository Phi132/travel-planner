import { api } from '@/lib/axios';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data.data),
  refresh: () => api.post('/auth/refresh').then((res) => res.data.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data.data)
};
