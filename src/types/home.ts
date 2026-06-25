import type { VideoCard } from './video';

export type PickStatus = 'normal' | 'skipped';

/** BE VideoCard + 홈 UI optional (date 등 BE 미제공) */
export interface HomeVideo extends VideoCard {
  date?: string;
  discoveryNote?: string;
}
