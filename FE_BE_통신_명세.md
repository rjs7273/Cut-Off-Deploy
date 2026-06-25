# FE ↔ BE 통신 명세

> **목적:** Cut-off 프론트엔드와 백엔드 간 주고받을 정보를 방향별로 정리  
> **대상:** BE API 설계 · FE `src/api/` 구현 · QA 테스트 케이스 작성  
> **관련:** `백엔드_연동_가이드.md`(구현 위치·변경 파일), `DataLayer.md`(현재 localStorage 구조)

---

## 읽는 방법

| 섹션 | 의미 |
|------|------|
| **§1 프론트 → 백엔드** | FE가 **호출하는 API**와 **받아야 할 응답** |
| **§2 백엔드 → 프론트** | BE가 FE에게 **보내야 할 데이터** + FE가 **반드시 올려줘야 하는 데이터** |

---

## 공통 규약 (협의 필요)

### Base URL

```
{VITE_API_BASE_URL}/api/v1   ← 예시, BE와 prefix 확정
```

### 인증 헤더 (로그인 이후 대부분의 API)

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### 공통 에러 응답 (권장)

```json
{
  "code": "SUBSCRIPTION_REQUIRED",
  "message": "구독이 필요합니다.",
  "status": 403
}
```

| HTTP | FE 처리 |
|------|---------|
| 401 | 토큰 만료 → refresh 또는 `/login` |
| 403 | 구독 필요 → SubscribeBottomSheet |
| 404 | EmptyState / 토스트 |
| 5xx | `/restricted` 또는 재시도 UI |

### FE에서 서버로 보내지 **않는** 정보 (디바이스 로컬)

| 항목 | 이유 |
|------|------|
| `notificationPermission` (OS 알림 권한) | Capacitor/Web API로만 관리 |
| 테마(light/dark) | `themeStore` 로컬 전용 (추후 동기화 시 별도 API) |

---

# §1. 프론트 → 백엔드

> 프론트가 **백엔드에 요청**하는 API 목록.  
> “언제 · 어떤 화면에서 · 무엇을 받고 싶은지” 기준.

---

## 1-1. 인증 · 세션

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| A1 | POST | `/auth/google` | Google 로그인 (`LoginPage`, `LoginUpsellBottomSheet`) | `accessToken`, `refreshToken`, `user`(아래 Me 스키마) |
| A2 | POST | `/auth/apple` | Apple 로그인 (동일) | A1과 동일 |
| A3 | POST | `/auth/refresh` | accessToken 만료 시 (axios interceptor) | `{ accessToken, refreshToken? }` |
| A4 | POST | `/auth/logout` | 마이페이지 로그아웃 (`authStore.logout`) | `{ success: true }` |
| A5 | DELETE | `/auth/withdraw` | 마이페이지 탈퇴 확인 | `{ success: true }` |
| A6 | GET | `/user/me` | Splash, 앱 기동, 포그라운드 복귀 | **§2-1 MeResponse** |

**Splash 라우팅에 필요한 필드 (`GET /user/me`):**

- `onboardingDone: boolean` — `false` → `/onboard`, `true` → `/home`
- `isLoggedIn` 대신 **토큰 유무 + me 200** 으로 판단

---

## 1-2. 관심사 (카테고리 설정)

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| B1 | GET | `/categories` | (선택) 온보딩·관심사 변경 — 현재는 FE 정적 `categoryList.ts` | 대분류·소분류 트리 |
| B2 | PATCH | `/user/interests` | `CategoryPage` 완료, `CategoryEditPage` 저장 | `{ categories: SelectedCategory[] }` |

```typescript
// SelectedCategory — FE 타입 (요청·응답 공통)
interface SelectedCategory {
  bigCategory: string;      // 예: "비즈니스"
  subCategories: string[];  // 예: ["브랜딩", "마케팅"]
}
```

---

## 1-3. 홈 · 추천

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| C1 | GET | `/recommendations/today` | `HomePage` 진입 (`useHome`) | `{ pick: VideoCard, others: VideoCard[] }` |
| C2 | POST | `/recommendations/{videoId}/skip` | 홈 “오늘은 안 볼래요” / Other 스킵 | `{ success: true }` |
| C3 | DELETE | `/recommendations/{videoId}/skip` | 스킵 취소(restore) | `{ success: true }` |

