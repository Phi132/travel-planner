import { useState, useMemo } from 'react';
import { Plus, NotebookPen, Map } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { JournalFormModal } from '@/components/journal/JournalFormModal';
import { JournalCard } from '@/components/journal/JournalCard';
import { useTrips } from '@/hooks/useTrips';
import { useJournals, useDeleteJournal } from '@/hooks/useJournals';

const PAGE_LIMIT = 50;

export default function JournalPage() {
  const { data: tripsData, isLoading: isLoadingTrips } = useTrips({ page: 1, limit: 100 });
  const trips = useMemo(() => tripsData?.trips ?? [], [tripsData]);

  const [tripId, setTripId] = useState('');
  const activeTripId = tripId || trips[0]?.id || '';

  const [formOpen, setFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [deletingJournal, setDeletingJournal] = useState(null);

  const { data, isLoading } = useJournals({ tripId: activeTripId, page: 1, limit: PAGE_LIMIT });
  const deleteMutation = useDeleteJournal();

  const journals = useMemo(() => {
    const list = data?.journals ?? [];
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data]);

  function openCreateModal() {
    setEditingJournal(null);
    setFormOpen(true);
  }

  function openEditModal(journal) {
    setEditingJournal(journal);
    setFormOpen(true);
  }

  function confirmDelete() {
    deleteMutation.mutate(deletingJournal.id, { onSuccess: () => setDeletingJournal(null) });
  }

  if (!isLoadingTrips && trips.length === 0) {
    return (
      <div>
        <PageHeader title="Nhật ký du lịch" description="Ghi lại những khoảnh khắc đáng nhớ trong mỗi chuyến đi." />
        <Card>
          <EmptyState
            icon={Map}
            title="Chưa có chuyến đi nào"
            description="Tạo một chuyến đi trước để bắt đầu viết nhật ký."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Nhật ký du lịch"
        description="Ghi lại những khoảnh khắc đáng nhớ trong mỗi chuyến đi."
        action={
          activeTripId && (
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" />
              Viết nhật ký
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

      {activeTripId &&
        (isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : journals.length === 0 ? (
          <Card>
            <EmptyState
              icon={NotebookPen}
              title="Chưa có nhật ký nào"
              description="Viết lại cảm nhận của bạn về chuyến đi này."
              action={
                <Button onClick={openCreateModal}>
                  <Plus className="h-4 w-4" />
                  Viết nhật ký
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {journals.map((journal) => (
                <JournalCard key={journal.id} journal={journal} onEdit={openEditModal} onDelete={setDeletingJournal} />
              ))}
            </AnimatePresence>
          </div>
        ))}

      <JournalFormModal open={formOpen} onOpenChange={setFormOpen} tripId={activeTripId} journal={editingJournal} />

      <ConfirmDialog
        open={!!deletingJournal}
        onOpenChange={(open) => !open && setDeletingJournal(null)}
        title="Xoá nhật ký này?"
        description="Nội dung nhật ký sẽ bị xoá vĩnh viễn."
        confirmText="Xoá"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
