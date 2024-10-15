<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ClockManager from './ClockManager.vue'
import type { Clock, User } from '@/types'
import { adapter } from '@/adapters'
import { getUser } from '@/requests/user'
import { readableDate, readableDateTime, getReadableInterval } from '@/utils/date'
import AppButton from './ui/AppButton.vue'
import Card from 'primevue/card'

const clocks = ref<Clock[]>()
const user = ref<User>()

onMounted(() => {
  getUser('1').then((res) => {
    user.value = res
  })
  fetchClocks()
})

const getClocks = async (userId: string) => {
  const response = await fetch(`${import.meta.env.VITE_HOST}:4000/api/clocks/${userId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))

  return response.data.map(adapter.from.api.clock)
}

const fetchClocks = () => {
  getClocks('1').then((res) => {
    clocks.value = res
  })
}

const currentClock = computed(() => clocks.value?.find((clock) => clock.status) || null)

const today = readableDate(new Date())
</script>

<template>
  <h1 class="text-3xl m-4 ml-8">Welcome, {{ user?.username }}!</h1>
  <p class="text-l m-4 ml-8">Today is {{ today }}</p>
  <hr class="h-1 m-3 ml-8 mr-16 bg-[#1D0455] border-0" />

  <div v-if="user" class="flex ml-8">
    <Card class="m-4 w-6/12">
      <template #title>Fast Clocking</template>
      <template #content>
        <p v-if="currentClock">
          You have been working for
          <strong>{{ getReadableInterval({ start: currentClock.time, end: new Date() }) }}</strong>
          <span class="text-xs">
            (working time started on {{ readableDateTime(currentClock.time) }})</span
          >
        </p>
        <p v-else>You have not started working today.</p>
        <ClockManager :clock="currentClock" :userId="user.id.toString()" :refetch="fetchClocks" />
      </template>
    </Card>
    <div class="m-4 w-6/12">
      <h3 class="text-2xl m-4">Overview</h3>
      <div>
        <p class="bg-[#1D0455] text-white squared-full p-3 m-4 w-8/12 text-center">
          You have worked {{}} this week.
        </p>
      </div>
      <div>
        <p class="bg-[#1D0455] text-white squared-full p-3 m-4 w-8/12 text-center">
          You have {{}} days off left.
        </p>
      </div>
      <div class="">
        <AppButton class="rounded p-1 m-4 w-3/12 text-center">
          <RouterLink to="/chart-manager/1"><a>Consult dashboard</a></RouterLink>
        </AppButton>
      </div>
    </div>
  </div>
  <div v-else>User not found...</div>
</template>

<style lang="css">
@media screen and (max-width: 920px) {
  h1 {
    font-size: 2em;
  }

  .ml-8 {
    flex-direction: column;
  }
}
</style>