**VideoCard (FE `HomeVideo` / `VideoDetail` 호환):**

```typescript
interface VideoCard {
  id: string;
  title: string;
  channel: string;
  duration: string;           // "18:42"
  durationLabel?: string;     // "18분 42초" — 없으면 FE 계산
  category: string;
  editorComment: string;
  summary: string;
  discoveryNote?: string;
  thumbnailUrl?: string;      // 없으면 FE gradient fallback
  youtubeUrl?: string;        // 영상 보기용
  isSaved?: boolean;          // 로그인 시 포함 권장
}
```

---

## 1-4. 카테고리 목록 (Catlist)

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| D1 | GET | `/categories/{group}/videos` | `CategoryListPage` (`useCategoryList`) | `{ meta, items[] }` |

**Query**

| Param | 예시 | 설명 |
|-------|------|------|
| `filter` | `전체`, `브랜딩` | 소분류 필터 |

**응답 `items[]` (FE `CategoryItem`):**

```typescript
{
  id: string;
  title: string;
  channel: string;
  duration: string;
  category: string;           // 소분류명
  group: string;              // 대분류명
  editorComment: string;
  thumbnailGradient?: string;
  isSaved?: boolean;
}
```

**`meta`:** `{ name, desc, filters: string[] }`

---

## 1-5. 저장 · 폴더

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| E1 | GET | `/saved` | `SavedPage` 진입·폴더 탭 전환 (`useSavedVideos`) | `{ items: SavedVideo[], folders: Folder[] }` |
| E2 | POST | `/saved/{videoId}` | 하트 저장 (`saveVideo.ts`, `SaveFolderBottomSheet`) | `{ savedAt: string, folderId?: string }` |
| E3 | DELETE | `/saved/{videoId}` | 저장 해제 (모든 화면 공통) | `{ success: true }` |
| E4 | GET | `/folders` | (E1에 포함 가능) 사용자 폴더만 | `FolderEntry[]` |
| E5 | POST | `/folders` | 폴더 생성 (`SavedPage`, `SaveFolderBottomSheet`) | `FolderEntry` |

**저장 비즈니스 규칙 (FE·BE 동일 적용):**

1. 저장 시 **전역 저장 목록**에 항상 포함 (`folder_all` / 전체 탭)
2. 사용자 폴더 선택 시 해당 폴더에도 추가
3. 저장 해제 시 **전역 + 모든 폴더**에서 제거

```typescript
// FolderEntry (BE 영속 모델)
interface FolderEntry {
  id: string;
  name: string;
  createdAt: string;    // ISO 8601
  videoIds: string[];
}

// GET /saved items[] (FE SavedVideo)
interface SavedVideo {
  id: string;             // FE: "saved_{videoId}" 또는 BE가 부여
  video: VideoCard;
  savedAt: string;        // "2025.04.28"
  folderIds: string[];    // 사용자 폴더 ID 목록
  isSaved: boolean;
}

// Folder (탭 UI용)
interface Folder {
  id: string;
  name: string;
  count: number;
}
```

> `folder_all`은 FE reserved ID. BE에서 시스템 폴더로 매핑하거나 E1 응답에 `isSystem: true` 폴더 포함.

**E2 Body:**

```json
{ "folderId": "folder_abc" }
```

`folderId` 생략 또는 `folder_all` → 전체(전역) 저장만.

---

## 1-6. 시청 기록

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| F1 | GET | `/history` | `HistoryPage` (`useWatchHistory`) | `{ groups: WatchHistoryGroup[] }` |
| F2 | POST | `/history` | `VideoDetailBottomSheet` 열릴 때 | `{ id: string, watchedAt: string }` |
| F3 | DELETE | `/history/{entryId}` | 시청 기록 제거 | `{ success: true }` |
| F4 | DELETE | `/history` | (추후) 전체 삭제 | `{ success: true }` |

```typescript
interface WatchHistoryGroup {
  label: string;              // "오늘", "어제", "2025년 4월 26일"
  items: {
    id: string;               // "hist_{videoId}" 또는 BE entry id
    video: VideoCard;
    watchedAt: string;          // 표시용 "오늘 08:14"
    isSaved: boolean;
  }[];
}
```

**F2 Body:**

```json
{ "videoId": "vid_001" }
```

---

