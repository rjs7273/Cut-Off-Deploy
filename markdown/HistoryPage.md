# HistoryPage 구현 명세

> **컴포넌트 ID** : CMP-HISTORY-001  
> **파일** : `src/pages/HistoryPage.tsx`  
> **라우트** : `/history`  
> **레이아웃** : AppLayout 사용 (드로어 + 전역 토스트 포함)  
> **데이터 의존** : ⚠️ `src/mocks/historyData.json` 목업으로 대체 중

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `LoginGate` | CMP-CONTENT-001 | `src/components/common/LoginGate.tsx` | 비회원 로그인 게이트 (저장한 영상과 공통) |
| `HistoryList` | CMP-HISTORY-002 | `src/components/history/HistoryList.tsx` | 날짜별 그룹 리스트 |
| `HistoryItem` | CMP-HISTORY-003 | `src/components/history/HistoryItem.tsx` | 단일 기록 행 (썸네일·정보·삭제 버튼) |
| `WatchStatusBadge` | CMP-HISTORY-004 | `src/components/history/WatchStatusBadge.tsx` | 시청 완료 / 스킵 뱃지 |
| `VideoDetailBottomSheet` | CMP-VIDEO-001 | `src/components/video/VideoDetailBottomSheet.tsx` | 영상 상세 바텀시트 (여러 화면 재사용) |
| `EmptyState` | CMP-UI-009 | `src/components/ui/EmptyState.tsx` | 빈 상태 / 오류 상태 표시 |

---

## 연동 필요 Hook

| Hook | ID | 역할 | 현재 상태 |
|------|----|------|----------|
| `useWatchHistory` | CMP-LOGIC-004 | 시청 기록 조회·삭제·저장 토글 | ⚠️ `historyData.json` 목업으로 대체 중 |
| `useAuth` | CMP-LOGIC-001 | 로그인 여부 + 사용자 등급 확인 | ⚠️ `isLoggedIn = true` 하드코딩 목업 |

---

## 목업 데이터

**파일** : `src/mocks/historyData.json`

```
구조:
{
  "groups": [
    {
      "label": "오늘" | "어제" | "날짜 문자열",
      "items": [WatchHistoryItem, ...]
    }
  ]
}
```

**항목 수** : 5개 (오늘 1, 어제 2, 2025년 4월 26일 2)

---

## API 연동 명세

### 시청 기록 조회 API (FE-HISTORY-001, FE-HISTORY-003)
```
요청 시점 : 화면 마운트 + isLoggedIn = true
메서드    : GET /api/history
```

| 응답 필드 | 타입 | 설명 |
|----------|------|------|
| `groups` | `WatchHistoryGroup[]` | 날짜별 그룹화된 시청 기록 |

### 시청 기록 삭제 API (FE-HISTORY-007, FE-HISTORY-008)
```
요청 시점 : 삭제 버튼 클릭 또는 바텀시트 "시청 기록 제거" 클릭
메서드    : DELETE /api/history/:historyId
```

### 저장 토글 API (FE-HISTORY-006)
```
요청 시점 : 바텀시트 저장 버튼 클릭
메서드    : POST /api/saved (저장) / DELETE /api/saved/:videoId (해제)
```

---

## 상태 (HistoryPage)

| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `isLoggedIn` | `boolean` | `true` | 로그인 여부 (목업 고정) |
| `selectedItem` | `WatchHistoryItem \| null` | `null` | 바텀시트에 표시할 기록 항목 |
| `isSheetOpen` | `boolean` | `false` | 바텀시트 열림 여부 |

**useWatchHistory 반환 상태:**

| 상태 | 타입 | 설명 |
|------|------|------|
| `groups` | `WatchHistoryGroup[]` | 날짜별 그룹화 기록 |
| `isLoading` | `boolean` | 조회 중 여부 |
| `error` | `string \| null` | 오류 메시지 |

---

## 상태 변화 흐름

