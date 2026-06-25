/* ─────────────────────────────────────────────────────────────────
   CategoryEditPage  (관심사 변경)
   ─────────────────────────────────────────────────────────────────
   URL: /category-edit  (AppLayout 내부 — 드로어 + 전역 오버레이 포함)
   마이페이지 → "관심사 설정" 클릭 시 진입.
   기존 선택 관심사를 불러와 변경 후 저장.

   초안 HTML 참조:
     #screen-category-edit / .app-bar (← 뒤로가기 + "관심사 변경")
     .cat-wrap / .cat-header / .cat-bottom (저장하기 + 변경 안내)
   ───────────────────────────────────────────────────────────────── */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import InterestChipGrid from '@/components/category/InterestChipGrid';
import { CATEGORY_LIST, getCategoryLabel } from '@/data/categoryList';
import { useOverlayStore } from '@/store/overlayStore';
import { useAuthStore } from '@/store/authStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { updateInterests } from '@/api/services/user';
import type { InterestGroup } from '@/types/interest';

const INTEREST_GROUPS: InterestGroup[] = CATEGORY_LIST.map((node) => ({
  groupId: node.bigCategory,
  groupLabel: node.bigCategory,
  items: node.subCategories.map((s) => ({ id: s, label: getCategoryLabel(s) })),
}));

export default function CategoryEditPage() {
  const navigate   = useNavigate();
  const showToast  = useOverlayStore((s) => s.showToast);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const storedCategories = useUserPrefsStore((s) => s.selectedCategories);
  const setSelectedCategories = useUserPrefsStore((s) => s.setSelectedCategories);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(storedCategories.flatMap((c) => c.subCategories)),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (isLoggedIn) {
        /* 로그인: 다중 선택 */
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      } else {
        /* 비로그인: 단일 선택 */
        if (prev.has(id)) return new Set();
        return new Set([id]);
      }
    });
  }, [isLoggedIn]);

  const count = selectedIds.size;
  const canSave = count >= 1;

  async function handleSave() {
    if (!canSave || isSaving) return;
    setIsSaving(true);

    /* PATCH /user/interests (mock 모드는 store만) */
    const groups = INTEREST_GROUPS.map((g) => ({
      bigCategory: g.groupId,
      subCategories: g.items
        .filter((item) => selectedIds.has(item.id))
        .map((item) => item.id),
    })).filter((g) => g.subCategories.length > 0);

    setSelectedCategories(groups);

    if (isLoggedIn) {
      try {
        await updateInterests(groups);
      } catch {
        /* store는 이미 반영됨 */
      }
    }

    setIsSaving(false);
    showToast('관심사가 변경되었습니다. 내일 추천부터 반영됩니다.');
    navigate(-1);
  }

  return (
    <PageContainer>
      {/* .app-bar — ← 뒤로가기 | "관심사 변경" | (우측 빈칸) */}
      <AppHeader variant="default" title="관심사 변경" showBack />

      {/* .cat-wrap — flex-1, flex-col, px:20px, pt:24px, pb:24px */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-6 overflow-hidden">

        {/* .cat-header — mb: 24px */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-fg mb-[6px] tracking-[-0.5px] leading-[1.35]">
            관심사를 수정해 주세요.
          </h1>
          <p className="text-[14px] text-fg-muted leading-[1.55]">
            현재 선택된 관심사를 변경할 수 있습니다.
          </p>
        </div>

        {/* 칩 그리드 스크롤 */}
        <div className="flex-1 overflow-y-auto">
          <InterestChipGrid
            groups={INTEREST_GROUPS}
            selectedIds={selectedIds}
            onToggle={handleToggle}
          />
        </div>

        {/* .cat-bottom */}
        <div className="mt-auto pt-4">
          <p className="text-[13px] text-fg-muted mb-3 text-center">
            {count === 0
              ? (isLoggedIn ? '관심사를 선택해 주세요' : '관심 주제 1개를 선택해 주세요')
              : (isLoggedIn ? `${count}개 선택됨` : `${getCategoryLabel([...selectedIds][0])} 선택됨`)}
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className={[
              'w-full h-[52px] rounded-app-md text-[16px] font-semibold border-none transition-colors',
              'flex items-center justify-center gap-2',
              canSave && !isSaving
                ? 'bg-navy text-white cursor-pointer'
                : 'bg-skel text-fg-subtle cursor-not-allowed',
            ].join(' ')}
          >
            {isSaving && (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin flex-shrink-0" />
            )}
            저장하기
          </button>

          {/* .cat-note */}
          <p className="text-[12px] text-fg-subtle text-center mt-[10px]">
            변경 사항은 내일 추천부터 반영됩니다.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
