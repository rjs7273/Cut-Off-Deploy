import { apiClient } from '@/lib/apiClient';
import type { VideoCard } from '@/types/video';

export async function fetchTodayRecommendations(): Promise<{
  pick: VideoCard;
  others: VideoCard[];
}> {
  const { data } = await apiClient.get<{ pick: VideoCard; others: VideoCard[] }>(
    '/recommendations/today',
  );
  return data;
}

export async function skipRecommendation(
  videoId: string,
  reason?: string,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.post<{ success: boolean }>(
    `/recommendations/${videoId}/skip`,
    reason ? { reason } : {},
  );
  return data;
}

export async function restoreRecommendation(videoId: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/recommendations/${videoId}/skip`,
  );
  return data;
}
