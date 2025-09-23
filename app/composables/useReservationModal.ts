import { ref } from 'vue'

const isReservationOpen = ref(false)

export const useReservationModal = () => ({
  isReservationOpen
})
