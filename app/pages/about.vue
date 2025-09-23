<template>
  <div>
    <!-- Заголовок -->
    <section class="relative py-20 text-white overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2070&q=80')"></div>
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
            <img src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=900&q=80" alt="Кондитерская витрина" class="rounded-lg shadow-lg">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" alt="Семейная атмосфера" class="rounded-lg shadow-lg">
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

    <!-- CTA -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 v-split class="text-3xl font-playfair font-bold mb-6">Приходите к нам</h2>
        <p class="text-lg mb-8">ул. Советской Армии, 177 — проведите время с близкими и почувствуйте, как легко двигаться к новым вершинам!</p>
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button class="btn-primary shadow-glow" @click="isReservationOpen.value = true">Забронировать столик</button>
          <NuxtLink to="/contact" class="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-block">Контакты</NuxtLink>
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
  title: 'О нас — Вкусная Компания',
  meta: [
    { name: 'description', content: 'Семейный ресторан‑кондитерская: уют, честность и вкус. Детская зона, семейные мастер‑классы и лучшие блюда разных кухонь мира.' }
  ]
})

// Глобальное состояние модального окна бронирования
const { isReservationOpen } = useReservationModal()
// Статические секции — без динамических списков на этой странице

// Breadcrumbs JSON-LD
const url = useRequestURL()
const origin = `${url.protocol}//${url.host}`
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'О нас', item: `${origin}/about` }
        ]
      })
    }
  ]
})
</script>