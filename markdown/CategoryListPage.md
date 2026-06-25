# CategoryListPage — 이후 작업 사항

> 컴포넌트 ID: **CMP-CAT-001**  
> 경로: `/catlist?group=비즈니스`  
> 진입: 드로어(Drawer)에서 카테고리 탭 클릭  
> 구현 상태: **목업 완료** (API 연동·구독 플로우 미연동)

---

## 구현 완료 항목

| 파일 | 컴포넌트 ID | 설명 |
|---|---|---|
| `src/types/catlist.ts` | — | `CategoryItem`, `CategoryMeta`, `CategoryGroup` 타입 |
| `src/mocks/catlistData.ts` | — | `CAT_META`, `CATLIST_DATA` (4그룹 29개 항목) |
| `src/hooks/useCategoryList.ts` | CMP-LOGIC-002 | 그룹 필터링, 로딩 시뮬레이션 (`useReducer`) |
| `src/components/category/CategoryFilterChips.tsx` | CMP-CAT-002 | 가로 스크롤 필터 칩 |
| `src/components/category/CategoryVideoItem.tsx` | CMP-CAT-004 | 단일 영상 항목 (썸네일+정보) |
| `src/components/category/CategoryVideoList.tsx` | CMP-CAT-003 | 영상 목록 (블러 상태 포함) |
| `src/components/category/CategoryLockOverlay.tsx` | CMP-CAT-005 | 비구독 잠금 오버레이 |
| `src/pages/CategoryListPage.tsx` | CMP-CAT-001 | 메인 페이지 |

### 화면 구성

```
AppHeader (variant="home")   ← 드로어 ☰ | Cut-off 로고 | 알림 🔔
─────────────────────────────────────────
catlist-header
  h1   카테고리명 (그룹명)          22px / 700 / tracking -0.5px
  p    설명 텍스트                  13px / fg-muted / lh 1.5
  CategoryFilterChips               가로 스크롤 필터 칩
─────────────────────────────────────────
catlist-items-wrap  (relative)
  CategoryVideoList                 블러 처리 (비구독 시)
    └── CategoryVideoItem × N       썸네일 100×56 + 제목 + 채널 + 코멘트
  CategoryLockOverlay               absolute inset-0, gradient fade
    └── 잠금 아이콘 (navy circle)
    └── 제목 / 설명
    └── CTA 버튼 ("구독 시작하기" / "로그인 / 구독 시작하기")
─────────────────────────────────────────
VideoDetailBottomSheet (공통)        클릭 시 열림
```

### URL 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `group` | `CategoryGroup` | `비즈니스` | 표시할 카테고리 그룹 |

### 유저 티어 별 동작

| `userTier` | 목록 | 오버레이 | CTA |
|---|---|---|---|
| `paid` | 정상 표시 | 숨김 | — |
| `free` | 블러 처리 | 표시 | "구독 시작하기" |
| `guest` | 블러 처리 | 표시 | "로그인 / 구독 시작하기" |

---

## API 연동 필요 사항

### 1. 카테고리 영상 목록 조회

```typescript
// GET /api/categories/{group}/videos?filter={filter}
// 응답 예시
interface CategoryVideosResponse {
  items: {
    id: string;
    title: string;
    channel: string;
    duration: string;      // "18:42"
    category: string;
    editorComment: string;
    thumbnailUrl?: string; // 실제 썸네일 이미지 URL
  }[];
}
```

`useCategoryList.ts`의 `setTimeout` 목업을 실제 `fetch` 호출로 교체한다.

### 2. 유저 티어 조회

```typescript
// 현재: MOCK_USER_TIER = 'free' (CategoryListPage.tsx 상단)
// 연동 후: useAuthStore 등 전역 상태에서 tier를 읽어온다.

const userTier = useAuthStore((s) => s.tier); // 'guest' | 'free' | 'paid'
```

### 3. 저장 상태 조회 및 토글

```typescript
// VideoDetailBottomSheet의 isSaved 초기값을 API에서 조회
// GET /api/videos/{id}/saved → { isSaved: boolean }

// 저장 토글
// POST /api/videos/{id}/save   (저장)
// DELETE /api/videos/{id}/save (저장 해제)
```

### 4. 영상 보기 (YouTube 링크)

```typescript
// handleWatch 핸들러에서 실제 YouTube URL open
// GET /api/videos/{id} → { youtubeUrl: string }
window.open(youtubeUrl, '_blank');
// 또는 Capacitor Browser 플러그인 사용
```

### 5. 구독 유도 바텀시트 연동

