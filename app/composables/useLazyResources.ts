import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface LazyResourceOptions {
  rootMargin?: string
  threshold?: number
  once?: boolean
  delay?: number
  priority?: 'high' | 'normal' | 'low'
}

export const useLazyResources = (options: LazyResourceOptions = {}) => {
  const {
    rootMargin = '100px 0px',
    threshold = 0.1,
    once = true,
    delay = 0,
    priority = 'normal'
  } = options

  const observer = ref<IntersectionObserver | null>(null)
  const isIntersecting = ref(false)
  const hasIntersected = ref(false)
  const isLoaded = ref(false)

  const observe = (element: Element | Ref<Element | null>) => {
    if (process.client && !observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            isIntersecting.value = entry.isIntersecting
            
            if (entry.isIntersecting && !hasIntersected.value) {
              hasIntersected.value = true
              
              // Загружаем ресурс с задержкой в зависимости от приоритета
              const loadDelay = priority === 'high' ? 0 : priority === 'low' ? delay + 200 : delay
              
              setTimeout(() => {
                isLoaded.value = true
              }, loadDelay)
              
              if (once && observer.value) {
                observer.value.unobserve(entry.target)
              }
            }
          })
        },
        { rootMargin, threshold }
      )
    }

    const target = element && 'value' in element ? element.value : element
    if (target && observer.value) {
      observer.value.observe(target)
    }
  }

  const unobserve = (element: Element | Ref<Element | null>) => {
    const target = element && 'value' in element ? element.value : element
    if (target && observer.value) {
      observer.value.unobserve(target)
    }
  }

  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    unobserve,
    disconnect,
    isIntersecting,
    hasIntersected,
    isLoaded
  }
}

// Composable для lazy loading изображений
export const useLazyImages = (options: LazyResourceOptions = {}) => {
  const { observe, isIntersecting, hasIntersected, isLoaded } = useLazyResources(options)
  
  const loadImage = (src: string, formats?: { avif?: string; webp?: string }) => {
    if (hasIntersected.value && !isLoaded.value) {
      // Предзагружаем изображение
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = formats?.avif || src
      document.head.appendChild(link)
    }
  }

  return {
    observe,
    isIntersecting,
    hasIntersected,
    isLoaded,
    loadImage
  }
}

// Composable для lazy loading анимаций
export const useLazyAnimations = (options: LazyResourceOptions = {}) => {
  const { observe, isIntersecting, hasIntersected, isLoaded } = useLazyResources(options)
  
  const loadAnimation = async (animationType: 'gsap' | 'split-type' | 'lenis') => {
    if (hasIntersected.value && !isLoaded.value) {
      try {
        switch (animationType) {
          case 'gsap':
            return await import(/* @vite-ignore */ 'gsap')
          case 'split-type':
            return await import(/* @vite-ignore */ 'split-type')
          case 'lenis':
            return await import(/* @vite-ignore */ 'lenis')
          default:
            return null
        }
      } catch (error) {
        console.warn(`Failed to load ${animationType}:`, error)
        return null
      }
    }
    return null
  }

  return {
    observe,
    isIntersecting,
    hasIntersected,
    isLoaded,
    loadAnimation
  }
}

// Composable для lazy loading компонентов
export const useLazyComponents = (options: LazyResourceOptions = {}) => {
  const { observe, isIntersecting, hasIntersected, isLoaded } = useLazyResources(options)
  
  const loadComponent = async (componentPath: string) => {
    if (hasIntersected.value && !isLoaded.value) {
      try {
        return await import(componentPath)
      } catch (error) {
        console.warn(`Failed to load component ${componentPath}:`, error)
        return null
      }
    }
    return null
  }

  return {
    observe,
    isIntersecting,
    hasIntersected,
    isLoaded,
    loadComponent
  }
}

// Composable для lazy loading шрифтов
export const useLazyFonts = (options: LazyResourceOptions = {}) => {
  const { observe, isIntersecting, hasIntersected, isLoaded } = useLazyResources(options)
  
  const loadFont = (fontFamily: string, weights: number[] = [400, 600, 700]) => {
    if (hasIntersected.value && !isLoaded.value) {
      // Загружаем шрифт
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights.join(';')}&display=swap`
      link.as = 'style'
      document.head.appendChild(link)
    }
  }

  return {
    observe,
    isIntersecting,
    hasIntersected,
    isLoaded,
    loadFont
  }
}
