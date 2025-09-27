<template>
  <section class="py-20" aria-labelledby="blur-cards-title" style="background-color: var(--brand-primary-700);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="blur-cards-title" class="section-title"></h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="(card, idx) in items"
          :key="idx"
          class="group relative overflow-hidden rounded-[28px] bg-white/5 shadow-elegant first:opacity-100"
        >
          <div class="relative h-56">
            <picture>
              <source :srcset="card.imageAvif || ''" type="image/avif" />
              <source :srcset="card.imageWebp || ''" type="image/webp" />
              <img :src="card.image" :alt="card.title" class="w-full h-full object-cover" loading="lazy" decoding="async" />
            </picture>

            <!-- gradient overlay slices that gradually blur on hover -->
            <div class="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
              <div class="absolute inset-0">
                <div class="absolute inset-x-0 top-0 h-1/3 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div class="absolute inset-x-0 top-1/3 h-1/3 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 [transition-delay:60ms]"></div>
                <div class="absolute inset-x-0 top-2/3 h-1/3 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 [transition-delay:120ms]"></div>
              </div>
            </div>

            <!-- blur layers (progressively stronger) -->
            <div class="absolute inset-0">
              <div class="absolute inset-x-0 top-0 h-1/3 backdrop-blur-0 group-hover:backdrop-blur-[1px] transition duration-500"></div>
              <div class="absolute inset-x-0 top-1/3 h-1/3 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition duration-500 [transition-delay:60ms]"></div>
              <div class="absolute inset-x-0 top-2/3 h-1/3 backdrop-blur-0 group-hover:backdrop-blur-[3px] transition duration-500 [transition-delay:120ms]"></div>
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-2">{{ card.title }}</h3>
            <p class="text-gray-200/85">{{ card.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface CardItem {
  title: string
  description: string
  image: string
  imageWebp?: string
  imageAvif?: string
}

const props = defineProps<{ items: CardItem[] }>()
</script>

<style scoped>
/* no extra styles; uses Tailwind utilities and existing CSS variables */
</style>


