import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({ value = 0, onChange, readOnly = false, className }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          className={cn('transition-transform', !readOnly && 'hover:scale-110 active:scale-95')}
        >
          <Star
            className={cn('h-5 w-5', star <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40')}
          />
        </button>
      ))}
    </div>
  );
}
