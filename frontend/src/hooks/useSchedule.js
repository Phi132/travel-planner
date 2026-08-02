import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule.service';

const DAYS_KEY = 'trip-days';

export function useTripDays(tripId) {
  return useQuery({
    queryKey: [DAYS_KEY, tripId],
    queryFn: () => scheduleService.listDays(tripId),
    enabled: !!tripId
  });
}

function invalidateDays(queryClient, tripId) {
  queryClient.invalidateQueries({ queryKey: [DAYS_KEY, tripId] });
}

export function useCreateSchedule(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleService.create,
    onSuccess: () => invalidateDays(queryClient, tripId)
  });
}

export function useUpdateSchedule(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleService.update,
    onSuccess: () => invalidateDays(queryClient, tripId)
  });
}

export function useDeleteSchedule(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleService.remove,
    onSuccess: () => invalidateDays(queryClient, tripId)
  });
}

/**
 * Kéo-thả sắp xếp lại lịch trình: cập nhật UI ngay lập tức (optimistic update)
 * để cảm giác kéo-thả mượt mà, không phải chờ round-trip API mới thấy thay
 * đổi. Nếu API lỗi, tự động rollback lại danh sách ngày cũ.
 */
export function useReorderSchedules(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleService.reorder,
    onMutate: async ({ optimisticDays }) => {
      await queryClient.cancelQueries({ queryKey: [DAYS_KEY, tripId] });
      const previousDays = queryClient.getQueryData([DAYS_KEY, tripId]);
      if (optimisticDays) {
        queryClient.setQueryData([DAYS_KEY, tripId], optimisticDays);
      }
      return { previousDays };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousDays) {
        queryClient.setQueryData([DAYS_KEY, tripId], context.previousDays);
      }
    },
    onSuccess: (days) => {
      queryClient.setQueryData([DAYS_KEY, tripId], days);
    }
  });
}
