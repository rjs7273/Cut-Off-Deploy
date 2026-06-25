import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import LoginGate from '@/components/common/LoginGate';
import FolderTabs from '@/components/saved/FolderTabs';
import SavedVideoList from '@/components/saved/SavedVideoList';
import CreateFolderBottomSheet from '@/components/saved/CreateFolderBottomSheet';
import VideoDetailBottomSheet from '@/components/video/VideoDetailBottomSheet';
import YoutubePlayer from '@/components/video/YoutubePlayer';
import EmptyState from '@/components/ui/EmptyState';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import { useSavedStore } from '@/store/savedStore';
import { useState } from 'react';
import type { SavedVideo } from '@/types/saved';

/* ─────────────────────────────────────────────────────────────────
   SavedPage  (CMP-SAVED-001)
   ─────────────────────────────────────────────────────────────────
   저장한 영상 화면.

   상태:
     isLoggedIn          목업 값 (true = 로그인, false = 비회원 게이트)
     selectedItem        상세 바텀시트에 표시할 저장 항목
     isDetailOpen        영상 상세 바텀시트 열림 여부
     isFolderSheetOpen   폴더 생성 바텀시트 열림 여부

   TODO: useAuth 연동 후 isLoggedIn을 실제 인증 상태로 교체
   ───────────────────────────────────────────────────────────────── */
export default function SavedPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const {
    items,
    folders,
    activeFolderId,
    isLoading,
    error,
    toggleSave,
    setActiveFolder,
    addFolder,
  } = useSavedVideos(isLoggedIn);

  const [selectedItem, setSelectedItem] = useState<SavedVideo | null>(null);
  const [playerVideo, setPlayerVideo] = useState<SavedVideo['video'] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFolderSheetOpen, setIsFolderSheetOpen] = useState(false);

  const showToast = useOverlayStore((s) => s.showToast);

  /* ── 아이템 클릭 → 상세 바텀시트 열기 ── */
  function handleOpenDetail(item: SavedVideo) {
    setSelectedItem(item);
    setIsDetailOpen(true);
  }

  /* ── 리스트에서 저장 토글 ── */
  function handleToggleSaveFromList(savedId: string) {
    toggleSave(savedId);
  }

  /* ── 상세 바텀시트 내 저장 토글 ── */
  function handleToggleSaveFromSheet() {
    if (!selectedItem) return;
    const videoId = selectedItem.video.id;
    toggleSave(selectedItem.id, () => {
      const isSaved = useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
      setSelectedItem((prev) => prev ? { ...prev, isSaved } : prev);
    });
  }

  function handleWatch() {
    if (selectedItem) setPlayerVideo(selectedItem.video);
  }

  /* ── 폴더 생성 ── */
  function handleCreateFolder(name: string) {
    addFolder(name);
    showToast(`'${name}' 폴더를 만들었습니다.`);
  }

  /* ── 비회원 로그인 유도 (목업) ── */
  function handleLoginRequest() {
    showToast('로그인 기능은 준비 중입니다.');
    // TODO: LoginUpsellBottomSheet 또는 로그인 화면 이동
  }

  const isEmpty = !isLoading && !error && items.length === 0;

  return (
    <PageContainer scrollable={false}>
      {/* ── 앱바 ── */}
      <AppHeader variant="default" title="저장한 영상" showBack />

      {/* ── 비회원 게이트 ── */}
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

      {/* ── 로그인 사용자 콘텐츠 ── */}
      {isLoggedIn && (
        <>
          {/* 폴더 탭 (로딩 중에도 표시 유지) */}
          <FolderTabs
            folders={folders}
            activeFolderId={activeFolderId}
            onSelect={setActiveFolder}
            onClickAdd={() => setIsFolderSheetOpen(true)}
          />

          {/* 로딩 */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="spinner w-8 h-8" aria-label="불러오는 중" />
            </div>
          )}

          {/* 오류 */}
          {error && !isLoading && (
            <EmptyState
              variant="error"
              title="불러오지 못했습니다"
              description={error}
            />
          )}

          {/* 빈 상태 */}
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

          {/* 저장 목록 */}
          {!isLoading && !error && items.length > 0 && (
            <SavedVideoList
              items={items}
              onClickItem={handleOpenDetail}
              onToggleSave={handleToggleSaveFromList}
            />
          )}
        </>
      )}

      {/* ── 영상 상세 바텀시트 ── */}
      <VideoDetailBottomSheet
        isOpen={isDetailOpen}
        video={selectedItem?.video ?? null}
        source="saved"
        isSaved={selectedItem?.isSaved ?? true}
        onClose={() => setIsDetailOpen(false)}
        onSave={handleToggleSaveFromSheet}
        onWatch={handleWatch}
      />

      <YoutubePlayer
        isOpen={playerVideo !== null}
        video={playerVideo}
        onClose={() => setPlayerVideo(null)}
      />

      {/* ── 폴더 생성 바텀시트 ── */}
      <CreateFolderBottomSheet
        isOpen={isFolderSheetOpen}
        folders={folders}
        onClose={() => setIsFolderSheetOpen(false)}
        onCreate={handleCreateFolder}
      />
    </PageContainer>
  );
}
