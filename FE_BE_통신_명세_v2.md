# FE ↔ BE 통신 명세 (v2)

> **작성일:** 2026-06-23 · **개정:** 2026-06-25 (VideoCard·폴더·Policy 계약 정리)  
> **근거 코드:** `back-end/src/routes/*.ts`, `back-end/src/index.ts`, `back-end/src/types/index.ts`  
> **대상:** FE `src/api/` 구현 · BE API 확장 · QA 테스트 케이스  
> **관련:** `FE_BE_통신_명세.md`(구버전), `markdown/DataLayer.md`, `markdown/전체_프로세스.md`

---

## 읽는 방법

| 섹션 | 의미 |
|------|------|
| **§0 구현 현황** | 백엔드에 **실제 존재하는** 라우트 vs **미구현** API |
| **§1 프론트 → 백엔드** | FE가 호출하는 API · 요청 Body · 기대 응답 |
| **§2 백엔드 → 프론트** | BE가 내려주는 스키마 · FE가 올려야 하는 필수값 |
| **부록** | 화면 매트릭스 · 카테고리 ID · localStorage 매핑 |

---

## §0. 구현 현황 요약

### Base URL (현재 서버 기준)

```
http://localhost:105          ← 기본 PORT (back-end/src/index.ts)
```

| 환경 | Base URL | 비고 |
|------|----------|------|
| 로컬 개발 | `http://localhost:105` | `npm run dev` |
| FE env (권장) | `{VITE_API_BASE_URL}` | 예: `http://localhost:105` |

> **주의:** 라우트 파일 주석에는 `/api/v1/...` 로 기재되어 있으나, **실제 마운트 prefix 는 `/test`** 입니다.  
> 프로덕션 전환 시 `index.ts` 의 prefix 를 `/api/v1` 등으로 통일할 것.

### FE 1단계 구조 정렬 (2026-06-23)

| 항목 | FE 위치 | BE 대응 |
|------|---------|---------|
| 영상 타입 | `types/video.ts` → `VideoCard` | `back-end/src/types/index.ts` VideoCard |
| 홈 UI 확장 | `types/home.ts` → `HomeVideo` (optional `date`) | BE 미제공 필드 |
| 인증·유저 | `types/auth.ts` → `MeResponse`, `AuthTokenResponse` | auth/user routes |
| 관심사 ID | `data/categoryList.ts` → `BeCategoryId` + `CATEGORY_LABELS` | PATCH body `subCategories` |
| API 클라이언트 | `lib/apiClient.ts` (`{VITE_API_BASE_URL}/test`) | §0 Base URL |
| API 모듈 | `src/api/auth.ts`, `user.ts`, `saved.ts`, `history.ts`, `recommendations.ts`, `feedback.ts`, `subscription.ts`, `categories.ts` | §1 endpoints |
| 구독 tier | `types/userTier.ts` → `'guest' \| 'free' \| 'subscribed'` | `MeResponse.subscription.plan` |
| 썸네일 표시 | `data/utils.ts` → `thumbnailBackground()` | URL 없을 때 CSS gradient fallback |

**하지 않는 것 (1단계):** `types/api/*` 별도 패키지, `lib/categoryMap.ts`, `lib/mappers/*`, Catlist BE 연동, REQ-009 API.  
**Policy는 FE `PolicyPage` 하드코딩 — BE API 없음 (의도적).**

**2단계 완료 (2026-06-23):** hooks·화면 → `src/api/services/*` 경유. Mock/API 전환은 `VITE_USE_MOCK_API` 환경변수만 참조.

### Mock / API 전역 스위치 (2단계)

| 소스 | 값 |
|------|-----|
| `VITE_USE_MOCK_API` | 미설정 또는 `'true'` → mock, `'false'` → BE 실 HTTP |

```bash
# .env.local 예시
VITE_API_BASE_URL=http://localhost:105
VITE_USE_MOCK_API=false
VITE_DEV_ID_TOKEN=dev-web-token   # API 모드 웹 dev용 OAuth 대체
```

**아키텍처:** hooks/pages → `api/services/*` → `useMockApi()` 분기 → `api/mocks/*` 또는 `api/*.ts`

