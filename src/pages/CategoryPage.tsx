/* ─────────────────────────────────────────────────────────────────
   CategoryPage  (온보딩 / 구독 직후 카테고리 선택)
   ─────────────────────────────────────────────────────────────────
   URL:
     /category               — 온보딩: 최초 관심사 선택 (1개↑ → 알림 → 홈)
     /category?mode=subscribe — 구독 직후: 기존 선택 유지, 3개↑ → 홈 + 토스트

   HTML 참조:
     catBottomAction(), openCategoryForSubscribe(), goHome()
   ───────────────────────────────────────────────────────────────── */
import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InterestChipGrid from '@/components/category/InterestChipGrid';
import { CATEGORY_LIST, getCategoryLabel } from '@/data/categoryList';
import { useAuthStore } from '@/store/authStore';
import { useOverlayStore } from '@/store/overlayStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';
import { updateInterests } from '@/api/services/user';
import type { InterestGroup } from '@/types/interest';

const INTEREST_GROUPS: InterestGroup[] = CATEGORY_LIST.map((node) => ({
  groupId: node.bigCategory,
  groupLabel: node.bigCategory,
  items: node.subCategories.map((s) => ({ id: s, label: getCategoryLabel(s) })),
}));

export default function CategoryPage() {
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn);
  const isSubscribed = useAuthStore((s) => s.isSubscribed);
  const showToast   = useOverlayStore((s) => s.showToast);
  const storedCategories = useUserPrefsStore((s) => s.selectedCategories);
  const setSelectedCategories = useUserPrefsStore((s) => s.setSelectedCategories);

  const isSubscribeMode = searchParams.get('mode') === 'subscribe';

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    if (isSubscribeMode) {
      return new Set(storedCategories.flatMap((c) => c.subCategories));
    }
    return new Set();
  });

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      /* 구독 모드이거나 구독자 → 다중 선택 */
      if (isSubscribeMode || isSubscribed) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }
      /* 비회원·비구독자 → 단일 선택 */
      if (prev.has(id)) return new Set();
      return new Set([id]);
    });
  }, [isSubscribeMode, isSubscribed]);

  const count = selectedIds.size;
  /* 구독 모드는 3개↑, 온보딩은 1개↑ */
  const minRequired = isSubscribeMode ? 3 : 1;
  const canProceed  = count >= minRequired;

  async function handleStart() {
    if (!canProceed) return;

    const groups = INTEREST_GROUPS
      .map((g) => ({
        bigCategory: g.groupId,
        subCategories: g.items
          .filter((item) => selectedIds.has(item.id))
          .map((item) => item.id),
      }))
      .filter((g) => g.subCategories.length > 0);
    setSelectedCategories(groups);

    if (isLoggedIn) {
      try {
        await updateInterests(groups);
      } catch {
        /* store는 이미 반영됨 */
      }
    }

    if (isSubscribeMode) {
      /* 구독 직후 → 홈으로 바로 이동 */
      showToast('구독을 시작했습니다. 관심사가 저장됐어요!');
      navigate('/home', { replace: true });
    } else {
      /* 온보딩 → 알림 설정 화면으로 이동 */
      navigate('/notification', { replace: true });
    }
  }

  /* ── 모드별 UI 텍스트 ── */
  const titleText = isSubscribeMode
    ? '관심사를 3개 이상\n선택해 주세요.'
    : '관심 있는 주제를\n선택해 주세요.';
  const descText = isSubscribeMode
    ? '구독을 시작했습니다. 더 정확한 추천을 위해 관심사를 추가로 골라주세요.'
    : '선택한 주제를 바탕으로 매일 볼 만한 영상을 추천합니다.';
  const countText = (() => {
    if (count === 0) {
      return isSubscribeMode
        ? '관심사를 3개 이상 선택해 주세요'
        : (isSubscribed ? '관심사를 선택해 주세요' : '관심 주제 1개를 선택해 주세요');
    }
    if (isSubscribeMode) {
      return count >= 3 ? `${count}개 선택됨` : `${count}개 선택됨 (3개 이상 필요)`;
    }
    return isSubscribed ? `${count}개 선택됨` : `${getCategoryLabel([...selectedIds][0])} 선택됨`;
  })();

  return (
    <div className="min-h-dvh bg-surface flex flex-col pt-safe pb-safe">
      {/* .cat-wrap */}
      <div className="flex-1 flex flex-col px-5 pt-6 pb-6">

        {/* .cat-header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-fg mb-[6px] tracking-[-0.5px] leading-[1.35] whitespace-pre-line">
            {titleText}
          </h1>
          <p className="text-[14px] text-fg-muted leading-[1.55]">
            {descText}
          </p>
        </div>

        {/* 칩 그리드 스크롤 영역 */}
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
            {countText}
          </p>

          <button
            type="button"
            onClick={handleStart}
            disabled={!canProceed}
            className={[
              'w-full h-[52px] rounded-app-md text-[16px] font-semibold border-none transition-colors',
              canProceed
                ? 'bg-navy text-white cursor-pointer'
                : 'bg-skel text-fg-subtle cursor-not-allowed',
            ].join(' ')}
          >
            시작하기
          </button>

          <p className="text-[12px] text-fg-subtle text-center mt-[10px]">
            관심사는 마이페이지에서 변경할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
