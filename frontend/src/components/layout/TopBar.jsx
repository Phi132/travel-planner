import { Compass as LogoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';

export function TopBar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="lg:hidden sticky top-0 z-30 glass safe-top border-b border-border/60">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <LogoIcon className="h-4 w-4" />
          </div>
          <span className="font-bold text-[15px]">Travel Planner</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/profile">
            <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
