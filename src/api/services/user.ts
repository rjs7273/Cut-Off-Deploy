import { isMockApi } from '@/config/apiMode';
import { patchInterests, patchNotificationSetting } from '@/api/auth';
import type { NotificationSettingPatch } from '@/api/auth';
import type { SelectedCategory } from '@/types/auth';

export async function updateInterests(
  categories: SelectedCategory[],
): Promise<void> {
  if (isMockApi()) return;
  await patchInterests(categories);
}

export async function updateNotificationSetting(
  body: NotificationSettingPatch,
): Promise<void> {
  if (isMockApi()) return;
  await patchNotificationSetting(body);
}
