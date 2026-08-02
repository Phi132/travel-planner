import { Utensils, BedDouble, Car, ShoppingBag, Ticket, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EXPENSE_CATEGORY_LABELS = {
  FOOD: 'Ăn uống',
  HOTEL: 'Khách sạn',
  TRANSPORT: 'Di chuyển',
  SHOPPING: 'Mua sắm',
  TICKET: 'Vé tham quan',
  OTHER: 'Khác'
};

export const EXPENSE_CATEGORY_ICONS = {
  FOOD: Utensils,
  HOTEL: BedDouble,
  TRANSPORT: Car,
  SHOPPING: ShoppingBag,
  TICKET: Ticket,
  OTHER: MoreHorizontal
};

// Màu HEX thật (không phải class Tailwind) — dùng cho Chart.js vì thư viện
// cần giá trị màu cụ thể, không đọc được utility class.
export const EXPENSE_CATEGORY_COLORS = {
  FOOD: '#F97316',
  HOTEL: '#2563EB',
  TRANSPORT: '#14B8A6',
  SHOPPING: '#EC4899',
  TICKET: '#22C55E',
  OTHER: '#94A3B8'
};

const CATEGORY_STYLES = {
  FOOD: 'bg-accent/10 text-accent-600',
  HOTEL: 'bg-primary/10 text-primary',
  TRANSPORT: 'bg-secondary/10 text-secondary',
  SHOPPING: 'bg-destructive/10 text-destructive',
  TICKET: 'bg-success/10 text-success',
  OTHER: 'bg-muted text-muted-foreground'
};

export function ExpenseCategoryBadge({ category, className }) {
  const Icon = EXPENSE_CATEGORY_ICONS[category] ?? MoreHorizontal;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        CATEGORY_STYLES[category] ?? 'bg-muted text-muted-foreground',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {EXPENSE_CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

export function ExpenseCategoryIcon({ category, className }) {
  const Icon = EXPENSE_CATEGORY_ICONS[category] ?? MoreHorizontal;
  return (
    <div className={cn('h-11 w-11 rounded-2xl flex items-center justify-center shrink-0', CATEGORY_STYLES[category] ?? 'bg-muted text-muted-foreground', className)}>
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </div>
  );
}
