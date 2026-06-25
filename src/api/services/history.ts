import { isMockApi } from '@/config/apiMode';
import { fetchHistory, deleteHistoryEntry, addHistory } from '@/api/history';
import {
  mockFetchHistory,
  mockDeleteHistoryEntry,
  mockAddHistory,
} from '@/api/mocks/historyMock';
import type { WatchHistoryGroup } from '@/types/video';

export async function loadHistory(): Promise<{ groups: WatchHistoryGroup[] }> {
  if (isMockApi()) {
    return mockFetchHistory();
  }
  return fetchHistory();
}

export async function recordWatchHistory(videoId: string): Promise<void> {
  if (isMockApi()) {
    await mockAddHistory(videoId);
    return;
  }
  await addHistory(videoId);
}

export async function removeHistoryEntry(entryId: string): Promise<void> {
  if (isMockApi()) {
    await mockDeleteHistoryEntry(entryId);
    return;
  }
  await deleteHistoryEntry(entryId);
}
