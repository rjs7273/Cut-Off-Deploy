/* ─────────────────────────────────────────────────────────────────
   TODAYS_PICK — 서브카테고리별 오늘의 추천 영상 ID 매핑
   subCategory = BE en id (PATCH /user/interests 와 동일)
   ───────────────────────────────────────────────────────────────── */

import type { BeCategoryId } from './categoryList';

export interface TodaysPickSubCategory {
  subCategory: BeCategoryId;
  videoId: string;
}

export interface TodaysPickBigCategory {
  bigCategory: string;
  subCategories: TodaysPickSubCategory[];
}

export const TODAYS_PICK: TodaysPickBigCategory[] = [
  {
    bigCategory: '비즈니스',
    subCategories: [
      { subCategory: 'branding', videoId: '000000000001' },
      { subCategory: 'marketing', videoId: '000000000007' },
      { subCategory: 'commerce', videoId: '000000000011' },
      { subCategory: 'tech', videoId: '000000000013' },
      { subCategory: 'business_strategy', videoId: '000000000015' },
      { subCategory: 'business_planning', videoId: '000000000016' },
    ],
  },
  {
    bigCategory: '성장',
    subCategories: [
      { subCategory: 'leadership', videoId: '000000000017' },
      { subCategory: 'productivity', videoId: '000000000021' },
      { subCategory: 'self_development', videoId: '000000000025' },
      { subCategory: 'book_review', videoId: '000000000026' },
    ],
  },
  {
    bigCategory: '문화·라이프',
    subCategories: [
      { subCategory: 'humanities', videoId: '000000000027' },
      { subCategory: 'design', videoId: '000000000029' },
      { subCategory: 'wellness', videoId: '000000000032' },
      { subCategory: 'space', videoId: '000000000034' },
      { subCategory: 'art', videoId: '000000000035' },
      { subCategory: 'fashion_beauty', videoId: '000000000036' },
      { subCategory: 'f_and_b', videoId: '000000000037' },
      { subCategory: 'travel', videoId: '000000000038' },
    ],
  },
  {
    bigCategory: '트렌드',
    subCategories: [
      { subCategory: 'trend', videoId: '000000000039' },
      { subCategory: 'contents', videoId: '000000000040' },
    ],
  },
];