| service | mock | api |
|---------|------|-----|
| `services/auth` | `mocks/authMock` + store | `auth.ts` + `fetchMe` |
| `services/recommendations` | `mockCatalog` + `TODAYS_PICK` | `GET /recommendations/today` |
| `services/saved` / `history` | zustand store | `GET/POST/DELETE /folders`, `/saved` |
| `services/user` | store만 | `PATCH /user/interests`, `/notification-setting` |
| Catlist (`useCategoryList`) | `mockCatalog` | `GET /categories/{group}/videos` (BE I1 대기) |
| `services/subscription` | store mock | RevenueCat SDK 구매/복원 + `GET /subscription` |

**QA 체크리스트**

- [ ] mock 모드: 로그인·홈·저장·기록 UI 기존과 동일
- [ ] `VITE_USE_MOCK_API=false` + BE 실행: Splash `fetchMe`, 홈 today, 저장 CRUD
- [ ] `.env.local`의 `VITE_USE_MOCK_API` 값 변경 후 dev server 재시작으로 mock ↔ api 전환

**3단계 추가 (2026-06-25):**

- `POST /subscription/start`는 FE 호출 대상이 아니다. 구매/복원은 RevenueCat Capacitor SDK가 처리하고, BE는 RevenueCat webhook으로 `subscriptions` 상태를 갱신한다.
- FE는 구매 완료 직후와 앱 시작/foreground 복귀 시 `GET /subscription`을 재조회해 `authStore.isSubscribed`, `plan`, `subscribedAt`을 갱신한다.
- 알림 허용 시 `PATCH /user/notification-setting`에 `{ alarmAgreed: true, fcmToken, deviceType }`을 전송한다.
- `VideoCard.id`는 **YouTube가 부여한 영상 ID**이다. FE는 `https://www.youtube.com/watch?v={id}` · `https://www.youtube.com/embed/{id}` 를 **로컬에서 조합**한다. BE는 `youtubeUrl` 필드를 내려주지 않는다.
- YouTube 시청은 `YoutubePlayer` iframe(`embed/{id}`)으로 시도하고, 임베드 제한 시 외부 YouTube 열기 fallback을 제공한다.

```ts
// back-end/src/index.ts — 현재 등록
app.use('/test/auth',            authRouter);
app.use('/test/user',            userRouter);
app.use('/test/recommendations', recommendationsRouter);
app.use('/test/saved',           savedRouter);
app.use('/test/history',         historyRouter);
app.use('/test/feedback',        feedbackRouter);
app.use('/test/subscription',    subscriptionRouter);  // ← 신규
```

### 인증 없이 호출 가능

| Method | Path |
|--------|------|
| GET | `/` |
| GET | `/health` |
| POST | `/test/auth/google` |
| POST | `/test/auth/apple` |
| POST | `/test/auth/refresh` |
| POST | `/test/subscription/webhook` | RevenueCat 전용 (Bearer `REVENUECAT_WEBHOOK_SECRET`) |

### FE 연동 대상 — 구현 완료 / 개정 필요

| 도메인 | Method | Path | 인증 | BE 상태 |
|--------|--------|------|------|---------|
| Auth | POST | `/test/auth/google` | ✗ | ✅ |
| Auth | POST | `/test/auth/apple` | ✗ | ✅ |
| Auth | POST | `/test/auth/refresh` | ✗ | ✅ |
| Auth | POST | `/test/auth/logout` | ✓ | ✅ |
| Auth | DELETE | `/test/auth/withdraw` | ✓ | ✅ |
| User | GET | `/test/user/me` | ✓ | ✅ |
| User | PATCH | `/test/user/interests` | ✓ | ✅ |
| User | PATCH | `/test/user/notification-setting` | ✓ | ✅ |
| Recommendations | GET | `/test/recommendations/today` | ✓ | ✅ |
| Recommendations | POST | `/test/recommendations/:videoId/skip` | ✓ | ✅ |
| Recommendations | DELETE | `/test/recommendations/:videoId/skip` | ✓ | ✅ |
| Folders | GET | `/test/folders` | ✓ | ❌ (현재 `GET /saved`에 포함) |
| Folders | POST | `/test/folders` | ✓ | ⚠️ (`POST /saved/folders` → 경로 변경 필요) |
| Folders | DELETE | `/test/folders/:folderId` | ✓ | ❌ |
| Folders | GET | `/test/folders/:folderId/videos` | ✓ | ❌ (현재 `GET /saved` 일괄) |
| Saved | POST | `/test/saved/:videoId` | ✓ | ✅ |
| Saved | DELETE | `/test/saved/:videoId` | ✓ | ✅ |
| History | GET | `/test/history` | ✓ | ✅ |
| History | POST | `/test/history` | ✓ | ✅ |
| History | DELETE | `/test/history/:entryId` | ✓ | ✅ |
| Feedback | POST | `/test/feedback` | ✓ | ✅ |
| Subscription | GET | `/test/subscription` | ✓ | ✅ |
| Subscription | POST | `/test/subscription/cancel` | ✓ | ✅ |