현재 `handleSubscribe`는 `/mypage`로 이동한다.  
추후 전역 구독 유도 바텀시트(`SubUpsellBottomSheet`)가 구현되면 해당 컴포넌트로 교체한다.

---

## 드로어 연동

드로어(Drawer)에서 카테고리 탭 클릭 시 다음과 같이 이동한다:

```typescript
// Drawer 컴포넌트 내부
navigate(`/catlist?group=${encodeURIComponent(categoryName)}`);
```

현재 드로어 컴포넌트가 카테고리 항목을 렌더링하는지 확인 후, 이동 로직을 추가해야 한다.

---

## 미구현 / 개선 필요 사항

### 우선순위 높음

1. **드로어 카테고리 클릭 → `/catlist?group=…` 이동 연결**  
   현재 드로어에서 카테고리 탭이 CategoryListPage로 라우팅되지 않을 수 있음.  
   드로어 컴포넌트를 확인하고 `navigate('/catlist?group=비즈니스')` 등 연결 필요.

2. **API 연동** — `useCategoryList.ts`의 목업 타임아웃 교체

3. **실제 유저 티어 연동** — `MOCK_USER_TIER` 상수를 전역 인증 상태로 교체

4. **구독 유도 바텀시트** — `SubUpsellBottomSheet` 컴포넌트 구현 및 연결  
   현재는 `/mypage`로 이동.

### 우선순위 보통

5. **실제 썸네일 이미지** — `thumbnailGradient` 대신 `<img>` 태그로 교체  
   (`CategoryVideoItem.tsx`의 썸네일 div를 `<img>` + fallback 처리)

6. **영상 보기 구현** — `handleWatch`에서 Capacitor Browser / `window.open` 연결

7. **저장 상태 서버 동기화** — 현재 로컬 `useState`로만 관리됨

8. **스켈레톤 UI** — 로딩 중 spinner 대신 `cl-item` 형태의 스켈레톤으로 교체

9. **페이지 이탈 시 필터 상태 보존** — 뒤로가기 후 재진입 시 마지막 필터 복원  
   (`sessionStorage` 또는 라우터 state 활용)

### 우선순위 낮음

10. **무한 스크롤 / 페이지네이션** — 현재 전체 목록을 한 번에 렌더링  
    영상 수가 많아지면 페이지네이션 또는 가상 목록(`react-virtual`) 도입 검토

11. **트렌드 그룹 빈 상태** — `CATLIST_DATA`에 트렌드 항목이 없어서 항상 빈 상태 표시됨.  
    API 연동 전까지 임시 목업 데이터 추가 여부 결정 필요.

---

## 컴포넌트 관계도

```
CategoryListPage (CMP-CAT-001)
├── AppHeader (variant="home")
├── CategoryFilterChips (CMP-CAT-002)
├── CategoryVideoList (CMP-CAT-003)
│   └── CategoryVideoItem × N (CMP-CAT-004)
├── CategoryLockOverlay (CMP-CAT-005)
│   └── 잠금 아이콘 + 텍스트 + CTA 버튼
└── VideoDetailBottomSheet (CMP-VIDEO-001) [공통]

useCategoryList (CMP-LOGIC-002)
└── catlistData.ts (목업)
    ├── CAT_META: Record<CategoryGroup, CategoryMeta>
    └── CATLIST_DATA: CategoryItem[]
```

---

## 디자인 토큰 참조

| CSS 클래스 | 값 |
|---|---|
| `.catlist-name` | `font-size: 22px; font-weight: 700; letter-spacing: -0.5px` |
| `.catlist-desc` | `font-size: 13px; color: text-2; line-height: 1.5; margin: 4px 0 10px` |
| `.f-chip` | `padding: 6px 14px; border-radius: 20px; font-size: 12px` |
| `.f-chip.active` | `background: navy; color: #fff` |
| `.cl-item` | `gap: 12px; padding: 14px 0; border-bottom: 1px solid border` |
| `.cl-thumb` | `width: 100px; height: 56px; border-radius: radius-sm` |
| `.cl-title` | `font-size: 14px; font-weight: 600; line-height: 1.4` |
| `.cl-ch` | `font-size: 12px; color: text-2` |
| `.cl-comment` | `font-size: 11px; color: text-3; -webkit-line-clamp: 2` |
| `.lock-icon` | `width: 36px; height: 36px; background: navy; border-radius: 50%` |
| `.catlist-lock-title` | `font-size: 15px; font-weight: 700` |
| `.catlist-lock-desc` | `font-size: 13px; color: text-2; line-height: 1.6` |
| `.lock-cta` | `padding: 8px 18px; background: navy; border-radius: 20px; font-size: 12px; font-weight: 700` |
