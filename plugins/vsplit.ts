import { defineNuxtPlugin } from 'nuxt/app'

// Universal fallback registration so resolveDirective('split') always succeeds
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('split', {
    getSSRProps() {
      return {}
    }
  })
})