### BE 전용 (FE 호출 없음)

| Method | Path | 설명 |
|--------|------|------|
| POST | `/test/subscription/webhook` | RevenueCat Webhook → `users.tier` · `subscriptions` · `payment_histories` 갱신 |

### 미구현 · FE 전용 (BE 불필요)

| Method | Path (예정) | 비고 |
|--------|-------------|------|
| GET | `/categories` | FE `src/data/categoryList.ts` 정적 사용 |
| GET | `/categories/{group}/videos` | Catlist — BE 라우트 없음 (I1) |
| GET | `/user/notification-setting` | 조회는 `GET /user/me` 의 `notificationEnabled` 사용 |
| POST | `/subscription/start` | **IAP는 RevenueCat SDK + Webhook** 으로 처리 (직접 receipt API 없음) |
| DELETE | `/history` (전체) | 단건 삭제만 구현 |
| — | 약관 동의 이력 (`is_terms_agreed`) | REQ-009 — 스키마·API 미정 |

**FE 전용 — API 없음 (의도적):**

| 항목 | FE 처리 |
|------|---------|
| **Policy** (`/terms`, `/privacy`) | `PolicyPage` + `data/policyDocuments.ts` **하드코딩**. BE/CMS API 없음 |
| **YouTube URL** | `VideoCard.id`(YouTube ID)로 FE가 watch/embed URL 조합. `GET /videos/{id}` 불필요 |

### v1 대비 변경 요약 (back-end origin pull)

| 항목 | 변경 내용 |
|------|----------|
| **Subscription** | `GET /subscription`, `POST /subscription/cancel`, `POST /subscription/webhook` 추가 |
| **Notification** | `PATCH /user/notification-setting` 추가 (`alarmAgreed`, `fcmToken`, `deviceType`) |
| **Auth upsert** | 재로그인 시 기존 `tier`, `alarm_agreed`, `marketing_agreed` **유지** (덮어쓰지 않음) |
| **구독 결제** | FE → BE receipt API 없음. RevenueCat → Webhook → `users.tier` 갱신 |

---

## 공통 규약

### 인증 헤더 (로그인 이후 API)

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Supabase access token 을 Bearer 로 전달. (`authMiddleware` → `supabaseAdmin.auth.getUser(token)`)

