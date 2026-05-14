# 📋 Dataset Completo — Requerimientos de Datos para Análisis de Cuenta Instagram
> Documento de referencia para el desarrollo de la aplicación de análisis de Community Management  
> Todos los campos son necesarios para generar un reporte completo y sin sesgos

---

## 1. 👤 PERFIL PRINCIPAL

```json
{
  "profile": {
    "username": "",
    "full_name": "",
    "biography": "",
    "biography_with_entities": {
      "raw_text": "",
      "hashtags": [],
      "mentions": [],
      "urls": []
    },
    "external_url": "",
    "external_url_linkshimmed": "",
    "profile_pic_url": "",
    "profile_pic_url_hd": "",
    "followers_count": 0,
    "following_count": 0,
    "posts_count": 0,
    "reels_count": 0,
    "is_verified": false,
    "is_private": false,
    "is_business_account": false,
    "is_professional_account": false,
    "account_type": "personal|creator|business",
    "business_category_name": "",
    "business_email": "",
    "business_phone_number": "",
    "business_address_json": {
      "street_address": "",
      "zip_code": "",
      "city_name": "",
      "region_name": "",
      "country_code": ""
    },
    "connected_facebook_page": "",
    "highlights_count": 0,
    "joined_recently": false,
    "date_joined": "",
    "pronouns": [],
    "category_enum": "",
    "has_guides": false,
    "has_channel": false,
    "total_igtv_videos": 0,
    "subscription_count": 0,
    "mutual_followers_count": 0
  }
}
```

---

## 2. 📌 HIGHLIGHTS (Historias Destacadas)

```json
{
  "highlights": [
    {
      "id": "",
      "title": "",
      "cover_image_url": "",
      "cover_cropped_image_url": "",
      "items_count": 0,
      "created_at": "",
      "latest_reel_media": 0,
      "items": [
        {
          "id": "",
          "type": "image|video",
          "timestamp": "",
          "image_url": "",
          "video_url": "",
          "duration_seconds": 0,
          "has_audio": false,
          "tray_item_pinned_for_viewer": false,
          "accessibility_caption": "",
          "stickers": {
            "has_mention": false,
            "mentioned_accounts": [],
            "has_hashtag": false,
            "hashtags": [],
            "has_link": false,
            "link_url": "",
            "has_location": false,
            "location_name": "",
            "has_poll": false,
            "has_question": false,
            "has_quiz": false,
            "has_countdown": false,
            "has_emoji_slider": false,
            "has_product": false
          },
          "audience_count": 0
        }
      ]
    }
  ]
}
```

---

## 3. 🖼️ POSTS (Mínimo 90 publicaciones — idealmente histórico completo)

```json
{
  "posts": [
    {
      "id": "",
      "shortcode": "",
      "url": "",
      "type": "image|video|carousel|reel|igtv",
      "timestamp": "",
      "timestamp_unix": 0,
      "day_of_week": "",
      "hour_of_day": 0,

      "caption": "",
      "caption_entities": {
        "hashtags": [],
        "mentions": [],
        "urls": []
      },
      "first_comment_caption": false,
      "accessibility_caption": "",

      "media": {
        "thumbnail_url": "",
        "display_url": "",
        "video_url": "",
        "video_duration_seconds": 0,
        "video_view_count": 0,
        "video_play_count": 0,
        "has_audio": false,
        "is_360": false,
        "carousel_media_count": 0,
        "carousel_items": [
          {
            "index": 0,
            "type": "image|video",
            "url": "",
            "video_url": "",
            "accessibility_caption": ""
          }
        ]
      },

      "engagement": {
        "likes_count": 0,
        "comments_count": 0,
        "views_count": 0,
        "plays_count": 0,
        "reach_count": 0,
        "impressions_count": 0,
        "saved_count": 0,
        "shares_count": 0,
        "profile_visits_from_post": 0,
        "follows_from_post": 0,
        "engagement_rate": 0.0
      },

      "location": {
        "id": "",
        "name": "",
        "slug": "",
        "address": "",
        "city": "",
        "country_code": "",
        "lat": 0.0,
        "lng": 0.0
      },

      "tagged_users": [
        {
          "username": "",
          "full_name": "",
          "is_verified": false
        }
      ],

      "sponsor_tags": [],
      "is_paid_partnership": false,
      "paid_partnership_label": "",

      "is_collab": false,
      "collab_accounts": [],

      "product_tags": [
        {
          "product_id": "",
          "name": "",
          "price_string": ""
        }
      ],

      "music": {
        "has_music": false,
        "music_title": "",
        "music_artist": "",
        "music_is_original_audio": false,
        "music_audio_type": ""
      },

      "reel_metadata": {
        "is_reel": false,
        "duration_seconds": 0,
        "clips_metadata": {
          "music_info": "",
          "original_sound_info": "",
          "audio_type": "",
          "remix_info": {
            "is_remix": false,
            "original_reel_id": ""
          }
        },
        "share_count": 0,
        "reach": 0,
        "watch_time_average_seconds": 0
      },

      "comments_disabled": false,
      "likes_disabled": false,
      "pinned_for_viewer": false,
      "is_top_post": false
    }
  ]
}
```

