/* ─────────────────────────────────────────────────────────────────
   CMP-SAVED-002 · FolderTabs
   저장 화면 상단의 폴더 탭 바.
   "전체" 탭은 항상 첫 번째로 고정, 우측 끝에 폴더 관리(⋯) 버튼.
   ───────────────────────────────────────────────────────────────── */
import type { Folder } from '@/types/saved';

interface Props {
  folders: Folder[];
  activeFolderId: string | null;   // null = 전체
  onSelect: (id: string | null) => void;
  onClickManage: () => void;
}

export default function FolderTabs({ folders, activeFolderId, onSelect, onClickManage }: Props) {
  return (
    <div
      className="flex items-center gap-0 px-[20px] border-b border-line overflow-x-auto flex-shrink-0 scrollbar-none"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* 전체 탭 */}
      <button
        className={[
          'flex-shrink-0 px-[14px] py-[10px] text-[13px] font-sans bg-transparent border-none',
          'border-b-2 whitespace-nowrap -mb-px cursor-pointer transition-all duration-150',
          activeFolderId === null
            ? 'text-navy border-b-navy font-semibold'
            : 'text-fg-muted border-b-transparent',
        ].join(' ')}
        onClick={() => onSelect(null)}
      >
        전체
      </button>

      {/* 사용자 폴더 탭 */}
      {folders.map((folder) => (
        <button
          key={folder.id}
          className={[
            'flex-shrink-0 px-[14px] py-[10px] text-[13px] font-sans bg-transparent border-none',
            'border-b-2 whitespace-nowrap -mb-px cursor-pointer transition-all duration-150',
            activeFolderId === folder.id
              ? 'text-navy border-b-navy font-semibold'
              : 'text-fg-muted border-b-transparent',
          ].join(' ')}
          onClick={() => onSelect(folder.id)}
        >
          {folder.name}
        </button>
      ))}

      {/* 폴더 관리 버튼 */}
      <button
        className="flex-shrink-0 ml-auto w-[32px] h-[32px] bg-transparent border border-line rounded-full flex items-center justify-center cursor-pointer text-fg-muted transition-all duration-150 hover:border-navy hover:text-navy"
        onClick={onClickManage}
        title="폴더 관리"
        aria-label="폴더 관리"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
