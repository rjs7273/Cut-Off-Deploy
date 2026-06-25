import { apiClient } from '@/lib/apiClient';
import type { WatchHistoryGroup } from '@/types/video';

export async function fetchHistory(): Promise<{ groups: WatchHistoryGroup[] }> {
  const { data } = await apiClient.get<{ groups: WatchHistoryGroup[] }>('/history');
  return data;
}

export async function addHistory(videoId: string): Promise<{ id: string; watchedAt: string }> {
  const { data } = await apiClient.post<{ id: string; watchedAt: string }>('/history', {
    videoId,
  });
  return data;
}

export async function deleteHistoryEntry(entryId: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(`/history/${entryId}`);
  return data;
}