---

## 4. 💬 COMENTARIOS (Todos los comentarios de los últimos 30 posts)

```json
{
  "comments": [
    {
      "post_id": "",
      "post_shortcode": "",
      "comment_id": "",
      "parent_comment_id": "",
      "is_reply": false,
      "username": "",
      "full_name": "",
      "user_id": "",
      "is_verified": false,
      "user_followers_count": 0,
      "text": "",
      "timestamp": "",
      "likes_count": 0,
      "is_account_owner_reply": false,
      "owner_reply_timestamp": "",
      "owner_reply_text": "",
      "owner_response_time_minutes": 0,
      "mentions_in_comment": [],
      "hashtags_in_comment": [],
      "sentiment": "positive|negative|neutral|question",
      "is_spam": false,
      "replies_count": 0,
      "replies": [
        {
          "comment_id": "",
          "username": "",
          "text": "",
          "timestamp": "",
          "likes_count": 0,
          "is_account_owner": false
        }
      ]
    }
  ]
}
```

---

## 5. 📖 STORIES ACTIVAS (últimas 24h disponibles)

```json
{
  "stories": [
    {
      "id": "",
      "type": "image|video",
      "timestamp": "",
      "timestamp_unix": 0,
      "expiring_at": "",
      "duration_seconds": 0,
      "image_url": "",
      "video_url": "",
      "has_audio": false,
      "audience_count": 0,

      "stickers": {
        "has_mention": false,
        "mentioned_accounts": [],
        "has_hashtag": false,
        "hashtags": [],
        "has_link": false,
        "link_url": "",
        "link_title": "",
        "has_location": false,
        "location_name": "",
        "has_poll": false,
        "poll_question": "",
        "poll_options": [],
        "poll_vote_count": 0,
        "has_question_box": false,
        "question_text": "",
        "has_quiz": false,
        "quiz_question": "",
        "quiz_options": [],
        "quiz_correct_answer": "",
        "has_countdown": false,
        "countdown_end_time": "",
        "countdown_text": "",
        "has_emoji_slider": false,
        "emoji_slider_emoji": "",
        "has_product": false,
        "product_name": "",
        "has_music": false,
        "music_title": "",
        "music_artist": "",
        "has_cta_button": false,
        "cta_button_text": "",
        "cta_button_url": "",
        "has_gift": false
      },

      "is_from_reel": false,
      "reel_id": "",
      "is_paid_partnership": false,
      "can_reshare": false,
      "can_reply": false
    }
  ]
}
```

---

## 6. 👥 SEGUIDORES — MUESTRA ANALÍTICA (primeros 500 o muestra representativa)

