# NotificationPage — 이후 작업 사항

> 컴포넌트 ID: **CMP-NOTIF-001**  
> 경로: `/notification`  
> 위치: 온보딩 플로우 마지막 단계 (AppLayout 미사용)  
> 구현 상태: **완료** (알림 동의 상태 저장 미연동)

---

## 구현 완료 항목

| 파일 | 설명 |
|---|---|
| `src/pages/NotificationPage.tsx` | 알림 설정 화면 전체 |

### 화면 구성

```
(AppLayout 없음 — 온보딩 독립 레이아웃)
────────────────────────────────────────
notif-icon   64×64 bell 아이콘 (bg-sub, rounded-20px, navy)
notif-title  "오늘의 추천이 도착하면 알려드릴까요?"
notif-desc   "하루 한 번, 볼 만한 영상이..."
notif-preview (알림 예시 박스)
  └── PREVIEW 레이블 + 예시 텍스트 + 보조 텍스트
btn-primary  "알림 받기"    → /home (replace)
btn-ghost    "나중에 할게요" → /home (replace)
────────────────────────────────────────
```

### 버튼 동작

| 버튼 | 현재 | 연동 후 |
|---|---|---|
| 알림 받기 | `/home`으로 이동 | 알림 권한 요청 → 동의 상태 저장 → `/home` |
| 나중에 할게요 | `/home`으로 이동 | 미동의 상태 저장 → `/home` |

---

## API / 시스템 연동 필요 사항

### 1. 알림 권한 요청 (Capacitor)

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

async function requestPermission(): Promise<boolean> {
  const result = await PushNotifications.requestPermissions();
  return result.receive === 'granted';
}
```

"알림 받기" 버튼 클릭 시 `requestPermission()` 호출 후 결과에 따라 동의/거부 처리.

### 2. 알림 동의 상태 서버 저장

```typescript
// PATCH /api/user/settings
// body: { notificationEnabled: boolean }
```

권한 허용 여부와 무관하게 사용자 선택(동의/거부)을 서버에 저장.  
서버 저장 실패해도 홈으로 이동 (silent fail).

### 3. 온보딩 완료 상태 저장

```typescript
// PATCH /api/user/onboarding
// body: { completed: true }
// 또는 로컬: localStorage.setItem('onboardingCompleted', 'true')
```

알림 설정 화면은 온보딩의 마지막 단계이므로,
이 화면을 통과하면 온보딩 완료 상태를 기록해 이후 재진입을 막는다.

---

## 미구현 / 개선 필요 사항

### 우선순위 높음

1. **Capacitor 알림 권한 요청** — `handleAgree`에 권한 요청 로직 추가
2. **알림 동의 상태 API 저장** — `/api/user/settings` PATCH 호출
3. **온보딩 완료 처리** — `localStorage` 또는 서버에 완료 플래그 저장

### 우선순위 낮음

4. **로딩 상태** — "알림 받기" 버튼에 `loading` prop 적용 (API 응답 대기 중)
5. **에러 처리** — 권한 거부 시 안내 토스트 표시 (iOS 설정 이동 유도)
