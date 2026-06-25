import type { VideoCard } from '@/types/video';
import { getThumbnailBackground } from './videoList';

/** "18:42" → "18분 42초" */
export function toDurationLabel(duration: string): string {
  const [min, sec] = duration.split(':');
  return `${Number(min)}분 ${sec}초`;
}

/** 썸네일 URL 없을 때 gradient fallback (매퍼 레이어 없이 UI에서 사용) */
export function thumbnailBackground(video: Pick<VideoCard, 'id' | 'thumbnailUrl'>): string {
  if (video.thumbnailUrl) {
    return `url(${video.thumbnailUrl}) center/cover no-repeat`;
  }
  return getThumbnailBackground(video.id, null);
}
