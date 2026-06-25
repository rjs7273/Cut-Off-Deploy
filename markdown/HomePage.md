# HomePage — 이후 작업 사항

> 컴포넌트 ID: **CMP-HOME-001**  
> 경로: `/home`  
> 구현 상태: **목업 완료** (API 연동·유저 티어 미연동)

---

## 구현 완료 항목

| 파일 | 컴포넌트 ID | 설명 |
|---|---|---|
| `src/types/home.ts` | — | `HomeVideo`, `PickStatus` 타입 |
| `src/mocks/homeData.ts` | — | Today's Pick + 다른 추천 3개 + 스킵 이유 목록 |
| `src/hooks/useHome.ts` | CMP-LOGIC-001 | 홈 상태 관리 (`useReducer`) |
| `src/components/home/HomeSkeleton.tsx` | — | 초안 구조 동일 스켈레톤 UI |
| `src/components/home/TodayPickCard.tsx` | CMP-HOME-002 | 오늘의 픽 카드 |
| `src/components/home/SkippedCard.tsx` | CMP-HOME-003 | 스킵 상태 카드 + 되돌리기 버튼 |
| `src/components/home/OtherHCard.tsx` | — | 가로 스크롤 추천 카드 단일 항목 |
| `src/components/home/OtherSection.tsx` | CMP-HOME-004 | 오늘의 다른 추천 섹션 (잠금 오버레이 포함) |
| `src/components/home/SkipActionSheet.tsx` | — | 스킵 이유 선택 액션 시트 |
| `src/components/home/RestoreModal.tsx` | — | 스킵 되돌리기 확인 모달 |
| `src/pages/HomePage.tsx` | CMP-HOME-001 | 메인 홈 페이지 |

### 화면 구성

```
AppHeader (variant="home")   ← ☰ | Cut-off 로고 | 마이페이지 아이콘
──────────────────────────────────────────────────
isLoading  → HomeSkeleton
error      → 에러 메시지
콘텐츠:
  pickStatus==='normal'
    TodayPickCard
      ├── labels: [Today's Pick] [카테고리]
      ├── 썸네일 (16:9) + 재생 ▶ + 재생 시간
      ├── 제목 / 채널 · 날짜
      └── Editor's Comment 박스
  pickStatus==='skipped'
    SkippedCard
      └── 스킵 아이콘 + 제목 + 설명 + 다음 추천까지 시간 + 되돌리기
  OtherSection (오늘의 다른 추천)
    free/guest → blur + LockOverlay
    paid       → OtherHCard × 3 (가로 스크롤)
  home-footer (h-8)
──────────────────────────────────────────────────
VideoDetailBottomSheet (공통)  source="home"
SkipActionSheet               스킵 이유 선택
RestoreModal                  되돌리기 확인
```

### 플로우 설명

1. **픽 카드 클릭** → `VideoDetailBottomSheet` 열림 (source=`home`)
2. **"오늘은 안 볼래요"** (시트 내) → 시트 닫힘 → `SkipActionSheet` 열림
3. **스킵 이유 선택** → `SkippedCard` 표시
4. **"↩ 되돌리기"** (SkippedCard) → `RestoreModal` 열림
5. **"되돌리기" 확인** → `TodayPickCard` 복원
6. **다른 추천 카드 클릭** → `VideoDetailBottomSheet` 열림 (source=`home`)
7. **다른 추천 카드 내 "↩ 되돌리기"** → 해당 카드의 스킵 상태 해제

---

## API 연동 필요 사항

### 1. 홈 데이터 조회

```typescript
// GET /api/home/today
// 응답:
interface HomeTodayResponse {
  pick: {
    id: string;
    title: string;
    channel: string;
    duration: string;        // "18:42"
    durationLabel: string;   // "18분 42초"
    category: string;
    date: string;            // "2025.05.01"
    editorComment: string;
    summary: string;
    reasons: string[];
    discoveryNote?: string;
    thumbnailUrl?: string;
    thumbnailGradient: string;
  };
  others: (omit pick.summary | pick.reasons | pick.discoveryNote)[];
}
```

`useHome.ts`의 `setTimeout` 목업을 실제 API 호출로 교체.

### 2. 유저 티어 연동

```typescript
// 현재: MOCK_USER_TIER = 'free' (HomePage.tsx 상단 상수)
// 연동 후: 전역 인증 스토어에서 조회
const userTier = useAuthStore((s) => s.tier);
```

