import { isMockApi } from '@/config/apiMode';
import {
  fetchTodayRecommendations,
  skipRecommendation,
  restoreRecommendation,
} from '@/api/recommendations';
import {
  mockFetchTodayRecommendations,
  mockSkipRecommendation,
  mockRestoreRecommendation,
} from '@/api/mocks/recommendationsMock';
import type { HomeVideo } from '@/types/home';
import type { VideoCard } from '@/types/video';
import type { SelectedCategory } from '@/types/auth';

export async function getTodayRecommendations(
  selectedCategories: SelectedCategory[],
): Promise<{ pick: HomeVideo; others: VideoCard[] }> {
  if (isMockApi()) {
    return mockFetchTodayRecommendations(selectedCategories);
  }
  return fetchTodayRecommendations();
}

export async function skipVideoRecommendation(
  videoId: string,
  reason?: string,
): Promise<void> {
  if (isMockApi()) {
    await mockSkipRecommendation(videoId, reason);
    return;
  }
  await skipRecommendation(videoId, reason);
}

export async function restoreVideoRecommendation(videoId: string): Promise<void> {
  if (isMockApi()) {
    await mockRestoreRecommendation(videoId);
    return;
  }
  await restoreRecommendation(videoId);
}
