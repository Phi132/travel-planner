import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';

/**
 * Trang tạm cho các module mà backend API chưa hoàn thiện (Trips, Journal,
 * Expenses, Favorites, Places...). Khi module tương ứng xong ở Giai đoạn 3,
 * trang này sẽ được thay bằng UI thật kết nối dữ liệu — không dùng dữ liệu giả.
 */
export function ComingSoonPage({ title, description, icon, emptyTitle, emptyDescription }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
      </Card>
    </div>
  );
}
