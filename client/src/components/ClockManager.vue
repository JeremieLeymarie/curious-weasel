<script setup lang="ts">
import type { Clock } from '@/types'
import { ref } from 'vue'

import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { createClock, updateClock } from '@/requests/clock'
import { createWorkingTime } from '@/requests/workingTimes'

const toast = useToast();

const { userId, clock, refetch } = defineProps<{
  userId: string
  clock: Clock | null
  refetch: () => void
}>()
const dateInput = ref<Date>()

const clockIn = async (date?: Date) => {
  const d = date ?? new Date()

  await createClock(userId, { time: d.toISOString(), status: true })
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
  await createClock(userId, newClock)

  // Create corresponding working time
  await createWorkingTime(userId, { start: clock?.time.toISOString(), end: newClock.time })

  // Update previous clock to indicate that user is not currently working
  await updateClock({ id: clock.id, status: false })

  refetch()
}

const manualClock = () => {
  if (!dateInput.value) return
  if (clock) clockOut(new Date(dateInput.value))
  else clockIn(new Date(dateInput.value))
  toast.add({
    severity: 'success',
    summary: 'Confirmed',
    detail: 'You clocked manually!',
    life: 3000
  });
}
</script>

<template>
  <div>
    <div class="flex items-center justify-left my-6">
      <Button outlined class="text-xl w-[120px]" @click="clock ? clockOut() : clockIn()">
        Clock {{ clock ? 'out' : 'in' }}
      </Button>
    </div>
    <div class="space-y-4">
      <Toast />
      <label for="date-input" class="text-xl">Manual clock {{ clock ? 'out' : 'in' }}</label>
      <div class="gap-4 flex">
        <DatePicker id="datepicker-24h" v-model="dateInput" showTime hourFormat="24" fluid />

        <Button outlined type="submit" class="w-[80px]" @click="manualClock()"> Submit </Button>
      </div>
    </div>
  </div>
</template>
