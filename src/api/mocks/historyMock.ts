import type { WatchHistoryGroup, WatchHistoryItem } from '@/types/video';
import { mapCatalogVideoToCard } from '@/api/mocks/mockCatalog';
import { useHistoryStore } from '@/store/historyStore';
import { useSavedStore } from '@/store/savedStore';

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getGroupLabel(date: string): string {
  const today = todayIso();
  if (date === today) return '오늘';
  const todayDate = new Date(`${today}T00:00:00`);
  const yesterday = new Date(todayDate);
  yesterday.setDate(todayDate.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  if (date === yesterdayStr) return '어제';
  const [year, month, day] = date.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function formatWatchedAt(date: string, time: string): string {
  const label = getGroupLabel(date);
  if (label === '오늘' || label === '어제') return `${label} ${time}`;
  return time;
}

const MOCK_DELAY_MS = 400;

export async function mockFetchHistory(): Promise<{ groups: WatchHistoryGroup[] }> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  const watchedVideoIds = useHistoryStore.getState().watchedVideoIds;
  const savedVideoIds = useSavedStore.getState().savedVideoIds;
  const savedIds = new Set(savedVideoIds.map((s) => s.id));

  const groupMap = new Map<string, typeof watchedVideoIds>();
  for (const entry of watchedVideoIds) {
    const existing = groupMap.get(entry.watchedDate) ?? [];
    groupMap.set(entry.watchedDate, [...existing, entry]);
  }

  const groups: WatchHistoryGroup[] = [];
  for (const [date, entries] of groupMap) {
    const items: WatchHistoryItem[] = entries
      .map((entry) => {
        const video = mapCatalogVideoToCard(entry.id, savedIds.has(entry.id));
        if (!video) return null;
        return {
          id: `hist_${entry.id}`,
          video,
          watchedAt: formatWatchedAt(date, entry.watchedTime),
          isSaved: savedIds.has(entry.id),
        };
      })
      .filter((item): item is WatchHistoryItem => item !== null);

    if (items.length > 0) {
      groups.push({ label: getGroupLabel(date), items });
    }
  }

  return { groups };
}

export async function mockAddHistory(videoId: string): Promise<void> {
  useHistoryStore.getState().addWatched(videoId);
}

export async function mockDeleteHistoryEntry(historyId: string): Promise<void> {
  const videoId = historyId.replace(/^hist_/, '');
  useHistoryStore.getState().removeWatched(videoId);
}
