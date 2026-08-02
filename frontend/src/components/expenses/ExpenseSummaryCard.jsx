import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card } from '@/components/ui/Card';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '@/components/expenses/ExpenseCategoryBadge';
import { formatCurrency, cn } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Chuẩn hóa `byCategory` (object dạng { FOOD: 120000, HOTEL: 500000... } trả
 * về từ backend) thành mảng đã sắp xếp giảm dần theo số tiền — tiện cho cả
 * việc vẽ thanh tiến trình lẫn feed dữ liệu vào Chart.js.
 */
function toCategoryList(byCategory = {}) {
  return Object.entries(byCategory)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function ExpenseSummaryCard({ summary, isLoading }) {
  if (isLoading) {
    return <Card className="p-5 h-64 animate-pulse bg-muted/50" />;
  }

  if (!summary) return null;

  const { budget, totalSpent, remaining } = summary;
  const categoryList = toCategoryList(summary.byCategory);

  if (totalSpent === 0) return null;

  const isOverBudget = budget !== null && remaining < 0;
  const budgetPercent = budget && budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : null;

  const chartData = {
    labels: categoryList.map((item) => EXPENSE_CATEGORY_LABELS[item.category] ?? item.category),
    datasets: [
      {
        data: categoryList.map((item) => item.amount),
        backgroundColor: categoryList.map((item) => EXPENSE_CATEGORY_COLORS[item.category] ?? '#94A3B8'),
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  const chartOptions = {
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`
        }
      }
    }
  };

  return (
    <Card className="p-5">
      <p className="text-xs text-muted-foreground font-medium mb-1">Tổng chi tiêu</p>
      <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalSpent)}</p>

      {budget !== null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">
              Ngân sách: <span className="font-semibold text-foreground">{formatCurrency(budget)}</span>
            </span>
            <span className={cn('font-semibold', isOverBudget ? 'text-destructive' : 'text-success')}>
              {isOverBudget ? `Vượt ${formatCurrency(Math.abs(remaining))}` : `Còn lại ${formatCurrency(remaining)}`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', isOverBudget ? 'bg-destructive' : 'bg-success')}
              style={{ width: `${budgetPercent ?? 100}%` }}
            />
          </div>
        </div>
      )}

      {categoryList.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
          <div className="relative h-36 w-36 shrink-0">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-muted-foreground">Danh mục</span>
              <span className="text-lg font-bold">{categoryList.length}</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            {categoryList.map((item) => {
              const percent = totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100) : 0;
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground/80 flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: EXPENSE_CATEGORY_COLORS[item.category] ?? '#94A3B8' }}
                      />
                      {EXPENSE_CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.amount)} · {percent}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: EXPENSE_CATEGORY_COLORS[item.category] ?? '#94A3B8' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
