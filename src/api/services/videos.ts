import { mapCatalogVideoToCard } from '@/api/mocks/mockCatalog';
import { useSavedStore } from '@/store/savedStore';
import type { VideoCard } from '@/types/video';

export async function getVideoById(videoId: string): Promise<VideoCard | null> {
  const isSaved = useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
  return mapCatalogVideoToCard(videoId, isSaved);
}
