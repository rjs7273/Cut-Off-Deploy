import { apiClient } from '@/lib/apiClient';
import type { CategoryGroup, CategoryItem, CategoryMeta } from '@/types/catlist';

export async function fetchCategoryVideos(
  group: CategoryGroup,
  filter = '전체',
): Promise<{ meta: CategoryMeta; items: CategoryItem[] }> {
  const { data } = await apiClient.get<{ meta: CategoryMeta; items: CategoryItem[] }>(
    `/categories/${encodeURIComponent(group)}/videos`,
    { params: filter !== '전체' ? { filter } : undefined },
  );
  return data;
}
