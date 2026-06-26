import { useReducer, useEffect } from 'react';
import type { SavedVideo, Folder } from '@/types/saved';
import { loadSaved, toggleSaveVideo, addSavedFolder, deleteSavedFolder } from '@/api/services/saved';

interface State {
  items: SavedVideo[];
  folders: Folder[];
  activeFolderId: string | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; items: SavedVideo[]; folders: Folder[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_SAVED'; id: string; isSaved: boolean }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_FOLDER'; folderId: string | null; items: SavedVideo[]; folders: Folder[] }
  | { type: 'ADD_FOLDER'; folder: Folder };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, items: action.items, folders: action.folders };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_SAVED':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, isSaved: action.isSaved } : item,
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case 'SET_FOLDER':
      return {
        ...state,
        activeFolderId: action.folderId,
        items: action.items,
        folders: action.folders,
      };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.folder] };
    default:
      return state;
  }
}

export function useSavedVideos(isLoggedIn: boolean) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    folders: [],
    activeFolderId: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    loadSaved()
      .then(({ items, folders }) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', items, folders });
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_ERROR', payload: '저장한 영상을 불러오지 못했습니다.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const filteredItems =
    state.activeFolderId === null
      ? state.items
      : state.items.filter((item) => item.folderIds.includes(state.activeFolderId!));

  function toggleSave(savedId: string, onChange?: () => void) {
    const videoId = savedId.replace(/^saved_/, '');
    toggleSaveVideo(videoId)
      .then((isSaved) => {
        dispatch({ type: 'SET_SAVED', id: savedId, isSaved });
        onChange?.();
      })
      .catch(() => onChange?.());
  }

  function removeItem(savedId: string) {
    dispatch({ type: 'REMOVE_ITEM', id: savedId });
  }

  function setActiveFolder(folderId: string | null) {
    if (folderId === state.activeFolderId) return;
    loadSaved()
      .then(({ items, folders }) => {
        dispatch({ type: 'SET_FOLDER', folderId, items, folders });
      })
      .catch(() => {});
  }

  function addFolder(name: string) {
    addSavedFolder(name)
      .then((folder) => dispatch({ type: 'ADD_FOLDER', folder }))
      .catch(() => {});
  }

  function removeFolder(folderId: string) {
    deleteSavedFolder(folderId)
      .then(() => loadSaved())
      .then(({ items, folders }) => {
        const nextFolderId = state.activeFolderId === folderId ? null : state.activeFolderId;
        dispatch({ type: 'SET_FOLDER', folderId: nextFolderId, items, folders });
      })
      .catch(() => {});
  }

  return {
    items: filteredItems,
    folders: state.folders,
    activeFolderId: state.activeFolderId,
    isLoading: state.isLoading,
    error: state.error,
    toggleSave,
    removeItem,
    setActiveFolder,
    addFolder,
    removeFolder,
  };
}
