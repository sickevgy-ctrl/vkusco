<template>
  <div style="background-color: var(--brand-primary-700);">
    <!-- Стек: статичный герой и наезд "О нас" во всю ширину -->
    <div ref="stacked" class="stacked-hero relative">
  <section ref="hero" class="hero-section relative h-screen flex items-start justify-center overflow-hidden w-full z-0">
      <!-- Plasma background -->
      <div class="absolute inset-0" style="background-color: rgb(6, 0, 16);">
        <Plasma 
          color="#6F8F4B"
          :speed="1"
          direction="forward"
          :scale="1"
          :opacity="1"
          :mouse-interactive="true"
        />
      </div>

      
      <!-- Контент -->
  <div ref="heroContent" class="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div class="mx-auto max-w-5xl">
          <h1 class="text-balance font-black text-white tracking-[-0.02em] text-[clamp(32px,7vw,96px)] leading-[1.03] mb-4" style="font-weight: 1000;">
            <span class="block">ПИТАНИЕ</span>
            <span class="block">ПОЛЕЗНЕЕ</span>
            <span class="block">ПРАВИЛЬНОГО</span>
          </h1>
          <p class="max-w-prose text-[clamp(16px,1.2vw,20px)] leading-relaxed text-white/85 mt-2 md:mt-3 mb-4">
            Мы слишком долго и усердно трудимся над тем что бы вы были здоровы и при этом ели привычную и вкусную еду.
          </p>
          <div class="mt-2 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button v-split="{ types: 'words, chars', delayStep: 0.015, threshold: 0 }" class="btn btn-primary shadow-glow" @click="isReservationOpen = true">
              Забронировать столик
            </button>
          </div>
        </div>
      </div>

    </section>

  <!-- Слитный оверлей: "О нас" + "Популярные блюда" двигаются как единое полотно -->
  <div class="stacked-content relative z-20">
    <!-- О ресторане (наезд на hero, во всю ширину, со скруглением сверху) -->
    <section
      class="about-section relative overflow-hidden pt-16 pb-0 w-full min-h-screen rounded-t-[28px] md:rounded-t-[28px]"
      aria-labelledby="about-title"
      style="background-color: var(--brand-primary-700);"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="about-title" class="text-3xl md:text-4xl font-playfair font-bold text-white mb-6 opacity-0 transform translate-y-10">
                О нас
              </h2>
              <p class="text-lg text-gray-200/90 mb-6">
                «Вкусная Компания» — это всегда о заботе и честности. Не важно, какой у вас день и чем вы занимаетесь, у нас вы можете расслабиться и просто быть собой. Каждому гостю мы дарим улыбку, внимание и лучшие продукты.
              </p>
              <p class="text-lg text-gray-200/90 mb-6">
                Мы объединяем поколения за одним столом: с друзьями, родителями, детьми, партнёрами — и даже за завтраком наедине с собой. В ресторане есть детская зона, а по выходным мы проводим семейные и детские мастер‑классы, чтобы ваш досуг был не только вкусным, но и интересным.
              </p>
              <p class="text-lg text-gray-200/90 mb-8">
                Приходите к нам по адресу ул. Советской Армии, 177 — проведите время с близкими и почувствуйте вдохновение на новые достижения!
              </p>
              <NuxtLink to="/about" class="btn btn-primary">
                Узнать больше
              </NuxtLink>
            </div>
            <div class="relative">
              <OptimizedImage 
                src="/images/atmosphere/main-hall.jpg"
                alt="Интерьер ресторана"
                loading="eager"
                decoding="sync"
                img-class="rounded-2xl shadow-elegant"
                width="800"
                height="600"
              />
            </div>
          </div>
        </div>
    </section>

    <!-- Популярные блюда (перенесены внутрь слитного полотна, без верхних отступов) -->
    <section ref="popularSection" class="pt-0 pb-12 w-full" aria-labelledby="popular-title" style="background-color: var(--brand-primary-700);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6">
            <h2 id="popular-title" v-split class="section-title mt-0 opacity-0 transform translate-y-10">Популярные блюда</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                v-for="dish in popularDishes" 
                :key="dish.id"
                  class="dish-card bg-white/5 backdrop-blur rounded-[28px] shadow-elegant overflow-hidden hover:shadow-xl transition-all duration-300 opacity-0 transform translate-y-12 first:opacity-100"
              >
                <OptimizedImage 
                  :src="dish.image" 
                  :alt="dish.name"
                  loading="lazy" 
                  decoding="async"
                  img-class="w-full h-48 object-cover"
                  width="500"
                  height="300"
                />
                <div class="p-6">
                  <div class="flex items-center justify-between mb-2">
                    <h3 v-split="{ types: 'words, chars', threshold: 0.25, delayStep: 0.02 }" class="text-xl font-semibold text-white">{{ dish.name }}</h3>
                    <span v-if="dish.isHit" class="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">Хит</span>
                  </div>
                  <p class="text-gray-200/80 mb-2">{{ dish.description }}</p>
                  <p class="text-gray-300/70 text-sm mb-4">{{ dish.weight }}</p>
                  <div class="flex justify-between items-center">
                    <span class="price text-2xl font-bold text-primary-300">{{ dish.price }} ₽</span>
                    <button class="btn btn-primary shadow-glow">Заказать</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-12">
              <NuxtLink to="/menu" class="btn btn-secondary">
                Полное меню
              </NuxtLink>
            </div>
          </div>
        </section>
  </div>
  </div>

  <!-- Блоки контента (фон остаётся слитным по всей странице) -->
  <div aria-live="polite">


      <!-- Наш интерьер: WebGL секция с OGL FlyingPosters -->
      <section class="py-0 w-full" aria-labelledby="interior-title" style="background-color: var(--brand-primary-700);">
        <div class="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-0">
          <div class="w-full relative overflow-hidden" style="height: 100vh;" ref="interiorWrap">
            <!-- Заголовок как оверлей, не влияет на поток и не добавляет отступ сверху -->
            <h2 id="interior-title" v-split class="section-title opacity-0 transform translate-y-10 absolute top-4 left-1/2 -translate-x-1/2 z-10">Наш интерьер</h2>
            <ClientOnly>
              <FlyingPosters
                ref="interiorPosters"
                :items="interiorImages"
                :plane-width="680"
                :plane-height="360"
                :distortion="1.4"
                :scroll-ease="0.25"
                :camera-fov="90"
                :camera-z="20"
              />
            </ClientOnly>
          </div>
        </div>
      </section>

      <!-- Отзывы -->
  <section class="py-12 w-full" aria-labelledby="reviews-title" style="background-color: var(--brand-primary-700);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between mb-8">
            <h2 id="reviews-title" v-split class="section-title opacity-0 transform translate-y-10">Что говорят о нас</h2>
            <div class="flex items-center space-x-4">
              <div v-if="averageRating > 0" class="flex items-center space-x-2">
                <div class="flex text-primary-400">
                  <svg v-for="star in 5" :key="star" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-white font-semibold">{{ averageRating.toFixed(1) }}</span>
                <span class="text-gray-300 text-sm">({{ totalCount }} отзывов)</span>
              </div>
              <button 
                @click="refreshReviews"
                :disabled="isLoading"
                class="text-primary-300 hover:text-primary-200 transition-colors duration-300 disabled:opacity-50"
                title="Обновить отзывы"
              >
                <svg class="w-5 h-5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Индикатор загрузки -->
          <div v-if="isLoading && !hasReviews" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
          
          <!-- Ошибка загрузки -->
          <div v-if="error && !hasReviews" class="text-center py-8">
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
              {{ error }}
            </div>
          </div>
          
          <!-- Отзывы -->
          <div v-if="hasReviews" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="(review, index) in recentReviews" 
              :key="review.id"
              class="review-card bg-white/5 backdrop-blur p-6 rounded-[24px] shadow-lg opacity-0 transform translate-y-12"
              :style="{ 
                animationDelay: `${index * 100}ms`,
                animation: hasReviews ? 'fadeInUp 0.6s ease-out forwards' : 'none'
              }"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex text-primary-400">
                  <svg 
                    v-for="star in generateStars(review.rating)" 
                    :key="star.index" 
                    class="w-5 h-5" 
                    :class="star.filled ? 'fill-current' : 'text-gray-600'"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="text-gray-400 text-sm">{{ formatReviewDate(review.date) }}</span>
              </div>
              <p class="text-gray-200/90 mb-4 italic">"{{ review.text }}"</p>
              <div class="flex items-center justify-between">
                <div class="font-semibold text-white">{{ review.author }}</div>
                <a 
                  href="https://yandex.ru/maps/org/vkusnaya_kompaniya/243452895564/reviews/?ll=50.202188%2C53.222568&z=17"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-300 hover:text-primary-200 text-sm transition-colors duration-300"
                >
                  Яндекс.Карты →
                </a>
              </div>
            </div>
          </div>
          
          <!-- Ссылка на все отзывы -->
          <div v-if="hasReviews" class="text-center mt-8">
            <a 
              href="https://yandex.ru/maps/org/vkusnaya_kompaniya/243452895564/reviews/?ll=50.202188%2C53.222568&z=17"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 text-primary-300 hover:text-primary-200 transition-colors duration-300"
            >
              <span>Посмотреть все отзывы на Яндекс.Картах</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>

    <!-- Призыв к действию -->
  <section ref="ctaSection" class="py-24 text-white relative overflow-hidden w-full" aria-labelledby="cta-title" style="background-color: var(--brand-primary-700);">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 id="cta-title" v-split="{ types: 'words, chars', delayStep: 0.02 }" class="text-4xl md:text-5xl font-playfair font-bold mb-6 opacity-0 transform translate-y-10">
          Готовы к незабываемому ужину?
        </h2>
        <p v-split="{ types: 'words, chars', delayStep: 0.015 }" class="text-2xl mb-10 opacity-0 transform translate-y-8">
          Забронируйте столик прямо сейчас и насладитесь изысканной кухней в уютной атмосфере
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center opacity-0 transform translate-y-6">
          <button v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }" class="btn btn-primary shadow-glow" @click="isReservationOpen = true">
            Забронировать столик
          </button>
          <a v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }"
            href="tel:+79171421574"
            class="btn btn-secondary"
          >
            Позвонить: +7 (917) 142-15-74
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import OptimizedImage from '~/components/OptimizedImage.vue'
import FlyingPosters from '~/components/FlyingPosters.vue'
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReservationModal } from '@/composables/useReservationModal'
import { useHomePageAnimations } from '@/composables/useHomePageAnimations'
import { useImageOptimization } from '@/composables/useImageOptimization'
import { useLazyLoading } from '@/composables/useLazyLoading'
import { useSEO, usePageSEO } from '@/composables/useSEO'
import { useYandexReviews } from '@/composables/useYandexReviews'

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

