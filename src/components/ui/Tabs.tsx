/* ─────────────────────────────────────────────────────────────────
   Tabs  (CMP-UI-004)
   ─────────────────────────────────────────────────────────────────
   저장한 영상의 폴더 탭 기반으로 설계된 언더라인 탭 컴포넌트.
   - 탭 목록 아래 전체 border 라인 + active 탭 언더라인
   - 수평 스크롤 가능 (flex-shrink-0)
   - 우측 끝 슬롯 (예: 폴더 추가 버튼) 지원
   ───────────────────────────────────────────────────────────────── */

export interface TabItem {
  id: string;
  label: string;
  /** 탭 라벨 우측 뱃지 수 (ex: 0이면 미표시) */
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** 탭 바 우측에 렌더링할 슬롯 (ex: 폴더 추가 버튼) */
  trailingSlot?: React.ReactNode;
  className?: string;
}

export default function Tabs({
  tabs,
  selectedId,
  onSelect,
  trailingSlot,
  className = '',
}: TabsProps) {
  return (
    <div
      className={[
        'flex items-center',
        'border-b border-line',
        'overflow-x-auto',
        'flex-shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
    >
      {/* 탭 목록 */}
      <div className="flex items-center px-5 gap-0">
        {tabs.map((tab) => {
          const isActive = tab.id === selectedId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={[
                'flex items-center gap-1',
                'flex-shrink-0 px-[14px] py-[10px]',
                'text-[13px] font-normal',
                'border-b-2 transition-colors duration-150',
                '-mb-px',          /* border-b 1px 상쇄 */
                isActive
                  ? 'text-navy font-semibold border-b-navy'
                  : 'text-fg-muted border-b-transparent hover:text-fg',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(tab.id)}
            >
              {tab.label}
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[11px] ${isActive ? 'text-navy' : 'text-fg-subtle'}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 우측 슬롯 (예: 폴더 추가 버튼) */}
      {trailingSlot && (
        <div className="ml-auto pr-5 flex items-center">{trailingSlot}</div>
      )}
    </div>
  );
}
