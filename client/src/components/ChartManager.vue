<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

import Chart from 'primevue/chart'
import Panel from 'primevue/panel'
import Select from 'primevue/Select'
import FloatLabel from 'primevue/floatlabel'
import { useRoute } from 'vue-router'
import { differenceInDays, subDays } from 'date-fns'
import DatePicker from 'primevue/datepicker'

type WorkingTime = {
  id: number
  start: string
  end: string
}

const workingTimes = ref<WorkingTime[]>([])
const labels = ref<string[]>([])
const datasetData = ref<number[]>([])
const selectedInterval = ref<Date[]>([subDays(new Date(), 7), new Date()])
const chartType = ref<string>('bar')

const totalHours = computed(() => datasetData.value.reduce((acc, value) => acc + value, 0))

const route = useRoute()

const doughnutData = computed(() => {
  let targetHours = 8 * differenceInDays(selectedInterval.value[1], selectedInterval.value[0]) + 8
  const hoursWorked = totalHours.value
  const remainingHours = Math.max(targetHours - hoursWorked, 0)
  return {
    labels: ['Worked hours', 'Hours left'],
    datasets: [
      {
        data: [hoursWorked, remainingHours],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(220, 53, 69, 0.2)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(220, 53, 69, 0.6)']
      }
    ]
  }
})

const getWorkingTimes = async (userId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_HOST}:4000/api/workingtimes/${userId}`)
    const data = await response.json()
    return data.data as WorkingTime[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
}

const calculateDuration = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
}

const generateDaysOfInterval = () => {
  const daysInInterval = differenceInDays(selectedInterval.value[1], selectedInterval.value[0])
  const dates = []
  for (let day = 0; day <= daysInInterval; day++) {
    let date = new Date(selectedInterval.value[0])
    date.setDate(date.getDate() + day)
    dates.push(date.toLocaleDateString('en-CA'))
  }
  return dates
}

const generateChartData = () => {
  const daysOfMonth = generateDaysOfInterval()
  const groupedData: { [key: string]: number } = {}

  daysOfMonth.forEach((day) => {
    groupedData[day] = 0
  })

  workingTimes.value.forEach((time) => {
    const dateKey = new Date(time.start).toLocaleDateString('en-CA')
    if (groupedData[dateKey] !== undefined) {
      groupedData[dateKey] += calculateDuration(time.start, time.end)
    }
  })

  labels.value = Object.keys(groupedData)
  datasetData.value = Object.values(groupedData)

  chartData.value = {
    labels: labels.value,
    datasets: [
      {
        label: 'Worked hours',
        backgroundColor: 'rgba(220, 53, 69, 0.6)',
        borderColor: 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        data: datasetData.value,
        fill: false,
        tension: chartType.value === 'line' ? 0.1 : 0
      }
    ]
  }
}

watch([selectedInterval], () => {
  generateChartData()
})

onMounted(() => {
  getWorkingTimes(route.params.userId as string).then((res) => {
    workingTimes.value = res
    generateChartData()
  })
})

const chartData = ref({
  labels: labels.value,
  datasets: [
    {
      label: 'Worked hours',
      backgroundColor: 'rgba(220, 53, 69, 0.6)',
      borderColor: 'rgba(220, 53, 69, 1)',
      borderWidth: 1,
      data: datasetData.value,
      fill: false,
      tension: 0.1
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      enabled: true
    }
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-2xl my-4">Dashboard</h3>
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
            <p class="text-xl font-bold">{{ totalHours.toFixed(2) }}</p>
          </div>
        </Panel>
        <Panel class="p-2" header="Remaining work time">
          <Chart type="doughnut" :data="doughnutData" :options="{ responsive: true, maintainAspectRatio: false }"
            class="w-full md:w-[30rem] !h-[20vw] min-h-[150px]" />
        </Panel>
      </div>
    </div>
  </div>
</template>
