import { useEffect, useRef } from 'react';
import Button from './Button';

/* ─────────────────────────────────────────────────────────────────
   Modal  (CMP-UI-006)
   ─────────────────────────────────────────────────────────────────
   확인 / 경고 / 세션 만료 등 화면 중앙 팝업.

   variant
   - confirm   : 취소 + 확인 버튼 2개 (기본)
   - alert     : 확인 버튼 1개
   - custom    : children 으로 직접 버튼 구성

   상단에 thumbnail 슬롯을 제공해
   RestoreConfirmModal(영상 미리보기) 등에서 재사용 가능.
   ───────────────────────────────────────────────────────────────── */

export type ModalVariant = 'confirm' | 'alert' | 'custom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  /** 상단 썸네일 슬롯 (RestoreConfirmModal 등에서 사용) */
  thumbnail?: React.ReactNode;
  /** 모달 내부 라벨 (소제목 — 네이비 uppercase) */
  label?: string;
  title: string;
  description?: string;
  /** 취소 버튼 텍스트 (기본 "취소") */
  cancelLabel?: string;
  /** 확인 버튼 텍스트 (기본 "확인") */
  confirmLabel?: string;
  onConfirm?: () => void;
  /** 오버레이 클릭으로 닫기 허용 여부 (기본 true) */
  dismissible?: boolean;
  /** 커스텀 하단 버튼 영역 (variant="custom" 시 사용) */
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  variant = 'confirm',
  thumbnail,
  label,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel = '확인',
  onConfirm,
  dismissible = true,
  children,
}: ModalProps) {
  /* ESC 키 닫기 */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) closeRef.current();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    /* ── 딤 오버레이 ── */
    <div
      className={[
        'fixed inset-0 z-[50] flex items-center justify-center',
        'transition-opacity duration-200',
        isOpen
          ? 'bg-black/45 pointer-events-auto opacity-100'
          : 'bg-transparent pointer-events-none opacity-0',
      ].join(' ')}
      aria-hidden={!isOpen}
      onClick={dismissible ? onClose : undefined}
    >
      {/* ── 모달 박스 ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'relative w-[calc(100%-48px)] max-w-[360px]',
          'bg-surface rounded-app-lg overflow-hidden',
          'shadow-[0_8px_32px_rgba(0,0,0,0.18)]',
          'transition-transform duration-200',
          isOpen ? 'scale-100' : 'scale-95',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 썸네일 슬롯 */}
        {thumbnail && (
          <div className="w-full aspect-video bg-skel relative overflow-hidden">
            {thumbnail}
          </div>
        )}

        {/* 본문 */}
        <div className="px-[18px] pt-4 pb-5">
          {label && (
            <p className="text-[10px] font-bold text-navy uppercase tracking-[0.5px] mb-[6px]">
              {label}
            </p>
          )}

          <p className="text-[15px] font-bold text-fg leading-[1.4] mb-1">
            {title}
          </p>

          {description && (
            <p className="text-[14px] font-semibold text-fg leading-[1.4] mt-2 mb-[14px]">
              {description}
            </p>
          )}

          {/* ── 버튼 영역 ── */}
          <div className="mt-[14px]">
            {variant === 'confirm' && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={onClose}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            )}

            {variant === 'alert' && (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={onConfirm ?? onClose}
              >
                {confirmLabel}
              </Button>
            )}

            {variant === 'custom' && children}
          </div>
        </div>
      </div>
    </div>
  );
}
