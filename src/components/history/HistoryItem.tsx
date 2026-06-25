import type { WatchHistoryItem } from '@/types/video';
import { getCategoryLabel } from '@/data/categoryList';
import { thumbnailBackground } from '@/data/utils';

interface HistoryItemProps {
  item: WatchHistoryItem;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ item, onClick, onDelete }: HistoryItemProps) {
  const { video, watchedAt } = item;

  return (
    <div
      className="flex gap-3 py-[14px] border-b border-line cursor-pointer items-start"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${video.title} 상세 보기`}
    >
      <div
        className="w-[100px] h-[56px] rounded-app-sm flex-shrink-0 relative"
        style={{ background: thumbnailBackground(video) }}
        aria-hidden="true"
      >
        <span className="absolute bottom-1 right-[5px] bg-black/70 text-white text-[10px] px-1 py-[1px] rounded-[3px]">
          {video.duration}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-fg leading-[1.4] mb-[3px] line-clamp-2">
          {video.title}
        </p>
        <p className="text-[12px] text-fg-muted mb-[3px]">{video.channel}</p>
        <p className="text-[11px] text-fg-subtle">{watchedAt}</p>
        <div className="mt-1">
          <span className="text-[10px] text-navy bg-[#EEF1FF] px-[7px] py-[2px] rounded-full inline-block">
            {getCategoryLabel(video.category)}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center text-fg-subtle flex-shrink-0 transition-transform active:scale-[0.85]"
        aria-label="시청 기록에서 삭제"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
