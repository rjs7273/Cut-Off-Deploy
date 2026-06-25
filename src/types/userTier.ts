export type UserPlan = 'FREE' | 'PREMIUM';
export type UserTier = 'guest' | 'free' | 'subscribed';

export function resolveUserTier(
  isLoggedIn: boolean,
  isSubscribed: boolean,
): UserTier {
  if (!isLoggedIn) return 'guest';
  if (isSubscribed) return 'subscribed';
  return 'free';
}
