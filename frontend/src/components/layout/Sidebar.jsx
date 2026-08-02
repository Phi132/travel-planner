import { NavLink } from 'react-router-dom';
import { Compass as LogoIcon, LogOut } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-r border-border bg-card/50 px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft">
          <LogoIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold leading-tight">Travel Planner</p>
          <p className="text-xs text-muted-foreground">Khám phá Việt Nam</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'text-foreground/80 hover:bg-muted'
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={user?.avatarUrl} name={user?.fullName} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
