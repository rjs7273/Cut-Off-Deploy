import { isMockApi } from '@/config/apiMode';
import { fetchSubscription } from '@/api/subscription';
import { useAuthStore } from '@/store/authStore';
import {
  openSubscriptionManagement,
  purchasePremiumPackage,
  restorePremiumPurchases,
} from '@/lib/revenueCat';
import type { SubscriptionResponse } from '@/types/subscription';

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'subscribed']);

function applySubscriptionStatus(response: SubscriptionResponse): void {
  const subscription = response.subscription;
  const isActive = subscription ? ACTIVE_STATUSES.has(subscription.status.toLowerCase()) : false;
  useAuthStore.getState().setSubscribed(isActive, subscription?.currentPeriodStart);
}

/** POST /subscription/start 미구현: API 모드에서는 RevenueCat SDK 구매를 사용한다. */
export async function startSubscription(): Promise<void> {
  if (isMockApi()) {
    await new Promise((r) => setTimeout(r, 800));
    const subDate = new Date().toISOString();
    useAuthStore.getState().setSubscribed(true, subDate);
    return;
  }

  await purchasePremiumPackage();
}

export async function cancelSubscriptionService(): Promise<void> {
  if (isMockApi()) {
    await new Promise((r) => setTimeout(r, 600));
    useAuthStore.getState().setSubscribed(false);
    return;
  }

  await openSubscriptionManagement();
}

export async function restoreSubscription(): Promise<void> {
  if (isMockApi()) {
    await new Promise((r) => setTimeout(r, 600));
    useAuthStore.getState().setSubscribed(true, new Date().toISOString());
    return;
  }

  await restorePremiumPurchases();
}

export async function getSubscriptionStatus(): Promise<SubscriptionResponse> {
  if (isMockApi()) {
    const isSubscribed = useAuthStore.getState().isSubscribed;
    return {
      subscription: isSubscribed
        ? {
            id: 0,
            store: 'mock',
            productId: 'cutoff-premium-monthly',
            status: 'active',
            currentPeriodStart: useAuthStore.getState().subscribedAt ?? new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            willAutoRenew: true,
          }
        : null,
    };
  }
  return fetchSubscription();
}

export async function syncSubscriptionStatus(): Promise<SubscriptionResponse> {
  const response = await getSubscriptionStatus();
  applySubscriptionStatus(response);
  return response;
}
