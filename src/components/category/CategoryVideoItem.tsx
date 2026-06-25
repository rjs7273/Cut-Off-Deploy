import type { CategoryItem } from '@/types/catlist';
import { thumbnailBackground } from '@/data/utils';

interface CategoryVideoItemProps {
  item: CategoryItem;
  onClick: (item: CategoryItem) => void;
}

export default function CategoryVideoItem({ item, onClick }: CategoryVideoItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
      className="flex gap-3 py-[14px] border-b border-line cursor-pointer last:border-b-0"
    >
      <div
        className="w-[100px] h-[56px] rounded-[var(--radius-sm)] flex-shrink-0 relative"
        style={{ background: thumbnailBackground(item) }}
      >
        <span className="absolute bottom-1 right-[5px] bg-black/70 text-white text-[10px] px-1 py-px rounded-[3px]">
          {item.duration}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-fg leading-[1.4] mb-1 line-clamp-2">
          {item.title}
        </p>
        <p className="text-[12px] text-fg-muted mb-1">{item.channel}</p>
        <p className="text-[11px] text-fg-subtle leading-[1.4] line-clamp-2">
          {item.editorComment}
        </p>
      </div>
    </div>
  );
}
