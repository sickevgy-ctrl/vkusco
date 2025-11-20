<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useReservationModal } from '@/composables/useReservationModal'
import { gsap } from 'gsap'

// Props (адаптированные под Vue)
const position = 'right'
const colors = ['#3A4F2E', '#6F8F4B', '#314426']
const displaySocials = true
const displayItemNumbering = true
const menuButtonColor = '#fff'
const openMenuButtonColor = '#fff'
const changeMenuColorOnOpen = true
const accentColor = '#3A4F2E'

const isOpen = ref(false)
const { isReservationOpen } = useReservationModal()
const isScrolled = ref(false)
const openRef = ref(false)

// Refs для анимаций
const panelRef = ref(null)
const wrapperRef = ref(null)
const preLayersRef = ref(null)
const preLayerElsRef = ref([])
const plusHRef = ref(null)
const plusVRef = ref(null)
const iconRef = ref(null)
const textInnerRef = ref(null)
const textWrapRef = ref(null)
const toggleBtnRef = ref(null)

// Состояние анимации
const openTlRef = ref(null)
const closeTweenRef = ref(null)
const spinTweenRef = ref(null)
const textCycleAnimRef = ref(null)
const colorTweenRef = ref(null)
const busyRef = ref(false)
const itemEntranceTweenRef = ref(null)

// Текст кнопки
const textLines = ref(['Меню', 'Закрыть'])

const navigation = [
  { label: 'Главная', href: '/', ariaLabel: 'Перейти на главную страницу' },
  { label: 'Меню', href: '/menu', ariaLabel: 'Посмотреть меню' },
  { label: 'О нас', href: '/about', ariaLabel: 'Узнать о нас' },
  { label: 'Контакты', href: '/contact', ariaLabel: 'Связаться с нами' }
]

const socialItems = [
  { label: 'Telegram', link: 'https://t.me' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const openReservationModal = () => {
  isReservationOpen = true
  isOpen.value = false
}

// Инициализация меню (аналог useLayoutEffect)
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleKeydown)
  
  nextTick(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.value
      const preContainer = preLayersRef.value
      const plusH = plusHRef.value
      const plusV = plusVRef.value
      const icon = iconRef.value
      const textInner = textInnerRef.value

      if (!panel || !plusH || !plusV || !icon || !textInner) return

      let preLayers = []
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'))
      }
      preLayerElsRef.value = preLayers

      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen })

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })

      if (toggleBtnRef.value) gsap.set(toggleBtnRef.value, { color: menuButtonColor })
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleKeydown)
})

const buildOpenTimeline = () => {
  const panel = panelRef.value
  const layers = preLayerElsRef.value
  if (!panel) return null

  openTlRef.value?.kill()
  if (closeTweenRef.value) {
    closeTweenRef.value.kill()
    closeTweenRef.value = null
  }
  itemEntranceTweenRef.value?.kill()

  const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
  const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
  const socialTitle = panel.querySelector('.sm-socials-title')
  const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))

  const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }))
  const panelStart = Number(gsap.getProperty(panel, 'xPercent'))

  if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
  if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 })
  if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
  if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

  const tl = gsap.timeline({ paused: true })

  layerStates.forEach((ls, i) => {
    tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
  })

  const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0
  const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0)
  const panelDuration = 0.65

  tl.fromTo(
    panel,
    { xPercent: panelStart },
    { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
    panelInsertTime
  )

  if (itemEls.length) {
    const itemsStartRatio = 0.15
    const itemsStart = panelInsertTime + panelDuration * itemsStartRatio

    tl.to(
      itemEls,
      { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
      itemsStart
    )

    if (numberEls.length) {
      tl.to(
        numberEls,
        { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
        itemsStart + 0.1
      )
    }
  }

  if (socialTitle || socialLinks.length) {
    const socialsStart = panelInsertTime + panelDuration * 0.4

    if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart)
    if (socialLinks.length) {
      tl.to(
        socialLinks,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' })
        },
        socialsStart + 0.04
      )
    }
  }

  openTlRef.value = tl
  return tl
}

const playOpen = () => {
  if (busyRef.value) return
  busyRef.value = true
  const tl = buildOpenTimeline()
  if (tl) {
    // Обновляем высоту панели под контент с ограничением по вьюпорту
    nextTick(() => updatePanelSize())
    window.addEventListener('resize', updatePanelSize, { passive: true })

    tl.eventCallback('onComplete', () => {
      busyRef.value = false
    })
    tl.play(0)
  } else {
    busyRef.value = false
  }
}

