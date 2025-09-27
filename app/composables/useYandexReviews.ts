import { ref, computed, readonly } from 'vue'

export interface YandexReview {
  id: string
  author: string
  text: string
  rating: number
  date: string
  avatar?: string
}

export interface YandexReviewsResponse {
  reviews: YandexReview[]
  totalCount: number
  averageRating: number
  lastUpdated: string
}

export const useYandexReviews = () => {
  const reviews = ref<YandexReview[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<string | null>(null)
  const totalCount = ref(0)
  const averageRating = ref(0)

  // Кэширование на 1 час
  const CACHE_KEY = 'yandexReviews:cache'
  const CACHE_TTL_MS = 60 * 60 * 1000 // 1 час

  type CachePayload = {
    data: YandexReviewsResponse
    timestamp: number
  }

  const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  const loadCache = (): CachePayload | null => {
    try {
      if (!canUseStorage()) return null
      const raw = window.localStorage.getItem(CACHE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as CachePayload
    } catch {
      return null
    }
  }
  const saveCache = (payload: YandexReviewsResponse) => {
    try {
      if (!canUseStorage()) return
      const toStore: CachePayload = { data: payload, timestamp: Date.now() }
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(toStore))
    } catch {
      // игнорируем ошибки записи
    }
  }

  // Вычисляемые свойства
  const hasReviews = computed(() => reviews.value.length > 0)
  // Ограничиваем отображение не более 3 отзывов за раз
  const recentReviews = computed(() =>
    reviews.value
      .slice() // чтобы не мутировать исходный массив при sort
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  )
  const topRatedReviews = computed(() =>
    reviews.value
      .filter(review => review.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  )

  // Функция для получения отзывов
  const fetchReviews = async (forceRefresh = false) => {
    if (isLoading.value && !forceRefresh) return

    // Проверяем кэш, если не требуется форс-обновление
    if (!forceRefresh) {
      const cache = loadCache()
      if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
        const { reviews: cachedReviews, totalCount: cachedTotal, averageRating: cachedAvg, lastUpdated: cachedUpdated } = cache.data
        reviews.value = cachedReviews
        totalCount.value = cachedTotal
        averageRating.value = cachedAvg
        lastUpdated.value = cachedUpdated
        return
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<YandexReviewsResponse>('/api/yandex-reviews')
      
  reviews.value = response.reviews
  totalCount.value = response.totalCount
  averageRating.value = response.averageRating
  lastUpdated.value = response.lastUpdated
  // Сохраняем в кэш
  saveCache(response)
      
      console.log(`Загружено ${response.reviews.length} отзывов с Яндекс.Карт`)
      
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err)
      error.value = 'Не удалось загрузить отзывы'

      // Пытаемся достать кэш при ошибке
      const cache = loadCache()
      if (cache) {
        const { reviews: cachedReviews, totalCount: cachedTotal, averageRating: cachedAvg, lastUpdated: cachedUpdated } = cache.data
        reviews.value = cachedReviews
        totalCount.value = cachedTotal
        averageRating.value = cachedAvg
        lastUpdated.value = cachedUpdated
      } else {
        // Используем fallback отзывы при отсутствии кэша
        const fallbackReviews = getFallbackReviews()
        reviews.value = fallbackReviews
        totalCount.value = fallbackReviews.length
        const totalRating = fallbackReviews.reduce((sum, review) => sum + review.rating, 0)
        averageRating.value = totalRating / fallbackReviews.length
        lastUpdated.value = new Date().toISOString()
      }
    } finally {
      isLoading.value = false
    }
  }

  // Функция для обновления отзывов
  const refreshReviews = () => fetchReviews(true)

  // Функция для получения отзывов по рейтингу
  const getReviewsByRating = (minRating: number) => {
    return reviews.value.filter(review => review.rating >= minRating)
  }

  // Функция для поиска отзывов по тексту
  const searchReviews = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return reviews.value.filter(review => 
      review.text.toLowerCase().includes(lowercaseQuery) ||
      review.author.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Функция для форматирования даты отзыва
  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`
    
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Функция для генерации звездочек рейтинга
  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => ({
      filled: index < rating,
      index
    }))
  }

  // Fallback отзывы
  const getFallbackReviews = (): YandexReview[] => [
    {
      id: 'fallback-1',
      author: 'Анна М.',
      text: 'Очень вкусно! Заказывали фермерский завтрак и блинчики с творогом. Порции большие, всё свежее. Персонал приветливый, быстро обслужили.',
      rating: 5,
      date: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'fallback-2',
      author: 'Михаил С.',
      text: 'Хороший ресторан, уютная атмосфера. Еда вкусная, особенно понравились десерты. Цены адекватные для такого уровня сервиса.',
      rating: 4,
      date: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'fallback-3',
      author: 'Елена В.',
      text: 'Отличное место для семейного ужина. Есть детская зона, что очень удобно. Меню разнообразное, каждый найдет что-то по вкусу.',
      rating: 5,
      date: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'fallback-4',
      author: 'Дмитрий К.',
      text: 'Заходили на завтрак, всё понравилось. Кофе вкусный, выпечка свежая. Обслуживание быстрое, несмотря на то что было много посетителей.',
      rating: 4,
      date: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: 'fallback-5',
      author: 'Ольга Н.',
      text: 'Прекрасная кондитерская! Торты и пирожные просто восхитительные. Персонал знает своё дело, всегда помогут с выбором.',
      rating: 5,
      date: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 'fallback-6',
      author: 'Сергей М.',
      text: 'Ресторан понравился, особенно атмосфера. Еда качественная, порции большие. Единственное - немного долго готовили, но результат того стоил.',
      rating: 4,
      date: new Date(Date.now() - 86400000 * 12).toISOString()
    }
  ]

  return {
    // Состояние
    reviews: readonly(reviews),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    totalCount: readonly(totalCount),
    averageRating: readonly(averageRating),
    
    // Вычисляемые свойства
    hasReviews,
    recentReviews,
    topRatedReviews,
    
    // Методы
    fetchReviews,
    refreshReviews,
    getReviewsByRating,
    searchReviews,
    formatReviewDate,
    generateStars
  }
}
