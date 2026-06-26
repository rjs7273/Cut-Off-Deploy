import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { bootstrapSession } from '@/api/services/auth';
import { syncSubscriptionStatus } from '@/api/services/subscription';

export default function SplashPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isFirstEntry = useUserPrefsStore((s) => s.isFirstEntry);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      const hasSession = await bootstrapSession();
      if (hasSession) {
        await syncSubscriptionStatus().catch(() => {});
      }
      if (cancelled) return;

      setIsCheckingUser(false);
      if (isFirstEntry) {
        navigate('/onboard', { replace: true });
      } else if (useAuthStore.getState().isLoggedIn || isLoggedIn) {
        navigate('/home', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }

    const timer = setTimeout(() => {
      checkUser();
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [navigate, isFirstEntry, isLoggedIn]);

  return (
    <div
      className="flex flex-col items-center justify-center bg-surface-sub"
      style={{ height: '100dvh' }}
    >
      <h1 className="text-[32px] font-bold text-fg tracking-[-1px] select-none">
        Cut<span className="text-navy">-off</span>
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
