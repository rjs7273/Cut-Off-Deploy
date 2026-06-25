import type { SavedVideo } from '@/types/saved';
import { getCategoryLabel } from '@/data/categoryList';
import { thumbnailBackground } from '@/data/utils';

interface Props {
  item: SavedVideo;
  onClick: (item: SavedVideo) => void;
  onToggleSave: (id: string) => void;
}

export default function SavedVideoItem({ item, onClick, onToggleSave }: Props) {
  const { video, savedAt, isSaved } = item;

  return (
    <div
      className="flex gap-[12px] py-[14px] border-b border-line cursor-pointer items-start"
      onClick={() => onClick(item)}
    >
      <div
        className="w-[100px] h-[56px] rounded-[6px] flex-shrink-0 relative"
        style={{ background: thumbnailBackground(video) }}
      >
        <span className="absolute bottom-[4px] right-[5px] bg-black/70 text-white text-[10px] px-[4px] py-[1px] rounded-[3px] leading-none">
          {video.duration}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-fg leading-[1.4] mb-[3px] line-clamp-2">
          {video.title}
        </p>
        <p className="text-[12px] text-fg-muted mb-[3px]">{video.channel}</p>
        <p className="text-[11px] text-fg-subtle">저장일 {savedAt}</p>
        <span className="inline-block text-[10px] text-navy bg-[#EEF1FF] px-[7px] py-[2px] rounded-full mt-[4px]">
          {getCategoryLabel(video.category)}
        </span>
      </div>

      <button
        className={[
          'flex-shrink-0 w-[28px] h-[28px] border-none cursor-pointer flex items-center justify-center active:scale-85 transition-all duration-150',
          isSaved ? 'bg-transparent text-navy' : 'bg-transparent text-fg-muted',
        ].join(' ')}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(item.id);
        }}
        title={isSaved ? '저장 해제' : '저장'}
        aria-label={isSaved ? '저장 해제' : '저장'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9 2.5C21 14.5 12 21 12 21Z"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
