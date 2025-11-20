<template>
  <div ref="galleryRef" class="horizontal-scroll-gallery">
    <div class="gallery-container" ref="containerRef">
      <div class="gallery-track" ref="trackRef">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="gallery-item"
          :class="{ 'active': activeIndex === index }"
        >
          <div class="image-wrapper">
            <img 
              :src="image.src" 
              :alt="image.alt"
              :data-fallback="image.fallback"
              class="gallery-image"
              loading="eager"
              decoding="async"
              @error="handleImageError"
              @load="handleImageLoad"
            />
            <div class="image-overlay">
              <h3 class="image-title">{{ image.title }}</h3>
              <p class="image-description">{{ image.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

interface GalleryImage {
  src: string
  fallback?: string
  alt: string
  title: string
  description: string
}

const props = defineProps<{
  images: GalleryImage[]
}>()

const galleryRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const activeIndex = ref(0)
const scrollTriggerInstance = ref<ScrollTrigger | null>(null)
const trackWidthStyle = computed(() => `${props.images.length * 100}vw`)

// Обработчик ошибок изображений
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Ошибка загрузки изображения:', img.src)
  
  // Попробуем загрузить fallback изображение
  const fallbackSrc = img.getAttribute('data-fallback')
  if (fallbackSrc && img.src !== fallbackSrc) {
    console.log('Пытаемся загрузить fallback изображение:', fallbackSrc)
    img.src = fallbackSrc
  } else {
    // Если fallback тоже не работает, показываем placeholder
    console.log('Fallback не доступен, показываем placeholder')
    img.style.display = 'none'
    // Добавляем placeholder
    const placeholder = document.createElement('div')
    placeholder.className = 'image-placeholder'
    placeholder.innerHTML = `
      <div class="placeholder-content">
        <h3>${img.alt}</h3>
        <p>Изображение временно недоступно</p>
      </div>
    `
    img.parentNode?.replaceChild(placeholder, img)
  }
}

// Обработчик успешной загрузки изображения
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.classList.add('loaded')
}

// Обработка скролла
const handleScroll = () => {
  if (!containerRef.value) return
  
  const scrollLeft = containerRef.value.scrollLeft
  const itemWidth = window.innerWidth
  const newIndex = Math.round(scrollLeft / itemWidth)
  
  if (newIndex !== activeIndex.value && newIndex >= 0 && newIndex < props.images.length) {
    activeIndex.value = newIndex
  }
}


// Инициализация анимаций
const initAnimations = () => {
  if (!galleryRef.value || !trackRef.value) return
  
  // Простая анимация появления элементов галереи
  const items = galleryRef.value.querySelectorAll('.gallery-item')
  items.forEach((item, index) => {
    gsap.fromTo(item, 
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out"
      }
    )
  })
}

// Инициализация горизонтального скролла с ScrollTrigger
const initHorizontalScroll = () => {
  if (!galleryRef.value || !containerRef.value) return

  // Уничтожаем предыдущий ScrollTrigger, если он был
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill()
    scrollTriggerInstance.value = null
  }

  if (window.innerWidth <= 768) {
    containerRef.value.scrollLeft = activeIndex.value * window.innerWidth
    return
  }

  const container = containerRef.value
  const computeEndDistance = () => {
    if (!container) return window.innerWidth
    // Вычисляем максимальную ширину скролла: (количество изображений - 1) * ширина viewport
    const itemWidth = window.innerWidth
    const maxScroll = itemWidth * (props.images.length - 1)
    // Убеждаемся, что возвращаем положительное значение, минимум одно окно
    return Math.max(maxScroll, itemWidth)
  }

  scrollTriggerInstance.value = ScrollTrigger.create({
    trigger: galleryRef.value,
    start: 'top top',
    end: () => `+=${computeEndDistance()}`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      if (!container) return

      const itemWidth = window.innerWidth
      const maxScroll = itemWidth * (props.images.length - 1)
      if (maxScroll <= 0) return

      const targetScroll = self.progress * maxScroll
      container.scrollLeft = targetScroll

      const newIndex = Math.round(targetScroll / itemWidth)
      if (newIndex !== activeIndex.value && newIndex >= 0 && newIndex < props.images.length) {
        activeIndex.value = newIndex
      }
    },
    onLeave: () => {
      // Убеждаемся, что после завершения анимации скролл продолжается
      if (container) {
        const itemWidth = window.innerWidth
        container.scrollLeft = itemWidth * (props.images.length - 1)
      }
    },
    onLeaveBack: () => {
      // При скролле назад сбрасываем на начало
      if (container) {
        container.scrollLeft = 0
      }
    }
  })
}

// Обработка изменения размера окна
const handleResize = () => {
  if (!containerRef.value) return

  const itemWidth = window.innerWidth
  containerRef.value.scrollTo({
    left: activeIndex.value * itemWidth,
    behavior: 'instant' as ScrollBehavior
  })

  initHorizontalScroll()
  ScrollTrigger.refresh()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)

    setTimeout(() => {
      initAnimations()
      initHorizontalScroll()
      // Обновляем ScrollTrigger после инициализации для правильного расчета
      ScrollTrigger.refresh()
    }, 200)

    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    }

    window.addEventListener('resize', handleResize)

    if (containerRef.value) {
      containerRef.value.scrollLeft = 0
    }
  }
})

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
  
  window.removeEventListener('resize', handleResize)
  
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill()
    scrollTriggerInstance.value = null
  }
})
</script>

<style scoped>
.horizontal-scroll-gallery {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--brand-primary-700);
}

.gallery-container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gallery-container::-webkit-scrollbar {
  display: none;
}

.gallery-track {
  display: flex;
  width: v-bind('trackWidthStyle');
  height: 100%;
  will-change: transform;
  scroll-snap-type: x mandatory;
}

.gallery-item {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.6s ease;
  scroll-snap-align: start;
}

.gallery-item.active {
  opacity: 1;
}

.image-wrapper {
  position: relative;
  width: 90%;
  height: 80%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  transition: transform 0.6s ease;
}

.gallery-item.active .image-wrapper {
  transform: scale(1.02);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease, opacity 0.3s ease;
  opacity: 0;
}

.gallery-image.loaded {
  opacity: 1;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6F8F4B, #8B4513);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.placeholder-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.placeholder-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.gallery-item.active .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem;
  color: white;
  transform: translateY(100%);
  transition: transform 0.6s ease;
}

.gallery-item.active .image-overlay {
  transform: translateY(0);
}

.image-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.gallery-item.active .image-title {
  opacity: 1;
  transform: translateY(0);
}

.image-description {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.4s;
}

.gallery-item.active .image-description {
  opacity: 0.9;
  transform: translateY(0);
}


/* Адаптивность */
@media (max-width: 768px) {
  .gallery-item {
    width: 100vw;
  }
  
  .image-wrapper {
    width: 95%;
    height: 70%;
    border-radius: 16px;
  }
  
  .image-overlay {
    padding: 1.5rem;
  }
  
  .image-title {
    font-size: 1.5rem;
  }
  
  .image-description {
    font-size: 1rem;
  }
}
</style>