## 1-7. 알림 설정

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| G1 | GET | `/user/notification-setting` | (선택) Me에 포함 가능 | `{ enabled: boolean }` |
| G2 | PATCH | `/user/notification-setting` | `NotificationPage`, `MyPage` 토글 | `{ enabled: boolean }` |

> OS 푸시 **권한** 상태는 FE 로컬. **수신 동의 ON/OFF**만 서버 동기화.

---

## 1-8. 구독

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| H1 | GET | `/subscription` | 앱 포그라운드 복귀, 마이페이지 | `{ isSubscribed, subscribedAt, plan? }` |
| H2 | POST | `/subscription/start` | `SubscribeBottomSheet` IAP 성공 후 | `{ isSubscribed: true, subscribedAt: ISO }` |
| H3 | POST | `/subscription/cancel` | `UnsubscribeBottomSheet` | `{ isSubscribed: false }` |

---

## 1-9. 영상 재생

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| I1 | GET | `/videos/{videoId}` | “영상 보기” (`Home`, `Saved`, `History`, `Catlist`) | `{ youtubeUrl: string, ...VideoCard }` |

---

## 1-10. 기타

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| J1 | POST | `/feedback` | `FeedbackPage` 제출 | `{ success: true }` |
| J2 | GET | `/policy/{type}` | `PolicyPage` (`terms` \| `privacy`) | `{ title, content, updatedAt }` |

**J1 Body (FE `FeedbackPayload`):**

```json
{
  "type": "개선 제안",
  "text": "내용...",
  "email": "user@example.com"
}
```

`type` enum: `개선 제안` | `버그 신고` | `콘텐츠 문의` | `기타`

---

## 1-11. 프론트 → 백엔드 요청 우선순위 (MVP)

| 순위 | API | 이유 |
|------|-----|------|
| P0 | A1/A2, A6 | 로그인·라우팅 전제 |
| P0 | C1 | 홈 핵심 |
| P0 | E1, E2, E3, E5 | 저장 핵심 플로우 |
| P1 | B2, D1 | 온보딩·카테고리 |
| P1 | F1, F2, F3 | 시청 기록 |
| P1 | G2 | 알림 설정 |
| P2 | H2, H3 | 구독·IAP |
| P2 | C2, I1 | 스킵·재생 |
| P3 | J1, J2 | 부가 기능 |

---

# §2. 백엔드 → 프론트

> 백엔드 관점에서 프론트와 주고받는 정보.  
> **2-A:** BE가 FE에게 **내려주는(전달)** 데이터  
> **2-B:** BE가 FE에게 **올려달라고 요구**하는 데이터

---

## 2-A. 백엔드 → 프론트 **전달** 정보

### 2-A-1. 로그인 응답 (`POST /auth/*`)

```typescript
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;          // seconds
  user: MeResponse;
}
```

FE 처리: 토큰 secure storage 저장 → `authStore.setLoggedIn(true, user.userInfo)`

---

### 2-A-2. 사용자 통합 프로필 (`GET /user/me`)

```typescript
interface MeResponse {
  userInfo: {
    userId: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
    joinedAt: string;         // ISO 8601
  };
  subscription: {
    isSubscribed: boolean;
    subscribedAt: string | null;
    plan?: string;
  };
  interests: SelectedCategory[];
  notificationEnabled: boolean;
  onboardingDone: boolean;
  // 선택: 아래를 me 한 번에 내려주면 초기 로드 API 절약
  savedSummary?: { count: number };
}
```

**FE 반영 위치:** `authStore`, `storage` hydrate, `Drawer` 프로필, tier 게이팅

---

### 2-A-3. 목록·상세 응답

| API | BE → FE 전달 핵심 필드 |
|-----|------------------------|
| `GET /recommendations/today` | `pick`, `others[]` — VideoCard |
| `GET /categories/{group}/videos` | `items[]`, `meta`, 각 item `isSaved` |
| `GET /saved` | `items[]`(SavedVideo), `folders[]`(count 포함) |
| `GET /history` | `groups[]` — 날짜별 그룹 + `isSaved` |
| `GET /videos/{id}` | `youtubeUrl`, VideoCard 필드 |
| `GET /policy/{type}` | HTML/Markdown `content` |

---

### 2-A-4. 변경·생성 응답

