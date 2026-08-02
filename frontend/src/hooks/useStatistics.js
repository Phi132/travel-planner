import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/services/statistics.service';

export function useStatisticsOverview() {
  return useQuery({
    queryKey: ['statistics-overview'],
    queryFn: statisticsService.overview,
    staleTime: 1000 * 60
  });
}
