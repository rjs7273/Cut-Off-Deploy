/* ─────────────────────────────────────────────────────────────────
   CMP-MY-010 · WithdrawConfirmModal
   회원 탈퇴 확인 모달.

   초안 HTML 참조:
     modal-box — center popup, padding 28px 22px 24px, text-center
     Icon: w-52px h-52px bg-#FFF3F3 rounded-[16px], X icon #CC3333, mb-16px
     Title: "정말 탈퇴하시겠어요?" 17px/700/text-fg/tracking-[-0.3px]/mb-8px
     Description: 14px/text-fg-muted/line-height:1.65/mb-22px
     Buttons: flex gap-8px → "돌아가기"(surface-sub) + "탈퇴하기"(#CC3333)
   ───────────────────────────────────────────────────────────────── */
import { useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WithdrawConfirmModal({ isOpen, onClose, onConfirm }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    /* 딤 오버레이 */
    <div
      ref={overlayRef}
      className={[
        'fixed inset-0 z-[50] flex items-center justify-center',
        'transition-opacity duration-200',
        isOpen
          ? 'bg-black/45 pointer-events-auto opacity-100'
          : 'bg-transparent pointer-events-none opacity-0',
      ].join(' ')}
      aria-hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      {/* 모달 박스 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="회원 탈퇴 확인"
        className={[
          'w-[calc(100%-48px)] max-w-[360px]',
          'bg-surface rounded-app-lg overflow-hidden',
          'shadow-[0_8px_32px_rgba(0,0,0,0.18)]',
          'transition-transform duration-200',
          isOpen ? 'scale-100' : 'scale-95',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[22px] pt-[28px] pb-[24px] text-center">
          {/* 아이콘 박스 */}
          <div className="w-[52px] h-[52px] bg-[#FFF3F3] rounded-[16px] flex items-center justify-center mx-auto mb-[16px]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#CC3333" strokeWidth="1.8" />
              <path d="M8 8l8 8M16 8l-8 8" stroke="#CC3333" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* 제목 */}
          <p className="text-[17px] font-bold text-fg tracking-[-0.3px] mb-[8px]">
            정말 탈퇴하시겠어요?
          </p>

          {/* 설명 */}
          <p className="text-[14px] text-fg-muted leading-[1.65] mb-[22px]">
            탈퇴하면 저장한 영상, 시청 기록, 관심사 설정 등<br />
            모든 데이터가 삭제되며 복구할 수 없습니다.<br />
            구독 중인 경우 함께 해지됩니다.
          </p>

          {/* 버튼 */}
          <div className="flex gap-[8px]">
            <button
              className="flex-1 h-[44px] rounded-app-md bg-surface-sub text-fg-muted text-[14px] font-semibold"
              onClick={onClose}
            >
              돌아가기
            </button>
            <button
              className="flex-1 h-[44px] rounded-app-md bg-[#CC3333] text-white text-[14px] font-semibold"
              onClick={onConfirm}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