### 공통 에러 응답

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired access token."
}
```

| HTTP | code (예) | FE 처리 |
|------|-----------|---------|
| 400 | `BAD_REQUEST` | 폼 검증 / 토스트 |
| 401 | `UNAUTHORIZED`, `AUTH_FAILED` | refresh → 실패 시 `/login` 또는 SessionExpiredModal |
| 404 | `NO_RECOMMENDATIONS`, `FOLDER_NOT_FOUND` | EmptyState / 토스트 |
| 500 | `INTERNAL_SERVER_ERROR` | `/restricted` 또는 재시도 |

### FE에서 서버로 보내지 **않는** 정보

| 항목 | 이유 |
|------|------|
| OS 알림 **권한** 상태 (granted/denied) | Capacitor 로컬 |
| 테마 (light/dark) | `themeStore` 로컬 |
| IAP receipt (직접) | RevenueCat SDK → Webhook 경로 |

---

# §1. 프론트 → 백엔드

> **실제 Path** = `/test` + 아래 Path  
> 예: `POST /test/auth/google`

---

## 1-1. 인증 · 세션

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| A1 | POST | `/auth/google` | `LoginPage`, `LoginUpsellBottomSheet` | **AuthTokenResponse** |
| A2 | POST | `/auth/apple` | 동일 | A1과 동일 |
| A3 | POST | `/auth/refresh` | axios interceptor | `{ accessToken, refreshToken, expiresAt }` |
| A4 | POST | `/auth/logout` | `MyPage` 로그아웃 | `{ success: true, message }` |
| A5 | DELETE | `/auth/withdraw` | `MyPage` 탈퇴 확인 | `{ success: true, message }` |
| A6 | GET | `/user/me` | Splash, 앱 기동, 포그라운드 복귀 | **MeResponse** |

### A1 / A2 — 소셜 로그인

**Google Request**

```json
{ "idToken": "<Google OAuth idToken>" }
```

**Apple Request**

```json
{ "identityToken": "<Apple identityToken>" }
```

**Response 200** — `AuthTokenResponse`

```typescript
interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | undefined;
  user: {
    userId: string;
    email: string | undefined;
    nickname: string;
    profileImageUrl: string;
  };
}
```

**BE 부가 처리 (`upsertUserProfile`):**

- 신규: `tier: 'FREE'`, `alarm_agreed: false`, `marketing_agreed: false`
- **재로그인: 기존 `tier`, `alarm_agreed`, `marketing_agreed` 유지** (프로필명·이미지만 갱신)

### A3 — 토큰 갱신

```json
{ "refreshToken": "..." }
```

→ `{ accessToken, refreshToken, expiresAt }` (user 객체 없음)

### A4 / A5 — 로그아웃 · 탈퇴

- Bearer 필수
- A5: `users` 삭제 + Supabase Auth 계정 삭제 (cascade)

---

## 1-2. 사용자 프로필 · 관심사 · 알림

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| B1 | GET | `/user/me` | Splash, Drawer, tier 게이팅 | **MeResponse** |
| B2 | PATCH | `/user/interests` | `CategoryPage`, `CategoryEditPage` | `{ success, categories }` |
| B3 | PATCH | `/user/notification-setting` | `NotificationPage`, `MyPage` 토글 | `{ success, alarmAgreed, fcmToken? }` |

### B1 — MeResponse

```typescript
interface MeResponse {
  userInfo: {
    userId: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
    joinedAt: string;
  };
  subscription: {
    isSubscribed: boolean;    // tier === 'PREMIUM'
    subscribedAt: string;     // ⚠️ 현재 users.created_at (구독일 아님)
    plan: 'FREE' | 'PREMIUM';
  };
  interests: SelectedCategory[];
  notificationEnabled: boolean;  // users.alarm_agreed
  onboardingDone: boolean;       // 관심사 ≥ 1
}
```

**Splash 라우팅**

| 조건 | FE 이동 |
|------|---------|
| 토큰 없음 | `/login` 또는 게스트 플로우 |
| `onboardingDone === false` | `/category` |
| `notificationEnabled === false` (최초) | `/notification` |
| 설정 완료 | `/home` |

> 구독 상세(만료일·자동갱신)는 **`GET /subscription`** 별도 호출.

### B2 — 관심사 저장

```json
{
  "categories": [
    { "bigCategory": "비즈니스", "subCategories": ["branding", "marketing"] }
  ]
}
```

→ `{ "success": true, "categories": [ /* 동일 */ ] }`

> `subCategories` 는 **영문 DB 컬럼명** (부록 D). 한글 라벨 그대로 보내면 매칭 실패.

**미구현 (REQ-009):** `isTermsAgreed`, `termsAgreedAt`

### B3 — 알림 설정 · FCM 토큰 등록

**Request**

```json
{
  "alarmAgreed": true,
  "fcmToken": "fcm-device-token-...",
  "deviceType": "IOS"
}
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `alarmAgreed` | **O** | 앱 알림 수신 동의 (`users.alarm_agreed`) |
| `fcmToken` | 선택 | 있으면 `push_tokens` upsert |
| `deviceType` | 선택 | `"IOS"` \| `"ANDROID"` \| `"WEB"` |

**Response 200**

```json
{
  "success": true,
  "alarmAgreed": true,
  "fcmToken": "fcm-device-token-..."
}
```

**FE 연동 포인트**

- `NotificationPage` "알림 받기" → OS 권한 허용 후 `alarmAgreed: true` + `fcmToken` 전송
- `MyPage` 토글 OFF → `alarmAgreed: false` (fcmToken 생략 가능)
- 조회 전용 GET 없음 → `GET /user/me` 의 `notificationEnabled` 사용

---

## 1-3. 홈 · 추천

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| C1 | GET | `/recommendations/today` | `HomePage` | `{ pick, others[] }` |
| C2 | POST | `/recommendations/:videoId/skip` | 홈 스킵 | `{ success: true }` |
| C3 | DELETE | `/recommendations/:videoId/skip` | 스킵 복원 | `{ success: true }` |

