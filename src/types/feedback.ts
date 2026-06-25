/* ─────────────────────────────────────────────────────────────────
   의견 보내기 관련 타입
   ───────────────────────────────────────────────────────────────── */

/** 의견 유형 */
export type FeedbackType = '개선 제안' | '버그 신고' | '콘텐츠 문의' | '기타';

/** 의견 제출 payload */
export interface FeedbackPayload {
  type: FeedbackType;
  text: string;
  /** 선택 입력 — 비어있으면 제외 */
  email?: string;
}

/** 의견 유형 선택지 목록 */
export const FEEDBACK_TYPES: FeedbackType[] = [
  '개선 제안',
  '버그 신고',
  '콘텐츠 문의',
  '기타',
];