```
마운트 (/history)
  │
  ├─ isLoggedIn = false → LoginGate 표시
  │
  └─ isLoggedIn = true
       │
       ▼
   useWatchHistory → isLoading = true → 스피너 표시
       │
       ▼
   [목업 타이머 400ms / 실제: GET /api/history]
       │
       ├─ 성공: groups.length > 0 → HistoryList 표시
       ├─ 성공: groups.length = 0 → EmptyState("시청한 영상이 없어요!")
       └─ 실패: error 있음       → EmptyState(error variant)

HistoryItem 클릭
  → selectedItem 설정 + isSheetOpen = true
  → VideoDetailBottomSheet 표시

삭제 버튼 (리스트)
  → deleteItem(id) + showToast('시청 기록에서 삭제했습니다.')

"시청 기록 제거" (바텀시트)
  → deleteItem(id) + setIsSheetOpen(false) + showToast()

저장 버튼 (바텀시트)
  → toggleSave(id) + selectedItem.isSaved 갱신 + showToast()
```

---

## 라우팅 규칙

| 진입 경로 | 비고 |
|----------|------|
| 마이페이지 → 최근 시청 기록 메뉴 | FE-MYPAGE-004 |
| 드로어 → (현재 미구현) | 드로어에 직접 링크 없음 |

---

## 추후 교체 포인트

### 1. isLoggedIn — useAuth 연동
```tsx
// 현재 (목업)
const [isLoggedIn] = useState(true);

// 교체 후 (useAuth 연동)
const { isLoggedIn } = useAuth();
```

### 2. useWatchHistory — 실제 API 연동
```ts
// hooks/useWatchHistory.ts 내부 타이머 블록 교체
// 현재
dispatch({ type: 'FETCH_SUCCESS', payload: mockData.groups as WatchHistoryGroup[] });

// 교체 후
const response = await fetch('/api/history', { headers: authHeaders });
const data = await response.json();
dispatch({ type: 'FETCH_SUCCESS', payload: data.groups });
```

### 3. handleWatch — 영상 보기 구현
```tsx
// 현재: 토스트만 표시
function handleWatch() {
  showToast('영상 보기 기능은 준비 중입니다.');
}

// 교체 후: YouTube 임베드 플레이어 또는 외부 링크
// FE-HISTORY-009 — 상세 바텀시트 내 재생 구현 필요
```

### 4. handleLoginRequest — LoginUpsellBottomSheet 연동
```tsx
// 현재: 토스트만 표시
function handleLoginRequest() {
  showToast('로그인 기능은 준비 중입니다.');
}

// 교체 후: CMP-SUB-002 LoginUpsellBottomSheet 열기
openLoginUpsell({ source: 'history' });
```

---

## 미구현 항목 (FE ID 기준)

| FE ID | 내용 | 우선순위 | 비고 |
|-------|------|----------|------|
| FE-HISTORY-009 | 임베드 플레이어 (영상 다시 재생) | P0 | `onWatch` 핸들러 내 구현 필요 |
| FE-HISTORY-008 | 바텀시트 내 기록 제거 확정 토스트 | P1 | 현재 구현됨, 재시청 시 기록 갱신 정책 확정 필요 |
| FE-HISTORY-010 | 빈 상태 문구 최종 확정 | P1 | 현재 "시청한 영상이 없어요!" — PM 확인 필요 |

---

## 참고 사항

- `VideoDetailBottomSheet`는 `source="history"` 전달 시 보조 CTA를 **"시청 기록 제거"** 로 자동 설정
- `VideoDetailBottomSheet`는 홈 / 카테고리 목록 / 저장한 영상 화면에서도 재사용 예정 (`source` prop으로 CTA 분기)
- `HistoryItem`의 `onDelete` 클릭 시 `event.stopPropagation()` 처리 — 삭제 버튼과 상세 시트 오픈 충돌 방지
- `WatchStatusBadge`는 `done(시청 완료)` / `skipped(스킵)` 두 가지 상태만 처리
- `LoginGate`는 `저장한 영상(SavedPage)`과 공통 사용 — `title`, `description`, `icon` props로 화면별 문구 구분
- `useWatchHistory` hook은 `useReducer` 기반으로 상태 전환을 일원화하여 cascading render 방지
- 시청 기록 삭제 후 빈 그룹은 자동으로 필터링 (그룹 내 items 전부 삭제 시 해당 날짜 헤더도 제거됨)
