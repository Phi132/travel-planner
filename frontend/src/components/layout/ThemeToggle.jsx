import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Chuyển chế độ sáng/tối"
      className={cn(
        'relative h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-foreground hover:bg-muted/70 transition-colors',
        className
      )}
    >
      <Sun className={cn('h-[18px] w-[18px] absolute transition-all duration-300', isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100')} />
      <Moon className={cn('h-[18px] w-[18px] absolute transition-all duration-300', isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50')} />
    </button>
  );
}
