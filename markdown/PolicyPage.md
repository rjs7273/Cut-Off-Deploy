# PolicyPage 구현 명세

> **컴포넌트 ID** : CMP-POLICY-001  
> **파일** : `src/pages/PolicyPage.tsx`  
> **라우트** : `/terms` (이용약관) · `/privacy` (개인정보처리방침)  
> **레이아웃** : AppLayout 사용 (드로어 + 전역 오버레이 포함)  
> **데이터 의존** : ⚠️ `src/mocks/policyData.ts` 정적 문자열로 관리 중

---

## 서브 컴포넌트

| 컴포넌트 | ID | 파일 | 역할 |
|----------|----|------|------|
| `PolicyViewer` | CMP-POLICY-002 | `src/components/policy/PolicyViewer.tsx` | 문서 제목·시행일·섹션·문의 박스 렌더링 |

---

## Props

| Prop | 타입 | 설명 |
|------|------|------|
| `policyType` | `'terms' \| 'privacy'` | 표시할 문서 종류 결정 |

---

## 데이터 구조

**파일** : `src/mocks/policyData.ts` · 타입 정의 : `src/types/policy.ts`

```
PolicyDocument:
  type            PolicyType          'terms' | 'privacy'
  title           string              "이용약관" | "개인정보처리방침"
  effectiveDate   string              "2025년 3월 1일"
  sections        PolicySection[]
  contact         PolicyContact

PolicySection:
  title  string   섹션 제목 ex) "제1조 (목적)"
  body   string   섹션 본문

PolicyContact:
  contactLabel    string   "문의" | "개인정보 문의"
  email           string   "hello@cutoff.app"
  operator        string   "Cut-off 팀"
  effectiveDate   string   "2025년 3월 1일"
```

---

## 라우트 매핑

| 경로 | policyType | 문서 |
|------|------------|------|
| `/terms` | `"terms"` | 이용약관 (6개 조항) |
| `/privacy` | `"privacy"` | 개인정보처리방침 (6개 항목) |

---

## 레이아웃 구조

```
PageContainer (scrollable=false)
├── AppHeader (variant="default", title, showBack)
└── PolicyViewer
    ├── h1 (문서 제목 — 18px/700/text-fg/tracking-[-0.4px])
    ├── p  (시행일   — 12px/text-fg-disabled)
    ├── div.section × N  (mb-[20px])
    │    ├── p.title  (14px/700/text-fg/mb-[6px])
    │    └── p.body   (13px/text-fg-muted/leading-[1.75])
    └── div.contact-box  (mt-[28px] px-[16px] py-[14px] bg-surface-sub rounded-[12px])
         └── p  (12px/text-fg-muted/leading-[1.7])
```

---

## 진입 경로

| 출처 | 액션 |
|------|------|
| `MyPage` → `SupportMenuSection` | "이용약관" 또는 "개인정보처리방침" 클릭 → `navigate('/terms')` / `navigate('/privacy')` |
| `TermsConsentModal` | "이용약관 보기" 링크 클릭 → `navigate('/terms')` |

---

## 이후 교체 지점 (Future Replacement Points)

### 1. 서버 API 또는 원격 CMS 연동 (우선순위: LOW)
```ts
// 현재 (정적 파일)
const doc = POLICY_DOCUMENTS[policyType];

// 교체 후
const { data: doc } = useQuery({
  queryKey: ['policy', policyType],
  queryFn: () => api.get(`/api/policy/${policyType}`),
});
```

### 2. 문서 버전 관리 (우선순위: LOW)
- 약관 개정 시 `effectiveDate`와 `sections` 내용 업데이트
- 히스토리 보기 기능 필요 시 `version` 필드 추가

### 3. MyPage SupportMenuSection 연동 (우선순위: HIGH)
```tsx
// MyPage 내 SupportMenuSection에서
<div className="setting-row" onClick={() => navigate('/terms')}>
  <span>이용약관</span>
</div>
<div className="setting-row" onClick={() => navigate('/privacy')}>
  <span>개인정보처리방침</span>
</div>
```

### 4. TermsConsentModal 내 링크 연동 (우선순위: HIGH)
```tsx
// TermsConsentModal 내에서 약관 상세 링크 클릭 시
onOpenPolicy={(type) => navigate(type === 'terms' ? '/terms' : '/privacy')}
```

---

## 미구현 FE ID 목록

| FE ID | 설명 | 우선순위 |
|-------|------|---------|
| FE-POLICY-005 | MyPage SupportMenuSection → /terms 이동 연결 | HIGH |
| FE-POLICY-006 | MyPage SupportMenuSection → /privacy 이동 연결 | HIGH |
| FE-POLICY-007 | TermsConsentModal 약관 링크 → /terms 이동 연결 | HIGH |
