import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const STORAGE_KEY = 'cutoff-theme';

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyResolvedTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved);
}

let removeSystemThemeListener: (() => void) | null = null;

function watchSystemTheme(onChange: (resolved: 'light' | 'dark') => void) {
  removeSystemThemeListener?.();

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => onChange(media.matches ? 'dark' : 'light');

  media.addEventListener('change', handler);
  removeSystemThemeListener = () => media.removeEventListener('change', handler);
}

function clearSystemThemeListener() {
  removeSystemThemeListener?.();
  removeSystemThemeListener = null;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        applyResolvedTheme(resolved);

        if (theme === 'system') {
          watchSystemTheme((next) => {
            applyResolvedTheme(next);
            set({ resolvedTheme: next });
          });
        } else {
          clearSystemThemeListener();
        }

        set({ theme, resolvedTheme: resolved });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setTheme(state.theme);
      },
    }
  )
);

/** 앱 시작 시 테마 적용 + system 모드일 때 기기 설정 변경 감지 */
export function initTheme() {
  const { theme, setTheme } = useThemeStore.getState();
  setTheme(theme);
}
