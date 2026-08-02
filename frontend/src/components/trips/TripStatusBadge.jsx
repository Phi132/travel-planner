import { cn } from '@/lib/utils';

export const TRIP_STATUS_LABELS = {
  PREPARING: 'Đang chuẩn bị',
  ONGOING: 'Đang diễn ra',
  COMPLETED: 'Đã hoàn thành'
};

const STATUS_STYLES = {
  PREPARING: 'bg-primary/10 text-primary',
  ONGOING: 'bg-accent/10 text-accent-600',
  COMPLETED: 'bg-success/10 text-success'
};

export function TripStatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground',
        className
      )}
    >
      {TRIP_STATUS_LABELS[status] ?? status}
    </span>
  );
}
