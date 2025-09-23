<template>
  <div>
    <!-- Меню: горизонтальная прокрутка -->
  <section ref="menuSection" :class="['relative pt-[4.5rem] transition-colors duration-300', isBeige ? 'text-gray-900' : 'text-white', { 'bg-beige': isBeige }]">
      <!-- Desktop: GSAP horizontal scroll (pinned). Mobile: native horizontal scroll with snap. -->
      <div 
        ref="menuTrack"
  class="menu-track flex gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar"
      >
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
                    <div class="flex justify-between items-center">
                      <h3 :class="['text-lg font-semibold group-hover:text-primary-300 transition-colors duration-300 truncate', isBeige ? 'text-gray-900' : 'text-white']">{{ dish.name }}</h3>
                      <span class="text-lg font-bold text-primary-300 ml-4 whitespace-nowrap">{{ dish.price }} ₽</span>
                    </div>
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
            <h3 class="text-2xl font-playfair font-bold text-white">{{ selectedDish.name }}</h3>
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
            <button class="btn-primary flex-1 shadow-glow">
              Добавить в заказ
            </button>
            <button class="btn-secondary px-6">
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
        <button v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }" class="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl transition-colors duration-300 shadow-glow" @click="isReservationOpen.value = true">
          Забронировать столик
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
const { $gsap, $ScrollTrigger } = useNuxtApp()

// SEO
useHead({
  title: 'Меню — Вкусная компания',
  meta: [
    { name: 'description', content: 'Ознакомьтесь с нашим меню. Изысканные блюда европейской кухни, приготовленные из свежих ингредиентов.' }
  ]
})

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

const selectedDish = ref(null)
const isBeige = ref(false)
const menuSection = ref(null)
const menuTrack = ref(null)
const cleanupTriggers = []

// Меню
const menuData = ref([
  {
    id: 'appetizers',
    name: 'Закуски',
    dishes: [
      {
        id: 1,
        name: 'Брускетта с томатами',
        description: 'Хрустящий хлеб с томатами, базиликом и чесноком',
        price: 450,
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['томаты', 'базилик', 'чеснок', 'оливковое масло', 'хлеб']
      },
      {
        id: 2,
        name: 'Карпаччо из говядины',
        description: 'Тонко нарезанная говядина с рукколой и пармезаном',
        price: 890,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['говядина', 'руккола', 'пармезан', 'каперсы', 'лимон']
      },
      {
        id: 3,
        name: 'Моцарелла ди буфала',
        description: 'Свежая моцарелла с томатами и базиликом',
        price: 750,
        image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['моцарелла', 'томаты', 'базилик', 'оливковое масло']
      }
    ]
  },
  {
    id: 'pasta',
    name: 'Паста',
    dishes: [
      {
        id: 4,
        name: 'Карбонара',
        description: 'Спагетти с беконом, яйцом и пармезаном',
        price: 890,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['спагетти', 'бекон', 'яйцо', 'пармезан', 'черный перец']
      },
      {
        id: 5,
        name: 'Болоньезе',
        description: 'Спагетти с мясным соусом по-болонски',
        price: 790,
        image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['спагетти', 'говядина', 'томаты', 'лук', 'морковь', 'сельдерей']
      },
      {
        id: 6,
        name: 'Равиоли с рикоттой',
        description: 'Домашние равиоли с сыром рикотта и шпинатом',
        price: 990,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['мука', 'яйца', 'рикотта', 'шпинат', 'пармезан', 'сливочное масло']
      }
    ]
  },
  {
    id: 'pizza',
    name: 'Пицца',
    dishes: [
      {
        id: 7,
        name: 'Маргарита',
        description: 'Классическая пицца с томатами, моцареллой и базиликом',
        price: 690,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['тесто', 'томатный соус', 'моцарелла', 'базилик']
      },
      {
        id: 8,
        name: 'Кватро Стаджони',
        description: 'Пицца четыре сезона с грибами, ветчиной и артишоками',
        price: 990,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['тесто', 'томатный соус', 'моцарелла', 'грибы', 'ветчина', 'артишоки', 'оливки']
      },
      {
        id: 9,
        name: 'Дьявола',
        description: 'Острая пицца с пепперони и халапеньо',
        price: 890,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['тесто', 'томатный соус', 'моцарелла', 'пепперони', 'халапеньо']
      }
    ]
  },
  {
    id: 'main',
    name: 'Основные блюда',
    dishes: [
      {
        id: 10,
        name: 'Оссо Буко',
        description: 'Тушеная телячья голень в томатном соусе',
        price: 2390,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['телятина', 'томаты', 'морковь', 'лук', 'сельдерей', 'белое вино']
      },
      {
        id: 11,
        name: 'Рыба дня',
        description: 'Свежая рыба на гриле с овощами',
        price: 1890,
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['рыба', 'оливковое масло', 'лимон', 'овощи гриль']
      },
      {
        id: 12,
        name: 'Ризотто с трюфелями',
        description: 'Кремовое ризотто с белыми трюфелями',
        price: 1890,
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['рис арборио', 'белые трюфели', 'пармезан', 'белое вино', 'лук']
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Десерты',
    dishes: [
      {
        id: 13,
        name: 'Тирамису',
        description: 'Классический итальянский десерт с маскарпоне',
        price: 490,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['маскарпоне', 'савоярди', 'кофе', 'какао', 'яйца']
      },
      {
        id: 14,
        name: 'Панна котта',
        description: 'Нежный десерт с ягодным соусом',
        price: 390,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['сливки', 'сахар', 'желатин', 'ваниль', 'ягоды']
      },
      {
        id: 15,
        name: 'Каннолли',
        description: 'Хрустящие трубочки с кремом рикотта',
        price: 450,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['мука', 'рикотта', 'сахарная пудра', 'фисташки', 'цукаты']
      }
    ]
  },
  {
    id: 'drinks',
    name: 'Напитки',
    dishes: [
      {
        id: 16,
        name: 'Эспрессо',
        description: 'Классический итальянский кофе',
        price: 150,
        image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['кофейные зерна арабика']
      },
      {
        id: 17,
        name: 'Кьянти',
        description: 'Красное вино из Тосканы',
        price: 450,
        image: 'https://images.unsplash.com/photo-1506377247307-62010ff4d3ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['виноград санджовезе']
      },
      {
        id: 18,
        name: 'Лимончелло',
        description: 'Традиционный итальянский ликер',
        price: 350,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        ingredients: ['лимоны', 'спирт', 'сахар']
      }
    ]
  }
])

// GSAP horizontal scroll on desktop; native swipe on mobile
let tween = null
onMounted(() => {
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

// Breadcrumbs and Menu JSON-LD
const url = useRequestURL()
const origin = `${url.protocol}//${url.host}`
const restaurantId = `${origin}/#restaurant`

const menuJson = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Меню ресторана',
  hasMenuSection: menuData.value.map(section => ({
    '@type': 'MenuSection',
    name: section.name,
    hasMenuItem: section.dishes.map(dish => ({
      '@type': 'MenuItem',
      name: dish.name,
      description: dish.description,
      image: dish.image,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: dish.price
      }
    }))
  })),
  inLanguage: 'ru'
}))

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Меню', item: `${origin}/menu` }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Меню',
        mainEntity: { '@id': restaurantId },
        hasPart: menuJson.value
      })
    }
  ]
}))
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