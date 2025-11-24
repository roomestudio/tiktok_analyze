// Declaraciones globales para Nuxt
declare module '#app' {
  interface NuxtApp {
    $fetch: typeof globalThis.$fetch
  }
}

// Auto-import de composables
declare global {
  const useExport: typeof import('../composables/useExport').useExport
  const $fetch: typeof globalThis.$fetch
}

export {}
