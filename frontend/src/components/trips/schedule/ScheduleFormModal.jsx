import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Input, TextArea, FormField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PlacePickerInline } from '@/components/trips/schedule/PlacePickerInline';
import { scheduleSchema } from '@/utils/validationSchemas';
import { useCreateSchedule, useUpdateSchedule } from '@/hooks/useSchedule';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

function scheduleToFormValues(schedule) {
  if (!schedule) {
    return { title: '', startTime: '08:00', endTime: '', travelTimeMinutes: '', note: '' };
  }
  return {
    title: schedule.title,
    startTime: schedule.startTime,
    endTime: schedule.endTime ?? '',
    travelTimeMinutes: schedule.travelTimeMinutes != null ? String(schedule.travelTimeMinutes) : '',
    note: schedule.note ?? ''
  };
}

export function ScheduleFormModal({ open, onOpenChange, tripId, tripDayId, schedule }) {
  const isEditing = !!schedule;
  const createMutation = useCreateSchedule(tripId);
  const updateMutation = useUpdateSchedule(tripId);
  const mutation = isEditing ? updateMutation : createMutation;

  const [placeId, setPlaceId] = useState(schedule?.place?.id ?? null);
  const [placeObj, setPlaceObj] = useState(schedule?.place ?? null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(scheduleSchema), defaultValues: scheduleToFormValues(schedule) });

  useEffect(() => {
    if (open) {
      reset(scheduleToFormValues(schedule));
      setPlaceId(schedule?.place?.id ?? null);
      setPlaceObj(schedule?.place ?? null);
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, schedule]);

  const onSubmit = (values) => {
    const payload = {
      title: values.title,
      startTime: values.startTime,
      endTime: values.endTime || undefined,
      note: values.note || undefined,
      travelTimeMinutes: values.travelTimeMinutes ? Number(values.travelTimeMinutes) : undefined,
      placeId: placeId || undefined
    };

    if (isEditing) {
      mutation.mutate(
        { tripId, scheduleId: schedule.id, ...payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      mutation.mutate(
        { tripId, tripDayId, ...payload },
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động'}</DialogTitle>
          <DialogDescription>Thêm vào lịch trình theo giờ cụ thể, có thể gắn kèm địa điểm.</DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm font-medium">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {getApiErrorMessage(mutation.error, 'Không thể lưu hoạt động.')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tên hoạt động" error={errors.title?.message}>
            <Input placeholder="Ăn sáng, Tham quan..." error={!!errors.title} {...register('title')} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Giờ bắt đầu" error={errors.startTime?.message}>
              <Input type="time" error={!!errors.startTime} {...register('startTime')} />
            </FormField>
            <FormField label="Giờ kết thúc (tuỳ chọn)">
              <Input type="time" {...register('endTime')} />
            </FormField>
          </div>

          <FormField label="Gắn địa điểm (tuỳ chọn)">
            <PlacePickerInline
              value={placeObj}
              onChange={(id, place) => {
                setPlaceId(id);
                setPlaceObj(place);
              }}
            />
          </FormField>

          <FormField label="Thời gian di chuyển đến đây (phút, tuỳ chọn)">
            <Input type="number" min="0" placeholder="15" {...register('travelTimeMinutes')} />
          </FormField>

          <FormField label="Ghi chú" error={errors.note?.message}>
            <TextArea placeholder="Lưu ý thêm cho hoạt động này..." error={!!errors.note} {...register('note')} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Huỷ
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEditing ? 'Lưu thay đổi' : 'Thêm vào lịch trình'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
