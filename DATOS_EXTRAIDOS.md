# 📊 Datos Extraídos de TikTok

Este documento detalla todos los datos que la aplicación puede extraer de un video de TikTok.

## 🎬 Metadatos del Video

```typescript
metadata: {
  id: string                    // ID único del video
  duration: number              // Duración en segundos
  ratio: string                 // Ratio de aspecto (ej: "720p", "1080p")
  width: number                 // Ancho en píxeles
  height: number                // Alto en píxeles
  createTime: number            // Timestamp de creación
  createDate: string            // Fecha ISO formateada
  videoUrl: string              // URL directa del video
  coverUrl: string              // URL de la imagen de portada
  dynamicCoverUrl: string       // URL de la portada animada
}
```

**Ejemplo:**
```json
{
  "id": "7234567890123456789",
  "duration": 15,
  "ratio": "720p",
  "width": 720,
  "height": 1280,
  "createTime": 1699123456,
  "createDate": "2024-11-04T12:30:56.000Z",
  "videoUrl": "https://...",
  "coverUrl": "https://..."
}
```

## 🎵 Datos de Música

```typescript
music: {
  id: string                    // ID único del audio
  title: string                 // Título de la canción
  author: string                // Autor/artista
  duration: number              // Duración del audio
  audioUrl: string              // URL del archivo de audio
  coverUrl: string              // Portada del audio
  isOriginal: boolean           // Si es sonido original
}
```

**Ejemplo:**
```json
{
  "id": "7123456789012345678",
  "title": "Canción Original",
  "author": "Usuario TikTok",
  "duration": 30,
  "audioUrl": "https://...",
  "isOriginal": true
}
```

## 👤 Información del Autor

```typescript
author: {
  id: string                    // ID único del usuario
  uniqueId: string              // Username (@usuario)
  nickname: string              // Nombre de perfil
  avatarUrl: string             // URL del avatar
  verified: boolean             // Si tiene verificación
  followers: number             // Cantidad de seguidores
  following: number             // Cantidad de seguidos
  totalLikes: number            // Total de likes recibidos
  totalVideos: number           // Total de videos publicados
  signature: string             // Biografía del perfil
  privateAccount: boolean       // Si es cuenta privada
}
```

**Ejemplo:**
```json
{
  "id": "6789012345678901234",
  "uniqueId": "usuario_ejemplo",
  "nickname": "Usuario Ejemplo",
  "avatarUrl": "https://...",
  "verified": true,
  "followers": 1500000,
  "following": 234,
  "totalLikes": 50000000,
  "totalVideos": 456,
  "signature": "Creador de contenido 🎬",
  "privateAccount": false
}
```

## 📝 Contenido y Engagement

```typescript
content: {
  description: string           // Descripción del video
  hashtags: string[]            // Lista de hashtags
  mentions: string[]            // Usuarios mencionados
  stickers: string[]            // Stickers aplicados
  effects: string[]             // Efectos/filtros usados
}
```

**Ejemplo:**
```json
{
  "description": "Mira este increíble video! #viral #fyp @amigo",
  "hashtags": ["viral", "fyp", "tiktok"],
  "mentions": ["amigo"],
  "stickers": ["Texto animado", "Emoji grande"],
  "effects": ["Filtro Belleza", "Efecto Glitch"]
}
```

## 📊 Estadísticas de Engagement

```typescript
stats: {
  views: number                 // Visualizaciones totales
  likes: number                 // Likes (corazones)
  comments: number              // Cantidad de comentarios
  shares: number                // Veces compartido
  saves: number                 // Veces guardado/favorito
  plays: number                 // Reproducciones
}
```

**Ejemplo:**
```json
{
  "views": 2500000,
  "likes": 350000,
  "comments": 12500,
  "shares": 8900,
  "saves": 15600,
  "plays": 2500000
}
```

## ⚙️ Configuración del Video

```typescript
settings: {
  allowComments: boolean        // Si permite comentarios
  allowDuet: boolean            // Si permite duetos
  allowStitch: boolean          // Si permite stitch
  downloadable: boolean         // Si se puede descargar
  isAd: boolean                 // Si es publicidad
}
```

**Ejemplo:**
```json
{
  "allowComments": true,
  "allowDuet": true,
  "allowStitch": true,
  "downloadable": true,
  "isAd": false
}
```

## 🌍 Datos Geográficos

```typescript
geo: {
  region: string                // País/región
  language: string              // Idioma del contenido
}
```

**Ejemplo:**
```json
{
  "region": "MX",
  "language": "es"
}
```

## 📈 Métricas Avanzadas (Calculadas)

```typescript
metrics: {
  engagementRate: number        // Tasa de engagement (%)
  likeRate: number              // Tasa de likes (%)
  commentRate: number           // Tasa de comentarios (%)
  shareRate: number             // Tasa de compartidos (%)
  completionRate: number        // Tasa de finalización (%)
  viralityScore: number         // Score de viralidad (0-100)
}
```

**Ejemplo:**
```json
{
  "engagementRate": 14.84,
  "likeRate": 14.00,
  "commentRate": 0.50,
  "shareRate": 0.36,
  "viralityScore": 45.67
}
```

### Fórmulas de Cálculo

#### Tasa de Engagement
```
engagementRate = ((likes + comments + shares) / views) × 100
```

#### Tasa de Likes
```
likeRate = (likes / views) × 100
```

#### Tasa de Comentarios
```
commentRate = (comments / views) × 100
```

#### Tasa de Compartidos
```
shareRate = (shares / views) × 100
```

#### Score de Viralidad
```
Fórmula ponderada:
- Shares: peso 10
- Saves: peso 8
- Comments: peso 5
- Likes: peso 2

viralityScore = min(((shares×10 + saves×8 + comments×5 + likes×2) / views) × 100, 100)
```

**Interpretación del Score de Viralidad:**
- 0-10: Normal
- 10-20: Buen engagement
- 20-50: Viral
- 50+: Muy viral

## 🎯 Casos de Uso

### 1. Análisis de Competencia
Analiza los videos de competidores para entender qué tipo de contenido funciona mejor.

### 2. Optimización de Contenido
Identifica patrones en videos exitosos (hashtags, duración, música, etc.).

### 3. Seguimiento de Campañas
Monitorea el rendimiento de campañas de marketing en TikTok.

### 4. Investigación de Tendencias
Detecta tendencias emergentes analizando efectos, música y hashtags populares.

### 5. Análisis de Influencers
Evalúa el rendimiento y autenticidad de influencers antes de colaboraciones.

## ⚠️ Limitaciones

- TikTok puede bloquear solicitudes automatizadas frecuentes
- Algunos videos privados o restringidos no son accesibles
- Las estadísticas son en tiempo real al momento de la consulta
- La tasa de finalización no está disponible sin acceso a TikTok Analytics
- Algunos campos pueden estar vacíos dependiendo de la configuración del video

## 🔐 Consideraciones de Privacidad

- Solo se extraen datos públicamente disponibles
- No se accede a información privada de usuarios
- Se respetan las configuraciones de privacidad de TikTok
- No se almacenan datos personales sin consentimiento
