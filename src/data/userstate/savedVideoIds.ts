/** 저장한 영상 단일 항목 */
export interface SavedVideoEntry {
  id: string;
  /** 저장일 ex) "2025.04.28" */
  savedAt: string;
}

export const SAVED_VIDEO_IDS: SavedVideoEntry[] = [];
