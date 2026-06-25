import type { CategoryGroup, CategoryItem, CategoryMeta } from '@/types/catlist';
import { useSavedStore } from '@/store/savedStore';
import { buildCategoryMeta, buildCategoryVideoItems } from '@/api/mocks/mockCatalog';

const MOCK_DELAY_MS = 300;

export async function mockFetchCategoryVideos(
  group: CategoryGroup,
  filter = '전체',
): Promise<{ meta: CategoryMeta; items: CategoryItem[] }> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  const meta = buildCategoryMeta(group);
  if (!meta) {
    throw new Error('카테고리를 찾을 수 없습니다.');
  }

  const savedIds = new Set(useSavedStore.getState().savedVideoIds.map((s) => s.id));
  const items = buildCategoryVideoItems(group, filter, savedIds);

  return { meta, items };
}
