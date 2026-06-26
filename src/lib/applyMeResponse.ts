import type { MeResponse } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';

/** MeResponse → authStore + userPrefsStore (매퍼 없음) */
export function applyMeResponse(me: MeResponse): void {
  const { userInfo, subscription, interests, notificationEnabled } = me;
  useAuthStore.getState().setLoggedIn(true, {
    userId: userInfo.userId,
    email: userInfo.email,
    nickname: userInfo.nickname,
    profileImageUrl: userInfo.profileImageUrl,
    joinedAt: userInfo.joinedAt,
  });
  useAuthStore.getState().setSubscribed(
    subscription.isSubscribed,
    subscription.subscribedAt || undefined,
  );
  useAuthStore.getState().setPlan(subscription.plan);
  useUserPrefsStore.getState().restoreFromRecord({
    selectedCategories: interests,
    notificationEnabled,
  });
  if (me.onboardingDone) {
    useUserPrefsStore.getState().setIsFirstEntry(false);
  }
}
