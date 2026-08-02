import { api } from '@/lib/axios';

export const statisticsService = {
  overview: () => api.get('/statistics/overview').then((res) => res.data.data)
};
