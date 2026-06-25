import { isMockApi } from '@/config/apiMode';
import { submitFeedback } from '@/api/feedback';

export async function sendFeedback(type: string, text: string): Promise<void> {
  if (isMockApi()) {
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  await submitFeedback(type, text);
}
