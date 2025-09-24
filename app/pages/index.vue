<template>
  <div style="background-color: var(--brand-primary-700);">
    <!-- Героя секция как карточка во всю ширину -->
    <section ref="hero" class="relative h-screen flex items-start justify-center overflow-hidden section-card w-[100vw] z-10">
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

      <!-- Декоративные растения (SVG) -->
      <svg ref="plantLeft" class="absolute left-0 bottom-0 h-64 w-auto z-20 opacity-0" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 220C38 180 46 140 62 110C78 80 94 62 110 56C84 60 64 76 50 104C36 132 28 172 40 220Z" fill="rgba(111,143,75,0.9)"/>
        <path d="M20 230C16 190 26 152 48 122C70 92 86 74 110 68C88 72 70 88 56 116C42 144 30 184 20 230Z" fill="rgba(58,79,46,0.85)"/>
      </svg>
      <svg ref="plantRight" class="absolute right-0 bottom-0 h-72 w-auto z-20 opacity-0" viewBox="0 0 120 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 240C86 196 82 158 66 126C50 94 34 74 14 66C36 72 54 92 68 124C82 156 90 196 80 240Z" fill="rgba(111,143,75,0.9)"/>
        <path d="M104 252C110 206 102 166 80 132C58 98 40 78 16 70C40 78 60 98 76 130C92 162 102 204 104 252Z" fill="rgba(58,79,46,0.85)"/>
      </svg>
      
      <!-- Контент -->
      <div ref="heroContent" class="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center pt-16">
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
            <button v-split="{ types: 'words, chars', delayStep: 0.015, threshold: 0 }" class="btn-primary text-lg px-10 py-5 shadow-glow" @click="isReservationOpen = true">
              Забронировать столик
            </button>
          </div>
        </div>
      </div>

    </section>

  

  <!-- О ресторане -->
  <section class="py-16 section-card w-[100vw]" aria-labelledby="about-title" style="background-color: var(--brand-primary-700);">
      <div class="absolute inset-0 bg-grid bg-[length:32px_32px] opacity-30 pointer-events-none"></div>
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
            <NuxtLink to="/about" class="btn-primary">
              Узнать больше
            </NuxtLink>
          </div>
          <div class="relative">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Интерьер ресторана"
              class="rounded-2xl shadow-elegant"
            >
          </div>
        </div>
      </div>
    </section>

  <!-- Блоки контента (фон остаётся слитным по всей странице) -->
  <div aria-live="polite">
      <!-- Популярные блюда -->
      <section ref="popularSection" class="py-16 section-card w-[100vw]" aria-labelledby="popular-title" style="background-color: var(--brand-primary-700);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="popular-title" v-split class="section-title opacity-0 transform translate-y-10">Популярные блюда</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              v-for="dish in popularDishes" 
              :key="dish.id"
                class="dish-card bg-white/5 backdrop-blur rounded-[28px] shadow-elegant overflow-hidden hover:shadow-xl transition-all duration-300 opacity-0 transform translate-y-12 first:opacity-100"
            >
              <img 
                :src="dish.image" 
                :alt="dish.name"
                loading="lazy" decoding="async"
                class="w-full h-48 object-cover"
              >
              <div class="p-6">
                <h3 v-split="{ types: 'words, chars', threshold: 0.25, delayStep: 0.02 }" class="text-xl font-semibold text-white mb-2">{{ dish.name }}</h3>
                <p class="text-gray-200/80 mb-4">{{ dish.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="price text-2xl font-bold text-primary-300">{{ dish.price }} ₽</span>
                  <button class="btn-primary shadow-glow">Заказать</button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-12">
            <NuxtLink to="/menu" class="btn-secondary text-lg px-8 py-4">
              Полное меню
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Атмосфера -->
      <section class="py-16 section-card w-[100vw]" aria-labelledby="atmosphere-title" style="background-color: var(--brand-primary-700);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="atmosphere-title" v-split class="section-title opacity-0 transform translate-y-10">Наша атмосфера</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(img, idx) in atmosphereImages"
              :key="idx"
              class="relative group rounded-[24px] overflow-hidden shadow-elegant"
            >
              <img
                :src="img.src"
                :alt="img.alt"
                loading="lazy" decoding="async"
                class="w-full h-48 md:h-56 object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Отзывы -->
      <section class="py-16 section-card w-[100vw]" aria-labelledby="reviews-title" style="background-color: var(--brand-primary-700);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 id="reviews-title" v-split class="section-title opacity-0 transform translate-y-10">Что говорят о нас</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="review in reviews" 
              :key="review.id"
              class="review-card bg-white/5 backdrop-blur p-6 rounded-[24px] shadow-lg opacity-0 transform translate-y-12 first:opacity-100"
            >
              <div class="flex items-center mb-4">
                <div class="flex text-primary-400">
                  <svg v-for="star in 5" :key="star" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              <p class="text-gray-200/90 mb-4 italic">"{{ review.text }}"</p>
              <div class="font-semibold text-white">{{ review.author }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Призыв к действию -->
  <section ref="ctaSection" class="py-24 text-white relative overflow-hidden section-card w-[100vw]" aria-labelledby="cta-title" style="background-color: var(--brand-primary-700);">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 id="cta-title" v-split="{ types: 'words, chars', delayStep: 0.02 }" class="text-4xl md:text-5xl font-playfair font-bold mb-6 opacity-0 transform translate-y-10">
          Готовы к незабываемому ужину?
        </h2>
        <p v-split="{ types: 'words, chars', delayStep: 0.015 }" class="text-2xl mb-10 opacity-0 transform translate-y-8">
          Забронируйте столик прямо сейчас и насладитесь изысканной кухней в уютной атмосфере
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center opacity-0 transform translate-y-6">
          <button v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }" class="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl transition-colors duration-300 shadow-glow" @click="isReservationOpen = true">
            Забронировать столик
          </button>
          <a v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }"
            href="tel:+79171421574"
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 inline-block"
          >
            Позвонить: +7 (917) 142-15-74
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import HeroDishTw from '~/components/HeroDishTw.vue'
import Plasma from '~/components/Plasma.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
import { useHomePageAnimations } from '@/composables/useHomePageAnimations'

// SEO мета-теги
useHead({
  title: 'Вкусная компания — Ресторан изысканной кухни',
  meta: [
    { name: 'description', content: '«Вкусная компания» — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.' }
  ]
})

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

// Анимации
const { initAllAnimations } = useHomePageAnimations()

// refs (минимум для текущих анимаций)
const hero = ref(null)

// Данные для популярных блюд
const popularDishes = ref([
  {
    id: 1,
    name: 'Ризотто с трюфелями',
    description: 'Кремовое ризотто с белыми трюфелями и пармезаном',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Паста Карбонара',
    description: 'Классическая паста с беконом, яйцом и пармезаном',
    price: 890,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Оссо Буко',
    description: 'Тушеная телячья голень в томатном соусе с овощами',
    price: 2390,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
])

// Изображения атмосферы
const atmosphereImages = ref([
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    alt: 'Основной зал'
  },
  {
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    alt: 'Барная стойка'
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    alt: 'Летняя терраса'
  },
  {
    src: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    alt: 'Винный погреб'
  }
])

// Отзывы
const reviews = ref([
  {
    id: 1,
    text: 'Потрясающая еда и обслуживание! Обязательно вернемся снова.',
    author: 'Анна Петрова'
  },
  {
    id: 2,
    text: 'Лучший итальянский ресторан в городе. Рекомендую всем!',
    author: 'Михаил Сидоров'
  },
  {
    id: 3,
    text: 'Романтическая атмосфера и изысканная кухня. Идеально для свидания.',
    author: 'Елена Волкова'
  }
])

// Убраны бежевые переключатели фона — общий фон страницы остаётся слитным

// Structured data (JSON-LD) for homepage: ItemList of popular dishes and reviews
const url = useRequestURL()
const origin = `${url.protocol}//${url.host}`
const restaurantId = `${origin}/#restaurant`

const itemListJson = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: popularDishes.value.map((dish, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'MenuItem',
      name: dish.name,
      description: dish.description,
      image: dish.image,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: dish.price
      }
    }
  }))
}))

const reviewsJson = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: reviews.value.map((r, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Review',
      reviewBody: r.text,
      author: { '@type': 'Person', name: r.author },
      itemReviewed: { '@id': restaurantId }
    }
  }))
}))

useHead(() => ({
  script: [
    { type: 'application/ld+json', children: JSON.stringify(itemListJson.value) },
    { type: 'application/ld+json', children: JSON.stringify(reviewsJson.value) }
  ]
}))

// Инициализация анимаций при монтировании компонента
onMounted(() => {
  initAllAnimations(hero.value)
})
</script>