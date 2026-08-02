import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar />
        <main className="max-w-5xl mx-auto px-4 py-6 pb-24 lg:pb-10 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
