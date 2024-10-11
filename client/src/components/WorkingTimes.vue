<script setup lang="ts">
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { WorkingTime } from '@/types'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import AppButton from './ui/AppButton.vue'
import ProtectedView from './ProtectedView.vue'
import { getReadableInterval } from '@/utils/date'
import { adapter } from '@/adapters'

const router = useRouter()
const route = useRoute()

const data = ref<{ workingTimes: WorkingTime[]; loading: boolean; expandedDate: string | null }>({
  workingTimes: [],
  loading: true,
  expandedDate: null
})

const deleteWorkingTime = async (id: string) => {
  try {
    let res = await fetch(`${process.env.HOST}:4000/api/workingtimes/` + id, {
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
  router.push(`/workingtime/new`)
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
    const response = await axios.get(
      `${process.env.HOST}:4000/api/workingtimes/${route.params.userId}`
    )
    data.value.workingTimes = response.data.data.map(adapter.from.api.workingTime)
    data.value.loading = false
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

// TODO: use date-fns here
const formatTime = (date: Date) => {
  return (
    date.getUTCHours().toString().padStart(2, '0') +
    ':' +
    date.getUTCMinutes().toString().padStart(2, '0')
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

  const formatted = formatDuration(duration, { format: ['hours', 'minutes'] })

  return formatted
}
const getPeriod = (start: Date) => {
  console.log(start)
  const hour = start.getHours()
  return hour < 12 ? 'Morning' : 'Afternoon'
}

const toggleDetails = (dateString: string) => {
  data.value.expandedDate = data.value.expandedDate === dateString ? null : dateString
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
  <ProtectedView :resource-id="route.params.userId.toString()">
    <div class="p-6 shadow-lg rounded-lg w-full">
      <h3 class="text-2xl">Working Times for User {{ route.params.userId }}</h3>
      <AppButton @click="goToNewWTpage" class="my-6 w-[150px] text-center bg-[#1D0455]">
        New Working Time
      </AppButton>
      <div v-if="data.loading" class="text-center text-gray-300">Loading...</div>
      <div v-else>
        <ul>
          <li v-for="(times, date) in groupedWorkingTimes" :key="date" class="mb-4">
            <div
              @click="toggleDetails(date)"
              class="cursor-pointer p-4 bg-[#1D0455] text-white rounded hover:bg-[#0b328a] transition-colors duration-200"
            >
              <div class="flex justify-between">
                <span>{{ date }}</span>
                <span>{{ calculateTotalDuration(times) }}</span>
              </div>
            </div>
            <div v-if="data.expandedDate === date" class="mt-2 p-4 bg-[#1D0455] text-white rounded">
              <div v-for="(time, index) in times" :key="index" class="mb-2">
                <p>
                  <strong>{{ getPeriod(time.start) }}:</strong> {{ formatTime(time.start) }} -
                  {{ formatTime(time.end) }}
                </p>
                <p>Duration: {{ calculateDuration(time.start, time.end) }}</p>
                <AppButton
                  @click="updateWorkingTime(time.id, time.start, time.end)"
                  class="mt-1 p-1 bg-[#0b328a] text-white rounded"
                >
                  Update
                </AppButton>
                <AppButton
                  @click="deleteWorkingTime(time.id)"
                  class="m-1 p-1 bg-[#0b328a] text-white rounded"
                >
                  Delete
                </AppButton>
                <hr class="my-4" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </ProtectedView>
</template>
