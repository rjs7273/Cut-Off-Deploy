/* ─────────────────────────────────────────────────────────────────
   CMP-SAVED-005 · CreateFolderBottomSheet
   폴더 관리 바텀시트.
   - 폴더 이름 입력 (최대 20자)으로 새 폴더 생성
   - 현재 폴더 목록 표시 + 삭제
   - "만들기" 버튼 (입력 없으면 비활성)
   ───────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import type { Folder } from '@/types/saved';

interface Props {
  isOpen: boolean;
  folders: Folder[];
  onClose: () => void;
  onCreate: (name: string) => void;
  onDelete: (folderId: string) => void;
}

export default function CreateFolderBottomSheet({
  isOpen,
  folders,
  onClose,
  onCreate,
  onDelete,
}: Props) {
  const [name, setName] = useState('');
  const MAX = 20;

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
    onClose();
  }

  function handleClose() {
    setName('');
    onClose();
  }

  function handleDelete(folderId: string, folderName: string) {
    if (window.confirm(`'${folderName}' 폴더를 삭제할까요?\n폴더 안 영상은 저장 목록에 남습니다.`)) {
      onDelete(folderId);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} showClose>
      <div className="px-[20px] pt-[8px] pb-[24px]">
        <p className="text-[17px] font-bold text-fg tracking-[-0.3px] mb-[20px]">
          폴더 관리
        </p>

        <label className="block text-[12px] font-semibold text-fg-muted mb-[8px]">
          폴더 이름
        </label>
        <input
          type="text"
          className="w-full h-[48px] border border-line rounded-[12px] px-[14px] text-[15px] text-fg bg-surface outline-none focus:border-navy transition-colors"
          placeholder="예: 나중에 볼게, 비즈니스, 주말용"
          maxLength={MAX}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="text-right text-[11px] text-fg-subtle mt-[4px] mb-[24px]">
          <span>{name.length}</span> / {MAX}
        </div>

        {folders.length > 0 && (
          <>
            <p className="text-[12px] font-semibold text-fg-muted mb-[10px]">현재 폴더</p>
            <div className="pb-[8px]">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center gap-[12px] py-[12px] border-b border-line"
                >
                  <div className="w-[36px] h-[36px] bg-surface-sub rounded-[10px] flex items-center justify-center text-fg-muted flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-[14px] text-fg">{folder.name}</span>
                  <span className="text-[12px] text-fg-subtle">{folder.count}개</span>
                  <button
                    type="button"
                    className="w-[28px] h-[28px] flex items-center justify-center rounded-full border border-line bg-transparent text-fg-muted hover:border-[#CC3333] hover:text-[#CC3333] transition-colors flex-shrink-0"
                    onClick={() => handleDelete(folder.id, folder.name)}
                    aria-label={`${folder.name} 폴더 삭제`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M6 6l12 12M18 6 6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="pt-[16px]">
          <button
            className={[
              'w-full h-[52px] rounded-[14px] text-[16px] font-bold text-white transition-opacity',
              name.trim().length > 0 ? 'bg-navy cursor-pointer opacity-100' : 'bg-navy opacity-45 cursor-default',
            ].join(' ')}
            onClick={handleCreate}
            disabled={name.trim().length === 0}
          >
            만들기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
