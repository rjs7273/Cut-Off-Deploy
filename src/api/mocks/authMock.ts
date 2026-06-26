import type { UserInfo } from '@/data/userstate/userInfo';
import type { SubscribedAt } from '@/data/userstate/subscribedAt';
import type { SelectedCategory } from '@/types/auth';
import type { SavedVideoEntry } from '@/data/userstate/savedVideoIds';
import type { WatchedVideoEntry } from '@/data/userstate/watchedVideoIds';
import type { FolderEntry } from '@/data/userstate/folders';
import { FOLDERS } from '@/data/userstate/folders';

export interface MockUserRecord {
  userInfo: UserInfo;
  isSubscribed: boolean;
  subscribedAt: SubscribedAt;
  savedVideoIds: SavedVideoEntry[];
  watchedVideoIds: WatchedVideoEntry[];
  folders: FolderEntry[];
  selectedCategories: SelectedCategory[];
  notificationEnabled: boolean;
}

const DB_KEY = 'mock_sv_db';

function readDb(): Record<string, MockUserRecord> {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, MockUserRecord>;
  } catch {
    return {};
  }
}

function writeDb(db: Record<string, MockUserRecord>): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

export async function mockLogin(
  userId: string,
  baseInfo: UserInfo,
  guestState: { selectedCategories: SelectedCategory[]; notificationEnabled: boolean },
): Promise<MockUserRecord> {
  const db = readDb();

  if (db[userId]) {
    const existing = db[userId];
    const mergedCategories =
      guestState.selectedCategories.length > 0
        ? guestState.selectedCategories
        : existing.selectedCategories;
    const record: MockUserRecord = {
      ...existing,
      userInfo: baseInfo,
      selectedCategories: mergedCategories,
      notificationEnabled: guestState.notificationEnabled || existing.notificationEnabled,
    };
    db[userId] = record;
    writeDb(db);
    return record;
  }

  const record: MockUserRecord = {
    userInfo: baseInfo,
    isSubscribed: false,
    subscribedAt: null,
    savedVideoIds: [],
    watchedVideoIds: [],
    folders: FOLDERS,
    selectedCategories: guestState.selectedCategories,
    notificationEnabled: guestState.notificationEnabled,
  };
  db[userId] = record;
  writeDb(db);
  return record;
}

export async function mockLogout(
  userId: string,
  data: Omit<MockUserRecord, 'userInfo'>,
): Promise<void> {
  const db = readDb();
  if (!db[userId]) return;
  db[userId] = { ...db[userId], ...data };
  writeDb(db);
}

export function mockReset(): void {
  try {
    localStorage.removeItem(DB_KEY);
  } catch {
    /* ignore */
  }
}

/** 회원 탈퇴 — mock DB에서 사용자 기록(구독 포함) 완전 삭제 */
export async function mockWithdrawUser(userId: string): Promise<void> {
  const db = readDb();
  delete db[userId];
  writeDb(db);
}

/** Splash mock 세션 복원 — mock_sv_db에서 사용자 기록 조회 */
export function mockRestoreSession(userId: string): MockUserRecord | null {
  const record = readDb()[userId];
  return record ?? null;
}
