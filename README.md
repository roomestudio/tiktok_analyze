# 📊 Analizador de TikTok

Aplicación web desarrollada con Nuxt 4 y TypeScript que permite extraer estadísticas de videos de TikTok.

## 🚀 Características

### Datos Extraídos
- **Metadatos del Video**: ID, duración, resolución, fecha de creación, URLs
- **Información del Autor**: Perfil completo, seguidores, verificación, biografía
- **Estadísticas**: Visualizaciones, likes, comentarios, compartidos, guardados
- **Contenido**: Descripción, hashtags, menciones, efectos, stickers
- **Música**: Título, autor, duración, si es original
- **Configuración**: Permisos de dueto, stitch, comentarios, descarga
- **Datos Geográficos**: Región e idioma
- **Métricas Avanzadas**: Tasas de engagement, viralidad score

### Características Técnicas
- Interfaz moderna y responsive
- API backend con Node.js y TypeScript
- Scraping inteligente de datos embebidos en TikTok
- Cálculo automático de métricas avanzadas
- Visualización detallada con gráficos y estadísticas

## 📋 Requisitos

- Node.js 18+ 
- npm o pnpm

## 🛠️ Instalación

```bash
npm install
```

## 💻 Desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

```bash
npm run dev
```

## 📖 Uso

1. Copia un enlace de video de TikTok (ejemplo: `https://www.tiktok.com/@usuario/video/1234567890`)
2. Pégalo en el campo de entrada
3. Haz clic en "Analizar" o presiona Enter
4. Visualiza las estadísticas del video

## 🏗️ Estructura del Proyecto

```
├── app/
│   └── app.vue           # Componente principal con UI
├── server/
│   └── api/
│       └── tiktok.post.ts # Endpoint API para scraping
├── types/
│   └── tiktok.ts         # Tipos TypeScript
└── nuxt.config.ts        # Configuración de Nuxt
```

## 🔧 API Endpoint

### POST `/api/tiktok`

**Body:**
```json
{
  "url": "https://www.tiktok.com/@usuario/video/1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "...",
    "metadata": { "id": "...", "duration": 15, "width": 720, "height": 1280, ... },
    "author": { "uniqueId": "usuario", "followers": 100000, "verified": true, ... },
    "stats": { "views": 1000000, "likes": 50000, "comments": 1000, "shares": 500, ... },
    "content": { "description": "...", "hashtags": [...], "mentions": [...], ... },
    "music": { "title": "...", "author": "...", "isOriginal": true, ... },
    "settings": { "allowComments": true, "allowDuet": true, ... },
    "geo": { "region": "MX", "language": "es" },
    "metrics": { "engagementRate": 14.5, "viralityScore": 45.2, ... }
  }
}
```

Ver [DATOS_EXTRAIDOS.md](./DATOS_EXTRAIDOS.md) para documentación completa de todos los campos.

## 📦 Producción

Construir para producción:

```bash
npm run build
```

Vista previa de producción:

```bash
npm run preview
```

## ⚠️ Notas Importantes

- TikTok puede bloquear solicitudes automatizadas. Se recomienda usar con moderación.
- Algunos videos privados o restringidos pueden no funcionar.
- Las estadísticas se obtienen en tiempo real del HTML de TikTok.

## 📚 Documentación Adicional

- **[DATOS_EXTRAIDOS.md](./DATOS_EXTRAIDOS.md)** - Documentación completa de todos los datos que se pueden extraer
- **[USO_AVANZADO.md](./USO_AVANZADO.md)** - Guía de uso avanzado, integración con APIs, análisis masivo y casos de uso

## 🎯 Características Destacadas

### Exportación de Datos
La aplicación permite exportar los resultados en tres formatos:
- **JSON**: Datos completos para procesamiento automatizado
- **CSV**: Formato tabular para Excel/Google Sheets
- **Markdown**: Reporte profesional legible

### Endpoint de Prueba
```bash
GET http://localhost:3000/api/tiktok-mock
```
Devuelve datos de ejemplo para desarrollo y testing.

### Métricas Calculadas Automáticamente
- Tasa de engagement
- Tasa de likes, comentarios y compartidos
- Score de viralidad (0-100)
- Análisis de rendimiento

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.
