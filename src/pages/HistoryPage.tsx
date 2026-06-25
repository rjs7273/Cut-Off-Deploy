import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import LoginGate from '@/components/common/LoginGate';
import HistoryList from '@/components/history/HistoryList';
import VideoDetailBottomSheet from '@/components/video/VideoDetailBottomSheet';
import YoutubePlayer from '@/components/video/YoutubePlayer';
import EmptyState from '@/components/ui/EmptyState';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import { useSavedStore } from '@/store/savedStore';
import type { WatchHistoryItem } from '@/types/video';

/* ─────────────────────────────────────────────────────────────────
   HistoryPage  (CMP-HISTORY-001)
   ─────────────────────────────────────────────────────────────────
   시청 기록 화면.

   상태:
     isLoggedIn        목업 값 (true = 로그인, false = 비회원 게이트)
     selectedItem      상세 바텀시트에 표시할 기록 항목
     isSheetOpen       바텀시트 열림 여부

   TODO: useAuth 연동 후 isLoggedIn을 실제 인증 상태로 교체
   ───────────────────────────────────────────────────────────────── */
export default function HistoryPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { groups, isLoading, error, deleteItem, setSaved } = useWatchHistory(isLoggedIn);
  const savedVideoIds = useSavedStore((s) => s.savedVideoIds);
  const toggleSaveAction = useSavedStore((s) => s.toggleSave);

  const [selectedItem, setSelectedItem] = useState<WatchHistoryItem | null>(null);
  const [playerVideo, setPlayerVideo] = useState<WatchHistoryItem['video'] | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const showToast = useOverlayStore((s) => s.showToast);

  /* ── 아이템 클릭 → 바텀시트 열기 ── */
  function handleOpenDetail(item: WatchHistoryItem) {
    const freshSavedIds = new Set(savedVideoIds.map((s) => s.id));
    setSelectedItem({ ...item, isSaved: freshSavedIds.has(item.video.id) });
    setIsSheetOpen(true);
  }

  /* ── 삭제 버튼 (리스트) ── */
  function handleDeleteFromList(historyId: string) {
    deleteItem(historyId);
    showToast('시청 기록에서 삭제했습니다.');
  }

  /* ── 시청 기록 제거 (바텀시트 내) ── */
  function handleDeleteFromSheet() {
    if (!selectedItem) return;
    deleteItem(selectedItem.id);
    setIsSheetOpen(false);
    showToast('시청 기록에서 삭제됐습니다.');
  }

  /* ── 저장 토글 (바텀시트 내) ── */
  function handleSave() {
    if (!selectedItem) return;
    const videoId = selectedItem.video.id;
    toggleSaveAction(videoId);
    const nextSaved = useSavedStore.getState().savedVideoIds.some((e) => e.id === videoId);
    setSelectedItem((prev) => (prev ? { ...prev, isSaved: nextSaved } : prev));
    setSaved(selectedItem.id, nextSaved);
  }

  function handleWatch() {
    if (selectedItem) setPlayerVideo(selectedItem.video);
  }

  /* ── 비회원 로그인 유도 (목업: 토스트) ── */
  function handleLoginRequest() {
    showToast('로그인 기능은 준비 중입니다.');
    // TODO: LoginUpsellBottomSheet 또는 로그인 화면 이동
  }

  const isEmpty = !isLoading && !error && groups.length === 0;

  return (
    <PageContainer scrollable={false}>
      {/* ── 앱바 ── */}
      <AppHeader variant="default" title="시청 기록" showBack />

      {/* ── 비회원 게이트 ── */}
      {!isLoggedIn && (
        <LoginGate
          title="시청 기록"
          description={'로그인하면 내가 본 영상 기록을\n기기 간 동기화해서 확인할 수 있어요.'}
          icon={
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
          onClickLogin={handleLoginRequest}
        />
      )}

      {/* ── 로그인 사용자 콘텐츠 ── */}
      {isLoggedIn && (
        <>
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
              title="시청한 영상이 없어요!"
              description="오늘의 추천 영상을 시청하면 여기에 기록돼요."
            />
          )}

          {/* 시청 기록 목록 */}
          {!isLoading && !error && groups.length > 0 && (
            <HistoryList
              groups={groups}
              onClickItem={handleOpenDetail}
              onDeleteItem={handleDeleteFromList}
            />
          )}
        </>
      )}

      {/* ── 영상 상세 바텀시트 ── */}
      <VideoDetailBottomSheet
        isOpen={isSheetOpen}
        video={selectedItem?.video ?? null}
        source="history"
        isSaved={selectedItem?.isSaved ?? false}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSave}
        onWatch={handleWatch}
        onSkip={handleDeleteFromSheet}
      />

      <YoutubePlayer
        isOpen={playerVideo !== null}
        video={playerVideo}
        onClose={() => setPlayerVideo(null)}
      />
    </PageContainer>
  );
}