### 3. 저장 토글

```typescript
// POST /api/videos/{id}/save
// DELETE /api/videos/{id}/save
// useHome.ts의 TOGGLE_SAVE 액션 → API 호출로 변경
```

### 4. 스킵 로깅

```typescript
// POST /api/home/skip
// body: { reason: string }   — 스킵 이유 전송
// SkipActionSheet의 onSelectReason 콜백에서 호출
```

### 5. 영상 보기

```typescript
// handleWatch에서 YouTube URL open
// GET /api/videos/{id} → { youtubeUrl: string }
// Capacitor Browser.open({ url: youtubeUrl }) 또는 window.open
```

---

## 미구현 / 개선 필요 사항

### 우선순위 높음

1. **API 연동** — `useHome.ts` 목업 교체 및 유저 티어 연동
2. **구독 유도 바텀시트** — `OtherSection`의 잠금 CTA 클릭 시 구독 유도 바텀시트 열기  
   (현재 `/mypage`로 이동)
3. **영상 보기 구현** — YouTube 링크 연동

### 우선순위 보통

4. **스킵 이유 서버 전송** — 선택한 이유를 API에 POST
5. **저장 상태 초기화** — 로그인 후 서버에서 저장 여부 조회하여 `savedIds` 초기화
6. **실제 썸네일 이미지** — `thumbnailGradient` 대신 `<img>` + fallback
7. **스킵 상태 지속성** — 앱 재시작 후에도 스킵 상태 유지 (`localStorage` 또는 서버)

### 우선순위 낮음

8. **알림 아이콘 연동** — `AppHeader`에 `showNotification` 추가 및 알림 미확인 dot 표시  
   (현재 홈 초안 HTML에는 마이페이지 아이콘만 있음)
9. **풀-투-리프레시** — 아래로 당기면 오늘의 픽 갱신

---

## 컴포넌트 관계도

```
HomePage (CMP-HOME-001)
├── AppHeader (variant="home")
├── HomeSkeleton (로딩 중)
├── TodayPickCard (CMP-HOME-002) [pickStatus==='normal']
│   └── 저장 하트 버튼
├── SkippedCard (CMP-HOME-003) [pickStatus==='skipped']
│   └── 되돌리기 버튼
├── OtherSection (CMP-HOME-004)
│   ├── OtherHCard × N (가로 스크롤)
│   │   ├── 저장 하트 버튼 (소형)
│   │   └── 스킵 오버레이 + 되돌리기
│   └── LockOverlay (free/guest 시)
├── VideoDetailBottomSheet (CMP-VIDEO-001) [공통]
├── SkipActionSheet (스킵 이유 선택)
└── RestoreModal (되돌리기 확인)

useHome (CMP-LOGIC-001)
└── homeData.ts (목업)
    ├── TODAYS_PICK: HomeVideo
    ├── OTHER_VIDEOS: HomeVideo[]
    └── SKIP_REASONS: string[]
```

---

## 디자인 토큰 참조

| CSS 클래스 | 값 |
|---|---|
| `.today-card` | `margin: 16px 20px; border-radius: 20px (radius-xl)` |
| `.today-labels` | `padding: 14px 16px 10px; gap: 8px` |
| `.label-pick` | `font-size: 11px; font-weight: 700; color: navy; background: #EEF1FF` |
| `.label-cat` | `font-size: 11px; color: text-2; background: tag-bg` |
| `.today-title` | `font-size: 17px; font-weight: 700; line-height: 1.4; letter-spacing: -0.3px` |
| `.today-channel` | `font-size: 12px; color: text-2` |
| `.editor-comment-box` | `background: bg-sub; border-radius: 8px; padding: 10px 12px; margin-bottom: 14px` |
| `.ec-label` | `font-size: 10px; font-weight: 700; color: navy; letter-spacing: 0.5px` |
| `.ec-text` | `font-size: 13px; color: text-1; line-height: 1.55` |
| `.hcard` | `width: 160px; border-radius: 12px (radius-md); border: 1px solid border` |
| `.hcard-thumb` | `height: 90px` |
| `.hcard-title` | `font-size: 12px; font-weight: 600; line-clamp: 2` |
| `.section-title` | `font-size: 16px; font-weight: 700` |
| `.section-desc` | `font-size: 12px; color: text-2` |
| `.lock-overlay` | `bg: rgba(255,255,255,0.72) + backdrop-blur(2px)` |
