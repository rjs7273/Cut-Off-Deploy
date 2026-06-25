import type { HomeVideo } from '@/types/home';
import type { VideoCard } from '@/types/video';
import type { SelectedCategory } from '@/types/auth';
import { TODAYS_PICK } from '@/data/todaysPick';
import { mapCatalogVideoToCard, mapCatalogVideoToHomeVideo } from '@/api/mocks/mockCatalog';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MOCK_DELAY_MS = 600;

export async function mockFetchTodayRecommendations(
  selectedCategories: SelectedCategory[],
): Promise<{ pick: HomeVideo; others: VideoCard[] }> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  const selectedSubs = selectedCategories.flatMap((c) => c.subCategories);
  if (selectedSubs.length === 0) {
    throw new Error('관심사를 선택하면 추천이 시작됩니다.');
  }

  const userCatIds: string[] = [];
  const otherCatIds: string[] = [];

  for (const big of TODAYS_PICK) {
    for (const sub of big.subCategories) {
      if (!sub.videoId) continue;
      if (selectedSubs.includes(sub.subCategory)) {
        userCatIds.push(sub.videoId);
      } else {
        otherCatIds.push(sub.videoId);
      }
    }
  }

  if (userCatIds.length === 0) {
    throw new Error('추천 영상을 불러오지 못했습니다.');
  }

  const [pickId, ...restUserIds] = shuffle(userCatIds);
  const pickVideo = mapCatalogVideoToHomeVideo(pickId);
  if (!pickVideo) {
    throw new Error('추천 영상을 불러오지 못했습니다.');
  }

  const OTHER_MIN = 6;
  const needed = Math.max(0, OTHER_MIN - restUserIds.length);
  const randomFill = shuffle(otherCatIds).slice(0, needed);
  const otherIds = [...restUserIds, ...randomFill];

  const others = otherIds
    .map((id) => mapCatalogVideoToCard(id))
    .filter((v): v is VideoCard => v !== null);

  return { pick: pickVideo, others };
}

export async function mockSkipRecommendation(videoId: string, reason?: string): Promise<void> {
  void videoId;
  void reason;
  await new Promise((r) => setTimeout(r, 200));
}

export async function mockRestoreRecommendation(videoId: string): Promise<void> {
  void videoId;
  await new Promise((r) => setTimeout(r, 200));
}
