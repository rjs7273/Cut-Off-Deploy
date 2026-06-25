# OnboardPage — 후속 작업 명세

> **라우트**: `/onboard`  
> **레이아웃**: AppLayout 미사용 (독립 전체화면)  
> **초안 참조**: `UI_0622_초안.html` — `#screen-onboard1`, `.ob-slide`, `.ob-dots`, `.onboard-visual`  
> **작성일**: 2026-06-23

---

## 현재 구현 상태

### 완료
- 3슬라이드 수평 슬라이딩 (CSS `transform: translateX`, `cubic-bezier(0.4,0,0.2,1)`)
- 슬라이드별 진행 도트 (활성 도트: 너비 20px / 비활성: 8px)
- 슬라이드 1 — 저품질 카드 필터링 비주얼 (`Slide1Visual`)
- 슬라이드 2 — Today's Pick 카드 프리뷰 (`Slide2Visual`)
- 슬라이드 3 — 채널 발견 카드 (`Slide3Visual`)
- 마지막 슬라이드 "관심사 선택하기" → `/category` 이동
- `pt-safe` / `pb-safe` Safe Area 대응

### 컴포넌트 구조
```
OnboardPage
├── Dots              — 진행 도트 (공유, 슬라이드 인덱스로 active 결정)
├── Slide1Visual      — 슬라이드 1 비주얼 (목업 카드 + ✕ 표시)
├── Slide2Visual      — 슬라이드 2 비주얼 (Today's Pick 카드)
└── Slide3Visual      — 슬라이드 3 비주얼 (채널 발견 카드)
```

---

## 후속 작업 목록

### Phase 1 — UI / 플로우 완성

#### 1-1. SplashPage 라우팅 연결
현재는 SplashPage가 항상 `/login`으로 이동한다.  
FE-SPLASH-002 기준: **미로그인 + 온보딩 미완료** → `/onboard` 로 자동 이동해야 한다.

| 체크 | 작업 | 파일 |
|------|------|------|
| [ ] | `localStorage.onboardingDone` 플래그 읽기 | `SplashPage.tsx` |
| [ ] | 미로그인 + 플래그 없음 → `/onboard` | `SplashPage.tsx` |
| [ ] | 온보딩 완료 시 `localStorage.setItem('onboardingDone', 'true')` | `OnboardPage.tsx` |

```tsx
// OnboardPage.tsx — 마지막 슬라이드 버튼 클릭 시
function handleNext() {
  if (current < SLIDES.length - 1) {
    setCurrent((prev) => prev + 1);
  } else {
    localStorage.setItem('onboardingDone', 'true');
    navigate('/category', { replace: true });
  }
}
```

#### 1-2. 슬라이드 스와이프 제스처 지원
현재는 버튼 클릭으로만 슬라이드 전환. 터치 스와이프 추가가 필요하다.

| 체크 | 작업 | 비고 |
|------|------|------|
| [ ] | `onTouchStart` / `onTouchEnd` 핸들러로 swipe 감지 | `touchEndX - touchStartX < -50` → 다음 슬라이드 |
| [ ] | 스와이프 방향별 제한 (첫 슬라이드에서 왼쪽 스와이프 차단) | |
| [ ] | 드래그 인터랙션 중 transform 실시간 반영 (선택) | |

```tsx
// 스와이프 핸들러 예시
const touchStartX = useRef(0);

function handleTouchStart(e: React.TouchEvent) {
  touchStartX.current = e.touches[0].clientX;
}

function handleTouchEnd(e: React.TouchEvent) {
  const delta = e.changedTouches[0].clientX - touchStartX.current;
  if (delta < -50 && current < SLIDES.length - 1) setCurrent((p) => p + 1);
  if (delta > 50 && current > 0) setCurrent((p) => p - 1);
}
```

#### 1-3. 건너뛰기(Skip) 버튼 (검토 필요)
현재 HTML 초안에는 건너뛰기 버튼이 없다. 요구사항정의서 확인 후 필요 시 추가한다.

| 체크 | 작업 |
|------|------|
| [ ] | 요구사항정의서에서 Skip 버튼 필요 여부 확인 |
| [ ] | 필요 시 오른쪽 상단에 "건너뛰기" 텍스트 버튼 추가 → `/category` 이동 |

#### 1-4. 다크모드 비주얼 카드 색상 대응
슬라이드 비주얼 카드들이 CSS 변수 기반 색상을 일부 하드코딩(`#C8D4E8`, `#8FA3C4`)으로 사용 중.

| 체크 | 작업 |
|------|------|
| [ ] | `Slide2Visual` 썸네일 그라디언트 → CSS 변수 또는 다크모드 대응값으로 교체 |
| [ ] | `Slide3Visual` 아바타 그라디언트 동일 처리 |

---

### Phase 2 — 백엔드 API 연동

| 체크 | 작업 | API |
|------|------|-----|
| [ ] | 온보딩 완료 여부를 서버에서 관리할 경우 → `GET /user/me` 응답의 `onboardingDone` 필드 확인 | `GET /user/me` |
| [ ] | `localStorage` 플래그 대신 서버 상태 기준으로 SplashPage 라우팅 결정 | — |

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/pages/OnboardPage.tsx` | 온보딩 3슬라이드 메인 페이지 |
| `src/pages/CategoryPage.tsx` | 온보딩 → 관심사 선택 (다음 화면) |
| `src/pages/SplashPage.tsx` | 온보딩 진입 결정 라우팅 |
| `src/router.tsx` | `/onboard` 라우트 (AppLayout 미사용 독립 라우트) |
