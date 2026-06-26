import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import LoginGate from '@/components/common/LoginGate';
import FolderTabs from '@/components/saved/FolderTabs';
import SavedVideoList from '@/components/saved/SavedVideoList';
import CreateFolderBottomSheet from '@/components/saved/CreateFolderBottomSheet';
import EmptyState from '@/components/ui/EmptyState';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import type { SavedVideo } from '@/types/saved';
import type { VideoDetailReturnState } from '@/types/videoDetail';

interface SavedReturnState extends VideoDetailReturnState {}

export default function SavedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const {
    items,
    folders,
    activeFolderId,
    isLoading,
    error,
    toggleSave,
    removeItem,
    setActiveFolder,
    addFolder,
    removeFolder,
  } = useSavedVideos(isLoggedIn);

  const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);

  const showToast = useOverlayStore((s) => s.showToast);

  useEffect(() => {
    const returnState = location.state as SavedReturnState | null;
    if (!returnState?.savedUnsaved) return;

    removeItem(returnState.savedUnsaved);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, removeItem]);

  function handleOpenDetail(item: SavedVideo) {
    navigate(`/video/${item.video.id}?source=saved`, {
      state: {
        video: { ...item.video, isSaved: item.isSaved },
        savedId: item.id,
      },
    });
  }

  function handleToggleSaveFromList(savedId: string) {
    toggleSave(savedId);
  }

  function handleCreateFolder(name: string) {
    addFolder(name);
    showToast(`'${name}' 폴더를 만들었습니다.`);
  }

  function handleDeleteFolder(folderId: string, folderName: string) {
    removeFolder(folderId);
    showToast(`'${folderName}' 폴더를 삭제했습니다.`);
  }

  function handleLoginRequest() {
    showToast('로그인 기능은 준비 중입니다.');
  }

  const isEmpty = !isLoading && !error && items.length === 0;

  return (
    <PageContainer scrollable={false}>
      <AppHeader variant="default" title="저장한 영상" showBack />

      {!isLoggedIn && (
        <LoginGate
          title="저장한 영상"
          description={'로그인하면 마음에 드는 영상을\n저장하고 나중에 다시 볼 수 있어요.'}
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16l-7-4-7 4V4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          }
          onClickLogin={handleLoginRequest}
        />
      )}

      {isLoggedIn && (
        <>
          <FolderTabs
            folders={folders}
            activeFolderId={activeFolderId}
            onSelect={setActiveFolder}
            onClickManage={() => setIsFolderSheetOpen(true)}
          />

          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="spinner w-8 h-8" aria-label="불러오는 중" />
            </div>
          )}

          {error && !isLoading && (
            <EmptyState
              variant="error"
              title="불러오지 못했습니다"
              description={error}
            />
          )}

          {isEmpty && (
            <EmptyState
              title="저장한 영상이 없어요"
              description={
                activeFolderId
                  ? '이 폴더에 저장된 영상이 없습니다.'
                  : '마음에 드는 영상을 저장하면 여기에 모입니다.'
              }
            />
          )}

          {!isLoading && !error && items.length > 0 && (
            <SavedVideoList
              items={items}
              onClickItem={handleOpenDetail}
              onToggleSave={handleToggleSaveFromList}
            />
          )}
        </>
      )}

      <CreateFolderBottomSheet
        isOpen={isFolderSheetOpen}
        folders={folders}
        onClose={() => setIsFolderSheetOpen(false)}
        onCreate={handleCreateFolder}
        onDelete={(folderId) => {
          const folder = folders.find((f) => f.id === folderId);
          if (folder) handleDeleteFolder(folderId, folder.name);
        }}
      />
    </PageContainer>
  );
}
