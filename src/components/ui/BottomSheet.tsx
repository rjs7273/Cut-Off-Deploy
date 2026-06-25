import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   BottomSheet  (CMP-UI-005)
   ─────────────────────────────────────────────────────────────────
   하단 시트 형태의 오버레이 레이아웃.
   상세 영상 / 구독 / 폴더 생성 등 여러 Overlay 컴포넌트의 기반.

   variant
   - default : 핸들바 + 선택적 닫기 버튼 (고정 높이 or 콘텐츠 높이)
   - full    : 화면 상단까지 확장 (영상 상세 시트)
   ───────────────────────────────────────────────────────────────── */

export type BottomSheetVariant = 'default' | 'full';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: BottomSheetVariant;
  /** 시트 상단 제목 (없으면 미표시) */
  title?: string;
  /** 닫기(X) 버튼 표시 여부 (기본 false) */
  showClose?: boolean;
  /** 핸들바 표시 여부 (기본 true) */
  showHandle?: boolean;
  /** 오버레이 클릭으로 닫기 허용 여부 (기본 true) */
  dismissible?: boolean;
  /** 핸들 드래그로 닫기 허용 여부 (기본 true, dismissible 과 독립) */
  dragToDismiss?: boolean;
  /** 다른 바텀시트 위에 겹칠 때 z-index 상향 (영상 상세 위 저장 시트 등) */
  stack?: 'default' | 'elevated';
  children?: React.ReactNode;
  /** 추가 className (시트 패널에 적용) */
  className?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  variant = 'default',
  title,
  showClose = false,
  showHandle = true,
  dismissible = true,
  dragToDismiss = true,
  stack = 'default',
  children,
  className = '',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  const overlayZ = stack === 'elevated' ? 'z-[40]' : 'z-[30]';
  const sheetZ   = stack === 'elevated' ? 'z-[41]' : 'z-[31]';

  const DRAG_CLOSE_PX = 80;

  const resetDrag = useCallback(() => {
    isDragging.current = false;
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      sheetRef.current.style.transition = '';
    }
  }, []);

  const handleHandlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!dragToDismiss) return;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [dragToDismiss]);

  const handleHandlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    const dy = Math.max(0, e.clientY - dragStartY.current);
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  }, []);

  const handleHandlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dy = e.clientY - dragStartY.current;
    resetDrag();
    if (dragToDismiss && dy >= DRAG_CLOSE_PX) onClose();
  }, [dragToDismiss, onClose, resetDrag]);
  /* 시트 열릴 때 body 스크롤 잠금 */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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

  useEffect(() => {
    if (!isOpen) resetDrag();
  }, [isOpen, resetDrag]);

  const isFull = variant === 'full';

  return (
    <>
      {/* ── 딤 오버레이 ── */}
      <div
        className={[
          'fixed inset-0',
          overlayZ,
          'transition-opacity duration-300',
          isOpen
            ? 'bg-black/40 pointer-events-auto'
            : 'bg-transparent opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden="true"
        onClick={dismissible ? onClose : undefined}
      />

      {/* ── 시트 패널 ── */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'fixed left-0 right-0 bottom-0',
          sheetZ,
          'flex flex-col bg-surface',
          isFull ? 'top-0' : 'max-h-[92dvh]',
          'rounded-t-[22px]',
          'transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          isOpen ? 'translate-y-0' : 'translate-y-full',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* 핸들바 */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={handleHandlePointerDown}
            onPointerMove={handleHandlePointerMove}
            onPointerUp={handleHandlePointerUp}
            onPointerCancel={resetDrag}
          >
            <div className="w-[36px] h-[4px] rounded-full bg-line" />
          </div>
        )}

        {/* 닫기 버튼 */}
        {showClose && (
          <button
            className={[
              'absolute right-4 z-10',
              'w-[36px] h-[36px] flex items-center justify-center',
              'text-fg-muted',
              showHandle ? 'top-[48px]' : 'top-3',
            ].join(' ')}
            aria-label="닫기"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        )}

        {/* 제목 */}
        {title && (
          <p className="px-5 pt-2 pb-0 text-[13px] text-fg-muted text-center leading-[1.5] flex-shrink-0 border-b border-line pb-3">
            {title}
          </p>
        )}

        {/* 콘텐츠 스크롤 영역 */}
        <div
          className={[
            'overflow-y-auto',
            isFull ? 'flex-1 min-h-0' : '',
            'pb-safe',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </div>
    </>
  );
}
