/* BE auth · user 응답 (back-end/src/routes/auth.ts, user.ts) */

export interface AuthUser {
  userId: string;
  email: string | undefined;
  nickname: string;
  profileImageUrl: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | undefined;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | undefined;
}

export interface SelectedCategory {
  bigCategory: string;
  subCategories: string[];
}

export interface MeResponse {
  userInfo: {
    userId: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
    joinedAt: string;
  };
  subscription: {
    isSubscribed: boolean;
    subscribedAt: string;
    plan: 'FREE' | 'PREMIUM';
  };
  interests: SelectedCategory[];
  notificationEnabled: boolean;
  onboardingDone: boolean;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}
