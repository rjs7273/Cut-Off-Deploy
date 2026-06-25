/* ─────────────────────────────────────────────────────────────────
   catlist — Catlist 미구현 API 대체용 로컬 타입
   영상 필드는 BE VideoCard 와 동일 + group
   ───────────────────────────────────────────────────────────────── */
import type { VideoCard } from './video';

export type CategoryGroup = '비즈니스' | '성장' | '문화·라이프' | '트렌드';

export interface CategoryMeta {
  name: CategoryGroup;
  desc: string;
  filters: string[];
}

export type CategoryItem = VideoCard & {
  group: CategoryGroup;
};
