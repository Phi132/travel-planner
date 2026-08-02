import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MapPin, Clock, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScheduleItemCard({ schedule, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: schedule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('relative', isDragging && 'z-10 opacity-90')}>
      {schedule.travelTimeMinutes ? (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pl-14 pb-2">
          <ArrowRight className="h-3 w-3" />
          <span>Di chuyển ~{schedule.travelTimeMinutes} phút</span>
        </div>
      ) : null}

      <div
        className={cn(
          'flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow',
          isDragging && 'shadow-elevated ring-2 ring-primary/30'
        )}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 w-6 flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
          aria-label="Kéo để sắp xếp lại"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="w-14 shrink-0 flex flex-col items-center pt-0.5">
          <Clock className="h-3.5 w-3.5 text-primary mb-1" />
          <span className="text-sm font-bold tabular-nums">{schedule.startTime}</span>
          {schedule.endTime && <span className="text-[11px] text-muted-foreground">- {schedule.endTime}</span>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('font-semibold text-[15px] leading-snug', schedule.isCompleted && 'line-through text-muted-foreground')}>
              {schedule.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(schedule)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Sửa"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(schedule)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Xoá"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {schedule.place && (
            <div className="flex items-center gap-1 text-xs text-primary mt-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{schedule.place.name}</span>
            </div>
          )}

          {schedule.note && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{schedule.note}</p>}
        </div>
      </div>
    </div>
  );
}
