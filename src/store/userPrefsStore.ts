/* ─────────────────────────────────────────────────────────────────
   userPrefsStore — 사용자 환경설정 상태
   Zustand persist 로 localStorage 직접 관리 (key: cutoff-prefs).

   사용처:
     - 읽기:   useHome, useNotifPermission, SplashPage, MyPage,
               NotificationPage, CategoryPage, CategoryEditPage
     - 쓰기:   각 setter
     - 로그아웃: resetOnLogout() — 알림 설정은 유지, 나머지 초기화
   ───────────────────────────────────────────────────────────────── */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SelectedCategory } from '@/data/userstate/selectedCategories';
import type { NotificationPermission } from '@/data/userstate/notificationPermission';
import { SELECTED_CATEGORIES, keepSingleSelectedCategory } from '@/data/userstate/selectedCategories';
import { NOTIFICATION_ENABLED } from '@/data/userstate/notificationEnabled';
import { NOTIFICATION_PERMISSION } from '@/data/userstate/notificationPermission';
import { IS_FIRST_ENTRY } from '@/data/userstate/isFirstEntry';

interface UserPrefsState {
  selectedCategories: SelectedCategory[];
  notificationEnabled: boolean;
  notificationPermission: NotificationPermission;
  isFirstEntry: boolean;

  setSelectedCategories: (categories: SelectedCategory[]) => void;
  setNotificationEnabled: (v: boolean) => void;
  setNotificationPermission: (v: NotificationPermission) => void;
  setIsFirstEntry: (v: boolean) => void;

  /**
   * 로그아웃 시 부분 초기화.
   * - 알림 설정(notificationEnabled, notificationPermission)은 기기 설정이므로 유지.
   * - selectedCategories: 첫 번째 대분류 서브카테고리 1개만 보존.
   * - isFirstEntry: false 유지 (재진입 시 온보딩 재시작 방지).
   */
  resetOnLogout: () => void;

  /** 로그인 후 서버 데이터 복원 */
  restoreFromRecord: (data: {
    selectedCategories: SelectedCategory[];
    notificationEnabled: boolean;
  }) => void;
}

export const useUserPrefsStore = create<UserPrefsState>()(
  persist(
    (set, get) => ({
      selectedCategories: SELECTED_CATEGORIES,
      notificationEnabled: NOTIFICATION_ENABLED,
      notificationPermission: NOTIFICATION_PERMISSION,
      isFirstEntry: IS_FIRST_ENTRY,

      setSelectedCategories: (categories) => set({ selectedCategories: categories }),
      setNotificationEnabled: (v) => set({ notificationEnabled: v }),
      setNotificationPermission: (v) => set({ notificationPermission: v }),
      setIsFirstEntry: (v) => set({ isFirstEntry: v }),

      resetOnLogout: () => {
        const { selectedCategories, notificationEnabled, notificationPermission } = get();
        set({
          selectedCategories: keepSingleSelectedCategory(selectedCategories),
          notificationEnabled,
          notificationPermission,
          isFirstEntry: false,
        });
      },

      restoreFromRecord: ({ selectedCategories, notificationEnabled }) => {
        set({ selectedCategories, notificationEnabled });
      },
    }),
    { name: 'cutoff-prefs' },
  ),
);
