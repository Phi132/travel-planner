import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Input, TextArea, FormField } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EXPENSE_CATEGORY_LABELS } from '@/components/expenses/ExpenseCategoryBadge';
import { expenseSchema } from '@/utils/validationSchemas';
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

function toDateInputValue(date) {
  if (!date) return new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10);
}

function expenseToFormValues(expense) {
  if (!expense) {
    return { category: 'FOOD', amount: '', date: toDateInputValue(), description: '' };
  }
  return {
    category: expense.category,
    amount: String(expense.amount),
    date: toDateInputValue(expense.date),
    description: expense.description ?? ''
  };
}

export function ExpenseFormModal({ open, onOpenChange, tripId, expense }) {
  const isEditing = !!expense;
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense(tripId);
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(expenseSchema), defaultValues: expenseToFormValues(expense) });

  useEffect(() => {
    if (open) {
      reset(expenseToFormValues(expense));
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, expense]);

  const onSubmit = (values) => {
    const payload = {
      category: values.category,
      amount: Number(values.amount),
      date: values.date,
      description: values.description || undefined
    };

    mutation.mutate(isEditing ? { id: expense.id, ...payload } : { tripId, ...payload }, {
      onSuccess: () => onOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa khoản chi' : 'Thêm khoản chi'}</DialogTitle>
          <DialogDescription>Ghi lại chi tiêu để kiểm soát ngân sách chuyến đi.</DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm font-medium">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {getApiErrorMessage(mutation.error, 'Không thể lưu khoản chi.')}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Danh mục" error={errors.category?.message}>
            <Select error={!!errors.category} {...register('category')}>
              {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Số tiền (VNĐ)" error={errors.amount?.message}>
              <Input type="number" min="0" placeholder="100000" error={!!errors.amount} {...register('amount')} />
            </FormField>
            <FormField label="Ngày" error={errors.date?.message}>
              <Input type="date" error={!!errors.date} {...register('date')} />
            </FormField>
          </div>

          <FormField label="Ghi chú" error={errors.description?.message}>
            <TextArea placeholder="Ăn trưa tại..., Vé máy bay..." error={!!errors.description} {...register('description')} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Huỷ
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              {isEditing ? 'Lưu thay đổi' : 'Thêm khoản chi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
