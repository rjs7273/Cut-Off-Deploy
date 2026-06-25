# RestrictedPage — 이후 작업 사항

> 컴포넌트 ID: **CMP-RESTRICT-001**  
> 경로: `/restricted`  
> 위치: 연결/세션 예외 화면 (AppLayout 미사용)  
> 구현 상태: **UI 완료** (SplashPage 자동 라우팅 분기 미연동)

---

## 구현 완료 항목

| 파일 | 설명 |
|---|---|
| `src/pages/RestrictedPage.tsx` | 앱 사용 제한 화면 전체 |

### 화면 구성

```
(AppLayout 없음 — 독립 레이아웃)
────────────────────────────────────────
restricted-status-tag  "서버 응답 지연" + pulse dot
restricted-icon-box    Wi-Fi 끊김 아이콘 (76×76, #FFF3E0)
restricted-title       "앱을 사용할 수 없어요"   20px / 700
restricted-desc        연결/서버 지연 안내         14px / fg-muted
btn-primary            "다시 시도" → /splash (replace)
restricted-info        Wi-Fi·데이터 확인 안내      12px / fg-subtle
────────────────────────────────────────
```

### 버튼 동작

| 버튼 | 현재 | 연동 후 |
|---|---|---|
| 다시 시도 | `/splash` (`replace: true`) | 동일 — 스플래시에서 상태 재확인 |

---

## 진입 경로

| 출처 | 조건 |
|---|---|
| `SplashPage` | 사용자 상태 확인 타임아웃 / 네트워크 오류 (`connectionState: delayed`) |
| (추후) 전역 API 인터셉터 | 서버 무응답 시 fallback (명세 확정 시) |

UI_0622 `retryConnection()` → `navigateTo('splash')`와 동일 동작.

---

## SplashPage 라우팅 연동 (Phase 1-5)

| `connectionState` | 목적지 | FE 명세 |
|---|---|---|
| `delayed` | `/restricted` | 서버 응답 지연 |
| 확인 타임아웃/실패 | `/login` fallback | FE-SPLASH-003 |

```tsx
// SplashPage.tsx — 교체 예정
catch (error) {
  if (error.code === 'TIMEOUT' || error.code === 'NETWORK') {
    navigate('/restricted', { replace: true });
  } else {
    navigate('/login', { replace: true });
  }
}
```

Phase 1 stub에서는 DevUI 또는 쿼리 파라미터로 `/restricted` 진입을 시뮬레이션할 수 있다.

---

## API / 상태 연동 필요 사항

현재 화면은 정적 UI이며 별도 API 호출 없음.  
"다시 시도"는 스플래시로 돌아가 `useAuth().refreshSession()` 또는 상태 확인 API를 재실행한다.

---

## 미구현 / 개선 필요 사항

### 우선순위 높음

1. **SplashPage 분기 연동** — 네트워크 오류/응답 지연 시 `/restricted` 이동
2. **DevUI 시뮬레이션** — `connectionState: delayed` 테스트 버튼 (선택)

### 우선순위 낮음

3. **상태 태그 문구 분기** — 네트워크 오류 vs 서버 지연 구분 표시 (명세 추가 시)
4. **재시도 로딩** — 버튼 `loading` prop (스플래시 전환 전 짧은 delay)

---

## 디자인 토큰 참조

| CSS 클래스 | 값 |
|---|---|
| `.restricted-wrap` | `padding: 48px 32px 40px; center` |
| `.restricted-status-tag` | `12px / 600; bg #FFF3E0; color #E67E00; radius 20px` |
| `.restricted-status-dot` | `6×6px; pulse animation` |
| `.restricted-icon-box` | `76×76; bg #FFF3E0; radius 24px; mb 28px` |
| `.restricted-title` | `20px / 700 / tracking -0.4px` |
| `.restricted-desc` | `14px / text-2 / lh 1.75 / mb 36px` |
| `.restricted-retry-btn` | `h 52px; navy bg; 15px / 600` |
| `.restricted-info` | `12px / text-3 / lh 1.65 / mt 16px` |

다크 모드: `index.css`의 `[data-theme="dark"] .restricted-icon-box`, `.restricted-status-tag`, `.restricted-status-dot` 참조.
