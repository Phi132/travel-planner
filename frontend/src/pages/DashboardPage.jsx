import { Link } from 'react-router-dom';
import { Map, NotebookPen, Wallet, Heart, Compass, ArrowRight, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';

const QUICK_LINKS = [
  { to: '/trips', label: 'Chuyến đi', description: 'Lên kế hoạch hành trình', icon: Map, color: 'bg-primary/10 text-primary' },
  { to: '/journal', label: 'Nhật ký', description: 'Ghi lại kỷ niệm', icon: NotebookPen, color: 'bg-secondary/10 text-secondary' },
  { to: '/expenses', label: 'Chi phí', description: 'Theo dõi ngân sách', icon: Wallet, color: 'bg-accent/10 text-accent' },
  { to: '/favorites', label: 'Yêu thích', description: 'Địa điểm đã lưu', icon: Heart, color: 'bg-destructive/10 text-destructive' },
  { to: '/places', label: 'Khám phá', description: 'Địa điểm nổi bật', icon: Compass, color: 'bg-primary/10 text-primary' },
  { to: '/statistics', label: 'Thống kê', description: 'Nhìn lại hành trình', icon: BarChart3, color: 'bg-secondary/10 text-secondary' }
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 14) return 'Chào buổi trưa';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.trim().split(/\s+/).slice(-1)[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Bạn muốn làm gì hôm nay?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ to, label, description, icon: Icon, color }) => (
          <Link key={to} to={to}>
            <Card className="p-5 h-full hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200">
              <div className={`h-11 w-11 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <p className="font-semibold text-[15px]">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-3" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
