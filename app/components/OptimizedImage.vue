<template>
  <div class="relative overflow-hidden" :class="containerClass">
    <!-- Blur placeholder пока изображение загружается -->
    <div 
      v-if="showPlaceholder && !isLoaded"
      class="absolute inset-0 bg-gray-200 animate-pulse"
      :style="{ backgroundImage: `url(${blurDataUrl})` }"
    ></div>
    
    <!-- Оптимизированное изображение -->
    <!-- Для SVG используем простой img, для остальных - picture с форматами -->
    <template v-if="isSvg">
      <img
        ref="imageRef"
        :src="fallbackSrc"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        :class="[imgClass, { 'transition-opacity duration-300': showPlaceholder }]"
        :style="{ opacity: (isLoaded || !showPlaceholder) ? 1 : 0 }"
        :width="width"
        :height="height"
        @load="onLoad"
        @error="onError"
      >
    </template>
    <picture 
      v-else
      v-show="isLoaded || !showPlaceholder"
      class="block"
      :class="{ 'opacity-0': !isLoaded && showPlaceholder, 'opacity-100': isLoaded || !showPlaceholder }"
    >
      <!-- AVIF формат для современных браузеров -->
      <source 
        v-if="avifSrc" 
        :srcset="avifSrc" 
        type="image/avif"
      >
      
      <!-- WebP формат для браузеров с поддержкой -->
      <source 
        v-if="webpSrc" 
        :srcset="webpSrc" 
        type="image/webp"
      >
      
      <!-- Fallback для старых браузеров -->
      <img
        ref="imageRef"
        :src="fallbackSrc"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        :class="[imgClass, { 'transition-opacity duration-300': showPlaceholder }]"
        :width="width"
        :height="height"
        @load="onLoad"
        @error="onError"
      >
    </picture>
    
    <!-- Error state -->
    <div 
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
    >
      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useLazyLoading } from '../composables/useLazyLoading'

interface Props {
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  imgClass?: string
  containerClass?: string
  width?: number | string
  height?: number | string
  avifSrc?: string
  webpSrc?: string
  fallbackSrc?: string
  showPlaceholder?: boolean
  blurDataUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  decoding: 'async',
  imgClass: '',
  containerClass: '',
  width: undefined,
  height: undefined,
  avifSrc: undefined,
  webpSrc: undefined,
  fallbackSrc: undefined,
  showPlaceholder: true,
  blurDataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

// Состояние загрузки
const isLoaded = ref(false)
const hasError = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)

// Lazy loading
const { observe, isIntersecting } = useLazyLoading({
  rootMargin: '50px 0px',
  threshold: 0.1,
  once: true
})

// Проверка, является ли изображение SVG
const isSvg = computed(() => {
  return props.src.toLowerCase().endsWith('.svg')
})

// Автоматическое определение форматов на основе базового пути
const basePath = computed(() => {
  const path = props.src
  const lastDot = path.lastIndexOf('.')
  return lastDot !== -1 ? path.substring(0, lastDot) : path
})

const avifSrc = computed(() => {
  // Не генерируем AVIF для SVG файлов
  if (isSvg.value) {
    return undefined
  }
  return props.avifSrc || `${basePath.value}.avif`
})

const webpSrc = computed(() => {
  // Не генерируем WebP для SVG файлов
  if (isSvg.value) {
    return undefined
  }
  return props.webpSrc || `${basePath.value}.webp`
})

const fallbackSrc = computed(() => 
  props.fallbackSrc || props.src
)

const onLoad = (event: Event) => {
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
}

const onError = (event: Event) => {
  hasError.value = true
  console.warn(`Failed to load image: ${props.src}`)
  emit('error', event)
}

// Автоматически начинаем загрузку когда элемент попадает в viewport
watch(isIntersecting, (intersecting) => {
  if (intersecting && !isLoaded.value && !hasError.value) {
    isLoaded.value = true
  }
})

// Наблюдаем за элементом когда он примонтирован
onMounted(() => {
  if (props.loading === 'lazy' && imageRef.value) {
    observe(imageRef.value)
  } else if (props.loading === 'eager') {
    // Для eager loading сразу начинаем загрузку
    // Не устанавливаем isLoaded сразу, чтобы браузер мог правильно выбрать формат
    nextTick(() => {
      isLoaded.value = true
    })
    
    // Оптимизация: предзагружаем изображения с высоким приоритетом
    if (process.client && fallbackSrc.value) {
      try {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = fallbackSrc.value
        // Не добавляем onerror для preload, так как это может вызвать предупреждения
        document.head.appendChild(link)
      } catch (error) {
        // Игнорируем ошибки preload
      }
    }
  }
})
</script>
