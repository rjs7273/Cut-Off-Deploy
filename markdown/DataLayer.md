# 데이터 레이어 구조 및 백엔드 연동 가이드

---

## 0. BE 기준 타입 정렬 (1단계 완료)

FE는 **별도 계약 레이어·매퍼 없이** 기존 `types/` · `data/` · `store/` · `api/` 를 BE 스키마에 직접 맞춘다.

| BE | FE |
|----|-----|
| `VideoCard` | `types/video.ts` — `duration`, `thumbnailUrl`, `youtubeUrl`, `isSaved`, `category`(en id) |
| `MeResponse` | `types/auth.ts` — `notificationEnabled`, `subscription.plan: FREE \| PREMIUM` |
| `subCategories[]` (en id) | `data/categoryList.ts` — UI 라벨은 `getCategoryLabel()` |
| PATCH `alarmAgreed` | `api/services/user.ts` → `updateNotificationSetting({ alarmAgreed })` |
| API prefix `/test` | `lib/apiClient.ts` |
| Mock/API 스위치 | `lib/apiMode.ts` — `useMockApi()` |

표시 전용 유틸 (`durationLabel`, gradient fallback)은 **타입 필드가 아닌** `data/utils.ts` (`toDurationLabel`, `thumbnailBackground`, `buildVideoCard`) 에만 둔다.

---

## 0.5 Phase 2 — service 레이어 (완료)

```
hooks / pages
    ↓
api/services/*     ← useMockApi() 분기 (단일 진입점)
    ├─ api/mocks/*   (mock=true)
    └─ api/*.ts      (mock=false, axios)
```

| env | 동작 |
|-----|------|
| `VITE_USE_MOCK_API` 미설정 또는 `true` | mock (기본) |
| `VITE_USE_MOCK_API=false` | BE 실 HTTP |

Catlist·`subscription/start`는 API 모드에서도 mock 고정.

---

## 1. 현재 구조 개요

```
front/src/data/          ← 개발자 정의 기본값 (TypeScript 상수)
front/src/data/storage.ts ← localStorage 읽기/쓰기 레이어
front/src/hooks/         ← 데이터 소스 ↔ UI 연결 지점
```

### 데이터 흐름

```
앱 최초 실행 (localStorage 비어있음)
    data/ 기본값 → storage.get() → hooks → UI

사용자 조작 발생
    UI → hooks (action) → storage.set() → localStorage 저장

새로고침 후
    localStorage → storage.get() → hooks → UI
```

---

## 2. 파일별 역할

### `front/src/data/` — 개발자 전용 기본값


| 파일                                 | 내용                | 백엔드 연동 후                 |
| ---------------------------------- | ----------------- | ------------------------ |
| `videoList.ts`                     | 전체 영상 목록 (계층 구조)  | API 응답으로 교체              |
| `categoryList.ts`                  | BE en id + 한글 라벨 (`CATEGORY_LABELS`) | Catlist API 전까지 UI·필터 원천 유지 |
| `todaysPick.ts`                    | 오늘의 픽 영상 ID       | API 응답으로 교체              |
| `policyDocuments.ts`               | 이용약관·개인정보처리방침 전문  | CMS 또는 API로 교체           |
| `skipReasons.ts`                   | 스킵 이유 선택지 목록      | 정적 유지 또는 서버 설정값으로 교체     |
| `userstate/isLoggedIn.ts`          | 로그인 상태 기본값        | 앱 초기화 시 토큰 검증으로 교체       |
| `userstate/isFirstEntry.ts`        | 최초 진입 여부 기본값      | 서버 또는 localStorage 유지 가능 |
| `userstate/isSubscribed.ts`        | 구독 상태 기본값         | 서버 사용자 정보 API로 교체        |
| `userstate/notificationEnabled.ts` | 알림 설정 기본값         | 서버 설정 API로 교체            |
| `userstate/selectedCategories.ts`  | 관심 카테고리 기본값       | 서버 사용자 설정 API로 교체        |
| `userstate/savedVideoIds.ts`       | 저장한 영상 기본값        | 서버 저장 목록 API로 교체         |
| `userstate/watchedVideoIds.ts`     | 시청 기록 기본값         | 서버 기록 API로 교체            |
| `userstate/folders.ts`             | 폴더 목록 기본값         | 서버 폴더 API로 교체            |
| `userstate/userInfo.ts`            | 사용자 정보 기본값        | 서버 프로필 API로 교체           |


### `front/src/data/storage.ts` — localStorage 레이어

백엔드 연동 전까지 사용자 조작을 브라우저에 영속화하는 임시 레이어.  
**백엔드 연동 시 이 파일을 API 호출 모듈로 교체하거나 삭제한다.**

### `front/src/hooks/` — 교체 지점 (핵심)

백엔드 연동 시 실제로 수정하는 위치. **Phase 2 완료:** hooks는 `api/services/*`만 호출한다.

| Hook | service |
|------|---------|
| `useHome` | `services/recommendations` → `getTodayRecommendations` |
| `useSavedVideos` | `services/saved` → `loadSaved`, `toggleSaveVideo` |
| `useWatchHistory` | `services/history` → `loadHistory`, `removeHistoryEntry` |
| `useCategoryList` | mock 고정 (`VIDEO_LIST`) — Catlist BE 대기 |

---

## 3. localStorage 키 목록


