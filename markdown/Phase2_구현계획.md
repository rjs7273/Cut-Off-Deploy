# Phase 2 — 실 API 연동 구현 계획

> **작성일** : 2026-06-25  
> **전제** : Phase 1 완료 (BE 기준 FE 구조 정렬, `npm run build` 통과)  
> **목표** : 모든 hooks의 `setTimeout` 목업 로직을 실 API 호출로 교체, axios interceptor·authStore 완전 연결  
> **미구현 API (BE 대기)** : Catlist, Policy API, REQ-009 `isTermsAgreed` → 이번 Phase 제외

---

## 0. 디버그 토글 — `src/lib/devFlags.ts`

> **Phase 2의 핵심 전제조건.** 모든 hooks가 이 플래그를 참조하여 실 API와 목업을 런타임에서 전환한다.

```ts
// src/lib/devFlags.ts

/**
 * USE_MOCK_API
 *
 * true  → 모든 hooks가 로컬 목업 데이터(setTimeout 시뮬레이션)를 사용한다.
 * false → 실 BE API(`VITE_API_BASE_URL/test`)를 호출한다.
 *
 * 전환 방법 (우선순위 순):
 *   1. 브라우저 콘솔: window.__CUTOFF_MOCK__ = true | false  (즉시 반영 안 됨 — 페이지 새로고침 필요)
 *   2. localStorage:  localStorage.setItem('cutoff_mock', 'true' | 'false')
 *   3. .env:          VITE_USE_MOCK_API=true | false
 *   4. 기본값:        개발(dev) 빌드 → true / 프로덕션 빌드 → false
 */

function resolveMockFlag(): boolean {
  // 1. localStorage override (개발 중 콘솔에서 빠르게 전환할 때)
  const ls = localStorage.getItem('cutoff_mock');
  if (ls === 'true') return true;
  if (ls === 'false') return false;

  // 2. .env 변수
  const env = import.meta.env.VITE_USE_MOCK_API;
  if (env === 'true') return true;
  if (env === 'false') return false;

  // 3. 빌드 모드 기본값
  return import.meta.env.DEV;
}

export const USE_MOCK_API: boolean = resolveMockFlag();

/** 콘솔에서 즉시 확인용 */
if (import.meta.env.DEV) {
  console.info(`[Cut-off] USE_MOCK_API = ${USE_MOCK_API}`);
}
```

### 전환 방법 요약

| 방법 | 명령 | 적용 시점 |
|------|------|----------|
| 콘솔 + 새로고침 | `localStorage.setItem('cutoff_mock', 'false')` | 새로고침 후 |
| .env 파일 | `VITE_USE_MOCK_API=false` | dev server 재시작 후 |
| 프로덕션 빌드 | 기본값 `false` (env 미설정 시) | 자동 |
| CI/CD | `VITE_USE_MOCK_API=false` 환경 변수 주입 | 빌드 시 |

---

## 1. SplashPage — 세션 복원 및 라우팅 연결

**현재 상태** : `setTimeout` 1800ms 후 `isLoggedIn` / `isFirstEntry` store 값으로 라우팅.  
**목표** : 앱 진입 시 `authStore`의 `accessToken`을 이용해 `GET /user/me`로 세션을 검증하고 라우팅.

### 구현 흐름

```
SplashPage 마운트
  └─ USE_MOCK_API = true
       → 기존 setTimeout 로직 (isLoggedIn, isFirstEntry store 참조)
  └─ USE_MOCK_API = false
       → authStore.accessToken 존재?
           Yes → GET /user/me (fetchMe)
                   성공 → authStore 동기화 후 navigate('/home')
                   401  → 토큰 만료 → POST /auth/refresh 시도
                            성공 → navigate('/home')
                            실패 → authStore 초기화 후 navigate('/login')
                   기타 오류 → navigate('/restricted')
           No  → isFirstEntry ? navigate('/onboard') : navigate('/login')
```

### 수정 파일

- `src/pages/SplashPage.tsx` — `USE_MOCK_API` 분기 추가, `fetchMe` / `refreshToken` 호출
- `src/store/authStore.ts` — `initSession()` 액션 추가 (토큰 검증 + store 동기화)

### `authStore.initSession()` 시그니처

```ts
initSession: () => Promise<'home' | 'onboard' | 'login' | 'restricted'>
```

---

## 2. 인증 플로우 — LoginPage / authStore

