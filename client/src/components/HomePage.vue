<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ClockManager from './ClockManager.vue'
import type { Clock, User } from '@/types'
import { adapter } from '@/adapters'
import { getUser } from '@/requests/user'
import { readableDate, readableDateTime, getReadableInterval } from '@/utils/date'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'

const clocks = ref<Clock[]>()
const user = ref<User>()
const userStore = useUserStore();

onMounted(() => {
  if (!userStore.user) return
  getUser(userStore.user.id).then((res) => {
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
  if (!userStore.user) return
  getClocks(userStore.user?.id).then((res) => {
    clocks.value = res
  })
}

const currentClock = computed(() => clocks.value?.find((clock) => clock.status) || null)

const today = readableDate(new Date())
</script>

<template>
  <div class="space-y-4" v-if="user">
    <h1 class="text-3xl">Welcome, {{ user?.username }}!</h1>
    <p class="text-l">Today is {{ today }}</p>
    <hr class="h-1 bg-primary-950 border-0" />

    <div class="gap-8 md:flex">
      <Card class="mt-4 w-10/12 md:w-6/12">
        <template #title>Fast Clocking</template>
        <template #subtitle>
          <p v-if="currentClock">
            You have been working for
            <strong>{{
              getReadableInterval({ start: currentClock.time, end: new Date() })
            }}</strong>
            <span class="text-xs">
              (working time started on {{ readableDateTime(currentClock.time) }})</span>
          </p>
          <p v-else>You have not started working today.</p>
        </template>
        <template #content>
          <ClockManager :clock="currentClock" :userId="user.id.toString()" :refetch="fetchClocks" />
        </template>
      </Card>
      <Card class="mt-4 w-10/12 md:w-6/12">
        <template #title>Overview</template>
        <template #content>
          <div class="flex items-center gap-4">
            <i class="pi pi-briefcase !text-2xl"></i>
            <p class="p-3 text-center">You have worked {{}} this week.</p>
          </div>
          <div class="flex items-center gap-4">
            <i class="pi pi-sun !text-2xl"></i>
            <p class="p-3 text-center">You have {{}} days off left.</p>
          </div>
          <Button class="my-4">
            <RouterLink :to="`/chart-manager/${userStore.user?.id}`"><a>Consult dashboard</a></RouterLink>
          </Button>
        </template>
      </Card>
    </div>
  </div>
  <div v-else>User not found...</div>
</template>
