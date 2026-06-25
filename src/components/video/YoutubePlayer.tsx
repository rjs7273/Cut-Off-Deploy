import { useMemo, useState } from 'react';
import { Browser } from '@capacitor/browser';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import type { VideoCard } from '@/types/video';

interface YoutubePlayerProps {
  isOpen: boolean;
  video: VideoCard | null;
  onClose: () => void;
}

function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/')[2] ?? null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

export default function YoutubePlayer({ isOpen, video, onClose }: YoutubePlayerProps) {
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const youtubeId = useMemo(
    () => (video ? extractYoutubeId(video.youtubeUrl) : null),
    [video],
  );
  const hasIframeError = video ? failedVideoId === video.id : false;
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?playsinline=1&autoplay=1&rel=0`
    : null;

  async function openExternal() {
    if (!video) return;
    await Browser.open({ url: video.youtubeUrl, presentationStyle: 'fullscreen' });
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} variant="full" showClose>
      <div className="px-5 pt-4 pb-6 flex flex-col gap-4">
        <div>
          <p className="text-[17px] font-bold text-fg leading-[1.4]">{video?.title}</p>
          <p className="text-[13px] text-fg-muted mt-1">{video?.channel}</p>
        </div>

        {embedUrl && !hasIframeError ? (
          <div className="aspect-video rounded-app-md overflow-hidden bg-black">
            <iframe
              title={video?.title ?? 'YouTube player'}
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setFailedVideoId(video?.id ?? null)}
            />
          </div>
        ) : (
          <div className="aspect-video rounded-app-md bg-surface-sub flex flex-col items-center justify-center px-5 text-center">
            <p className="text-[15px] font-bold text-fg mb-2">앱 안에서 재생할 수 없어요</p>
            <p className="text-[13px] text-fg-muted leading-[1.6]">
              영상 소유자가 임베드 재생을 제한했을 수 있습니다.
            </p>
          </div>
        )}

        <Button variant="secondary" size="lg" fullWidth onClick={openExternal}>
          YouTube에서 열기
        </Button>
      </div>
    </BottomSheet>
  );
}
