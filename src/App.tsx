import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { router } from './router';
import { queryClient } from './lib/queryClient';
import { initTheme } from './store/themeStore';
import { syncSubscriptionStatus } from '@/api/services/subscription';
import { useAuthStore } from '@/store/authStore';
import { setupPushNotificationActionRouting } from '@/lib/pushNotifications';

export default function App() {
  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let removeListener: (() => Promise<void>) | null = null;

    async function setupAppResumeSync() {
      const handle = await CapacitorApp.addListener('resume', () => {
        if (useAuthStore.getState().isLoggedIn) {
          syncSubscriptionStatus().catch(() => {});
        }
      });
      removeListener = handle.remove;
      if (cancelled) {
        await removeListener();
      }
    }

    setupAppResumeSync();
    return () => {
      cancelled = true;
      if (removeListener) {
        removeListener().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    let removeListener: (() => Promise<void>) | null = null;

    setupPushNotificationActionRouting(() => {
      router.navigate('/home').catch(() => {});
    }).then((remove) => {
      removeListener = remove;
    }).catch(() => {});

    return () => {
      if (removeListener) {
        removeListener().catch(() => {});
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
