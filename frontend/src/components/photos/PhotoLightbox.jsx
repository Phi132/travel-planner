import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Trash2, Loader2 } from 'lucide-react';

export function PhotoLightbox({ photos, index, onClose, onIndexChange, onDelete, isDeleting }) {
  const isOpen = index !== null && index !== undefined;
  const photo = isOpen ? photos[index] : null;

  const goPrev = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index < photos.length - 1) onIndexChange(index + 1);
  }, [index, photos.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[0] bg-black/95 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 safe-top">
          <span className="text-white/70 text-sm font-medium">
            {index + 1} / {photos.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(photo)}
              disabled={isDeleting}
              className="h-10 w-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative px-4 pb-4 min-h-0">
          {index > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <motion.img
            key={photo.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={photo.url}
            alt={photo.caption || 'Ảnh chuyến đi'}
            className="max-h-full max-w-full object-contain rounded-lg"
          />

          {index < photos.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {photo.caption && (
          <p className="text-center text-white/80 text-sm px-6 pb-6">{photo.caption}</p>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