| API | BE → FE 전달 |
|-----|--------------|
| `POST /saved/{videoId}` | `savedAt`, 적용된 `folderId` |
| `POST /folders` | `{ id, name, createdAt, videoIds: [] }` |
| `PATCH /user/interests` | 저장된 `categories[]` |
| `PATCH /user/notification-setting` | `{ enabled: boolean }` |
| `POST /subscription/start` | `{ subscribedAt, isSubscribed: true }` |

---

### 2-A-5. 푸시 알림 (서버 → 디바이스 → FE)

Capacitor `@capacitor/push-notifications` 수신 시 FE가 기대하는 payload:

```typescript
interface PushPayload {
  title: string;
  body: string;
  data?: {
    type: 'daily_pick';       // 확장 가능
    route?: '/home';
    videoId?: string;
  };
}
```

| `data.type` | FE 동작 |
|-------------|---------|
| `daily_pick` | `/home` 이동 (또는 영상 상세) |

> FCM/APNs 등록·토큰 관리는 BE. FE는 토큰을 **§2-B-6** 에 따라 PATCH.

---

### 2-A-6. 에러·상태 코드 → FE UX

| code (예시) | FE UX |
|-------------|-------|
| `SUBSCRIPTION_REQUIRED` | CategoryList 잠금 → SubscribeBottomSheet |
| `UNAUTHORIZED` | 로그인 유도 |
| `RATE_LIMITED` | 토스트 |
| 네트워크 타임아웃 | `/restricted` |

---

## 2-B. 백엔드 → 프론트 **요구** 정보

> “API를 처리하려면 프론트가 **반드시 보내줘야 하는** 정보”

---

### 2-B-1. 공통 (인증 필요 API)

| 항목 | 위치 | 설명 |
|------|------|------|
| `Authorization: Bearer {accessToken}` | Header | 로그인 후 모든 개인화 API |
| `Accept-Language` | Header | (선택) `ko-KR` |
| `X-App-Version` | Header | (선택) 앱 버전 |
| `X-Platform` | Header | (선택) `ios` \| `android` \| `web` |

---

### 2-B-2. 소셜 로그인 (`POST /auth/google`, `/auth/apple`)

| 항목 | Body | BE 처리 |
|------|------|---------|
| Google | `{ idToken: string }` | Google token verify → user 생성/조회 |
| Apple | `{ identityToken: string, authorizationCode?: string }` | Apple verify |
| (선택) | `{ marketingAgreed: boolean }` | 마케팅 수신 동의 |
| (선택) | `{ deviceId: string }` | 기기 식별 |

**FE가 OAuth SDK에서 받아 BE로 전달.** FE는 idToken 원문만 전송, 비밀키는 BE만 보관.

---

### 2-B-3. 토큰 갱신 (`POST /auth/refresh`)

```json
{ "refreshToken": "..." }
```

---

### 2-B-4. 관심사 (`PATCH /user/interests`)

```json
{
  "categories": [
    { "bigCategory": "비즈니스", "subCategories": ["브랜딩", "마케팅"] }
  ]
}
```

**검증 (BE):** 온보딩 최소 1개, 구독 직후 모드 최소 3개 등 — FE와 동일 규칙 문서화.

---

### 2-B-5. 저장 (`POST /saved/{videoId}`)

```json
{
  "folderId": "folder_xyz"
}
```

| folderId | 의미 |
|----------|------|
| 생략 / `folder_all` | 전역 저장만 |
| 사용자 폴더 ID | 전역 + 해당 폴더 |

**DELETE** `/saved/{videoId}` — Body 없음, Path만.

---

### 2-B-6. 알림 (`PATCH /user/notification-setting`)

