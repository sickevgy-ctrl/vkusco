<template>
  <div 
    class="yandex-reviews-widget"
    :class="{ 
      'transparent-bg': props.backgroundColor === 'transparent' || props.backgroundColor === 'var(--brand-primary-700)'
    }"
    :style="{ 
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center'
    }"
  >
    <!-- Виджет отзывов Яндекс.Карт -->
    <div 
      class="widget-container"
      :style="{ 
        width: '100%', 
        maxWidth: '560px',
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
        backgroundColor: props.backgroundColor,
        margin: '0 auto'
      }"
    >
      <iframe 
        :style="{ 
          width: '100%', 
          height: '100%', 
          border: props.borderColor === 'transparent' ? 'none' : `1px solid ${props.borderColor}`, 
          borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
          boxSizing: 'border-box'
        }" 
        :src="widgetUrl"
        :title="`Отзывы о ресторане ${props.restaurantName}`"
        loading="lazy"
        @load="onWidgetLoad"
        @error="onWidgetError"
      />
      
      <!-- Ссылка на Яндекс.Карты (показывается только если включена) -->
      <a 
        v-if="props.showLink"
        :href="`https://yandex.ru/maps/org/${props.restaurantSlug}/${props.restaurantId}/`"
        target="_blank" 
        rel="noopener noreferrer"
        class="widget-link"
        :style="{ 
          boxSizing: 'border-box',
          textDecoration: 'none',
          color: '#b3b3b3',
          fontSize: '10px',
          fontFamily: 'YS Text, sans-serif',
          padding: '0 16px',
          position: 'absolute',
          bottom: '8px',
          width: '100%',
          textAlign: 'center',
          left: '0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
          maxHeight: '14px',
          whiteSpace: 'nowrap'
        }"
      >
        {{ props.restaurantName }} на карте Самары — Яндекс Карты
      </a>
    </div>
    
    <!-- Загрузочный индикатор -->
    <div 
      v-if="isLoading" 
      class="loading-overlay"
      style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; border-radius: 8px;"
    >
      <div class="loading-spinner">
        <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-300">Загрузка отзывов...</p>
      </div>
    </div>
    
    <!-- Ошибка загрузки -->
    <div 
      v-if="hasError" 
      class="error-overlay"
      style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; padding: 2rem;"
    >
      <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-100 mb-2">Не удалось загрузить отзывы</h3>
      <p class="text-sm text-gray-300 mb-4 text-center">
        Возможно, возникли проблемы с загрузкой виджета Яндекс.Карт
      </p>
      <button 
        @click="retryLoad"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
interface Props {
  // Основные параметры ресторана
  restaurantName?: string
  restaurantSlug?: string
  restaurantId?: string
  
  // Размеры виджета
  width?: string | number
  height?: string | number
  
  // Настройки отображения
  showLink?: boolean
  showRating?: boolean
  maxReviews?: number
  
  // Стилизация
  borderRadius?: string | number
  borderColor?: string
  backgroundColor?: string
  
  // Языковые настройки
  language?: 'ru' | 'en'
  
  // Параметры виджета Яндекс
  theme?: 'light' | 'dark'
  showPhotos?: boolean
  showVideos?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  restaurantName: 'Вкусная Компания',
  restaurantSlug: 'vkusnaya_kompaniya',
  restaurantId: '243452895564',
  width: '100%',
  height: 800,
  showLink: true,
  showRating: true,
  maxReviews: 10,
  borderRadius: 8,
  borderColor: '#e6e6e6',
  backgroundColor: 'transparent',
  language: 'ru',
  theme: 'light',
  showPhotos: true,
  showVideos: false
})

