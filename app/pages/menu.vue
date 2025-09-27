<template>
  <div>
    <!-- Меню: горизонтальная прокрутка -->
  <section ref="menuSection" :class="['relative pt-[4.5rem] transition-colors duration-300', isBeige ? 'text-gray-900' : 'text-white', { 'bg-beige': isBeige }]">
      <!-- Индикатор загрузки и кнопка обновления -->
      <div class="absolute top-4 right-4 z-10 flex items-center gap-4">
        <button 
          v-if="needsUpdate"
          @click="updateMenu"
          class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
        >
          Обновить меню
        </button>
        <div v-if="isLoading" class="text-sm text-gray-400">
          Загрузка...
        </div>
        <div v-else-if="lastUpdated" class="text-xs text-gray-400">
          Обновлено: {{ new Date(lastUpdated).toLocaleString('ru') }}
        </div>
      </div>
      
      <!-- Desktop: GSAP horizontal scroll (pinned). Mobile: native horizontal scroll with snap. -->
      <div 
        ref="menuTrack"
  class="menu-track flex gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar"
      >
        <!-- Отладочная информация -->
        <div v-if="isLoading" class="panel w-[88vw] sm:w-[92vw] lg:w-screen flex-shrink-0">
          <div class="min-h-[calc(100vh-9rem)] flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p class="text-white">Загрузка меню...</p>
            </div>
          </div>
        </div>
        
        <!-- Отладочная информация для пустого меню -->
        <div v-if="!isLoading && menuData.length === 0" class="panel w-[88vw] sm:w-[92vw] lg:w-screen flex-shrink-0">
          <div class="min-h-[calc(100vh-9rem)] flex items-center justify-center">
            <div class="text-center">
              <p class="text-white mb-4">Меню не загружено</p>
              <button @click="loadMenuData" class="btn btn-primary">Попробовать снова</button>
            </div>
          </div>
        </div>
        
        <div 
          v-for="category in menuData" 
          :key="category.id"
          class="panel w-[88vw] sm:w-[92vw] lg:w-screen flex-shrink-0"
        >
          <div class="min-h-[calc(100vh-9rem)] flex flex-col bg-white/5 backdrop-blur rounded-2xl shadow-elegant p-6 sm:p-8 border border-white/10">
            <h2 :class="['text-2xl md:text-3xl font-playfair font-bold mb-6 text-center', isBeige ? 'text-gray-900' : 'text-white']">
              {{ category.name }}
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div
                v-for="dish in category.dishes"
                :key="dish.id"
                class="group cursor-pointer"
                @click="openDishModal(dish)"
              >
                <div class="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-[1px] overflow-hidden">
                  <img :src="dish.image" :alt="dish.name" loading="lazy" decoding="async" class="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 aspect-square object-cover rounded-lg flex-shrink-0 self-start" />
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-1">
                      <div class="flex items-center gap-2">
                        <h3 :class="['text-lg font-semibold group-hover:text-primary-300 transition-colors duration-300 truncate', isBeige ? 'text-gray-900' : 'text-white']">{{ dish.name }}</h3>
                        <span v-if="dish.isHit" class="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">Хит</span>
                      </div>
                      <span class="text-lg font-bold text-primary-300 ml-4 whitespace-nowrap">{{ dish.price }} ₽</span>
                    </div>
                    <p :class="['text-sm mb-1', isBeige ? 'text-gray-600' : 'text-gray-300']">{{ dish.description }}</p>
                    <p :class="['text-xs', isBeige ? 'text-gray-500' : 'text-gray-400']">{{ dish.weight }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Модальное окно блюда -->
    <div 
      v-if="selectedDish"
  class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      @click="closeDishModal"
    >
      <div 
        class="bg-white/5 backdrop-blur rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elegant border border-white/10 text-white"
        @click.stop
      >
        <div class="relative">
          <img 
            :src="selectedDish.image" 
            :alt="selectedDish.name"
            class="w-full h-64 object-cover"
          >
          <button 
            @click="closeDishModal"
            class="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-colors duration-300 shadow"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-2xl font-playfair font-bold text-white">{{ selectedDish.name }}</h3>
              <p class="text-gray-300/70 text-sm mt-1">{{ selectedDish.weight }}</p>
            </div>
            <span class="text-2xl font-bold text-primary-300">{{ selectedDish.price }} ₽</span>
          </div>
          <p class="text-gray-200/85 mb-4">{{ selectedDish.description }}</p>
          <div class="mb-6">
            <h4 class="font-semibold text-white mb-2">Ингредиенты:</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="ingredient in selectedDish.ingredients" 
                :key="ingredient"
                class="bg-white/10 text-white px-3 py-1 rounded-full text-sm border border-white/10"
              >
                {{ ingredient }}
              </span>
            </div>
          </div>
          <div class="flex space-x-4">
            <button class="btn btn-primary flex-1 shadow-glow">
              Добавить в заказ
            </button>
            <button class="btn btn-secondary">
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Призыв к действию -->
  <section class="py-20 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 v-split class="text-4xl font-playfair font-bold mb-6">
          Понравилось меню?
        </h2>
        <p v-split="{ types: 'words, chars', delayStep: 0.015 }" class="text-xl mb-10">
          Забронируйте столик и насладитесь нашими изысканными блюдами
        </p>
        <button v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }" class="btn btn-primary shadow-glow" @click="isReservationOpen = true">
          Забронировать столик
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
import { usePageSEO, useSEO } from '@/composables/useSEO'
const { $gsap, $ScrollTrigger } = useNuxtApp()

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

