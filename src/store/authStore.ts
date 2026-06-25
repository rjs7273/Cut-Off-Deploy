/* ─────────────────────────────────────────────────────────────────
   authStore — 인증·구독 상태
   Zustand persist (key: cutoff-auth). MeResponse 필드와 1:1 정렬.
   ───────────────────────────────────────────────────────────────── */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { performLogout, loginWithProvider } from '@/api/services/auth';
import type { LoginProvider } from '@/api/services/auth';
import { setAccessToken } from '@/lib/apiClient';
import type { UserInfo } from '@/data/userstate/userInfo';
import type { SubscribedAt } from '@/data/userstate/subscribedAt';
import type { UserPlan } from '@/types/userTier';
import { IS_LOGGED_IN } from '@/data/userstate/isLoggedIn';
import { IS_SUBSCRIBED } from '@/data/userstate/isSubscribed';
import { USER_INFO } from '@/data/userstate/userInfo';
import { SUBSCRIBED_AT } from '@/data/userstate/subscribedAt';

export type { UserInfo };

interface AuthState {
  isLoggedIn: boolean;
  isSubscribed: boolean;
  plan: UserPlan;
  userInfo: UserInfo | null;
  subscribedAt: SubscribedAt;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;

  setLoggedIn: (v: boolean, info?: UserInfo) => void;
  setSubscribed: (v: boolean, at?: string) => void;
  setSessionTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  }) => void;
  setPlan: (plan: UserPlan) => void;
  logout: () => Promise<void>;
  login: (provider: LoginProvider, guestState: {
    selectedCategories: import('@/data/userstate/selectedCategories').SelectedCategory[];
    notificationEnabled: boolean;
  }) => Promise<void>;
  /** @deprecated login() 사용 */
  restoreSession: (
    baseInfo: UserInfo,
    guestState: {
      selectedCategories: import('@/data/userstate/selectedCategories').SelectedCategory[];
      notificationEnabled: boolean;
    },
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: IS_LOGGED_IN,
      isSubscribed: IS_SUBSCRIBED,
      plan: IS_SUBSCRIBED ? 'PREMIUM' : 'FREE',
      userInfo: USER_INFO,
      subscribedAt: SUBSCRIBED_AT,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      setLoggedIn: (v, info) => {
        set({ isLoggedIn: v, ...(info !== undefined ? { userInfo: info } : {}) });
      },

      setSubscribed: (v, at) => {
        const date = at ?? (v ? new Date().toISOString() : null);
        set({
          isSubscribed: v,
          subscribedAt: v ? date : null,
          plan: v ? 'PREMIUM' : 'FREE',
        });
      },

      setSessionTokens: ({ accessToken, refreshToken, expiresAt }) => {
        setAccessToken(accessToken);
        set({ accessToken, refreshToken, expiresAt: expiresAt ?? null });
      },

      setPlan: (plan) => set({ plan }),

      logout: async () => {
        await performLogout();
      },

      login: async (provider, guestState) => {
        await loginWithProvider(provider, guestState);
      },

      restoreSession: async (baseInfo, guestState) => {
        const provider: LoginProvider = baseInfo.userId.includes('apple')
          ? 'apple'
          : 'google';
        await loginWithProvider(provider, guestState);
      },
    }),
    {
      name: 'cutoff-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) setAccessToken(state.accessToken);
      },
    },
  ),
);