```json
{
  "followers_sample": [
    {
      "username": "",
      "full_name": "",
      "is_verified": false,
      "is_private": false,
      "followers_count": 0,
      "following_count": 0,
      "posts_count": 0,
      "profile_pic_url": "",
      "is_business": false,
      "biography": "",
      "external_url": "",
      "followed_at": ""
    }
  ],
  "followers_analysis": {
    "total_followers": 0,
    "verified_followers_count": 0,
    "business_accounts_count": 0,
    "private_accounts_count": 0,
    "zero_posts_accounts_count": 0,
    "avg_followers_of_followers": 0,
    "top_followers_by_influence": []
  }
}
```

---

## 7. 👁️ SIGUIENDO — ANÁLISIS COMPLETO

```json
{
  "following": [
    {
      "username": "",
      "full_name": "",
      "is_verified": false,
      "is_private": false,
      "followers_count": 0,
      "is_business": false,
      "category": "",
      "followed_at": "",
      "follows_back": false
    }
  ],
  "following_analysis": {
    "total_following": 0,
    "follows_back_count": 0,
    "not_following_back_count": 0,
    "verified_accounts_following": 0,
    "business_accounts_following": 0,
    "competitors_identified": [],
    "influencers_following": [],
    "ratio_followers_to_following": 0.0
  }
}
```

---

## 8. ⏰ PATRONES DE PUBLICACIÓN

```json
{
  "posting_patterns": {
    "posts_by_hour": {
      "0": 0, "1": 0, "2": 0, "3": 0,
      "4": 0, "5": 0, "6": 0, "7": 0,
      "8": 0, "9": 0, "10": 0, "11": 0,
      "12": 0, "13": 0, "14": 0, "15": 0,
      "16": 0, "17": 0, "18": 0, "19": 0,
      "20": 0, "21": 0, "22": 0, "23": 0
    },
    "posts_by_day_of_week": {
      "Monday": 0,
      "Tuesday": 0,
      "Wednesday": 0,
      "Thursday": 0,
      "Friday": 0,
      "Saturday": 0,
      "Sunday": 0
    },
    "posts_by_month": {
      "January": 0, "February": 0, "March": 0,
      "April": 0, "May": 0, "June": 0,
      "July": 0, "August": 0, "September": 0,
      "October": 0, "November": 0, "December": 0
    },
    "avg_days_between_posts": 0.0,
    "max_gap_between_posts_days": 0,
    "min_gap_between_posts_hours": 0,
    "longest_inactive_period": {
      "start_date": "",
      "end_date": "",
      "days": 0
    },
    "posting_frequency_last_7_days": 0,
    "posting_frequency_last_30_days": 0,
    "posting_frequency_last_90_days": 0,
    "best_performing_hour": 0,
    "best_performing_day": "",
    "worst_performing_hour": 0,
    "worst_performing_day": ""
  }
}
```

---

## 9. 🏷️ ANÁLISIS COMPLETO DE HASHTAGS

```json
{
  "hashtags_analysis": {
    "all_hashtags_ever_used": [],
    "unique_hashtags_count": 0,
    "total_hashtag_uses": 0,
    "avg_hashtags_per_post": 0.0,
    "max_hashtags_in_one_post": 0,
    "min_hashtags_in_one_post": 0,
    "posts_without_hashtags": 0,

    "hashtag_frequency": {
      "#hashtag": {
        "count": 0,
        "avg_likes_when_used": 0,
        "avg_comments_when_used": 0,
        "avg_views_when_used": 0,
        "engagement_rate_when_used": 0.0
      }
    },

    "hashtag_categories": {
      "branded": [],
      "location": [],
      "niche": [],
      "trending": [],
      "community": [],
      "generic_high_volume": []
    },

    "hashtag_volume_distribution": {
      "nano_under_10k": [],
      "micro_10k_100k": [],
      "mid_100k_500k": [],
      "macro_500k_1m": [],
      "mega_over_1m": []
    },

    "top_10_by_frequency": [],
    "top_10_by_engagement_correlation": [],
    "hashtags_used_only_once": [],
    "banned_or_restricted_hashtags": [],
    "first_comment_hashtags": false
  }
}
```

