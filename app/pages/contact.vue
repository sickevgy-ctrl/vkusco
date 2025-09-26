<template>
  <div>
    <!-- Заголовок -->
  <section class="text-white py-20" aria-labelledby="contact-title">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <h1 id="contact-title" v-split class="text-4xl md:text-5xl font-playfair font-bold mb-4">Контакты</h1>
  <p v-split="{ types: 'words, chars', delayStep: 0.02 }" class="text-xl text-gray-300">Свяжитесь с нами или забронируйте столик</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Контактная информация -->
        <div>
          <h2 v-split class="text-3xl font-playfair font-bold text-white mb-8">Как нас найти</h2>
          
          <div class="space-y-6">
            <!-- Адрес -->
            <div class="flex items-start space-x-4">
              <div class="bg-white/10 p-3 rounded-lg">
                <svg class="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Адрес</h3>
                <p class="text-gray-200/90">г. Самара, ул. Советской Армии, 177</p>
                <p class="text-gray-200/90">Рядом с удобной парковкой</p>
              </div>
            </div>

            <!-- Телефон -->
            <div class="flex items-start space-x-4">
              <div class="bg-white/10 p-3 rounded-lg">
                <svg class="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Телефон</h3>
                <p class="text-gray-200/90"><a href="tel:+79171421574" class="underline hover:text-primary-300">+7 (917) 142-15-74</a></p>
                <p class="text-gray-200/90">Бронирование столиков и консультация</p>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div class="bg-white/10 p-3 rounded-lg">
                <svg class="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Email</h3>
                <p class="text-gray-200/90">info@vkusnaya.company</p>
                <p class="text-gray-200/90">reservation@vkusnaya.company</p>
              </div>
            </div>

            <!-- Часы работы -->
            <div class="flex items-start space-x-4">
              <div class="bg-white/10 p-3 rounded-lg">
                <svg class="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Часы работы</h3>
                <div class="space-y-1 text-gray-200/90">
                  <p>Пн-Чт: 11:00-23:00</p>
                  <p>Пт-Сб: 11:00-24:00</p>
                  <p>Воскресенье: 12:00-22:00</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Социальные сети -->
          <div class="mt-8">
          <h3 class="text-lg font-semibold text-white mb-4">Следите за нами</h3>
            <div class="flex space-x-4">
              <a href="#" class="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition-colors duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Форма обратной связи -->
        <div>
         <h2 v-split class="text-3xl font-playfair font-bold text-white mb-8">Свяжитесь с нами</h2>
          
          <form @submit.prevent="submitForm" class="space-y-6" aria-labelledby="form-title">
            <h2 id="form-title" class="sr-only">Форма обратной связи</h2>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-200 mb-2">Имя *</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name"
                required
                class="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder:text-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                placeholder="Ваше имя"
              >
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-200 mb-2">Email *</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email"
                required
                class="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder:text-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                placeholder="your@email.com"
              >
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-200 mb-2">Телефон</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone"
                class="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder:text-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                placeholder="+7 (999) 123-45-67"
              >
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-200 mb-2">Тема</label>
              <select 
                id="subject" 
                v-model="form.subject"
                class="w-full px-4 py-3 border border-white/20 bg-white/5 text-white rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
              >
                <option value="">Выберите тему</option>
                <option value="reservation">Бронирование столика</option>
                <option value="event">Организация мероприятия</option>
                <option value="feedback">Отзыв или предложение</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-200 mb-2">Сообщение *</label>
              <textarea 
                id="message" 
                v-model="form.message"
                required
                rows="5"
                class="w-full px-4 py-3 border border-white/20 bg-white/5 text-white placeholder:text-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
                placeholder="Ваше сообщение..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить сообщение' }}
            </button>
          </form>

          <!-- Успешная отправка -->
          <div 
            v-if="showSuccess"
            class="mt-6 p-4 bg-white/10 border border-white/20 text-white rounded-lg"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.
            </div>
          </div>
        </div>
      </div>

      <!-- Наши филиалы -->
      <section class="mt-20" aria-labelledby="branches-title">
        <h2 id="branches-title" class="text-3xl font-playfair font-bold text-white mb-8">Наши филиалы</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Филиал 1 -->
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Садовая, 212Б</h3>
            <p class="text-gray-300 mb-2">Тел.: <a href="tel:+79879552565" class="underline hover:text-primary-300">+7 (987) 955-25-65</a></p>
            <p class="text-gray-300">Пн–Пт 08:00–21:00; Сб 08:30–21:00; Вс 09:00–21:00</p>
          </div>
          <!-- Филиал 2 -->
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">ул. Советской Армии, 177</h3>
            <p class="text-gray-300 mb-2">Тел.: <a href="tel:+79171421574" class="underline hover:text-primary-300">+7 (917) 142-15-74</a></p>
            <p class="text-gray-300">Пн–Ср 09:00–21:00; Чт 09:00–22:00; Пт, Сб 09:00–23:00; Вс 10:00–21:00</p>
          </div>
          <!-- Филиал 3 -->
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Лесная ул., 33 (этаж 2)</h3>
            <p class="text-gray-300 mb-2">Тел.: <a href="tel:+79679206535" class="underline hover:text-primary-300">+7 (967) 920-65-35</a></p>
            <p class="text-gray-300">Ежедневно, 09:00–21:00</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Карта -->
    <section>
      <div class="h-96 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <iframe 
          src="https://yandex.ru/map-widget/v1/?ll=50.204552%2C53.221923&z=16&l=map&mode=poi&poi%5Bpoint%5D=50.202182%2C53.222573&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D243452895564"
          width="100%" 
          height="100%" 
          frameborder="0"
          loading="lazy"
          class="rounded-xl"
          title="Карта расположения ресторана Вкусная компания"
          allowfullscreen="true"
        ></iframe>
      </div>
      <div class="mt-4 text-center">
        <a 
          href="https://yandex.ru/maps/51/samara/?indoorLevel=1&ll=50.204552%2C53.221923&mode=poi&poi%5Bpoint%5D=50.202182%2C53.222573&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D243452895564&utm_source=review&z=16.73"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-primary-300 hover:text-primary-200 transition-colors duration-300 text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Открыть в Яндекс.Картах
        </a>
      </div>
    </section>

    <!-- Призыв к бронированию -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 v-split class="text-3xl font-playfair font-bold mb-6">
          Готовы к незабываемому ужину?
        </h2>
        <p v-split="{ types: 'words, chars', delayStep: 0.015 }" class="text-lg mb-8">
          Позвоните нам или забронируйте столик онлайн
        </p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }" class="btn-primary shadow-glow" @click="isReservationOpen = true">Забронировать онлайн</button>
          <a v-split="{ types: 'words, chars', delayStep: 0.012, threshold: 0 }"
            href="tel:+79171421574"
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-block"
          >
            Позвонить: +7 (917) 142-15-74
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
import { usePageSEO, useSEO } from '@/composables/useSEO'

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

