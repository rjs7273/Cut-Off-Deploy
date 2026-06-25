import type { VideoCard } from './video';

/** BE GET /saved folders[] */
export interface FolderTab {
  id: string;
  name: string;
  count: number;
}

/** UI 폴더 탭 (FolderTab 동일) */
export type Folder = FolderTab;

/** BE GET /saved items[] */
export interface SavedVideo {
  id: string;
  video: VideoCard;
  savedAt: string;
  folderIds: string[];
  isSaved: boolean;
}

/** BE POST /saved/folders 응답 */
export interface FolderEntry {
  id: string;
  name: string;
  createdAt: string;
  videoIds: string[];
}
