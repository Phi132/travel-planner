import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Trash2 } from 'lucide-react';
import { FAVORITE_STATUS_LABELS } from '@/components/favorites/FavoriteStatusBadge';
import { Select } from '@/components/ui/Select';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="100%25" height="100%25" fill="%23e2e8f0"/%3E%3C/svg%3E';

export const FavoritePlaceCard = forwardRef(function FavoritePlaceCard({ favorite, onStatusChange, onRemove, isUpdating }, ref) {
  const place = favorite.place;
  if (!place) return null;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 rounded-3xl border border-border bg-card shadow-soft p-3 overflow-hidden"
    >
      <Link to={`/places/${place.id}`} className="shrink-0">
        <img
          src={place.coverImageUrl || FALLBACK_IMAGE}
          alt={place.name}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1 flex flex-col">
        <Link to={`/places/${place.id}`}>
          <h3 className="font-bold text-[15px] leading-snug line-clamp-1">{place.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 mb-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{place.province?.name}</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Select
            value={favorite.status}
            disabled={isUpdating}
            onChange={(e) => onStatusChange(place.id, e.target.value)}
            className="h-9 text-xs pr-8"
          >
            {Object.entries(FAVORITE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <button
            onClick={() => onRemove(place.id)}
            disabled={isUpdating}
            className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
