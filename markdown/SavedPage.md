# SavedPage 구현 명세

> **컴포넌트 ID** : CMP-SAVED-001  
> **파일** : `src/pages/SavedPage.tsx`  
> **라우트** : `/saved`  
> **레이아웃** : AppLayout 사용 (드로어 + 전역 토스트 포함)  
> **데이터 의존** : ⚠️ `src/mocks/savedData.json` 목업으로 대체 중

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `LoginGate` | CMP-CONTENT-001 | `src/components/common/LoginGate.tsx` | 비회원 로그인 게이트 (시청 기록과 공통) |
| `FolderTabs` | CMP-SAVED-002 | `src/components/saved/FolderTabs.tsx` | 폴더 탭 바 (전체 + 사용자 폴더 + 추가 버튼) |
| `SavedVideoList` | CMP-SAVED-003 | `src/components/saved/SavedVideoList.tsx` | 저장 목록 컨테이너 |
| `SavedVideoItem` | CMP-SAVED-004 | `src/components/saved/SavedVideoItem.tsx` | 단일 저장 영상 행 (썸네일·정보·하트 버튼) |
| `CreateFolderBottomSheet` | CMP-SAVED-005 | `src/components/saved/CreateFolderBottomSheet.tsx` | 새 폴더 만들기 바텀시트 |
| `VideoDetailBottomSheet` | CMP-VIDEO-001 | `src/components/video/VideoDetailBottomSheet.tsx` | 영상 상세 바텀시트 (`source="saved"` — 보조 버튼 없음) |
| `EmptyState` | CMP-UI-009 | `src/components/ui/EmptyState.tsx` | 빈 상태 / 오류 상태 표시 |

---

## 연동 필요 Hook

| Hook | ID | 역할 | 현재 상태 |
|------|----|------|----------|
| `useSavedVideos` | CMP-LOGIC-003 | 저장 목록·폴더 관리, 저장 해제 | ⚠️ `savedData.json` 목업으로 대체 중 |
| `useAuth` | CMP-LOGIC-001 | 로그인 여부 + 사용자 등급 확인 | ⚠️ `isLoggedIn = true` 하드코딩 목업 |

---

## 목업 데이터

**파일** : `src/mocks/savedData.json`

```
구조:
{
  "folders": Folder[],        // 사용자 폴더 목록
  "items":   SavedVideo[]     // 저장한 영상 전체 목록
}
```

**타입 정의** : `src/types/saved.ts`

```
SavedVideo:
  id         string
  video      VideoDetail
  savedAt    string          "YYYY.MM.DD"
  folderId   string | null   null = 기본 보관함

Folder:
  id    string
  name  string
  count number
```

---

## 컴포넌트 상태

| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `isLoggedIn` | `boolean` | `true` | 목업. `useAuth` 연동 시 교체 |
| `selectedItem` | `SavedVideo \| null` | `null` | 상세 바텀시트에 표시할 항목 |
| `isDetailOpen` | `boolean` | `false` | 영상 상세 바텀시트 열림 여부 |
| `isFolderSheetOpen` | `boolean` | `false` | 폴더 생성 바텀시트 열림 여부 |

---

## 화면 상태 흐름

```
[비회원]
  → LoginGate 표시 (아이콘: 북마크 SVG)
  → "로그인하기" 클릭 → showToast (목업) → TODO: LoginUpsellBottomSheet 연동

[로그인 사용자 – 로딩 중]
  → FolderTabs (탭 유지) + 스피너

[로그인 사용자 – 오류]
  → FolderTabs + EmptyState(variant="error")

[로그인 사용자 – 빈 상태]
  → FolderTabs + EmptyState(title="저장한 영상이 없어요")
  → activeFolderId 있으면 "이 폴더에 저장된 영상이 없습니다."
  → 없으면 "마음에 드는 영상을 저장하면 여기에 모입니다."

[로그인 사용자 – 목록]
  → FolderTabs + SavedVideoList
  → 탭 전환 → activeFolderId 변경 → filteredItems 갱신

[항목 클릭]
  → selectedItem 설정 → VideoDetailBottomSheet(source="saved") 열기
  → 하트(저장 해제) 클릭 → unsave → 시트 닫기 → 리스트에서 제거 → 토스트

[항목 하트 클릭 (리스트)]
  → unsave(savedId) → 리스트에서 즉시 제거 → 토스트 "저장을 해제했습니다."

[+ 버튼 클릭]
  → CreateFolderBottomSheet 열기
  → 폴더 이름 입력 → "만들기" → addFolder → FolderTabs에 탭 추가 → 토스트

[영상 보기]
  → showToast("영상 보기 기능은 준비 중입니다.") 목업
```

