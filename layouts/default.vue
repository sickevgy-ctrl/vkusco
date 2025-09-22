<template>
  <div class="min-h-screen relative text-white">
    <!-- subtle decorative grid background -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-10"></div>
    <header>
      <AppNavigation />
    </header>
    <main id="main-content" class="pt-16">
      <slot />
    </main>
    <AppFooter />
    <!-- Global reservation modal -->
    <ReservationPortal />
  </div>
  
</template>

<script setup>
import brand from '@/brand.config'

const url = useRequestURL()
const origin = `${url.protocol}//${url.host}`
const organizationId = `${origin}/#organization`

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': organizationId,
        name: brand.name || 'Вкусная компания',
        url: origin,
        image: [
          `${origin}/images/IMG_5217.JPG`
        ],
  logo: `${origin}/content/IMG_3306.PNG`,
        email: 'info@vkusnaya.company'
      })
    }
  ]
})
</script>