/** true -> 전역 mock, false -> 전역 real API */
export function isMockApi(): boolean {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
}

export const useMockApi = isMockApi;
