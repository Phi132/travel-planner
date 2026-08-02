import { cn } from '@/lib/utils';

export const FAVORITE_STATUS_LABELS = {
  WANT_TO_GO: 'Muốn đi',
  VISITED: 'Đã đi',
  LOVED: 'Yêu thích'
};

const STATUS_STYLES = {
  WANT_TO_GO: 'bg-primary/10 text-primary',
  VISITED: 'bg-success/10 text-success',
  LOVED: 'bg-destructive/10 text-destructive'
};

export function FavoriteStatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground',
        className
      )}
    >
      {FAVORITE_STATUS_LABELS[status] ?? status}
    </span>
  );
}
