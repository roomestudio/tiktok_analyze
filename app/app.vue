<template>
  <div class="container">
    <div class="card">
      <h1>📊 Analizador de Redes Sociales</h1>
      <p class="subtitle">Extrae estadísticas detalladas y métricas avanzadas</p>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', activeTab === 'tiktok' && 'tab-active']" @click="activeTab = 'tiktok'">
          🎵 TikTok Video
        </button>
        <button :class="['tab', activeTab === 'instagram' && 'tab-active']" @click="activeTab = 'instagram'">
          📸 Instagram Perfil
        </button>
      </div>

      <!-- TikTok Input -->
      <div v-if="activeTab === 'tiktok'" class="input-group">
        <input
          v-model="tiktokUrl"
          type="text"
          placeholder="Pega aquí el enlace de TikTok..."
          class="input"
          @keyup.enter="analyzeVideo"
        />
        <button @click="analyzeVideo" :disabled="loading || !tiktokUrl" class="button">
          {{ loading ? 'Analizando...' : 'Analizar' }}
        </button>
      </div>

      <!-- Instagram Input -->
      <div v-if="activeTab === 'instagram'" class="input-group">
        <input
          v-model="instagramUsername"
          type="text"
          placeholder="@username o username de Instagram..."
          class="input"
          @keyup.enter="analyzeInstagram"
        />
        <button @click="analyzeInstagram" :disabled="loading || !instagramUsername" class="button ig-button">
          {{ loading ? 'Analizando...' : 'Analizar Perfil' }}
        </button>
      </div>

      <div v-if="error" class="error">
        ⚠️ {{ error }}
      </div>

      <div v-if="videoData" class="results">
        <!-- Botones de Exportación -->
        <div class="export-buttons">
          <button @click="handleExportJSON" class="export-btn">
            📄 Exportar JSON
          </button>
          <button @click="handleExportCSV" class="export-btn">
            📊 Exportar CSV
          </button>
          <button @click="handleExportMarkdown" class="export-btn">
            📝 Exportar Markdown
          </button>
        </div>

        <!-- Información del Autor -->
        <section class="section">
          <h2>👤 Información del Autor</h2>
          <div class="author-card">
            <img v-if="videoData.author.avatarUrl" :src="videoData.author.avatarUrl" class="avatar" />
            <div class="author-info">
              <div class="author-name">
                {{ videoData.author.nickname }}
                <span v-if="videoData.author.verified" class="verified">✓</span>
              </div>
              <div class="author-username">@{{ videoData.author.uniqueId }}</div>
              <div class="author-bio">{{ videoData.author.signature }}</div>
              <div class="author-stats">
                <span>👥 {{ formatNumber(videoData.author.followers) }} seguidores</span>
                <span>❤️ {{ formatNumber(videoData.author.totalLikes) }} likes</span>
                <span>🎬 {{ formatNumber(videoData.author.totalVideos) }} videos</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Metadatos del Video -->
        <section class="section">
          <h2>🎬 Metadatos del Video</h2>
          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">ID:</span>
              <span class="meta-value">{{ videoData.metadata.id }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Duración:</span>
              <span class="meta-value">{{ formatDuration(videoData.metadata.duration) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Resolución:</span>
              <span class="meta-value">{{ videoData.metadata.width }}x{{ videoData.metadata.height }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Ratio:</span>
              <span class="meta-value">{{ videoData.metadata.ratio }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fecha:</span>
              <span class="meta-value">{{ formatDate(videoData.metadata.createDate) }}</span>
            </div>
          </div>
        </section>

        <!-- Música -->
        <section v-if="videoData.music" class="section">
          <h2>🎵 Música</h2>
          <div class="music-card">
            <img v-if="videoData.music.coverUrl" :src="videoData.music.coverUrl" class="music-cover" />
            <div class="music-info">
              <div class="music-title">{{ videoData.music.title }}</div>
              <div class="music-author">{{ videoData.music.author }}</div>
              <div class="music-meta">
                <span>⏱️ {{ formatDuration(videoData.music.duration) }}</span>
                <span v-if="videoData.music.isOriginal" class="original-badge">Original</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Contenido -->
        <section class="section">
          <h2>📝 Contenido</h2>
          <div class="content-box">
            <p class="description">{{ videoData.content.description }}</p>
            <div v-if="videoData.content.hashtags.length" class="tags">
              <span class="tag" v-for="tag in videoData.content.hashtags" :key="tag">#{{ tag }}</span>
            </div>
            <div v-if="videoData.content.mentions.length" class="mentions">
              <span class="mention" v-for="mention in videoData.content.mentions" :key="mention">@{{ mention }}</span>
            </div>
            <div v-if="videoData.content.effects.length" class="effects">
              <strong>Efectos:</strong> {{ videoData.content.effects.join(', ') }}
            </div>
          </div>
        </section>

        <!-- Estadísticas de Engagement -->
        <section class="section">
          <h2>📊 Estadísticas de Engagement</h2>
          <div class="table-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Visualizaciones</th>
                  <th>Likes</th>
                  <th>Comentarios</th>
                  <th>Compartidos</th>
                  <th>Guardados</th>
                  <th>Reproducciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ formatNumber(videoData.stats.views) }}</td>
                  <td>{{ formatNumber(videoData.stats.likes) }}</td>
                  <td>{{ formatNumber(videoData.stats.comments) }}</td>
                  <td>{{ formatNumber(videoData.stats.shares) }}</td>
                  <td>{{ formatNumber(videoData.stats.saves) }}</td>
                  <td>{{ formatNumber(videoData.stats.plays) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Métricas Avanzadas -->
        <section class="section">
          <h2>📈 Métricas Avanzadas</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Tasa de Engagement</div>
              <div class="metric-value">{{ videoData.metrics.engagementRate }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: Math.min(videoData.metrics.engagementRate, 100) + '%' }"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tasa de Likes</div>
              <div class="metric-value">{{ videoData.metrics.likeRate }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: Math.min(videoData.metrics.likeRate, 100) + '%' }"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tasa de Comentarios</div>
              <div class="metric-value">{{ videoData.metrics.commentRate }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: Math.min(videoData.metrics.commentRate * 10, 100) + '%' }"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Tasa de Compartidos</div>
              <div class="metric-value">{{ videoData.metrics.shareRate }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: Math.min(videoData.metrics.shareRate * 10, 100) + '%' }"></div>
              </div>
            </div>
            <div class="metric-card viral">
              <div class="metric-label">🔥 Score de Viralidad</div>
              <div class="metric-value large">{{ videoData.metrics.viralityScore }}</div>
              <div class="viral-indicator">
                <span v-if="videoData.metrics.viralityScore >= 50">🚀 Muy Viral</span>
                <span v-else-if="videoData.metrics.viralityScore >= 20">🔥 Viral</span>
                <span v-else-if="videoData.metrics.viralityScore >= 10">📈 Buen Engagement</span>
                <span v-else>📊 Normal</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Configuración y Datos Técnicos -->
        <section class="section">
          <h2>⚙️ Configuración y Datos Técnicos</h2>
          <div class="settings-grid">
            <div class="setting-item">
              <span class="setting-icon">{{ videoData.settings.allowComments ? '✅' : '❌' }}</span>
              <span>Comentarios {{ videoData.settings.allowComments ? 'habilitados' : 'deshabilitados' }}</span>
            </div>
            <div class="setting-item">
              <span class="setting-icon">{{ videoData.settings.allowDuet ? '✅' : '❌' }}</span>
              <span>Duetos {{ videoData.settings.allowDuet ? 'permitidos' : 'no permitidos' }}</span>
            </div>
            <div class="setting-item">
              <span class="setting-icon">{{ videoData.settings.allowStitch ? '✅' : '❌' }}</span>
              <span>Stitch {{ videoData.settings.allowStitch ? 'permitido' : 'no permitido' }}</span>
            </div>
            <div class="setting-item">
              <span class="setting-icon">{{ videoData.settings.downloadable ? '✅' : '❌' }}</span>
              <span>Descarga {{ videoData.settings.downloadable ? 'habilitada' : 'deshabilitada' }}</span>
            </div>
            <div v-if="videoData.geo.region" class="setting-item">
              <span class="setting-icon">🌍</span>
              <span>Región: {{ videoData.geo.region }}</span>
            </div>
            <div v-if="videoData.geo.language" class="setting-item">
              <span class="setting-icon">🗣️</span>
              <span>Idioma: {{ videoData.geo.language }}</span>
            </div>
          </div>
        </section>
      </div>
      <!-- Resultados Instagram -->
      <div v-if="instagramData" class="results">
        <div class="export-buttons">
          <button @click="handleIgExportJSON" class="export-btn">📄 Exportar JSON</button>
          <button @click="handleIgExportMarkdown" class="export-btn">📝 Exportar Markdown</button>
        </div>

        <section class="section">
          <h2>👤 Perfil de Instagram</h2>
          <div class="author-card">
            <img v-if="instagramData.profile.profile_pic_url" :src="instagramData.profile.profile_pic_url" class="avatar" />
            <div class="author-info">
              <div class="author-name">
                {{ instagramData.profile.full_name || instagramData.profile.username }}
                <span v-if="instagramData.profile.is_verified" class="verified">✓</span>
              </div>
              <div class="author-username">@{{ instagramData.profile.username }}</div>
              <div class="author-bio">{{ instagramData.profile.biography }}</div>
              <div v-if="instagramData.profile.external_url" class="author-bio">
                🔗 <a :href="instagramData.profile.external_url" target="_blank">{{ instagramData.profile.external_url }}</a>
              </div>
              <div class="author-stats">
                <span>👥 {{ fmtIg(instagramData.profile.followers_count) }} seguidores</span>
                <span>➡️ {{ fmtIg(instagramData.profile.following_count) }} siguiendo</span>
                <span>🖼️ {{ fmtIg(instagramData.profile.posts_count) }} posts</span>
              </div>
              <div class="author-stats" style="margin-top:8px">
                <span v-if="instagramData.profile.is_business_account">🏢 Business</span>
                <span v-else-if="instagramData.profile.is_professional_account">⭐ Creator</span>
                <span v-else>👤 Personal</span>
                <span v-if="instagramData.profile.is_private">🔒 Privada</span>
                <span v-if="instagramData.benchmarks.account_size_category">📊 {{ instagramData.benchmarks.account_size_category }}</span>
                <span v-if="instagramData.profile.business_category_name">{{ instagramData.profile.business_category_name }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>📈 Métricas de Engagement</h2>
          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">Total Likes</span>
              <span class="meta-value">{{ fmtIg(instagramData.engagement_metrics.overall.total_likes) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Comentarios</span>
              <span class="meta-value">{{ fmtIg(instagramData.engagement_metrics.overall.total_comments) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Avg Likes/Post</span>
              <span class="meta-value">{{ instagramData.engagement_metrics.overall.avg_likes_per_post }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Avg Comentarios/Post</span>
              <span class="meta-value">{{ instagramData.engagement_metrics.overall.avg_comments_per_post }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Tasa de Engagement</span>
              <span class="meta-value">{{ instagramData.engagement_metrics.overall.engagement_rate_by_followers ?? 'N/D' }}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Posts analizados</span>
              <span class="meta-value">{{ instagramData.extraction_metadata.posts_extracted }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>🖼️ Por Tipo de Contenido</h2>
          <div class="table-wrapper">
            <table class="stats-table">
              <thead>
                <tr><th>Tipo</th><th>Posts</th><th>Avg Likes</th><th>Avg Comentarios</th><th>Avg Engagement</th></tr>
              </thead>
              <tbody>
                <tr v-for="(v, k) in instagramData.engagement_metrics.by_content_type" :key="k">
                  <td>{{ k }}</td><td>{{ v.count }}</td><td>{{ v.avg_likes }}</td><td>{{ v.avg_comments }}</td><td>{{ v.avg_engagement_rate ?? 'N/D' }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="section">
          <h2>⏰ Patrones de Publicación</h2>
          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">Últimos 30 días</span>
              <span class="meta-value">{{ instagramData.posting_patterns.posting_frequency_last_30_days }} posts</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Últimos 90 días</span>
              <span class="meta-value">{{ instagramData.posting_patterns.posting_frequency_last_90_days }} posts</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Mejor día</span>
              <span class="meta-value">{{ instagramData.posting_patterns.best_performing_day || 'N/D' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Mejor hora</span>
              <span class="meta-value">{{ instagramData.posting_patterns.best_performing_hour !== null ? instagramData.posting_patterns.best_performing_hour + ':00' : 'N/D' }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>🏷️ Top Hashtags</h2>
          <div class="tags">
            <span class="tag" v-for="tag in instagramData.hashtags_analysis.top_10_by_frequency" :key="tag">{{ tag }}</span>
          </div>
          <div class="metadata-grid" style="margin-top:15px">
            <div class="meta-item">
              <span class="meta-label">Hashtags únicos</span>
              <span class="meta-value">{{ instagramData.hashtags_analysis.unique_hashtags_count }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Avg por post</span>
              <span class="meta-value">{{ instagramData.hashtags_analysis.avg_hashtags_per_post }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Posts sin hashtags</span>
              <span class="meta-value">{{ instagramData.hashtags_analysis.posts_without_hashtags }}</span>
            </div>
          </div>
        </section>

        <div class="error" style="background:#fff3cd;color:#856404;border-color:#ffc107">
          ⚠️ <strong>Datos limitados por scraping público.</strong> Stories, Highlights, Seguidores detallados, Reach/Impressions/Saves requieren Instagram Graph API.
          <br>Completitud del dataset: {{ instagramData.extraction_metadata.data_completeness_percent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TikTokVideoData } from '../types/tiktok';
import type { InstagramDataset } from '../types/instagram';
import { useExport } from '../composables/useExport';
import { useInstagramExport } from '../composables/useInstagramExport';

const activeTab = ref<'tiktok' | 'instagram'>('tiktok');

// TikTok
const tiktokUrl = ref('');
const videoData = ref<TikTokVideoData | null>(null);

// Instagram
const instagramUsername = ref('');
const instagramData = ref<InstagramDataset | null>(null);

const loading = ref(false);
const error = ref('');

const analyzeVideo = async () => {
  if (!tiktokUrl.value) return;
  loading.value = true;
  error.value = '';
  videoData.value = null;
  try {
    const response = await $fetch('/api/tiktok', { method: 'POST', body: { url: tiktokUrl.value } });
    if (response.success && response.data) videoData.value = response.data;
    else error.value = response.error || 'Error al obtener datos';
  } catch (e: any) {
    error.value = e.message || 'Error de conexión';
  } finally {
    loading.value = false;
  }
};

const analyzeInstagram = async () => {
  if (!instagramUsername.value) return;
  loading.value = true;
  error.value = '';
  instagramData.value = null;
  try {
    const response = await $fetch('/api/instagram-profile', { method: 'POST', body: { username: instagramUsername.value } });
    if (response.success && response.data) instagramData.value = response.data;
    else error.value = response.error || 'Error al obtener datos de Instagram';
  } catch (e: any) {
    error.value = e.message || 'Error de conexión';
  } finally {
    loading.value = false;
  }
};

const fmtIg = (n: number | null) => {
  if (n === null || n === undefined) return 'N/D';
  if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return n.toLocaleString();
};

const formatNumber = (num?: number): string => {
  if (!num && num !== 0) return 'N/A';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const formatDuration = (seconds: number): string => {
  if (!seconds) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const { exportToJSON, exportToCSV, exportToMarkdown } = useExport();
const { exportToJSON: igExportJSON, exportToMarkdown: igExportMarkdown } = useInstagramExport();

const handleExportJSON = () => { if (videoData.value) exportToJSON(videoData.value, `tiktok-${videoData.value.metadata.id}.json`); };
const handleExportCSV = () => { if (videoData.value) exportToCSV(videoData.value, `tiktok-${videoData.value.metadata.id}.csv`); };
const handleExportMarkdown = () => { if (videoData.value) exportToMarkdown(videoData.value, `tiktok-${videoData.value.metadata.id}.md`); };
const handleIgExportJSON = () => { if (instagramData.value) igExportJSON(instagramData.value); };
const handleIgExportMarkdown = () => { if (instagramData.value) igExportMarkdown(instagramData.value); };
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s;
}

.button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
}

.results {
  margin-top: 30px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

/* Author Card */
.author-card {
  display: flex;
  gap: 20px;
  align-items: start;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.verified {
  background: #20d5ec;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.author-username {
  color: #666;
  margin: 5px 0;
}

.author-bio {
  color: #555;
  margin: 10px 0;
}

.author-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.author-stats span {
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #555;
}

/* Metadata Grid */
.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.meta-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-label {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
}

.meta-value {
  color: #333;
  font-size: 1.1rem;
}

/* Music Card */
.music-card {
  display: flex;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 10px;
}

.music-cover {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.music-info {
  flex: 1;
}

.music-title {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.music-author {
  color: #666;
  margin: 5px 0;
}

.music-meta {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.original-badge {
  background: #667eea;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* Content Box */
.content-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.description {
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.tags, .mentions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.mention {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.effects {
  color: #666;
  font-size: 0.9rem;
  margin-top: 10px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: white;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
}

/* Stats Table (para fácil copiado a Excel) */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.stats-table thead th {
  background: #667eea;
  color: white;
  font-weight: 700;
  padding: 12px 16px;
  text-align: center;
}

.stats-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.stats-table tbody tr:hover {
  background: #f5f7ff;
}

.stats-table tbody td:nth-child(2) {
  font-weight: 600;
  color: #333;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.metric-card.viral {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  grid-column: span 2;
  text-align: center;
}

.metric-label {
  font-weight: 600;
  color: #666;
  margin-bottom: 10px;
}

.metric-card.viral .metric-label {
  color: white;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.metric-value.large {
  font-size: 3rem;
}

.metric-card.viral .metric-value {
  color: white;
}

.metric-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
}

.viral-indicator {
  margin-top: 10px;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.setting-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-icon {
  font-size: 1.5rem;
}

/* Export Buttons */
.export-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.export-btn {
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .card {
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .input-group {
    flex-direction: column;
  }

  .export-buttons {
    flex-direction: column;
  }

  .export-btn {
    width: 100%;
  }

  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .metric-card.viral {
    grid-column: span 1;
  }
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 2px solid #e0e0e0;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover { color: #667eea; }

.tab-active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.ig-button {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}
</style>
