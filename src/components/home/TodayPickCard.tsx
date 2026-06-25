import type { VideoCard } from '@/types/video';
import { getCategoryLabel } from '@/data/categoryList';
import { thumbnailBackground } from '@/data/utils';

interface TodayPickCardProps {
  video: VideoCard;
  isSaved: boolean;
  onClickCard: () => void;
  onToggleSave: () => void;
}

export default function TodayPickCard({
  video,
  isSaved,
  onClickCard,
  onToggleSave,
}: TodayPickCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClickCard}
      onKeyDown={(e) => e.key === 'Enter' && onClickCard()}
      className="mx-5 my-4 border border-line rounded-app-xl overflow-hidden bg-surface-card cursor-pointer relative"
    >
      <button
        type="button"
        aria-label={isSaved ? '저장 해제' : '저장'}
        onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        className={[
          'absolute top-[11px] right-[13px] z-[3]',
          'w-[30px] h-[30px] rounded-full',
          'flex items-center justify-center',
          'border-none cursor-pointer',
          'shadow-[0_1px_5px_rgba(0,0,0,0.14)]',
          'transition-transform active:scale-[0.88]',
          'bg-white/90 dark:bg-[rgba(30,30,30,0.9)]',
        ].join(' ')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9 2.5C21 14.5 12 21 12 21Z"
            stroke={isSaved ? 'var(--color-navy)' : 'var(--color-fg-subtle)'}
            fill={isSaved ? 'var(--color-navy)' : 'none'}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex gap-2 items-center px-4 pt-[14px] pb-[10px]">
        <span className="text-[11px] font-bold text-navy bg-[#EEF1FF] px-[9px] py-[3px] rounded-[20px] tracking-[0.3px]">
          Today's Pick
        </span>
        <span className="text-[11px] text-fg-muted bg-tag px-[9px] py-[3px] rounded-[20px]">
          {getCategoryLabel(video.category)}
        </span>
      </div>

      <div
        className="w-full aspect-video flex items-center justify-center relative"
        style={{ background: thumbnailBackground(video) }}
      >
        <div className="w-12 h-12 bg-white/85 rounded-full flex items-center justify-center text-[18px]">
          ▶
        </div>
        <span className="absolute bottom-2 right-[10px] bg-black/70 text-white text-[11px] font-medium px-[7px] py-[2px] rounded-[4px]">
          {video.duration}
        </span>
      </div>

      <div className="px-4 pt-[14px]">
        <h2 className="text-[17px] font-bold text-fg leading-[1.4] mb-[5px] tracking-[-0.3px] whitespace-pre-line">
          {video.title}
        </h2>
        <p className="text-[12px] text-fg-muted mb-3">
          {video.channel}
        </p>
        <div className="bg-surface-sub rounded-app-sm px-3 py-[10px] mb-[14px]">
          <p className="text-[10px] font-bold text-navy tracking-[0.5px] uppercase mb-1">
            Editor's Comment
          </p>
          <p className="text-[13px] text-fg leading-[1.55]">
            {video.editorComment}
          </p>
        </div>
      </div>
    </div>
  );
}
