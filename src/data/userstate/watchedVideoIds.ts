/** 시청 기록 단일 항목 */
export interface WatchedVideoEntry {
  id: string;
  /** ex) "2025-04-28" */
  watchedDate: string;
  /** ex) "오전 8:14", "오후 7:32" */
  watchedTime: string;
}

export const WATCHED_VIDEO_IDS: WatchedVideoEntry[] = [];
