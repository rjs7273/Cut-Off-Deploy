import { useReducer, useEffect } from 'react';
import type { WatchHistoryGroup } from '@/types/video';
import { loadHistory, removeHistoryEntry } from '@/api/services/history';
import { toggleSaveVideo } from '@/api/services/saved';
import { useHistoryStore } from '@/store/historyStore';

type State = {
  groups: WatchHistoryGroup[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WatchHistoryGroup[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'SET_SAVE'; id: string; isSaved: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { groups: [], isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { groups: action.payload, isLoading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'DELETE_ITEM':
      return {
        ...state,
        groups: state.groups
          .map((g) => ({ ...g, items: g.items.filter((i) => i.id !== action.id) }))
          .filter((g) => g.items.length > 0),
      };
    case 'SET_SAVE':
      return {
        ...state,
        groups: state.groups.map((g) => ({
          ...g,
          items: g.items.map((i) =>
            i.id === action.id ? { ...i, isSaved: action.isSaved } : i,
          ),
        })),
      };
  }
}

async function fetchGroups(): Promise<WatchHistoryGroup[]> {
  const { groups } = await loadHistory();
  return groups;
}

export function useWatchHistory(isLoggedIn: boolean) {
  const watchedVideoIds = useHistoryStore((s) => s.watchedVideoIds);
  const watchedStoreKey = watchedVideoIds
    .map((e) => `${e.id}:${e.watchedDate}:${e.watchedTime}`)
    .join('|');

  const [state, dispatch] = useReducer(reducer, {
    groups: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    fetchGroups()
      .then((groups) => {
        if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: groups });
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: '시청 기록을 불러오지 못했습니다.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, watchedStoreKey]);

  async function reloadHistory() {
    dispatch({ type: 'FETCH_START' });
    try {
      const groups = await fetchGroups();
      dispatch({ type: 'FETCH_SUCCESS', payload: groups });
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: '시청 기록을 불러오지 못했습니다.' });
    }
  }

  async function deleteItem(historyId: string) {
    dispatch({ type: 'DELETE_ITEM', id: historyId });
    try {
      await removeHistoryEntry(historyId);
      const groups = await fetchGroups();
      dispatch({ type: 'FETCH_SUCCESS', payload: groups });
    } catch {
      try {
        const groups = await fetchGroups();
        dispatch({ type: 'FETCH_SUCCESS', payload: groups });
      } catch {
        dispatch({ type: 'FETCH_ERROR', payload: '시청 기록을 삭제하지 못했습니다.' });
      }
    }
  }

  function setSaved(historyId: string, isSaved: boolean) {
    const videoId = historyId.replace(/^hist_/, '');
    toggleSaveVideo(videoId)
      .then((saved) => dispatch({ type: 'SET_SAVE', id: historyId, isSaved: saved }))
      .catch(() => dispatch({ type: 'SET_SAVE', id: historyId, isSaved }));
  }

  return {
    groups: state.groups,
    isLoading: state.isLoading,
    error: state.error,
    deleteItem,
    reloadHistory,
    setSaved,
  };
}
