// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import brand from './brand.config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-21',
  modules: [
    '@nuxtjs/tailwindcss',
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
  css: ['@/assets/css/main.css'],
  app: {
    head: {
      title: `${brand.name} — Ресторан изысканной кухни`,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: `${brand.name} — ресторан итальянской и европейской кухни. Забронируйте столик для незабываемого ужина.` }
      ]
    }
  }
})