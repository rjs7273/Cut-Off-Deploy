/* BE VideoCard 와 동일 (back-end/src/types/index.ts) */
export interface VideoCard {
  id: string;
  title: string;
  channel: string;
  duration: string;
  category: string;
  summary: string;
  editorComment: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  isSaved: boolean;
}

export interface WatchHistoryItem {
  id: string;
  video: VideoCard;
  watchedAt: string;
  isSaved: boolean;
}

export interface WatchHistoryGroup {
  label: string;
  items: WatchHistoryItem[];
}
