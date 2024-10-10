<script setup lang="ts">
import type { Clock } from '@/types'
import { ref } from 'vue'

const { userId, clock, refetch } = defineProps<{
  userId: string
  clock: Clock | null
  refetch: () => void
}>()
const dateInput = ref<Date>()

const clockIn = async (date?: Date) => {
  const d = date ?? new Date()

  await fetch(`http://localhost:4000/api/clocks/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clock: { time: d.toISOString(), status: true } })
  })
  refetch()
}

const clockOut = async (date?: Date) => {
  const d = date ?? new Date()

  const newClock = {
    time: d.toISOString(),
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

const manualClock = () => {
  if (!dateInput.value) return
  if (clock) clockOut(new Date(dateInput.value))
  else clockIn(new Date(dateInput.value))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-left my-6">
      <button
        class="bg-blue-900 text-white rounded-lg px-3 py-1 shadow-md hover:shadow-xl text-xl"
        @click="clock ? clockOut() : clockIn()"
      >
        <a>Clock {{ clock ? 'out' : 'in' }}</a>
      </button>
    </div>
    <div class="space-y-4">
      <label for="date-input" class="text-2xl"
        >Manual clock {{ clock ? 'out' : 'in' }}</label
      >
      <div class="flex gap-4">
        <input v-model="dateInput" type="datetime-local" name="date-input" id="date-input" />
        <button
          type="submit"
          class="bg-blue-900 text-white rounded-lg px-3 py-1 shadow-md hover:shadow-xl text-xl"
          @click="manualClock()"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
