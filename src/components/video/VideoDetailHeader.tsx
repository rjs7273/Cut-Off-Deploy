import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';

interface VideoDetailHeaderProps {
  onBack?: () => void;
  onShare: () => void;
}

export default function VideoDetailHeader({ onBack, onShare }: VideoDetailHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    if (onBack) onBack();
    else navigate(-1);
  }

  return (
    <header
      className={[
        'flex-shrink-0 flex items-center justify-between',
        'h-[56px] px-5',
        'sticky top-0 z-[5]',
        'pt-safe app-bar-safe',
        'bg-surface border-b border-line',
      ].join(' ')}
    >
      <div className="flex items-center min-w-[40px]">
        <button
          type="button"
          className="w-[36px] h-[36px] -ml-1 flex items-center justify-center text-fg"
          aria-label="뒤로가기"
          onClick={handleBack}
        >
          <ArrowLeft size={22} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center min-w-[40px] justify-end">
        <button
          type="button"
          className="w-[36px] h-[36px] -mr-1 flex items-center justify-center text-fg-muted"
          aria-label="공유하기"
          onClick={onShare}
        >
          <Share2 size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
