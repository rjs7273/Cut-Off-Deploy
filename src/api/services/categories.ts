import { isMockApi } from '@/config/apiMode';
import { fetchCategoryVideos } from '@/api/categories';
import { mockFetchCategoryVideos } from '@/api/mocks/categoriesMock';
import type { CategoryGroup, CategoryItem, CategoryMeta } from '@/types/catlist';

export async function loadCategoryVideos(
  group: CategoryGroup,
  filter = '전체',
): Promise<{ meta: CategoryMeta; items: CategoryItem[] }> {
  if (isMockApi()) {
    return mockFetchCategoryVideos(group, filter);
  }
  return fetchCategoryVideos(group, filter);
}
