import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { formatDate } from '@/lib/utils';
import { History, MapPin } from 'lucide-react';

export function TripTimeline({ trips }) {
  if (!trips || trips.length === 0) {
    return (
      <Card>
        <EmptyState icon={History} title="Chưa có chuyến đi nào" description="Hành trình của bạn sẽ hiển thị ở đây theo dòng thời gian." />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h2 className="font-bold mb-5">Dòng thời gian hành trình</h2>
      <div className="relative pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-6">
          {trips.map((trip) => (
            <div key={trip.id} className="relative">
              <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-primary/15" />
              <Link to={`/trips/${trip.id}`} className="block group">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{trip.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </p>
                  </div>
                  <TripStatusBadge status={trip.status} className="shrink-0" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
