/* ─────────────────────────────────────────────────────────────────
   savedStore — 저장 영상 · 폴더 상태
   Zustand persist 로 localStorage 직접 관리 (key: cutoff-saved).

   사용처:
     - 읽기:   useSavedVideos, useHome, SavedPage, HistoryPage,
               CategoryListPage, SaveFolderBottomSheet
     - 쓰기:   toggleSave, saveToFolder, addFolder (VideoDetailBottomSheet 등)
     - 초기화: authStore.logout()
   ───────────────────────────────────────────────────────────────── */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedVideoEntry } from '@/data/userstate/savedVideoIds';
import type { FolderEntry } from '@/data/userstate/folders';
import { SAVED_VIDEO_IDS } from '@/data/userstate/savedVideoIds';
import { FOLDERS, ALL_FOLDER_ID } from '@/data/userstate/folders';

interface SavedState {
  savedVideoIds: SavedVideoEntry[];
  folders: FolderEntry[];

  /** 영상 저장 상태 토글 */
  toggleSave: (videoId: string) => void;
  /** 영상을 특정 폴더에 저장 (미저장이면 먼저 추가) */
  saveToFolder: (videoId: string, folderId: string) => void;
  /** 새 폴더 생성 */
  addFolder: (name: string) => FolderEntry;
  /** 사용자 폴더 삭제 (전체 폴더는 삭제 불가, 영상은 저장 목록에 유지) */
  deleteFolder: (folderId: string) => void;
  /** 로그아웃 시 전체 초기화 */
  reset: () => void;
  /** 로그인 후 서버 데이터 복원 */
  restoreFromRecord: (savedVideoIds: SavedVideoEntry[], folders: FolderEntry[]) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedVideoIds: SAVED_VIDEO_IDS,
      folders: FOLDERS,

      toggleSave: (videoId) => {
        const { savedVideoIds, folders } = get();
        const isSaved = savedVideoIds.some((e) => e.id === videoId);

        if (isSaved) {
          set({
            savedVideoIds: savedVideoIds.filter((e) => e.id !== videoId),
            folders: folders.map((f) => ({
              ...f,
              videoIds: f.videoIds.filter((id) => id !== videoId),
            })),
          });
        } else {
          const savedAt = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
          set({
            savedVideoIds: [...savedVideoIds, { id: videoId, savedAt }],
            folders: folders.map((f) =>
              f.id === ALL_FOLDER_ID
                ? { ...f, videoIds: [...f.videoIds, videoId] }
                : f,
            ),
          });
        }
      },

      saveToFolder: (videoId, folderId) => {
        const { savedVideoIds, folders } = get();
        let updatedIds = savedVideoIds;

        if (!savedVideoIds.some((e) => e.id === videoId)) {
          const savedAt = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
          updatedIds = [...savedVideoIds, { id: videoId, savedAt }];
        }

        set({
          savedVideoIds: updatedIds,
          folders: folders.map((f) => {
            const shouldAdd = f.id === ALL_FOLDER_ID || f.id === folderId;
            if (shouldAdd && !f.videoIds.includes(videoId)) {
              return { ...f, videoIds: [...f.videoIds, videoId] };
            }
            return f;
          }),
        });
      },

      addFolder: (name) => {
        const { folders } = get();
        const entry: FolderEntry = {
          id: `folder_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          videoIds: [],
        };
        set({ folders: [...folders, entry] });
        return entry;
      },

      deleteFolder: (folderId) => {
        if (folderId === ALL_FOLDER_ID) return;
        set({ folders: get().folders.filter((f) => f.id !== folderId) });
      },

      reset: () => {
        set({ savedVideoIds: [], folders: FOLDERS });
      },

      restoreFromRecord: (savedVideoIds, folders) => {
        set({ savedVideoIds, folders });
      },
    }),
    { name: 'cutoff-saved' },
  ),
);
