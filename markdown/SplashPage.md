# SplashPage 구현 명세

> **컴포넌트 ID** : CMP-SPLASH-001  
> **파일** : `src/pages/SplashPage.tsx`  
> **라우트** : `/splash`  
> **레이아웃** : AppLayout 미사용 (독립 화면)  
> **데이터 의존** : ❌ 없음 (목업 타이머로 대체 중)

---

## 연동 필요 Hook

| Hook | ID | 역할 | 현재 상태 |
|------|----|------|----------|
| `useAuth` | CMP-LOGIC-001 | 로그인 여부 + 사용자 등급 확인 | ⚠️ `setTimeout` 목업으로 대체 중 |

---

## API 연동 명세

**사용자 상태 확인 API** (FE-SPLASH-003 기준)

```
요청 시점 : 화면 마운트 즉시
목적      : 토큰 유효성 확인 + 사용자 상태 조회
```

| 응답 필드 | 타입 | 설명 |
|----------|------|------|
| `isLoggedIn` | `boolean` | 로그인 여부 |
| `isOnboardingDone` | `boolean` | 온보딩 완료 여부 |
| `userTier` | `'guest' \| 'free' \| 'subscribed'` | 사용자 등급 |

---

## 상태 변화 흐름

```
마운트
  │
  ▼
isCheckingUser = true   ← 로딩 dot 표시
  │
  ▼
[API 호출 / 목업 타이머]
  │
  ├─ 성공: isLoggedIn = true  + onboarding 완료 → navigate('/home',       { replace: true })
  ├─ 성공: isLoggedIn = true  + onboarding 미완 → navigate('/onboard',    { replace: true })
  ├─ 성공: isLoggedIn = false                   → navigate('/login',      { replace: true })
  └─ 실패: 네트워크 오류                        → navigate('/restricted', { replace: true })
  │
  ▼
isCheckingUser = false  ← 로딩 dot 숨김
(navigate 직전 또는 동시에)
```

---

## 라우팅 규칙 상세

| 조건 | 목적지 | 비고 |
|------|--------|------|
| 미로그인 | `/login` | **현재 목업 경로** |
| 로그인 + 온보딩 완료 | `/home` | replace: true 필수 |
| 로그인 + 온보딩 미완 | `/onboard` | replace: true 필수 |
| 네트워크 오류 | `/restricted` | `replace: true` 필수 |

> `replace: true` — 스플래시로 뒤로가기 복귀 방지 (모든 경로 공통)

---

## 추후 교체 포인트

```tsx
// 현재 (목업)
const timer = setTimeout(() => {
  navigate('/login', { replace: true });
}, 1800);

// 교체 후 (useAuth 연동)
const { isLoggedIn, isOnboardingDone } = useAuth();
useEffect(() => {
  if (isLoggedIn && isOnboardingDone) navigate('/home',    { replace: true });
  else if (isLoggedIn)               navigate('/onboard', { replace: true });
  else                               navigate('/login',   { replace: true });
}, [isLoggedIn, isOnboardingDone]);
```

---

## 참고 사항

- `initTheme()` 은 `App.tsx`에서 이미 처리됨 → SplashPage에서 별도 처리 불필요
- `/restricted` 화면 구현 완료 — `SplashPage` 분기 연동은 Phase 1-5 대상
- 로딩 dot의 `pulse` 애니메이션은 `src/index.css` 전역 keyframe 사용