**현재 상태** : `handleAgreeContinue`에서 `setTimeout` 2000ms 후 `/onboard`로 이동.  
**목표** : Google/Apple `idToken`을 실제로 받아 BE에 전달, `AuthTokenResponse` 파싱 후 store에 저장.

### 구현 흐름

```
소셜 로그인 버튼 클릭
  └─ USE_MOCK_API = true
       → 기존 mockLogin 로직 (authMock.ts)
  └─ USE_MOCK_API = false
       → Google/Apple SDK → idToken 획득
       → loginGoogle(idToken) | loginApple(identityToken)
       → AuthTokenResponse: { accessToken, refreshToken, expiresAt, isNewUser, ... }
           → authStore.setSessionTokens(...)
           → isNewUser → navigate('/onboard')
           → 기존 사용자 → GET /user/me → authStore 동기화 → navigate('/home')
```

### 수정 파일

- `src/pages/LoginPage.tsx` — `USE_MOCK_API` 분기, 실 소셜 SDK 연동 플로우 연결
- `src/store/authStore.ts`
  - `loginWithGoogle(idToken)` 액션 추가
  - `loginWithApple(identityToken)` 액션 추가
  - `restoreSession()` → BE 연동 버전으로 교체 (기존 `mockLogin` 분기)
- `src/lib/apiClient.ts` — `setRefreshHandler` 에 `authStore.refresh()` 연결 (앱 초기화 시점)

### 주의 사항

- 소셜 SDK(`@codetrix-studio/capacitor-google-auth`, Capacitor Apple Sign In)는 Capacitor 네이티브 레이어에 의존 → 웹 개발 환경에서는 `USE_MOCK_API = true`로 우회
- `AuthTokenResponse.isNewUser` 필드가 BE에 없으면 `/user/me` 응답의 `interests` 배열이 비어있는지로 판단

---

## 3. `useHome` — 홈 추천 API 연동

**현재 상태** : `TODAYS_PICK` 정적 데이터 + `buildVideoCard` + `setTimeout` 600ms 시뮬레이션.  
**목표** : `GET /recommendations/today` 응답으로 교체. skip/restore도 실 API 호출.

### 구현 흐름

```ts
// USE_MOCK_API = true  → 기존 setTimeout + TODAYS_PICK 로직 유지
// USE_MOCK_API = false → fetchTodayRecommendations() 호출
```

### API 응답 → 상태 매핑

```ts
// GET /recommendations/today
// 응답: { pick: VideoCard, others: VideoCard[] }
// VideoCard 필드: id, title, channel, duration, thumbnailUrl, youtubeUrl, isSaved, ...
// → 별도 매핑 없이 dispatch({ type: 'FETCH_SUCCESS', pick, others })
```

### skip / restore 연동

```ts
// skipPick(videoId, reason?)
//   USE_MOCK_API = false → skipRecommendation(videoId, reason)
//   dispatch SKIP_PICK (optimistic update)
//   실패 시 dispatch RESTORE_PICK (롤백)

// restorePick(videoId)
//   USE_MOCK_API = false → restoreRecommendation(videoId)
```

### 수정 파일

- `src/hooks/useHome.ts`
  - `useEffect` 내 `USE_MOCK_API` 분기
  - `skipPick` / `restorePick` 콜백에 API 호출 추가 (optimistic update 패턴)

---

## 4. `useSavedVideos` — 저장 영상 API 연동

**현재 상태** : `savedStore`(localStorage) 기반 동기 로직.  
**목표** : `GET /saved` 로 목록 로드, `POST /saved/:id` / `DELETE /saved/:id` 로 토글, `POST /saved/folders` 로 폴더 생성.

### 구현 흐름

```ts
// USE_MOCK_API = false
// 마운트 시: fetchSaved() → { items: SavedVideo[], folders: FolderTab[] }
//   → dispatch FETCH_SUCCESS
//   → savedStore는 서버 응답으로 덮어쓰기 (sync)
//
// toggleSave(videoId, isSavedNow)
//   isSavedNow = true  → saveVideo(videoId, folderId?)
//   isSavedNow = false → unsaveVideo(videoId, folderId?)
//   optimistic update → dispatch SET_SAVED
//   실패 시 롤백
//
// addFolder(name)
//   createFolder(name) → FolderEntry
//   dispatch ADD_FOLDER
```

### 수정 파일

