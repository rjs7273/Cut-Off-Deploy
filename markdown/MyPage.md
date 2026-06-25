# MyPage 구현 명세

> **컴포넌트 ID** : CMP-MY-001  
> **파일** : `src/pages/MyPage.tsx`  
> **라우트** : `/mypage`  
> **레이아웃** : AppLayout 사용 (드로어 + 전역 토스트 포함)  
> **데이터 의존** : ⚠️ 모든 상태 목업(하드코딩)으로 대체 중

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `GuestProfileSection` | CMP-MY-002 | `src/components/mypage/GuestProfileSection.tsx` | 비회원 아바타 + 소개 + Google/Apple 로그인 버튼 |
| `UserProfileSection` | CMP-MY-003 | `src/components/mypage/UserProfileSection.tsx` | 로그인 사용자 그래디언트 아바타 + 이름 + 이메일/가입일 |
| `MyContentMenu` | CMP-MY-004 | `src/components/mypage/MyContentMenu.tsx` | 저장한 영상 / 최근 시청 기록 진입 메뉴 |
| `SubscriptionSection` | CMP-MY-007 | `src/components/mypage/SubscriptionSection.tsx` | 구독 상태 배지 + 구독 시작/취소 진입 |
| `PersonalSettingsSection` | CMP-MY-005 | `src/components/mypage/PersonalSettingsSection.tsx` | 관심사 설정 / 알림 토글 / 테마 Segment |
| `ThemeSegment` | CMP-MY-006 | `PersonalSettingsSection.tsx` 내부 | 밝게/어둡게 세그먼트 컨트롤 (`useThemeStore` 연동) |
| `SupportMenuSection` | CMP-MY-008 | `src/components/mypage/SupportMenuSection.tsx` | 의견 보내기 / 이용약관 / 개인정보처리방침 / 앱 버전 |
| `AccountSection` | CMP-MY-009 | `src/components/mypage/AccountSection.tsx` | 로그아웃 행 + 탈퇴하기 버튼 |
| `WithdrawConfirmModal` | CMP-MY-010 | `src/components/mypage/WithdrawConfirmModal.tsx` | 탈퇴 확인 중앙 모달 |
| `_shared` | — | `src/components/mypage/_shared.tsx` | `SettingSection`, `SettingRow` 내부 레이아웃 헬퍼 |

---

## 목업 상태

| 상태 | 값 | 설명 |
|------|-----|------|
| `isLoggedIn` | `true` | 로그인 상태 목업 |
| `userTier` | `'free'` | 무료 사용자 목업 |
| `notifAgree` | `false` | 알림 동의 (토글로 변경 가능) |
| `isWithdrawOpen` | `false` | 탈퇴 확인 모달 열림 여부 |
| `MOCK_PROFILE` | `{ name: '정세연', email: 'cutoff@gmail.com', since: '2025년 3월부터' }` | 사용자 정보 목업 |
| `MOCK_INTERESTS` | `['브랜딩', '마케팅']` | 관심사 목업 |
| `MOCK_SAVED_COUNT` | `7` | 저장 영상 수 목업 |

---

## 화면 분기 로직

| 조건 | 표시 |
|------|------|
| `!isLoggedIn` | `GuestProfileSection` (Google/Apple 로그인 버튼 포함) |
| `isLoggedIn` | `UserProfileSection` + `MyContentMenu` + `SubscriptionSection` |
| 항상 | `PersonalSettingsSection` + `SupportMenuSection` |
| `isLoggedIn` | `AccountSection` (로그아웃/탈퇴) |

---

## 레이아웃 구조

```
PageContainer (scrollable=true)
├── AppHeader (variant="default", title="마이페이지", showBack)
├── div.mypage-header  (px-20 pt-16 pb-16)
│    └── h1 "마이페이지" (20px/700)
│
├── [비회원] GuestProfileSection
│    ├── 아바타(회색 원 + person 아이콘) + "비회원" + 설명
│    └── SocialLoginButtonGroup (Google + Apple)
│
├── [로그인] UserProfileSection
│    └── 그래디언트 아바타(이니셜) + 이름 + 이메일·가입일
│
├── [로그인] MyContentMenu  "내 콘텐츠"
│    ├── 저장한 영상  →  /saved
│    └── 최근 시청 기록  →  /history
│
├── [로그인] SubscriptionSection  "구독"
│    ├── free     → "구독 시작하기" + 미구독 뱃지
│    └── subscribed → "Cut-off 구독" + 구독 중 뱃지 + since
│
├── PersonalSettingsSection
│    ├── "개인 설정"
│    │    ├── 관심사 설정  →  /category (edit mode)
│    │    └── 오늘의 추천 알림  (Toggle)
│    └── "앱 설정"
│         └── 테마 (ThemeSegment: 밝게 / 어둡게)
│
├── SupportMenuSection  "지원"
│    ├── 의견 보내기  →  /feedback
│    ├── 이용약관  →  /terms
│    ├── 개인정보처리방침  →  /privacy
│    └── 앱 버전: 1.0.0
│
└── [로그인] AccountSection
     ├── 로그아웃
     └── 탈퇴하기 (→ WithdrawConfirmModal)
```

