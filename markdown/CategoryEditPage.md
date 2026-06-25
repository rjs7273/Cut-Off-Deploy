# CategoryEditPage — 후속 작업 명세

> **라우트**: `/category-edit`  
> **레이아웃**: `AppLayout` 사용 (드로어 + 전역 오버레이 포함)  
> **초안 참조**: `UI_0622_초안.html` — `#screen-category-edit`, `.app-bar`, `.cat-wrap`  
> **진입점**: MyPage → "관심사 설정" 행, Drawer → "관심사 설정"  
> **작성일**: 2026-06-23

---

## 현재 구현 상태

### 완료
- `AppHeader variant="default" title="관심사 변경" showBack` — 뒤로가기 + 타이틀
- 기존 선택 관심사 초기화 (`MOCK_INITIAL_INTERESTS` Set 기반)
- 칩 토글 선택/해제 (`InterestChipGrid` 공유)
- 1개 이상 선택 시 "저장하기" 버튼 활성화
- 저장 시 로딩 스피너 표시 + 600ms 목업 지연
- 저장 완료 시 토스트 알림 + `navigate(-1)` 뒤로 이동
- 하단 안내 문구: "변경 사항은 내일 추천부터 반영됩니다."

### 컴포넌트 구조
```
CategoryEditPage
├── AppHeader          — 뒤로가기 | "관심사 변경" 타이틀
└── InterestChipGrid   — 칩 그리드 (CategoryPage와 동일 컴포넌트)
```

### 데이터 소스
| 데이터 | 현재 | 추후 교체 대상 |
|--------|------|---------------|
| 기존 선택 관심사 | `MOCK_INITIAL_INTERESTS` (하드코딩 Set) | `GET /user/me` 응답의 `interests` 필드 |
| 저장 | `setTimeout(600ms)` stub | `PATCH /user/interests` |
| 관심사 목록 | `INTEREST_GROUPS` (interestData.ts) | `GET /categories` |

---

## 후속 작업 목록

### Phase 1 — UI / 플로우 완성

#### 1-1. 구독 tier별 선택 제한 (`FE-CATEGORY-EDIT-002`)
CategoryPage와 동일하게, 비구독자는 최대 1개, 구독자는 복수 선택.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | `InterestChipGrid` — `maxSelectable` / `onExceedLimit` prop 추가 (`CategoryPage.md` 1-1 선행) | `InterestChipGrid.tsx` |
| [ ] | `useAuth().userTier` 기준 `maxSelectable` 전달 | `CategoryEditPage.tsx` |
| [ ] | 초과 선택 시 upsell 바텀시트 트리거 | `CategoryEditPage.tsx` |

#### 1-2. 변경 없음 저장 방지
초기 선택 상태와 동일할 경우 "저장하기" 버튼을 비활성화하거나 알림 표시.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | `initialIds`와 `selectedIds`를 비교해 `hasChanges` 계산 | `CategoryEditPage.tsx` |
| [ ] | `hasChanges === false` 시 버튼 비활성 or "변경된 내용이 없습니다." 토스트 | `CategoryEditPage.tsx` |

```tsx
const hasChanges = useMemo(() => {
  if (selectedIds.size !== initialIds.size) return true;
  for (const id of selectedIds) if (!initialIds.has(id)) return true;
  return false;
}, [selectedIds, initialIds]);
```

#### 1-3. 저장 전 이탈 방지 (선택 구현)
변경 사항이 있는 상태에서 뒤로가기 시 확인 다이얼로그 표시.

| 체크 | 작업 |
|------|------|
| [ ] | `useBeforeUnload` 또는 React Router `blocker` 활용 |
| [ ] | "변경 사항이 저장되지 않습니다. 나가시겠습니까?" 컨펌 모달 표시 |

---

### Phase 2 — 백엔드 API 연동

| 체크 | 작업 | API |
|------|------|-----|
| [ ] | 페이지 진입 시 현재 사용자 관심사 서버에서 로드 | `GET /user/me` |
| [ ] | 저장 시 `PATCH /user/interests` 실제 호출 (stub 교체) | `PATCH /user/interests` |
| [ ] | API 오류 시 에러 토스트 표시 (`'저장에 실패했습니다.'`) | — |
| [ ] | 서버 로딩 중 초기 칩 그리드 스켈레톤 표시 | — |

```ts
// Phase 2 교체 예시
async function handleSave() {
  if (!canSave || isSaving || !hasChanges) return;
  setIsSaving(true);
  try {
    await api.patch('/user/interests', { interests: [...selectedIds] });
    showToast('관심사가 변경되었습니다. 내일 추천부터 반영됩니다.', 'success');
    navigate(-1);
  } catch {
    showToast('저장에 실패했습니다. 다시 시도해 주세요.', 'error');
  } finally {
    setIsSaving(false);
  }
}
```

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/pages/CategoryEditPage.tsx` | 관심사 변경 페이지 |
| `src/pages/CategoryPage.tsx` | 온보딩 카테고리 선택 (공유 컴포넌트 사용) |
| `src/components/category/InterestChipGrid.tsx` | 칩 그리드 공유 컴포넌트 |
| `src/mocks/interestData.ts` | 관심사 그룹 목업 데이터 |
| `src/types/interest.ts` | `InterestItem`, `InterestGroup` 타입 |
| `src/pages/MyPage.tsx` | 진입점 — "관심사 설정" 행 → `/category-edit` |
| `src/components/navigation/Drawer.tsx` | 진입점 — "관심사 설정" 메뉴 → `/category-edit` |
