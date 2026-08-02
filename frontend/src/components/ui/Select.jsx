import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Select = forwardRef(({ className, error, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'flex h-12 w-full appearance-none rounded-2xl border bg-card px-4 pr-10 text-[15px] text-foreground transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring',
        error ? 'border-destructive focus:ring-destructive/40' : 'border-border',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
));
Select.displayName = 'Select';
