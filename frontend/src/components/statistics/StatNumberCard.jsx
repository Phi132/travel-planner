import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export function StatNumberCard({ icon: Icon, label, value, colorClass = 'bg-primary/10 text-primary' }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={cn('h-11 w-11 rounded-2xl flex items-center justify-center shrink-0', colorClass)}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold tracking-tight leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground truncate">{label}</p>
      </div>
    </Card>
  );
}
