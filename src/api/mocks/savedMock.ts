import type { SavedVideo, Folder } from '@/types/saved';
import type { FolderEntry } from '@/data/userstate/folders';
import { ALL_FOLDER_ID } from '@/data/userstate/folders';
import { mapCatalogVideoToCard } from '@/api/mocks/mockCatalog';
import { useSavedStore } from '@/store/savedStore';

function buildFolderIdsForVideo(videoId: string, folders: FolderEntry[]): string[] {
  return folders
    .filter((f) => f.id !== ALL_FOLDER_ID && f.videoIds.includes(videoId))
    .map((f) => f.id);
}

const MOCK_DELAY_MS = 400;

export async function mockFetchSaved(): Promise<{ items: SavedVideo[]; folders: Folder[] }> {
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

  const currentFolders = useSavedStore.getState().folders;
  const currentSavedIds = useSavedStore.getState().savedVideoIds;
  const savedIdSet = new Set(currentSavedIds.map((s) => s.id));

  const items: SavedVideo[] = currentSavedIds
    .map((entry) => {
      const video = mapCatalogVideoToCard(entry.id, true);
      if (!video) return null;
      const folderIds = buildFolderIdsForVideo(entry.id, currentFolders);
      return {
        id: `saved_${entry.id}`,
        video,
        savedAt: entry.savedAt,
        folderIds,
        isSaved: true,
      };
    })
    .filter((item): item is SavedVideo => item !== null);

  const folders: Folder[] = currentFolders
    .filter((f) => f.id !== ALL_FOLDER_ID)
    .map((f) => ({
      id: f.id,
      name: f.name,
      count: f.videoIds.filter((vid) => savedIdSet.has(vid)).length,
    }));

  return { items, folders };
}

export async function mockSaveVideo(videoId: string): Promise<void> {
  useSavedStore.getState().toggleSave(videoId);
  if (!useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId)) {
    useSavedStore.getState().toggleSave(videoId);
  }
}

export async function mockUnsaveVideo(videoId: string): Promise<void> {
  if (useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId)) {
    useSavedStore.getState().toggleSave(videoId);
  }
}

export async function mockCreateFolder(name: string): Promise<Folder> {
  const entry = useSavedStore.getState().addFolder(name);
  return { id: entry.id, name: entry.name, count: 0 };
}

export function mockDeleteFolder(folderId: string): void {
  useSavedStore.getState().deleteFolder(folderId);
}

export function mockIsVideoSaved(videoId: string): boolean {
  return useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
}

export function mockToggleSave(videoId: string): boolean {
  useSavedStore.getState().toggleSave(videoId);
  return useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
}
