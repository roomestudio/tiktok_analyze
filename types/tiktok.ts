export interface TikTokVideoMetadata {
  id: string;
  duration: number;
  ratio: string;
  width: number;
  height: number;
  createTime: number;
  createDate: string;
  videoUrl?: string;
  coverUrl?: string;
  dynamicCoverUrl?: string;
}

export interface TikTokMusicData {
  id: string;
  title: string;
  author: string;
  duration: number;
  audioUrl?: string;
  coverUrl?: string;
  isOriginal: boolean;
}

export interface TikTokAuthorData {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarUrl?: string;
  verified: boolean;
  followers: number;
  following: number;
  totalLikes: number;
  totalVideos: number;
  signature: string;
  privateAccount: boolean;
}

export interface TikTokContentData {
  description: string;
  hashtags: string[];
  mentions: string[];
  stickers: string[];
  effects: string[];
}

export interface TikTokEngagementStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  plays: number;
}

export interface TikTokSettings {
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  downloadable: boolean;
  isAd: boolean;
}

export interface TikTokGeoData {
  region?: string;
  language?: string;
}

export interface TikTokMetrics {
  engagementRate: number;
  likeRate: number;
  commentRate: number;
  shareRate: number;
  completionRate?: number;
  viralityScore: number;
}

export interface TikTokVideoData {
  url: string;
  metadata: TikTokVideoMetadata;
  music?: TikTokMusicData;
  author: TikTokAuthorData;
  content: TikTokContentData;
  stats: TikTokEngagementStats;
  settings: TikTokSettings;
  geo: TikTokGeoData;
  metrics: TikTokMetrics;
  error?: string;
}

export interface TikTokApiResponse {
  success: boolean;
  data?: TikTokVideoData;
  error?: string;
}
