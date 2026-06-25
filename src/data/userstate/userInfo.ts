/** 로그인된 사용자 기본 정보 (BE MeResponse.userInfo 와 동일) */
export interface UserInfo {
  userId: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  joinedAt: string;
}

export const USER_INFO: UserInfo | null = null;
