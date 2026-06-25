import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        const resolved =
          theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : theme;
        document.documentElement.setAttribute('data-theme', resolved);
        set({ theme, resolvedTheme: resolved });
      },
    }),
    { name: 'cutoff-theme' }
  )
);

export function initTheme() {
  const { theme, setTheme } = useThemeStore.getState();
  setTheme(theme);
}
