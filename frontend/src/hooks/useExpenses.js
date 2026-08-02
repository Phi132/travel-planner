import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { expenseService } from '@/services/expense.service';

const EXPENSES_KEY = 'expenses';
const EXPENSES_SUMMARY_KEY = 'expenses-summary';

export function useExpenses(params) {
  return useQuery({
    queryKey: [EXPENSES_KEY, params],
    queryFn: () => expenseService.list(params),
    enabled: !!params?.tripId,
    placeholderData: keepPreviousData
  });
}

export function useExpensesSummary(tripId) {
  return useQuery({
    queryKey: [EXPENSES_SUMMARY_KEY, tripId],
    queryFn: () => expenseService.summary(tripId),
    enabled: !!tripId
  });
}

function invalidateExpenses(queryClient, tripId) {
  queryClient.invalidateQueries({ queryKey: [EXPENSES_KEY] });
  queryClient.invalidateQueries({ queryKey: [EXPENSES_SUMMARY_KEY, tripId] });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseService.create,
    onSuccess: (expense) => invalidateExpenses(queryClient, expense.tripId)
  });
}

export function useUpdateExpense(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseService.update,
    onSuccess: () => invalidateExpenses(queryClient, tripId)
  });
}

export function useDeleteExpense(tripId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseService.remove,
    onSuccess: () => invalidateExpenses(queryClient, tripId)
  });
}
