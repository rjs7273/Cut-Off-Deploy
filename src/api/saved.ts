import { apiClient } from '@/lib/apiClient';
import type { FolderEntry, FolderTab, SavedVideo } from '@/types/saved';

export async function fetchSaved(): Promise<{ items: SavedVideo[]; folders: FolderTab[] }> {
  const { data } = await apiClient.get<{ items: SavedVideo[]; folders: FolderTab[] }>('/saved');
  return data;
}

export async function saveVideo(
  videoId: string,
  folderId?: string,
): Promise<{ savedAt: string; folderId: string }> {
  const { data } = await apiClient.post<{ savedAt: string; folderId: string }>(
    `/saved/${videoId}`,
    folderId ? { folderId } : {},
  );
  return data;
}

export async function unsaveVideo(
  videoId: string,
  folderId?: string,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(`/saved/${videoId}`, {
    params: folderId ? { folderId } : undefined,
  });
  return data;
}

export async function createFolder(name: string): Promise<FolderEntry> {
  const { data } = await apiClient.post<FolderEntry>('/saved/folders', { name });
  return data;
}

export async function deleteFolder(folderId: string): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(`/saved/folders/${folderId}`);
  return data;
}
