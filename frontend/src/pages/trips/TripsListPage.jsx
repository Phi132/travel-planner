import { useState } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Plus, Search, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TripCard } from '@/components/trips/TripCard';
import { TripFormModal } from '@/components/trips/TripFormModal';
import { TripCardSkeleton } from '@/components/skeletons/TripCardSkeleton';
import { TRIP_STATUS_LABELS } from '@/components/trips/TripStatusBadge';
import { useTrips, useDeleteTrip } from '@/hooks/useTrips';
import { cn } from '@/lib/utils';

const STATUS_TABS = [{ value: undefined, label: 'Tất cả' }, ...Object.entries(TRIP_STATUS_LABELS).map(([value, label]) => ({ value, label }))];
const PAGE_LIMIT = 9;

export default function TripsListPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(undefined);
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);

  const { data, isLoading, isFetching } = useTrips({ page, limit: PAGE_LIMIT, status, search: search || undefined });
  const deleteMutation = useDeleteTrip();

  const trips = data?.trips ?? [];
  const meta = data?.meta;

  function openCreateModal() {
    setEditingTrip(null);
    setFormOpen(true);
  }

  function openEditModal(trip) {
    setEditingTrip(trip);
    setFormOpen(true);
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  function handleSearchChange(value) {
    setSearchInput(value);
    setPage(1);
  }

  function confirmDelete() {
    deleteMutation.mutate(deletingTrip.id, { onSuccess: () => setDeletingTrip(null) });
  }

  return (
    <div>
      <PageHeader
        title="Chuyến đi của tôi"
        description="Lập kế hoạch và quản lý các chuyến đi của bạn."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Tạo chuyến đi
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm chuyến đi theo tên..."
            className="pl-11"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleStatusChange(tab.value)}
              className={cn(
                'shrink-0 rounded-2xl px-4 h-11 text-sm font-semibold transition-colors',
                status === tab.value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <EmptyState
            icon={Map}
            title={search || status ? 'Không tìm thấy chuyến đi phù hợp' : 'Chưa có chuyến đi nào'}
            description={
              search || status
                ? 'Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc trạng thái.'
                : 'Bắt đầu lên kế hoạch cho chuyến đi đầu tiên của bạn.'
            }
            action={
              !search && !status ? (
                <Button onClick={openCreateModal}>
                  <Plus className="h-4 w-4" />
                  Tạo chuyến đi
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <>
          <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity', isFetching && 'opacity-60')}>
            <AnimatePresence mode="popLayout">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onEdit={openEditModal} onDelete={setDeletingTrip} />
              ))}
            </AnimatePresence>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <span className="text-sm text-muted-foreground font-medium">
                Trang {meta.page} / {meta.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <TripFormModal open={formOpen} onOpenChange={setFormOpen} trip={editingTrip} />

      <ConfirmDialog
        open={!!deletingTrip}
        onOpenChange={(open) => !open && setDeletingTrip(null)}
        title="Xoá chuyến đi này?"
        description={`"${deletingTrip?.name}" sẽ bị xoá. Bạn có thể liên hệ quản trị viên nếu cần khôi phục.`}
        confirmText="Xoá chuyến đi"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
