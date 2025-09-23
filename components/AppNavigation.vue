<template>
  <nav class="glass bg-black/20 backdrop-blur shadow-lg border-b border-white/10 fixed top-0 left-0 right-0 w-full z-50 text-white" aria-label="Основная навигация">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div class="flex justify-between items-center h-16">
        <!-- Логотип -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <picture>
              <source srcset="/content/IMG_3306.PNG.avif" type="image/avif" />
              <source srcset="/content/IMG_3306.PNG.webp" type="image/webp" />
              <img src="/content/IMG_3306.PNG" alt="Логотип" class="h-14 w-auto"/>
            </picture>
          </NuxtLink>
        </div>

        <!-- Навигационные ссылки для десктопа -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <NuxtLink 
              v-for="item in navigation" 
              :key="item.name"
              :to="item.href"
              class="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              active-class="text-white font-semibold"
            >
              {{ item.name }}
            </NuxtLink>
            <button 
              @click="openReservationModal"
              class="btn-primary shadow-glow"
            >
              Забронировать
            </button>
          </div>
        </div>

        <!-- Мобильное меню -->
        <div class="md:hidden">
          <button 
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
          >
            <svg 
              class="h-6 w-6" 
              :class="{ 'hidden': isOpen, 'block': !isOpen }"
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              class="h-6 w-6" 
              :class="{ 'block': isOpen, 'hidden': !isOpen }"
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Мобильная панель -->
    <div class="md:hidden" :class="{ 'block': isOpen, 'hidden': !isOpen }">
  <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/40 backdrop-blur shadow-lg text-white">
        <NuxtLink 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.href"
          class="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
          active-class="text-white font-semibold"
          @click="isOpen = false"
        >
          {{ item.name }}
        </NuxtLink>
        <button 
          @click="openReservationModal" 
          class="btn-primary w-full mt-4 shadow-glow"
        >
          Забронировать
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'

const isOpen = ref(false)
const { isReservationOpen } = useReservationModal()

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Меню', href: '/menu' },
  { name: 'О нас', href: '/about' },
  { name: 'Контакты', href: '/contact' }
]

const openReservationModal = () => {
  isReservationOpen.value = true
  isOpen.value = false // закрыть мобильное меню
}
</script>