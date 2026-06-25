import type { UserTier } from '@/types/userTier';

interface CategoryLockOverlayProps {
  userTier: UserTier;
  onClickSubscribe: () => void;
}

export default function CategoryLockOverlay({
  userTier,
  onClickSubscribe,
}: CategoryLockOverlayProps) {
  const isGuest = userTier === 'guest';

  const desc = isGuest
    ? '로그인 후 구독하면 모든 카테고리 영상을\n제한 없이 볼 수 있어요.'
    : '구독하면 모든 카테고리 영상을\n제한 없이 볼 수 있어요.';

  const ctaLabel = isGuest ? '로그인 / 구독 시작하기' : '구독 시작하기';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-start pt-10 gap-[10px] z-[5]"
      style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-surface) 30%)' }}
      aria-live="polite"
    >
      <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white flex-shrink-0 mb-[2px]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-[15px] font-bold text-fg text-center leading-[1.5]">
        카테고리별 영상은<br />구독자 전용이에요
      </p>

      <p className="text-[13px] text-fg-muted text-center leading-[1.6] mb-1 whitespace-pre-line">
        {desc}
      </p>

      <button
        type="button"
        onClick={onClickSubscribe}
        className="mt-1 px-[18px] py-2 bg-navy text-white text-[12px] font-bold rounded-[20px] border-none cursor-pointer"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