- `src/hooks/useSavedVideos.ts` — `USE_MOCK_API` 분기, 실 API 호출 추가
- `src/store/savedStore.ts` — `syncFromServer(items, folders)` 액션 추가 (서버 응답으로 store 초기화)

---

## 5. `useWatchHistory` — 시청 기록 API 연동

**현재 상태** : `historyStore`(localStorage) 기반 동기 로직.  
**목표** : `GET /history` 로 목록 로드, `DELETE /history/:entryId` 로 삭제.

### 구현 흐름

```ts
// USE_MOCK_API = false
// 마운트 시: fetchHistory() → { groups: WatchHistoryGroup[] }
//   → dispatch FETCH_SUCCESS (BE 응답 구조와 WatchHistoryGroup 타입 동일)
//
// deleteItem(historyId)
//   deleteHistoryEntry(historyId) 호출 (optimistic update)
//   dispatch DELETE_ITEM
//   실패 시 롤백 (그룹 재로드)
//
// 영상 시청 시 기록 추가:
//   addHistory(videoId) → { id, watchedAt }
//   historyStore.addWatched(videoId) 동기화
```

> **Note**: `addHistory`는 현재 FE에서 호출 시점이 정의되지 않음.  
> VideoDetailBottomSheet 또는 YouTube 재생 이벤트와 연동 필요 → **별도 TODO**로 남김.

### 수정 파일

- `src/hooks/useWatchHistory.ts` — `USE_MOCK_API` 분기, `fetchHistory` / `deleteHistoryEntry` 연동
- `src/store/historyStore.ts` — `syncFromServer(groups)` 액션 추가

---

## 6. 알림 설정 — `PATCH /user/notification-setting`

**현재 상태** : `userPrefsStore.notificationEnabled` 를 로컬에서만 토글.  
**목표** : 토글 즉시 BE에 동기화. FCM 토큰은 Capacitor Push Plugin에서 수령 후 함께 전송.

### 구현 흐름

```ts
// NotificationPage 또는 MyPage에서 알림 토글 시
// USE_MOCK_API = false
//   patchNotificationSetting({ alarmAgreed, fcmToken?, deviceType? })
//   성공 시 userPrefsStore.setNotificationEnabled(alarmAgreed)
//   실패 시 토글 롤백 + 토스트
```

### 수정 파일

- `src/pages/NotificationPage.tsx` — 토글 핸들러에 `USE_MOCK_API` 분기 + `patchNotificationSetting` 호출
- `src/components/mypage/PersonalSettingsSection.tsx` — 동일 패턴 적용

---

## 7. 관심사(카테고리) 수정 — `PATCH /user/interests`

**현재 상태** : `userPrefsStore.setSelectedCategories` 로컬 저장만.  
**목표** : `CategoryEditPage`의 저장 시 BE에도 반영.

### 구현 흐름

```ts
// CategoryEditPage 저장 버튼 클릭
// USE_MOCK_API = false
//   patchInterests(categories) → { success, categories }
//   성공 시 userPrefsStore.setSelectedCategories(categories)
//   실패 시 토스트 + 이전 값 복원
```

### 수정 파일

- `src/pages/CategoryEditPage.tsx` — 저장 핸들러에 `USE_MOCK_API` 분기 추가

---

## 8. 구독 상태 — `GET /subscription`

**현재 상태** : `authStore.isSubscribed` / `plan` 을 로컬에서 관리.  
**목표** : MyPage 진입 시 `GET /subscription` 으로 구독 상태 최신화, 취소는 `POST /subscription/cancel`.

### 구현 흐름

```ts
// MyPage 마운트 시 (isLoggedIn = true)
// USE_MOCK_API = false
//   fetchSubscription() → SubscriptionResponse | null
//   authStore.setSubscribed(!!subscription, subscription?.startDate)

// UnsubscribeBottomSheet 취소 확인 시
//   cancelSubscription() → { success }
//   성공 시 authStore.setSubscribed(false)
```

### 수정 파일

- `src/pages/MyPage.tsx` — `useEffect`에 `fetchSubscription` 연동
- `src/components/subscription/UnsubscribeBottomSheet.tsx` — `cancelSubscription` 연동

---

## 9. 로그아웃 / 회원탈퇴

**현재 상태** : `authStore.logout()` 이 `mockLogout` 호출.  
**목표** : `POST /auth/logout` 또는 `DELETE /auth/withdraw` 호출 후 store 초기화.

