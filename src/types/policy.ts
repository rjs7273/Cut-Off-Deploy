/* ─────────────────────────────────────────────────────────────────
   정책 문서 관련 타입
   이용약관 / 개인정보처리방침 공통
   ───────────────────────────────────────────────────────────────── */

/** 정책 문서 유형 */
export type PolicyType = 'terms' | 'privacy';

/** 정책 문서의 단일 섹션 */
export interface PolicySection {
  title: string;
  body: string;
}

/** 문서 하단 문의 정보 박스 */
export interface PolicyContact {
  /** ex) "문의" | "개인정보 문의" */
  contactLabel: string;
  email: string;
  operator: string;
  effectiveDate: string;
}

/** 정책 문서 전체 */
export interface PolicyDocument {
  type: PolicyType;
  /** 화면에 표시될 문서 제목 ex) "이용약관" */
  title: string;
  /** 시행일 표시용 문자열 ex) "2025년 3월 1일" */
  effectiveDate: string;
  sections: PolicySection[];
  contact: PolicyContact;
}
