import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { ArrowLeft, Calendar, Wallet, Users, Plus, CalendarDays, Images, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { ScheduleItemCard } from '@/components/trips/schedule/ScheduleItemCard';
import { ScheduleFormModal } from '@/components/trips/schedule/ScheduleFormModal';
import { PhotoGrid } from '@/components/photos/PhotoGrid';
import { PhotoLightbox } from '@/components/photos/PhotoLightbox';
import { PhotoUploadButton } from '@/components/photos/PhotoUploadButton';
import { useTrip } from '@/hooks/useTrips';
import { useTripDays, useDeleteSchedule, useReorderSchedules } from '@/hooks/useSchedule';
import { usePhotos, useUploadPhotos, useDeletePhoto } from '@/hooks/usePhotos';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

function DaySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/trips"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Quay lại Chuyến đi
    </Link>
  );
}

export default function TripDetailPage() {
  const { id: tripId } = useParams();
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const { data: days, isLoading: isLoadingDays } = useTripDays(tripId);

  const [activeDayId, setActiveDayId] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'photos'
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [deletingPhoto, setDeletingPhoto] = useState(null);

  const deleteMutation = useDeleteSchedule(tripId);
  const reorderMutation = useReorderSchedules(tripId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const activeDay = useMemo(() => {
    if (!days || days.length === 0) return null;
    return days.find((d) => d.id === activeDayId) ?? days[0];
  }, [days, activeDayId]);

  const { data: photosData, isLoading: isLoadingPhotos } = usePhotos(
    activeDay ? { tripId, tripDayId: activeDay.id, page: 1, limit: 100 } : null
  );
  const photos = photosData?.photos ?? [];
  const uploadPhotosMutation = useUploadPhotos();
  const deletePhotoMutation = useDeletePhoto();

  function handleUploadPhotos(files) {
    uploadPhotosMutation.mutate({ tripId, tripDayId: activeDay?.id, files });
  }

  function confirmDeletePhoto() {
    deletePhotoMutation.mutate(deletingPhoto.id, {
      onSuccess: () => {
        setDeletingPhoto(null);
        setLightboxIndex(null);
      }
    });
  }

  function openCreateModal() {
    setEditingSchedule(null);
    setFormOpen(true);
  }

  function openEditModal(schedule) {
    setEditingSchedule(schedule);
    setFormOpen(true);
  }

  function confirmDelete() {
    deleteMutation.mutate(
      { tripId, scheduleId: deletingSchedule.id },
      { onSuccess: () => setDeletingSchedule(null) }
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeDay) return;

    const oldIndex = activeDay.schedules.findIndex((s) => s.id === active.id);
    const newIndex = activeDay.schedules.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(activeDay.schedules, oldIndex, newIndex);
    const optimisticDays = days.map((d) => (d.id === activeDay.id ? { ...d, schedules: reordered } : d));

    const items = reordered.map((s, index) => ({ id: s.id, tripDayId: activeDay.id, sortOrder: index }));
    reorderMutation.mutate({ tripId, items, optimisticDays });
  }

  if (isLoadingTrip) {
    return (
      <div>
        <BackLink />
        <div className="h-32 rounded-3xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div>
        <BackLink />
        <Card className="p-10 text-center">
          <p className="text-muted-foreground">Không tìm thấy chuyến đi này.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <BackLink />

      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 p-6 mb-6 relative">
        <TripStatusBadge status={trip.status} className="absolute top-5 right-5 shadow-soft" />
        <h1 className="text-2xl font-bold tracking-tight mb-3 pr-24">{trip.name}</h1>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </span>
          {trip.budget !== null && trip.budget !== undefined && (
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              {formatCurrency(trip.budget)}
            </span>
          )}
          {trip.companions?.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {trip.companions.join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex rounded-2xl bg-muted p-1">
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors',
              activeTab === 'schedule' ? 'bg-card shadow-soft text-foreground' : 'text-muted-foreground'
            )}
          >
            <CalendarDays className="h-4 w-4" />
            Lịch trình
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors',
              activeTab === 'photos' ? 'bg-card shadow-soft text-foreground' : 'text-muted-foreground'
            )}
          >
            <Images className="h-4 w-4" />
            Album ảnh
          </button>
        </div>

        {activeDay && activeTab === 'schedule' && (
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Thêm hoạt động
          </Button>
        )}
        {activeDay && activeTab === 'photos' && (
          <PhotoUploadButton onUpload={handleUploadPhotos} isUploading={uploadPhotosMutation.isPending} />
        )}
      </div>

      {activeTab === 'photos' && uploadPhotosMutation.isError && (
        <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm font-medium">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {getApiErrorMessage(uploadPhotosMutation.error, 'Tải ảnh lên thất bại.')}
        </div>
      )}

      {isLoadingDays ? (
        <DaySkeleton />
      ) : !days || days.length === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarDays}
            title="Chưa có ngày nào"
            description="Chuyến đi cần có ngày bắt đầu/kết thúc hợp lệ để hiển thị lịch trình."
          />
        </Card>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={cn(
                  'shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors text-left',
                  activeDay?.id === day.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                )}
              >
                <div>Ngày {day.dayNumber}</div>
                <div
                  className={cn(
                    'text-[11px] font-normal',
                    activeDay?.id === day.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}
                >
                  {formatDate(day.date)}
                </div>
              </button>
            ))}
          </div>

          {activeTab === 'schedule' ? (
            activeDay && activeDay.schedules.length === 0 ? (
              <Card>
                <EmptyState
                  icon={Plus}
                  title="Chưa có hoạt động nào"
                  description="Thêm hoạt động đầu tiên cho ngày này."
                  action={
                    <Button size="sm" onClick={openCreateModal}>
                      <Plus className="h-4 w-4" />
                      Thêm hoạt động
                    </Button>
                  }
                />
              </Card>
            ) : (
              activeDay && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={activeDay.schedules.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {activeDay.schedules.map((schedule) => (
                        <ScheduleItemCard key={schedule.id} schedule={schedule} onEdit={openEditModal} onDelete={setDeletingSchedule} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )
            )
          ) : isLoadingPhotos ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <Card>
              <EmptyState
                icon={Images}
                title="Chưa có ảnh nào"
                description="Thêm ảnh cho ngày này để lưu lại kỷ niệm."
                action={
                  <PhotoUploadButton onUpload={handleUploadPhotos} isUploading={uploadPhotosMutation.isPending} />
                }
              />
            </Card>
          ) : (
            <PhotoGrid photos={photos} onOpen={setLightboxIndex} />
          )}
        </>
      )}

      {activeDay && (
        <ScheduleFormModal open={formOpen} onOpenChange={setFormOpen} tripId={tripId} tripDayId={activeDay.id} schedule={editingSchedule} />
      )}

      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
        onDelete={setDeletingPhoto}
        isDeleting={deletePhotoMutation.isPending}
      />

      <ConfirmDialog
        open={!!deletingPhoto}
        onOpenChange={(v) => !v && setDeletingPhoto(null)}
        title="Xoá ảnh này?"
        description="Ảnh sẽ bị xoá khỏi album. Hành động này không thể hoàn tác."
        isLoading={deletePhotoMutation.isPending}
        onConfirm={confirmDeletePhoto}
      />

      <ConfirmDialog
        open={!!deletingSchedule}
        onOpenChange={(v) => !v && setDeletingSchedule(null)}
        title="Xoá hoạt động này?"
        description={`"${deletingSchedule?.title}" sẽ bị xoá khỏi lịch trình. Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
