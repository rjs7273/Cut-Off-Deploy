import { apiClient } from '@/lib/apiClient';
import type { SubscriptionResponse } from '@/types/subscription';

export async function fetchSubscription(): Promise<SubscriptionResponse> {
  const { data } = await apiClient.get<SubscriptionResponse>('/subscription');
  return data;
}

export async function cancelSubscription(): Promise<{
  success: boolean;
  message: string;
  data: unknown[];
}> {
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    data: unknown[];
  }>('/subscription/cancel');
  return data;
}
