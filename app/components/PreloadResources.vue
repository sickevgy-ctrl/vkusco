<template>
  <!-- Этот компонент не рендерит ничего видимого -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Критические ресурсы для предзагрузки
const criticalResources = [
  // Критические изображения блюд
  '/images/dishes/fermer-zavtrak.jpg',
  '/images/dishes/nemeckiy-zavtrak.jpg',
  '/images/dishes/briosh-losos.jpg',
  
  // Критические шрифты
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;900&family=Cormorant+Garamond:wght@400;700&display=swap'
]

// Предзагрузка ресурсов
const preloadResources = () => {
  if (process.client) {
    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      
      if (resource.endsWith('.avif')) {
        link.rel = 'preload'
        link.as = 'image'
        link.href = resource
        link.type = 'image/avif'
      } else if (resource.endsWith('.webp')) {
        link.rel = 'preload'
        link.as = 'image'
        link.href = resource
        link.type = 'image/webp'
      } else if (resource.endsWith('.svg')) {
        link.rel = 'preload'
        link.as = 'image'
        link.href = resource
        link.type = 'image/svg+xml'
      } else if (resource.endsWith('.css')) {
        link.rel = 'preload'
        link.as = 'style'
        link.href = resource
        link.type = 'text/css'
      }
      
      document.head.appendChild(link)
    })
  }
}

// DNS prefetch для внешних ресурсов
const setupDnsPrefetch = () => {
  if (process.client) {
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }
}

// Resource hints для улучшения производительности
const setupResourceHints = () => {
  if (process.client) {
    // Preconnect для Google Fonts
    const preconnect = document.createElement('link')
    preconnect.rel = 'preconnect'
    preconnect.href = 'https://fonts.gstatic.com'
    preconnect.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect)
  }
}

onMounted(() => {
  // Небольшая задержка для избежания блокировки критического рендера
  setTimeout(() => {
    preloadResources()
    setupDnsPrefetch()
    setupResourceHints()
  }, 100)
})
</script>