// Вычисляемое свойство для URL виджета
const widgetUrl = computed(() => {
  const baseUrl = `https://yandex.ru/maps-reviews-widget/${props.restaurantId}?comments`
  const params = new URLSearchParams()
  
  // Добавляем параметры в зависимости от настроек
  if (props.language !== 'ru') {
    params.append('lang', props.language)
  }
  
  if (props.theme === 'dark') {
    params.append('theme', 'dark')
  }
  
  if (props.maxReviews && props.maxReviews !== 10) {
    params.append('limit', props.maxReviews.toString())
  }
  
  if (!props.showPhotos) {
    params.append('no-photos', '1')
  }
  
  if (props.showVideos) {
    params.append('with-videos', '1')
  }
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}&${queryString}` : baseUrl
})

// Состояние виджета
const isLoading = ref(true)
const hasError = ref(false)
const retryCount = ref(0)
const maxRetries = 3
let loadTimeout: ReturnType<typeof setTimeout> | null = null

// Обработчики событий
const onWidgetLoad = () => {
  // Очищаем таймаут, если виджет успешно загрузился
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
  isLoading.value = false
  hasError.value = false
}

const onWidgetError = (event?: Event) => {
  // Очищаем таймаут при ошибке
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Виджет отзывов не загрузился. Это может быть нормально, если iframe заблокирован.')
  }
  hasError.value = true
  isLoading.value = false
}

const retryLoad = () => {
  if (retryCount.value >= maxRetries) {
    console.warn('⚠️ Превышено максимальное количество попыток загрузки')
    return
  }
  
  retryCount.value++
  isLoading.value = true
  hasError.value = false
  
  // Очищаем предыдущий таймаут
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
  
  // Устанавливаем новый таймаут
  handleLoadError()
  
  // Принудительно перезагружаем iframe
  const iframe = document.querySelector('iframe[src*="yandex.ru/maps-reviews-widget"]') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src + '&t=' + Date.now()
  }
}

// Обработка ошибок загрузки
const handleLoadError = () => {
  loadTimeout = setTimeout(() => {
    if (isLoading.value && !hasError.value) {
      onWidgetError()
    }
    loadTimeout = null
  }, 10000) // 10 секунд таймаут
}

onMounted(() => {
  handleLoadError()
})

onBeforeUnmount(() => {
  // Очищаем таймаут при размонтировании компонента
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
})

// SEO метаданные для отзывов (только для Nuxt)
// useHead({
//   meta: [
//     {
//       name: 'description',
//       content: `Отзывы о ресторане ${props.restaurantName} в Самаре. Реальные отзывы посетителей на Яндекс.Картах.`
//     },
//     {
//       property: 'og:title',
//       content: `Отзывы о ресторане ${props.restaurantName}`
//     },
//     {
//       property: 'og:description',
//       content: `Читайте отзывы посетителей ресторана ${props.restaurantName} в Самаре на Яндекс.Картах`
//     }
//   ]
// })
</script>

<style scoped>
.yandex-reviews-widget {
  position: relative;
  margin: 0 auto;
}

.widget-container {
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Убираем тени для прозрачного фона */
.widget-container:not([style*="background-color: transparent"]) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.widget-container:not([style*="background-color: transparent"]):hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.widget-link {
  transition: color 0.3s ease;
}

.widget-link:hover {
  color: #666 !important;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Адаптивность */
@media (max-width: 640px) {
  .yandex-reviews-widget {
    padding: 0 1rem;
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .widget-container {
    border-color: #374151;
  }
  
  .loading-overlay {
    background: rgba(17, 24, 39, 0.9) !important;
  }
  
  .error-overlay {
    background: rgba(17, 24, 39, 0.95) !important;
  }
}

/* Кастомные размеры */
.yandex-reviews-widget.compact .widget-container {
  height: 400px !important;
}

.yandex-reviews-widget.large .widget-container {
  height: 1000px !important;
}

/* Кастомные темы */
.yandex-reviews-widget.dark-theme .widget-container {
  border-color: #4b5563;
  background-color: #1f2937;
}

.yandex-reviews-widget.light-theme .widget-container {
  border-color: #e5e7eb;
  background-color: #ffffff;
}

/* Стили для виджетов с прозрачным фоном */
.yandex-reviews-widget.transparent-bg .widget-container {
  box-shadow: none !important;
}

.yandex-reviews-widget.transparent-bg .widget-container:hover {
  box-shadow: none !important;
  transform: none !important;
}

/* Убираем границы для прозрачного фона */
.yandex-reviews-widget.transparent-bg iframe {
  border: none !important;
}

/* Стили для виджетов с полупрозрачным фоном */
.yandex-reviews-widget .widget-container {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Тень для виджетов с полупрозрачным фоном */
.yandex-reviews-widget .widget-container:not([style*="background-color: transparent"]) {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Стили для темной темы */
.yandex-reviews-widget .widget-container[style*="rgba(0, 0, 0, 0.1)"] {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

/* Убираем белые элементы для темной темы */
.yandex-reviews-widget .loading-overlay {
  background: rgba(0, 0, 0, 0.8) !important;
}

.yandex-reviews-widget .error-overlay {
  background: rgba(0, 0, 0, 0.9) !important;
}
</style>
