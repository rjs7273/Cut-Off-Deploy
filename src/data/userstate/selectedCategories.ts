import type { SelectedCategory } from '@/types/auth';

export type { SelectedCategory };

export const SELECTED_CATEGORIES: SelectedCategory[] = [];

export function keepSingleSelectedCategory(cats: SelectedCategory[]): SelectedCategory[] {
  if (!cats.length) return [];
  const first = cats[0];
  return [{ bigCategory: first.bigCategory, subCategories: first.subCategories.slice(0, 1) }];
}
