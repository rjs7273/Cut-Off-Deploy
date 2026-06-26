import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { bootstrapSession, clearAuthSessionOnly } from '@/api/services/auth';
import { syncSubscriptionStatus } from '@/api/services/subscription';
import { waitForStoreHydration } from '@/lib/storeHydration';
import { useThemeStore } from '@/store/themeStore';
import logoDark from '@/assets/logo-dark.svg';
import logoWhite from '@/assets/logo-white.svg';

export default function SplashPage() {
  const navigate = useNavigate();
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      await waitForStoreHydration();
      if (cancelled) return;

      const isFirstEntry = useUserPrefsStore.getState().isFirstEntry;

      if (isFirstEntry) {
        /* 최초 진입 — 온보딩으로 (stale auth 제거) */
        clearAuthSessionOnly();
        setIsCheckingUser(false);
        navigate('/onboard', { replace: true });
        return;
      }

      /* 재진입 — accessToken으로 서버(또는 mock)에서 로그인·구독 정보 복원 */
      const hasSession = await bootstrapSession();
      if (hasSession) {
        await syncSubscriptionStatus().catch(() => {});
      }
      if (cancelled) return;

      setIsCheckingUser(false);
      navigate('/home', { replace: true });
    }

    const timer = setTimeout(() => {
      checkUser();
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-surface-sub"
      style={{ height: '100dvh' }}
    >
      <h1 className="select-none">
        <img
          src={resolvedTheme === 'dark' ? logoWhite : logoDark}
          alt="CUT-OFF"
          className="h-[36px] w-auto"
        />
      </h1>
      <p className="text-[15px] text-fg-muted tracking-[0.2px] mt-3 select-none">
        오늘 볼 만한 영상 하나
      </p>
      {isCheckingUser && (
        <div
          className="w-8 h-[3px] bg-navy rounded-full mt-4"
          style={{ animation: 'pulse 1.2s infinite' }}
          aria-label="로딩 중"
          role="status"
        />
      )}
    </div>
  );
}
