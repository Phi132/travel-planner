import { useState, useMemo } from 'react';
import { Plus, Wallet, Map } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { ExpenseListItem } from '@/components/expenses/ExpenseListItem';
import { ExpenseSummaryCard } from '@/components/expenses/ExpenseSummaryCard';
import { useTrips } from '@/hooks/useTrips';
import { useExpenses, useExpensesSummary, useDeleteExpense } from '@/hooks/useExpenses';

const PAGE_LIMIT = 50;

export default function ExpensesPage() {
  const { data: tripsData, isLoading: isLoadingTrips } = useTrips({ page: 1, limit: 100 });
  const trips = useMemo(() => tripsData?.trips ?? [], [tripsData]);

  const [tripId, setTripId] = useState('');
  const activeTripId = tripId || trips[0]?.id || '';

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  const { data, isLoading } = useExpenses({ tripId: activeTripId, page: 1, limit: PAGE_LIMIT });
  const { data: summary, isLoading: isLoadingSummary } = useExpensesSummary(activeTripId);
  const deleteMutation = useDeleteExpense(activeTripId);

  const expenses = data?.expenses ?? [];

  function openCreateModal() {
    setEditingExpense(null);
    setFormOpen(true);
  }

  function openEditModal(expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  function confirmDelete() {
    deleteMutation.mutate(deletingExpense.id, { onSuccess: () => setDeletingExpense(null) });
  }

  if (!isLoadingTrips && trips.length === 0) {
    return (
      <div>
        <PageHeader title="Chi phí" description="Theo dõi và kiểm soát ngân sách cho từng chuyến đi." />
        <Card>
          <EmptyState
            icon={Map}
            title="Chưa có chuyến đi nào"
            description="Tạo một chuyến đi trước để bắt đầu ghi lại chi phí."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Chi phí"
        description="Theo dõi và kiểm soát ngân sách cho từng chuyến đi."
        action={
          activeTripId && (
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" />
              Thêm khoản chi
            </Button>
          )
        }
      />

      <div className="mb-5 max-w-sm">
        <Select value={activeTripId} onChange={(e) => setTripId(e.target.value)} disabled={isLoadingTrips}>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </Select>
      </div>

      {activeTripId && (
        <div className="space-y-5">
          <ExpenseSummaryCard summary={summary} isLoading={isLoadingSummary} />

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[68px] rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <Card>
              <EmptyState
                icon={Wallet}
                title="Chưa có khoản chi nào"
                description="Thêm khoản chi đầu tiên cho chuyến đi này."
                action={
                  <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4" />
                    Thêm khoản chi
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {expenses.map((expense) => (
                  <ExpenseListItem
                    key={expense.id}
                    expense={expense}
                    onEdit={openEditModal}
                    onDelete={setDeletingExpense}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      <ExpenseFormModal open={formOpen} onOpenChange={setFormOpen} tripId={activeTripId} expense={editingExpense} />

      <ConfirmDialog
        open={!!deletingExpense}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
        title="Xoá khoản chi này?"
        description="Khoản chi sẽ bị xoá khỏi danh sách."
        confirmText="Xoá"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
