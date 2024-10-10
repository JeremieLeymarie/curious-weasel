<!-- TODO: fix Typescript errors -->

<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { WorkingTime } from '@/types'
import { getReadableInterval } from '@/utils/date'
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns'
import AppButton from './ui/AppButton.vue'
const router = useRouter()

const data = ref<{ workingTimes: WorkingTime[]; loading: boolean; expandedDate: Date | null }>({
  workingTimes: [],
  loading: true,
  expandedDate: null
})

const deleteWorkingTime = async (id: string) => {
  try {
    let res = await fetch('http://localhost:4000/api/workingtimes/' + id, {
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

const NewWorkingTime = async () => {
  try {
    console.log(router)
    router.push(`/workingtimecreated`)
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

const updateWorkingTime = async (id: string, start: Date, end: Date) => {
  try {
    router.push(`/workingtimeupdate/${id}/${start}/${end}`)
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}

const getWorkingTimes = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/api/workingtimes/` + 1)
    data.value.workingTimes = response.data.data
    data.value.loading = false
  } catch (error) {
    console.error('Error fetching working times:', error)
  }
}
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
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
const getPeriod = (start: string) => {
  const hour = new Date(start).getHours()
  return hour < 12 ? 'Morning' : 'Afternoon'
}

const toggleDetails = (date: Date) => {
  data.value.expandedDate = data.value.expandedDate === date ? null : date
}

const groupedWorkingTimes = computed(() => {
  const grouped = {}
  data.value.workingTimes.forEach((time) => {
    const dateKey = new Date(time.start).toLocaleDateString()
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(time)
  })

  const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b))

  const sortedGrouped = {}
  sortedKeys.forEach((key) => {
    sortedGrouped[key] = grouped[key]
  })

  return sortedGrouped
})

onMounted(() => {
  getWorkingTimes()
})
</script>

<template>
  <div class="p-6 shadow-lg rounded-lg w-full">
    <h3 class="text-2xl">Working Times for User {{ userId }}</h3>
    <AppButton @click="NewWorkingTime" class="my-6 w-2/12 text-center">
      New Working Time
    </AppButton>
    <div v-if="data.loading" class="text-center text-gray-300">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="(times, date) in groupedWorkingTimes" :key="date" class="mb-4">
          <div
            @click="toggleDetails(date)"
            class="cursor-pointer p-4 bg-[#1343ad] text-white rounded hover:bg-[#0b328a] transition-colors duration-200"
          >
            <div class="flex justify-between">
              <span>{{ date }}</span>
              <span>{{ calculateTotalDuration(times) }}</span>
            </div>
          </div>
          <div v-if="data.expandedDate === date" class="mt-2 p-4 bg-[#1343ad] text-white rounded">
            <div v-for="(time, index) in times" :key="index" class="mb-2">
              <p>
                <strong>{{ getPeriod(time.start) }}:</strong> {{ formatTime(time.start) }} -
                {{ formatTime(time.end) }}
              </p>
              <p>Duration: {{ calculateDuration(time.start, time.end) }}</p>
              <AppButton
                @click="updateWorkingTime(time.id, time.start, time.end)"
                class="mt-1 p-1 bg-gray-800 text-white rounded"
              >
                Update
              </AppButton>
              <AppButton
                @click="deleteWorkingTime(time.id)"
                class="m-1 p-1 bg-gray-800 text-white rounded"
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
</template>
