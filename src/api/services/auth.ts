import { isMockApi } from '@/config/apiMode';
import {
  loginGoogle,
  loginApple,
  logout as apiLogout,
  withdraw as apiWithdraw,
  fetchMe,
} from '@/api/auth';
import { mockLogin, mockLogout } from '@/api/mocks/authMock';
import { setAccessToken } from '@/lib/apiClient';
import { applyMeResponse } from '@/lib/applyMeResponse';
import { useAuthStore } from '@/store/authStore';
import { useSavedStore } from '@/store/savedStore';
import { useHistoryStore } from '@/store/historyStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import type { UserInfo } from '@/data/userstate/userInfo';
import type { SelectedCategory } from '@/types/auth';

export type LoginProvider = 'google' | 'apple';

export interface GuestState {
  selectedCategories: SelectedCategory[];
  notificationEnabled: boolean;
}

function buildMockUserInfo(provider: LoginProvider): UserInfo {
  const userId = provider === 'google' ? 'mock_google_001' : 'mock_apple_001';
  return provider === 'google'
    ? {
        userId,
        email: 'user@gmail.com',
        nickname: 'Google 사용자',
        profileImageUrl: '',
        joinedAt: new Date().toISOString(),
      }
    : {
        userId,
        email: 'user@icloud.com',
        nickname: 'Apple 사용자',
        profileImageUrl: '',
        joinedAt: new Date().toISOString(),
      };
}

function applyMockRecord(
  record: Awaited<ReturnType<typeof mockLogin>>,
): void {
  useSavedStore.getState().restoreFromRecord(record.savedVideoIds, record.folders);
  useHistoryStore.getState().restoreFromRecord(record.watchedVideoIds);
  useUserPrefsStore.getState().restoreFromRecord({
    selectedCategories: record.selectedCategories,
    notificationEnabled: record.notificationEnabled,
  });
  useAuthStore.getState().setLoggedIn(true, record.userInfo);
  useAuthStore.getState().setSubscribed(record.isSubscribed, record.subscribedAt ?? undefined);
}

function clearSessionState(): void {
  useSavedStore.getState().reset();
  useHistoryStore.getState().reset();
  useUserPrefsStore.getState().resetOnLogout();
  setAccessToken(null);
  useAuthStore.setState({
    isLoggedIn: false,
    isSubscribed: false,
    plan: 'FREE',
    userInfo: null,
    subscribedAt: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });
}

export async function loginWithProvider(
  provider: LoginProvider,
  guestState: GuestState,
): Promise<void> {
  if (isMockApi()) {
    await new Promise((r) => setTimeout(r, 1500));
    const baseInfo = buildMockUserInfo(provider);
    const record = await mockLogin(baseInfo.userId, baseInfo, guestState);
    applyMockRecord(record);
    return;
  }

  const devToken =
    (import.meta.env.VITE_DEV_ID_TOKEN as string | undefined) ?? 'dev-web-token';
  const authRes =
    provider === 'google'
      ? await loginGoogle(devToken)
      : await loginApple(devToken);

  useAuthStore.getState().setSessionTokens({
    accessToken: authRes.accessToken,
    refreshToken: authRes.refreshToken,
    expiresAt: authRes.expiresAt,
  });

  const me = await fetchMe();
  applyMeResponse(me);
}

export async function performLogout(): Promise<void> {
  const { userInfo, isSubscribed, subscribedAt } = useAuthStore.getState();

  if (isMockApi()) {
    if (userInfo?.userId) {
      const savedState = useSavedStore.getState();
      const historyState = useHistoryStore.getState();
      const prefsState = useUserPrefsStore.getState();
      await mockLogout(userInfo.userId, {
        isSubscribed,
        subscribedAt,
        savedVideoIds: savedState.savedVideoIds,
        watchedVideoIds: historyState.watchedVideoIds,
        folders: savedState.folders,
        selectedCategories: prefsState.selectedCategories,
        notificationEnabled: prefsState.notificationEnabled,
      });
    }
  } else {
    try {
      await apiLogout();
    } catch {
      /* 네트워크 오류 시에도 로컬 세션은 정리 */
    }
  }

  clearSessionState();
}

export async function performWithdraw(): Promise<void> {
  if (!isMockApi()) {
    await apiWithdraw();
  }
  await performLogout();
}

/** Splash — accessToken 있으면 Me 검증. 성공 true, 실패 false */
export async function bootstrapSession(): Promise<boolean> {
  if (isMockApi()) {
    return useAuthStore.getState().isLoggedIn;
  }

  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return false;

  try {
    const me = await fetchMe();
    applyMeResponse(me);
    return true;
  } catch {
    await performLogout();
    return false;
  }
}
