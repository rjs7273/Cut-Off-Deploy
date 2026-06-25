import { useCallback, useState } from 'react';
import {
  cancelSubscriptionService,
  restoreSubscription,
  startSubscription,
  syncSubscriptionStatus,
} from '@/api/services/subscription';

type SubscriptionAction = 'purchase' | 'restore' | 'sync' | 'manage';

interface UseSubscriptionResult {
  isLoading: boolean;
  action: SubscriptionAction | null;
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
  syncSubscription: () => Promise<void>;
  openManagement: () => Promise<void>;
}

function delayedSubscriptionSync(): void {
  window.setTimeout(() => {
    syncSubscriptionStatus().catch(() => {});
  }, 2500);
}

export function useSubscription(): UseSubscriptionResult {
  const [action, setAction] = useState<SubscriptionAction | null>(null);

  const run = useCallback(async (
    nextAction: SubscriptionAction,
    task: () => Promise<void>,
  ) => {
    if (action) return;
    setAction(nextAction);
    try {
      await task();
    } finally {
      setAction(null);
    }
  }, [action]);

  const syncSubscription = useCallback(async () => {
    await run('sync', async () => {
      await syncSubscriptionStatus();
    });
  }, [run]);

  const purchase = useCallback(async () => {
    await run('purchase', async () => {
      await startSubscription();
      await syncSubscriptionStatus();
      delayedSubscriptionSync();
    });
  }, [run]);

  const restore = useCallback(async () => {
    await run('restore', async () => {
      await restoreSubscription();
      await syncSubscriptionStatus();
      delayedSubscriptionSync();
    });
  }, [run]);

  const openManagement = useCallback(async () => {
    await run('manage', async () => {
      await cancelSubscriptionService();
      await syncSubscriptionStatus().catch(() => {});
    });
  }, [run]);

  return {
    isLoading: action !== null,
    action,
    purchase,
    restore,
    syncSubscription,
    openManagement,
  };
}
