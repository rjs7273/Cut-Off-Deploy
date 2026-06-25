/* ─────────────────────────────────────────────────────────────────
   useNotifPermission
   알림 권한 요청 흐름을 캡슐화하는 훅.

   흐름:
     OFF → ON 시 requestPermission(onAllow, onDeny?) 호출
     ├─ notificationPermission === 'denied'  (OS 접근 권한 거부)
     │    → NotifPermDeniedModal 표시, onDeny 실행
     └─ 'not_determined' | 'granted'
          → NotifPermPopup 표시
            ├─ 허용: permission='granted', notifEnabled=true, onAllow()
            └─ 허용 안 함: notifEnabled=false 만 변경 (permission 유지)
               ※ 알림 수신 거부이지 OS 접근 권한 차단이 아님

     ON → OFF: 바로 처리 (이 훅 불필요)

   notificationEnabled   — 앱 알림 수신 동의 (ON/OFF)
   notificationPermission — OS 접근 권한 (Capacitor/Web API 연동 시만 변경)

   사용처: MyPage, NotificationPage
   ───────────────────────────────────────────────────────────────── */
import { useState, useRef } from 'react';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { requestPushRegistration, type PushRegistrationResult } from '@/lib/pushNotifications';

type PermissionAllowCallback = (registration: PushRegistrationResult) => void | Promise<void>;
type PermissionDenyCallback = () => void | Promise<void>;

export function useNotifPermission() {
  const notificationPermission = useUserPrefsStore((s) => s.notificationPermission);
  const setNotificationPermission = useUserPrefsStore((s) => s.setNotificationPermission);
  const setNotificationEnabled = useUserPrefsStore((s) => s.setNotificationEnabled);

  const [permPopupOpen, setPermPopupOpen]     = useState(false);
  const [deniedModalOpen, setDeniedModalOpen] = useState(false);

  const onAllowRef = useRef<PermissionAllowCallback | null>(null);
  const onDenyRef  = useRef<PermissionDenyCallback | null>(null);

  /**
   * 알림 OFF → ON 전환을 시도할 때 호출.
   * @param onAllow 권한 허용 후 실행할 콜백
   * @param onDeny  권한 거부/이미 거부된 경우 실행할 콜백 (선택)
   */
  function requestPermission(onAllow: PermissionAllowCallback, onDeny?: PermissionDenyCallback) {
    onAllowRef.current = onAllow;
    onDenyRef.current  = onDeny ?? null;

    if (notificationPermission === 'denied') {
      setDeniedModalOpen(true);
    } else {
      setPermPopupOpen(true);
    }
  }

  async function handlePermAllow() {
    const allowCb = onAllowRef.current;
    const denyCb = onDenyRef.current;
    onAllowRef.current = null;
    onDenyRef.current  = null;

    try {
      const registration = await requestPushRegistration();
      if (registration.permission !== 'granted') {
        setNotificationPermission('denied');
        setNotificationEnabled(false);
        setPermPopupOpen(false);
        await denyCb?.();
        return;
      }

      setNotificationPermission('granted');
      setNotificationEnabled(true);
      setPermPopupOpen(false);
      await allowCb?.(registration);
    } catch {
      setNotificationPermission('denied');
      setNotificationEnabled(false);
      setPermPopupOpen(false);
      await denyCb?.();
      setDeniedModalOpen(true);
    }
  }

  function handlePermDeny() {
    setNotificationEnabled(false);
    setPermPopupOpen(false);
    const cb = onDenyRef.current;
    onAllowRef.current = null;
    onDenyRef.current  = null;
    cb?.();
  }

  function handleDeniedModalClose() {
    setDeniedModalOpen(false);
    const cb = onDenyRef.current;
    onAllowRef.current = null;
    onDenyRef.current  = null;
    cb?.();
  }

  return {
    permPopupOpen,
    deniedModalOpen,
    requestPermission,
    handlePermAllow,
    handlePermDeny,
    handleDeniedModalClose,
  };
}
