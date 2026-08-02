import { NavLink } from 'react-router-dom';
import { MOBILE_NAV_ITEMS } from './navItems';
import { cn } from '@/lib/utils';

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass safe-bottom border-t border-border/60">
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl min-w-[56px]"
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn('h-[22px] w-[22px] transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                <span className={cn('text-[10px] font-medium transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
