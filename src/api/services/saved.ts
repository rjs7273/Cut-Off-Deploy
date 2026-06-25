import { isMockApi } from '@/config/apiMode';
import {
  fetchSaved,
  saveVideo,
  unsaveVideo,
  createFolder,
} from '@/api/saved';
import { useSavedStore } from '@/store/savedStore';
import {
  mockFetchSaved,
  mockToggleSave,
  mockCreateFolder,
} from '@/api/mocks/savedMock';
import type { SavedVideo, Folder } from '@/types/saved';

export async function loadSaved(): Promise<{ items: SavedVideo[]; folders: Folder[] }> {
  if (isMockApi()) {
    return mockFetchSaved();
  }
  return fetchSaved();
}

export async function toggleSaveVideo(videoId: string): Promise<boolean> {
  if (isMockApi()) {
    return mockToggleSave(videoId);
  }

  const wasSaved = useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);

  if (wasSaved) {
    await unsaveVideo(videoId);
    useSavedStore.getState().toggleSave(videoId);
    return false;
  }

  await saveVideo(videoId);
  if (!useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId)) {
    useSavedStore.getState().toggleSave(videoId);
  }
  return true;
}

export async function addSavedFolder(name: string): Promise<Folder> {
  if (isMockApi()) {
    return mockCreateFolder(name);
  }
  const entry = await createFolder(name);
  return { id: entry.id, name: entry.name, count: 0 };
}
