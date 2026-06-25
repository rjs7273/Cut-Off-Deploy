import type { ButtonHTMLAttributes } from 'react';
import { Heart, X, MoreHorizontal } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   IconButton  (CMP-UI-002)
   ─────────────────────────────────────────────────────────────────
   preset   : save(하트) | close(X) | more(…) | custom(children)
   size     : sm(28px) | md(36px) | lg(44px)
   ───────────────────────────────────────────────────────────────── */

export type IconButtonPreset = 'save' | 'close' | 'more' | 'custom';
export type IconButtonSize   = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 아이콘 preset (custom 시 children 사용) */
  preset?: IconButtonPreset;
  size?: IconButtonSize;
  /**
   * save preset 전용: 저장 활성 상태
   * true → 채워진 navy 하트
   * false → 빈 하트 (stroke)
   */
  saved?: boolean;
  /** 반투명 카드 위 배경 (card-heart-btn 스타일) */
  floating?: boolean;
  /** 테두리 표시 (btn-save 스타일) */
  bordered?: boolean;
  /** 커스텀 아이콘 (preset="custom" 시 사용) */
  children?: React.ReactNode;
}

const SIZE_STYLES: Record<IconButtonSize, { wrap: string; icon: number }> = {
  sm: { wrap: 'w-[28px] h-[28px]', icon: 14 },
  md: { wrap: 'w-[36px] h-[36px]', icon: 16 },
  lg: { wrap: 'w-[44px] h-[44px]', icon: 20 },
};

export default function IconButton({
  preset = 'custom',
  size = 'md',
  saved = false,
  floating = false,
  bordered = false,
  children,
  className = '',
  ...rest
}: IconButtonProps) {
  const { wrap, icon } = SIZE_STYLES[size];

  /* ── 배경 스타일 ── */
  const bgStyle = floating
    ? 'bg-white/90 shadow-[0_1px_5px_rgba(0,0,0,0.14)] [data-theme=dark]:bg-[rgba(30,30,30,0.9)]'
    : bordered
    ? saved
      ? 'bg-navy border border-navy'
      : 'bg-transparent border border-line hover:border-navy hover:text-navy'
    : 'bg-transparent';

  /* ── 아이콘 컬러 ── */
  const iconColor = bordered && saved
    ? 'text-white'
    : preset === 'save' && saved
    ? 'text-navy'
    : 'text-fg-subtle';

  /* ── preset 아이콘 렌더링 ── */
  function renderIcon() {
    if (preset === 'save') {
      return (
        <Heart
          size={icon}
          strokeWidth={1.8}
          className={`transition-colors duration-150 ${iconColor}`}
          fill={saved ? 'currentColor' : 'none'}
        />
      );
    }
    if (preset === 'close') {
      return <X size={icon} strokeWidth={1.8} className="text-fg-muted" />;
    }
    if (preset === 'more') {
      return <MoreHorizontal size={icon} strokeWidth={1.8} className="text-fg-muted" />;
    }
    return children;
  }

  return (
    <button
      className={[
        'flex items-center justify-center rounded-full flex-shrink-0',
        'cursor-pointer transition-transform duration-150 active:scale-[0.88]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        wrap,
        bgStyle,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {renderIcon()}
    </button>
  );
}
