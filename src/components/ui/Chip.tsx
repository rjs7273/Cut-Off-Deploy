import type { ButtonHTMLAttributes } from 'react';

/* ─────────────────────────────────────────────────────────────────
   Chip  (CMP-UI-003)
   ─────────────────────────────────────────────────────────────────
   관심사 선택 / 카테고리 필터 / 의견 유형 선택에 공통 사용.

   variant
   - interest : 관심사 선택 칩 (7px 14px 패딩, 13px)
   - filter   : 카테고리 필터 칩 (6px 14px 패딩, 12px, flex-shrink-0)
   ───────────────────────────────────────────────────────────────── */

export type ChipVariant = 'interest' | 'filter';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  variant?: ChipVariant;
  /** 비활성(선택 불가) 상태 */
  disabled?: boolean;
}

const VARIANT_BASE: Record<ChipVariant, string> = {
  interest: 'px-[14px] py-[7px] text-[13px]',
  filter:   'px-[14px] py-[6px] text-[12px] flex-shrink-0',
};

export default function Chip({
  label,
  selected = false,
  variant = 'interest',
  disabled = false,
  className = '',
  ...rest
}: ChipProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center',
        'rounded-[20px] border font-normal',
        'cursor-pointer transition-all duration-150 select-none',
        'disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_BASE[variant],
        selected
          ? 'bg-navy text-white border-navy'
          : 'bg-surface text-fg border-line hover:border-navy',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      aria-pressed={selected}
      {...rest}
    >
      {label}
    </button>
  );
}
