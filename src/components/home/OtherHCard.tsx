import type { VideoCard } from '@/types/video';
import { getCategoryLabel } from '@/data/categoryList';
import { thumbnailBackground } from '@/data/utils';

interface OtherHCardProps {
  video: VideoCard;
  isSkipped: boolean;
  isSaved: boolean;
  onClickCard: (video: VideoCard) => void;
  onToggleSave: (id: string) => void;
  onSkip: (id: string) => void;
  onRestore: (id: string) => void;
}

export default function OtherHCard({
  video,
  isSkipped,
  isSaved,
  onClickCard,
  onToggleSave,
  onRestore,
}: OtherHCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !isSkipped && onClickCard(video)}
      onKeyDown={(e) => !isSkipped && e.key === 'Enter' && onClickCard(video)}
      className="flex-shrink-0 w-[160px] rounded-app-md border border-line bg-surface-card overflow-hidden cursor-pointer relative"
    >
      <div
        className="w-full h-[90px] relative"
        style={{ background: thumbnailBackground(video) }}
      >
        <span className="absolute bottom-[5px] right-[6px] bg-black/70 text-white text-[10px] px-[5px] py-px rounded-[3px]">
          {video.duration}
        </span>
        <button
          type="button"
          aria-label={isSaved ? '저장 해제' : '저장'}
          onClick={(e) => { e.stopPropagation(); onToggleSave(video.id); }}
          className="absolute top-[6px] right-[6px] w-[26px] h-[26px] rounded-full bg-white/90 dark:bg-[rgba(30,30,30,0.9)] flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.14)] border-none cursor-pointer transition-transform active:scale-[0.88]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9 2.5C21 14.5 12 21 12 21Z"
              stroke={isSaved ? 'var(--color-navy)' : 'var(--color-fg-subtle)'}
              fill={isSaved ? 'var(--color-navy)' : 'none'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="px-[10px] pt-2 pb-[10px]">
        <p className="text-[12px] font-semibold text-fg leading-[1.4] mb-1 line-clamp-2">
          {video.title}
        </p>
        <p className="text-[11px] text-fg-muted">{video.channel}</p>
        <span className="inline-block text-[10px] text-navy bg-[#EEF1FF] px-[7px] py-[2px] rounded-[20px] mt-[5px]">
          {getCategoryLabel(video.category)}
        </span>
      </div>

      {isSkipped && (
        <div
          className="absolute inset-0 bg-surface-sub flex flex-col items-center justify-center gap-[5px] z-[2] px-2 py-[10px] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-fg-subtle">
            <path d="M5 12h14M15 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-semibold text-fg-muted">넘긴 영상</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRestore(video.id); }}
            className="text-[10px] text-fg-muted bg-surface border border-line rounded-[20px] px-[10px] py-[3px] cursor-pointer mt-[2px] hover:border-navy hover:text-navy transition-colors"
          >
            ↩ 되돌리기
          </button>
        </div>
      )}
    </div>
  );
}
