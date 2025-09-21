<template>
  <div>
    <!-- Героя секция -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden bg-radial-faded">
      <!-- Фоновое изображение -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
      <!-- Animated blobs -->
  <div class="absolute -top-24 -left-24 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-blob"></div>
  <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-primary-600/25 rounded-full blur-3xl animate-blob [animation-delay:2s]"></div>
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
      ></div>
      
      <!-- Контент -->
      <div class="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6 drop-shadow-glow tracking-tight">
          Вкусная <span class="gradient-text">компания</span>
        </h1>
        <p class="text-2xl md:text-3xl mb-10 max-w-3xl mx-auto text-white/90">
          Изысканная кухня и яркий вкус бренда
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button class="btn-primary text-lg px-10 py-5 shadow-glow" @click="isReservationOpen.value = true">
            Забронировать столик
          </button>
          <NuxtLink to="/menu" class="btn-secondary text-lg px-10 py-5 inline-block">
            Посмотреть меню
          </NuxtLink>
        </div>
      </div>

      <!-- Стрелка вниз -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>

    <!-- О ресторане -->
    <section class="py-20 bg-white relative">
      <div class="absolute inset-0 bg-grid bg-[length:32px_32px] opacity-30 pointer-events-none"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6">
              Добро пожаловать в «Вкусная компания»
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              Уже более 15 лет мы радуем наших гостей аутентичными блюдами, 
              приготовленными по проверенным рецептам из свежих ингредиентов.
            </p>
            <p class="text-lg text-gray-600 mb-8">
              Наши шеф-повара привносят в каждое блюдо внимание к деталям, сезонность и многолетний опыт.
            </p>
            <NuxtLink to="/about" class="btn-primary">
              Узнать больше
            </NuxtLink>
          </div>
          <div class="relative animate-float">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Интерьер ресторана"
              class="rounded-2xl shadow-elegant glow"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Популярные блюда -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Популярные блюда</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="dish in popularDishes" 
            :key="dish.id"
            class="bg-white rounded-2xl shadow-elegant overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <img 
              :src="dish.image" 
              :alt="dish.name"
              class="w-full h-48 object-cover"
            >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ dish.name }}</h3>
              <p class="text-gray-600 mb-4">{{ dish.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-primary-600">{{ dish.price }} ₽</span>
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
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Наша атмосфера</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(image, index) in atmosphereImages" 
            :key="index"
            class="relative overflow-hidden rounded-2xl shadow-elegant group"
          >
            <img 
              :src="image.src" 
              :alt="image.alt"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p class="text-white font-semibold text-lg">{{ image.alt }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Что говорят о нас</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="review in reviews" 
            :key="review.id"
            class="bg-white p-6 rounded-lg shadow-lg"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-primary-400">
                <svg v-for="star in 5" :key="star" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-4 italic">"{{ review.text }}"</p>
            <div class="font-semibold text-gray-800">{{ review.author }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Призыв к действию -->
  <section class="py-24 bg-primary-600 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_40%)]"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl md:text-5xl font-playfair font-bold mb-6">
          Готовы к незабываемому ужину?
        </h2>
        <p class="text-2xl mb-10">
          Забронируйте столик прямо сейчас и насладитесь изысканной кухней в уютной атмосфере
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button class="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl transition-colors duration-300 shadow-glow" @click="isReservationOpen.value = true">
            Забронировать столик
          </button>
          <a 
            href="tel:+74951234567"
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 inline-block"
          >
            Позвонить: +7 (495) 123-45-67
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'

// SEO мета-теги
useHead({
  title: 'Вкусная компания — Ресторан изысканной кухни',
  meta: [
    { name: 'description', content: '«Вкусная компания» — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.' }
  ]
})

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

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
</script>