const selectedDish = ref(null)
const isBeige = ref(false)
const menuSection = ref(null)
const menuTrack = ref(null)
const cleanupTriggers = []

// Меню (загружается с API)
const menuData = ref([])
const isLoading = ref(true)
const lastUpdated = ref(null)
const needsUpdate = ref(false)

// Функция загрузки данных меню
const loadMenuData = async () => {
  try {
    isLoading.value = true
    const response = await $fetch('/api/menu')
    
    if (response.success) {
      console.log('Загружены данные меню:', response.data)
      menuData.value = response.data
      lastUpdated.value = response.lastUpdated
      needsUpdate.value = response.needsUpdate
    } else {
      console.warn('Ошибка загрузки меню:', response.message)
      // Используем базовые данные
      menuData.value = response.data || []
    }
  } catch (error) {
    console.error('Ошибка при загрузке меню:', error)
    // Используем базовые данные
    menuData.value = []
  } finally {
    isLoading.value = false
  }
}

// Функция обновления меню
const updateMenu = async () => {
  try {
    const response = await $fetch('/api/menu/update', { method: 'POST' })
    
    if (response.success) {
      // Перезагружаем данные после обновления
      await loadMenuData()
      console.log('Меню успешно обновлено')
    } else {
      console.error('Ошибка обновления меню:', response.message)
    }
  } catch (error) {
    console.error('Ошибка при обновлении меню:', error)
  }
}

// GSAP horizontal scroll on desktop; native swipe on mobile
let tween = null
onMounted(async () => {
  // Загружаем данные меню
  await loadMenuData()
  
  // Принудительно обновляем компонент
  await nextTick()
  
  $ScrollTrigger?.matchMedia({
    '(min-width: 1024px)': () => {
      const track = menuTrack.value
      const section = menuSection.value
      if (!track || !section) return

      const update = () => Math.max(0, track.scrollWidth - window.innerWidth)
      // Create tween that moves the track horizontally while page scrolls
      tween = $gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${update()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      // Toggle beige background on 3rd panel (index 2)
      const panels = track.querySelectorAll('.panel')
      const third = panels[2]
      if (third) {
        const trig = $ScrollTrigger.create({
          trigger: third,
          containerAnimation: tween,
          start: 'left center',
          end: 'right center',
          onEnter: () => { isBeige.value = true },
          onEnterBack: () => { isBeige.value = true },
          onLeave: () => { isBeige.value = false },
          onLeaveBack: () => { isBeige.value = false }
        })
        // store for cleanup
        cleanupTriggers.push(trig)
      }
    },
    '(max-width: 1023px)': () => {
      // mobile: native horizontal scroll; use ScrollTrigger with horizontal tracking on the track scroller
      const track = menuTrack.value
      if (!track) return
      const panels = track.querySelectorAll('.panel')
      const third = panels[2]
      if (third) {
        const trig = $ScrollTrigger.create({
          trigger: third,
          scroller: track,
          horizontal: true,
          start: 'left center',
          end: 'right center',
          onEnter: () => { isBeige.value = true },
          onEnterBack: () => { isBeige.value = true },
          onLeave: () => { isBeige.value = false },
          onLeaveBack: () => { isBeige.value = false }
        })
        cleanupTriggers.push(trig)
      }
    }
  })
})

onBeforeUnmount(() => {
  cleanupTriggers.forEach(t => t?.kill && t.kill())
  if (tween && tween.scrollTrigger) {
    tween.scrollTrigger.kill()
  }
  tween = null
})

// Функции для модального окна
const openDishModal = (dish) => {
  selectedDish.value = dish
}

const closeDishModal = () => {
  selectedDish.value = null
}

// SEO оптимизация для страницы меню
const { generateMenuItemStructuredData } = useSEO()

// Structured data для меню
const menuStructuredData = generateMenuItemStructuredData(
  menuData.value.flatMap(section => 
    section.dishes.map(dish => ({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      image: dish.image,
      category: section.name
    }))
  )
)

// Настройка SEO для страницы меню
usePageSEO({
  title: 'Меню',
  description: 'Ознакомьтесь с нашим меню. Изысканные блюда европейской кухни, приготовленные из свежих ингредиентов.',
  keywords: ['меню', 'блюда', 'европейская кухня', 'итальянская кухня', 'паста', 'пицца', 'десерты'],
  image: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.jpg',
  structuredData: menuStructuredData
})
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Scroll snap for mobile */
.menu-track {
  scroll-snap-type: x mandatory;
}
.panel {
  scroll-snap-align: start;
}
.bg-beige {
  background-color: #f4ead7; /* мягкий бежевый */
}
</style>