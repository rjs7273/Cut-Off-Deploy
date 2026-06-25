import type { VideoCard } from '@/types/video';
import type { UserTier } from '@/types/userTier';
import OtherHCard from './OtherHCard';

interface OtherSectionProps {
  videos: VideoCard[];
  savedIds: Set<string>;
  skippedOtherIds: Set<string>;
  userTier: UserTier;
  onClickCard: (video: VideoCard) => void;
  onToggleSave: (id: string) => void;
  onSkipOther: (id: string) => void;
  onRestoreOther: (id: string) => void;
  onClickSubscribe: () => void;
}

export default function OtherSection({
  videos,
  savedIds,
  skippedOtherIds,
  userTier,
  onClickCard,
  onToggleSave,
  onSkipOther,
  onRestoreOther,
  onClickSubscribe,
}: OtherSectionProps) {
  const isLocked = userTier === 'guest' || userTier === 'free';
  const isGuest  = userTier === 'guest';

  const wrapperClass = [
    'pt-2 relative overflow-hidden',
    isLocked && videos.length === 0 ? 'min-h-[220px]' : '',
  ].join(' ');

  return (
    <div className={wrapperClass}>
      <div className={isLocked ? 'blur-[6px] pointer-events-none select-none' : ''}>
        <div className="px-5 pb-[10px]">
          <h3 className="text-[16px] font-bold text-fg mb-[3px]">오늘의 다른 추천</h3>
          <p className="text-[12px] text-fg-muted">
            오늘의 대표 영상이 맞지 않는다면, 이 영상들도 괜찮습니다.
          </p>
        </div>

        <div className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide">
          {videos.map((video) => (
            <OtherHCard
              key={video.id}
              video={video}
              isSkipped={skippedOtherIds.has(video.id)}
              isSaved={savedIds.has(video.id)}
              onClickCard={onClickCard}
              onToggleSave={onToggleSave}
              onSkip={onSkipOther}
              onRestore={onRestoreOther}
            />
          ))}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/72 dark:bg-black/60 backdrop-blur-[2px] z-[5] gap-2 px-4 py-4 text-center">
          <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white flex-shrink-0 mb-[2px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[13px] font-bold text-fg leading-[1.4]">
            추가 추천은 구독자 전용이에요
          </p>
          <p className="text-[12px] text-fg-muted leading-[1.5]">
            오늘의 다른 추천 영상은<br />구독하면 모두 볼 수 있어요.
          </p>
          <button
            type="button"
            onClick={onClickSubscribe}
            className="mt-1 px-[18px] py-2 bg-navy text-white text-[12px] font-bold rounded-[20px] border-none cursor-pointer"
          >
            {isGuest ? '로그인 / 구독 시작하기' : '구독 시작하기'}
          </button>
        </div>
      )}
    </div>
  );
}
