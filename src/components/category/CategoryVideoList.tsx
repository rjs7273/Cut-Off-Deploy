/* ─────────────────────────────────────────────────────────────────
   CategoryVideoList  (CMP-CAT-003)
   ─────────────────────────────────────────────────────────────────
   카테고리 영상 목록 컨테이너.
   빈 상태는 CategoryListPage에서 처리하며, 이 컴포넌트는
   아이템 렌더링만 담당한다.

   초안 HTML 참조:
     .catlist-items / .catlist-items-wrap (blurred 상태는 page에서 적용)
   ───────────────────────────────────────────────────────────────── */
import type { CategoryItem } from '@/types/catlist';
import CategoryVideoItem from './CategoryVideoItem';

interface CategoryVideoListProps {
  items: CategoryItem[];
  blurred?: boolean;
  onClickItem: (item: CategoryItem) => void;
}

export default function CategoryVideoList({
  items,
  blurred = false,
  onClickItem,
}: CategoryVideoListProps) {
  return (
    /* .catlist-items — padding: 12px 20px */
    <div
      className={[
        'px-5 py-3 transition-[filter]',
        blurred ? 'blur-[5px] pointer-events-none select-none' : '',
      ].join(' ')}
    >
      {items.map((item) => (
        <CategoryVideoItem key={item.id} item={item} onClick={onClickItem} />
      ))}
    </div>
  );
}