// Отзывы с Яндекс.Карт
const {
  reviews,
  isLoading,
  error,
  totalCount,
  averageRating,
  hasReviews,
  recentReviews,
  fetchReviews,
  refreshReviews,
  formatReviewDate,
  generateStars
} = useYandexReviews()

// Анимации
const { initAllAnimations } = useHomePageAnimations()

// Оптимизация изображений
const { createOptimizedImage } = useImageOptimization()

// Lazy loading для анимаций
const { observe, isIntersecting: isAnimationsIntersecting } = useLazyLoading({
  rootMargin: '100px 0px',
  threshold: 0.1,
  once: true
})

// refs (минимум для текущих анимаций)
const hero = ref(null)
const stacked = ref(null)
const interiorWrap = ref(null)
const interiorPosters = ref(null)

// Данные для популярных блюд (из vkusdostavka.shop)
const popularDishes = ref([
  {
    id: 1,
    name: 'Фермерский завтрак',
    description: 'Говяжья вырезка, глазунья, обжаренный картофель дольками, шампиньоны и свежий салат',
    price: 785,
    weight: '370 г',
    image: '/images/dishes/fermer-zavtrak.jpg',
    isHit: true
  },
  {
    id: 2,
    name: 'Немецкий завтрак',
    description: 'Глазунья, манная колбаска, картофельные дольки, фасоль, салат',
    price: 625,
    weight: '340 г',
    image: '/images/dishes/nemeckiy-zavtrak.jpg',
    isHit: true
  },
  {
    id: 3,
    name: 'Бриошь с лососем',
    description: 'Бриошь с лососем и яйцами пашот под муссом из пармезана и голландским соусом',
    price: 785,
    weight: '275 г',
    image: '/images/dishes/briosh-losos.jpg'
  }
])

