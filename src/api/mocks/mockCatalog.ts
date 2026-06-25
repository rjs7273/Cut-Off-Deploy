/**
 * Mock BE 영상 카탈로그 — api/mocks 내부 전용.
 * hooks/pages는 이 모듈을 import하지 않고 api/services를 통해서만 데이터를 받는다.
 */
import type { CategoryGroup, CategoryItem, CategoryMeta } from '@/types/catlist';
import type { VideoCard } from '@/types/video';
import type { HomeVideo } from '@/types/home';
import { VIDEO_LIST } from '@/data/videoList';
import { CATEGORY_LIST } from '@/data/categoryList';

export function mapCatalogVideoToCard(id: string, isSaved = false): VideoCard | null {
  for (const big of VIDEO_LIST) {
    for (const sub of big.subCategories) {
      const video = sub.videos.find((v) => v.id === id);
      if (video) {
        return {
          id: video.id,
          title: video.title,
          channel: video.channel,
          duration: video.duration,
          category: sub.subCategory,
          editorComment: video.editorComment,
          summary: video.summary,
          thumbnailUrl: video.thumbnailUrl ?? '',
          youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
          isSaved,
        };
      }
    }
  }
  return null;
}

export function mapCatalogVideoToHomeVideo(id: string, isSaved = false): HomeVideo | null {
  for (const big of VIDEO_LIST) {
    for (const sub of big.subCategories) {
      const video = sub.videos.find((v) => v.id === id);
      if (video) {
        const card = mapCatalogVideoToCard(id, isSaved);
        if (!card) return null;
        return { ...card, date: video.createdAt };
      }
    }
  }
  return null;
}

export function buildCategoryMeta(group: CategoryGroup): CategoryMeta | null {
  const node = CATEGORY_LIST.find((c) => c.bigCategory === group);
  if (!node) return null;
  return {
    name: node.bigCategory,
    desc: node.desc,
    filters: ['전체', ...node.subCategories],
  };
}

export function buildCategoryVideoItems(
  group: CategoryGroup,
  filter = '전체',
  savedIds = new Set<string>(),
): CategoryItem[] {
  const bigCat = VIDEO_LIST.find((b) => b.bigCategory === group);
  if (!bigCat) return [];

  const items: CategoryItem[] = [];
  for (const sub of bigCat.subCategories) {
    if (filter !== '전체' && sub.subCategory !== filter) continue;
    for (const video of sub.videos) {
      items.push({
        id: video.id,
        title: video.title,
        channel: video.channel,
        duration: video.duration,
        category: sub.subCategory,
        group,
        editorComment: video.editorComment,
        summary: video.summary,
        thumbnailUrl: video.thumbnailUrl ?? '',
        youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
        isSaved: savedIds.has(video.id),
      });
    }
  }
  return items;
}
