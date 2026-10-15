// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'portafolio-color-mode',
  },

  // @nuxt/fonts descarga las fuentes de Google en el build y las sirve desde el propio sitio.
  fonts: {
    families: [
      { name: 'Schibsted Grotesk', provider: 'google', weights: [500, 700, 800, 900] },
      { name: 'Hanken Grotesk', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  tailwindcss: {
    cssPath: false,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#FAFAF8', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0C0C0B', media: '(prefers-color-scheme: dark)' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
