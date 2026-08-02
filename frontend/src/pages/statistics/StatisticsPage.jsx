import { Map, CalendarDays, Wallet, Building2, LandPlot, MapPinned } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatNumberCard } from '@/components/statistics/StatNumberCard';
import { MonthlyExpenseChart } from '@/components/statistics/MonthlyExpenseChart';
import { TripTimeline } from '@/components/statistics/TripTimeline';
import { useStatisticsOverview } from '@/hooks/useStatistics';
import { formatCurrency } from '@/lib/utils';

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[68px] rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export default function StatisticsPage() {
  const { data, isLoading } = useStatisticsOverview();

  return (
    <div>
      <PageHeader title="Thống kê" description="Nhìn lại toàn bộ hành trình bạn đã đi qua." />

      {isLoading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatNumberCard icon={Map} label="Chuyến đi" value={data.totalTrips} colorClass="bg-primary/10 text-primary" />
          <StatNumberCard icon={CalendarDays} label="Ngày du lịch" value={data.totalDays} colorClass="bg-secondary/10 text-secondary" />
          <StatNumberCard icon={Wallet} label="Tổng chi tiêu" value={formatCurrency(data.totalExpense)} colorClass="bg-accent/10 text-accent-600" />
          <StatNumberCard icon={Building2} label="Tỉnh/thành đã đi" value={data.provincesVisited} colorClass="bg-success/10 text-success" />
          <StatNumberCard icon={LandPlot} label="Quận/huyện đã đi" value={data.districtsVisited} colorClass="bg-destructive/10 text-destructive" />
          <StatNumberCard icon={MapPinned} label="Địa điểm đã đi" value={data.placesVisited} colorClass="bg-primary/10 text-primary" />
        </div>
      )}

      <div className="space-y-5">
        {!isLoading && <MonthlyExpenseChart monthlyExpenses={data.monthlyExpenses} />}
        {!isLoading && <TripTimeline trips={data.timeline} />}
      </div>
    </div>
  );
}
