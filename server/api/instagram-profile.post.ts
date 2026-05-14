import axios from 'axios'
import { load } from 'cheerio'
import type { InstagramDataset, InstagramApiResponse, InstagramPost } from '../../types/instagram'

export default defineEventHandler(async (event): Promise<InstagramApiResponse> => {
  try {
    const body = await readBody(event)
    const { username } = body

    if (!username || typeof username !== 'string') {
      return { success: false, error: 'Username de Instagram inválido' }
    }

    const clean = username.replace('@', '').trim()
    const dataset = await scrapeInstagramProfile(clean)

    return { success: true, data: dataset }
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al obtener datos de Instagram' }
  }
})

async function scrapeInstagramProfile(username: string): Promise<InstagramDataset> {
  const errors: string[] = []
  const url = `https://www.instagram.com/${username}/`

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
  }

  const response = await axios.get(url, { headers, timeout: 20000 })
  const html = response.data
  const $ = load(html)

  let sharedData: any = null

  // Intentar extraer __additionalDataLoaded o window._sharedData
  $('script').each((_, el) => {
    const content = $(el).html() || ''
    if (content.includes('"ProfilePage"') || content.includes('"graphql"')) {
      try {
        const match = content.match(/window\._sharedData\s*=\s*({.+?});\s*<\/script>/)
        if (match) sharedData = JSON.parse(match[1])
      } catch {}
    }
    if (!sharedData && content.includes('window.__additionalDataLoaded')) {
      try {
        const match = content.match(/window\.__additionalDataLoaded\s*\(\s*'[^']+'\s*,\s*({.+})\s*\)/)
        if (match) sharedData = { entry_data: { ProfilePage: [{ graphql: JSON.parse(match[1]) }] } }
      } catch {}
    }
  })

  // Intentar con script type application/json
  if (!sharedData) {
    $('script[type="application/json"]').each((_, el) => {
      const content = $(el).html() || ''
      if (content.includes('edge_followed_by') || content.includes('biography')) {
        try {
          const parsed = JSON.parse(content)
          const user = findUserNode(parsed)
          if (user) sharedData = { entry_data: { ProfilePage: [{ graphql: { user } }] } }
        } catch {}
      }
    })
  }

  const userNode = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user

  if (!userNode) {
    if (html.includes('login') && html.includes('This page isn')) {
      throw new Error('Cuenta privada o no encontrada. Instagram requiere login para ver este perfil.')
    }
    errors.push('No se pudo extraer datos estructurados. Instagram puede haber bloqueado la solicitud.')
  }

  return buildDataset(username, userNode, errors)
}

function findUserNode(obj: any): any {
  if (!obj || typeof obj !== 'object') return null
  if (obj.username && obj.edge_followed_by) return obj
  for (const key of Object.keys(obj)) {
    const result = findUserNode(obj[key])
    if (result) return result
  }
  return null
}

