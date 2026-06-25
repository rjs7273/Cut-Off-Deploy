/* ─────────────────────────────────────────────────────────────────
   SaveFolderBottomSheet  (CMP-SAVED-006)
   ─────────────────────────────────────────────────────────────────
   저장 하트 클릭 시 표시되는 폴더 선택 바텀시트.
   목록: '전체'(folder_all) + 사용자 생성 폴더
   폴더 생성: 시트 내 인라인 폼으로 새 폴더 추가 후 목록 갱신

   저장 규칙:
     - 어떤 폴더를 선택해도 savedVideoIds + '전체' 폴더에는 항상 저장
     - 사용자 폴더 선택 시 해당 folders.videoIds 에도 추가
   ───────────────────────────────────────────────────────────────── */
import { useState, useMemo } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import { useSavedStore } from '@/store/savedStore';
import { useOverlayStore } from '@/store/overlayStore';

const FOLDER_NAME_MAX = 20;

export default function SaveFolderBottomSheet() {
  const saveFolderSheet      = useOverlayStore((s) => s.saveFolderSheet);
  const closeSaveFolderSheet = useOverlayStore((s) => s.closeSaveFolderSheet);
  const showToast            = useOverlayStore((s) => s.showToast);
  const savedVideoIds        = useSavedStore((s) => s.savedVideoIds);
  const storeFolders         = useSavedStore((s) => s.folders);
  const saveToFolderAction   = useSavedStore((s) => s.saveToFolder);
  const addFolderAction      = useSavedStore((s) => s.addFolder);

  const isOpen = saveFolderSheet !== null;

  const [isCreating, setIsCreating]       = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folders = useMemo(() => {
    if (!isOpen) return [];
    const savedIds = new Set(savedVideoIds.map((s) => s.id));
    return storeFolders.map((f) => ({
      id:    f.id,
      name:  f.name,
      count: f.videoIds.filter((vid) => savedIds.has(vid)).length,
    }));
  }, [isOpen, savedVideoIds, storeFolders]);

  function handleSelect(folderId: string) {
    if (!saveFolderSheet) return;
    saveToFolderAction(saveFolderSheet.videoId, folderId);
    saveFolderSheet.onComplete?.(folderId);
    handleClose();
  }

  function handleClose() {
    setIsCreating(false);
    setNewFolderName('');
    closeSaveFolderSheet();
  }

  function handleCreateFolder() {
    const trimmed = newFolderName.trim();
    if (!trimmed || !saveFolderSheet) return;

    const entry = addFolderAction(trimmed);
    saveToFolderAction(saveFolderSheet.videoId, entry.id);
    saveFolderSheet.onComplete?.(entry.id);
    setIsCreating(false);
    setNewFolderName('');
    showToast(`'${entry.name}' 폴더에 저장했습니다.`);
    handleClose();
  }

  function handleCancelCreate() {
    setIsCreating(false);
    setNewFolderName('');
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="저장 위치 선택"
      stack="elevated"
    >
      <div className="px-5 pt-2 pb-6">
        <p className="text-[13px] text-fg-muted leading-[1.5] mb-4">
          영상을 저장할 폴더를 선택하세요.
        </p>

        <div className="flex flex-col">
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              className="flex items-center gap-3 py-3 border-b border-line text-left hover:bg-surface-sub transition-colors rounded-none w-full bg-transparent border-x-0 border-t-0"
              onClick={() => handleSelect(folder.id)}
            >
              <div className="w-9 h-9 bg-surface-sub rounded-[10px] flex items-center justify-center text-fg-muted flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
              <span className="flex-1 text-[15px] font-medium text-fg">{folder.name}</span>
              <span className="text-[12px] text-fg-subtle">{folder.count}개</span>
            </button>
          ))}
        </div>

        {/* ── 새 폴더 만들기 ── */}
        <div className="mt-4 pt-4 border-t border-line">
          {!isCreating ? (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 h-[44px] rounded-[12px] border border-dashed border-line text-[14px] font-semibold text-fg-muted hover:border-navy hover:text-navy transition-colors bg-transparent"
              onClick={() => setIsCreating(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              새 폴더 만들기
            </button>
          ) : (
            <div>
              <label className="block text-[12px] font-semibold text-fg-muted mb-2">
                폴더 이름
              </label>
              <input
                type="text"
                className="w-full h-[48px] border border-line rounded-[12px] px-[14px] text-[15px] text-fg bg-surface outline-none focus:border-navy transition-colors"
                placeholder="예: 나중에 볼게, 비즈니스"
                maxLength={FOLDER_NAME_MAX}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
              <div className="text-right text-[11px] text-fg-subtle mt-1 mb-3">
                {newFolderName.length} / {FOLDER_NAME_MAX}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 h-[44px] rounded-[12px] border border-line text-[14px] font-semibold text-fg-muted bg-transparent"
                  onClick={handleCancelCreate}
                >
                  취소
                </button>
                <button
                  type="button"
                  className={[
                    'flex-1 h-[44px] rounded-[12px] text-[14px] font-bold text-white',
                    newFolderName.trim().length > 0 ? 'bg-navy' : 'bg-navy opacity-45 cursor-default',
                  ].join(' ')}
                  onClick={handleCreateFolder}
                  disabled={newFolderName.trim().length === 0}
                >
                  만들기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
