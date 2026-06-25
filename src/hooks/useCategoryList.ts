import { useReducer, useEffect, useCallback } from 'react';
import type { CategoryItem, CategoryMeta, CategoryGroup } from '@/types/catlist';
import { getCategoryLabel } from '@/data/categoryList';
import { loadCategoryVideos } from '@/api/services/categories';

interface State {
  meta: CategoryMeta | null;
  items: CategoryItem[];
  selectedFilter: string;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; meta: CategoryMeta; items: CategoryItem[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, meta: action.meta, items: action.items };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_FILTER':
      return { ...state, selectedFilter: action.payload };
    default:
      return state;
  }
}

export interface UseCategoryListReturn {
  meta: CategoryMeta | null;
  filteredItems: CategoryItem[];
  selectedFilter: string;
  isLoading: boolean;
  error: string | null;
  setFilter: (filter: string) => void;
  getFilterLabel: (filter: string) => string;
}

export function useCategoryList(
  group: CategoryGroup | null,
  initialFilter = '전체',
): UseCategoryListReturn {
  const [state, dispatch] = useReducer(reducer, {
    meta: null,
    items: [],
    selectedFilter: initialFilter,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: 'SET_FILTER', payload: initialFilter });
  }, [group, initialFilter]);

  useEffect(() => {
    if (!group) return;

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    loadCategoryVideos(group, state.selectedFilter)
      .then(({ meta, items }) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', meta, items });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: '영상 목록을 불러오지 못했습니다.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [group, state.selectedFilter]);

  const setFilter = useCallback((filter: string) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const getFilterLabel = useCallback(
    (filter: string) => (filter === '전체' ? filter : getCategoryLabel(filter)),
    [],
  );

  return {
    meta: state.meta,
    filteredItems: state.items,
    selectedFilter: state.selectedFilter,
    isLoading: state.isLoading,
    error: state.error,
    setFilter,
    getFilterLabel,
  };
}
