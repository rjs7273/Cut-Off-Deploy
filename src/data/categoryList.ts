/* ─────────────────────────────────────────────────────────────────
   CATEGORY_LIST — BE user_categories 컬럼 ID + UI 라벨
   subCategories 값 = PATCH /user/interests Body subCategories
   ───────────────────────────────────────────────────────────────── */

/** BE ALL_CATEGORY_FIELDS (back-end/src/utils/helpers.ts) */
export type BeCategoryId =
  | 'branding'
  | 'business_strategy'
  | 'business_planning'
  | 'marketing'
  | 'commerce'
  | 'tech'
  | 'leadership'
  | 'productivity'
  | 'self_development'
  | 'book_review'
  | 'humanities'
  | 'art'
  | 'space'
  | 'design'
  | 'fashion_beauty'
  | 'f_and_b'
  | 'wellness'
  | 'travel'
  | 'trend'
  | 'contents';

export const CATEGORY_LABELS: Record<BeCategoryId, string> = {
  branding: '브랜딩',
  business_strategy: '경영 전략',
  business_planning: '사업 기획',
  marketing: '마케팅',
  commerce: '커머스',
  tech: '테크',
  leadership: '리더십',
  productivity: '생산성',
  self_development: '자기계발',
  book_review: '책 리뷰',
  humanities: '인문',
  art: '예술',
  space: '공간',
  design: '디자인',
  fashion_beauty: '패션·뷰티',
  f_and_b: 'F&B',
  wellness: '웰니스',
  travel: '여행',
  trend: '트렌드',
  contents: '콘텐츠',
};

export function getCategoryLabel(id: string): string {
  return CATEGORY_LABELS[id as BeCategoryId] ?? id;
}

export interface CategoryNode {
  bigCategory: '비즈니스' | '성장' | '문화·라이프' | '트렌드';
  desc: string;
  subCategories: BeCategoryId[];
}

export const CATEGORY_LIST: CategoryNode[] = [
  {
    bigCategory: '비즈니스',
    desc: '브랜딩, 마케팅, 커머스, 테크 분야에서 볼 만한 영상을 선별했습니다.',
    subCategories: [
      'branding',
      'marketing',
      'commerce',
      'tech',
      'business_strategy',
      'business_planning',
    ],
  },
  {
    bigCategory: '성장',
    desc: '리더십, 생산성, 자기계발 분야의 깊이 있는 영상을 모았습니다.',
    subCategories: ['leadership', 'productivity', 'self_development', 'book_review'],
  },
  {
    bigCategory: '문화·라이프',
    desc: '인문, 디자인, 웰니스 등 일상을 넓혀주는 영상을 선별했습니다.',
    subCategories: [
      'humanities',
      'design',
      'wellness',
      'space',
      'art',
      'fashion_beauty',
      'f_and_b',
      'travel',
    ],
  },
  {
    bigCategory: '트렌드',
    desc: '지금 주목해야 할 흐름과 콘텐츠 트렌드를 다룹니다.',
    subCategories: ['trend', 'contents'],
  },
];

/** BE GET /me interests → UI SelectedCategory[] (대분류 그룹 복원) */
export function interestsFromMe(flatIds: string[]): import('@/types/auth').SelectedCategory[] {
  if (flatIds.length === 0) return [];
  const idSet = new Set(flatIds);
  return CATEGORY_LIST.map((node) => ({
    bigCategory: node.bigCategory,
    subCategories: node.subCategories.filter((id) => idSet.has(id)),
  })).filter((g) => g.subCategories.length > 0);
}

/** UI SelectedCategory[] → BE PATCH flat subCategories (중복 제거) */
export function interestsToPatchBody(
  categories: import('@/types/auth').SelectedCategory[],
): import('@/types/auth').SelectedCategory[] {
  const ids = new Set<string>();
  for (const cat of categories) {
    for (const sub of cat.subCategories) ids.add(sub);
  }
  return [{ bigCategory: '전체 관심사', subCategories: [...ids] }];
}