const playClose = () => {
  openTlRef.value?.kill()
  openTlRef.value = null
  itemEntranceTweenRef.value?.kill()

  const panel = panelRef.value
  const layers = preLayerElsRef.value
  if (!panel) return

  const all = [...layers, panel]
  closeTweenRef.value?.kill()

  const offscreen = position === 'left' ? -100 : 100

  closeTweenRef.value = gsap.to(all, {
    xPercent: offscreen,
    duration: 0.32,
    ease: 'power3.in',
    overwrite: 'auto',
    onComplete: () => {
      // Сбрасываем вычисленную высоту, отписываемся от ресайза
      const wrap = wrapperRef.value
      if (wrap) wrap.style.removeProperty('--sm-panel-h')
      window.removeEventListener('resize', updatePanelSize)

      const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
      if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })

      const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
      if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 })

      const socialTitle = panel.querySelector('.sm-socials-title')
      const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
      if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

      busyRef.value = false
    }
  })
}

// Вычисление высоты панели по контенту (с ограничением 85vh)
const updatePanelSize = () => {
  const panel = panelRef.value
  const wrap = wrapperRef.value
  if (!panel || !wrap) return
  // Естественная высота контента
  const contentH = panel.scrollHeight
  const maxH = Math.floor(window.innerHeight * 0.85)
  const targetH = Math.min(contentH, maxH)
  wrap.style.setProperty('--sm-panel-h', `${targetH}px`)
}

const animateIcon = (opening) => {
  const icon = iconRef.value
  const h = plusHRef.value
  const v = plusVRef.value
  if (!icon || !h || !v) return

  spinTweenRef.value?.kill()

  if (opening) {
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
    spinTweenRef.value = gsap
      .timeline({ defaults: { ease: 'power4.out' } })
      .to(h, { rotate: 45, duration: 0.5 }, 0)
      .to(v, { rotate: -45, duration: 0.5 }, 0)
  } else {
    spinTweenRef.value = gsap
      .timeline({ defaults: { ease: 'power3.inOut' } })
      .to(h, { rotate: 0, duration: 0.35 }, 0)
      .to(v, { rotate: 90, duration: 0.35 }, 0)
      .to(icon, { rotate: 0, duration: 0.001 }, 0)
  }
}

const animateColor = (opening) => {
  const btn = toggleBtnRef.value
  if (!btn) return
  colorTweenRef.value?.kill()
  if (changeMenuColorOnOpen) {
    const targetColor = opening ? openMenuButtonColor : menuButtonColor
    colorTweenRef.value = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' })
  } else {
    gsap.set(btn, { color: menuButtonColor })
  }
}

const animateText = (opening) => {
  const inner = textInnerRef.value
  if (!inner) return

  textCycleAnimRef.value?.kill()

  const currentLabel = opening ? 'Меню' : 'Закрыть'
  const targetLabel = opening ? 'Закрыть' : 'Меню'
  const cycles = 3

  const seq = [currentLabel]
  let last = currentLabel
  for (let i = 0; i < cycles; i++) {
    last = last === 'Меню' ? 'Закрыть' : 'Меню'
    seq.push(last)
  }
  if (last !== targetLabel) seq.push(targetLabel)
  seq.push(targetLabel)

  textLines.value = seq
  gsap.set(inner, { yPercent: 0 })

  const lineCount = seq.length
  const finalShift = ((lineCount - 1) / lineCount) * 100

  textCycleAnimRef.value = gsap.to(inner, {
    yPercent: -finalShift,
    duration: 0.5 + lineCount * 0.07,
    ease: 'power4.out'
  })
}

const toggleMenu = () => {
  const target = !openRef.value
  openRef.value = target
  isOpen.value = target

  if (target) {
    playOpen()
    // Фокусируемся на первом элементе меню при открытии
    nextTick(() => {
      const firstLink = panelRef.value?.querySelector('a')
      if (firstLink) {
        firstLink.focus()
      }
    })
  } else {
    playClose()
    // Возвращаем фокус на кнопку меню при закрытии
    nextTick(() => {
      if (toggleBtnRef.value) {
        toggleBtnRef.value.focus()
      }
    })
  }

  animateIcon(target)
  animateColor(target)
  animateText(target)
}

// Обработка клавиши Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    toggleMenu()
  }
}
</script>

