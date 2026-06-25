/* ─────────────────────────────────────────────────────────────────
   CMP-SAVED-003 · SavedVideoList
   저장한 영상 목록 컨테이너
   ───────────────────────────────────────────────────────────────── */
import type { SavedVideo } from '@/types/saved';
import SavedVideoItem from './SavedVideoItem';

interface Props {
  items: SavedVideo[];
  onClickItem: (item: SavedVideo) => void;
  onToggleSave: (id: string) => void;
}

export default function SavedVideoList({ items, onClickItem, onToggleSave }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-[20px] pb-[24px] pt-[8px]">
        {items.map((item) => (
          <SavedVideoItem
            key={item.id}
            item={item}
            onClick={onClickItem}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </div>
  );
}
