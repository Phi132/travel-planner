import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Gradient blobs trang trí nền — kiểu Apple marketing page.
          Ở dark mode giảm độ sáng để không làm chói/loang nền phía sau khung kính mờ. */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/20 dark:bg-secondary/10 blur-3xl" />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-elevated mb-3">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold">Travel Planner</h1>
          <p className="text-sm text-muted-foreground">Lập kế hoạch du lịch của bạn</p>
        </div>

        <div className="glass rounded-3xl shadow-elevated p-6 sm:p-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