<template>
  <div class="sm-scope w-full h-full">
    <div
      ref="wrapperRef"
      class="staggered-menu-wrapper relative w-full h-full z-40"
      :style="accentColor ? { ['--sm-accent']: accentColor } : undefined"
      :data-position="position"
      :data-open="isOpen || undefined"
    >
      <!-- Pre-layers -->
      <div
        ref="preLayersRef"
        class="sm-prelayers fixed top-0 right-0 left-auto pointer-events-none z-[5]"
        aria-hidden="true"
      >
        <div
          v-for="(color, i) in colors.slice(0, 3)"
          :key="i"
          class="sm-prelayer absolute top-0 left-0 h-full w-full translate-x-0"
          :style="{ background: color }"
        />
      </div>

      <!-- Логотип (не закреплен) -->
  <div class="sm-logo-container absolute top-0 left-0 px-8 bg-transparent pointer-events-none z-20">
        <div class="sm-logo flex items-center select-none pointer-events-auto" aria-label="Logo">
          <NuxtLink to="/" class="flex items-center">
            <picture>
              <source srcset="/content/IMG_3306.PNG.avif" type="image/avif" />
              <source srcset="/content/IMG_3306.PNG.webp" type="image/webp" />
              <img 
                src="/content/IMG_3306.PNG" 
                alt="Логотип" 
                class="sm-logo-img block h-12 w-auto object-contain"
                draggable="false"
                width="165"
                height="36"
                style="filter: brightness(0) invert(1);"
              />
            </picture>
          </NuxtLink>
        </div>
      </div>

      <!-- Кнопка меню (закреплена) -->
  <div class="sm-menu-button-container fixed top-0 right-0 px-8 bg-transparent pointer-events-none z-20">
        <button
          ref="toggleBtnRef"
          class="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer text-[#e9e9ef] font-medium leading-none overflow-visible pointer-events-auto"
          :aria-label="isOpen ? 'Закрыть меню' : 'Открыть меню'"
          :aria-expanded="isOpen"
          aria-controls="staggered-menu-panel"
          @click="toggleMenu"
          type="button"
        >
          <span
            ref="textWrapRef"
            class="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
            aria-hidden="true"
          >
            <span ref="textInnerRef" class="sm-toggle-textInner flex flex-col leading-none">
              <span 
                v-for="(line, i) in textLines" 
                :key="i"
                class="sm-toggle-line block h-[1em] leading-none"
              >
                {{ line }}
              </span>
            </span>
          </span>

          <span
            ref="iconRef"
            class="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
            aria-hidden="true"
          >
            <span
              ref="plusHRef"
              class="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
            />
            <span
              ref="plusVRef"
              class="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
            />
          </span>
        </button>
      </div>

      <!-- Menu Panel -->
      <aside
        id="staggered-menu-panel"
        ref="panelRef"
        class="staggered-menu-panel fixed top-0 right-0 left-auto flex flex-col p-[6em_2em_2em_2em] overflow-hidden z-10 backdrop-blur-[12px]"
        :style="{ 
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'var(--brand-primary-700)'
        }"
        :aria-hidden="!isOpen"
        :inert="!isOpen"
      >
        <div class="sm-panel-inner flex-1 flex flex-col gap-5">
          <ul
            class="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
            role="list"
            :data-numbering="displayItemNumbering || undefined"
          >
            <li 
              v-for="(item, idx) in navigation" 
              :key="item.label + idx"
              class="sm-panel-itemWrap relative overflow-hidden leading-none"
            >
              <NuxtLink
                :to="item.href"
                class="sm-panel-item relative text-white font-semibold text-[2.5rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]"
                :aria-label="item.ariaLabel"
                :data-index="idx + 1"
                @click="toggleMenu"
              >
                <span class="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>

          <!-- Social Links -->
          <div 
            v-if="displaySocials && socialItems && socialItems.length > 0"
            class="sm-socials mt-auto pt-8 flex flex-col gap-3" 
            aria-label="Социальные сети"
          >
            <h3 class="sm-socials-title m-0 text-base font-medium" :style="{ color: `var(--sm-accent, ${accentColor})` }">
              Социальные сети
            </h3>
            <ul
              class="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
              role="list"
            >
              <li 
                v-for="(social, i) in socialItems" 
                :key="social.label + i" 
                class="sm-socials-item"
              >
                <a
                  :href="social.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sm-socials-link text-[1.2rem] font-medium text-white no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear"
                >
                  {{ social.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>

    </div>
</template>

<style scoped>
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
.sm-scope .staggered-menu-wrapper { --sm-panel-w: clamp(320px, 92vw, 720px); --sm-topbar-h: clamp(56px, 8vw, 76px); }
.sm-scope .sm-logo-container { position: absolute; top: 0; left: 0; height: var(--sm-topbar-h); padding: 0 2rem; display: flex; align-items: center; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .sm-menu-button-container { position: fixed; top: 0; right: 0; height: var(--sm-topbar-h); padding: 0 2rem; display: flex; align-items: center; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .sm-logo-container > * { pointer-events: auto; }
.sm-scope .sm-menu-button-container > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 48px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .staggered-menu-panel { position: fixed; top: 0; right: 0; left: auto; width: var(--sm-panel-w); max-width: 720px; height: var(--sm-panel-h, auto); max-height: 85vh; background: var(--brand-primary-700); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow: hidden; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: fixed; top: 0; right: 0; left: auto; width: var(--sm-panel-w); height: var(--sm-panel-h, 85vh); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; left: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: #3A4F2E; }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid #3A4F2E; outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #fff; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: #3A4F2E; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #fff; font-weight: 600; font-size: clamp(1.5rem, 4.5vw, 2.5rem); cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: #3A4F2E; }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 0.5em; font-size: 18px; font-weight: 400; color: #3A4F2E; letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
</style>