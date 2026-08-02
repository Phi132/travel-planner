import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  return `Th.${Number(month)}/${year.slice(2)}`;
}

export function MonthlyExpenseChart({ monthlyExpenses }) {
  if (!monthlyExpenses || monthlyExpenses.length === 0) {
    return (
      <Card>
        <EmptyState icon={TrendingUp} title="Chưa có dữ liệu chi tiêu" description="Thêm khoản chi cho chuyến đi để xem xu hướng." />
      </Card>
    );
  }

  const data = {
    labels: monthlyExpenses.map((m) => formatMonthLabel(m.month)),
    datasets: [
      {
        data: monthlyExpenses.map((m) => m.total),
        backgroundColor: '#2563EB',
        borderRadius: 8,
        maxBarThickness: 36
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) } }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: { callback: (v) => (v >= 1000000 ? `${v / 1000000}tr` : v) }
      }
    }
  };

  return (
    <Card className="p-5">
      <h2 className="font-bold mb-4">Xu hướng chi tiêu theo tháng</h2>
      <div className="h-56">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}
