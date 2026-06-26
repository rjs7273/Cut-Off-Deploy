import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import HomeSkeleton from '@/components/home/HomeSkeleton';
import TodayPickCard from '@/components/home/TodayPickCard';
import SkippedCard from '@/components/home/SkippedCard';
import OtherSection from '@/components/home/OtherSection';
import RestoreModal from '@/components/home/RestoreModal';

import { restoreVideoRecommendation } from '@/api/services/recommendations';
import { useHome } from '@/hooks/useHome';
import type { VideoCard } from '@/types/video';
import { resolveUserTier } from '@/types/userTier';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';

import type { VideoDetailReturnState } from '@/types/videoDetail';

interface HomeReturnState extends VideoDetailReturnState {}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn   = useAuthStore((s) => s.isLoggedIn);
  const isSubscribed = useAuthStore((s) => s.isSubscribed);
  const userTier = resolveUserTier(isLoggedIn, isSubscribed);

  const {
    todaysPick,
    otherVideos,
    pickStatus,
    savedIds,
    skippedOtherIds,
    isLoading,
    error,
    skipPick,
    restorePick,
    toggleSave,
    setSaved,
    skipOther,
    restoreOther,
  } = useHome();

  const [restoreModalOpen, setRestoreModalOpen] = useState(false);

  const openVideoDetail = useCallback((video: VideoCard, homeSkipContext?: 'pick' | 'other') => {
    navigate(`/video/${video.id}?source=home`, { state: { video, homeSkipContext } });
  }, [navigate]);

  useEffect(() => {
    const returnState = location.state as HomeReturnState | null;
    if (!returnState?.homeSkip && !returnState?.homeSaved) return;

    if (returnState.homeSkip) {
      if (returnState.homeSkip.type === 'pick') skipPick();
      else skipOther(returnState.homeSkip.videoId);
    }

    if (returnState.homeSaved) {
      setSaved(returnState.homeSaved.videoId, returnState.homeSaved.isSaved);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, skipPick, skipOther, setSaved]);

  const handleClickPick = useCallback(() => {
    if (todaysPick) openVideoDetail(todaysPick, 'pick');
  }, [todaysPick, openVideoDetail]);

  const handleClickRestore = useCallback(() => {
    setRestoreModalOpen(true);
  }, []);

  const handleConfirmRestore = useCallback(() => {
    restorePick();
    setRestoreModalOpen(false);
    if (todaysPick) {
      restoreVideoRecommendation(todaysPick.id).catch(() => {});
    }
  }, [restorePick, todaysPick]);

  const openLoginUpsellSheet = useOverlayStore((s) => s.openLoginUpsellSheet);
  const openSubscribeSheet   = useOverlayStore((s) => s.openSubscribeSheet);

  const handleSubscribe = useCallback(() => {
    if (userTier === 'guest') openLoginUpsellSheet('home');
    else                      openSubscribeSheet('home');
  }, [userTier, openLoginUpsellSheet, openSubscribeSheet]);

  return (
    <PageContainer scrollable>
      <AppHeader variant="home" showMyPage />

      {isLoading && <HomeSkeleton />}

      {!isLoading && error && (
        <div className="flex flex-col items-center px-5 py-14 text-center">
          <p className="text-[15px] font-bold text-fg mb-2">불러오기 실패</p>
          <p className="text-[13px] text-fg-muted leading-[1.6]">{error}</p>
        </div>
      )}

      {!isLoading && !error && todaysPick && (
        <div>
          {pickStatus === 'normal' ? (
            <TodayPickCard
              video={todaysPick}
              isSaved={savedIds.has(todaysPick.id)}
              onClickCard={handleClickPick}
              onToggleSave={() => toggleSave(todaysPick.id)}
            />
          ) : (
            <SkippedCard onClickRestore={handleClickRestore} />
          )}

          <OtherSection
            videos={otherVideos}
            savedIds={savedIds}
            skippedOtherIds={skippedOtherIds}
            userTier={userTier}
            onClickCard={(video) => openVideoDetail(video, 'other')}
            onToggleSave={toggleSave}
            onSkipOther={skipOther}
            onRestoreOther={restoreOther}
            onClickSubscribe={handleSubscribe}
          />

          <div className="h-8" />
        </div>
      )}

      <RestoreModal
        isOpen={restoreModalOpen}
        video={todaysPick}
        onCancel={() => setRestoreModalOpen(false)}
        onConfirm={handleConfirmRestore}
      />
    </PageContainer>
  );
}
