import { useNuxtApp } from 'nuxt/app'

export function useLenis() {
  const { $lenis } = useNuxtApp()
  return $lenis
}
