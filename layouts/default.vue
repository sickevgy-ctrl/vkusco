<template>
  <div class="min-h-screen bg-white relative">
    <!-- subtle decorative grid background -->
    <div class="pointer-events-none absolute inset-0 bg-grid bg-grid opacity-20"></div>
    <AppNavigation />
    <main>
      <slot />
    </main>
    <AppFooter />
    <!-- Global reservation modal -->
    <ReservationPortal />
  </div>
</template>

<script setup>
// Компоненты будут автоматически импортированы
</script>