---

## 10. 📊 MÉTRICAS DE ENGAGEMENT DETALLADAS

```json
{
  "engagement_metrics": {
    "overall": {
      "total_likes": 0,
      "total_comments": 0,
      "total_views": 0,
      "total_plays": 0,
      "total_saves": 0,
      "total_shares": 0,
      "avg_likes_per_post": 0.0,
      "avg_comments_per_post": 0.0,
      "avg_views_per_reel": 0.0,
      "avg_plays_per_reel": 0.0,
      "avg_saves_per_post": 0.0,
      "avg_shares_per_post": 0.0,
      "engagement_rate_by_followers": 0.0,
      "engagement_rate_by_reach": 0.0,
      "like_to_comment_ratio": 0.0,
      "comment_to_follower_ratio": 0.0,
      "view_to_follower_ratio": 0.0
    },

    "by_content_type": {
      "images": {
        "count": 0,
        "avg_likes": 0.0,
        "avg_comments": 0.0,
        "avg_engagement_rate": 0.0
      },
      "carousels": {
        "count": 0,
        "avg_likes": 0.0,
        "avg_comments": 0.0,
        "avg_swipe_rate": 0.0,
        "avg_engagement_rate": 0.0
      },
      "reels": {
        "count": 0,
        "avg_likes": 0.0,
        "avg_comments": 0.0,
        "avg_views": 0.0,
        "avg_plays": 0.0,
        "avg_watch_time_seconds": 0.0,
        "avg_engagement_rate": 0.0,
        "avg_reach": 0.0
      },
      "videos": {
        "count": 0,
        "avg_likes": 0.0,
        "avg_comments": 0.0,
        "avg_views": 0.0,
        "avg_engagement_rate": 0.0
      }
    },

    "top_10_posts_by_likes": [],
    "top_10_posts_by_comments": [],
    "top_10_posts_by_views": [],
    "top_10_posts_by_engagement_rate": [],
    "bottom_10_posts_by_engagement_rate": [],

    "growth": {
      "followers_gained_last_7_days": 0,
      "followers_gained_last_30_days": 0,
      "followers_gained_last_90_days": 0,
      "followers_lost_last_30_days": 0,
      "net_growth_last_30_days": 0,
      "growth_rate_percent_last_30_days": 0.0,
      "avg_daily_follower_gain": 0.0
    },

    "reach_and_impressions": {
      "avg_reach_per_post": 0,
      "avg_impressions_per_post": 0,
      "reach_to_follower_ratio": 0.0,
      "avg_reach_per_reel": 0,
      "organic_reach_estimate": 0,
      "paid_reach_estimate": 0
    }
  }
}
```

---

## 11. 🤝 MENCIONES, COLABORACIONES Y RELACIONES

```json
{
  "social_graph": {
    "accounts_mentioned_in_captions": [
      {
        "username": "",
        "mention_count": 0,
        "avg_engagement_on_posts_with_mention": 0.0
      }
    ],
    "accounts_tagged_in_posts": [
      {
        "username": "",
        "tag_count": 0
      }
    ],
    "accounts_that_mention_this_profile": [],
    "accounts_that_tag_this_profile": [],

    "collaborations": [
      {
        "post_id": "",
        "collab_account": "",
        "collab_type": "collab_post|paid_partnership|repost|mention",
        "timestamp": "",
        "engagement_vs_average": 0.0
      }
    ],

    "paid_partnerships": [
      {
        "post_id": "",
        "brand": "",
        "timestamp": "",
        "engagement": 0
      }
    ],

    "cross_promotion": {
      "promotes_other_accounts": [],
      "promoted_by_other_accounts": []
    }
  }
}
```

---

## 12. 🛍️ INSTAGRAM SHOPPING Y PRODUCTOS

