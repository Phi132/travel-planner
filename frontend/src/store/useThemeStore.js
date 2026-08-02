import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyThemeClass = (theme) => {
  const root = window.document.documentElement;
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'system', // 'light' | 'dark' | 'system'
      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const current = get().theme === 'dark' ? 'light' : 'dark';
        applyThemeClass(current);
        set({ theme: current });
      },
      initTheme: () => {
        applyThemeClass(get().theme);
      }
    }),
    { name: 'travel-planner-theme' }
  )
);
