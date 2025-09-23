import { defineNuxtPlugin } from 'nuxt/app'
import Lenis from 'lenis'
import gsap from 'gsap'

export default defineNuxtPlugin((nuxtApp) => {
  const lenis = new Lenis({ autoRaf: false })

  // If ScrollTrigger is available, update it on Lenis scroll
  try {
    const st = (nuxtApp as any).$ScrollTrigger || (window as any).ScrollTrigger
    if (st?.update) {
      lenis.on('scroll', st.update)
    }
  } catch {}

  // Drive Lenis via GSAP ticker for perfect sync when GSAP is present
  const update = (time: number) => {
    // gsap time is in seconds; Lenis expects ms
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)
  gsap.ticker.lagSmoothing(0)

  // Provide instance
  nuxtApp.provide('lenis', lenis)
})
