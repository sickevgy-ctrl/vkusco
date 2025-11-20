import { computed } from 'vue'
import brand from '~/brand.config'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'restaurant'
  structuredData?: Record<string, any>
}

export const useSEO = () => {
  const siteUrl = 'https://vkusnayakompania.ru'
  const siteName = brand.name

  const generateTitle = (title?: string): string => {
    if (!title) return `${siteName} — Ресторан изысканной кухни`
    return `${title} | ${siteName}`
  }

  const generateDescription = (description?: string): string => {
    if (!description) {
      return `${siteName} — ресторан европейской кухни в самом сердце города. Забронируйте столик для незабываемого ужина.`
    }
    return description
  }

  const generateKeywords = (keywords?: string[]): string => {
    const defaultKeywords = [
      'ресторан',
      'европейская кухня',
      'бронирование столиков',
      'ужин',
      'обед',
      siteName,
      'Москва',
      'итальянская кухня'
    ]
    
    const finalKeywords = keywords ? [...keywords, ...defaultKeywords] : defaultKeywords
    return [...new Set(finalKeywords)].join(', ')
  }

  const generateRestaurantStructuredData = (config?: {
    name?: string
    description?: string
    telephone?: string
    address?: {
      streetAddress: string
      addressLocality: string
      addressCountry: string
    }
    geo?: {
      latitude: string
      longitude: string
    }
    openingHours?: Array<{
      dayOfWeek: string[]
      opens: string
      closes: string
    }>
    priceRange?: string
    servesCuisine?: string[]
    image?: string
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: config?.name || siteName,
      description: config?.description || generateDescription(),
      url: siteUrl,
      telephone: config?.telephone || '+7-917-142-15-74',
      address: {
        '@type': 'PostalAddress',
        streetAddress: config?.address?.streetAddress || 'ул. Советской Армии, 177',
        addressLocality: config?.address?.addressLocality || 'Москва',
        addressCountry: config?.address?.addressCountry || 'RU'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: config?.geo?.latitude || '55.7558',
        longitude: config?.geo?.longitude || '37.6176'
      },
      openingHoursSpecification: config?.openingHours || [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '12:00',
          closes: '23:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday'],
          opens: '12:00',
          closes: '24:00'
        }
      ],
      priceRange: config?.priceRange || '$$',
      servesCuisine: config?.servesCuisine || ['Европейская', 'Итальянская'],
      image: config?.image || `${siteUrl}/images/atmosphere/main-hall.svg`,
      logo: `${siteUrl}/logo.svg`
    }
  }

  const generateMenuItemStructuredData = (menuItems: Array<{
    name: string
    description: string
    price: number
    image?: string
    category?: string
  }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: `Меню ${siteName}`,
      description: `Меню ресторана ${siteName}`,
      url: `${siteUrl}/menu`,
      hasMenuSection: menuItems.reduce((acc, item, index) => {
        const category = item.category || 'Основные блюда'
        let section = acc.find(s => s.name === category)
        
        if (!section) {
          section = {
            '@type': 'MenuSection',
            name: category,
            hasMenuItem: []
          }
          acc.push(section)
        }
        
        section.hasMenuItem.push({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description,
          image: item.image,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            price: item.price
          }
        })
        
        return acc
      }, [] as any[])
    }
  }

  const generateReviewStructuredData = (reviews: Array<{
    author: string
    text: string
    rating?: number
    date?: string
  }>) => {
    return reviews.map(review => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      reviewBody: review.text,
      author: {
        '@type': 'Person',
        name: review.author
      },
      itemReviewed: {
        '@type': 'Restaurant',
        name: siteName
      },
      reviewRating: review.rating ? {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5
      } : undefined,
      datePublished: review.date || new Date().toISOString()
    }))
  }

  const generateFAQStructuredData = (faqs: Array<{
    question: string
    answer: string
  }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  const generateBreadcrumbStructuredData = (items: Array<{
    name: string
    url: string
  }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  return {
    siteUrl,
    siteName,
    generateTitle,
    generateDescription,
    generateKeywords,
    generateRestaurantStructuredData,
    generateMenuItemStructuredData,
    generateReviewStructuredData,
    generateBreadcrumbStructuredData,
    generateFAQStructuredData
  }
}

// Composable для хлебных крошек
export const useBreadcrumbs = () => {
  const breadcrumbs = computed(() => {
    const route = useRoute()
    const items = [
      { name: 'Главная', url: '/' }
    ]

    switch (route.path) {
      case '/about':
        items.push({ name: 'О нас', url: '/about' })
        break
      case '/menu':
        items.push({ name: 'Меню', url: '/menu' })
        break
      case '/contact':
        items.push({ name: 'Контакты', url: '/contact' })
        break
    }

    return items
  })

  const structuredData = computed(() => {
    const { generateBreadcrumbStructuredData } = useSEO()
    return generateBreadcrumbStructuredData(breadcrumbs.value)
  })

  return {
    breadcrumbs,
    structuredData
  }
}

// Composable для управления мета-тегами страниц
export const usePageSEO = (config: SEOConfig) => {
  const { generateTitle, generateDescription, generateKeywords, siteUrl, siteName } = useSEO()
  const { breadcrumbs, structuredData } = useBreadcrumbs()

  const title = generateTitle(config.title)
  const description = generateDescription(config.description)
  const keywords = generateKeywords(config.keywords)
  const image = config.image || `${siteUrl}/images/atmosphere/main-hall.svg`
  const url = config.url || siteUrl

  const seoData = {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: 'index, follow' },
      
      // Open Graph
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:site_name', content: siteName },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: 'ru_RU' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ],
    link: [
      { rel: 'canonical', href: url }
    ],
    script: [
      ...(config.structuredData ? [{
        type: 'application/ld+json',
        children: JSON.stringify(config.structuredData)
      }] : []),
      {
        type: 'application/ld+json',
        children: JSON.stringify(structuredData.value)
      }
    ]
  }

  useHead(seoData)

  return {
    seoData,
    breadcrumbs
  }
}