/* ─────────────────────────────────────────────────────────────────
   HomeSkeleton
   ─────────────────────────────────────────────────────────────────
   홈 화면 데이터 로딩 중 표시하는 스켈레톤 UI.
   초안 HTML의 #home-skeleton 구조를 동일하게 구현.
   ───────────────────────────────────────────────────────────────── */

/** 공통 스켈레톤 바 (index.css .skel-bar 클래스 사용) */
function SkelBar({ className }: { className: string }) {
  return <span className={`skel-bar block ${className}`} />;
}

export default function HomeSkeleton() {
  return (
    <div>
      {/* ── Today's Pick 카드 스켈레톤 ── */}
      <div className="mx-5 my-4 border border-line rounded-app-xl overflow-hidden">
        {/* 레이블 칩 행 */}
        <div className="px-4 pt-3 pb-2 flex gap-2">
          <SkelBar className="w-[72px] h-[18px] rounded-[20px]" />
          <SkelBar className="w-[44px] h-[18px] rounded-[20px]" />
        </div>
        {/* 썸네일 */}
        <SkelBar className="w-full aspect-video rounded-none" />
        {/* 텍스트 + 버튼 */}
        <div className="px-4 pt-[14px] pb-4">
          <SkelBar className="w-[85%] h-[14px] rounded-[4px] mb-2" />
          <SkelBar className="w-[55%] h-[14px] rounded-[4px] mb-[14px]" />
          <SkelBar className="w-full h-[52px] rounded-app-md" />
        </div>
      </div>

      {/* ── 오늘의 다른 추천 스켈레톤 ── */}
      <div className="px-5 mb-3">
        <SkelBar className="w-[120px] h-[16px] rounded-[4px] mb-[6px]" />
        <SkelBar className="w-[200px] h-[12px] rounded-[4px] mb-[14px]" />
        <div className="flex gap-[10px]">
          <SkelBar className="w-[130px] h-[140px] rounded-app-md flex-shrink-0" />
          <SkelBar className="w-[130px] h-[140px] rounded-app-md flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
