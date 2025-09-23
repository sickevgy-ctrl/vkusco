import { defineNuxtPlugin } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register GSAP plugins on client
gsap.registerPlugin(ScrollTrigger)

// Загружаем SplitText с CDN (client-only)
if (typeof window !== 'undefined') {
  // Проверяем, не загружен ли уже SplitText
  if (typeof (window as any).SplitText === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js'
    script.async = true
    script.onload = () => {
      console.log('SplitText loaded successfully')
    }
    script.onerror = () => {
      console.warn('Failed to load SplitText from CDN')
    }
    document.head.appendChild(script)
  }
}

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.provide('gsap', gsap)
  nuxtApp.provide('ScrollTrigger', ScrollTrigger)
})
