<template>
  <div>
    <!-- Заголовок -->
    <section class="relative py-20 bg-gray-900 text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      <div 
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
      ></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-playfair font-bold mb-4">О нас</h1>
        <p class="text-xl text-gray-300">История, ценности и люди, которые делают «Вкусная компания» особенной</p>
      </div>
    </section>

    <!-- Наша история -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6">
              Наша история
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              «Вкусная компания» открыла свои двери в 2009 году с простой миссией — делиться 
              лучшими гастрономическими впечатлениями в самом сердце Москвы. Мы выросли из любви к 
              качественным продуктам, уважения к традициям и стремления делать каждый ужин особенным.
            </p>
            <p class="text-lg text-gray-600 mb-6">
              Мы верим, что еда — это не просто топливо для тела, а способ объединять людей, 
              создавать воспоминания и делиться культурой. Каждое блюдо в нашем ресторане 
              готовится с любовью и вниманием к деталям.
            </p>
            <p class="text-lg text-gray-600">
              За 15 лет работы мы стали не просто рестораном, а местом, где встречаются 
              семьи, празднуют важные события и создают новые дружеские связи.
            </p>
          </div>
          <div class="space-y-4">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Интерьер ресторана"
              class="rounded-lg shadow-lg"
            >
            <img 
              src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Кухня ресторана"
              class="rounded-lg shadow-lg"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Наша команда -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Наша команда</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="member in team" 
            :key="member.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              :src="member.photo" 
              :alt="member.name"
              class="w-full h-64 object-cover"
            >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ member.name }}</h3>
              <p class="text-primary-600 font-medium mb-3">{{ member.position }}</p>
              <p class="text-gray-600">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Наши ценности -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Наши ценности</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="value in values" 
            :key="value.id"
            class="text-center"
          >
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path :d="value.icon"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Награды и признание -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Награды и признание</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="award in awards" 
            :key="award.id"
            class="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <div class="text-4xl mb-4">{{ award.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ award.title }}</h3>
            <p class="text-gray-600 text-sm">{{ award.year }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Призыв к действию -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-playfair font-bold mb-6">
          Готовы стать частью нашей истории?
        </h2>
        <p class="text-lg mb-8">
          Забронируйте столик и ощутите наше гостеприимство
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button class="btn-primary shadow-glow" @click="isReservationOpen.value = true">
            Забронировать столик
          </button>
          <NuxtLink 
            to="/contact" 
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-block"
          >
            Связаться с нами
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'

// SEO
useHead({
  title: 'О нас — Вкусная компания',
  meta: [
    { name: 'description', content: 'Узнайте историю ресторана «Вкусная компания», познакомьтесь с нашей командой и ценностями. Уже 15 лет создаём тёплые гастрономические впечатления в Москве.' }
  ]
})

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

// Команда
const team = ref([
  {
    id: 1,
    name: 'Антонио Росси',
    position: 'Основатель и шеф-повар',
    description: 'Уроженец Тосканы с 25-летним опытом в кулинарии. Создал концепцию ресторана.',
    photo: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Мария Бианки',
    position: 'Су-шеф',
    description: 'Специалист по пасте и ризотто. Обучалась в кулинарной школе в Болонье.',
    photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Лука Верди',
    position: 'Сомелье',
    description: 'Эксперт по итальянским винам с международной сертификацией.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
])

// Ценности
const values = ref([
  {
    id: 1,
    title: 'Качество',
    description: 'Только лучшие ингредиенты и проверенные поставщики',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 2,
    title: 'Традиции',
    description: 'Аутентичные рецепты, передаваемые из поколения в поколение',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 3,
    title: 'Гостеприимство',
    description: 'Каждый гость для нас - часть большой итальянской семьи',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  {
    id: 4,
    title: 'Инновации',
    description: 'Современные техники приготовления с сохранением классического вкуса',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  }
])

// Награды
const awards = ref([
  {
    id: 1,
    title: 'Лучший итальянский ресторан',
    year: '2023',
    icon: '🏆'
  },
  {
    id: 2,
    title: 'Премия за качество сервиса',
    year: '2022',
    icon: '⭐'
  },
  {
    id: 3,
    title: 'Ресторан года',
    year: '2021',
    icon: '🥇'
  },
  {
    id: 4,
    title: 'Лучшая винная карта',
    year: '2020',
    icon: '🍷'
  }
])
</script>