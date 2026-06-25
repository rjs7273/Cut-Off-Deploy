/* ─────────────────────────────────────────────────────────────────
   InterestChipGrid
   ─────────────────────────────────────────────────────────────────
   관심사 선택 칩 그리드 — CategoryPage / CategoryEditPage에서 공유.

   초안 HTML 참조:
     .cat-section / .cat-section-label / .chip-grid / .chip / .chip.sel
   ───────────────────────────────────────────────────────────────── */
import type { InterestGroup } from '@/types/interest';

interface InterestChipGridProps {
  groups: InterestGroup[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export default function InterestChipGrid({
  groups,
  selectedIds,
  onToggle,
}: InterestChipGridProps) {
  return (
    <div>
      {groups.map((group) => (
        /* .cat-section — mb: 20px */
        <div key={group.groupId} className="mb-5">
          {/* .cat-section-label — 12px/600/text-subtle/uppercase/tracking-0.8px/mb-10px */}
          <p className="text-[12px] font-semibold text-fg-subtle uppercase tracking-[0.8px] mb-[10px]">
            {group.groupLabel}
          </p>

          {/* .chip-grid — flex, flex-wrap, gap: 8px */}
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                /* .chip / .chip.sel */
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggle(item.id)}
                  className={[
                    'px-[14px] py-[7px] rounded-[20px] border text-[13px]',
                    'font-sans cursor-pointer transition-all duration-150',
                    isSelected
                      ? 'bg-navy text-white border-navy'
                      : 'bg-surface text-fg border-line hover:border-navy/50',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
