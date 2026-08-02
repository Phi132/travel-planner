import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Input, TextArea, FormField } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { TRIP_STATUS_LABELS } from '@/components/trips/TripStatusBadge';
import { tripSchema } from '@/utils/validationSchemas';
import { useCreateTrip, useUpdateTrip } from '@/hooks/useTrips';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

function toDateInputValue(date) {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

function tripToFormValues(trip) {
  if (!trip) {
    return { name: '', startDate: '', endDate: '', transportation: '', budget: '', companions: '', description: '' };
  }
  return {
    name: trip.name ?? '',
    startDate: toDateInputValue(trip.startDate),
    endDate: toDateInputValue(trip.endDate),
    transportation: trip.transportation ?? '',
    budget: trip.budget ?? '',
    companions: (trip.companions ?? []).join(', '),
    description: trip.description ?? '',
    status: trip.status
  };
}

export function TripFormModal({ open, onOpenChange, trip }) {
  const isEditing = !!trip;
  const createMutation = useCreateTrip();
  const updateMutation = useUpdateTrip();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(tripSchema), defaultValues: tripToFormValues(trip) });

  // Reset lại form mỗi khi mở modal (tạo mới) hoặc đổi trip đang sửa.
  useEffect(() => {
    if (open) {
      reset(tripToFormValues(trip));
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trip]);

  const onSubmit = (values) => {
    const payload = {
      name: values.name,
      startDate: values.startDate,
      endDate: values.endDate,
      transportation: values.transportation || undefined,
      budget: values.budget === '' ? undefined : Number(values.budget),
      companions: values.companions
        ? values.companions
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      description: values.description || undefined,
      ...(isEditing ? { status: values.status } : {})
    };

    mutation.mutate(isEditing ? { id: trip.id, ...payload } : payload, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa chuyến đi' : 'Tạo chuyến đi mới'}</DialogTitle>
          <DialogDescription>Điền thông tin chuyến đi của bạn.</DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm font-medium">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {getApiErrorMessage(mutation.error, 'Không thể lưu chuyến đi.')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tên chuyến đi" error={errors.name?.message}>
            <Input placeholder="Ví dụ: Đà Lạt tháng 12" error={!!errors.name} {...register('name')} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ngày bắt đầu" error={errors.startDate?.message}>
              <Input type="date" error={!!errors.startDate} {...register('startDate')} />
            </FormField>
            <FormField label="Ngày kết thúc" error={errors.endDate?.message}>
              <Input type="date" error={!!errors.endDate} {...register('endDate')} />
            </FormField>
          </div>

          {isEditing && (
            <FormField label="Trạng thái">
              <Select {...register('status')}>
                {Object.entries(TRIP_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phương tiện" error={errors.transportation?.message}>
              <Input placeholder="Máy bay, xe khách..." error={!!errors.transportation} {...register('transportation')} />
            </FormField>
            <FormField label="Ngân sách (VNĐ)" error={errors.budget?.message}>
              <Input type="number" min="0" placeholder="5000000" error={!!errors.budget} {...register('budget')} />
            </FormField>
          </div>

          <FormField label="Người đi cùng (cách nhau bởi dấu phẩy)" error={errors.companions?.message}>
            <Input placeholder="An, Bình, Chi" error={!!errors.companions} {...register('companions')} />
          </FormField>

          <FormField label="Mô tả" error={errors.description?.message}>
            <TextArea placeholder="Ghi chú thêm về chuyến đi..." error={!!errors.description} {...register('description')} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Huỷ
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEditing ? 'Lưu thay đổi' : 'Tạo chuyến đi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
