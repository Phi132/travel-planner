import { api } from '@/lib/axios';

export const journalService = {
  list: (params) =>
    api.get('/journals', { params }).then((res) => ({ journals: res.data.data.journals, meta: res.data.meta })),
  create: (payload) => api.post('/journals', payload).then((res) => res.data.data.journal),
  update: ({ id, ...payload }) => api.patch(`/journals/${id}`, payload).then((res) => res.data.data.journal),
  remove: (id) => api.delete(`/journals/${id}`).then((res) => res.data)
};
