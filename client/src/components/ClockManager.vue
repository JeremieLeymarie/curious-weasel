<script setup lang="ts">
import { ref } from 'vue'

import type { Clock } from '@/types'
import { adapter } from '@/adapters'

defineProps<{
  userId?: string
}>()

const clocks = ref<Clock[]>()

const getClocks = async (userId: string) => {
  const response = await fetch(`http://localhost:4000/api/clocks/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data.map(adapter.from.api.clock)
}
</script>

<template>
  <div>WIP {{ userId }}</div>
</template>