// Статичные отзывы удалены - теперь используем динамические из Яндекс.Карт

// Блок "Наша атмосфера" удалён — связанные данные и разметка очищены

// Наш интерьер — тематические изображения (кофе, готовка, тесто) из Pixabay (CORS-friendly)
const interiorImages = [
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1280&auto=format&fit=crop', // кофе
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1280&auto=format&fit=crop', // бариста
  'https://images.unsplash.com/photo-1519751138087-5a3b3fd1f114?q=80&w=1280&auto=format&fit=crop', // тесто
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1280&auto=format&fit=crop', // выпечка
  'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1280&auto=format&fit=crop', // кухня
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1280&auto=format&fit=crop'  // шеф
]

// Простая SEO настройка для главной страницы
useHead({
  title: 'Главная | Вкусная компания — Ресторан изысканной кухни',
  meta: [
    { name: 'description', content: '«Вкусная компания» — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.' },
    { name: 'keywords', content: 'ресторан, европейская кухня, бронирование, ужин, обед' }
  ]
})

// Инициализация анимаций при монтировании компонента
// Динамически подгоняем высоту стека: высота окна + высота слитного полотна (О нас + Популярные)
const adjustStackedHeight = () => {
  const el = stacked.value
  const sheet = document.querySelector('.stacked-content')
  if (!el || !sheet) return
  const vh = window.innerHeight
  const sheetHeight = sheet instanceof HTMLElement ? sheet.clientHeight : 0
  const overlap = Math.max(sheetHeight, vh)
  el.style.height = `${vh + overlap}px`
}

