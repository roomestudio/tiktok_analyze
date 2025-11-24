<template>
  <div class="container">
    <div class="card">
      <h1>📊 Analizador Completo de TikTok</h1>
      <p class="subtitle">Extrae estadísticas detalladas y métricas avanzadas</p>

      <div class="input-group">
        <input
          v-model="tiktokUrl"
          type="text"
          placeholder="Pega aquí el enlace de TikTok..."
          class="input"
          @keyup.enter="analyzeVideo"
        />
        <button 
          @click="analyzeVideo" 
          :disabled="loading || !tiktokUrl"
          class="button"
        >
          {{ loading ? 'Analizando...' : 'Analizar' }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TikTokVideoData } from '../types/tiktok';
import { useExport } from '../composables/useExport';

const tiktokUrl = ref('');
const videoData = ref<TikTokVideoData | null>(null);
const loading = ref(false);
const error = ref('');

const analyzeVideo = async () => {
  if (!tiktokUrl.value) return;

  loading.value = true;
  error.value = '';
  videoData.value = null;

  try {
    const response = await $fetch('/api/tiktok', {
      method: 'POST',
      body: {
        url: tiktokUrl.value
      }
    });

    if (response.success && response.data) {
      videoData.value = response.data;
    } else {
      error.value = response.error || 'Error al obtener datos';
    }
  } catch (e: any) {
    error.value = e.message || 'Error de conexión';
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num?: number): string => {
  if (!num && num !== 0) return 'N/A';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
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
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funciones de exportación
// En Nuxt, los composables se auto-importan desde la carpeta composables/
const { exportToJSON, exportToCSV, exportToMarkdown } = useExport();

const handleExportJSON = () => {
  if (videoData.value) {
    const filename = `tiktok-${videoData.value.metadata.id}.json`;
    exportToJSON(videoData.value, filename);
  }
};

const handleExportCSV = () => {
  if (videoData.value) {
    const filename = `tiktok-${videoData.value.metadata.id}.csv`;
    exportToCSV(videoData.value, filename);
  }
};

const handleExportMarkdown = () => {
  if (videoData.value) {
    const filename = `tiktok-${videoData.value.metadata.id}.md`;
    exportToMarkdown(videoData.value, filename);
  }
};
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
</style>
