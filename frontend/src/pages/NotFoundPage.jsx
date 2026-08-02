import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-background">
      <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Trang bạn tìm không tồn tại.</p>
      <Link to="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
