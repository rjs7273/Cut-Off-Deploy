# FeedbackPage 구현 명세

> **컴포넌트 ID** : CMP-FB-001  
> **파일** : `src/pages/FeedbackPage.tsx`  
> **라우트** : `/feedback`  
> **레이아웃** : AppLayout 사용 (드로어 + 전역 토스트 포함)  
> **데이터 의존** : 없음 (폼 입력만 수집)

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `FeedbackTypeChips` | CMP-FB-002 | `src/components/feedback/FeedbackTypeChips.tsx` | 의견 유형 칩 선택 (개선 제안/버그 신고/콘텐츠 문의/기타) |
| `FeedbackForm` | CMP-FB-003 | `src/components/feedback/FeedbackForm.tsx` | 내용 textarea + 이메일 input + 제출 버튼 |
| `Chip` | CMP-UI-003 | `src/components/ui/Chip.tsx` | 유형 칩 렌더링 재활용 |

---

## 상태 관리

| 상태 위치 | 상태 | 타입 | 초기값 | 설명 |
|-----------|------|------|--------|------|
| `FeedbackPage` | `feedbackType` | `FeedbackType` | `'개선 제안'` | 선택된 의견 유형 |
| `FeedbackPage` | `isSubmitting` | `boolean` | `false` | 제출 중 플래그 |
| `FeedbackForm` | `text` | `string` | `''` | 내용 textarea 값 |
| `FeedbackForm` | `email` | `string` | `''` | 이메일 input 값 |

---

## 폼 유효성 검사 규칙

| 조건 | 제출 버튼 상태 |
|------|--------------|
| text.trim() === '' | 비활성 (opacity-45) |
| email 입력 후 형식 오류 | 비활성 |
| text 있고 (email 없거나 유효) | 활성 |

이메일 유효성: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

---

## 레이아웃 구조

```
PageContainer (scrollable=false)
├── AppHeader (variant="default", title="의견 보내기", showBack)
└── div.scroll (px-[20px] pt-[24px] pb-[40px])
    ├── h1  (제목 — 18px/700/text-fg/tracking-[-0.4px]/mb-[6px])
    ├── p   (설명 — 13px/text-fg-muted/line-height:1.6/mb-[24px])
    ├── FeedbackTypeChips  (유형 섹션 — mb-[14px])
    └── FeedbackForm
        ├── 내용 섹션 (mb-[14px])
        │    ├── label  (12px/600/text-fg-muted/mb-[6px])
        │    ├── textarea (h-[160px] border rounded-[12px] p-[12px] 14px resize-none leading-[1.6])
        │    └── counter (text-right 11px text-fg-disabled mt-[4px])
        ├── 이메일 섹션 (mb-[24px])
        │    ├── label  (12px/600/text-fg-muted/mb-[6px])
        │    ├── input  (h-[44px] border rounded-[12px] px-[12px] 14px)
        │    ├── [에러] (11px #E53935 mt-[4px] — 형식 오류 시)
        │    └── [힌트] (11px text-fg-disabled mt-[5px] — 정상 상태)
        └── 제출 버튼 (h-[52px] w-full bg-navy rounded-[12px] 16px/600)
```

---

## 화면 상태 흐름

```
[초기 상태]
  → '개선 제안' 칩 선택됨
  → 내용 비어있음 → 제출 버튼 비활성(opacity-45)

[유형 칩 선택]
  → 단일 선택, 클릭 시 feedbackType 변경

[내용 입력]
  → text.length > 0 AND isEmailValid → 버튼 활성화
  → 500자 카운터 실시간 업데이트

[이메일 입력]
  → 입력 없음: 힌트 표시 "입력하시면 처리 결과를 알려드립니다."
  → 입력 후 형식 오류: 에러 메시지 표시 + 버튼 비활성
  → 입력 후 형식 유효: 힌트 유지 + 버튼 활성(text 있을 때)

[제출]
  → isSubmitting = true → 버튼 "제출 중..." (스피너)
  → 목업: 600ms 딜레이 후 성공
  → 성공: 토스트 "의견을 보냈습니다. 꼼꼼히 읽겠습니다!"
  → 실패: 토스트 "전송에 실패했습니다. 잠시 후 다시 시도해 주세요."
```

---

## API 명세 (TODO)

| 메서드 | 엔드포인트 | Body | 설명 |
|--------|-----------|------|------|
| `POST` | `/api/feedback` | `{ type, text, email? }` | 의견 제출 |

---

## 진입 경로

| 출처 | 액션 |
|------|------|
| `MyPage` → `SupportMenuSection` | "의견 보내기" 클릭 → `navigate('/feedback')` |

---

## 이후 교체 지점 (Future Replacement Points)

### 1. 실제 API 연동 (우선순위: HIGH)
```ts
// FeedbackPage.handleSubmit 내부
// 현재 (목업)
await new Promise((resolve) => setTimeout(resolve, 600));

// 교체 후
await api.post('/api/feedback', payload);
```

### 2. 제출 성공 후 뒤로가기 (우선순위: HIGH)
```ts
// 현재
showToast('의견을 보냈습니다...');
// TODO: navigate(-1)

// 교체 후
showToast('의견을 보냈습니다...');
navigate(-1);
```
> 제출 성공 후 즉시 이동할지, 토스트 후 이동할지는 UX 결정 필요.  
> 토스트 duration 이후 자동 이동 방식 추천 (약 1.5~2초).

### 3. MyPage SupportMenuSection 연동 (우선순위: HIGH)
```tsx
// MyPage 내 SupportMenuSection에서
<div className="setting-row" onClick={() => navigate('/feedback')}>
  <span>의견 보내기</span>
</div>
```

### 4. 로그인 사용자 이메일 자동 채우기 (우선순위: LOW)
```tsx
// useAuth 연동 후
const { user } = useAuth();
// FeedbackForm의 email 초기값을 user.email로 설정
```

---

## 미구현 FE ID 목록

| FE ID | 설명 | 우선순위 |
|-------|------|---------|
| FE-FEEDBACK-006 | 제출 성공 후 뒤로가기 이동 | HIGH |
| FE-FEEDBACK-007 | 실제 API POST /api/feedback 연동 | HIGH |
| FE-MYPAGE-009 | MyPage → /feedback 진입 연결 | HIGH |
| FE-FEEDBACK-008 | 로그인 사용자 이메일 자동 채우기 | LOW |
