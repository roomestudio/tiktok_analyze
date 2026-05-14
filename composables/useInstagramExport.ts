import type { InstagramDataset } from '../types/instagram'

export const useInstagramExport = () => {
  const exportToJSON = (data: InstagramDataset) => {
    downloadFile(JSON.stringify(data, null, 2), `instagram-${data.profile.username}.json`, 'application/json')
  }

  const exportToMarkdown = (data: InstagramDataset) => {
    const p = data.profile
    const m = data.engagement_metrics.overall
    const fmt = (n: number | null) => n === null ? 'N/D' : n >= 1e9 ? (n/1e9).toFixed(1)+'B' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : String(n)

    const postingSection = () => {
      const pp = data.posting_patterns
      const topDay = pp.best_performing_day || 'N/D'
      const topHour = pp.best_performing_hour !== null ? `${pp.best_performing_hour}:00` : 'N/D'
      return `## ⏰ Patrones de Publicación

- **Frecuencia últimos 30 días**: ${pp.posting_frequency_last_30_days} posts
- **Frecuencia últimos 90 días**: ${pp.posting_frequency_last_90_days} posts
- **Promedio días entre posts**: ${pp.avg_days_between_posts ?? 'N/D'}
- **Mejor día**: ${topDay}
- **Mejor hora**: ${topHour}

### Posts por día de la semana
${Object.entries(pp.posts_by_day_of_week).map(([d, c]) => `- ${d}: ${c}`).join('\n')}`
    }

    const hashtagSection = () => {
      const h = data.hashtags_analysis
      const top = h.top_10_by_frequency.slice(0, 10).join(', ')
      return `## 🏷️ Hashtags

- **Hashtags únicos usados**: ${h.unique_hashtags_count}
- **Promedio por post**: ${h.avg_hashtags_per_post}
- **Posts sin hashtags**: ${h.posts_without_hashtags}
- **Top 10**: ${top || 'N/D'}`
    }

    const contentSection = () => {
      const bc = data.engagement_metrics.by_content_type
      return `## 🖼️ Análisis por Tipo de Contenido

| Tipo | Posts | Avg Likes | Avg Comentarios | Avg Engagement |
|------|-------|-----------|-----------------|----------------|
| Imágenes | ${bc.images.count} | ${bc.images.avg_likes} | ${bc.images.avg_comments} | ${bc.images.avg_engagement_rate ?? 'N/D'}% |
| Carruseles | ${bc.carousels.count} | ${bc.carousels.avg_likes} | ${bc.carousels.avg_comments} | ${bc.carousels.avg_engagement_rate ?? 'N/D'}% |
| Reels | ${bc.reels.count} | ${bc.reels.avg_likes} | ${bc.reels.avg_comments} | ${bc.reels.avg_engagement_rate ?? 'N/D'}% |
| Videos | ${bc.videos.count} | ${bc.videos.avg_likes} | ${bc.videos.avg_comments} | ${bc.videos.avg_engagement_rate ?? 'N/D'}% |`
    }

    const md = `# 📊 Análisis de Perfil Instagram: @${p.username}

> Generado el ${new Date().toLocaleString('es-ES')} | Método: Scraping público | Completitud: ${data.extraction_metadata.data_completeness_percent}%

---

## 👤 Perfil

- **Nombre**: ${p.full_name || 'N/D'}
- **Username**: @${p.username}
- **Biografía**: ${p.biography || 'N/D'}
- **URL externa**: ${p.external_url || 'N/D'}
- **Verificado**: ${p.is_verified ? '✅' : '❌'}
- **Privado**: ${p.is_private ? '🔒 Sí' : '🌐 No'}
- **Tipo de cuenta**: ${p.account_type || 'N/D'}
- **Categoría de negocio**: ${p.business_category_name || 'N/D'}
- **Tamaño de cuenta**: ${data.benchmarks.account_size_category || 'N/D'}

### Estadísticas del Perfil

| Métrica | Valor |
|---------|-------|
| Seguidores | ${fmt(p.followers_count)} |
| Siguiendo | ${fmt(p.following_count)} |
| Posts totales | ${fmt(p.posts_count)} |

---

## 📈 Métricas de Engagement (${data.posts.length} posts analizados)

| Métrica | Valor |
|---------|-------|
| Total Likes | ${fmt(m.total_likes)} |
| Total Comentarios | ${fmt(m.total_comments)} |
| Total Vistas (reels/videos) | ${fmt(m.total_views)} |
| Avg Likes por post | ${m.avg_likes_per_post} |
| Avg Comentarios por post | ${m.avg_comments_per_post} |
| Avg Vistas por reel | ${m.avg_views_per_reel} |
| Tasa de Engagement | ${m.engagement_rate_by_followers ?? 'N/D'}% |
| Ratio Likes/Comentarios | ${m.like_to_comment_ratio} |

---

${contentSection()}

---

${postingSection()}

---

${hashtagSection()}

---

## 🔗 Links y Menciones

- **Link en bio**: ${data.links.bio_link.url || 'N/D'}
- **Cuentas más mencionadas**: ${data.social_graph.accounts_mentioned_in_captions.slice(0, 5).map(a => `@${a.username} (${a.mention_count})`).join(', ') || 'N/D'}
- **Cuentas más etiquetadas**: ${data.social_graph.accounts_tagged_in_posts.slice(0, 5).map(a => `@${a.username} (${a.tag_count})`).join(', ') || 'N/D'}

---

## 📍 Geolocalización

- **Posts con ubicación**: ${data.geolocation.posts_with_location}
- **Posts sin ubicación**: ${data.geolocation.posts_without_location}
${data.geolocation.most_tagged_locations.length ? `- **Ubicaciones más usadas**: ${data.geolocation.most_tagged_locations.slice(0, 5).map(l => `${l.name} (${l.count})`).join(', ')}` : ''}

---

## 🎵 Audio en Reels

- **Reels con audio original**: ${data.audio_analysis.reels_with_original_audio}
- **Reels con música trending**: ${data.audio_analysis.reels_with_trending_music}
${data.audio_analysis.most_used_songs.length ? `- **Canciones más usadas**: ${data.audio_analysis.most_used_songs.slice(0, 3).map(s => `"${s.title}" de ${s.artist} (${s.uses_count}x)`).join(', ')}` : ''}

---

## ⚠️ Campos No Disponibles (requieren Graph API)

Los siguientes datos no son accesibles por scraping público:
- Stories y Highlights
- Seguidores/Siguiendo detallados
- Reach, Impressions, Saves, Shares por post
- Historial de crecimiento de seguidores
- Datos de comunidad (respuestas, sentimiento)

---

*Primer post analizado: ${data.extraction_metadata.first_post_date || 'N/D'}*  
*Último post analizado: ${data.extraction_metadata.last_post_date || 'N/D'}*  
*Posts extraídos: ${data.extraction_metadata.posts_extracted} de ${data.extraction_metadata.posts_total ?? '?'} totales*
`
    downloadFile(md, `instagram-${data.profile.username}-report.md`, 'text/markdown')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return { exportToJSON, exportToMarkdown }
}
