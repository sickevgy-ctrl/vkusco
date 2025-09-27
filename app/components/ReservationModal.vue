<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <div 
      class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Заголовок -->
  <div class="bg-primary-600 text-white p-6 rounded-t-lg">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-playfair font-bold">Бронирование столика</h2>
          <button 
            @click="$emit('close')"
            class="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-primary-100 mt-2">Забронируйте столик в «Вкусная компания»</p>
      </div>

      <!-- Форма -->
      <form @submit.prevent="submitReservation" class="p-6 space-y-6">
        <!-- Личная информация -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">Имя *</label>
            <input 
              type="text" 
              id="firstName" 
              v-model="form.firstName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
              placeholder="Ваше имя"
            >
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Фамилия *</label>
            <input 
              type="text" 
              id="lastName" 
              v-model="form.lastName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
              placeholder="Ваша фамилия"
            >
          </div>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            placeholder="+7 (999) 123-45-67"
          >
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            placeholder="your@email.com"
          >
        </div>

        <!-- Детали бронирования -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">Дата *</label>
            <input 
              type="date" 
              id="date" 
              v-model="form.date"
              required
              :min="minDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            >
          </div>
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700 mb-2">Время *</label>
            <select 
              id="time" 
              v-model="form.time"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            >
              <option value="">Выберите время</option>
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="guests" class="block text-sm font-medium text-gray-700 mb-2">Количество гостей *</label>
            <select 
              id="guests" 
              v-model="form.guests"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            >
              <option value="">Выберите количество</option>
              <option v-for="n in 8" :key="n" :value="n">{{ n }} {{ getGuestWord(n) }}</option>
            </select>
          </div>
          <div>
            <label for="seating" class="block text-sm font-medium text-gray-700 mb-2">Предпочтения</label>
            <select 
              id="seating" 
              v-model="form.seating"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            >
              <option value="">Любое место</option>
              <option value="window">У окна</option>
              <option value="corner">Уютный уголок</option>
              <option value="center">В центре зала</option>
              <option value="terrace">На террасе</option>
            </select>
          </div>
        </div>

        <div>
          <label for="specialRequests" class="block text-sm font-medium text-gray-700 mb-2">Особые пожелания</label>
          <textarea 
            id="specialRequests" 
            v-model="form.specialRequests"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
            placeholder="Особые диетические требования, празднование дня рождения и т.д."
          ></textarea>
        </div>

        <!-- Кнопки -->
        <div class="flex space-x-4">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Бронируется...' : 'Забронировать' }}
          </button>
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            Отмена
          </button>
        </div>

        <!-- Успешная отправка -->
        <div 
          v-if="showSuccess"
          class="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <p class="font-semibold">Бронирование успешно отправлено!</p>
              <p class="text-sm">Мы свяжемся с вами в течение 15 минут для подтверждения.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

// Форма
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  guests: '',
  seating: '',
  specialRequests: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

// Минимальная дата (сегодня)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Доступное время
const availableTimes = ref([
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
])

// Функция для правильного склонения слова "гость"
const getGuestWord = (count) => {
  if (count === 1) return 'гость'
  if (count >= 2 && count <= 4) return 'гостя'
  return 'гостей'
}

// Отправка формы
const submitReservation = async () => {
  isSubmitting.value = true
  
  // Имитация отправки
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Сброс формы
  form.value = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    seating: '',
    specialRequests: ''
  }
  
  isSubmitting.value = false
  showSuccess.value = true
  
  // Скрыть сообщение об успехе через 5 секунд
  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}
</script>