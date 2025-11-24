import type { TikTokVideoData } from '../../types/tiktok';

/**
 * Endpoint de prueba que devuelve datos mock de TikTok
 * Útil para desarrollo y testing sin hacer requests reales
 * 
 * GET /api/tiktok-mock
 */
export default defineEventHandler((): { success: boolean; data: TikTokVideoData } => {
  const mockData: TikTokVideoData = {
    url: 'https://www.tiktok.com/@usuario_ejemplo/video/7234567890123456789',
    metadata: {
      id: '7234567890123456789',
      duration: 15,
      ratio: '9:16',
      width: 720,
      height: 1280,
      createTime: 1699123456,
      createDate: '2024-11-04T12:30:56.000Z',
      videoUrl: 'https://example.com/video.mp4',
      coverUrl: 'https://example.com/cover.jpg',
      dynamicCoverUrl: 'https://example.com/dynamic-cover.webp'
    },
    music: {
      id: '7123456789012345678',
      title: 'Canción Viral del Momento',
      author: 'Artista Popular',
      duration: 30,
      audioUrl: 'https://example.com/audio.mp3',
      coverUrl: 'https://example.com/music-cover.jpg',
      isOriginal: false
    },
    author: {
      id: '6789012345678901234',
      uniqueId: 'usuario_ejemplo',
      nickname: 'Usuario Ejemplo ✨',
      avatarUrl: 'https://example.com/avatar.jpg',
      verified: true,
      followers: 1500000,
      following: 234,
      totalLikes: 50000000,
      totalVideos: 456,
      signature: 'Creador de contenido 🎬 | Colaboraciones: email@example.com',
      privateAccount: false
    },
    content: {
      description: '¡Mira este increíble video! 🔥 #viral #fyp #parati #tiktok @amigo_usuario',
      hashtags: ['viral', 'fyp', 'parati', 'tiktok', 'trending'],
      mentions: ['amigo_usuario'],
      stickers: ['Texto animado', 'Emoji grande 🔥'],
      effects: ['Filtro Belleza', 'Efecto Glitch', 'Transición Zoom']
    },
    stats: {
      views: 2500000,
      likes: 350000,
      comments: 12500,
      shares: 8900,
      saves: 15600,
      plays: 2500000
    },
    settings: {
      allowComments: true,
      allowDuet: true,
      allowStitch: true,
      downloadable: true,
      isAd: false
    },
    geo: {
      region: 'MX',
      language: 'es'
    },
    metrics: {
      engagementRate: 14.84,
      likeRate: 14.00,
      commentRate: 0.50,
      shareRate: 0.36,
      viralityScore: 45.67
    }
  };

  return {
    success: true,
    data: mockData
  };
});
