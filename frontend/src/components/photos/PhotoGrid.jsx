import { motion } from 'framer-motion';

export function PhotoGrid({ photos, onOpen }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
      {photos.map((photo, index) => (
        <motion.button
          key={photo.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => onOpen(index)}
          className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
        >
          <img
            src={photo.url}
            alt={photo.caption || 'Ảnh chuyến đi'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </motion.button>
      ))}
    </div>
  );
}
