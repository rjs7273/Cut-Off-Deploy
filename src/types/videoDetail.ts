import { useSavedStore } from '@/store/savedStore';
import type { VideoCard } from '@/types/video';

export type VideoDetailSource = 'history' | 'home' | 'catlist' | 'saved';

/** VideoDetailPage 진입 시 location.state */
export interface VideoDetailLocationState {
  video?: VideoCard;
  historyId?: string;
  savedId?: string;
  homeSkipContext?: 'pick' | 'other';
}

/** VideoDetailPage → 목록 페이지 복귀 시 전달 state */
export interface VideoDetailReturnState {
  homeSkip?: { type: 'pick' | 'other'; videoId: string };
  homeSaved?: { videoId: string; isSaved: boolean };
  historyDeleted?: string;
  historySaved?: { historyId: string; isSaved: boolean };
  savedUnsaved?: string;
}

export const VIDEO_DETAIL_RETURN_PATH: Record<string, string> = {
  home: '/home',
  catlist: '/catlist',
  saved: '/saved',
  history: '/history',
};

export function isVideoSavedInStore(videoId: string): boolean {
  return useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
}

/**
 * 영상 상세 저장 상태 — 기존 시트 규칙 반영.
 * - saved: selectedItem?.isSaved ?? true
 * - 그 외: 목록 state 또는 savedStore
 */
export function resolveVideoDetailIsSaved(
  videoId: string,
  source: VideoDetailSource,
  stateVideo?: VideoCard | null,
): boolean {
  const fromStore = isVideoSavedInStore(videoId);

  if (source === 'saved') {
    return stateVideo?.isSaved ?? fromStore ?? true;
  }

  if (fromStore) return true;

  if (stateVideo?.isSaved !== undefined) {
    return stateVideo.isSaved;
  }

  return false;
}
