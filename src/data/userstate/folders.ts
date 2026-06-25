/** 사용자 폴더 항목 (localStorage 저장 형태) */
export interface FolderEntry {
  id: string;
  name: string;
  /** ISO 8601 */
  createdAt: string;
  videoIds: string[];
}

/** 전체 폴더 고정 ID — UI에서 항상 첫 번째 탭으로 노출 */
export const ALL_FOLDER_ID = 'folder_all';

/** 기본 폴더 목록 (전체 폴더 1개만 포함) */
export const FOLDERS: FolderEntry[] = [
  {
    "id": "folder_all",
    "name": "전체",
    "createdAt": "2025-03-01T00:00:00.000Z",
    "videoIds": []
  }
];
