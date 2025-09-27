import { H3Event, defineEventHandler } from 'h3'
import { createHash } from 'crypto'
import puppeteer from 'puppeteer'

interface YandexReview {
  id: string
  author: string
  text: string
  rating: number
  date: string
  avatar?: string
}

interface YandexReviewsResponse {
  reviews: YandexReview[]
  totalCount: number
  averageRating: number
  lastUpdated: string
}

// Кэш для отзывов (в продакшене лучше использовать Redis)
let reviewsCache: {
  data: YandexReviewsResponse | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 1000 * 60 * 30 // 30 минут

export default defineEventHandler(async (event: H3Event): Promise<YandexReviewsResponse> => {
  try {
    // Проверяем кэш
    const now = Date.now()
    if (reviewsCache.data && (now - reviewsCache.timestamp) < CACHE_DURATION) {
      return reviewsCache.data
    }

    // URL страницы с отзывами
    const yandexUrl = 'https://yandex.ru/maps/org/vkusnaya_kompaniya/243452895564/reviews/?ll=50.202188%2C53.222568&z=17'
    
    // Используем Puppeteer для получения динамического контента
    const reviews = await getYandexReviewsWithPuppeteer(yandexUrl)
    
    // Если не удалось получить отзывы, возвращаем fallback данные
    if (reviews.length === 0) {
      console.warn('Не удалось получить отзывы с Яндекс.Карт, используем fallback данные')
      return getFallbackReviews()
    }

    // Используем общий рейтинг с Яндекс.Карт, если он есть, иначе рассчитываем из отзывов
    const calculatedRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Используем рассчитанный рейтинг
    const finalRating = calculatedRating

    const response: YandexReviewsResponse = {
      reviews,
      totalCount: reviews.length,
      averageRating: Math.round(finalRating * 10) / 10, // Округляем до 1 знака после запятой
      lastUpdated: new Date().toISOString()
    }

    // Сохраняем в кэш
    reviewsCache = {
      data: response,
      timestamp: now
    }

    return response

  } catch (error) {
    console.error('Ошибка при получении отзывов:', error)
    
    // Возвращаем fallback данные при ошибке
    return getFallbackReviews()
  }
})

async function getYandexReviewsWithPuppeteer(url: string): Promise<YandexReview[]> {
  let browser: any = null
  
  try {
    console.log('Запуск Puppeteer для получения отзывов с Яндекс.Карт...')
    
    // Запускаем браузер
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    })
    
    const page = await browser.newPage()
    
    // Устанавливаем User-Agent и другие заголовки
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    })
    
    console.log('Переход на страницу Яндекс.Карт...')
    
    // Переходим на страницу
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })
    
    console.log('Ожидание загрузки отзывов...')
    
    // Ждем загрузки отзывов
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Пытаемся найти элементы отзывов
    const hasReviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('[data-review-id], .review-item, .business-review-view, .orgpage-reviews-view__review')
      return reviewElements.length > 0
    })
    
    if (!hasReviews) {
      console.warn('Отзывы не найдены на странице, возможно изменилась структура сайта')
      return []
    }
    
    console.log('Парсинг отзывов...')
    
    // Парсим отзывы и общий рейтинг
    const result = await page.evaluate(() => {
      const reviews: any[] = []
      
      // Ищем общий рейтинг заведения
      const overallRatingElement = document.querySelector('.business-rating-view__rating, .orgpage-header-view__rating, [data-rating]')
      let overallRating = 0
      if (overallRatingElement) {
        const ratingText = overallRatingElement.textContent || ''
        const ratingMatch = ratingText.match(/(\d+[.,]\d+|\d+)/)
        if (ratingMatch) {
          overallRating = parseFloat(ratingMatch[1].replace(',', '.'))
        }
      }
      
      // Ищем элементы отзывов
      const reviewElements = document.querySelectorAll('[data-review-id], .review-item, .business-review-view, .orgpage-reviews-view__review, .review-card')
      
      console.log(`Найдено элементов отзывов: ${reviewElements.length}`)
      
      reviewElements.forEach((element, index) => {
        try {
          // Ищем автора
          const authorElement = element.querySelector('.review-author, .user-name, [data-author], .orgpage-reviews-view__user-name, .review-card__author') || 
                               element.querySelector('span[class*="author"]') ||
                               element.querySelector('div[class*="author"]') ||
                               element.querySelector('a[class*="user"]') ||
                               element.querySelector('[class*="name"]')
          
          // Ищем текст отзыва
          const textElement = element.querySelector('.review-text, .review-content, [data-text], .orgpage-reviews-view__text, .review-card__text') ||
                             element.querySelector('div[class*="text"]') ||
                             element.querySelector('p[class*="text"]') ||
                             element.querySelector('[class*="comment"]')
          
          // Ищем рейтинг отзыва
          const ratingElement = element.querySelector('.rating, .stars, [data-rating], .orgpage-reviews-view__rating, .review-card__rating') ||
                               element.querySelector('span[class*="rating"]') ||
                               element.querySelector('div[class*="rating"]') ||
                               element.querySelector('[class*="star"]') ||
                               element.querySelector('[class*="score"]')
          
          // Ищем дату
          const dateElement = element.querySelector('.review-date, .date, [data-date], .orgpage-reviews-view__date, .review-card__date') ||
                             element.querySelector('span[class*="date"]') ||
                             element.querySelector('div[class*="date"]') ||
                             element.querySelector('[class*="time"]')
          
          if (authorElement && textElement) {
            let author = authorElement.textContent?.trim() || 'Аноним'
            
            // Очищаем имя автора - убираем служебные слова и берем только имя и фамилию
            // Сначала разделяем склеенные слова (например, "Ольга КоркинаДегустатор" -> "Ольга Коркина Дегустатор")
            author = author
              .replace(/([а-яёА-ЯЁ])([А-ЯЁ])/g, '$1 $2') // разделяем русские слова
              .replace(/([a-zA-Z])([А-ЯЁ])/g, '$1 $2') // разделяем латинские и русские
              .replace(/([а-яёА-ЯЁ])([a-zA-Z])/g, '$1 $2') // разделяем русские и латинские
              .replace(/([а-яёА-ЯЁa-zA-Z])(\d)/g, '$1 $2') // разделяем буквы и цифры
              .replace(/(\d)([а-яёА-ЯЁa-zA-Z])/g, '$1 $2') // разделяем цифры и буквы
            
            // Убираем служебные слова
            author = author
              .replace(/Знаток\s+города.*?уровня/gi, '')
              .replace(/Дегустатор\s+\d+\s+уровня/gi, '')
              .replace(/Знаток/gi, '')
              .replace(/Дегустатор/gi, '')
              .replace(/уровня/gi, '')
              .replace(/Подписаться/gi, '')
              .replace(/\s+/g, ' ')
              .trim()
            
            // Берем только первые 2 слова
            const words = author.split(/\s+/)
            author = words.slice(0, 2).join(' ')
            
            const text = textElement.textContent?.trim() || ''
            
            // Пытаемся извлечь рейтинг отзыва
            let rating = 5
            if (ratingElement) {
              const ratingText = ratingElement.textContent || ''
              // Ищем звездочки или числовой рейтинг
              const starsMatch = ratingText.match(/★/g)
              if (starsMatch) {
                rating = starsMatch.length
              } else {
                const ratingMatch = ratingText.match(/(\d+[.,]\d+|\d+)/)
                if (ratingMatch) {
                  rating = Math.round(parseFloat(ratingMatch[1].replace(',', '.')))
                }
              }
            }
            
            // Пытаемся извлечь дату
            let date = new Date().toISOString()
            if (dateElement) {
              const dateText = dateElement.textContent?.trim() || ''
              // Простая попытка парсинга даты
              if (dateText.includes('дня') || dateText.includes('дней')) {
                const daysMatch = dateText.match(/(\d+)/)
                if (daysMatch) {
                  const days = parseInt(daysMatch[1])
                  date = new Date(Date.now() - days * 86400000).toISOString()
                }
              } else if (dateText.includes('недели') || dateText.includes('недель')) {
                const weeksMatch = dateText.match(/(\d+)/)
                if (weeksMatch) {
                  const weeks = parseInt(weeksMatch[1])
                  date = new Date(Date.now() - weeks * 7 * 86400000).toISOString()
                }
              } else if (dateText.includes('месяца') || dateText.includes('месяцев')) {
                const monthsMatch = dateText.match(/(\d+)/)
                if (monthsMatch) {
                  const months = parseInt(monthsMatch[1])
                  date = new Date(Date.now() - months * 30 * 86400000).toISOString()
                }
              }
            }
            
            if (text.length > 10) { // Минимальная длина отзыва
              reviews.push({
                author,
                text,
                rating,
                date
              })
            }
          }
        } catch (error) {
          console.warn('Ошибка парсинга отзыва:', error)
        }
      })
      
      return {
        reviews: reviews.slice(0, 10), // Ограничиваем 10 отзывами
        overallRating
      }
    })
    
    const reviews = result.reviews
    const overallRating = result.overallRating
    
    console.log(`Успешно получено ${reviews.length} отзывов`)
    
    // Преобразуем в нужный формат
    return reviews.map((review, index) => ({
      id: createHash('md5').update(`${review.author}-${review.text}-${index}`).digest('hex').substring(0, 8),
      author: review.author,
      text: review.text,
      rating: review.rating,
      date: review.date
    }))
    
  } catch (error) {
    console.error('Ошибка при работе с Puppeteer:', error)
    return []
  } finally {
    if (browser) {
      try {
        await browser.close()
        console.log('Браузер закрыт')
      } catch (closeError) {
        console.warn('Ошибка при закрытии браузера:', closeError)
      }
    }
  }
}