### 구현 흐름

```ts
// authStore.logout()
// USE_MOCK_API = false
//   logout() API 호출 (실패해도 로컬 초기화는 진행)
//   store 초기화 (savedStore, historyStore, userPrefsStore, authStore)

// authStore.withdraw()
// USE_MOCK_API = false
//   withdraw() API 호출
//   성공 시 store 초기화 + navigate('/login')
```

### 수정 파일

- `src/store/authStore.ts` — `logout()` / `withdraw()` 에 `USE_MOCK_API` 분기 추가

---

## 10. axios Refresh Interceptor 연결

**현재 상태** : `apiClient.ts`에 interceptor 로직은 존재하지만 `setRefreshHandler`가 연결되지 않음.  
**목표** : 앱 초기화 시점에 `setRefreshHandler`에 `authStore`의 refresh 로직을 주입.

### 구현 위치

```ts
// src/main.tsx 또는 App.tsx — 앱 최상위에서 1회 실행

import { setRefreshHandler } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { refreshToken as apiRefreshToken } from '@/api/auth';

setRefreshHandler(async () => {
  const { refreshToken, setSessionTokens } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    const res = await apiRefreshToken(refreshToken);
    setSessionTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    return res.accessToken;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
});
```

### 수정 파일

- `src/main.tsx` — `setRefreshHandler` 주입 (USE_MOCK_API = false 일 때만)

---

## 구현 순서 및 우선순위

| 순서 | 항목 | 파일 수 | 비고 |
|------|------|---------|------|
| **P0** | `devFlags.ts` 생성 | 1 | 모든 후속 작업의 전제 |
| **P0** | axios refresh handler 연결 | 1 | 인증 안정성 |
| **P1** | SplashPage + `authStore.initSession` | 2 | 앱 진입 흐름 |
| **P1** | LoginPage + `authStore.loginWithGoogle/Apple` | 2 | 인증 핵심 |
| **P2** | `useHome` 실 API 연동 | 1 | 핵심 기능 |
| **P2** | `useSavedVideos` 실 API 연동 | 2 | 핵심 기능 |
| **P2** | `useWatchHistory` 실 API 연동 | 2 | 핵심 기능 |
| **P3** | 알림 설정 `PATCH` 연동 | 2 | — |
| **P3** | 관심사 `PATCH` 연동 | 1 | — |
| **P3** | 구독 `GET/POST` 연동 | 2 | — |
| **P3** | 로그아웃/탈퇴 연동 | 1 | — |

---

## 미구현 API — BE 대기 목록

아래 항목은 BE 구현 완료 후 **별도 계획으로** 진행한다. 현재 Phase에서 FE 코드를 변경하지 않는다.

| API | 영향 화면 | 현재 대체 |
|-----|----------|----------|
| `GET /categories/{group}/videos` | CategoryListPage | `VIDEO_LIST` 정적 데이터 |
| `GET /policy/{type}` | PolicyPage | `policyDocuments.ts` 정적 문서 |
| `POST /user/interests` + `isTermsAgreed` | CategoryPage (REQ-009) | 로컬 store만 저장 |
| `GET /user/notification-setting` (조회) | MyPage | `/user/me` 응답 내 포함 |

---

## 구현 시 공통 패턴

모든 hooks / 페이지에서 아래 패턴을 일관되게 적용한다.

```ts
import { USE_MOCK_API } from '@/lib/devFlags';

// hooks useEffect 내부
useEffect(() => {
  if (USE_MOCK_API) {
    // --- 기존 setTimeout 목업 로직 (변경 없이 유지) ---
    const timer = setTimeout(() => { /* ... */ }, 400);
    return () => clearTimeout(timer);
  }

  // --- 실 API 호출 ---
  let cancelled = false;
  dispatch({ type: 'FETCH_START' });
  fetchXxx()
    .then((res) => {
      if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: res });
    })
    .catch((err) => {
      if (!cancelled) dispatch({ type: 'FETCH_ERROR', payload: '불러오지 못했습니다.' });
    });
  return () => { cancelled = true; };
}, [deps]);
```

> **Optimistic Update 패턴** (저장/삭제 등 뮤테이션):
> 1. UI 즉시 반영 (dispatch)
> 2. API 호출
> 3. 실패 시 이전 상태로 롤백 + GlobalToast 에러 메시지
