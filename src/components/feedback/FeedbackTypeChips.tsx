/* ─────────────────────────────────────────────────────────────────
   CMP-FB-002 · FeedbackTypeChips
   의견 유형 선택 칩 그룹.
   기본값: '개선 제안'
   ───────────────────────────────────────────────────────────────── */
import Chip from '@/components/ui/Chip';
import { FEEDBACK_TYPES, type FeedbackType } from '@/types/feedback';

interface Props {
  selected: FeedbackType;
  onSelect: (type: FeedbackType) => void;
}

export default function FeedbackTypeChips({ selected, onSelect }: Props) {
  return (
    <div className="mb-[14px]">
      <p className="text-[12px] font-semibold text-fg-muted mb-[6px]">유형</p>
      <div className="flex flex-wrap gap-[8px]">
        {FEEDBACK_TYPES.map((type) => (
          <Chip
            key={type}
            label={type}
            variant="interest"
            selected={selected === type}
            onClick={() => onSelect(type)}
          />
        ))}
      </div>
    </div>
  );
}
