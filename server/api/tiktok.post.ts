import axios from 'axios';
import type { TikTokVideoData, TikTokApiResponse } from '../../types/tiktok';

export default defineEventHandler(async (event): Promise<TikTokApiResponse> => {
  try {
    const body = await readBody(event);
    const { url } = body;

    if (!url || !url.includes('tiktok.com')) {
      return {
        success: false,
        error: 'URL de TikTok inválida'
      };
    }

    // Extraer el ID del video de la URL
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return {
        success: false,
        error: 'No se pudo extraer el ID del video'
      };
    }

    // Intentar obtener datos del video
    const videoData = await fetchTikTokData(url);

    return {
      success: true,
      data: videoData
    };

  } catch (error: any) {
    console.error('Error al procesar TikTok:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener datos de TikTok'
    };
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /\/video\/(\d+)/,
    /\/v\/(\d+)/,
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

async function fetchTikTokData(url: string): Promise<TikTokVideoData> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Referer': 'https://www.tiktok.com/',
    };

    const response = await axios.get(url, { 
      headers,
      timeout: 15000
    });

    const html = response.data;

    // Buscar el JSON embebido en el HTML
    const jsonMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/);
    
    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1]);
      const videoDetail = data?.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct;

      if (videoDetail) {
        return parseCompleteVideoData(url, videoDetail);
      }
    }

    // Método alternativo: buscar SIGI_STATE
    const sigiMatch = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
    if (sigiMatch && sigiMatch[1]) {
      const sigiData = JSON.parse(sigiMatch[1]);
      const videoId = extractVideoId(url);
      const videoDetail = sigiData?.ItemModule?.[videoId];
      
      if (videoDetail) {
        return parseCompleteVideoData(url, videoDetail);
      }
    }

    throw new Error('No se pudo extraer los datos del video');

  } catch (error: any) {
    throw new Error(`Error al obtener datos: ${error.message}`);
  }
}

function parseCompleteVideoData(url: string, videoDetail: any): TikTokVideoData {
  const stats = videoDetail.stats || {};
  const author = videoDetail.author || {};
  const music = videoDetail.music || {};
  const video = videoDetail.video || {};
  
  // Extraer hashtags y menciones
  const description = videoDetail.desc || '';
  const hashtags = extractHashtags(description);
  const mentions = extractMentions(description);
  
  // Calcular métricas
  const views = stats.playCount || 0;
  const likes = stats.diggCount || 0;
  const comments = stats.commentCount || 0;
  const shares = stats.shareCount || 0;
  const saves = stats.collectCount || 0;
  
  const engagementRate = views > 0 ? ((likes + comments + shares) / views) * 100 : 0;
  const likeRate = views > 0 ? (likes / views) * 100 : 0;
  const commentRate = views > 0 ? (comments / views) * 100 : 0;
  const shareRate = views > 0 ? (shares / views) * 100 : 0;
  
  // Score de viralidad (fórmula personalizada)
  const viralityScore = calculateViralityScore(views, likes, comments, shares, saves);
  
  // Fecha de creación
  const createTime = videoDetail.createTime || 0;
  const createDate = createTime > 0 ? new Date(createTime * 1000).toISOString() : '';

  return {
    url,
    metadata: {
      id: videoDetail.id || '',
      duration: video.duration || 0,
      ratio: video.ratio || 'unknown',
      width: video.width || 0,
      height: video.height || 0,
      createTime,
      createDate,
      videoUrl: video.playAddr || video.downloadAddr || '',
      coverUrl: video.cover || video.originCover || '',
      dynamicCoverUrl: video.dynamicCover || ''
    },
    music: music.id ? {
      id: music.id || '',
      title: music.title || '',
      author: music.authorName || '',
      duration: music.duration || 0,
      audioUrl: music.playUrl || '',
      coverUrl: music.coverLarge || music.coverMedium || '',
      isOriginal: music.original || false
    } : undefined,
    author: {
      id: author.id || '',
      uniqueId: author.uniqueId || '',
      nickname: author.nickname || '',
      avatarUrl: author.avatarLarger || author.avatarMedium || author.avatarThumb || '',
      verified: author.verified || false,
      followers: author.followerCount || 0,
      following: author.followingCount || 0,
      totalLikes: author.heartCount || 0,
      totalVideos: author.videoCount || 0,
      signature: author.signature || '',
      privateAccount: author.privateAccount || false
    },
    content: {
      description,
      hashtags,
      mentions,
      stickers: videoDetail.stickersOnItem?.map((s: any) => s.stickerText || s.stickerName).filter(Boolean) || [],
      effects: videoDetail.effectStickers?.map((e: any) => e.name).filter(Boolean) || []
    },
    stats: {
      views,
      likes,
      comments,
      shares,
      saves,
      plays: stats.playCount || 0
    },
    settings: {
      allowComments: !videoDetail.commentDisabled && !videoDetail.officalItem,
      allowDuet: videoDetail.duetEnabled !== false,
      allowStitch: videoDetail.stitchEnabled !== false,
      downloadable: !videoDetail.downloadDisabled,
      isAd: videoDetail.isAd || false
    },
    geo: {
      region: videoDetail.locationCreated || '',
      language: videoDetail.language || ''
    },
    metrics: {
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      likeRate: parseFloat(likeRate.toFixed(2)),
      commentRate: parseFloat(commentRate.toFixed(2)),
      shareRate: parseFloat(shareRate.toFixed(2)),
      completionRate: undefined, // No disponible sin analytics
      viralityScore: parseFloat(viralityScore.toFixed(2))
    }
  };
}

function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w\u00C0-\u017F]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w.]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
}

function calculateViralityScore(
  views: number, 
  likes: number, 
  comments: number, 
  shares: number, 
  saves: number
): number {
  // Fórmula de viralidad ponderada
  // Shares tienen más peso porque indican mayor viralidad
  const shareWeight = 10;
  const saveWeight = 8;
  const commentWeight = 5;
  const likeWeight = 2;
  
  const totalEngagement = 
    (shares * shareWeight) + 
    (saves * saveWeight) + 
    (comments * commentWeight) + 
    (likes * likeWeight);
  
  // Normalizar por vistas (score de 0-100)
  const score = views > 0 ? Math.min((totalEngagement / views) * 100, 100) : 0;
  
  return score;
}