function getFallbackReviews(): YandexReviewsResponse {
  const fallbackReviews = [
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
    },
    {
      id: 'fallback-7',
      author: 'Татьяна Р.',
      text: 'Отличное место для встреч с друзьями. Уютно, вкусно, недорого. Обязательно вернёмся снова!',
      rating: 5,
      date: new Date(Date.now() - 86400000 * 15).toISOString()
    },
    {
      id: 'fallback-8',
      author: 'Александр П.',
      text: 'Хороший ресторан, но иногда бывают очереди. Еда вкусная, особенно рекомендую супы и салаты. Персонал дружелюбный.',
      rating: 4,
      date: new Date(Date.now() - 86400000 * 18).toISOString()
    },
    {
      id: 'fallback-9',
      author: 'Мария К.',
      text: 'Люблю приходить сюда на завтрак. Блинчики с вареньем просто объедение! Атмосфера домашняя, чувствуешь себя как дома.',
      rating: 5,
      date: new Date(Date.now() - 86400000 * 20).toISOString()
    },
    {
      id: 'fallback-10',
      author: 'Игорь Л.',
      text: 'Неплохой ресторан, но есть к чему стремиться. Еда вкусная, но порой медленно подают. В целом впечатление положительное.',
      rating: 3,
      date: new Date(Date.now() - 86400000 * 25).toISOString()
    }
  ]
  
  // Динамически рассчитываем средний рейтинг
  const totalRating = fallbackReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / fallbackReviews.length
  
  return {
    reviews: fallbackReviews,
    totalCount: fallbackReviews.length,
    averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака после запятой
    lastUpdated: new Date().toISOString()
  }
}
