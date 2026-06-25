/* ─────────────────────────────────────────────────────────────────
   SkippedCard  (CMP-HOME-003)
   ─────────────────────────────────────────────────────────────────
   Today's Pick을 "오늘은 안 볼래요"로 스킵했을 때 표시되는 카드.

   초안 HTML 참조:
     .home-skipped-card / .skipped-icon / .skipped-title
     .skipped-desc / .skipped-meta / .btn-undo
   ───────────────────────────────────────────────────────────────── */

interface SkippedCardProps {
  onClickRestore: () => void;
}

export default function SkippedCard({ onClickRestore }: SkippedCardProps) {
  /* 다음 새벽 6시까지 남은 시간을 계산해 표시 */
  function nextPickHours(): string {
    const now = new Date();
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
    const diff = Math.round((next.getTime() - now.getTime()) / 3600000);
    return `약 ${diff}시간`;
  }

  return (
    /* .home-skipped-card — mx:20px my:16px, border, rounded-xl, bg-sub */
    <div className="mx-5 my-4 border border-line rounded-app-xl overflow-hidden bg-surface-sub px-5 py-7 text-center">
      {/* .skipped-icon */}
      <div className="flex justify-center mb-3 text-fg-subtle">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M15 8l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* .skipped-title */}
      <p className="text-[16px] font-bold text-fg mb-[6px]">
        오늘의 영상을 넘겼습니다
      </p>

      {/* .skipped-desc */}
      <p className="text-[13px] text-fg-muted leading-[1.6] mb-4">
        내일 새로운 영상이 준비됩니다.<br />그동안 다른 추천을 둘러보세요.
      </p>

      {/* .skipped-meta */}
      <p className="text-[12px] text-fg-subtle mb-4">
        다음 추천까지 {nextPickHours()}
      </p>

      {/* .btn-undo */}
      <button
        type="button"
        onClick={onClickRestore}
        className="inline-flex items-center gap-[6px] px-[18px] py-2 border border-line rounded-[20px] bg-surface text-fg-muted text-[13px] cursor-pointer hover:border-navy hover:text-navy transition-colors"
      >
        ↩ 되돌리기
      </button>
    </div>
  );
}
