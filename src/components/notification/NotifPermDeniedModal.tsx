/* ─────────────────────────────────────────────────────────────────
   NotifPermDeniedModal
   ─────────────────────────────────────────────────────────────────
   알림 접근성 권한이 'denied' 상태일 때 표시되는 안내 모달.
   사용자가 OS 설정에서 직접 권한을 변경해야 함을 안내한다.

   HTML 참조:
     #notif-fail-modal — "알림 권한이 거부되어 있어요" 모달
   ───────────────────────────────────────────────────────────────── */

interface NotifPermDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotifPermDeniedModal({
  isOpen,
  onClose,
}: NotifPermDeniedModalProps) {
  if (!isOpen) return null;

  return (
    /* 반투명 오버레이 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      {/* 모달 박스 */}
      <div className="w-[calc(100%-48px)] max-w-sm bg-bg-sub rounded-[var(--radius-lg)] shadow-[0_8px_32px_rgba(0,0,0,0.24)] px-[22px] pt-7 pb-6 text-center">

        {/* 경고 아이콘 */}
        <div className="w-[52px] h-[52px] bg-[#FFF3E0] rounded-[16px] flex items-center justify-center mx-auto mb-4">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="#F57C00"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 제목 */}
        <p className="text-[17px] font-bold text-fg mb-2 tracking-[-0.3px]">
          알림 권한이 거부되어 있어요
        </p>

        {/* 설명 */}
        <p className="text-[14px] text-fg-muted leading-[1.7] mb-[22px]">
          설정에서 알림 권한 허용으로<br />설정해 주세요.
        </p>

        {/* 확인 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 bg-navy text-white text-[15px] font-semibold rounded-[var(--radius-md)] border-none tracking-[-0.2px] active:opacity-80 transition-opacity"
        >
          확인
        </button>
      </div>
    </div>
  );
}
