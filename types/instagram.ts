export interface InstagramProfile {
  username: string
  full_name: string
  biography: string
  biography_with_entities: {
    raw_text: string
    hashtags: string[]
    mentions: string[]
    urls: string[]
  }
  external_url: string | null
  profile_pic_url: string
  profile_pic_url_hd: string
  followers_count: number | null
  following_count: number | null
  posts_count: number | null
  is_verified: boolean
  is_private: boolean
  is_business_account: boolean
  is_professional_account: boolean
  account_type: 'personal' | 'creator' | 'business' | null
  business_category_name: string | null
  total_igtv_videos: number | null
  has_guides: boolean | null
  has_channel: boolean | null
}

export interface InstagramPost {
  id: string
  shortcode: string
  url: string
  type: 'image' | 'video' | 'carousel' | 'reel' | 'igtv'
  timestamp: string
  timestamp_unix: number
  day_of_week: string
  hour_of_day: number
  caption: string
  caption_entities: {
    hashtags: string[]
    mentions: string[]
    urls: string[]
  }
  accessibility_caption: string
  media: {
    thumbnail_url: string
    display_url: string
    video_url: string | null
    video_duration_seconds: number | null
    video_view_count: number | null
    has_audio: boolean | null
    carousel_media_count: number | null
    carousel_items: Array<{
      index: number
      type: 'image' | 'video'
      url: string
    }>
  }
  engagement: {
    likes_count: number | null
    comments_count: number | null
    views_count: number | null
    reach_count: null
    impressions_count: null
    saved_count: null
    shares_count: null
    engagement_rate: number | null
  }
  location: {
    id: string | null
    name: string | null
    city: string | null
    country_code: string | null
    lat: number | null
    lng: number | null
  } | null
  tagged_users: Array<{ username: string; full_name: string; is_verified: boolean }>
  is_paid_partnership: boolean
  music: {
    has_music: boolean
    music_title: string | null
    music_artist: string | null
    music_is_original_audio: boolean | null
  }
  comments_disabled: boolean
  likes_disabled: boolean
}

export interface InstagramHashtagAnalysis {
  all_hashtags_ever_used: string[]
  unique_hashtags_count: number
  total_hashtag_uses: number
  avg_hashtags_per_post: number
  max_hashtags_in_one_post: number
  min_hashtags_in_one_post: number
  posts_without_hashtags: number
  hashtag_frequency: Record<string, {
    count: number
    avg_likes_when_used: number
    avg_comments_when_used: number
    engagement_rate_when_used: number
  }>
  top_10_by_frequency: string[]
}

export interface InstagramPostingPatterns {
  posts_by_hour: Record<string, number>
  posts_by_day_of_week: Record<string, number>
  posts_by_month: Record<string, number>
  avg_days_between_posts: number | null
  posting_frequency_last_30_days: number
  posting_frequency_last_90_days: number
  best_performing_hour: number | null
  best_performing_day: string | null
}

export interface InstagramEngagementMetrics {
  overall: {
    total_likes: number
    total_comments: number
    total_views: number
    avg_likes_per_post: number
    avg_comments_per_post: number
    avg_views_per_reel: number
    engagement_rate_by_followers: number | null
    like_to_comment_ratio: number
  }
  by_content_type: {
    images: { count: number; avg_likes: number; avg_comments: number; avg_engagement_rate: number | null }
    carousels: { count: number; avg_likes: number; avg_comments: number; avg_engagement_rate: number | null }
    reels: { count: number; avg_likes: number; avg_comments: number; avg_views: number; avg_engagement_rate: number | null }
    videos: { count: number; avg_likes: number; avg_comments: number; avg_views: number; avg_engagement_rate: number | null }
  }
  top_10_posts_by_likes: string[]
  top_10_posts_by_comments: string[]
  top_10_posts_by_engagement_rate: string[]
}

export interface InstagramExtractionMetadata {
  extracted_at: string
  extractor_version: string
  data_completeness_percent: number
  posts_extracted: number
  posts_total: number | null
  errors: string[]
  missing_fields: string[]
  last_post_date: string | null
  first_post_date: string | null
  method: 'public_scraping' | 'graph_api'
}

export interface InstagramDataset {
  profile: InstagramProfile
  posts: InstagramPost[]
  highlights: []
  comments: []
  stories: []
  followers_sample: {}
  following: {}
  posting_patterns: InstagramPostingPatterns
  hashtags_analysis: InstagramHashtagAnalysis
  engagement_metrics: InstagramEngagementMetrics
  social_graph: {
    accounts_mentioned_in_captions: Array<{ username: string; mention_count: number }>
    accounts_tagged_in_posts: Array<{ username: string; tag_count: number }>
  }
  shopping: { has_shopping_enabled: boolean }
  links: {
    bio_link: { url: string | null; type: string | null }
  }
  audio_analysis: {
    reels_with_original_audio: number
    reels_with_trending_music: number
    most_used_songs: Array<{ title: string; artist: string; uses_count: number }>
  }
  geolocation: {
    posts_with_location: number
    posts_without_location: number
    most_tagged_locations: Array<{ name: string; city: string | null; country: string | null; count: number }>
  }
  community_management: {
    total_comments_received: number
    top_commenters: Array<{ username: string; comments_count: number }>
  }
  temporal_trends: {}
  benchmarks: {
    account_size_category: 'nano' | 'micro' | 'mid' | 'macro' | 'mega' | null
  }
  extraction_metadata: InstagramExtractionMetadata
}

export interface InstagramApiResponse {
  success: boolean
  data?: InstagramDataset
  error?: string
}
