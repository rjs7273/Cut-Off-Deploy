/* ─────────────────────────────────────────────────────────────────
   LoadingSkeleton  (CMP-UI-008)
   ─────────────────────────────────────────────────────────────────
   데이터 로딩 중 임시 UI 표시.

   type
   - card       : TodayPickCard 형태 (16:9 썸네일 + 제목 + 채널)
   - hcard      : 가로 스크롤 카드 (160px 너비, 소형 썸네일)
   - list-item  : CategoryVideoItem / SavedVideoItem 형태 (썸네일 + 텍스트 행)
   - page       : 전체 화면 (카드 + 리스트 혼합)
   ───────────────────────────────────────────────────────────────── */

export type SkeletonType = 'card' | 'hcard' | 'list-item' | 'page';

interface LoadingSkeletonProps {
  type?: SkeletonType;
  /** 반복 개수 (list-item / hcard 에서 사용) */
  count?: number;
  className?: string;
}

/* ── 공통 shimmer 블록 ── */
function SkelBar({ className = '' }: { className?: string }) {
  return (
    <span
      className={[
        'block rounded bg-skel',
        'animate-[skel-shine_1.4s_ease-in-out_infinite]',
        className,
      ].join(' ')}
    />
  );
}

/* ── TodayPickCard 스켈레톤 ── */
function CardSkeleton() {
  return (
    <div className="mx-5 my-4 rounded-app-xl border border-line overflow-hidden bg-surface-card">
      {/* 라벨 행 */}
      <div className="flex gap-2 px-4 pt-[14px] pb-[10px]">
        <SkelBar className="w-[50px] h-[20px] rounded-[20px]" />
        <SkelBar className="w-[60px] h-[20px] rounded-[20px]" />
      </div>
      {/* 16:9 썸네일 */}
      <SkelBar className="w-full aspect-video rounded-none" />
      {/* 정보 영역 */}
      <div className="px-4 pt-[14px] pb-4 space-y-2">
        <SkelBar className="w-[90%] h-[18px] rounded" />
        <SkelBar className="w-[60%] h-[14px] rounded" />
        {/* editor comment */}
        <div className="bg-surface-sub rounded-app-sm p-3 mt-2 space-y-2">
          <SkelBar className="w-[30%] h-[10px] rounded" />
          <SkelBar className="w-[100%] h-[13px] rounded" />
          <SkelBar className="w-[80%] h-[13px] rounded" />
        </div>
        {/* CTA 버튼 */}
        <SkelBar className="w-full h-[50px] rounded-app-md mt-1" />
      </div>
    </div>
  );
}

/* ── 가로 스크롤 hcard 스켈레톤 ── */
function HCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[160px] rounded-app-md border border-line overflow-hidden bg-surface-card">
      <SkelBar className="w-full h-[90px] rounded-none" />
      <div className="p-[10px] space-y-2">
        <SkelBar className="w-[90%] h-[12px] rounded" />
        <SkelBar className="w-[70%] h-[12px] rounded" />
        <SkelBar className="w-[40%] h-[10px] rounded mt-1" />
      </div>
    </div>
  );
}

/* ── 리스트 아이템 스켈레톤 (CategoryVideoItem / SavedVideoItem) ── */
function ListItemSkeleton() {
  return (
    <div className="flex gap-3 py-[14px] border-b border-line">
      {/* 썸네일 */}
      <SkelBar className="flex-shrink-0 w-[100px] h-[56px] rounded-app-sm" />
      {/* 텍스트 */}
      <div className="flex-1 space-y-2 pt-1">
        <SkelBar className="w-[90%] h-[14px] rounded" />
        <SkelBar className="w-[60%] h-[12px] rounded" />
        <SkelBar className="w-[80%] h-[11px] rounded" />
      </div>
    </div>
  );
}

/* ── 섹션 헤더 스켈레톤 ── */
function SectionHeaderSkeleton() {
  return (
    <div className="px-5 pb-[10px] space-y-1">
      <SkelBar className="w-[120px] h-[16px] rounded" />
      <SkelBar className="w-[200px] h-[12px] rounded" />
    </div>
  );
}

/* ── 전체 페이지 스켈레톤 ── */
function PageSkeleton() {
  return (
    <div className="flex-1">
      {/* 메인 카드 */}
      <CardSkeleton />
      {/* 섹션 1 */}
      <div className="pt-2">
        <SectionHeaderSkeleton />
        <div className="flex gap-3 px-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <HCardSkeleton key={i} />
          ))}
        </div>
      </div>
      {/* 섹션 2 */}
      <div className="pt-4">
        <SectionHeaderSkeleton />
        <div className="px-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  type = 'card',
  count = 3,
  className = '',
}: LoadingSkeletonProps) {
  return (
    <div className={className} aria-busy="true" aria-label="로딩 중">
      {type === 'card' && <CardSkeleton />}

      {type === 'hcard' && (
        <div className="flex gap-3 px-5 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <HCardSkeleton key={i} />
          ))}
        </div>
      )}

      {type === 'list-item' && (
        <div className="px-5">
          {Array.from({ length: count }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      )}

      {type === 'page' && <PageSkeleton />}
    </div>
  );
}
