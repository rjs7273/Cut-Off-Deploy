import { getCategoryLabel } from '@/data/categoryList';

interface CategoryFilterChipsProps {
  filters: string[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export default function CategoryFilterChips({
  filters,
  selectedFilter,
  onSelectFilter,
}: CategoryFilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = filter === selectedFilter;
        const label = filter === '전체' ? filter : getCategoryLabel(filter);
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onSelectFilter(filter)}
            className={[
              'flex-shrink-0 px-[14px] py-[6px] rounded-[20px]',
              'border text-[12px] font-medium transition-colors',
              'font-sans cursor-pointer',
              isActive
                ? 'bg-navy text-white border-navy'
                : 'bg-surface text-fg border-line',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
