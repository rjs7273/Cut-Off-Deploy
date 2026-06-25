import { create } from 'zustand';

/* ─────────────────────────────────────────────
   Toast 항목
   ───────────────────────────────────────────── */
interface ToastItem {
  id: string;
  message: string;
}

export type SubscribeSheetSource = 'home' | 'catlist' | 'mypage';
export type LoginUpsellSheetSource = 'saved' | 'history' | 'home' | 'catlist' | 'mypage';

/* ─────────────────────────────────────────────
   Overlay 전역 상태
   ───────────────────────────────────────────── */
interface OverlayState {
  /* ── Drawer ── */
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  /* ── Toast ── */
  toasts: ToastItem[];
  showToast: (message: string) => void;
  removeToast: (id: string) => void;

  /* ── SubscribeBottomSheet ── */
  subscribeSheetSource: SubscribeSheetSource | null;
  openSubscribeSheet: (source: SubscribeSheetSource) => void;
  closeSubscribeSheet: () => void;

  /* ── LoginUpsellBottomSheet ── */
  loginUpsellSheetSource: LoginUpsellSheetSource | null;
  openLoginUpsellSheet: (source: LoginUpsellSheetSource) => void;
  closeLoginUpsellSheet: () => void;

  /* ── SessionExpiredModal ── */
  isSessionExpiredModalOpen: boolean;
  openSessionExpiredModal: () => void;
  closeSessionExpiredModal: () => void;

  /* ── UnsubscribeBottomSheet (MyPage) ── */
  isUnsubscribeSheetOpen: boolean;
  openUnsubscribeSheet: () => void;
  closeUnsubscribeSheet: () => void;

  /* ── SaveFolderBottomSheet — 저장 위치 선택 ── */
  saveFolderSheet: {
    videoId: string;
    onComplete?: (folderId: string) => void;
  } | null;
  openSaveFolderSheet: (payload: {
    videoId: string;
    onComplete?: (folderId: string) => void;
  }) => void;
  closeSaveFolderSheet: () => void;
}

const toastTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export const useOverlayStore = create<OverlayState>((set, get) => ({
  /* ── Drawer ── */
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  /* ── Toast ── */
  toasts: [],
  showToast: (message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message }] }));

    toastTimers[id] = setTimeout(() => {
      get().removeToast(id);
      delete toastTimers[id];
    }, 2000);
  },
  removeToast: (id) => {
    if (toastTimers[id]) {
      clearTimeout(toastTimers[id]);
      delete toastTimers[id];
    }
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  /* ── SubscribeBottomSheet ── */
  subscribeSheetSource: null,
  openSubscribeSheet: (source) => set({ subscribeSheetSource: source }),
  closeSubscribeSheet: () => set({ subscribeSheetSource: null }),

  /* ── LoginUpsellBottomSheet ── */
  loginUpsellSheetSource: null,
  openLoginUpsellSheet: (source) => set({ loginUpsellSheetSource: source }),
  closeLoginUpsellSheet: () => set({ loginUpsellSheetSource: null }),

  /* ── SessionExpiredModal ── */
  isSessionExpiredModalOpen: false,
  openSessionExpiredModal: () => set({ isSessionExpiredModalOpen: true }),
  closeSessionExpiredModal: () => set({ isSessionExpiredModalOpen: false }),

  /* ── UnsubscribeBottomSheet ── */
  isUnsubscribeSheetOpen: false,
  openUnsubscribeSheet: () => set({ isUnsubscribeSheetOpen: true }),
  closeUnsubscribeSheet: () => set({ isUnsubscribeSheetOpen: false }),

  /* ── SaveFolderBottomSheet ── */
  saveFolderSheet: null,
  openSaveFolderSheet: (payload) => set({ saveFolderSheet: payload }),
  closeSaveFolderSheet: () => set({ saveFolderSheet: null }),
}));