### VideoCard (공통)

`id`는 **YouTube 영상 ID** (예: `dQw4w9WgXcQ`, FE 목업은 12자리 숫자 문자열).  
BE·FE 모두 `youtubeUrl` 필드를 **포함하지 않는다**. 재생·외부 열기 URL은 FE에서 `id`로 조합한다.

```typescript
interface VideoCard {
  id: string;              // YouTube video ID — watch/embed URL의 유일한 키
  title: string;
  channel: string;
  duration: string;        // "MM:SS"
  category: string;
  summary: string;
  editorComment: string;
  thumbnailUrl: string;
  isSaved: boolean;
}
```

**FE URL 조합 (서버 미전달):**

```typescript
const watchUrl  = `https://www.youtube.com/watch?v=${video.id}`;
const embedUrl  = `https://www.youtube.com/embed/${video.id}`;
```

**C1 에러:** `400 CATEGORIES_REQUIRED` · `404 NO_RECOMMENDATIONS`

**C2 Body (선택):** `{ "reason": "not_interested" }`

---

## 1-4. 저장 · 폴더

저장한 영상 목록은 **폴더 ID 기준 GET**으로 조회한다.  
FE `SavedPage`는 (1) 폴더 탭 목록 → (2) 선택 폴더의 영상 상세 목록 순으로 호출한다.

### 폴더 CRUD

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| D1 | GET | `/folders` | `SavedPage` 진입 | `{ folders: Folder[] }` |
| D2 | POST | `/folders` | 폴더 생성 (`SavedPage`, `SaveFolderBottomSheet`) | **FolderEntry** |
| D3 | DELETE | `/folders/:folderId` | 폴더 삭제 | `{ success: true }` |

```typescript
// Folder — 탭 UI용 (D1)
interface Folder {
  id: string;
  name: string;
  count: number;           // 해당 폴더 내 저장 영상 수
}

