<template>
  <ReservationModal :is-open="isReservationOpen" @close="isReservationOpen = false" />
</template>

<script setup>
import { useReservationModal } from '@/composables/useReservationModal'
const { isReservationOpen } = useReservationModal()
</script>
