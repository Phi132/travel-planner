import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/journal/StarRating';
import { JournalWeatherBadge } from '@/components/journal/JournalWeatherBadge';
import { formatDate } from '@/lib/utils';

export const JournalCard = forwardRef(function JournalCard({ journal, onEdit, onDelete }, ref) {
  return (
    <motion.div ref={ref} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-bold text-[15px]">{formatDate(journal.date, { weekday: 'long', day: '2-digit', month: '2-digit' })}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <JournalWeatherBadge weather={journal.weather} />
              {journal.mood && (
                <span className="text-xs font-medium text-foreground/80 bg-muted rounded-full px-2.5 py-1">
                  {journal.mood}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(journal)}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(journal)}
              className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {journal.rating > 0 && <StarRating value={journal.rating} readOnly className="mb-3" />}

        {journal.content && (
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-3">{journal.content}</p>
        )}

        {journal.places?.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-border">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {journal.places.map((place) => (
              <span key={place.id} className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1">
                {place.name}
              </span>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
});
