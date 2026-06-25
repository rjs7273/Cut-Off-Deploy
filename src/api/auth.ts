import { apiClient } from '@/lib/apiClient';
import type {
  AuthTokenResponse,
  MeResponse,
  RefreshTokenResponse,
  SelectedCategory,
} from '@/types/auth';

export async function loginGoogle(idToken: string): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>('/auth/google', { idToken });
  return data;
}

export async function loginApple(identityToken: string): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>('/auth/apple', { identityToken });
  return data;
}

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
  return data;
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
  return data;
}

export async function withdraw(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>('/auth/withdraw');
  return data;
}

export async function fetchMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>('/user/me');
  return data;
}

export async function patchInterests(
  categories: SelectedCategory[],
): Promise<{ success: boolean; categories: SelectedCategory[] }> {
  const { data } = await apiClient.patch<{ success: boolean; categories: SelectedCategory[] }>(
    '/user/interests',
    { categories },
  );
  return data;
}

export interface NotificationSettingPatch {
  alarmAgreed: boolean;
  fcmToken?: string;
  deviceType?: 'IOS' | 'ANDROID' | 'WEB';
}

export async function patchNotificationSetting(
  body: NotificationSettingPatch,
): Promise<{ success: boolean; alarmAgreed: boolean; fcmToken?: string }> {
  const { data } = await apiClient.patch<{
    success: boolean;
    alarmAgreed: boolean;
    fcmToken?: string;
  }>('/user/notification-setting', body);
  return data;
}
