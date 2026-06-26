import { useEffect } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import VideoDetailContent from '@/components/video/VideoDetailContent';
import { recordWatchHistory } from '@/api/services/history';
import type { VideoCard } from '@/types/video';

export type VideoDetailSource = 'history' | 'home' | 'catlist' | 'saved';

interface VideoDetailBottomSheetProps {
  isOpen: boolean;
  video: VideoCard | null;
  source: VideoDetailSource;
  isSaved: boolean;
  onClose: () => void;
  onSave: () => void;
  onWatch: () => void;
  onSkip?: () => void;
}

export default function VideoDetailBottomSheet({
  isOpen,
  video,
  source,
  isSaved,
  onClose,
  onSave,
  onWatch,
  onSkip,
}: VideoDetailBottomSheetProps) {
  useEffect(() => {
    if (!isOpen || !video) return;
    recordWatchHistory(video.id).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, video?.id]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      variant="full"
      showClose
      dismissible={false}
    >
      {video && (
        <VideoDetailContent
          video={video}
          source={source}
          isSaved={isSaved}
          onSave={onSave}
          onWatch={onWatch}
          onSkip={onSkip}
        />
      )}
    </BottomSheet>
  );
}
