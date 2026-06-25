import { useReducer, useEffect, useCallback } from 'react';
import type { HomeVideo, PickStatus } from '@/types/home';
import type { VideoCard } from '@/types/video';
import {
  getTodayRecommendations,
} from '@/api/services/recommendations';
import { toggleSaveVideo } from '@/api/services/saved';
import { useSavedStore } from '@/store/savedStore';
import { useUserPrefsStore } from '@/store/userPrefsStore';

interface HomeState {
  todaysPick: HomeVideo | null;
  otherVideos: VideoCard[];
  pickStatus: PickStatus;
  savedIds: Set<string>;
  skippedOtherIds: Set<string>;
  isLoading: boolean;
  error: string | null;
}

type HomeAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; pick: HomeVideo; others: VideoCard[] }
  | { type: 'FETCH_ERROR'; message: string }
  | { type: 'SKIP_PICK' }
  | { type: 'RESTORE_PICK' }
  | { type: 'SET_SAVED'; id: string; isSaved: boolean }
  | { type: 'SKIP_OTHER'; id: string }
  | { type: 'RESTORE_OTHER'; id: string };

function reducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_SUCCESS': {
      const savedIds = new Set<string>(state.savedIds);
      if (action.pick.isSaved) savedIds.add(action.pick.id);
      for (const v of action.others) {
        if (v.isSaved) savedIds.add(v.id);
      }
      return {
        ...state,
        isLoading: false,
        todaysPick: action.pick,
        otherVideos: action.others,
        savedIds,
      };
    }

    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.message };

    case 'SKIP_PICK':
      return { ...state, pickStatus: 'skipped' };

    case 'RESTORE_PICK':
      return { ...state, pickStatus: 'normal' };

    case 'SET_SAVED': {
      const next = new Set(state.savedIds);
      if (action.isSaved) next.add(action.id);
      else next.delete(action.id);
      return { ...state, savedIds: next };
    }

    case 'SKIP_OTHER': {
      const next = new Set(state.skippedOtherIds);
      next.add(action.id);
      return { ...state, skippedOtherIds: next };
    }

    case 'RESTORE_OTHER': {
      const next = new Set(state.skippedOtherIds);
      next.delete(action.id);
      return { ...state, skippedOtherIds: next };
    }

    default:
      return state;
  }
}

export interface UseHomeReturn {
  todaysPick: HomeVideo | null;
  otherVideos: VideoCard[];
  pickStatus: PickStatus;
  savedIds: Set<string>;
  skippedOtherIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  skipPick: () => void;
  restorePick: () => void;
  toggleSave: (id: string) => void;
  skipOther: (id: string) => void;
  restoreOther: (id: string) => void;
}

export function useHome(): UseHomeReturn {
  const savedVideoIds = useSavedStore((s) => s.savedVideoIds);
  const selectedCategories = useUserPrefsStore((s) => s.selectedCategories);

  const [state, dispatch] = useReducer(reducer, {
    todaysPick: null,
    otherVideos: [],
    pickStatus: 'normal',
    savedIds: new Set<string>(savedVideoIds.map((s) => s.id)),
    skippedOtherIds: new Set<string>(),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    getTodayRecommendations(selectedCategories)
      .then(({ pick, others }) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', pick, others });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : '추천 영상을 불러오지 못했습니다.';
          dispatch({ type: 'FETCH_ERROR', message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategories]);

  const skipPick = useCallback(() => dispatch({ type: 'SKIP_PICK' }), []);
  const restorePick = useCallback(() => dispatch({ type: 'RESTORE_PICK' }), []);

  const toggleSave = useCallback((id: string) => {
    toggleSaveVideo(id)
      .then((isSaved) => dispatch({ type: 'SET_SAVED', id, isSaved }))
      .catch(() => {
        /* rollback: store already toggled in mock path; ignore API errors for now */
      });
  }, []);

  const skipOther = useCallback((id: string) => dispatch({ type: 'SKIP_OTHER', id }), []);
  const restoreOther = useCallback((id: string) => dispatch({ type: 'RESTORE_OTHER', id }), []);

  return { ...state, skipPick, restorePick, toggleSave, skipOther, restoreOther };
}
