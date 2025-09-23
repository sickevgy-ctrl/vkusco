<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import gsap from 'gsap'

const props = withDefaults(defineProps<{
  title?: string
  lead?: string
  imgSrc?: string
  alt?: string
}>(), {
  title: 'НЕПРАВИЛЬНОЕ ПИТАНИЕ\nПОЛЕЗНЕЕ ВАШЕГО\nПРАВИЛЬНОГО',
  lead: 'мы слишком долго и усердно трудимся, над тем что бы вы были здоровы и при этом ели привычную и вкусную еду',
  // По умолчанию используем конкретный avif из /public/images
  imgSrc: '/images/20250922_1637_Блюдо в нижнем углу_remix_01k5rt47fdfd4rgxhh1mydfcr4.avif',
  alt: 'Блюдо на белой тарелке'
})

const baseSrc = computed(() => {
  if (!props.imgSrc) return ''
  return props.imgSrc.replace(/\.(png|jpe?g|webp|avif)$/i, '')
})

const lines = computed(() => (props.title || '').split('\n'))

// refs for stagger anim
const titleRef = ref<HTMLElement | null>(null)
const lineRefs = ref<any[]>([])
const setLineRef = (el: any) => {
  if (el) lineRefs.value.push(el)
}
const leadRef  = ref<HTMLElement | null>(null)
const imgRef   = ref<HTMLElement | null>(null)
const glowRef  = ref<HTMLDivElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null
let destroyed = false

onMounted(() => {
  if (destroyed) return

  // Подготовка: перспектива для 3D (как в референсе)
  if (titleRef.value) gsap.set(titleRef.value, { perspective: 400 })

  // Ждем загрузки SplitText
  const initSplitTextAnimation = () => {
    if (typeof (window as any).SplitText !== 'undefined') {
      const SplitText = (window as any).SplitText
      
      // Создаем SplitText для заголовка
      const splitTitle = new SplitText(titleRef.value, {
        type: "lines,words",
        linesClass: "split-line",
        wordsClass: "split-word"
      })

      // Анимация появления слов
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value || titleRef.value!,
          start: 'top 95%',
          once: true
        }
      })

      // Анимация слов с SplitText
      tl.from(splitTitle.words, {
        duration: 1,
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        ease: 'power3.out'
      })

      // Анимация описания
      if (leadRef.value) {
        const splitLead = new SplitText(leadRef.value, {
          type: "words",
          wordsClass: "split-word"
        })

        tl.from(splitLead.words, {
          duration: 0.8,
          y: 50,
          autoAlpha: 0,
          stagger: 0.02,
          ease: 'power2.out'
        }, '-=0.5')
      }

    } else {
      // Fallback анимация без SplitText
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value || titleRef.value!,
          start: 'top 95%',
          once: true
        }
      })

      tl.from(lineRefs.value, {
        duration: 2,
        opacity: 0,
        x: -100,
        stagger: 0.1,
        ease: 'expo.out',
        immediateRender: false
      })
    }
  }

  // Проверяем доступность SplitText с интервалом
  const checkSplitText = setInterval(() => {
    if (typeof (window as any).SplitText !== 'undefined') {
      clearInterval(checkSplitText)
      initSplitTextAnimation()
    }
  }, 100)

  // Таймаут на случай если SplitText не загрузится
  setTimeout(() => {
    clearInterval(checkSplitText)
    if (!tl) {
      initSplitTextAnimation() // Запустить fallback анимацию
    }
  }, 3000)

  // лёгкое «дыхание» картинки (постоянно)
  if (imgRef.value) {
    gsap.to(imgRef.value, { y: -6, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  }
})

onBeforeUnmount(() => {
  destroyed = true
  if (tl) {
    tl.clear()
    tl.kill()
    tl = null
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden px-[clamp(16px,4vw,48px)] py-[clamp(24px,6vw,72px)] h-screen"
    style="background-color: var(--brand-primary-700);">
    <div class="mx-auto grid max-w-7xl items-center gap-[clamp(28px,6vw,96px)] md:grid-cols-2">
      <!-- Текст -->
  <div class="relative z-20 md:pr-6">
        <h1
          ref="titleRef"
          class="text-balance font-black text-white tracking-[-0.02em] text-[clamp(32px,7vw,96px)] leading-[1.03] mb-4"
          style="font-weight: 1000;">
          <span
            v-for="(ln, i) in lines"
            :key="i"
            :ref="setLineRef"
            class="block">
            {{ ln }}
          </span>
        </h1>

        <p
          ref="leadRef"
          class="max-w-prose text-[clamp(16px,1.2vw,20px)] leading-relaxed text-white/85 mt-2 md:mt-3">
          {{ props.lead }}
        </p>
      </div>

      <!-- Картинка -->
      <div class="relative min-h-[320px] md:min-h-[420px]">
        <!-- <picture> с AVIF/WebP, фоллбек на исходный файл -->
        <picture ref="imgRef" class="absolute bottom-0 right-0 z-10 block origin-bottom-right scale-[2] w-[min(560px,100%)] md:w-[min(560px,95%)] md:translate-y-[8%]">
          <source :srcset="`${baseSrc}.avif`" type="image/avif" />
          <source :srcset="`${baseSrc}.webp`" type="image/webp" />
          <img
            :src="props.imgSrc"
            :alt="props.alt"
            decoding="async"
            fetchpriority="high"
            class="w-full h-auto object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.35)]"
          />
        </picture>

        <!-- мягкое свечение под тарелкой -->
        <div
          ref="glowRef"
          aria-hidden="true"
          class="pointer-events-none absolute z-0 blur-[10px] md:right-[6%] md:bottom-[6%] right-0 bottom-0 w-[min(520px,90%)] h-[min(520px,90%)] rounded-full"
          style="background: radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%);">
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Стили для SplitText анимации */
.split-line {
  overflow: hidden;
}

.split-word {
  display: inline-block;
  overflow: hidden;
}

/* Начальное состояние для fallback анимации */
.word {
  display: inline-block;
}
</style>