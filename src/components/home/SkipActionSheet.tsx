/* ─────────────────────────────────────────────────────────────────
   SkipActionSheet
   ─────────────────────────────────────────────────────────────────
   "오늘은 안 볼래요" 선택 후 표시되는 스킵 이유 액션 시트.

   초안 HTML 참조:
     .action-sheet-overlay / .action-sheet / .as-title
     .as-item / .as-skip
   ───────────────────────────────────────────────────────────────── */
import BottomSheet from '@/components/ui/BottomSheet';
import { SKIP_REASONS } from '@/data/skipReasons';

interface SkipActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReason: (reason: string) => void;
}

export default function SkipActionSheet({
  isOpen,
  onClose,
  onSelectReason,
}: SkipActionSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      dismissible={true}
    >
      {/* .as-title */}
      <p className="text-[13px] text-fg-muted text-center px-5 py-3 border-b border-line leading-[1.5]">
        오늘 이 영상을 보지 않는<br />이유를 알려주세요.
      </p>

      {/* .as-item 목록 */}
      {SKIP_REASONS.map((reason) => (
        <button
          key={reason}
          type="button"
          onClick={() => onSelectReason(reason)}
          className="w-full text-left px-6 py-[15px] text-[16px] text-fg border-b border-line last:border-b-0 hover:bg-surface-sub active:bg-surface-sub transition-colors"
        >
          {reason}
        </button>
      ))}

      {/* .as-skip */}
      <button
        type="button"
        onClick={onClose}
        className="w-full text-center px-6 py-[14px] text-[14px] text-fg-muted cursor-pointer"
      >
        건너뛰기
      </button>
    </BottomSheet>
  );
}