onMounted(async () => {
  // ensure gsap plugin
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }
  // Предзагрузка критического изображения героя удалена (атмосфера секция снята)
  
  // Загружаем отзывы с Яндекс.Карт
  await fetchReviews()
  
  // Наблюдаем за hero секцией для lazy loading анимаций
  if (hero.value) {
    observe(hero.value)
  }
  nextTick(adjustStackedHeight)
  window.addEventListener('resize', adjustStackedHeight)
  
  // Инициализируем анимации только когда они попадают в viewport
  watch(isAnimationsIntersecting, (intersecting) => {
    if (intersecting) {
      // Используем requestIdleCallback для неблокирующей инициализации
      requestIdleCallback(() => {
        initAllAnimations(hero.value)
      })
    }
  })

  // Пин и управление FlyingPosters (робастно, ждём появления компонента в DOM)
  nextTick(() => {
    let attempts = 0
    const tryInit = () => {
      const section = document.querySelector('section[aria-labelledby="interior-title"]')
      const posters = interiorPosters.value
      if (section && posters) {
        // Удаляем старые триггеры на случай HMR
        ScrollTrigger.getAll().forEach(t => {
          const vars = t && t.vars ? t.vars : {}
          if (vars.trigger === section) t.kill()
        })
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => posters?.setProgress?.(self.progress),
          onLeave: () => posters?.releaseControl?.(),
          onLeaveBack: () => posters?.releaseControl?.()
        })
        ScrollTrigger.refresh()
      } else if (attempts < 10) {
        attempts++
        setTimeout(tryInit, 100)
      }
    }
    tryInit()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustStackedHeight)
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sticky stack: герой статичен, "О нас" поверх */
.stacked-hero { position: relative; height: 200vh; }
.hero-section { position: sticky; top: 0; height: 100vh; }
.about-section { position: relative; }
</style>