// FolderEntry — D2 생성 응답
interface FolderEntry {
  id: string;
  name: string;
  createdAt: string;       // ISO 8601
}
```

**폴더 규칙**

- 시스템 기본 폴더 `"전체"` → FE·BE 공통 ID `"folder_all"` (삭제 불가)
- D3: `folder_all` 삭제 시 `400 BAD_REQUEST`
- 사용자 폴더 삭제 시 폴더 내 영상은 **전역 저장(`folder_all`)에는 유지** (폴더 매핑만 제거)

### 폴더별 저장 영상 조회

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| D4 | GET | `/folders/:folderId/videos` | `SavedPage` 탭·폴더 전환 | `{ items: SavedFolderVideo[] }` |

```typescript
// D4 items[] — 해당 폴더에 속한 영상의 **상세 정보 전체**
interface SavedFolderVideo {
  id: string;              // `saved_{videoId}` 또는 BE entry id
  video: VideoCard;        // title, channel, duration, summary 등 전체
  savedAt: string;         // "2025.04.28"
  isSaved: boolean;        // 항상 true (폴더 조회 컨텍스트)
}
```

**D4 Query:** 없음. `folderId` path만 사용.

| `folderId` | 의미 |
|------------|------|
| `folder_all` | 전역 저장 목록 (모든 저장 영상) |
| `folder_abc` … | 사용자 생성 폴더 |

**FE 흐름**

```
SavedPage mount     → GET /folders
탭/폴더 선택         → GET /folders/{folderId}/videos  → items[].video 로 UI 구성
```

> **⚠️ 현재 BE:** `GET /saved`가 `{ items, folders }`를 **한 번에** 반환하고, `POST /saved/folders`로 폴더를 생성한다.  
> 위 D1~D4 계약으로 **분리·경로 정리** 필요 (`/saved/folders` → `/folders`, 폴더별 GET 신규).

### 영상 저장 · 해제

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| D5 | POST | `/saved/:videoId` | 하트 저장 (모든 화면) | `{ savedAt, folderId }` |
| D6 | DELETE | `/saved/:videoId` | 저장 해제 (모든 화면) | `{ success: true }` |

**D5 Body (선택):**

```json
{ "folderId": "folder_abc" }
```

| `folderId` | 의미 |
|------------|------|
| 생략 / `folder_all` | 전역 저장만 (`folder_all`에 추가) |
| 사용자 폴더 ID | 전역 + 해당 폴더에 동시 추가 |

**저장 비즈니스 규칙 (FE·BE 동일):**

1. 저장 시 **항상** `folder_all`(전체)에 포함
2. `folderId` 지정 시 해당 사용자 폴더에도 추가
3. 저장 해제(D6) 시 **전역 + 모든 폴더**에서 제거

---

## 1-5. 시청 기록

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| E1 | GET | `/history` | `HistoryPage` | `{ groups[] }` |
| E2 | POST | `/history` | 바텀시트 open / 재생 | `{ id, watchedAt }` |
| E3 | DELETE | `/history/:entryId` | 항목 삭제 | `{ success: true }` |

**E2 Request:** `{ "videoId": "..." }`  
**E3 entryId:** `"hist_123"` 또는 `"123"` (fallback: video_id)

---

## 1-6. 피드백

| # | Method | Path | 호출 시점 (FE) | FE가 받고 싶은 응답 |
|---|--------|------|----------------|---------------------|
| F1 | POST | `/feedback` | `FeedbackPage` | `{ success: true }` |

```json
{ "type": "버그 신고", "text": "재현 방법..." }
```

→ `user_feedbacks` (`category`, `content`, `status: 'PENDING'`)

---

## 1-7. 구독 (RevenueCat 연동)

| # | Method | Path | 호출 주체 | FE가 받고 싶은 응답 |
|---|--------|------|----------|---------------------|
| H1 | GET | `/subscription` | FE (마이페이지·포그라운드 복귀) | `{ subscription \| null }` |
| H2 | POST | `/subscription/cancel` | 서버 정책상 필요할 때만 보조 호출 | `{ success, message, data }` |
| H3 | POST | `/subscription/webhook` | **RevenueCat 서버** | `{ success, message }` |

> **`POST /subscription/start` 없음.** 구매는 FE RevenueCat SDK → RevenueCat → BE Webhook.

### H1 — 활성 구독 조회

**Response 200**

```typescript
interface SubscriptionResponse {
  subscription: {
    id: number;
    store: string;              // "APP_STORE" | "PLAY_STORE" 등
    productId: string;
    status: string;             // "ACTIVE"
    currentPeriodStart: string; // ISO 8601
    currentPeriodEnd: string;
    willAutoRenew: boolean;
  } | null;
}
```

- `status: 'ACTIVE'` 최신 1건. 없으면 `subscription: null`
- FE tier: `subscription !== null` 또는 `me.subscription.isSubscribed`

### H2 — 자동 갱신 취소 요청 (보조)

- Phase 3 FE 기본 UX는 RevenueCat `managementURL` 또는 스토어 구독 관리 URL을 여는 방식이다.
- ACTIVE 구독의 `will_auto_renew → false` 처리가 서버 정책상 필요할 때만 보조 호출한다.
- **iOS 정책:** 앱 내 완전 해지 불가 → App Store 구독 관리 화면에서 사용자가 직접 해지한다.

**Response 200**

```json
{
  "success": true,
  "message": "Subscription auto-renew cancellation requested.",
  "data": [ /* 갱신된 subscription rows */ ]
}
```

### H3 — RevenueCat Webhook (FE 미호출)

**인증:** `Authorization: Bearer {REVENUECAT_WEBHOOK_SECRET}` (env 설정 시)

**Body (RevenueCat event):**

```json
{
  "event": {
    "type": "INITIAL_PURCHASE",
    "app_user_id": "<supabase user uuid>",
    "original_transaction_id": "...",
    "product_id": "premium_monthly",
    "purchased_at_ms": 1719123456000,
    "expiration_at_ms": 1721715456000,
    "store": "APP_STORE",
    "price_in_purchased_currency": 4900,
    "currency": "KRW"
  }
}
```

**BE 처리 (`type`별 `users.tier`):**

| event.type | tier | 비고 |
|------------|------|------|
| `INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `UNCANCELLATION` | `PREMIUM` | subscriptions ACTIVE |
| `EXPIRATION`, `BILLING_ISSUE` | `FREE` | |
| `CANCELLATION` | 만료 전 `PREMIUM`, 만료 후 `FREE` | `will_auto_renew: false` |

**FE 구독 플로우 (권장)**

```
1. RevenueCat.purchasePackage()     ← 네이티브 IAP
2. (BE) Webhook 자동 수신            ← tier 갱신
3. GET /user/me 또는 GET /subscription  ← FE 상태 refresh
4. userTier → 'subscribed'           ← tier 게이팅 해제
```

