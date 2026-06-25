import { apiClient } from '@/lib/apiClient';

export async function submitFeedback(
  type: string,
  text: string,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.post<{ success: boolean }>('/feedback', { type, text });
  return data;
}
