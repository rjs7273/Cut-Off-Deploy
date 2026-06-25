export type Theme = 'light' | 'dark' | 'system';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  tags: string[];
  saved: boolean;
  watched: boolean;
  cutoffScore?: number;
}

export interface Category {
  id: string;
  name: string;
  group: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  tier: string;
  interests: string[];
  notificationsEnabled: boolean;
}
