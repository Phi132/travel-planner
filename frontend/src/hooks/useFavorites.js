import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { favoriteService } from '@/services/favorite.service';

const FAVORITES_KEY = 'favorites';
const PLACES_KEY = 'places'; // trùng key dùng ở usePlaces.js để invalidate chéo

export function useFavorites(params) {
  return useQuery({
    queryKey: [FAVORITES_KEY, params],
    queryFn: () => favoriteService.list(params),
    placeholderData: keepPreviousData
  });
}

function invalidateFavorites(queryClient, placeId) {
  queryClient.invalidateQueries({ queryKey: [FAVORITES_KEY] });
  // Place detail có trả kèm favoriteStatus -> cần refetch lại để đồng bộ nút bấm.
  queryClient.invalidateQueries({ queryKey: [PLACES_KEY, placeId] });
}

export function useSetFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteService.set,
    onSuccess: (favorite) => invalidateFavorites(queryClient, favorite.placeId)
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteService.remove,
    onSuccess: (_data, placeId) => invalidateFavorites(queryClient, placeId)
  });
}
