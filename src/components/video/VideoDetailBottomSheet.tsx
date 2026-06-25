import { useEffect } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import { recordWatchHistory } from '@/api/services/history';
import { getCategoryLabel } from '@/data/categoryList';
import { toDurationLabel, thumbnailBackground } from '@/data/utils';
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

const SECONDARY_LABEL: Record<VideoDetailSource, string | null> = {
  history: '시청 기록 제거',
  home:    '오늘은 안 볼래요',
  catlist: '오늘은 안 볼래요',
  saved:   null,
};

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
  const secondaryLabel = SECONDARY_LABEL[source];

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
        <div className="px-5 pt-4 pb-6 flex flex-col">
          <p className="text-[17px] font-bold text-fg leading-[1.4] mb-[6px]">
            {video.title}
          </p>

          <div className="flex gap-2 items-center mb-[14px] flex-wrap">
            <span className="text-[13px] text-fg-muted">{video.channel}</span>
            <span className="text-[12px] text-fg-subtle">{toDurationLabel(video.duration)}</span>
            <span className="text-[11px] text-navy bg-[#EEF1FF] px-2 py-[2px] rounded-full">
              {getCategoryLabel(video.category)}
            </span>
          </div>

          <div className="mb-[14px]">
            <p className="text-[11px] font-bold text-navy tracking-[0.5px] uppercase mb-[6px]">
              Editor's Comment
            </p>
            <p className="text-[14px] text-fg leading-[1.6]">
              {video.editorComment}
            </p>
          </div>

          <button
            type="button"
            onClick={onWatch}
            className="w-full aspect-video rounded-app-md mb-4 flex items-center justify-center relative overflow-hidden"
            style={{ background: thumbnailBackground(video) }}
            aria-label="영상 보기"
          >
            <div className="w-12 h-12 bg-white/85 rounded-full flex items-center justify-center text-[18px]">
              ▶
            </div>
            <span className="absolute bottom-2 right-2.5 bg-black/70 text-white text-[11px] font-medium px-[7px] py-[2px] rounded-[4px]">
              {video.duration}
            </span>
          </button>

          <div className="mb-[14px]">
            <p className="text-[11px] font-bold text-navy tracking-[0.5px] uppercase mb-[6px]">
              영상 요약
            </p>
            <p className="text-[14px] text-fg leading-[1.6]">
              {video.summary}
            </p>
          </div>

          <div className="pt-2 border-t border-line flex flex-col gap-2">
            <div className="relative flex justify-center items-center min-h-[44px] mb-[2px]">
              {secondaryLabel && onSkip && (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-[14px] text-fg-muted h-[44px] mt-[6px]"
                >
                  {secondaryLabel}
                </button>
              )}

              <button
                type="button"
                onClick={onSave}
                aria-label={isSaved ? '저장 해제' : '저장'}
                className={[
                  'absolute right-0 top-1/2 -translate-y-1/2',
                  'w-9 h-9 rounded-full border flex items-center justify-center transition-all',
                  isSaved
                    ? 'bg-navy border-navy text-white'
                    : 'bg-transparent border-line text-fg-muted hover:border-navy hover:text-navy',
                ].join(' ')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9 2.5C21 14.5 12 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    fill={isSaved ? 'currentColor' : 'none'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
