<template>
  <ReservationModal :is-open="isReservationOpen" @close="isReservationOpen = false" />
</template>

<script setup>
import { useReservationModal } from '@/composables/useReservationModal'
import ReservationModal from './ReservationModal.vue'

const { isReservationOpen } = useReservationModal()
</script>
