import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';

const TRIPS_KEY = 'trips';

export function useTrips(params) {
  return useQuery({
    queryKey: [TRIPS_KEY, params],
    queryFn: () => tripService.list(params),
    placeholderData: keepPreviousData
  });
}

export function useTrip(id) {
  return useQuery({
    queryKey: [TRIPS_KEY, id],
    queryFn: () => tripService.getById(id),
    enabled: !!id
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRIPS_KEY] })
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRIPS_KEY] })
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRIPS_KEY] })
  });
}

export function useUploadTripCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripService.uploadCover,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRIPS_KEY] })
  });
}
