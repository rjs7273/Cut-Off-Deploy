# CategoryPage — 후속 작업 명세

> **라우트**: `/category`  
> **레이아웃**: AppLayout 미사용 (온보딩 플로우 독립 화면)  
> **초안 참조**: `UI_0622_초안.html` — `#screen-category`, `.cat-wrap`, `.cat-section`, `.chip-grid`, `.chip`  
> **작성일**: 2026-06-23

---

## 현재 구현 상태

### 완료
- 관심사 그룹별 칩 그리드 (비즈니스 / 성장 / 문화·라이프 / 트렌드)
- 칩 토글 선택/해제 — `Set<string>` 기반 상태 관리
- 1개 이상 선택 시 "시작하기" 버튼 활성화 (`canProceed`)
- 선택 개수 표시 (`${count}개 선택됨` / `관심사를 선택해 주세요`)
- 하단 안내 문구: "관심사는 마이페이지에서 변경할 수 있습니다."
- 완료 시 `/notification` 이동 (온보딩 플로우 내)

### 컴포넌트 구조
```
CategoryPage
└── InterestChipGrid — 그룹별 칩 그리드 (CategoryEditPage와 공유)
    ├── .cat-section  — 그룹 (비즈니스, 성장, 문화·라이프, 트렌드)
    │   ├── .cat-section-label (12px/600/uppercase/text-subtle)
    │   └── .chip-grid — 개별 칩 버튼 목록
```

### 화면 내 데이터 소스
| 데이터 | 현재 | 추후 교체 대상 |
|--------|------|---------------|
| 관심사 그룹/항목 | `src/mocks/interestData.ts` (`INTEREST_GROUPS`) | `GET /categories` |
| 선택 저장 | 없음 (임시 stub) | `PATCH /user/interests` |

---

## 후속 작업 목록

### Phase 1 — UI / 플로우 완성

#### 1-1. 구독 tier별 선택 제한 (`FE-CATEGORY-002`)
비구독자는 최대 1개, 구독자는 복수 선택 가능.  
현재 `InterestChipGrid`에는 `maxSelectable` prop이 없다.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | `InterestChipGrid` — `maxSelectable?: number` prop 추가 | `InterestChipGrid.tsx` |
| [ ] | 최대 선택 초과 시 upsell 바텀시트 트리거 (`openLoginUpsellSheet()` 또는 `openSubscribeSheet()`) | `InterestChipGrid.tsx` |
| [ ] | `CategoryPage` — `useAuth().userTier` 기준 `maxSelectable` 전달 | `CategoryPage.tsx` |

```tsx
// InterestChipGrid.tsx — 추가 예정 로직
function handleChipClick(id: string) {
  if (!isSelected && selectedIds.size >= (maxSelectable ?? Infinity)) {
    onExceedLimit?.(); // upsell 트리거
    return;
  }
  onToggle(id);
}
```

#### 1-2. `?mode=subscribe` 쿼리 대응 (`FE-CATEGORY-005`)
구독 직후 추가 관심사 설정 시 진입. 3개 이상 선택 시 "시작하기" 활성화.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | `useSearchParams()`로 `?mode=subscribe` 감지 | `CategoryPage.tsx` |
| [ ] | `mode === 'subscribe'` 시 `canProceed = selectedIds.size >= 3` | `CategoryPage.tsx` |
| [ ] | 헤더 텍스트 변경: "구독 혜택으로 관심사를 3개 이상 선택하세요" | `CategoryPage.tsx` |
| [ ] | 완료 시 이동 목적지 변경: `?mode=subscribe` → `/home` (알림 설정 건너뜀) | `CategoryPage.tsx` |

#### 1-3. SplashPage 라우팅 연결
미로그인 + 온보딩 완료 + 관심사 미설정 → `/category` 이동.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | 관심사 선택 완료 시 `localStorage.setItem('interestSelected', 'true')` | `CategoryPage.tsx` |
| [ ] | SplashPage에서 플래그 확인 후 라우팅 분기 | `SplashPage.tsx` |

---

### Phase 2 — 백엔드 API 연동

| 체크 | 작업 | API |
|------|------|-----|
| [ ] | 관심사 그룹/항목 서버에서 로드 (`INTEREST_GROUPS` 대체) | `GET /categories` |
| [ ] | 관심사 선택 완료 → 서버 저장 | `PATCH /user/interests` |
| [ ] | 관심사 목록 API 로딩 중 스켈레톤 UI 표시 | — |

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/pages/CategoryPage.tsx` | 온보딩 카테고리 선택 페이지 |
| `src/pages/CategoryEditPage.tsx` | 마이페이지 관심사 변경 (공유 컴포넌트 사용) |
| `src/components/category/InterestChipGrid.tsx` | 칩 그리드 공유 컴포넌트 |
| `src/mocks/interestData.ts` | 관심사 그룹 목업 데이터 (`INTEREST_GROUPS`) |
| `src/types/interest.ts` | `InterestItem`, `InterestGroup` 타입 |
