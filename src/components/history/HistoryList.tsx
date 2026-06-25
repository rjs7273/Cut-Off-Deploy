import type { WatchHistoryGroup, WatchHistoryItem } from '@/types/video';
import HistoryItem from './HistoryItem';

/* ─────────────────────────────────────────────────────────────────
   HistoryList  (CMP-HISTORY-002)
   ─────────────────────────────────────────────────────────────────
   시청 기록을 날짜별로 그룹화해 표시한다.
   오늘 / 어제 / 특정 날짜 그룹.

   초안 CSS:
     .saved-wrap / .saved-list / .history-date-label
   ───────────────────────────────────────────────────────────────── */

interface HistoryListProps {
  groups: WatchHistoryGroup[];
  onClickItem: (item: WatchHistoryItem) => void;
  onDeleteItem: (historyId: string) => void;
}

export default function HistoryList({
  groups,
  onClickItem,
  onDeleteItem,
}: HistoryListProps) {
  return (
    /* .saved-wrap */
    <div className="flex-1 overflow-y-auto">
      {/* .saved-list */}
      <div className="px-5 pt-2 pb-6">
        {groups.map((group) => (
          <div key={group.label}>
            {/* .history-date-label */}
            <p className="section-label-upper pt-4 pb-[6px]">
              {group.label}
            </p>

            {group.items.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                onClick={() => onClickItem(item)}
                onDelete={onDeleteItem}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
