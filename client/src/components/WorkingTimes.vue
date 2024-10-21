<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { WorkingTime } from '@/types'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import { getReadableInterval } from '@/utils/date'
import { adapter } from '@/adapters'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import { useUserStore } from '@/stores/user'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Divider from 'primevue/divider'
import ProtectedViewVue from './ProtectedView.vue'
import { authFetch } from '@/requests/fetch'

const router = useRouter()
const route = useRoute()

const data = ref<{ workingTimes: WorkingTime[]; loading: boolean }>({
  workingTimes: [],
  loading: true
})

const user = useUserStore()

const deleteWorkingTime = async (id: string) => {
  try {
    let res = await authFetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/` + id, {
      method: 'DELETE'
    })
    getWorkingTimes()
    if (res.status == 204) {
      console.log('ok')
    } else {
      console.log('ko')
    }
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

const goToNewWTpage = async () => {
  router.push(`/workingtime/new/` + route.params.userId)
}

const updateWorkingTime = async (id: string, start: Date, end: Date) => {
  try {
    router.push(`/workingtime/update/${id}/${start}/${end}`)
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

const getWorkingTimes = async () => {
  try {
    let response = await authFetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${route.params.userId}`, {
      method: 'GET'
    })
    response = await response.json()
    data.value.workingTimes = response.data.map(adapter.from.api.workingTime)
    data.value.loading = false
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

// TODO: use date-fns here
const formatTime = (date: Date) => {
  return (
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0')
  )
}

const calculateDuration = (start: Date, end: Date) => {
  return getReadableInterval({ start, end })
}

const calculateTotalDuration = (times: any[]) => {
  const timeInSeconds = times.reduce((total, time) => {
    return total + differenceInSeconds(new Date(time.end), new Date(time.start))
  }, 0)

  const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 })

  const formatted = formatDuration(duration)

  return formatted
}
const getPeriod = (start: Date) => {
  const hour = start.getHours()
  return hour < 12 ? 'Morning' : 'Afternoon'
}

onMounted(getWorkingTimes)

watch(() => route.params.userId, getWorkingTimes)

const groupedWorkingTimes = computed(() => {
  const workingTimeByDate: Record<string, WorkingTime[]> = {}
  data.value.workingTimes.forEach((workingTime) => {
    const dateKey = new Date(workingTime.start).toLocaleDateString()
    if (!workingTimeByDate[dateKey]) {
      workingTimeByDate[dateKey] = []
    }
    workingTimeByDate[dateKey].push(workingTime)
  })

  const sortedKeys = Object.keys(workingTimeByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const sortedGrouped: Record<string, WorkingTime[]> = {}
  sortedKeys.forEach((key) => {
    sortedGrouped[key] = workingTimeByDate[key]
  })
  return sortedGrouped
})

onMounted(() => {
  getWorkingTimes()
})
</script>

<template>
  <h3 class="text-2xl mb-4">Working Times for User {{ user.username }}</h3>
  <div class="space-y-4">
    <ProtectedViewVue :authorizedRoles="['manager', 'general_manager']" :resourceId="`${route.params.userId}`">
      <Panel>
        <template #header>
          <Button size="small" @click="goToNewWTpage"> New Working Time </Button>
        </template>
        <div v-if="data.loading" class="text-center text-gray-300">Loading...</div>
        <div v-else>
          <Accordion :value="[]" multiple>
            <AccordionPanel :value="date" v-for="(times, date) in groupedWorkingTimes" :key="date" class="mb-4">
              <AccordionHeader>
                <div class="row md:flex md:justify-between md:w-full pr-4">
                  <p>{{ date }}</p>
                  <p>{{ calculateTotalDuration(times) }}</p>
                </div>
              </AccordionHeader>
              <AccordionContent>
                <div v-for="(time, index) in times" :key="index" class="mb-1 space-y-2">
                  <div class=" row p-2 md:flex md:justify-between md:items-center">
                    <p>
                      <strong>{{ getPeriod(time.start) }}:</strong> {{ formatTime(time.start) }} -
                      {{ formatTime(time.end) }}
                    </p>
                    <p>Duration: {{ calculateDuration(time.start, time.end) }}</p>
                    <div class="flex gap-2 mt-2">
                      <Button @click="updateWorkingTime(time.id, time.start, time.end)" size="small">
                        Update
                      </Button>
                      <Button @click="deleteWorkingTime(time.id)" size="small"> Delete </Button>
                    </div>
                  </div>
                  <Divider />
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </Panel>
    </ProtectedViewVue>
  </div>
</template>
