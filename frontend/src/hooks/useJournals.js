import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { journalService } from '@/services/journal.service';

const JOURNALS_KEY = 'journals';

export function useJournals(params) {
  return useQuery({
    queryKey: [JOURNALS_KEY, params],
    queryFn: () => journalService.list(params),
    enabled: !!params?.tripId,
    placeholderData: keepPreviousData
  });
}

function invalidateJournals(queryClient) {
  queryClient.invalidateQueries({ queryKey: [JOURNALS_KEY] });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: journalService.create,
    onSuccess: () => invalidateJournals(queryClient)
  });
}

export function useUpdateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: journalService.update,
    onSuccess: () => invalidateJournals(queryClient)
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: journalService.remove,
    onSuccess: () => invalidateJournals(queryClient)
  });
}
