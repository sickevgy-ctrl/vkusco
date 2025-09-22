import { defineNuxtPlugin } from 'nuxt/app'

// Register a no-op SSR directive to avoid server-side errors when using v-split
export default defineNuxtPlugin((nuxtApp) => {
  // SSR no-op directive registration for v-split
  // eslint-disable-next-line no-console
  console.log('[plugins/split-type.server] Registering SSR v-split directive')
  nuxtApp.vueApp.directive('split', {
    // Vue SSR expects getSSRProps when directive is present during SSR
    getSSRProps() {
      return {}
    }
  })
})