---

## API 명세 (TODO)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| `GET` | `/api/saved` | 로그인 사용자의 저장 목록 전체 조회 |
| `GET` | `/api/saved?folderId={id}` | 특정 폴더의 저장 목록 조회 |
| `DELETE` | `/api/saved/:savedId` | 저장 해제 |
| `GET` | `/api/folders` | 사용자 폴더 목록 조회 |
| `POST` | `/api/folders` | 폴더 생성 `{ name: string }` |
| `DELETE` | `/api/folders/:folderId` | 폴더 삭제 (영상은 기본 보관함으로 이동) |

---

## FolderTabs 동작 규칙

| 탭 | folderId | 표시 항목 |
|----|----------|----------|
| 전체 | `null` | `items` 전체 |
| 사용자 폴더 | `folder.id` | `items.filter(i => i.folderId === id)` |

- 폴더 탭은 수평 스크롤 가능 (`overflow-x: auto`, 스크롤바 숨김)
- 탭 추가 버튼(+)은 항상 우측 끝 고정 (`margin-left: auto`)

---

## CreateFolderBottomSheet 동작 규칙

- 폴더 이름이 공백이면 "만들기" 버튼 비활성 (`opacity-45`, `cursor-default`)
- 이름 최대 20자 (`maxLength={20}`), 우측 하단에 카운터 표시
- 현재 폴더 목록: 아이콘 + 이름 + `{count}개`
- 생성 성공 시 `addFolder()` 호출 → 탭에 즉시 반영 → 시트 닫힘 → 토스트

---

## 이후 교체 지점 (Future Replacement Points)

### 1. `useAuth` 연동 (우선순위: HIGH)
```tsx
// 현재 (목업)
const [isLoggedIn] = useState(true);

// 교체 후
const { isLoggedIn } = useAuth();
```

### 2. 실제 API 연동 — `useSavedVideos` 내부 (우선순위: HIGH)
```ts
// 현재
dispatch({ type: 'FETCH_SUCCESS', items: mockData.items, folders: mockData.folders });

// 교체 후
const [data] = await Promise.all([
  api.get('/api/saved'),
  api.get('/api/folders'),
]);
dispatch({ type: 'FETCH_SUCCESS', items: data[0], folders: data[1] });
```

### 3. 저장 해제 API 연동 (우선순위: HIGH)
```ts
// useSavedVideos.unsave 내부
// TODO: DELETE /api/saved/:savedId
await api.delete(`/api/saved/${savedId}`);
```

### 4. 폴더 생성 API 연동 (우선순위: MEDIUM)
```ts
// useSavedVideos.addFolder 내부
// TODO: POST /api/folders { name }
const created = await api.post('/api/folders', { name });
dispatch({ type: 'ADD_FOLDER', folder: created });
```

### 5. LoginUpsellBottomSheet 연동 (우선순위: MEDIUM)
```tsx
// 현재 (목업)
function handleLoginRequest() {
  showToast('로그인 기능은 준비 중입니다.');
}

// 교체 후
function handleLoginRequest() {
  openLoginUpsellSheet('saved');
}
```

### 6. 영상 보기 기능 구현 (우선순위: MEDIUM)
```tsx
// 현재 (목업)
function handleWatch() {
  showToast('영상 보기 기능은 준비 중입니다.');
}

// 교체 후
function handleWatch() {
  if (!selectedItem) return;
  openVideoPlayer(selectedItem.video.id);
}
```

### 7. 폴더 삭제 기능 추가 (우선순위: LOW)
- `CreateFolderBottomSheet`의 폴더 리스트에 삭제 버튼 추가 필요
- 삭제 시 해당 폴더의 영상은 기본 보관함(전체)으로 이동

### 8. 저장 시 폴더 선택 기능 (우선순위: LOW)
- `VideoDetailBottomSheet`에서 저장 버튼 클릭 시 폴더 선택 UI 필요
- 폴더 선택 후 `folderId`를 지정하여 저장

---

## 미구현 FE ID 목록

| FE ID | 설명 | 우선순위 |
|-------|------|---------|
| FE-SAVED-008 | 영상 보기 플레이어 연동 | MEDIUM |
| FE-SAVED-009 | LoginUpsellBottomSheet 연동 | MEDIUM |
| FE-SAVED-010 | 폴더 삭제 기능 | LOW |
| FE-SAVED-011 | 저장 시 폴더 선택 UI | LOW |
