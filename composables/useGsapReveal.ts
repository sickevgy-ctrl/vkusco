import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useGsapReveal() {
  const elements = ref<HTMLElement[]>([])
  const timelines = ref<gsap.core.Timeline[]>([])

  // Базовые анимации появления элементов
  const revealFromBottom = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 1,
      stagger = 0.1,
      y = 60,
      opacity = 0,
      ease = 'power3.out',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    tl.fromTo(selector, 
      { y, opacity, willChange: 'transform, opacity' },
      { y: 0, opacity: 1, duration, stagger, ease, clearProps: 'willChange' }
    )

    timelines.value.push(tl)
    return tl
  }

  const revealFromLeft = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 1,
      stagger = 0.1,
      x = -100,
      opacity = 0,
      ease = 'power3.out',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    tl.fromTo(selector,
      { x, opacity, willChange: 'transform, opacity' },
      { x: 0, opacity: 1, duration, stagger, ease, clearProps: 'willChange' }
    )

    timelines.value.push(tl)
    return tl
  }

  const revealFromRight = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 1,
      stagger = 0.1,
      x = 100,
      opacity = 0,
      ease = 'power3.out',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    tl.fromTo(selector,
      { x, opacity, willChange: 'transform, opacity' },
      { x: 0, opacity: 1, duration, stagger, ease, clearProps: 'willChange' }
    )

    timelines.value.push(tl)
    return tl
  }

  const fadeIn = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 1,
      stagger = 0.1,
      opacity = 0,
      ease = 'power2.out',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    tl.fromTo(selector,
      { opacity, willChange: 'opacity' },
      { opacity: 1, duration, stagger, ease, clearProps: 'willChange' }
    )

    timelines.value.push(tl)
    return tl
  }

  // Анимация масштабирования
  const scaleIn = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 1,
      stagger = 0.1,
      scale = 0.8,
      opacity = 0,
      ease = 'back.out(1.7)',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    tl.fromTo(selector,
      { scale, opacity, willChange: 'transform, opacity' },
      { scale: 1, opacity: 1, duration, stagger, ease, clearProps: 'willChange' }
    )

    timelines.value.push(tl)
    return tl
  }

  // Параллакс эффект
  const parallax = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top bottom',
      end = 'bottom top',
      yPercent = -50,
      ease = 'none'
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        end,
        scrub: true
      }
    })

    tl.to(selector, { yPercent, ease })

    timelines.value.push(tl)
    return tl
  }

  // Анимация печатающегося текста для героя
  const typewriterEffect = (selector: string | HTMLElement[], options: any = {}) => {
    const {
      trigger = null,
      start = 'top 80%',
      duration = 2,
      ease = 'none',
      once = true
    } = options

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || selector,
        start,
        once
      }
    })

    // Эффект появления букв по одной
    tl.from(selector, {
      duration,
      text: '',
      ease
    })

    timelines.value.push(tl)
    return tl
  }

  // Очистка всех анимаций
  const cleanup = () => {
    timelines.value.forEach(tl => {
      tl.kill()
    })
    timelines.value = []
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    revealFromBottom,
    revealFromLeft,
    revealFromRight,
    fadeIn,
    scaleIn,
    parallax,
    typewriterEffect,
    cleanup,
    timelines
  }
}