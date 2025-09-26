import { computed } from 'vue'

export interface ImageFormats {
  avif?: string
  webp?: string
  jpg?: string
  png?: string
}

export interface OptimizedImageConfig {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  formats?: ImageFormats
  quality?: number
}

export const useImageOptimization = () => {
  /**
   * Генерирует оптимизированные пути для изображения
   */
  const generateImagePaths = (basePath: string): ImageFormats => {
    const pathWithoutExt = basePath.replace(/\.[^/.]+$/, '')
    
    return {
      avif: `${pathWithoutExt}.avif`,
      webp: `${pathWithoutExt}.webp`,
      jpg: `${pathWithoutExt}.jpg`,
      png: `${pathWithoutExt}.png`
    }
  }

  /**
   * Создает конфигурацию для OptimizedImage компонента
   */
  const createOptimizedImage = (config: OptimizedImageConfig) => {
    const formats = config.formats || generateImagePaths(config.src)
    
    return {
      src: config.src,
      alt: config.alt,
      width: config.width,
      height: config.height,
      loading: config.loading || 'lazy',
      avifSrc: formats.avif,
      webpSrc: formats.webp,
      fallbackSrc: formats.jpg || formats.png || config.src
    }
  }

  /**
   * Генерирует srcset для responsive изображений
   */
  const generateResponsiveSrcSet = (
    basePath: string, 
    widths: number[] = [320, 640, 768, 1024, 1280, 1920]
  ) => {
    const formats = generateImagePaths(basePath)
    
    return {
      avif: widths.map(w => `${formats.avif}?w=${w} ${w}w`).join(', '),
      webp: widths.map(w => `${formats.webp}?w=${w} ${w}w`).join(', '),
      fallback: widths.map(w => `${formats.jpg || formats.png}?w=${w} ${w}w`).join(', ')
    }
  }

  /**
   * Предзагрузка критических изображений
   */
  const preloadImage = (src: string, formats?: ImageFormats) => {
    if (process.client) {
      // Предзагружаем AVIF если поддерживается
      if (formats?.avif) {
        const avifLink = document.createElement('link')
        avifLink.rel = 'preload'
        avifLink.as = 'image'
        avifLink.href = formats.avif
        avifLink.type = 'image/avif'
        document.head.appendChild(avifLink)
      }
      
      // Fallback на WebP
      if (formats?.webp) {
        const webpLink = document.createElement('link')
        webpLink.rel = 'preload'
        webpLink.as = 'image'
        webpLink.href = formats.webp
        webpLink.type = 'image/webp'
        document.head.appendChild(webpLink)
      }
    }
  }

  /**
   * Проверяет поддержку современных форматов изображений
   */
  const checkFormatSupport = () => {
    if (process.client) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      return {
        avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0,
        webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }
    }
    
    return { avif: false, webp: false }
  }

  /**
   * Lazy loading с Intersection Observer
   */
  const useLazyLoading = () => {
    const observedElements = new Set<Element>()
    
    const observe = (element: Element, callback: () => void) => {
      if (observedElements.has(element)) return
      
      observedElements.add(element)
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              callback()
              observer.unobserve(entry.target)
              observedElements.delete(entry.target)
            }
          })
        },
        { 
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      )
      
      observer.observe(element)
    }
    
    return { observe }
  }

  /**
   * Оптимизация размера изображений для разных устройств
   */
  const getOptimalImageSize = (containerWidth: number, devicePixelRatio: number = 1) => {
    const optimalWidth = Math.ceil(containerWidth * devicePixelRatio)
    
    // Ближайший размер из стандартных
    const standardSizes = [320, 640, 768, 1024, 1280, 1920, 2560]
    return standardSizes.find(size => size >= optimalWidth) || 1920
  }

  /**
   * Генерирует blur placeholder для изображений
   */
  const generateBlurPlaceholder = (width: number = 40, height: number = 40) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#f3f4f6')
      gradient.addColorStop(1, '#e5e7eb')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }
    
    return canvas.toDataURL('image/jpeg', 0.1)
  }

  return {
    generateImagePaths,
    createOptimizedImage,
    generateResponsiveSrcSet,
    preloadImage,
    checkFormatSupport,
    useLazyLoading,
    getOptimalImageSize,
    generateBlurPlaceholder
  }
}
