export interface Episode {
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface CastMember {
  name: string;
  role: string;
  image: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  genre: string;
  year: number;
  rating?: number;
  thumbnail: string;
  description?: string;
  director?: string;
  cast?: CastMember[];
  seasons?: Season[];
  maturityRating?: string;
  reason: string;
  badge?: string;
}

export interface WatchProgress {
  itemId: string;
  progress: number; // 0–100
  episode?: string;
  season?: number;
  episodeNum?: number;
}
