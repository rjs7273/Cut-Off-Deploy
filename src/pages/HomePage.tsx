import { useState, useCallback } from 'react';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import HomeSkeleton from '@/components/home/HomeSkeleton';
import TodayPickCard from '@/components/home/TodayPickCard';
import SkippedCard from '@/components/home/SkippedCard';
import OtherSection from '@/components/home/OtherSection';
import SkipActionSheet from '@/components/home/SkipActionSheet';
import RestoreModal from '@/components/home/RestoreModal';
import VideoDetailBottomSheet from '@/components/video/VideoDetailBottomSheet';
import YoutubePlayer from '@/components/video/YoutubePlayer';

import { skipVideoRecommendation, restoreVideoRecommendation } from '@/api/services/recommendations';
import { useHome } from '@/hooks/useHome';
import type { VideoCard } from '@/types/video';
import { resolveUserTier } from '@/types/userTier';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
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
    skipOther,
    restoreOther,
  } = useHome();

  const [sheetVideo, setSheetVideo]         = useState<VideoCard | null>(null);
  const [playerVideo, setPlayerVideo]       = useState<VideoCard | null>(null);
  const [skipActionOpen, setSkipActionOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);

  const openSheet = useCallback((video: VideoCard) => {
    setSheetVideo(video);
  }, []);
  const closeSheet = useCallback(() => setSheetVideo(null), []);

  const handleClickPick = useCallback(() => {
    if (todaysPick) openSheet(todaysPick);
  }, [todaysPick, openSheet]);

  const handleSkipFromSheet = useCallback(() => {
    closeSheet();
    setSkipActionOpen(true);
  }, [closeSheet]);

  const handleSelectSkipReason = useCallback((reason: string) => {
    setSkipActionOpen(false);
    skipPick();
    if (todaysPick) {
      skipVideoRecommendation(todaysPick.id, reason).catch(() => {});
    }
  }, [skipPick, todaysPick]);

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
            onClickCard={openSheet}
            onToggleSave={toggleSave}
            onSkipOther={skipOther}
            onRestoreOther={restoreOther}
            onClickSubscribe={handleSubscribe}
          />

          <div className="h-8" />
        </div>
      )}

      <VideoDetailBottomSheet
        isOpen={sheetVideo !== null}
        video={sheetVideo}
        source="home"
        isSaved={sheetVideo ? savedIds.has(sheetVideo.id) : false}
        onClose={closeSheet}
        onSave={() => sheetVideo && toggleSave(sheetVideo.id)}
        onWatch={() => {
          if (sheetVideo) setPlayerVideo(sheetVideo);
        }}
        onSkip={handleSkipFromSheet}
      />

      <YoutubePlayer
        isOpen={playerVideo !== null}
        video={playerVideo}
        onClose={() => setPlayerVideo(null)}
      />

      <SkipActionSheet
        isOpen={skipActionOpen}
        onClose={() => setSkipActionOpen(false)}
        onSelectReason={handleSelectSkipReason}
      />

      <RestoreModal
        isOpen={restoreModalOpen}
        video={todaysPick}
        onCancel={() => setRestoreModalOpen(false)}
        onConfirm={handleConfirmRestore}
      />
    </PageContainer>
  );
}
