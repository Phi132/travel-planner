import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Input, TextArea, FormField } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/journal/StarRating';
import { JOURNAL_WEATHER_LABELS } from '@/components/journal/JournalWeatherBadge';
import { journalSchema } from '@/utils/validationSchemas';
import { useCreateJournal, useUpdateJournal } from '@/hooks/useJournals';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

function toDateInputValue(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
}

function journalToFormValues(journal) {
  if (!journal) {
    return { date: toDateInputValue(), weather: '', mood: '', rating: 0, content: '' };
  }
  return {
    date: toDateInputValue(journal.date),
    weather: journal.weather ?? '',
    mood: journal.mood ?? '',
    rating: journal.rating ?? 0,
    content: journal.content ?? ''
  };
}

export function JournalFormModal({ open, onOpenChange, tripId, journal }) {
  const isEditing = !!journal;
  const createMutation = useCreateJournal();
  const updateMutation = useUpdateJournal();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({ resolver: zodResolver(journalSchema), defaultValues: journalToFormValues(journal) });

  useEffect(() => {
    if (open) {
      reset(journalToFormValues(journal));
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, journal]);

  const onSubmit = (values) => {
    const payload = {
      date: values.date,
      weather: values.weather || undefined,
      mood: values.mood || undefined,
      rating: values.rating || undefined,
      content: values.content || undefined
    };

    mutation.mutate(isEditing ? { id: journal.id, ...payload } : { tripId, ...payload }, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa nhật ký' : 'Viết nhật ký'}</DialogTitle>
          <DialogDescription>Ghi lại khoảnh khắc đáng nhớ trong ngày.</DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm font-medium">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {getApiErrorMessage(mutation.error, 'Không thể lưu nhật ký.')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ngày" error={errors.date?.message}>
              <Input type="date" error={!!errors.date} {...register('date')} />
            </FormField>
            <FormField label="Thời tiết" error={errors.weather?.message}>
              <Select error={!!errors.weather} {...register('weather')}>
                <option value="">Không ghi</option>
                {Object.entries(JOURNAL_WEATHER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Cảm xúc" error={errors.mood?.message} hint="Ví dụ: Vui, Thư giãn, Mệt nhưng đáng...">
            <Input placeholder="Hôm nay bạn cảm thấy thế nào?" error={!!errors.mood} {...register('mood')} />
          </FormField>

          <FormField label="Đánh giá ngày hôm nay">
            <Controller
              name="rating"
              control={control}
              render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
            />
          </FormField>

          <FormField label="Nội dung" error={errors.content?.message}>
            <TextArea
              rows={5}
              placeholder="Hôm nay bạn đã làm gì, đi đâu, ăn gì..."
              className="min-h-[140px]"
              error={!!errors.content}
              {...register('content')}
            />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Huỷ
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEditing ? 'Lưu thay đổi' : 'Lưu nhật ký'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
