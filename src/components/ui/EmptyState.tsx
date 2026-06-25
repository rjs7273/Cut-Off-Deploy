import Button from './Button';

/* ─────────────────────────────────────────────────────────────────
   EmptyState  (CMP-UI-009)
   ─────────────────────────────────────────────────────────────────
   목록 없음 / 조회 실패 / 빈 폴더 등 빈 상태 공통 컴포넌트.

   variant
   - empty : 항목 없음 (기본)
   - error : 네트워크 오류 / 조회 실패

   icon 슬롯에 lucide 아이콘 또는 이모지를 전달할 수 있음.
   ───────────────────────────────────────────────────────────────── */

export type EmptyStateVariant = 'empty' | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  /** 아이콘 영역 슬롯 (lucide 컴포넌트 또는 이모지 문자열) */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** 하단 CTA 버튼 텍스트 */
  actionLabel?: string;
  /** CTA 버튼 클릭 핸들러 */
  onAction?: () => void;
  className?: string;
}

/* 기본 아이콘 — 이모지 */
const DEFAULT_ICON: Record<EmptyStateVariant, string> = {
  empty: '📭',
  error: '⚠️',
};

export default function EmptyState({
  variant = 'empty',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'px-8 pt-[60px] pb-10 text-center',
        'flex-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 아이콘 박스 */}
      <div
        className="
          w-16 h-16 rounded-[20px] bg-surface-sub
          flex items-center justify-center
          text-[28px] mb-5
        "
      >
        {icon ?? DEFAULT_ICON[variant]}
      </div>

      {/* 제목 */}
      <p className="text-[17px] font-bold text-fg tracking-[-0.3px] mb-2">
        {title}
      </p>

      {/* 설명 */}
      {description && (
        <p className="text-[14px] text-fg-muted leading-[1.65] mb-6">
          {description}
        </p>
      )}

      {/* CTA 버튼 */}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="!w-auto px-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