// Форма
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  // Имитация отправки формы
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Сброс формы
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
  
  isSubmitting.value = false
  showSuccess.value = true
  
  // Скрыть сообщение об успехе через 5 секунд
  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}

// SEO оптимизация для страницы контактов
const { generateRestaurantStructuredData } = useSEO()

// Structured data для всех филиалов
const branchesStructuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Вкусная компания — Садовая, 212Б',
    telephone: '+7-987-955-25-65',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Садовая 212Б',
      addressLocality: 'Самара',
      addressCountry: 'RU'
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:30', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '09:00', closes: '21:00' }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Вкусная компания — ул. Советской Армии, 177',
    telephone: '+7-917-142-15-74',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Советской Армии, 177',
      addressLocality: 'Самара',
      addressCountry: 'RU'
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday'], opens: '09:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Thursday'], opens: '09:00', closes: '22:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday','Saturday'], opens: '09:00', closes: '23:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '21:00' }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Вкусная компания — Лесная ул., 33 (этаж 2)',
    telephone: '+7-967-920-65-35',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Лесная ул., 33, этаж 2',
      addressLocality: 'Самара',
      addressCountry: 'RU'
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: [
        'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
      ], opens: '09:00', closes: '21:00' }
    ]
  }
]

// Настройка SEO для страницы контактов
usePageSEO({
  title: 'Контакты',
  description: 'Свяжитесь с «Вкусной Компанией»: г. Самара, ул. Советской Армии, 177. Бронирование: +7 (917) 142-15-74 или через форму обратной связи.',
  keywords: ['контакты', 'адрес', 'телефон', 'бронирование', 'Самара', 'ресторан'],
  image: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.jpg'
})

// Добавляем structured data для филиалов
useHead(() => ({
  script: branchesStructuredData.map(branch => ({
    type: 'application/ld+json',
    children: JSON.stringify(branch)
  }))
}))
</script>