import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PageContainer from '@/components/layout/PageContainer';
import AppHeader from '@/components/layout/AppHeader';
import CategoryFilterChips from '@/components/category/CategoryFilterChips';
import CategoryVideoList from '@/components/category/CategoryVideoList';
import CategoryLockOverlay from '@/components/category/CategoryLockOverlay';
import { getCategoryLabel } from '@/data/categoryList';
import { useCategoryList } from '@/hooks/useCategoryList';
import { useAuthStore } from '@/store/authStore';
import { useOverlayStore } from '@/store/overlayStore';
import type { CategoryGroup, CategoryItem } from '@/types/catlist';
import { resolveUserTier } from '@/types/userTier';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isLoggedIn   = useAuthStore((s) => s.isLoggedIn);
  const isSubscribed = useAuthStore((s) => s.isSubscribed);
  const userTier = resolveUserTier(isLoggedIn, isSubscribed);

  const openLoginUpsellSheet = useOverlayStore((s) => s.openLoginUpsellSheet);
  const openSubscribeSheet   = useOverlayStore((s) => s.openSubscribeSheet);

  const group        = (searchParams.get('group')  ?? '비즈니스') as CategoryGroup;
  const initialFilter = searchParams.get('filter') ?? '전체';

  const { meta, filteredItems, selectedFilter, isLoading, error, setFilter } =
    useCategoryList(group, initialFilter);

  const openVideoDetail = useCallback((item: CategoryItem) => {
    navigate(`/video/${item.id}?source=catlist`, { state: { video: item } });
  }, [navigate]);

  const handleSubscribe = useCallback(() => {
    if (userTier === 'guest') openLoginUpsellSheet('catlist');
    else                      openSubscribeSheet('catlist');
  }, [userTier, openLoginUpsellSheet, openSubscribeSheet]);

  const isLocked = userTier === 'guest' || userTier === 'free';
  const filterLabel =
    selectedFilter !== '전체' ? getCategoryLabel(selectedFilter) : '이 카테고리';

  return (
    <PageContainer scrollable>
      <AppHeader variant="home" showMyPage />

      <div className="flex-1 flex flex-col">
        <div className="px-5 pt-4 pb-[14px] border-b border-line">
          <h1 className="text-[22px] font-bold text-fg tracking-[-0.5px]">
            {meta?.name ?? group}
          </h1>
          <p className="text-[13px] text-fg-muted leading-[1.5] mt-1 mb-[10px]">
            {meta?.desc}
          </p>
          {meta && (
            <CategoryFilterChips
              filters={meta.filters}
              selectedFilter={selectedFilter}
              onSelectFilter={setFilter}
            />
          )}
        </div>

        <div className="relative flex-1">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center px-5 py-14 text-center">
              <p className="text-[15px] font-bold text-fg mb-2">불러오기 실패</p>
              <p className="text-[13px] text-fg-muted leading-[1.6]">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length === 0 && (
            <div className="flex flex-col items-center px-5 pt-[52px] pb-10 text-center">
              <div className="w-14 h-14 bg-surface-sub rounded-[16px] flex items-center justify-center mb-4">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="#999999" strokeWidth="1.8" />
                  <path d="M16.5 16.5L21 21" stroke="#999999" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M8.5 11h5M11 8.5v5" stroke="#999999" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[16px] font-bold text-fg mb-2 tracking-[-0.3px]">
                {selectedFilter !== '전체' ? `"${filterLabel}"` : filterLabel} 영상을 준비 중이에요
              </p>
              <p className="text-[13px] text-fg-muted leading-[1.65]">
                에디터가 볼 만한 영상을 찾고 있습니다.<br />조금만 기다려 주세요.
              </p>
            </div>
          )}

          {!isLoading && !error && filteredItems.length > 0 && (
            <>
              <CategoryVideoList
                items={filteredItems}
                blurred={isLocked}
                onClickItem={openVideoDetail}
              />

              {isLocked && (
                <CategoryLockOverlay
                  userTier={userTier}
                  onClickSubscribe={handleSubscribe}
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