```json
{
  "enabled": true,
  "fcmToken": "..." 
}
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `enabled` | O | 앱 알림 수신 동의 |
| `fcmToken` | enabled=true 시 | 푸시 등록·갱신 |
| `platform` | (선택) | `ios` \| `android` |

OS 권한 denied 여부는 FE가 보내지 않음 — enabled=false면 BE는 푸시 미발송.

---

### 2-B-7. 구독 (`POST /subscription/start`)

```json
{
  "platform": "ios",
  "receipt": "...",
  "productId": "cutoff.monthly"
}
```

| platform | receipt 필드 |
|----------|--------------|
| `ios` | App Store receipt (base64) |
| `android` | Google purchaseToken |

BE: 스토어 서버 검증 후 `isSubscribed`, `subscribedAt` DB 반영 → 응답.

---

### 2-B-8. 시청 기록 (`POST /history`)

```json
{ "videoId": "vid_001" }
```

FE: `VideoDetailBottomSheet` open 시 1회 (debounce 권장).  
BE: `watchedDate`, `watchedTime` 서버 시각 기준 생성.

---

### 2-B-9. 추천 스킵 (`POST /recommendations/{videoId}/skip`)

```json
{
  "reason": "not_interested",
  "scope": "pick"
}
```

| scope | FE 출처 |
|-------|---------|
| `pick` | 오늘의 픽 |
| `other` | Other 섹션 |

`reason` — (선택) FE `skipReasons.ts` 값 연동.

---

### 2-B-10. 의견 (`POST /feedback`)

```json
{
  "type": "버그 신고",
  "text": "재현 방법...",
  "email": "optional@email.com"
}
```

로그인 사용자: BE가 `userId`를 토큰에서 추출, email 생략 가능.

---

### 2-B-11. 로그아웃 · 탈퇴

| API | FE → BE |
|-----|---------|
| `POST /auth/logout` | Header Bearer (refresh 무효화) |
| `DELETE /auth/withdraw` | Header Bearer, (선택) `{ reason: string }` |

로그아웃 시 FE는 **로컬 개인 데이터 초기화** (`authStore.logout` 정책).  
데이터 영속은 BE DB가 담당 (현재 `mockServer.syncBeforeLogout` 역할).

---

## 2-C. BE ↔ FE 데이터 소유권

| 데이터 | Source of Truth | FE 로컬 캐시 |
|--------|-----------------|--------------|
| 사용자 프로필 | BE | authStore + (선택) storage |
| 구독 상태 | BE | authStore |
| 관심사 | BE | storage (오프라인 fallback optional) |
| 저장·폴더 | BE | React Query cache |
| 시청 기록 | BE | React Query cache |
| 알림 enabled | BE | storage 동기 |
| 알림 OS permission | **FE only** | storage |
| access/refresh token | BE 발급 | secure storage |
| 온보딩 UI 플래그 | BE `onboardingDone` | `co_is_first_entry` (과도기) |
| 테마 | FE only | themeStore |

---

## 부록 A. 화면 ↔ API 매트릭스

| 화면 | Route | FE→BE (요청) | BE→FE (전달·요구) |
|------|-------|--------------|-------------------|
| Splash | `/splash` | A6 | MeResponse → 라우팅 |
| Login | `/login` | A1/A2 | AuthResponse |
| Category | `/category` | B2 | categories 저장 결과 |
| Notification | `/notification` | G2 | enabled |
| Home | `/home` | C1, C2, E2/E3, F2, I1 | pick/others, isSaved |
| Catlist | `/catlist` | D1, E2/E3, F2 | items, tier |
| Saved | `/saved` | E1, E2/E3, E5 | items, folders |
| History | `/history` | F1, F3, E2/E3 | groups |
| MyPage | `/mypage` | G2, A4, A5 | Me, subscription |
| CategoryEdit | `/category-edit` | B2 | categories |
| Feedback | `/feedback` | J1 | success |
| Policy | `/terms` | J2 | content |

---

## 부록 B. 현재 목업 → API 매핑

| 현재 (FE 목업) | 교체 API |
|----------------|----------|
| `mockServer.login` | A1/A2 |
| `mockServer.syncBeforeLogout` | A4 (+ BE DB 영속) |
| `mockServer.updateRecord` | H2 |
| `storage.savedVideoIds` | E1/E2/E3 |
| `storage.folders` | E1/E4/E5 |
| `storage.watchedVideoIds` | F1/F2/F3 |
| `storage.selectedCategories` | B2, A6.interests |
| `storage.notificationEnabled` | G2 |
| `VIDEO_LIST` + `useHome` shuffle | C1 |
| `VIDEO_LIST` + `useCategoryList` | D1 |

---

## 부록 C. 문서 이력

| 문서 | 역할 |
|------|------|
| **본 문서** | FE�BE **무엇을** 주고받는지 (계약) |
| `백엔드_연동_가이드.md` | FE 코드 **어디를** 고치는지 (구현) |
| `전체_프로세스.md` | Phase별 일정·체크리스트 |

BE OpenAPI 초안 확정 후 본 문서의 Path·필드명을 Swagger와 1:1 동기화할 것.
