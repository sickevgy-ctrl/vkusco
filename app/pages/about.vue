<template>
  <div>
    <!-- Заголовок -->
    <section class="relative py-20 text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/atmosphere/main-hall.jpg')"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 v-split class="text-4xl md:text-5xl font-playfair font-bold mb-4">О нас</h1>
        <p v-split="{ types: 'words, chars', delayStep: 0.02 }" class="text-xl text-gray-300">Семейный ресторан‑кондитерская с лучшими блюдами разных кухонь мира</p>
      </div>
    </section>

    <!-- О нас: кратко -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">Вкусная Компания — о заботе и честности</h2>
            <p class="text-lg text-gray-200/90 mb-6">Не важно, какой у вас день и чем вы занимаетесь — у нас вы можете расслабиться и просто быть собой. Каждому гостю мы дарим улыбку, заботу и качественный продукт. Это вкусная еда в любой компании: с друзьями, родителями, детьми, партнёрами и даже с собой наедине.</p>
            <p class="text-lg text-gray-200/90">В ресторане есть детская зона, чтобы родители могли отдохнуть за чашкой кофе. По выходным мы проводим семейные и детские мастер‑классы — ваш досуг будет не только вкусным, но и интересным.</p>
          </div>
          <div class="space-y-4">
            <OptimizedImage 
              src="/images/atmosphere/bar-counter.jpg"
              alt="Кондитерская витрина"
              loading="lazy"
              decoding="async"
              img-class="rounded-lg shadow-lg"
              width="900"
              height="600"
            />
            <OptimizedImage 
              src="/images/atmosphere/terrace.jpg"
              alt="Семейная атмосфера"
              loading="lazy"
              decoding="async"
              img-class="rounded-lg shadow-lg"
              width="900"
              height="600"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Фишки заведения -->
    <section class="py-16" aria-labelledby="features-title">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="features-title" class="section-title">Фишки заведения</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Большая кондитерская зона</h3>
            <p class="text-gray-300">Мы начинали как кондитерская, поэтому сохранили большую витрину с премиальными десертами и тортами.</p>
          </div>
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Вечера разных культур</h3>
            <p class="text-gray-300">Раз в месяц — музыкальные вечера разных культур: атмосфера праздника для свиданий и встреч с друзьями.</p>
          </div>
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Детская зона</h3>
            <p class="text-gray-300">Комфортно всей семье: детская зона, пока вы общаетесь и наслаждаетесь ужином.</p>
          </div>
          <div class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 text-white">
            <h3 class="text-xl font-semibold mb-2">Мастер‑классы для всей семьи</h3>
            <p class="text-gray-300">Девичники, детские и семейные мастер‑классы, лекции и встречи с профессионалами.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- История бренда -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">История создания «Вкусной Компании»</h2>
        <div class="prose prose-invert max-w-none text-gray-200/90">
          <p>В 2020 году, во время рождественского путешествия в Дюссельдорф, основательница «Вкусной Компании» Екатерина Александровна посетила камерный ресторанчик с тёплой семейной атмосферой. Пространство было наполнено смехом и ароматом свежей выпечки. Именно этот островок тепла захотелось привезти в Самару.</p>
          <p>Через полтора месяца открылась первая кондитерская «Вкусная Компания» с двумя залами — европейской кухней и витринами десертов. Уже более трёх лет мы создаём «островки» уюта и радости для наших гостей.</p>
        </div>
      </div>
    </section>

    <!-- Философия: 5 принципов -->
    <section class="py-16" aria-labelledby="philosophy-title">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="philosophy-title" class="section-title">5 принципов нашей философии</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10"><h3 class="font-semibold text-white mb-2">Открытость</h3><p class="text-gray-300">Мы рады идеям и обратной связи. Политика открытых дверей.</p></div>
          <div class="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10"><h3 class="font-semibold text-white mb-2">Развитие</h3><p class="text-gray-300">Развиваем сеть, партнёрства и продукт, идём в коллаборации.</p></div>
          <div class="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10"><h3 class="font-semibold text-white mb-2">Качество</h3><p class="text-gray-300">Честный состав блюд, индивидуальный сервис и вовлечённость.</p></div>
          <div class="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10"><h3 class="font-semibold text-white mb-2">Искренность</h3><p class="text-gray-300">Честные отношения с гостями, сотрудниками и партнёрами.</p></div>
          <div class="bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10"><h3 class="font-semibold text-white mb-2">Уважение</h3><p class="text-gray-300">Уважаем каждого гостя, независимо от возраста и взглядов.</p></div>
        </div>
      </div>
    </section>

    <!-- Архетип и позиционирование -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">Архетип и позиционирование</h2>
        <p class="text-lg text-gray-200/90 mb-6">Вкусная Компания — заботливый исследователь: сервис, открытость, уют, тепло, забота и честность. Мы не консервативны — помогаем открывать лучшие стороны жизни, расширять горизонты и наполнять дни новыми эмоциями.</p>
        <p class="text-lg text-gray-200/90">Наш образ — опытный и ответственный наставник. С нами безопасно и честно: мы создаём лучшее всей командой для вас и ваших детей.</p>
      </div>
    </section>

    <!-- Правила команды -->
    <section class="py-16" aria-labelledby="team-rules-title">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="team-rules-title" class="section-title">Правила нашей команды</h2>
        <ul class="space-y-4 text-gray-200/90 list-disc pl-5">
          <li><strong>Честность и открытость.</strong> Конфликты решаем обсуждением. Ложь и воровство недопустимы.</li>
          <li><strong>Забота о госте.</strong> Отдаём качественные блюда, идём на компромисс, чтобы каждый уходил счастливым.</li>
          <li><strong>Развитие и обучение.</strong> Растём, обучаемся, повышаем компетенции.</li>
          <li><strong>Открытость к новому.</strong> Обновляем меню и витрины, рассказываем гостям о составе и сочетаниях.</li>
        </ul>
      </div>
    </section>

    <!-- Отзывы клиентов -->
    <section class="py-16" aria-labelledby="client-reviews-title">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 id="client-reviews-title" class="section-title">Что говорят наши гости</h2>
          <div v-if="averageRating > 0" class="flex items-center justify-center space-x-4 mt-4">
            <div class="flex text-primary-400">
              <svg v-for="star in 5" :key="star" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="text-white font-semibold text-lg">{{ averageRating.toFixed(1) }}</span>
            <span class="text-gray-300">({{ totalCount }} отзывов)</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(review, index) in recentReviews.slice(0, 3)" 
            :key="review.id"
            class="bg-white/5 backdrop-blur p-6 rounded-[24px] shadow-lg border border-white/10"
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
                href="https://yandex.ru/maps/org/vkusnaya_kompaniya/243452895564/reviews/?filter=alternate_vertical%3ARequestWindow&indoorLevel=1&ll=50.198543%2C53.222351&mode=search&sctx=ZAAAAAgBEAAaKAoSCeLqAIi7DklAEb%2FXEByXmUpAEhIJX%2BtSI%2FQzpT8RL8GpDyTvjD8iBgABAgMEBSgKOABAmZ0GSAFiCW1heGFkdj0xMGI%2FcmVhcnI9c2NoZW1lX0xvY2FsL0dlb3VwcGVyL0FkdmVydHMvTWF4YWR2VG9wTWl4L01heGFkdkZvck1peD03agJydZ0BzczMPaABAKgBAL0BdPVF%2FcIBBszCsfeKB4ICH9CS0LrRg9GB0L3QsNGPINCa0L7QvNC%2F0LDQvdC40Y%2BKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=50.198543%2C53.222351&sspn=0.026391%2C0.008999&tab=reviews&text=%D0%92%D0%BA%D1%83%D1%81%D0%BD%D0%B0%D1%8F%20%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F&utm_source=review&z=16"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-300 hover:text-primary-200 text-sm transition-colors duration-300"
              >
                Яндекс.Карты →
              </a>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-8">
          <a 
            href="https://yandex.ru/maps/org/vkusnaya_kompaniya/243452895564/reviews/?filter=alternate_vertical%3ARequestWindow&indoorLevel=1&ll=50.198543%2C53.222351&mode=search&sctx=ZAAAAAgBEAAaKAoSCeLqAIi7DklAEb%2FXEByXmUpAEhIJX%2BtSI%2FQzpT8RL8GpDyTvjD8iBgABAgMEBSgKOABAmZ0GSAFiCW1heGFkdj0xMGI%2FcmVhcnI9c2NoZW1lX0xvY2FsL0dlb3VwcGVyL0FkdmVydHMvTWF4YWR2VG9wTWl4L01heGFkdkZvck1peD03agJydZ0BzczMPaABAKgBAL0BdPVF%2FcIBBszCsfeKB4ICH9CS0LrRg9GB0L3QsNGPINCa0L7QvNC%2F0LDQvdC40Y%2BKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=50.198543%2C53.222351&sspn=0.026391%2C0.008999&tab=reviews&text=%D0%92%D0%BA%D1%83%D1%81%D0%BD%D0%B0%D1%8F%20%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F&utm_source=review&z=16.73"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-2 text-primary-300 hover:text-primary-200 transition-colors duration-300"
          >
            <span>Читать все отзывы на Яндекс.Картах</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 v-split class="text-3xl font-playfair font-bold mb-6">Приходите к нам</h2>
        <p class="text-lg mb-8">ул. Советской Армии, 177 — проведите время с близкими и почувствуйте, как легко двигаться к новым вершинам!</p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button class="btn btn-primary shadow-glow" @click="isReservationOpen = true">Забронировать столик</button>
          <NuxtLink to="/contact" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-block">Контакты</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