```json
{
  "shopping": {
    "has_shopping_enabled": false,
    "catalog_id": "",
    "products_tagged_total": 0,
    "posts_with_products": 0,
    "product_list": [
      {
        "product_id": "",
        "name": "",
        "price_string": "",
        "currency": "",
        "url": "",
        "appearances_in_posts": 0,
        "avg_engagement_when_tagged": 0.0
      }
    ]
  }
}
```

---

## 13. 🔗 LINKS Y CONVERSIÓN

```json
{
  "links": {
    "bio_link": {
      "url": "",
      "type": "linktree|beacons|tap_bio|whatsapp|direct_website|booking|none",
      "destination_title": "",
      "contains_whatsapp": false,
      "whatsapp_number": "",
      "contains_booking": false,
      "booking_platform": "",
      "contains_catalog": false,
      "all_sub_links": [
        {
          "title": "",
          "url": "",
          "type": ""
        }
      ]
    },
    "links_in_stories": [],
    "links_in_posts_captions": [],
    "swipe_up_links": []
  }
}
```

---

## 14. 🎵 AUDIO Y MÚSICA EN REELS

```json
{
  "audio_analysis": {
    "reels_with_original_audio": 0,
    "reels_with_trending_music": 0,
    "reels_with_voiceover": 0,
    "reels_with_no_audio": 0,
    "most_used_songs": [
      {
        "title": "",
        "artist": "",
        "uses_count": 0,
        "avg_views_when_used": 0
      }
    ],
    "trending_audio_usage_rate": 0.0
  }
}
```

---

## 15. 📍 GEOLOCALIZACIÓN Y CONTEXTO LOCAL

```json
{
  "geolocation": {
    "posts_with_location": 0,
    "posts_without_location": 0,
    "most_tagged_locations": [
      {
        "name": "",
        "city": "",
        "country": "",
        "count": 0,
        "avg_engagement": 0.0
      }
    ],
    "primary_market": "",
    "detected_language": "",
    "secondary_languages": []
  }
}
```

---

## 16. 💬 GESTIÓN DE COMUNIDAD

```json
{
  "community_management": {
    "total_comments_received": 0,
    "total_comments_replied_by_owner": 0,
    "reply_rate_percent": 0.0,
    "avg_response_time_minutes": 0,
    "median_response_time_minutes": 0,
    "fastest_response_minutes": 0,
    "slowest_response_hours": 0,
    "comments_never_answered": 0,
    "questions_in_comments": 0,
    "questions_answered_percent": 0.0,
    "negative_comments_count": 0,
    "negative_comments_addressed_count": 0,
    "spam_comments_count": 0,
    "pinned_comments_count": 0,
    "top_commenters": [
      {
        "username": "",
        "comments_count": 0,
        "is_follower": false
      }
    ],
    "sentiment_breakdown": {
      "positive_percent": 0.0,
      "neutral_percent": 0.0,
      "negative_percent": 0.0,
      "questions_percent": 0.0
    },
    "most_common_comment_topics": [],
    "most_common_questions": []
  }
}
```

---

## 17. 📈 ANÁLISIS DE TENDENCIAS TEMPORALES

```json
{
  "temporal_trends": {
    "engagement_trend_last_90_days": "growing|stable|declining",
    "engagement_by_month": [
      {
        "month": "",
        "avg_likes": 0.0,
        "avg_comments": 0.0,
        "avg_views": 0.0,
        "posts_count": 0
      }
    ],
    "follower_growth_history": [
      {
        "date": "",
        "followers_count": 0,
        "delta": 0
      }
    ],
    "content_type_evolution": {
      "reels_percentage_by_quarter": [],
      "carousels_percentage_by_quarter": [],
      "images_percentage_by_quarter": []
    },
    "caption_length_trend": "increasing|stable|decreasing",
    "hashtag_count_trend": "increasing|stable|decreasing",
    "posting_frequency_trend": "increasing|stable|decreasing"
  }
}
```

---

## 18. 🏆 BENCHMARKS Y CONTEXTO COMPETITIVO

