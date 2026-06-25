/* ─────────────────────────────────────────────────────────────────
   historyStore — 시청 기록 상태
   Zustand persist 로 localStorage 직접 관리 (key: cutoff-history).

   사용처:
     - 읽기:   useWatchHistory, HistoryPage
     - 쓰기:   addWatched (VideoDetailBottomSheet), removeWatched (HistoryPage)
     - 초기화: authStore.logout()
   ───────────────────────────────────────────────────────────────── */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchedVideoEntry } from '@/data/userstate/watchedVideoIds';
import { WATCHED_VIDEO_IDS } from '@/data/userstate/watchedVideoIds';

interface HistoryState {
  watchedVideoIds: WatchedVideoEntry[];

  /** 영상 시청 기록 추가 (VideoDetailBottomSheet에서 호출) */
  addWatched: (videoId: string) => void;
  /** 특정 시청 기록 삭제 */
  removeWatched: (videoId: string) => void;
  /** 로그아웃 시 전체 초기화 */
  reset: () => void;
  /** 로그인 후 서버 데이터 복원 */
  restoreFromRecord: (watchedVideoIds: WatchedVideoEntry[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      watchedVideoIds: WATCHED_VIDEO_IDS,

      addWatched: (videoId) => {
        const { watchedVideoIds } = get();
        const now = new Date();

        const watchedDate = now.toISOString().slice(0, 10);

        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const period = hours < 12 ? '오전' : '오후';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        const watchedTime = `${period} ${displayHours}:${minutes}`;

        const entry: WatchedVideoEntry = { id: videoId, watchedDate, watchedTime };
        set({ watchedVideoIds: [entry, ...watchedVideoIds] });
      },

      removeWatched: (videoId) => {
        const { watchedVideoIds } = get();
        set({ watchedVideoIds: watchedVideoIds.filter((e) => e.id !== videoId) });
      },

      reset: () => {
        set({ watchedVideoIds: [] });
      },

      restoreFromRecord: (watchedVideoIds) => {
        set({ watchedVideoIds });
      },
    }),
    { name: 'cutoff-history' },
  ),
);
