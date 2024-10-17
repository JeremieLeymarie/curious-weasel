<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

import Chart from 'primevue/chart'
import Panel from 'primevue/panel'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'
import { formatDuration, differenceInDays, differenceInMinutes, eachWeekOfInterval, startOfWeek, subDays, intervalToDuration, minutesToMilliseconds, eachDayOfInterval } from 'date-fns'
import DatePicker from 'primevue/datepicker'
import type { Team, WorkingTime } from '@/types'

const { workingTimes, team, name } = defineProps<{ workingTimes: WorkingTime[], team?: Team; name: string }>()

const data = ref<{ byDay: Record<string, number>, byWeek: Record<string, number>, total: number; average: { daily: number; weekly: number } }>()
const chartData = ref()
const selectedInterval = ref<Date[]>([subDays(new Date(), 7), new Date()])
const chartType = ref<string>('bar')
const MINUTES_BY_WORK_DAY = 8 * 60


const doughnutData = computed(() => {

  if (!data.value) return

  const daysInInterval = differenceInDays(selectedInterval.value[1], selectedInterval.value[0]) + 1
  let targetMinutes = MINUTES_BY_WORK_DAY * daysInInterval

  if (team?.users) targetMinutes *= team.users?.length

  const remainingMinutes = Math.max(targetMinutes - data.value.total, 0)

  return {
    labels: ['Time worked', 'Time left'],
    datasets: [
      {
        data: [data.value.total, remainingMinutes],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(220, 53, 69, 0.2)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(220, 53, 69, 0.6)']
      }
    ]
  }
})


const groupDataByDay = () => {
  const days = eachDayOfInterval({ start: selectedInterval.value[0], end: selectedInterval.value[1] })
  const groupedData: Record<string, number> = {}

  days.forEach((day) => {
    groupedData[day.toLocaleDateString()] = 0
  })

  workingTimes.forEach((time) => {
    const dateKey = time.start.toLocaleDateString()
    if (groupedData[dateKey] !== undefined)
      groupedData[dateKey] += differenceInMinutes(time.end, time.start)
  })

  return groupedData
}

const groupDataByWeek = () => {
  const weeks = eachWeekOfInterval({ start: selectedInterval.value[0], end: selectedInterval.value[1] }, { weekStartsOn: 1 })
  const groupedData: Record<string, number> = {}

  weeks.forEach((date) => {
    groupedData[date.toLocaleDateString()] = 0
  })

  workingTimes.forEach((time) => {
    const dateKey = startOfWeek(time.start, { weekStartsOn: 1 }).toLocaleDateString()
    if (groupedData[dateKey] !== undefined)
      groupedData[dateKey] += differenceInMinutes(time.end, time.start)
  })

  return groupedData
}

const formatMinutesToReadable = (minutes: number) => {
  const duration = intervalToDuration({ start: 0, end: minutesToMilliseconds(minutes) })

  return formatDuration(duration)
}

const getAverage = (values: number[]) => {
  const avg = values.reduce((acc, curr) => acc + curr, 0) / values.length
  return avg;
}

const generateChartData = () => {
  const dataByDay = groupDataByDay()
  const dataByWeek = groupDataByWeek()

  chartData.value = {
    labels: Object.keys(dataByDay),
    datasets: [
      {
        label: 'Time worked',
        backgroundColor: 'rgba(220, 53, 69, 0.6)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        data: Object.values(dataByDay),
        fill: false,
        tension: chartType.value === 'line' ? 0.1 : 0
      }
    ]
  }

  data.value = { byDay: dataByDay, byWeek: dataByWeek, average: { weekly: getAverage(Object.values(dataByWeek)), daily: getAverage(Object.values(dataByDay)) }, total: Object.values(dataByDay).reduce((acc, curr) => acc + curr, 0) }
}


watch([selectedInterval], () => {
  generateChartData()
})

onMounted(() => {
  generateChartData()
})



const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context: Record<string, unknown> & { raw: number }) => {
          return formatMinutesToReadable(context.raw)
        }
      },
    }
  },
}

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false, plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context: Record<string, unknown> & { raw: number }) => {
          return formatMinutesToReadable(context.raw)
        }
      },
    }
  }
}
</script>

<template>
  <div class="space-y-4" v-if="data">
    <h3 class="text-2xl my-4">Dashboard for {{ team ? "team" : "user" }} <strong>{{ name }}</strong></h3>
    <Panel>
      <div class="flex gap-4">
        <div>
          <FloatLabel>
            <DatePicker selectionMode="range" inputId="range-input" v-model="selectedInterval" />
            <label for="range-input">Select Dates</label>
          </FloatLabel>
        </div>

        <div>
          <FloatLabel>
            <label>Select Chart Type</label>
            <Select v-model="chartType" :options="['line', 'bar']" class="min-w-[150px]" />
          </FloatLabel>
        </div>
      </div>
    </Panel>

    <div class="flex w-full gap-4 flex-col md:flex-row">
      <Panel class="md:w-10/12 w-full" header="Worked hours over time">
        <Chart :type="chartType" :data="chartData" :options="chartOptions" class="h-[30rem]" />
      </Panel>
      <div class="space-y-4">
        <Panel header="Total worked hours:">
          <div class="flex gap-2 items-center">
            <i class="pi pi-clock !text-xl"></i>
            <p class="text-xl font-bold">{{ formatMinutesToReadable(data.total) }}</p>
          </div>
        </Panel>

        <Panel class="p-2" header="Remaining work time">
          <Chart type="doughnut" :data="doughnutData" :options="doughnutOptions"
            class="w-full md:w-[30rem] !h-[20vw] min-h-[150px]" />
        </Panel>
        <Panel header="Average:">
          <div class="flex gap-2 items-center my-2">
            <i class="pi pi-clock !text-lg"></i>
            <p class="text-lg font-bold">Daily: {{ formatMinutesToReadable(data.average.daily) }}</p>
          </div>
          <div class="flex gap-2 items-center my-2">
            <i class="pi pi-clock !text-lg"></i>
            <p class="text-lg font-bold">Weekly: {{ formatMinutesToReadable(data.average.weekly) }}</p>
          </div>
        </Panel>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>
