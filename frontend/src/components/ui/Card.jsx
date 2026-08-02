import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-3xl border border-border bg-card shadow-soft', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('p-5 pb-3', className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn('p-5 pt-0', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-bold tracking-tight', className)}>{children}</h3>;
}
