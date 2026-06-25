/* ─────────────────────────────────────────────────────────────────
   관심사(카테고리) 선택 관련 타입
   ───────────────────────────────────────────────────────────────── */

/** 관심사 단일 항목 */
export interface InterestItem {
  id: string;
  label: string;
}

/** 관심사 그룹 (비즈니스, 성장, ...) */
export interface InterestGroup {
  groupId: string;
  groupLabel: string;
  items: InterestItem[];
}
