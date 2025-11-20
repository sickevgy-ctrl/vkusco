// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import brand from './app/brand.config'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  compatibilityDate: '2025-09-21',
  
  // Оптимизация производительности
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'lenis': ['lenis'],
            'split-type': ['split-type'],
            'vendor': ['ogl']
          }
        }
      }
    }
  },
  
  // Оптимизация производительности
  experimental: {
    payloadExtraction: false
  },
  
  // Оптимизация рендеринга
  render: {
    resourceHints: false
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    ['@nuxtjs/google-fonts', {
      families: {
        [brand.fonts.primary.family]: brand.fonts.primary.weights,
        [brand.fonts.display.family]: brand.fonts.display.weights
      },
      display: 'swap',
      download: true,
      inject: true
    }]
  ],
  css: ['~/assets/css/critical.css', '~/assets/css/main.css', 'lenis/dist/lenis.css'],
  routeRules: {
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/content/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },
  // SEO конфигурация
  site: {
    url: 'https://vkusnayakompania.ru',
    name: brand.name,
    description: `${brand.name} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.`,
    defaultLocale: 'ru'
  },

  // Sitemap конфигурация
  sitemap: {
    hostname: 'https://vkusnayakompania.ru',
    gzip: true,
    routes: [
      '/',
      '/about',
      '/menu',
      '/contact'
    ]
  },

  // Robots конфигурация
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/_nuxt/', '/api/', '/admin/', '/.env', '/node_modules/'],
    Sitemap: 'https://vkusnayakompania.ru/sitemap.xml'
  },

  app: {
    head: {
      title: `${brand.name} — Ресторан изысканной кухни`,
      titleTemplate: `%s | ${brand.name}`,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: `${brand.name} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.` },
        { name: 'keywords', content: 'ресторан, европейская кухня, бронирование столиков, ужин, обед, Вкусная компания' },
        { name: 'author', content: brand.name },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'ru' },
        { name: 'geo.region', content: 'RU' },
        { name: 'geo.placename', content: 'Москва' },
        { name: 'theme-color', content: brand.colors.primary },
        
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: brand.name },
        { property: 'og:title', content: `${brand.name} — Ресторан изысканной кухни` },
        { property: 'og:description', content: `${brand.name} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.` },
        { property: 'og:image', content: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.svg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'ru_RU' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${brand.name} — Ресторан изысканной кухни` },
        { name: 'twitter:description', content: `${brand.name} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.` },
        { name: 'twitter:image', content: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.svg' },
        
        // Mobile
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: brand.name }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'icon', type: 'image/png', href: '/content/IMG_3306.PNG' },
        { rel: 'apple-touch-icon', href: '/content/IMG_3306.PNG' },
        { rel: 'mask-icon', href: '/logo.svg', color: brand.colors.primary },
        { rel: 'canonical', href: 'https://vkusnayakompania.ru' },
        
        // DNS prefetch для внешних ресурсов
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        
        // Preconnect для критических ресурсов
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        
        // Предзагрузка LCP изображения (используем SVG заглушку)
        { rel: 'preload', href: '/images/atmosphere/main-hall.svg', as: 'image', type: 'image/svg+xml' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: brand.name,
            description: `${brand.name} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.`,
            url: 'https://vkusnayakompania.ru',
            telephone: '+7-917-142-15-74',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'ул. Советской Армии, 177',
              addressLocality: 'Москва',
              addressCountry: 'RU'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '55.7558',
              longitude: '37.6176'
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '12:00',
                closes: '23:00'
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: '12:00',
                closes: '24:00'
              }
            ],
            priceRange: '$$',
            servesCuisine: ['Европейская', 'Итальянская'],
            image: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.svg',
            logo: 'https://vkusnayakompania.ru/logo.svg'
          })
        }
      ]
    }
  }
})