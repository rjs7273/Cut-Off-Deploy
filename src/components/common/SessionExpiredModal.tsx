/* ─────────────────────────────────────────────────────────────────
   SessionExpiredModal  (CMP-APP-004)
   ─────────────────────────────────────────────────────────────────
   세션 만료 안내. 나중에 / 로그인하기 액션 (REQ-038).
   AppLayout 전역 슬롯.

   초안 HTML 참조: #session-expired-modal
   ───────────────────────────────────────────────────────────────── */
import { useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import { useOverlayStore } from '@/store/overlayStore';

export default function SessionExpiredModal() {
  const navigate = useNavigate();
  const isOpen = useOverlayStore((s) => s.isSessionExpiredModalOpen);
  const closeSessionExpiredModal = useOverlayStore((s) => s.closeSessionExpiredModal);

  function handleLogin() {
    closeSessionExpiredModal();
    navigate('/login');
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) closeSessionExpiredModal();
  }

  return (
    <div
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
      <div
        role="dialog"
        aria-modal="true"
        aria-label="로그인 만료"
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
          <div className="w-[52px] h-[52px] bg-[#FFF3F3] rounded-[16px] flex items-center justify-center mx-auto mb-[16px]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="#CC3333" strokeWidth="1.8" />
              <path d="M12 7v5.5" stroke="#CC3333" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="15.5" r=".9" fill="#CC3333" />
            </svg>
          </div>

          <p className="text-[17px] font-bold text-fg tracking-[-0.3px] mb-[8px]">
            로그인이 만료되었습니다
          </p>
          <p className="text-[14px] text-fg-muted leading-[1.65] mb-[22px]">
            보안을 위해 자동으로 로그아웃됐어요.
            <br />
            다시 로그인해 주세요.
          </p>

          <div className="flex gap-[8px]">
            <button
              type="button"
              className="flex-1 h-[44px] rounded-app-md bg-surface-sub text-fg-muted text-[14px] font-semibold"
              onClick={closeSessionExpiredModal}
            >
              나중에
            </button>
            <button
              type="button"
              className="flex-1 h-[44px] rounded-app-md bg-navy text-white text-[14px] font-semibold"
              onClick={handleLogin}
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
