import { api } from '@/lib/axios';

export const scheduleService = {
  listDays: (tripId) => api.get(`/trips/${tripId}/days`).then((res) => res.data.data.days),
  create: ({ tripId, ...payload }) =>
    api.post(`/trips/${tripId}/schedules`, payload).then((res) => res.data.data.schedule),
  update: ({ tripId, scheduleId, ...payload }) =>
    api.patch(`/trips/${tripId}/schedules/${scheduleId}`, payload).then((res) => res.data.data.schedule),
  remove: ({ tripId, scheduleId }) =>
    api.delete(`/trips/${tripId}/schedules/${scheduleId}`).then((res) => res.data),
  reorder: ({ tripId, items }) =>
    api.patch(`/trips/${tripId}/schedules/reorder`, { items }).then((res) => res.data.data.days)
};
