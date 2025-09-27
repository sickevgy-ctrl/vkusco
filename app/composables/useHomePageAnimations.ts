import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function useHomePageAnimations() {
  const timelines = ref<gsap.core.Timeline[]>([])

  // Инициализация анимаций для героя секции
  const initHeroAnimations = (heroRef: HTMLElement) => {
    if (!heroRef) return

    const heroContent = heroRef.querySelector('[ref="heroContent"]') || heroRef.querySelector('.relative.z-20.text-center')
    const plantLeft = heroRef.querySelector('[ref="plantLeft"]')
    const plantRight = heroRef.querySelector('[ref="plantRight"]')
    const title = heroContent?.querySelector('h1')
    const description = heroContent?.querySelector('p')
    const buttonContainer = heroContent?.querySelector('.space-y-4')

    // Основная анимация героя
    const heroTl = gsap.timeline({
      delay: 0.5
    })

    // Анимация заголовка
    if (title) {
      // Сначала убираем начальные классы CSS и применяем GSAP
      gsap.set(title, { opacity: 0, y: 60, clearProps: 'transform' })
      
      heroTl.to(title, { 
        opacity: 1, 
        y: 0, 
        duration: 1.2,
        ease: 'power3.out'
      })
    }

    // Анимация описания
    if (description) {
      gsap.set(description, { opacity: 0, y: 40, clearProps: 'transform' })
      
      heroTl.to(description, {
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power3.out'
      }, '-=0.8')
    }

    // Анимация контейнера кнопок
    if (buttonContainer) {
      gsap.set(buttonContainer, { opacity: 0, y: 30, clearProps: 'transform' })
      
      heroTl.to(buttonContainer, {
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.6')
    }

    // Анимация растений
    if (plantLeft) {
      heroTl.to(plantLeft, {
        opacity: 0.9, 
        x: 0, 
        duration: 1.5,
        ease: 'power3.out'
      }, '-=1')
    }

    if (plantRight) {
      heroTl.to(plantRight, {
        opacity: 0.9, 
        x: 0, 
        duration: 1.5,
        ease: 'power3.out'
      }, '-=1.4')
    }

    timelines.value.push(heroTl)
    return heroTl
  }

  // Анимации для секций с ScrollTrigger
  const initSectionAnimations = () => {
    // Управление "Наш интерьер" перенесено на страницу index.vue через refs, чтобы избежать дубля
    // Анимация секции "О ресторане"
    const aboutSection = document.querySelector('section[aria-labelledby="about-title"]')
    if (aboutSection) {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 70%',
          once: true
        }
      })

      const title = aboutSection.querySelector('h2')
      const paragraphs = aboutSection.querySelectorAll('p')
      const button = aboutSection.querySelector('.btn-primary')
      const image = aboutSection.querySelector('img')

      if (title) {
        gsap.set(title, { opacity: 0, y: 50, clearProps: 'transform' })
        aboutTl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      }

      if (paragraphs.length > 0) {
        gsap.set(paragraphs, { opacity: 0, y: 30 })
        aboutTl.to(paragraphs, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.7')
      }

      if (button) {
        gsap.set(button, { opacity: 0, scale: 0.9 })
        aboutTl.to(button, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
      }

      if (image) {
        gsap.set(image, { opacity: 0, scale: 1.1 })
        aboutTl.to(image, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=1')
      }

      timelines.value.push(aboutTl)
    }

    // Анимация популярных блюд
    const popularSection = document.querySelector('section[aria-labelledby="popular-title"]')
    if (popularSection) {
      const popularTl = gsap.timeline({
        scrollTrigger: {
          trigger: popularSection,
          start: 'top 70%',
          once: true
        }
      })

      const title = popularSection.querySelector('h2')
      const dishCards = popularSection.querySelectorAll('.dish-card')
      const menuButton = popularSection.querySelector('a[href="/menu"]')

      if (title) {
        gsap.set(title, { opacity: 0, y: 50, clearProps: 'transform' })
        popularTl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      }

      if (dishCards.length > 0) {
        gsap.set(dishCards, { opacity: 0, y: 60, scale: 0.95, clearProps: 'transform' })
        popularTl.to(dishCards, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.7')
      }

      if (menuButton) {
        gsap.set(menuButton, { opacity: 0, y: 30 })
        popularTl.to(menuButton, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      }

      timelines.value.push(popularTl)
    }

    // Блок "Наша атмосфера" удалён

    // Анимация отзывов
    const reviewsSection = document.querySelector('section[aria-labelledby="reviews-title"]')
    if (reviewsSection) {
      const reviewsTl = gsap.timeline({
        scrollTrigger: {
          trigger: reviewsSection,
          start: 'top 70%',
          once: true
        }
      })

      const title = reviewsSection.querySelector('h2')
      const reviewCards = reviewsSection.querySelectorAll('.review-card')

      if (title) {
        gsap.set(title, { opacity: 0, y: 50, clearProps: 'transform' })
        reviewsTl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      }

      if (reviewCards.length > 0) {
        gsap.set(reviewCards, { opacity: 0, y: 60, scale: 0.95, clearProps: 'transform' })
        reviewsTl.to(reviewCards, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.7')
      }

      timelines.value.push(reviewsTl)
    }

    // Анимация CTA секции
    const ctaSection = document.querySelector('section[aria-labelledby="cta-title"]')
    if (ctaSection) {
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top 70%',
          once: true
        }
      })

      const title = ctaSection.querySelector('h2')
      const description = ctaSection.querySelector('p')
      const buttonContainer = ctaSection.querySelector('.space-y-4')

      if (title) {
        gsap.set(title, { opacity: 0, y: 50, clearProps: 'transform' })
        ctaTl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      }

      if (description) {
        gsap.set(description, { opacity: 0, y: 30, clearProps: 'transform' })
        ctaTl.to(description, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
      }

      if (buttonContainer) {
        gsap.set(buttonContainer, { opacity: 0, y: 30, scale: 0.9, clearProps: 'transform' })
        ctaTl.to(buttonContainer, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
      }

      timelines.value.push(ctaTl)
    }
  }

  // Добавим параллакс эффекты для фоновых элементов
  const initParallaxEffects = () => {
    // Параллакс для animated blobs в героя секции
    const blobs = document.querySelectorAll('.animate-blob')
    blobs.forEach((blob, index) => {
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: blob,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      const direction = index % 2 === 0 ? -30 : 30
      parallaxTl.to(blob, {
        yPercent: direction,
        ease: 'none'
      })

      timelines.value.push(parallaxTl)
    })

    // Параллакс для фонового изображения героя
    const heroImage = document.querySelector('section picture img')
    if (heroImage) {
      const imageParallax = gsap.timeline({
        scrollTrigger: {
          trigger: heroImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      imageParallax.to(heroImage, {
        yPercent: -20,
        ease: 'none'
      })

      timelines.value.push(imageParallax)
    }

    // Блок "Наша атмосфера" удалён

    // Floating анимация для карточек блюд при скролле
    const dishCards = document.querySelectorAll('.dish-card')
    dishCards.forEach((card, index) => {
      const floatTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1
        }
      })

      const floatAmount = index % 2 === 0 ? -10 : 10
      floatTl.to(card, {
        y: floatAmount,
        rotation: index % 2 === 0 ? 1 : -1,
        ease: 'none'
      })

      timelines.value.push(floatTl)
    })
  }

  // Добавим hover эффекты для интерактивных элементов
  const initHoverEffects = () => {
    // Улучшенный hover эффект для карточек блюд
    const dishCards = document.querySelectorAll('.dish-card')
    dishCards.forEach(card => {
      const image = card.querySelector('img')
      const title = card.querySelector('h3')
      const price = card.querySelector('.price')
      const button = card.querySelector('button')

      card.addEventListener('mouseenter', () => {
        const tl = gsap.timeline()
        
        tl.to(card, {
          y: -15,
          scale: 1.03,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
        
        if (image) {
          tl.to(image, {
            scale: 1.1,
            duration: 0.4,
            ease: 'power2.out'
          }, 0)
        }

        if (title) {
          tl.to(title, {
            y: -3,
            duration: 0.3,
            ease: 'power2.out'
          }, 0.1)
        }

        if (price) {
          tl.to(price, {
            scale: 1.1,
            color: '#fff',
            duration: 0.3,
            ease: 'power2.out'
          }, 0.1)
        }

        if (button) {
          tl.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          }, 0.1)
        }
      })

      card.addEventListener('mouseleave', () => {
        const tl = gsap.timeline()
        
        tl.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          duration: 0.4,
          ease: 'power2.out'
        })
        
        if (image) {
          tl.to(image, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          }, 0)
        }

        if (title) {
          tl.to(title, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          }, 0)
        }

        if (price) {
          tl.to(price, {
            scale: 1,
            color: '',
            duration: 0.3,
            ease: 'power2.out'
          }, 0)
        }

        if (button) {
          tl.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          }, 0)
        }
      })
    })

    // Улучшенный hover эффект для кнопок
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary')
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          y: -2,
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          boxShadow: '',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // Hover эффект для карточек отзывов
    const reviewCards = document.querySelectorAll('.review-card')
    reviewCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          backgroundColor: 'rgba(255,255,255,0.08)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          backgroundColor: 'rgba(255,255,255,0.05)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // Блок "Наша атмосфера" удалён
  }

  // Добавим анимацию счетчиков (для будущего использования)
  const animateCounters = (counterElements: NodeListOf<Element>) => {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0')
      const duration = parseFloat(counter.getAttribute('data-duration') || '2')
      
      gsap.fromTo(counter, 
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: duration,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            once: true
          }
        }
      )
    })
  }

  // Анимация появления текста по словам
  const animateTextByWords = (textElement: HTMLElement, options: any = {}) => {
    const { 
      duration = 0.6, 
      stagger = 0.1, 
      ease = 'power3.out',
      trigger = textElement,
      start = 'top 80%',
      once = true 
    } = options

    // Разбиваем текст на слова
    const words = textElement.innerText.split(' ')
    textElement.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ')
    
    const wordElements = textElement.querySelectorAll('.word')
    
    gsap.set(wordElements, { opacity: 0, y: 30 })
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        once
      }
    })

    tl.to(wordElements, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease
    })

    return tl
  }
  // Основная функция инициализации всех анимаций
  const initAllAnimations = (heroRef?: HTMLElement) => {
    nextTick(() => {
      if (heroRef) {
        initHeroAnimations(heroRef)
        // Плавный наезд секции "О нас" при статичном герое
        const container = document.querySelector('.stacked-hero') as HTMLElement | null
        const stackedContent = document.querySelector('.stacked-content') as HTMLElement | null
        if (container && stackedContent) {
          // Сдвигаем всё полотно (О нас + Популярные) единообразно
          gsap.set(stackedContent, { yPercent: 100 })
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          })
          tl.to(stackedContent, { yPercent: 0, ease: 'none' })
          timelines.value.push(tl)
        }
      }
      initSectionAnimations()
      initParallaxEffects()
      initHoverEffects()
      
      // Добавим небольшую задержку для лучшей производительности
      setTimeout(() => {
        // Анимация счетчиков, если есть
        const counters = document.querySelectorAll('[data-target]')
        if (counters.length > 0) {
          animateCounters(counters)
        }
      }, 500)
    })
  }

  // Очистка всех анимаций
  const cleanup = () => {
    timelines.value.forEach(tl => {
      tl.kill()
    })
    timelines.value = []
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    initHeroAnimations,
    initSectionAnimations,
    initParallaxEffects,
    initHoverEffects,
    initAllAnimations,
    animateCounters,
    animateTextByWords,
    cleanup,
    timelines
  }
}