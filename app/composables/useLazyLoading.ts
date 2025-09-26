import { ref, onMounted, onUnmounted, watch, computed, readonly, type Ref } from 'vue'

export interface LazyLoadingOptions {
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export const useLazyLoading = (options: LazyLoadingOptions = {}) => {
  const {
    rootMargin = '50px 0px',
    threshold = 0.1,
    once = true
  } = options

  const observer = ref<IntersectionObserver | null>(null)
  const isIntersecting = ref(false)
  const hasIntersected = ref(false)

  const observe = (element: Element | Ref<Element | null>) => {
    if (process.client && !observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            isIntersecting.value = entry.isIntersecting
            
            if (entry.isIntersecting) {
              hasIntersected.value = true
              
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
    isIntersecting: readonly(isIntersecting),
    hasIntersected: readonly(hasIntersected)
  }
}

// Composable для lazy loading изображений
export const useLazyImage = (src: string, options: LazyLoadingOptions = {}) => {
  const imageRef = ref<HTMLImageElement | null>(null)
  const isLoaded = ref(false)
  const hasError = ref(false)
  const isLoading = ref(false)

  const { observe, unobserve, isIntersecting, hasIntersected } = useLazyLoading(options)

  const loadImage = () => {
    if (isLoading.value || isLoaded.value) return

    isLoading.value = true
    
    const img = new Image()
    
    img.onload = () => {
      isLoaded.value = true
      hasError.value = false
      isLoading.value = false
    }
    
    img.onerror = () => {
      hasError.value = true
      isLoading.value = false
      console.warn(`Failed to load image: ${src}`)
    }
    
    img.src = src
  }

  // Автоматически начинаем загрузку когда элемент попадает в viewport
  watch(isIntersecting, (intersecting) => {
    if (intersecting && !isLoaded.value && !hasError.value) {
      loadImage()
    }
  })

  // Наблюдаем за элементом когда он примонтирован
  onMounted(() => {
    if (imageRef.value) {
      observe(imageRef.value)
    }
  })

  onUnmounted(() => {
    if (imageRef.value) {
      unobserve(imageRef.value)
    }
  })

  return {
    imageRef,
    isLoaded: readonly(isLoaded),
    hasError: readonly(hasError),
    isLoading: readonly(isLoading),
    isIntersecting,
    hasIntersected,
    loadImage
  }
}

// Composable для lazy loading с placeholder
export const useLazyImageWithPlaceholder = (
  src: string, 
  placeholder: string,
  options: LazyLoadingOptions = {}
) => {
  const { imageRef, isLoaded, hasError, isLoading, isIntersecting } = useLazyImage(src, options)
  
  const currentSrc = computed(() => {
    if (hasError.value) return placeholder
    if (isLoaded.value) return src
    return placeholder
  })

  const imageClasses = computed(() => ({
    'opacity-0': isLoading.value && !isLoaded.value,
    'opacity-100': isLoaded.value,
    'transition-opacity duration-300': true
  }))

  return {
    imageRef,
    currentSrc,
    imageClasses,
    isLoaded,
    hasError,
    isLoading,
    isIntersecting
  }
}
