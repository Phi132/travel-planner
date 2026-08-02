import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}
    >
      {Icon && (
        <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-xs mb-5">{description}</p>}
      {action}
    </motion.div>
  );
}
