import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { photoService } from '@/services/photo.service';

const PHOTOS_KEY = 'photos';

export function usePhotos(params) {
  return useQuery({
    queryKey: [PHOTOS_KEY, params],
    queryFn: () => photoService.list(params),
    enabled: !!params?.tripId,
    placeholderData: keepPreviousData
  });
}

function invalidatePhotos(queryClient) {
  queryClient.invalidateQueries({ queryKey: [PHOTOS_KEY] });
}

export function useUploadPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: photoService.upload,
    onSuccess: () => invalidatePhotos(queryClient)
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: photoService.remove,
    onSuccess: () => invalidatePhotos(queryClient)
  });
}
