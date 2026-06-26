import { useCallback } from 'react';
import { isMockApi } from '@/config/apiMode';
import { saveVideo } from '@/api/saved';
import { toggleSaveVideo } from '@/api/services/saved';
import { useOverlayStore } from '@/store/overlayStore';
import { useSavedStore } from '@/store/savedStore';

/**
 * 영상 저장 토글 — 미저장 시 SaveFolderBottomSheet로 폴더 선택.
 */
export function useVideoSave() {
  const openSaveFolderSheet = useOverlayStore((s) => s.openSaveFolderSheet);
  const showToast = useOverlayStore((s) => s.showToast);

  const handleSaveToggle = useCallback(
    (videoId: string, isCurrentlySaved: boolean, onSavedChange?: (isSaved: boolean) => void) => {
      if (isCurrentlySaved) {
        toggleSaveVideo(videoId)
          .then((nextSaved) => {
            onSavedChange?.(nextSaved);
            if (!nextSaved) showToast('저장을 해제했습니다.');
          })
          .catch(() => showToast('저장 변경에 실패했습니다.'));
        return;
      }

      openSaveFolderSheet({
        videoId,
        onComplete: (folderId) => {
          if (!isMockApi()) {
            saveVideo(videoId, folderId).catch(() => {
              showToast('저장에 실패했습니다.');
            });
          }
          const saved = useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
          onSavedChange?.(saved);
          if (saved) showToast('영상을 저장했습니다.');
        },
      });
    },
    [openSaveFolderSheet, showToast],
  );

  return { handleSaveToggle };
}
