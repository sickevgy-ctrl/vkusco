import { defineNuxtPlugin } from 'nuxt/app'

type SplitTypeInstance = any

interface SplitOptions {
  types?: string
  threshold?: number
  once?: boolean
  absolute?: boolean
  hoverWave?: boolean
  delayStep?: number
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const { default: SplitType } = await import('split-type')

  const registry = new WeakMap<HTMLElement, { inst?: SplitTypeInstance; observer?: IntersectionObserver; cleanup?: () => void }>()

  const doSplit = (el: HTMLElement, opts: SplitOptions = {}) => {
    const {
      types = 'words, chars',
      absolute = false,
      hoverWave = false,
      delayStep = 0.025,
    } = opts

    el.classList.add('split-target')
  const inst = new (SplitType as any)(el, { types, absolute })
    // Add per-char classes and stagger delays
    inst.chars?.forEach((c: HTMLElement, i: number) => {
      c.classList.add('split-char')
      c.style.animationDelay = `${i * delayStep}s`
    })
    inst.words?.forEach((w: HTMLElement) => w.classList.add('split-word'))
    if (hoverWave) el.classList.add('split-hover')
    // trigger animation
    el.classList.add('split-in')
    return inst
  }

  const revertSplit = (el: HTMLElement) => {
    const entry = registry.get(el)
    entry?.inst?.revert?.()
    el.classList.remove('split-in', 'split-hover', 'split-target')
  }

  nuxtApp.vueApp.directive('split', {
    mounted(el: HTMLElement, binding) {
      const opts: SplitOptions = binding.value || {}
      const { threshold = 0.2, once = true } = opts

      // If intersection-based reveal is desired (default)
      const observer = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const inst = doSplit(el, opts)
            registry.set(el, { inst, observer })
            if (once) observer.disconnect()
          }
        }
      }, { threshold })

      observer.observe(el)
      registry.set(el, { observer })
    },
    beforeUnmount(el: HTMLElement) {
      const entry = registry.get(el)
      entry?.observer?.disconnect()
      revertSplit(el)
      registry.delete(el)
    }
  })
})