```json
{
  "benchmarks": {
    "account_size_category": "nano|micro|mid|macro|mega",
    "niche": "",
    "country": "",
    "city": "",
    "industry_avg_engagement_rate": 0.0,
    "account_engagement_vs_industry": "above|at|below",
    "posting_frequency_vs_industry": "above|at|below",
    "reel_adoption_vs_industry": "above|at|below",
    "response_rate_vs_industry": "above|at|below",
    "competitor_accounts": [
      {
        "username": "",
        "followers_count": 0,
        "avg_engagement_rate": 0.0,
        "posting_frequency_per_week": 0.0,
        "content_focus": ""
      }
    ]
  }
}
```

---

## 19. 🔍 METADATA TÉCNICA Y DE EXTRACCIÓN

```json
{
  "extraction_metadata": {
    "extracted_at": "",
    "extractor_version": "",
    "data_completeness_percent": 0.0,
    "posts_extracted": 0,
    "posts_total": 0,
    "comments_extracted": 0,
    "stories_extracted": 0,
    "highlights_extracted": 0,
    "followers_sample_size": 0,
    "following_extracted": 0,
    "errors": [],
    "missing_fields": [],
    "instagram_account_age_days": 0,
    "last_post_date": "",
    "first_post_date": "",
    "account_active_days": 0
  }
}
```

---

## 20. 📐 ESTRUCTURA FINAL DEL JSON RAÍZ

El archivo que me entregues debe tener esta estructura de primer nivel:

```json
{
  "profile": {},
  "highlights": [],
  "posts": [],
  "comments": [],
  "stories": [],
  "followers_sample": {},
  "following": {},
  "posting_patterns": {},
  "hashtags_analysis": {},
  "engagement_metrics": {},
  "social_graph": {},
  "shopping": {},
  "links": {},
  "audio_analysis": {},
  "geolocation": {},
  "community_management": {},
  "temporal_trends": {},
  "benchmarks": {},
  "extraction_metadata": {}
}
```

---

## ⚙️ NOTAS DE IMPLEMENTACIÓN

### Campos calculables vs extraíbles

Los siguientes campos **puedes calcularlos tú** en tu app antes de enviármelos, o dejármelos vacíos y los calculo yo a partir de los datos raw:

- `engagement_rate` por post (likes + comments / followers × 100)
- `posting_frequency_per_week`
- `posts_by_hour` y `posts_by_day_of_week`
- `hashtag_frequency`
- `avg_response_time_minutes`
- `reply_rate_percent`
- `sentiment` de comentarios
- `temporal_trends`
- `top_10_posts_by_*`

### Campos que solo Instagram Business puede proveer

Estos campos **solo están disponibles si la cuenta es Business/Creator y tienes acceso a sus Insights**:

- `reach_count`, `impressions_count`, `saved_count`, `shares_count`
- `profile_visits_from_post`, `follows_from_post`
- `watch_time_average_seconds`
- `stories audience_count`
- `follower_growth_history`
- `avg_reach_per_post`, `avg_impressions_per_post`

Si no tienes acceso a insights, deja esos campos en `null` y lo indicaré en el reporte.

### Formato de fechas

Usa siempre **ISO 8601**: `"2024-11-15T14:30:00+00:00"`

### Manejo de campos vacíos

- Strings vacíos: `""`
- Números no disponibles: `null` (no `0`, para distinguir "no disponible" de "cero")
- Arrays vacíos: `[]`
- Booleans desconocidos: `null`

---

## 📦 Entrega

Entrega el dataset como un único archivo `.json` con la estructura raíz definida en la sección 20.  
Con ese archivo puedo generar el reporte completo en `.md` cubriendo:

- Diagnóstico de identidad y branding
- Análisis de contenido y formatos
- Estrategia de hashtags
- Métricas de engagement y comparativa
- Patrones de publicación y horarios óptimos
- Gestión de comunidad y respuesta
- Análisis de audiencia
- Tendencias temporales
- Oportunidades y plan de acción 90 días
- KPIs recomendados con benchmarks del sector