| 키                         | 저장 내용                                | 초기화 시                             |
| ------------------------- | ------------------------------------ | --------------------------------- |
| `co_saved_video_ids`      | 저장한 영상 목록 (id, savedAt, folderId)    | `data/savedVideoIds.ts` 기본값       |
| `co_watched_video_ids`    | 시청 기록 (id, watchedDate, watchedTime) | `data/watchedVideoIds.ts` 기본값     |
| `co_selected_categories`  | 관심 카테고리                              | `data/selectedCategories.ts` 기본값  |
| `co_is_logged_in`         | 로그인 상태                               | `data/isLoggedIn.ts` 기본값          |
| `co_is_first_entry`       | 최초 진입 여부                             | `data/isFirstEntry.ts` 기본값        |
| `co_is_subscribed`        | 구독 상태                                | `data/isSubscribed.ts` 기본값        |
| `co_notification_enabled` | 알림 설정                                | `data/notificationEnabled.ts` 기본값 |


### localStorage 전체 초기화 (개발용 콘솔 명령)

```javascript
['co_saved_video_ids','co_watched_video_ids','co_selected_categories',
 'co_is_logged_in','co_is_first_entry','co_is_subscribed','co_notification_enabled']
.forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 4. 백엔드 연동 시 작업 순서

### Step 1 — 인증 연동 (`isLoggedIn`, `userInfo`)

```
현재: storage.isLoggedIn.get() → localStorage
교체: useAuth 훅 구현 → 토큰 검증 API 호출 → 결과로 isLoggedIn 결정
```

**수정 파일:**

- `hooks/useHome.ts` — 인증 상태 읽는 방식 교체
- `pages/SplashPage.tsx` — useAuth 훅으로 교체
- `pages/SavedPage.tsx`, `HistoryPage.tsx`, `MyPage.tsx` — 동일

---

### Step 2 — 영상·카테고리 데이터 연동

```
현재: VIDEO_LIST, CATEGORY_LIST, TODAYS_PICK (data/ 정적 파일)
교체: GET /api/home/today, GET /api/categories/:group
```

**수정 파일:**

- `hooks/useHome.ts`

```typescript
// 현재
const selectedSubs = storage.selectedCategories.get().flatMap(...);
const videos = pickIds.map(buildHomeVideo)...;

// 교체
import { fetchTodayRecommendations } from '@/api/recommendations';
const { pick, others } = await fetchTodayRecommendations();
dispatch({ type: 'FETCH_SUCCESS', pick, others });
```

- `hooks/useCategoryList.ts`

```typescript
// 현재
const groupItems = buildCategoryItems(group);

// 교체 (Catlist API 미구현 — BE 배포 후)
// import { fetchCategoryList } from '@/api/catlist';
// const groupItems = await fetchCategoryList(group);
```

---

### Step 3 — 저장한 영상 연동

```
현재: storage.savedVideoIds.get() → localStorage
교체: GET /api/saved, POST /api/saved, DELETE /api/saved/:id
```

**수정 파일:** `hooks/useSavedVideos.ts`

```typescript
// 현재 (초기 로드)
const { items, folders } = buildSavedData(); // localStorage 기반

// 교체
const res = await fetch('/api/saved');
const { items, folders } = await res.json();

// 현재 (저장 해제)
storage.savedVideoIds.remove(videoId);

// 교체
await fetch(`/api/saved/${videoId}`, { method: 'DELETE' });
```

---

### Step 4 — 시청 기록 연동

```
현재: storage.watchedVideoIds.get() → localStorage
교체: GET /api/history, DELETE /api/history/:id
```

**수정 파일:** `hooks/useWatchHistory.ts`

---

### Step 5 — 사용자 설정 연동 (관심사, 알림)

```
현재: storage.selectedCategories / storage.notificationEnabled → localStorage
교체: GET/PATCH /api/user/settings
```

**수정 파일:**

- `pages/CategoryEditPage.tsx` — handleSave에서 API 호출
- `pages/MyPage.tsx` — 알림 토글 시 API 호출
- `pages/NotificationPage.tsx` — 온보딩 완료 시 API 호출

---

### Step 6 — 약관·정책 문서 연동 (선택)

```
현재: data/policyDocuments.ts (정적 텍스트)
교체: GET /api/policy/:type 또는 외부 CMS URL
```

**수정 파일:** `pages/PolicyPage.tsx`

---

## 5. 연동 후 삭제 가능한 파일

백엔드 연동이 완료되면 아래 파일들은 순차적으로 제거한다.

```
front/src/data/storage.ts          ← localStorage 레이어 (가장 먼저 제거)
front/src/data/userstate/*.ts      ← 기본값 파일들 (API 응답으로 대체)
front/src/data/videoList.ts        ← 영상 데이터 (API 응답으로 대체)
front/src/data/todaysPick.ts       ← 오늘의 픽 (API 응답으로 대체)
front/src/mocks/                   ← 구 목업 폴더 (이미 미사용, 삭제 가능)
```

**유지하는 파일:**

```
front/src/data/categoryList.ts     ← 카테고리 구조 (프론트 UI 로직에 필요할 수 있음)
front/src/data/policyDocuments.ts  ← 약관 텍스트 (CMS 연동 전까지 유지)
front/src/data/skipReasons.ts      ← 스킵 이유 목록 (정적 유지 가능)
front/src/data/utils.ts            ← toDurationLabel, thumbnailBackground, buildVideoCard (매퍼 레이어 아님)
front/src/api/                     ← BE Path 시그니처 (2단계에서 hooks가 호출)
front/src/lib/apiClient.ts         ← axios + /test prefix + token interceptor
```

---

## 6. 참고 — `data/` 수정 후 화면에 반영하는 방법

`data/` 파일을 수정해도 localStorage에 기존 값이 남아있으면 화면에 반영되지 않는다.  
**수정 후 반드시 위의 초기화 명령으로 localStorage를 비워야 한다.**

```
data/ 수정 → 저장 → 브라우저 콘솔에서 localStorage 초기화 → 새로고침 → 반영 확인
```

