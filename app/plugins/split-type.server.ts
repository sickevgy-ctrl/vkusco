import { defineNuxtPlugin } from 'nuxt/app'

// Register a no-op SSR directive to avoid server-side errors when using v-split
export default defineNuxtPlugin((nuxtApp) => {
  // Only register if not already present (prevents duplicate warnings)
  const isRegistered = Boolean((nuxtApp.vueApp as any)?._context?.directives?.split)
  if (!isRegistered) {
    nuxtApp.vueApp.directive('split', {
      // Vue SSR expects getSSRProps when directive is present during SSR
      getSSRProps() {
        return {}
      }
    })
  }
})
