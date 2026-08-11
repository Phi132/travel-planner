import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_PLACE_IMAGE } from '@/lib/imageDefaults';

export const PlaceCard = forwardRef(function PlaceCard({ place }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/places/${place.id}`}
        className="group block rounded-3xl border border-border bg-card shadow-soft overflow-hidden hover:shadow-elevated transition-shadow duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={place.coverImageUrl || DEFAULT_PLACE_IMAGE}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_PLACE_IMAGE) e.currentTarget.src = DEFAULT_PLACE_IMAGE;
            }}
          />
          {place.category && (
            <span className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1">
              {place.category.name}
            </span>
          )}
          {place.isFeatured && (
            <span className="absolute top-3 right-3 rounded-full bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 shadow-soft">
              Nổi bật
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-[15px] leading-snug line-clamp-1 mb-1">{place.name}</h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {place.district ? `${place.district.name}, ` : ''}
              {place.province?.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className={cn('h-4 w-4', place.ratingCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')} />
              <span className="text-sm font-semibold">
                {place.ratingCount > 0 ? place.ratingAvg.toFixed(1) : 'Chưa có'}
              </span>
              {place.ratingCount > 0 && <span className="text-xs text-muted-foreground">({place.ratingCount})</span>}
            </div>
            {place.ticketPrice && (
              <span className="text-xs font-semibold text-secondary truncate max-w-[45%]">{place.ticketPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