---

## 1-8. 미구현 API (placeholder)

| # | Method | Path | FE 대체 |
|---|--------|------|---------|
| I1 | GET | `/categories/{group}/videos` | `services/categories` mock (`mockCatalog`) |

**FE 전용 (BE API 없음 — 설계상 제외):**

| 항목 | FE 구현 |
|------|---------|
| Policy | `PolicyPage` — `data/policyDocuments.ts` 하드코딩 (`/terms`, `/privacy`) |
| YouTube URL | `VideoCard.id`로 FE 조합 (`YoutubePlayer`, Browser fallback) |

---

## 1-9. MVP 우선순위 (현재 BE 기준)

| 순위 | API | 상태 |
|------|-----|------|
| P0 | A1/A2, A3, A6 | ✅ |
| P0 | C1 | ✅ |
| P0 | D5, D6 (저장 토글) | ✅ |
| P0 | D1~D4 (폴더 CRUD + 폴더별 조회) | ❌ BE 분리·신규 필요 |
| P1 | B2, B3, E1~E3, C2/C3, F1 | ✅ |
| P2 | H1, H2 (+ RevenueCat SDK) | ✅ BE / FE SDK 연동 필요 |
| P2 | I1 (Catlist) | ❌ |
| — | Policy | FE 하드코딩 (API 없음) |

---

# §2. 백엔드 → 프론트

## 2-A. BE → FE **전달** 정보

### tier · 구독 (이중 소스)

| 소스 | 필드 | 용도 |
|------|------|------|
| `GET /user/me` | `subscription.isSubscribed`, `plan` | Splash·게이팅·Drawer |
| `GET /subscription` | `currentPeriodEnd`, `willAutoRenew` | 마이페이지 구독 UI |

### VideoCard · YouTube ID

| 항목 | 규칙 |
|------|------|
| `VideoCard.id` | YouTube 영상 ID. BE·FE 응답에 `youtubeUrl` **미포함** |
| FE 재생 | `embed/{id}` iframe · fallback `watch?v={id}` 외부 열기 |
| 별도 API | `GET /videos/{id}` **없음** — 목록·폴더·기록 API가 `VideoCard` 전체를 포함 |

| BE `users.tier` | FE `UserTier` |
|-----------------|---------------|
| `FREE` | `'free'` |
| `PREMIUM` | `'subscribed'` |
| (비로그인) | `'guest'` |

### 알림

| 소스 | 필드 |
|------|------|
| `GET /user/me` | `notificationEnabled` (= `alarm_agreed`) |
| `PATCH /notification-setting` | 갱신 후 `alarmAgreed` echo |

---

## 2-B. BE → FE **요구** 정보

### B3 — 알림 PATCH

```json
{
  "alarmAgreed": true,
  "fcmToken": "...",
  "deviceType": "IOS"
}
```

### H2 — 구독 취소

- Body 없음, Bearer만

### 소셜 로그인 · 관심사 · 저장 · 스킵

(이전 v2와 동일 — `idToken` / `identityToken`, `categories[]`, `folderId`, `reason`)

약관 동의 — auth Body **미수신** (REQ-009 예정)

---

## 2-C. 데이터 소유권

| 데이터 | Phase 1 (FE) | BE 연동 후 |
|--------|--------------|-----------|
| token | — | A1/A2 + secure storage |
| 프로필·tier | `storage` | A6, H1 |
| 관심사 | `storage.selectedCategories` | B2 |
| 저장·폴더 | `storage` + hooks | D1~D6 |
| 시청·스킵 | `storage` | E1~E3, C2/C3 |
| 알림 enabled | `storage.notificationEnabled` | **B3**, A6 |
| 구독 | `storage.isSubscribed` | **H1**, RevenueCat Webhook |
| Policy | `PolicyPage` + `data/policyDocuments.ts` | **API 없음** (페이지 하드코딩) |

---

# 부록 A. 화면 ↔ API 매트릭스

