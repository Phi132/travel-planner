import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Wallet, Users, Pencil, Trash2, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DEFAULT_TRIP_IMAGE } from '@/lib/imageDefaults';

// forwardRef bắt buộc vì AnimatePresence mode="popLayout" (ở TripsListPage)
// cần gắn ref trực tiếp lên component con để đo layout lúc phát sinh hiệu
// ứng exit — thiếu forwardRef sẽ bị React cảnh báo "cannot be given refs".
export const TripCard = forwardRef(function TripCard({ trip, onEdit, onDelete }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <Link to={`/trips/${trip.id}`} className="group h-40 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 relative flex items-center justify-center overflow-hidden">
          <img
            src={trip.coverImageUrl || DEFAULT_TRIP_IMAGE}
            alt={trip.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_TRIP_IMAGE) e.currentTarget.src = DEFAULT_TRIP_IMAGE;
            }}
          />
          <TripStatusBadge status={trip.status} className="absolute top-3 right-3 shadow-soft" />
        </Link>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <Link to={`/trips/${trip.id}`}>
            <h3 className="font-bold text-base leading-snug line-clamp-2 hover:text-primary transition-colors">{trip.name}</h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </span>
          </div>

          {trip.budget !== null && trip.budget !== undefined && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 shrink-0" />
              <span>{formatCurrency(trip.budget)}</span>
            </div>
          )}

          {trip.companions?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />
              <span className="truncate">{trip.companions.join(', ')}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-auto pt-2">
            <Link to={`/trips/${trip.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <CalendarDays className="h-3.5 w-3.5" />
                Lịch trình
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => onEdit(trip)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(trip)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
