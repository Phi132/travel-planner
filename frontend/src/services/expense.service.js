import { api } from '@/lib/axios';

export const expenseService = {
  list: (params) =>
    api.get('/expenses', { params }).then((res) => ({ expenses: res.data.data.expenses, meta: res.data.meta })),
  summary: (tripId) => api.get('/expenses/summary', { params: { tripId } }).then((res) => res.data.data),
  create: (payload) => api.post('/expenses', payload).then((res) => res.data.data.expense),
  update: ({ id, ...payload }) => api.patch(`/expenses/${id}`, payload).then((res) => res.data.data.expense),
  remove: (id) => api.delete(`/expenses/${id}`).then((res) => res.data)
};