function extractEntities(text: string) {
  const hashtags = (text.match(/#[\w\u00C0-\u017F]+/g) || []).map(h => h.slice(1))
  const mentions = (text.match(/@[\w.]+/g) || []).map(m => m.slice(1))
  const urls = (text.match(/https?:\/\/[^\s]+/g) || [])
  return { raw_text: text, hashtags, mentions, urls }
}

function getDayOfWeek(ts: number): string {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(ts * 1000).getDay()]
}

function getAccountSizeCategory(followers: number | null): 'nano' | 'micro' | 'mid' | 'macro' | 'mega' | null {
  if (followers === null) return null
  if (followers < 10000) return 'nano'
  if (followers < 100000) return 'micro'
  if (followers < 500000) return 'mid'
  if (followers < 1000000) return 'macro'
  return 'mega'
}

function parsePosts(edges: any[], followersCount: number | null): InstagramPost[] {
  return (edges || []).map((edge: any) => {
    const node = edge.node || edge
    const ts: number = node.taken_at_timestamp || 0
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || ''
    const likes = node.edge_media_preview_like?.count ?? node.edge_liked_by?.count ?? null
    const comments = node.edge_media_to_comment?.count ?? null
    const views = node.video_view_count ?? null
    const isVideo = node.is_video || node.__typename === 'GraphVideo'
    const isCarousel = node.__typename === 'GraphSidecar'
    const isReel = isVideo && node.product_type === 'clips'

    const type = isReel ? 'reel' : isCarousel ? 'carousel' : isVideo ? 'video' : 'image'

    const carouselItems = (node.edge_sidecar_to_children?.edges || []).map((c: any, i: number) => ({
      index: i,
      type: c.node?.is_video ? 'video' : 'image',
      url: c.node?.display_url || '',
    }))

    const taggedUsers = (node.edge_media_to_tagged_user?.edges || []).map((t: any) => ({
      username: t.node?.user?.username || '',
      full_name: t.node?.user?.full_name || '',
      is_verified: t.node?.user?.is_verified || false,
    }))

    const loc = node.location
    const engRate = (likes !== null && comments !== null && followersCount)
      ? parseFloat((((likes + comments) / followersCount) * 100).toFixed(2))
      : null

    return {
      id: node.id || '',
      shortcode: node.shortcode || '',
      url: `https://www.instagram.com/p/${node.shortcode}/`,
      type,
      timestamp: ts ? new Date(ts * 1000).toISOString() : '',
      timestamp_unix: ts,
      day_of_week: ts ? getDayOfWeek(ts) : '',
      hour_of_day: ts ? new Date(ts * 1000).getHours() : 0,
      caption,
      caption_entities: extractEntities(caption),
      accessibility_caption: node.accessibility_caption || '',
      media: {
        thumbnail_url: node.thumbnail_src || node.display_url || '',
        display_url: node.display_url || '',
        video_url: node.video_url || null,
        video_duration_seconds: node.video_duration ?? null,
        video_view_count: views,
        has_audio: node.has_audio ?? null,
        carousel_media_count: isCarousel ? carouselItems.length : null,
        carousel_items: carouselItems,
      },
      engagement: {
        likes_count: likes,
        comments_count: comments,
        views_count: views,
        reach_count: null,
        impressions_count: null,
        saved_count: null,
        shares_count: null,
        engagement_rate: engRate,
      },
      location: loc ? {
        id: loc.id || null,
        name: loc.name || null,
        city: loc.city || null,
        country_code: loc.country_code || null,
        lat: loc.lat ?? null,
        lng: loc.lng ?? null,
      } : null,
      tagged_users: taggedUsers,
      is_paid_partnership: node.is_paid_partnership || false,
      music: {
        has_music: !!(node.clips_music_attribution_info),
        music_title: node.clips_music_attribution_info?.song_name || null,
        music_artist: node.clips_music_attribution_info?.artist_name || null,
        music_is_original_audio: node.clips_music_attribution_info?.uses_original_audio ?? null,
      },
      comments_disabled: node.comments_disabled || false,
      likes_disabled: node.like_and_view_counts_disabled || false,
    }
  })
}

function buildDataset(username: string, user: any, errors: string[]): InstagramDataset {
  const followers: number | null = user?.edge_followed_by?.count ?? null
  const following: number | null = user?.edge_follow?.count ?? null
  const postsCount: number | null = user?.edge_owner_to_timeline_media?.count ?? null

  const postEdges = user?.edge_owner_to_timeline_media?.edges || []
  const posts = parsePosts(postEdges, followers)

  // --- Hashtag analysis ---
  const hashtagFreq: Record<string, { count: number; totalLikes: number; totalComments: number; posts: number }> = {}
  posts.forEach(p => {
    p.caption_entities.hashtags.forEach(tag => {
      if (!hashtagFreq[tag]) hashtagFreq[tag] = { count: 0, totalLikes: 0, totalComments: 0, posts: 0 }
      hashtagFreq[tag].count++
      hashtagFreq[tag].totalLikes += p.engagement.likes_count || 0
      hashtagFreq[tag].totalComments += p.engagement.comments_count || 0
      hashtagFreq[tag].posts++
    })
  })
  const hashtagFreqResult: Record<string, any> = {}
  Object.entries(hashtagFreq).forEach(([tag, v]) => {
    hashtagFreqResult[`#${tag}`] = {
      count: v.count,
      avg_likes_when_used: v.posts ? Math.round(v.totalLikes / v.posts) : 0,
      avg_comments_when_used: v.posts ? Math.round(v.totalComments / v.posts) : 0,
      engagement_rate_when_used: (followers && v.posts)
        ? parseFloat((((v.totalLikes + v.totalComments) / v.posts / followers) * 100).toFixed(2))
        : 0,
    }
  })
  const allHashtags = Object.keys(hashtagFreqResult)
  const top10Hashtags = allHashtags.sort((a, b) => hashtagFreqResult[b].count - hashtagFreqResult[a].count).slice(0, 10)
  const hashtagsPerPost = posts.map(p => p.caption_entities.hashtags.length)

  // --- Posting patterns ---
  const byHour: Record<string, number> = {}
  const byDay: Record<string, number> = {}
  const byMonth: Record<string, number> = {}
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  for (let i = 0; i < 24; i++) byHour[String(i)] = 0
  ;['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].forEach(d => byDay[d] = 0)
  months.forEach(m => byMonth[m] = 0)

  posts.forEach(p => {
    if (p.timestamp_unix) {
      byHour[String(p.hour_of_day)] = (byHour[String(p.hour_of_day)] || 0) + 1
      byDay[p.day_of_week] = (byDay[p.day_of_week] || 0) + 1
      byMonth[months[new Date(p.timestamp_unix * 1000).getMonth()]]++
    }
  })

  const now = Date.now() / 1000
  const last30 = posts.filter(p => p.timestamp_unix && (now - p.timestamp_unix) < 30 * 86400).length
  const last90 = posts.filter(p => p.timestamp_unix && (now - p.timestamp_unix) < 90 * 86400).length

  // Best performing hour/day by avg engagement
  const hourEng: Record<string, number[]> = {}
  const dayEng: Record<string, number[]> = {}
  posts.forEach(p => {
    const eng = (p.engagement.likes_count || 0) + (p.engagement.comments_count || 0)
    const h = String(p.hour_of_day)
    const d = p.day_of_week
    if (!hourEng[h]) hourEng[h] = []
    if (!dayEng[d]) dayEng[d] = []
    hourEng[h].push(eng)
    dayEng[d].push(eng)
  })
  const avgHour = (h: string) => hourEng[h]?.reduce((a, b) => a + b, 0) / (hourEng[h]?.length || 1)
  const avgDay = (d: string) => dayEng[d]?.reduce((a, b) => a + b, 0) / (dayEng[d]?.length || 1)
  const bestHour = Object.keys(hourEng).sort((a, b) => avgHour(b) - avgHour(a))[0] ?? null
  const bestDay = Object.keys(dayEng).sort((a, b) => avgDay(b) - avgDay(a))[0] ?? null

  // --- Engagement metrics ---
  const totalLikes = posts.reduce((s, p) => s + (p.engagement.likes_count || 0), 0)
  const totalComments = posts.reduce((s, p) => s + (p.engagement.comments_count || 0), 0)
  const totalViews = posts.reduce((s, p) => s + (p.engagement.views_count || 0), 0)
  const reels = posts.filter(p => p.type === 'reel')
  const images = posts.filter(p => p.type === 'image')
  const carousels = posts.filter(p => p.type === 'carousel')
  const videos = posts.filter(p => p.type === 'video')

  const avgEng = (arr: InstagramPost[]) => arr.length
    ? parseFloat((arr.reduce((s, p) => s + (p.engagement.engagement_rate || 0), 0) / arr.length).toFixed(2))
    : 0

  const top10ByLikes = [...posts].sort((a, b) => (b.engagement.likes_count || 0) - (a.engagement.likes_count || 0)).slice(0, 10).map(p => p.shortcode)
  const top10ByComments = [...posts].sort((a, b) => (b.engagement.comments_count || 0) - (a.engagement.comments_count || 0)).slice(0, 10).map(p => p.shortcode)
  const top10ByEng = [...posts].sort((a, b) => (b.engagement.engagement_rate || 0) - (a.engagement.engagement_rate || 0)).slice(0, 10).map(p => p.shortcode)

  // --- Social graph ---
  const mentionCount: Record<string, number> = {}
  const tagCount: Record<string, number> = {}
  posts.forEach(p => {
    p.caption_entities.mentions.forEach(m => { mentionCount[m] = (mentionCount[m] || 0) + 1 })
    p.tagged_users.forEach(t => { tagCount[t.username] = (tagCount[t.username] || 0) + 1 })
  })

  // --- Geolocation ---
  const locCount: Record<string, { name: string; city: string | null; country: string | null; count: number }> = {}
  posts.forEach(p => {
    if (p.location?.name) {
      const k = p.location.name
      if (!locCount[k]) locCount[k] = { name: k, city: p.location.city, country: p.location.country_code, count: 0 }
      locCount[k].count++
    }
  })

  // --- Audio ---
  const songCount: Record<string, { title: string; artist: string; count: number }> = {}
  posts.forEach(p => {
    if (p.music.has_music && p.music.music_title) {
      const k = p.music.music_title
      if (!songCount[k]) songCount[k] = { title: k, artist: p.music.music_artist || '', count: 0 }
      songCount[k].count++
    }
  })

  const sortedPosts = [...posts].filter(p => p.timestamp_unix).sort((a, b) => a.timestamp_unix - b.timestamp_unix)
  const missingFields = ['stories', 'highlights', 'followers_sample', 'following', 'reach', 'impressions', 'saves', 'shares']

  return {
    profile: {
      username: user?.username || username,
      full_name: user?.full_name || '',
      biography: user?.biography || '',
      biography_with_entities: extractEntities(user?.biography || ''),
      external_url: user?.external_url || null,
      profile_pic_url: user?.profile_pic_url || '',
      profile_pic_url_hd: user?.profile_pic_url_hd || '',
      followers_count: followers,
      following_count: following,
      posts_count: postsCount,
      is_verified: user?.is_verified || false,
      is_private: user?.is_private || false,
      is_business_account: user?.is_business_account || false,
      is_professional_account: user?.is_professional_account || false,
      account_type: user?.is_business_account ? 'business' : user?.is_professional_account ? 'creator' : 'personal',
      business_category_name: user?.business_category_name || null,
      total_igtv_videos: user?.edge_felix_video_timeline?.count ?? null,
      has_guides: user?.has_guides ?? null,
      has_channel: user?.has_channel ?? null,
    },
    posts,
    highlights: [],
    comments: [],
    stories: [],
    followers_sample: {},
    following: {},
    posting_patterns: {
      posts_by_hour: byHour,
      posts_by_day_of_week: byDay,
      posts_by_month: byMonth,
      avg_days_between_posts: sortedPosts.length > 1
        ? parseFloat(((sortedPosts[sortedPosts.length - 1].timestamp_unix - sortedPosts[0].timestamp_unix) / 86400 / (sortedPosts.length - 1)).toFixed(1))
        : null,
      posting_frequency_last_30_days: last30,
      posting_frequency_last_90_days: last90,
      best_performing_hour: bestHour !== null ? parseInt(bestHour) : null,
      best_performing_day: bestDay,
    },
    hashtags_analysis: {
      all_hashtags_ever_used: allHashtags,
      unique_hashtags_count: allHashtags.length,
      total_hashtag_uses: hashtagsPerPost.reduce((a, b) => a + b, 0),
      avg_hashtags_per_post: posts.length ? parseFloat((hashtagsPerPost.reduce((a, b) => a + b, 0) / posts.length).toFixed(1)) : 0,
      max_hashtags_in_one_post: Math.max(0, ...hashtagsPerPost),
      min_hashtags_in_one_post: Math.min(0, ...hashtagsPerPost),
      posts_without_hashtags: hashtagsPerPost.filter(n => n === 0).length,
      hashtag_frequency: hashtagFreqResult,
      top_10_by_frequency: top10Hashtags,
    },
    engagement_metrics: {
      overall: {
        total_likes: totalLikes,
        total_comments: totalComments,
        total_views: totalViews,
        avg_likes_per_post: posts.length ? parseFloat((totalLikes / posts.length).toFixed(1)) : 0,
        avg_comments_per_post: posts.length ? parseFloat((totalComments / posts.length).toFixed(1)) : 0,
        avg_views_per_reel: reels.length ? parseFloat((reels.reduce((s, p) => s + (p.engagement.views_count || 0), 0) / reels.length).toFixed(0)) : 0,
        engagement_rate_by_followers: (followers && posts.length)
          ? parseFloat((((totalLikes + totalComments) / posts.length / followers) * 100).toFixed(2))
          : null,
        like_to_comment_ratio: totalComments ? parseFloat((totalLikes / totalComments).toFixed(2)) : 0,
      },
      by_content_type: {
        images: { count: images.length, avg_likes: images.length ? parseFloat((images.reduce((s, p) => s + (p.engagement.likes_count || 0), 0) / images.length).toFixed(1)) : 0, avg_comments: images.length ? parseFloat((images.reduce((s, p) => s + (p.engagement.comments_count || 0), 0) / images.length).toFixed(1)) : 0, avg_engagement_rate: avgEng(images) },
        carousels: { count: carousels.length, avg_likes: carousels.length ? parseFloat((carousels.reduce((s, p) => s + (p.engagement.likes_count || 0), 0) / carousels.length).toFixed(1)) : 0, avg_comments: carousels.length ? parseFloat((carousels.reduce((s, p) => s + (p.engagement.comments_count || 0), 0) / carousels.length).toFixed(1)) : 0, avg_engagement_rate: avgEng(carousels) },
        reels: { count: reels.length, avg_likes: reels.length ? parseFloat((reels.reduce((s, p) => s + (p.engagement.likes_count || 0), 0) / reels.length).toFixed(1)) : 0, avg_comments: reels.length ? parseFloat((reels.reduce((s, p) => s + (p.engagement.comments_count || 0), 0) / reels.length).toFixed(1)) : 0, avg_views: reels.length ? parseFloat((reels.reduce((s, p) => s + (p.engagement.views_count || 0), 0) / reels.length).toFixed(0)) : 0, avg_engagement_rate: avgEng(reels) },
        videos: { count: videos.length, avg_likes: videos.length ? parseFloat((videos.reduce((s, p) => s + (p.engagement.likes_count || 0), 0) / videos.length).toFixed(1)) : 0, avg_comments: videos.length ? parseFloat((videos.reduce((s, p) => s + (p.engagement.comments_count || 0), 0) / videos.length).toFixed(1)) : 0, avg_views: videos.length ? parseFloat((videos.reduce((s, p) => s + (p.engagement.views_count || 0), 0) / videos.length).toFixed(0)) : 0, avg_engagement_rate: avgEng(videos) },
      },
      top_10_posts_by_likes: top10ByLikes,
      top_10_posts_by_comments: top10ByComments,
      top_10_posts_by_engagement_rate: top10ByEng,
    },
    social_graph: {
      accounts_mentioned_in_captions: Object.entries(mentionCount).map(([username, mention_count]) => ({ username, mention_count })).sort((a, b) => b.mention_count - a.mention_count),
      accounts_tagged_in_posts: Object.entries(tagCount).map(([username, tag_count]) => ({ username, tag_count })).sort((a, b) => b.tag_count - a.tag_count),
    },
    shopping: { has_shopping_enabled: user?.is_shopping_enabled || false },
    links: {
      bio_link: {
        url: user?.external_url || null,
        type: user?.external_url ? 'direct_website' : null,
      },
    },
    audio_analysis: {
      reels_with_original_audio: reels.filter(p => p.music.music_is_original_audio).length,
      reels_with_trending_music: reels.filter(p => p.music.has_music && !p.music.music_is_original_audio).length,
      most_used_songs: Object.values(songCount).sort((a, b) => b.count - a.count).slice(0, 10).map(s => ({ title: s.title, artist: s.artist, uses_count: s.count })),
    },
    geolocation: {
      posts_with_location: posts.filter(p => p.location).length,
      posts_without_location: posts.filter(p => !p.location).length,
      most_tagged_locations: Object.values(locCount).sort((a, b) => b.count - a.count).slice(0, 10).map(l => ({ name: l.name, city: l.city, country: l.country, count: l.count })),
    },
    community_management: {
      total_comments_received: totalComments,
      top_commenters: [],
    },
    temporal_trends: {},
    benchmarks: {
      account_size_category: getAccountSizeCategory(followers),
    },
    extraction_metadata: {
      extracted_at: new Date().toISOString(),
      extractor_version: '1.0.0',
      data_completeness_percent: user ? 40 : 5,
      posts_extracted: posts.length,
      posts_total: postsCount,
      errors,
      missing_fields: missingFields,
      last_post_date: sortedPosts.length ? sortedPosts[sortedPosts.length - 1].timestamp : null,
      first_post_date: sortedPosts.length ? sortedPosts[0].timestamp : null,
      method: 'public_scraping',
    },
  }
}
