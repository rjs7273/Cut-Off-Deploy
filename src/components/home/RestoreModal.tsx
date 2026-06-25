import type { VideoCard } from '@/types/video';
import { toDurationLabel, thumbnailBackground } from '@/data/utils';

interface RestoreModalProps {
  isOpen: boolean;
  video: VideoCard | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RestoreModal({
  isOpen,
  video,
  onCancel,
  onConfirm,
}: RestoreModalProps) {
  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-[calc(100%-48px)] bg-surface rounded-app-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
        <div
          className="w-full aspect-video flex items-center justify-center relative"
          style={{ background: thumbnailBackground(video) }}
        >
          <div className="w-10 h-10 bg-white/85 rounded-full flex items-center justify-center text-[16px]">
            ▶
          </div>
          <span className="absolute bottom-2 right-[10px] bg-black/70 text-white text-[11px] font-medium px-[7px] py-[2px] rounded-[4px]">
            {video.duration}
          </span>
        </div>

        <div className="px-[18px] pt-4 pb-5">
          <p className="text-[10px] font-bold text-navy tracking-[0.5px] uppercase mb-[6px]">
            Today's Pick
          </p>
          <h2 className="text-[15px] font-bold text-fg leading-[1.4] mb-1">
            {video.title.replace('\n', ' ')}
          </h2>
          <p className="text-[12px] text-fg-muted mb-[14px]">
            {video.channel} · {toDurationLabel(video.duration)}
          </p>
          <p className="text-[14px] text-fg font-semibold leading-[1.4] mb-[14px]">
            이 영상을 오늘의 추천으로<br />다시 가져올까요?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-11 bg-surface-sub border-none rounded-app-md text-[14px] text-fg-muted cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-11 bg-navy border-none rounded-app-md text-[14px] font-semibold text-white cursor-pointer"
            >
              되돌리기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
