import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import VideoDetailHeader from '@/components/video/VideoDetailHeader';
import VideoDetailContent from '@/components/video/VideoDetailContent';
import YoutubePlayer from '@/components/video/YoutubePlayer';
import SkipActionSheet from '@/components/home/SkipActionSheet';
import EmptyState from '@/components/ui/EmptyState';

import { recordWatchHistory } from '@/api/services/history';
import { getVideoById } from '@/api/services/videos';
import { skipVideoRecommendation } from '@/api/services/recommendations';
import { useVideoSave } from '@/hooks/useVideoSave';
import { useOverlayStore } from '@/store/overlayStore';
import { useSavedStore } from '@/store/savedStore';
import type { VideoCard } from '@/types/video';
import type { VideoDetailSource } from '@/components/video/VideoDetailBottomSheet';
import {
  type VideoDetailLocationState,
  type VideoDetailReturnState,
  VIDEO_DETAIL_RETURN_PATH,
  resolveVideoDetailIsSaved,
} from '@/types/videoDetail';

const VALID_SOURCES: VideoDetailSource[] = ['history', 'home', 'catlist', 'saved'];

function parseSource(raw: string | null): VideoDetailSource {
  if (raw && VALID_SOURCES.includes(raw as VideoDetailSource)) {
    return raw as VideoDetailSource;
  }
  return 'home';
}

export default function VideoDetailPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = (location.state as VideoDetailLocationState | null) ?? {};

  const source = parseSource(searchParams.get('source'));
  const showToast = useOverlayStore((s) => s.showToast);
  const savedVideoIds = useSavedStore((s) => s.savedVideoIds);
  const { handleSaveToggle } = useVideoSave();

  const pendingReturnRef = useRef<VideoDetailReturnState>({});

  const [video, setVideo] = useState<VideoCard | null>(locationState.video ?? null);
  const [isSaved, setIsSaved] = useState(() =>
    resolveVideoDetailIsSaved(videoId ?? '', source, locationState.video),
  );
  const [isLoading, setIsLoading] = useState(!locationState.video);
  const [error, setError] = useState<string | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [skipActionOpen, setSkipActionOpen] = useState(false);

  useEffect(() => {
    if (!videoId) {
      setError('영상을 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    if (locationState.video?.id === videoId) {
      const saved = resolveVideoDetailIsSaved(videoId, source, locationState.video);
      setIsSaved(saved);
      setVideo((prev) => {
        const base = prev ?? locationState.video;
        return base ? { ...base, isSaved: saved } : null;
      });
      setIsLoading(false);
      recordWatchHistory(videoId).catch(() => {});
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getVideoById(videoId)
      .then((fetched) => {
        if (cancelled) return;
        if (!fetched) {
          setError('영상을 찾을 수 없습니다.');
          setVideo(null);
          return;
        }
        setVideo(fetched);
        setIsSaved(fetched.isSaved);
        recordWatchHistory(videoId).catch(() => {});
      })
      .catch(() => {
        if (!cancelled) setError('불러오기에 실패했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoId, locationState.video?.id, source, locationState.video]);

  /* savedStore 변경 시 저장 UI 동기화 */
  useEffect(() => {
    if (!videoId) return;
    const saved = resolveVideoDetailIsSaved(videoId, source);
    setIsSaved(saved);
    setVideo((prev) => (prev ? { ...prev, isSaved: saved } : prev));
  }, [savedVideoIds, videoId, source]);

  const applySavedChange = useCallback(
    (nextSaved: boolean) => {
      if (!video) return;

      setIsSaved(nextSaved);
      setVideo((prev) => (prev ? { ...prev, isSaved: nextSaved } : prev));

      if (source === 'home') {
        pendingReturnRef.current.homeSaved = { videoId: video.id, isSaved: nextSaved };
      }

      if (source === 'history' && locationState.historyId) {
        pendingReturnRef.current.historySaved = {
          historyId: locationState.historyId,
          isSaved: nextSaved,
        };
      }

      if (source === 'saved' && !nextSaved && locationState.savedId) {
        navigate('/saved', { state: { savedUnsaved: locationState.savedId } });
      }
    },
    [video, source, locationState.historyId, locationState.savedId, navigate],
  );

  const handleShare = useCallback(async () => {
    if (!video) return;

    const shareUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${video.id}`;
    const shareData = { title: video.title, text: video.title, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* 사용자가 취소한 경우 */
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('링크를 복사했습니다.');
    } catch {
      showToast('공유하기에 실패했습니다.');
    }
  }, [video, showToast]);

  const handleSave = useCallback(() => {
    if (!video) return;
    handleSaveToggle(video.id, isSaved, applySavedChange);
  }, [video, isSaved, handleSaveToggle, applySavedChange]);

  const handleWatch = useCallback(() => {
    setPlayerOpen(true);
  }, []);

  const handleBack = useCallback(() => {
    const returnPath = VIDEO_DETAIL_RETURN_PATH[source];
    const pending = pendingReturnRef.current;
    const hasPending = Object.keys(pending).length > 0;

    if (returnPath && hasPending) {
      navigate(returnPath, { state: pending });
    } else {
      navigate(-1);
    }
    pendingReturnRef.current = {};
  }, [source, navigate]);

  const handleSkip = useCallback(() => {
    if (source === 'home') {
      setSkipActionOpen(true);
      return;
    }

    if (source === 'catlist') {
      navigate(-1);
      return;
    }

    if (source === 'history' && locationState.historyId) {
      navigate('/history', { state: { historyDeleted: locationState.historyId } });
    }
  }, [source, locationState.historyId, navigate]);

  const handleSelectSkipReason = useCallback(
    (reason: string) => {
      setSkipActionOpen(false);
      if (!video) return;
      skipVideoRecommendation(video.id, reason).catch(() => {});

      if (locationState.homeSkipContext) {
        navigate('/home', {
          state: {
            homeSkip: { type: locationState.homeSkipContext, videoId: video.id },
          },
        });
      }
    },
    [video, locationState.homeSkipContext, navigate],
  );

  if (!videoId) {
    return (
      <PageContainer scrollable>
        <VideoDetailHeader onShare={() => {}} />
        <EmptyState title="영상을 찾을 수 없습니다." />
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <VideoDetailHeader onBack={handleBack} onShare={handleShare} />

      {isLoading && (
        <div className="flex-1 flex items-center justify-center py-20">
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

      {video && !isLoading && !error && (
        <VideoDetailContent
          video={video}
          source={source}
          isSaved={isSaved}
          onSave={handleSave}
          onWatch={handleWatch}
          onSkip={source !== 'saved' ? handleSkip : undefined}
        />
      )}

      <YoutubePlayer
        isOpen={playerOpen}
        video={video}
        onClose={() => setPlayerOpen(false)}
      />

      {source === 'home' && (
        <SkipActionSheet
          isOpen={skipActionOpen}
          onClose={() => setSkipActionOpen(false)}
          onSelectReason={handleSelectSkipReason}
        />
      )}
    </PageContainer>
  );
}
