import type { ButtonHTMLAttributes } from 'react';

/* ─────────────────────────────────────────────────────────────────
   Button  (CMP-UI-001)
   ─────────────────────────────────────────────────────────────────
   variant  : primary | secondary | ghost | outline
   size     : lg(52px) | md(48px) | sm(44px) | xs(36px)
   width    : full(100%) | auto
   loading  : 스피너 표시 + 인터랙션 차단
   ───────────────────────────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize    = 'lg' | 'md' | 'sm' | 'xs';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 100% 너비 여부 (기본 false) */
  fullWidth?: boolean;
  /** 로딩 상태 — 스피너 표시, 클릭 차단 */
  loading?: boolean;
  /** 좌측 아이콘 슬롯 */
  leftIcon?: React.ReactNode;
  /** 우측 아이콘 슬롯 */
  rightIcon?: React.ReactNode;
}

/* ── 변형별 스타일 맵 ── */
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-navy text-white font-semibold active:bg-navy-light disabled:bg-skel disabled:text-fg-subtle',
  secondary:
    'bg-surface-sub text-fg-muted font-semibold active:opacity-70 disabled:opacity-40',
  ghost:
    'bg-transparent text-fg-muted font-medium active:opacity-70 disabled:opacity-40',
  outline:
    'bg-surface border border-line text-fg font-medium hover:bg-surface-sub active:opacity-70 disabled:opacity-40',
};

/* ── 크기별 스타일 맵 ── */
const SIZE_STYLES: Record<ButtonSize, string> = {
  lg: 'h-[52px] text-[16px] rounded-app-md px-5',
  md: 'h-[48px] text-[15px] rounded-app-md px-5',
  sm: 'h-[44px] text-[14px] rounded-app-md px-4',
  xs: 'h-[36px] text-[13px] rounded-app-sm px-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'cursor-pointer select-none',
        'transition-all duration-150',
        'disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : 'w-auto',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {/* 로딩 스피너 */}
      {loading && (
        <span
          className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-[spin-cw_0.7s_linear_infinite] flex-shrink-0"
          aria-hidden="true"
        />
      )}

      {/* 좌측 아이콘 */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}

      {/* 레이블 */}
      <span>{children}</span>

      {/* 우측 아이콘 */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
