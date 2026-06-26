import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';

type PersistStore = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
};

function waitForPersist(store: PersistStore): Promise<void> {
  return new Promise((resolve) => {
    if (store.persist.hasHydrated()) {
      resolve();
      return;
    }
    const unsub = store.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

/** localStorage rehydrate 완료까지 대기 (Splash 등 cold start 분기용) */
export async function waitForStoreHydration(): Promise<void> {
  await Promise.all([
    waitForPersist(useAuthStore),
    waitForPersist(useUserPrefsStore),
  ]);
}
