import { refreshToken as apiRefreshToken } from '@/api/auth';
import { setAccessToken, setRefreshHandler } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

/** 401 시 refreshToken → accessToken 갱신 (main.tsx에서 1회 호출) */
export function setupApiAuth(): void {
  setRefreshHandler(async () => {
    const rt = useAuthStore.getState().refreshToken;
    if (!rt) return null;

    try {
      const res = await apiRefreshToken(rt);
      useAuthStore.getState().setSessionTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: res.expiresAt,
      });
      setAccessToken(res.accessToken);
      return res.accessToken;
    } catch {
      return null;
    }
  });
}
