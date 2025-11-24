# 🚀 Uso Avanzado - Analizador de TikTok

## 📋 Tabla de Contenidos

1. [Endpoint de Prueba](#endpoint-de-prueba)
2. [Exportación de Datos](#exportación-de-datos)
3. [Integración con APIs](#integración-con-apis)
4. [Análisis Masivo](#análisis-masivo)
5. [Interpretación de Métricas](#interpretación-de-métricas)
6. [Casos de Uso Reales](#casos-de-uso-reales)

## 🧪 Endpoint de Prueba

Para desarrollo y testing sin hacer requests reales a TikTok:

```bash
GET http://localhost:3000/api/tiktok-mock
```

Este endpoint devuelve datos de ejemplo completos que puedes usar para:
- Desarrollar la UI sin depender de TikTok
- Testing automatizado
- Demos y presentaciones

## 💾 Exportación de Datos

La aplicación permite exportar los datos en tres formatos:

### 1. JSON (Formato Completo)
- Incluye todos los campos y estructura completa
- Ideal para procesamiento automatizado
- Compatible con herramientas de análisis de datos

### 2. CSV (Formato Tabular)
- Datos principales en formato de tabla
- Fácil de importar en Excel, Google Sheets
- Perfecto para análisis estadístico

### 3. Markdown (Reporte Legible)
- Formato de reporte profesional
- Fácil de compartir y leer
- Incluye interpretación de métricas

## 🔌 Integración con APIs

### Uso Programático

```typescript
// Ejemplo de uso desde otro servicio
const response = await fetch('http://localhost:3000/api/tiktok', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://www.tiktok.com/@usuario/video/1234567890'
  })
});

const data = await response.json();

if (data.success) {
  console.log('Visualizaciones:', data.data.stats.views);
  console.log('Score de Viralidad:', data.data.metrics.viralityScore);
}
```

### Webhook Integration

Puedes crear un webhook que analice videos automáticamente:

```typescript
// server/api/webhook/tiktok-analyze.post.ts
export default defineEventHandler(async (event) => {
  const { url } = await readBody(event);
  
  // Analizar video
  const result = await $fetch('/api/tiktok', {
    method: 'POST',
    body: { url }
  });
  
  // Enviar a tu sistema
  if (result.success && result.data) {
    await sendToAnalytics(result.data);
  }
  
  return result;
});
```

## 📊 Análisis Masivo

### Script para Analizar Múltiples Videos

```typescript
// scripts/analyze-batch.ts
const videos = [
  'https://www.tiktok.com/@user1/video/123',
  'https://www.tiktok.com/@user2/video/456',
  'https://www.tiktok.com/@user3/video/789'
];

const results = [];

for (const url of videos) {
  try {
    const response = await fetch('http://localhost:3000/api/tiktok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    if (data.success) {
      results.push(data.data);
    }
    
    // Esperar 2 segundos entre requests para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error(`Error analizando ${url}:`, error);
  }
}

// Guardar resultados
console.log(`Analizados ${results.length} videos`);
```

## 📈 Interpretación de Métricas

### Tasa de Engagement

```
Fórmula: ((likes + comments + shares) / views) × 100
```

**Interpretación:**
- < 3%: Bajo engagement
- 3-6%: Engagement promedio
- 6-10%: Buen engagement
- > 10%: Excelente engagement

### Score de Viralidad

```
Fórmula ponderada basada en:
- Shares (peso 10): Indica viralidad real
- Saves (peso 8): Contenido valioso
- Comments (peso 5): Engagement activo
- Likes (peso 2): Engagement pasivo
```

**Interpretación:**
- 0-10: Contenido normal
- 10-20: Buen engagement, potencial de crecimiento
- 20-50: Contenido viral, alto alcance
- 50+: Extremadamente viral, tendencia

### Análisis de Ratios

```typescript
// Calcular ratio likes/views
const likeRatio = (likes / views) * 100;

// Benchmarks de la industria:
// - Entretenimiento: 8-15%
// - Educativo: 5-10%
// - Comercial: 3-7%
```

## 🎯 Casos de Uso Reales

### 1. Análisis de Competencia

```typescript
// Comparar múltiples competidores
const competitors = [
  { name: 'Competidor A', url: '...' },
  { name: 'Competidor B', url: '...' }
];

const comparison = await Promise.all(
  competitors.map(async (comp) => {
    const data = await analyzeVideo(comp.url);
    return {
      name: comp.name,
      avgEngagement: data.metrics.engagementRate,
      viralityScore: data.metrics.viralityScore,
      followers: data.author.followers
    };
  })
);

// Ordenar por engagement
comparison.sort((a, b) => b.avgEngagement - a.avgEngagement);
```

### 2. Detección de Tendencias

```typescript
// Analizar hashtags más usados
const videos = await analyzeMultipleVideos(urls);

const hashtagFrequency = {};
videos.forEach(video => {
  video.content.hashtags.forEach(tag => {
    hashtagFrequency[tag] = (hashtagFrequency[tag] || 0) + 1;
  });
});

// Top 10 hashtags
const topHashtags = Object.entries(hashtagFrequency)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10);
```

### 3. Optimización de Contenido

```typescript
// Encontrar el mejor momento para publicar
const videos = await analyzeUserVideos(username);

const performanceByHour = {};
videos.forEach(video => {
  const hour = new Date(video.metadata.createDate).getHours();
  if (!performanceByHour[hour]) {
    performanceByHour[hour] = { views: 0, count: 0 };
  }
  performanceByHour[hour].views += video.stats.views;
  performanceByHour[hour].count += 1;
});

// Calcular promedio por hora
Object.keys(performanceByHour).forEach(hour => {
  const data = performanceByHour[hour];
  data.avgViews = data.views / data.count;
});
```

### 4. ROI de Influencers

```typescript
// Calcular el valor de un influencer
function calculateInfluencerValue(data: TikTokVideoData) {
  const {
    followers,
    totalLikes,
    verified
  } = data.author;
  
  const {
    engagementRate,
    viralityScore
  } = data.metrics;
  
  // Fórmula personalizada de valor
  const baseValue = followers * 0.001; // $0.001 por seguidor
  const engagementBonus = engagementRate * 100;
  const viralityBonus = viralityScore * 50;
  const verifiedBonus = verified ? 5000 : 0;
  
  return baseValue + engagementBonus + viralityBonus + verifiedBonus;
}

// Uso
const estimatedValue = calculateInfluencerValue(videoData);
console.log(`Valor estimado: $${estimatedValue.toFixed(2)}`);
```

### 5. Alertas de Viralidad

```typescript
// Monitorear videos y alertar cuando se vuelven virales
async function monitorVideo(url: string) {
  const checkInterval = 3600000; // 1 hora
  
  setInterval(async () => {
    const data = await analyzeVideo(url);
    
    if (data.metrics.viralityScore > 50) {
      await sendAlert({
        type: 'viral',
        video: url,
        score: data.metrics.viralityScore,
        views: data.stats.views
      });
    }
  }, checkInterval);
}
```

## 🔧 Configuración Avanzada

### Rate Limiting

Para evitar ser bloqueado por TikTok:

```typescript
// server/utils/rate-limiter.ts
const requestQueue = [];
const MAX_REQUESTS_PER_MINUTE = 10;

export async function rateLimitedRequest(url: string) {
  // Implementar cola de requests
  // Esperar si se excede el límite
}
```

### Caché de Resultados

```typescript
// server/utils/cache.ts
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hora

export function getCachedData(videoId: string) {
  const cached = cache.get(videoId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}
```

## 📚 Recursos Adicionales

- [Documentación de Datos](./DATOS_EXTRAIDOS.md)
- [README Principal](./README.md)
- [TikTok API Documentation](https://developers.tiktok.com/)

## ⚠️ Consideraciones Importantes

1. **Rate Limiting**: No hagas más de 10 requests por minuto
2. **Caché**: Implementa caché para videos frecuentemente consultados
3. **Errores**: Maneja errores gracefully, TikTok puede cambiar su estructura
4. **Privacidad**: Respeta la privacidad de los usuarios
5. **Terms of Service**: Asegúrate de cumplir con los TOS de TikTok

## 🤝 Contribuciones

Si encuentras formas de mejorar el análisis o agregar nuevas métricas, las contribuciones son bienvenidas.