import { usePageSEO, useSEO } from '@/composables/useSEO'
import { useYandexReviews } from '@/composables/useYandexReviews'

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()

// Отзывы с Яндекс.Карт
const {
  recentReviews,
  averageRating,
  totalCount,
  fetchReviews,
  formatReviewDate,
  generateStars
} = useYandexReviews()

// SEO оптимизация для страницы "О нас"
const { generateFAQStructuredData } = useSEO()

// FAQ для structured data
const faqs = [
  {
    question: 'Что такое Вкусная Компания?',
    answer: 'Семейный ресторан‑кондитерская с лучшими блюдами разных кухонь мира. Мы создаём уютную атмосферу для всей семьи.'
  },
  {
    question: 'Есть ли детская зона?',
    answer: 'Да, в ресторане есть детская зона, чтобы родители могли отдохнуть за чашкой кофе.'
  },
  {
    question: 'Проводятся ли мастер‑классы?',
    answer: 'По выходным мы проводим семейные и детские мастер‑классы, лекции и встречи с профессионалами.'
  },
  {
    question: 'Какая философия ресторана?',
    answer: 'Наша философия основана на 5 принципах: открытость, развитие, качество, искренность и уважение.'
  }
]

const faqStructuredData = generateFAQStructuredData(faqs)

// Настройка SEO для страницы "О нас"
usePageSEO({
  title: 'О нас',
  description: 'Семейный ресторан‑кондитерская: уют, честность и вкус. Детская зона, семейные мастер‑классы и лучшие блюда разных кухонь мира.',
  keywords: ['о нас', 'история', 'философия', 'семейный ресторан', 'кондитерская', 'детская зона'],
  image: 'https://vkusnayakompania.ru/images/atmosphere/main-hall.jpg',
  structuredData: faqStructuredData
})

// Загружаем отзывы при монтировании компонента
onMounted(() => {
  fetchReviews()
})
</script>