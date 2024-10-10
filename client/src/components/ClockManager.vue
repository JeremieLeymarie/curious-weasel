<script setup lang="ts">
import type { Clock } from '@/types'

const { userId, clock, refetch } = defineProps<{
  userId: string
  clock: Clock | null
  refetch: () => void
}>()

const clockIn = async () => {
  await fetch(`http://localhost:4000/api/clocks/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock: { time: new Date().toISOString(), status: true } })
  })
  refetch()
}

const clockOut = async () => {
  const newClock = {
    time: new Date().toISOString(),
    status: false,
    user_id: userId
  }
  if (!clock) {
    console.error('Cannot clock out without first clock')
    return
  }
  // TODO: all of this should be done in one API endpoint

  // Create new clock
  await fetch(`http://localhost:4000/api/clocks/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock: newClock })
  })

  // Create corresponding working time
  await fetch(`http://localhost:4000/api/workingtimes/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ working_time: { start: clock?.time.toISOString(), end: newClock.time } })
  })

  // Update previous clock to indicate that user is not currently working
  await fetch(`http://localhost:4000/api/clocks/${clock.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock: { status: false } })
  })

  refetch()
}
</script>

<template>
  <div>
    <button
      class="bg-[#1343ad] text-white rounded-full p-3 m-4 w-4/12 text-center"
      @click="clock ? clockOut() : clockIn()"
    >
      <a>Clock {{ clock ? 'out' : 'in' }}</a>
    </button>
  </div>
</template>
