/* ─────────────────────────────────────────────────────────────────
   NotifPermPopup
   ─────────────────────────────────────────────────────────────────
   iOS 스타일 알림 권한 요청 팝업.
   알림 토글 OFF → ON 또는 온보딩 "알림 받기" 버튼 클릭 시 표시.

   HTML 참조:
     .notif-perm-backdrop / .notif-perm-dialog
     .notif-perm-body / .notif-perm-app-icon
     .notif-perm-title / .notif-perm-desc
     .notif-perm-btns / .notif-perm-btn (.deny / .allow)
   ───────────────────────────────────────────────────────────────── */

interface NotifPermPopupProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function NotifPermPopup({
  isOpen,
  onAllow,
  onDeny,
}: NotifPermPopupProps) {
  if (!isOpen) return null;

  return (
    /* .notif-perm-backdrop — 전체화면 반투명 오버레이 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      {/* .notif-perm-dialog — 270px 고정폭, iOS 스타일 */}
      <div className="w-[270px] bg-[rgba(242,242,247,0.98)] dark:bg-[rgba(44,44,46,0.98)] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.28)]">

        {/* .notif-perm-body */}
        <div className="px-4 pt-[22px] pb-[18px] text-center">

          {/* .notif-perm-app-icon — 앱 아이콘 */}
          <div className="w-[54px] h-[54px] bg-navy rounded-[14px] flex items-center justify-center mx-auto mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 4.5a5 5 0 0 0-5 5v2.2c0 .7-.2 1.4-.6 2l-1.1 1.7c-.5.8.1 1.8 1 1.8h11.4c.9 0 1.5-1 1-1.8l-1.1-1.7a3.5 3.5 0 0 1-.6-2V9.5a5 5 0 0 0-5-5Z"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.8 18.8a2.2 2.2 0 0 0 4.4 0"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* .notif-perm-title */}
          <p className="text-[17px] font-semibold text-fg leading-[1.4] mb-2">
            "Cut off"에서 알림을<br />보내도록 허용하시겠습니까?
          </p>

          {/* .notif-perm-desc */}
          <p className="text-[13px] text-fg-muted leading-[1.55]">
            알림을 허용하면 오늘의 추천 영상이<br />준비될 때 알려드립니다.
          </p>
        </div>

        {/* .notif-perm-divider */}
        <div className="h-px bg-[rgba(60,60,67,0.3)] dark:bg-[rgba(255,255,255,0.18)]" />

        {/* .notif-perm-btns */}
        <div className="flex">
          {/* 허용 안 함 */}
          <button
            type="button"
            onClick={onDeny}
            className="flex-1 h-11 text-[17px] text-navy active:bg-black/[0.07] dark:active:bg-white/[0.08] transition-colors rounded-bl-[14px]"
          >
            허용 안 함
          </button>

          {/* .notif-perm-btn-vdivider */}
          <div className="w-px flex-shrink-0 bg-[rgba(60,60,67,0.3)] dark:bg-[rgba(255,255,255,0.18)]" />

          {/* 허용 */}
          <button
            type="button"
            onClick={onAllow}
            className="flex-1 h-11 text-[17px] font-bold text-navy active:bg-black/[0.07] dark:active:bg-white/[0.08] transition-colors rounded-br-[14px]"
          >
            허용
          </button>
        </div>
      </div>
    </div>
  );
}