---

## SettingRow / SettingSection CSS 수치

| 요소 | 스타일 |
|------|--------|
| `SettingSection` | `border-b border-line py-[8px]` |
| Section label | `11px / 600 / fg-subtle / uppercase / tracking-[0.5px] / px-20 pt-10 pb-4` |
| `SettingRow` | `flex justify-between items-center / px-[20px] py-[13px]` |
| sr-left | `15px / text-fg` |
| sr-right | `13px / text-fg-muted / flex items-center gap-[6px]` |
| sr-arrow `›` | `14px / text-fg-subtle` |

---

## Toggle CSS 수치

| 상태 | 스타일 |
|------|--------|
| ON | `w-[44px] h-[26px] bg-navy rounded-[13px]` + dot `right-[3px]` |
| OFF | `bg-line` + dot `left-[3px]` |
| dot | `w-[20px] h-[20px] bg-white rounded-full absolute top-[3px]` |

---

## ThemeSegment CSS 수치

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `bg-surface-sub rounded-[8px] p-[2px] gap-[2px]` |
| 버튼 기본 | `px-[14px] py-[4px] rounded-[6px] 13px/500 text-fg-subtle` |
| 버튼 활성 | `bg-surface-card text-fg 600 shadow-[0_1px_4px_rgba(0,0,0,0.10)]` |

---

## API 명세 (TODO)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| `GET` | `/api/me` | 로그인 사용자 정보 조회 |
| `GET` | `/api/subscription` | 구독 상태 조회 |
| `POST` | `/api/notification` | 알림 설정 변경 |
| `POST` | `/api/logout` | 로그아웃 |
| `DELETE` | `/api/me` | 회원 탈퇴 |

---

## 이후 교체 지점 (Future Replacement Points)

### 1. useAuth 연동 (우선순위: HIGH)
```tsx
// 현재 (목업)
const [isLoggedIn] = useState(true);
const [userTier] = useState<'free' | 'subscribed'>('free');

// 교체 후
const { isLoggedIn, userTier, userProfile } = useAuth();
```

### 2. 알림 설정 API 연동 (우선순위: HIGH)
```tsx
// PersonalSettingsSection onToggleNotification
// TODO: PATCH /api/notification { agree: !notifAgree }
```

### 3. SubscribeBottomSheet 연동 (우선순위: MEDIUM)
```tsx
function handleClickSubscribe() {
  openSubscribeSheet('mypage');   // TODO
}
```

### 4. UnsubscribeBottomSheet 연동 (우선순위: MEDIUM)
```tsx
function handleClickUnsubscribe() {
  openUnsubscribeSheet();   // TODO
}
```

### 5. 로그아웃 API 연동 (우선순위: HIGH)
```tsx
function handleLogout() {
  await auth.logout();        // POST /api/logout
  navigate('/splash');
}
```

### 6. 탈퇴 API 연동 (우선순위: HIGH)
```tsx
function handleWithdrawConfirm() {
  await auth.withdraw();      // DELETE /api/me
  navigate('/splash');
}
```

### 7. 관심사 편집 모드 진입 (우선순위: MEDIUM)
```tsx
// 현재: navigate('/category') — 초기 설정 화면
// 교체: navigate('/category', { state: { mode: 'edit' } })
```

---

## 미구현 FE ID 목록

| FE ID | 설명 | 우선순위 |
|-------|------|---------|
| FE-MYPAGE-002 | useAuth 연동 — isLoggedIn 실제 상태 반영 | HIGH |
| FE-MYPAGE-003 | 사용자 정보 API GET /api/me 연동 | HIGH |
| FE-MYPAGE-006 | 알림 토글 API 연동 | HIGH |
| FE-MYPAGE-008 | SubscribeBottomSheet / UnsubscribeBottomSheet 연동 | MEDIUM |
| FE-MYPAGE-010 | 로그아웃 API POST /api/logout 연동 | HIGH |
| FE-MYPAGE-011 | 탈퇴 API DELETE /api/me + WithdrawConfirmModal 플로우 | HIGH |
| FE-MYPAGE-005 | 관심사 편집 모드(mode="edit") 진입 | MEDIUM |
