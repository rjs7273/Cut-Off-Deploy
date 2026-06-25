# LoginPage 구현 명세

> **컴포넌트 ID** : CMP-AUTH-001  
> **파일** : `src/pages/LoginPage.tsx`  
> **라우트** : `/login`  
> **레이아웃** : AppLayout 미사용 (독립 화면)  
> **데이터 의존** : ❌ 없음 (소셜 로그인 목업 타이머로 대체 중)

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `SocialLoginButtonGroup` | CMP-AUTH-002 | `src/components/auth/SocialLoginButtonGroup.tsx` | Google / Apple 로그인 버튼 렌더링 |
| `TermsConsentModal` | CMP-AUTH-003 | `src/components/auth/TermsConsentModal.tsx` | 약관 5개 항목 동의 모달 |
| `LoginLoadingOverlay` | CMP-AUTH-004 | `src/components/auth/LoginLoadingOverlay.tsx` | 로그인 처리 중 전체 화면 오버레이 |

---

## 연동 필요 Hook

| Hook | ID | 역할 | 현재 상태 |
|------|----|------|----------|
| `useAuth` | CMP-LOGIC-001 | 소셜 로그인 실행 + 결과 처리 | ⚠️ `setTimeout` 목업으로 대체 중 |

---

## API 연동 명세

### Google 로그인 API (FE-AUTH-001)
```
요청 시점 : 약관 동의 확인 후 (onAgreeContinue 호출 시)
목적      : Google OAuth 인증 토큰 교환 → 서버 세션/토큰 발급
```

### Apple 로그인 API (FE-AUTH-002)
```
요청 시점 : 약관 동의 확인 후 (onAgreeContinue 호출 시)
목적      : Apple Sign-In 인증 코드 교환 → 서버 세션/토큰 발급
```

| 응답 필드 | 타입 | 설명 |
|----------|------|------|
| `accessToken` | `string` | 서버 발급 액세스 토큰 |
| `isNewUser` | `boolean` | 신규 사용자 여부 (온보딩 분기용) |
| `isOnboardingDone` | `boolean` | 온보딩 완료 여부 |

---

## 상태 (LoginPage)

| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `loginProvider` | `'google' \| 'apple' \| null` | `null` | 선택한 로그인 provider |
| `isTermsOpen` | `boolean` | `false` | 약관 동의 모달 표시 여부 |
| `isLoading` | `boolean` | `false` | 로그인 처리 중 여부 |

---

## 약관 항목 (TermsConsentModal 내부 상태)

| ID | 배지 | 내용 | 버튼 |
|----|------|------|------|
| c1 | 필수 | 이용약관 동의 | `/terms`로 이동 |
| c2 | 필수 | 개인정보처리방침 동의 | `/privacy`로 이동 |
| c3 | 필수 | 만 14세 이상입니다 | — |
| c4 | 필수 | 이메일 정보 제공 동의 | — |
| c5 | 선택 | 마케팅 알림 수신 동의 | — |

> - **전체 동의** 버튼: c1~c5 모두 동시 토글  
> - **동의하고 계속하기** 버튼: c1+c2+c3+c4 (필수 4개) 모두 체크 시에만 활성화

---

## 상태 변화 흐름

```
마운트 (/login)
  │
  ▼
사용자가 Google / Apple 버튼 탭
  │
  ├─ loginProvider 설정
  ├─ isTermsOpen = true
  │
  ▼
TermsConsentModal 표시
  │
  ├─ 필수 항목 4개 체크 → "동의하고 계속하기" 활성화
  ├─ 모달 외부 클릭 / ESC → onClose (isTermsOpen = false)
  │
  ▼
onAgreeContinue 호출
  │
  ├─ isTermsOpen = false
  ├─ isLoading = true  → LoginLoadingOverlay 표시
  │
  ▼
[소셜 로그인 API 호출 / 목업 타이머 2초]
  │
  ├─ 성공: isNewUser = true  → navigate('/onboard',  { replace: true })
  ├─ 성공: isNewUser = false → navigate('/home',     { replace: true })
  └─ 실패: 오류              → toast 표시 + isLoading = false
```

---

## 라우팅 규칙

| 조건 | 목적지 | 비고 |
|------|--------|------|
| 로그인 성공 + 신규 | `/onboard` | **현재 목업 경로** |
| 로그인 성공 + 기존 | `/home` | replace: true 필수 |
| 로그인 실패 | 동일 페이지 유지 | 에러 토스트 표시 |

> `replace: true` — 로그인 화면으로 뒤로가기 복귀 방지

---

## 추후 교체 포인트

```tsx
// 현재 (목업)
setTimeout(() => {
  setIsLoading(false);
  navigate('/onboard', { replace: true });
}, 2000);

// 교체 후 (useAuth 연동)
const { login } = useAuth();
async function handleAgreeContinue() {
  setIsTermsOpen(false);
  setIsLoading(true);
  try {
    const { isNewUser } = await login(loginProvider!, { marketingAgree: terms.c5 });
    navigate(isNewUser ? '/onboard' : '/home', { replace: true });
  } catch {
    showToast('로그인에 실패했습니다. 다시 시도해 주세요.');
  } finally {
    setIsLoading(false);
  }
}
```

---

## 참고 사항

- **뒤로가기 버튼 없음** — 로그인은 스택 최상단 화면이므로 헤더에 back 버튼 미표시
- 헤더는 `AppHeader` 미사용 — 독립 인라인 헤더 (로고만 중앙 표시)
- `LoginLoadingOverlay`는 `fixed inset-0 z-[100]`으로 모든 요소 위에 렌더링
- `TermsConsentModal`의 이메일 안내 문구는 provider에 따라 "Google 계정" / "Apple 계정"으로 동적 변환
- 약관 모달 열릴 때마다 체크 상태 초기화 (`useEffect → isOpen` 의존)
- `login-spin` keyframe은 `src/index.css`에 전역 등록
- `/terms`, `/privacy` 라우트는 현재 미구현 — 구현 시 `src/router.tsx`에 추가 필요
