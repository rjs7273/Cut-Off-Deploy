import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import LoginGate from '@/components/common/LoginGate';
import HistoryList from '@/components/history/HistoryList';
import EmptyState from '@/components/ui/EmptyState';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import { useSavedStore } from '@/store/savedStore';
import type { WatchHistoryItem } from '@/types/video';

import type { VideoDetailReturnState } from '@/types/videoDetail';

interface HistoryReturnState extends VideoDetailReturnState {}

export default function HistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { groups, isLoading, error, deleteItem, setSaved } = useWatchHistory(isLoggedIn);
  const savedVideoIds = useSavedStore((s) => s.savedVideoIds);

  const showToast = useOverlayStore((s) => s.showToast);

  useEffect(() => {
    const returnState = location.state as HistoryReturnState | null;
    if (!returnState?.historyDeleted && !returnState?.historySaved) return;

    if (returnState.historyDeleted) {
      deleteItem(returnState.historyDeleted);
      showToast('시청 기록에서 삭제됐습니다.');
    }

    if (returnState.historySaved) {
      setSaved(returnState.historySaved.historyId, returnState.historySaved.isSaved);
    }

    if (returnState.historyDeleted || returnState.historySaved) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate, deleteItem, setSaved, showToast]);

  function handleOpenDetail(item: WatchHistoryItem) {
    const freshSavedIds = new Set(savedVideoIds.map((s) => s.id));
    const video = { ...item.video, isSaved: freshSavedIds.has(item.video.id) };
    navigate(`/video/${item.video.id}?source=history`, {
      state: { video, historyId: item.id },
    });
  }

  function handleDeleteFromList(historyId: string) {
    deleteItem(historyId);
    showToast('시청 기록에서 삭제했습니다.');
  }

  function handleLoginRequest() {
    showToast('로그인 기능은 준비 중입니다.');
  }

  const isEmpty = !isLoading && !error && groups.length === 0;

  return (
    <PageContainer scrollable={false}>
      <AppHeader variant="default" title="시청 기록" showBack />

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

      {isLoggedIn && (
        <>
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
              title="시청한 영상이 없어요!"
              description="오늘의 추천 영상을 시청하면 여기에 기록돼요."
            />
          )}

          {!isLoading && !error && groups.length > 0 && (
            <HistoryList
              groups={groups}
              onClickItem={handleOpenDetail}
              onDeleteItem={handleDeleteFromList}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}
