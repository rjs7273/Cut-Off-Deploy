/* ─────────────────────────────────────────────────────────────────
   NotificationPage  (CMP-NOTIF-001)
   ─────────────────────────────────────────────────────────────────
   온보딩 마지막 단계 — 알림 수신 동의 화면.
   "알림 받기" → 알림 동의 후 홈으로 이동
   "나중에 할게요" → 알림 미동의 후 홈으로 이동

   초안 HTML 참조:
     #screen-notification / .notif-wrap / .notif-icon
     .notif-title / .notif-desc / .notif-preview
     .btn-primary / .btn-ghost
   ───────────────────────────────────────────────────────────────── */
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import NotifPermPopup from '@/components/notification/NotifPermPopup';
import NotifPermDeniedModal from '@/components/notification/NotifPermDeniedModal';
import { useNotifPermission } from '@/hooks/useNotifPermission';
import { updateNotificationSetting } from '@/api/services/user';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import type { PushRegistrationResult } from '@/lib/pushNotifications';

export default function NotificationPage() {
  const navigate = useNavigate();
  const setIsFirstEntry = useUserPrefsStore((s) => s.setIsFirstEntry);
  const setNotificationEnabled = useUserPrefsStore((s) => s.setNotificationEnabled);
  const {
    permPopupOpen,
    deniedModalOpen,
    requestPermission,
    handlePermAllow,
    handlePermDeny,
    handleDeniedModalClose,
  } = useNotifPermission();

  function goHome() {
    setIsFirstEntry(false);
    navigate('/home', { replace: true });
  }

  async function syncNotification(
    alarmAgreed: boolean,
    registration?: PushRegistrationResult,
  ) {
    try {
      await updateNotificationSetting({
        alarmAgreed,
        ...(registration?.fcmToken ? { fcmToken: registration.fcmToken } : {}),
        ...(registration ? { deviceType: registration.deviceType } : {}),
      });
    } catch {
      /* store는 이미 반영됨 */
    }
  }

  function handleAgree() {
    requestPermission(
      (registration) => {
        syncNotification(true, registration);
        goHome();
      },
      () => {
        syncNotification(false);
        goHome();
      },
    );
  }

  function handleSkip() {
    setNotificationEnabled(false);
    syncNotification(false);
    goHome();
  }

  return (
    /* 온보딩 플로우 — AppLayout 없음, 전체 화면 */
    <div className="min-h-dvh bg-surface flex flex-col pt-safe pb-safe">
      {/* .notif-wrap — flex-1, flex-col, items-center, px:28px, pt:60px, pb:32px, center */}
      <div className="flex-1 flex flex-col items-center px-7 pt-[60px] pb-8 text-center">

        {/* .notif-icon — 64×64, bg-sub, rounded-20px, navy */}
        <div className="w-16 h-16 bg-surface-sub rounded-[20px] flex items-center justify-center mb-7 text-navy">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 4.5a5 5 0 0 0-5 5v2.2c0 .7-.2 1.4-.6 2l-1.1 1.7c-.5.8.1 1.8 1 1.8h11.4c.9 0 1.5-1 1-1.8l-1.1-1.7a3.5 3.5 0 0 1-.6-2V9.5a5 5 0 0 0-5-5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.8 18.8a2.2 2.2 0 0 0 4.4 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* .notif-title — 22px/700/text-1/mb-10px/tracking:-0.5px */}
        <h1 className="text-[22px] font-bold text-fg mb-[10px] tracking-[-0.5px] leading-[1.35]">
          오늘의 추천이 도착하면<br />알려드릴까요?
        </h1>

        {/* .notif-desc — 14px/text-2/lh-1.6/mb-32px */}
        <p className="text-[14px] text-fg-muted leading-[1.6] mb-8">
          하루 한 번, 볼 만한 영상이 준비되었을 때만 알려드립니다.
        </p>

        {/* .notif-preview — w-full, bg-sub, rounded-md, p-16px, mb-36px, text-left, border */}
        <div className="w-full bg-surface-sub rounded-app-md px-4 py-4 mb-9 text-left border border-line">
          {/* .notif-preview-label */}
          <p className="text-[11px] font-semibold text-fg-subtle mb-[6px] tracking-[0.5px] uppercase">
            알림 예시
          </p>
          {/* .notif-preview-text */}
          <p className="text-[14px] text-fg leading-[1.5]">
            오늘 볼 만한 영상이 도착했습니다.
          </p>
          {/* .notif-preview-sub */}
          <p className="text-[13px] text-fg-muted mt-[3px]">
            오늘은 이 영상 하나만 확인해 보세요.
          </p>
        </div>

        {/* .btn-primary "알림 받기" */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAgree}
        >
          알림 받기
        </Button>

        {/* .btn-ghost "나중에 할게요" */}
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="mt-[10px]"
          onClick={handleSkip}
        >
          나중에 할게요
        </Button>
      </div>

      {/* ── 알림 권한 팝업 ── */}
      <NotifPermPopup
        isOpen={permPopupOpen}
        onAllow={handlePermAllow}
        onDeny={handlePermDeny}
      />

      {/* ── 알림 권한 거부 안내 모달 ── */}
      <NotifPermDeniedModal
        isOpen={deniedModalOpen}
        onClose={handleDeniedModalClose}
      />
    </div>
  );
}
