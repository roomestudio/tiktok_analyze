import type { TikTokVideoData } from '../types/tiktok';

export const useExport = () => {
  const exportToJSON = (data: TikTokVideoData, filename: string = 'tiktok-data.json') => {
    const jsonStr = JSON.stringify(data, null, 2);
    downloadFile(jsonStr, filename, 'application/json');
  };

  const exportToCSV = (data: TikTokVideoData, filename: string = 'tiktok-data.csv') => {
    const rows = [
      ['Campo', 'Valor'],
      ['URL', data.url],
      ['ID Video', data.metadata.id],
      ['Duración', `${data.metadata.duration}s`],
      ['Fecha Creación', data.metadata.createDate],
      ['Autor', data.author.nickname],
      ['Username', `@${data.author.uniqueId}`],
      ['Verificado', data.author.verified ? 'Sí' : 'No'],
      ['Seguidores', data.author.followers.toString()],
      ['Visualizaciones', data.stats.views.toString()],
      ['Likes', data.stats.likes.toString()],
      ['Comentarios', data.stats.comments.toString()],
      ['Compartidos', data.stats.shares.toString()],
      ['Guardados', data.stats.saves.toString()],
      ['Tasa Engagement', `${data.metrics.engagementRate}%`],
      ['Tasa Likes', `${data.metrics.likeRate}%`],
      ['Score Viralidad', data.metrics.viralityScore.toString()],
      ['Descripción', data.content.description],
      ['Hashtags', data.content.hashtags.join(', ')],
      ['Música', data.music?.title || 'N/A'],
      ['Región', data.geo.region || 'N/A'],
      ['Idioma', data.geo.language || 'N/A']
    ];

    const csvContent = rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    downloadFile(csvContent, filename, 'text/csv');
  };

  const exportToMarkdown = (data: TikTokVideoData, filename: string = 'tiktok-report.md') => {
    const md = `# Reporte de Análisis TikTok

## 📊 Información General

- **URL**: ${data.url}
- **ID**: ${data.metadata.id}
- **Fecha**: ${new Date(data.metadata.createDate).toLocaleDateString('es-ES')}
- **Duración**: ${data.metadata.duration}s

## 👤 Autor

- **Nombre**: ${data.author.nickname}
- **Username**: @${data.author.uniqueId}
- **Verificado**: ${data.author.verified ? '✅' : '❌'}
- **Seguidores**: ${formatNumber(data.author.followers)}
- **Total Likes**: ${formatNumber(data.author.totalLikes)}
- **Total Videos**: ${data.author.totalVideos}

## 📈 Estadísticas

| Métrica | Valor |
|---------|-------|
| Visualizaciones | ${formatNumber(data.stats.views)} |
| Likes | ${formatNumber(data.stats.likes)} |
| Comentarios | ${formatNumber(data.stats.comments)} |
| Compartidos | ${formatNumber(data.stats.shares)} |
| Guardados | ${formatNumber(data.stats.saves)} |

## 🎯 Métricas Avanzadas

- **Tasa de Engagement**: ${data.metrics.engagementRate}%
- **Tasa de Likes**: ${data.metrics.likeRate}%
- **Tasa de Comentarios**: ${data.metrics.commentRate}%
- **Tasa de Compartidos**: ${data.metrics.shareRate}%
- **Score de Viralidad**: ${data.metrics.viralityScore} ${getViralityLabel(data.metrics.viralityScore)}

## 📝 Contenido

**Descripción**: ${data.content.description}

**Hashtags**: ${data.content.hashtags.map(h => `#${h}`).join(' ')}

${data.content.mentions.length > 0 ? `**Menciones**: ${data.content.mentions.map(m => `@${m}`).join(' ')}` : ''}

${data.music ? `## 🎵 Música

- **Título**: ${data.music.title}
- **Autor**: ${data.music.author}
- **Original**: ${data.music.isOriginal ? 'Sí' : 'No'}
` : ''}

## ⚙️ Configuración

- Comentarios: ${data.settings.allowComments ? '✅' : '❌'}
- Duetos: ${data.settings.allowDuet ? '✅' : '❌'}
- Stitch: ${data.settings.allowStitch ? '✅' : '❌'}
- Descargable: ${data.settings.downloadable ? '✅' : '❌'}

---
*Reporte generado el ${new Date().toLocaleString('es-ES')}*
`;

    downloadFile(md, filename, 'text/markdown');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getViralityLabel = (score: number): string => {
    if (score >= 50) return '🚀 Muy Viral';
    if (score >= 20) return '🔥 Viral';
    if (score >= 10) return '📈 Buen Engagement';
    return '📊 Normal';
  };

  return {
    exportToJSON,
    exportToCSV,
    exportToMarkdown
  };
};