| 화면 | Route | FE→BE | 비고 |
|------|-------|-------|------|
| Splash | `/splash` | A6 | |
| Login | `/login` | A1, A2 | |
| Category | `/category` | B2 | termsAgreed 미구현 |
| Notification | `/notification` | **B3** | fcmToken + alarmAgreed |
| Home | `/home` | C1~C3, D5/D6, E2 | |
| Catlist | `/catlist` | D5/D6, E2 | I1 미구현 |
| Saved | `/saved` | D1~D6 | D4: 폴더 탭 전환마다 `GET /folders/:id/videos` |
| History | `/history` | E1, E3, D5/D6 | |
| MyPage | `/mypage` | A6, A4, A5, **B3**, **H1**, **H2** | |
| CategoryEdit | `/category-edit` | B2 | |
| Feedback | `/feedback` | F1 | |
| Policy | `/terms`, `/privacy` | — | `policyDocuments.ts` 하드코딩, BE 호출 없음 |
| SubscribeBottomSheet | (overlay) | RevenueCat SDK → H3(webhook) → H1/A6 | |

---

# 부록 B. localStorage → API 매핑

| 현재 FE | 교체 API |
|---------|----------|
| `storage.isLoggedIn` | A1/A2 + token |
| `storage.selectedCategories` | B2, A6.interests |
| `storage.savedVideoIds` | D1~D6 |
| `storage.watchedVideoIds` | E1~E3 |
| `storage.isSubscribed` | **H1**, A6.subscription, Webhook |
| `storage.notificationEnabled` | **B3**, A6.notificationEnabled |
| `storage.isFirstEntry` | A6.onboardingDone + B3 |
| `VIDEO_LIST` + `useHome` | C1 |
| `CATEGORY_LIST` + `useCategoryList` | I1 (미구현) |

---

# 부록 C. 에러 코드

| code | HTTP | 발생 API |
|------|------|----------|
| `BAD_REQUEST` | 400 | Body 검증 |
| `AUTH_FAILED` | 401 | A1/A2/A3 |
| `UNAUTHORIZED` | 401 | Bearer / Webhook secret |
| `CATEGORIES_REQUIRED` | 400 | C1 |
| `NO_RECOMMENDATIONS` | 404 | C1 |
| `FOLDER_NOT_FOUND` | 404 | D4, D5 |
| `INTERNAL_SERVER_ERROR` | 500 | 서버 오류 |

---

# 부록 D. 관심사 subCategory ID 매핑

| UI 라벨 (FE) | BE subCategory ID |
|-------------|-------------------|
| 브랜딩 | `branding` |
| 경영 전략 | `business_strategy` |
| 사업 기획 | `business_planning` |
| 마케팅 | `marketing` |
| 커머스 | `commerce` |
| 테크 | `tech` |
| 리더십 | `leadership` |
| 생산성 | `productivity` |
| 자기계발 | `self_development` |
| 책 리뷰 | `book_review` |
| 인문 | `humanities` |
| 예술 | `art` |
| 공간 | `space` |
| 디자인 | `design` |
| 패션·뷰티 | `fashion_beauty` |
| F&B | `f_and_b` |
| 웰니스 | `wellness` |
| 여행 | `travel` |
| 트렌드 | `trend` |
| 콘텐츠 | `contents` |

---

# 부록 E. 환경 변수 (back-end)

| 변수 | 용도 |
|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 |
| `SUPABASE_SERVICE_KEY` | Admin API |
| `PORT` | 서버 포트 (기본 105) |
| `REVENUECAT_WEBHOOK_SECRET` | H3 Webhook Bearer 검증 (선택) |

---

# 부록 F. 문서 이력

| 문서 | 역할 |
|------|------|
| **본 문서 (v2)** | `back-end/src/routes` 실구현 계약 |
| `FE_BE_통신_명세.md` | 구버전 |
| `markdown/DataLayer.md` | FE data/storage 교체 가이드 |
| `back-end/database.sql` | PostgreSQL 스키마 |

**잔여 동기화:**

1. prefix `/test` → `/api/v1` 통일
2. Catlist API (I1)
3. REQ-009 `isTermsAgreed`
4. `MeResponse.subscription.subscribedAt` → 실제 구독 시작일 반영
5. ~~FE 한글 ↔ BE 영문 category 매핑 유틸~~ → **`data/categoryList.ts` + `getCategoryLabel()` 로 1단계 반영 완료**
6. **VideoCard `youtubeUrl` 제거** — BE `mapVideoToCard` · FE `types/video.ts` 정리
7. **저장 API 분리** — `GET /saved` 폐기 → `GET /folders` + `GET /folders/:folderId/videos`, `POST/DELETE /folders`
