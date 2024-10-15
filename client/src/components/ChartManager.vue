<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

import Chart from 'primevue/chart'
import Panel from 'primevue/panel'
import Select from 'primevue/Select'
import Card from 'primevue/card'
import FloatLabel from 'primevue/FloatLabel'
import { useRoute } from 'vue-router'

type WorkingTime = {
  id: number
  start: string
  end: string
}

const monthOptions = ref([
  { name: 'January', id: 1 },
  { name: 'February', id: 2 },
  { name: 'March', id: 3 },
  { name: 'April', id: 4 },
  { name: 'May', id: 5 },
  { name: 'June', id: 6 },
  { name: 'July', id: 7 },
  { name: 'August', id: 8 },
  { name: 'September', id: 9 },
  { name: 'October', id: 10 },
  { name: 'November', id: 11 },
  { name: 'December', id: 12 }
])

const workingTimes = ref<WorkingTime[]>([])
const labels = ref<string[]>([])
const datasetData = ref<number[]>([])
const selectedMonth = ref(monthOptions.value[9])
const selectedYear = ref<string>('2024')
const chartType = ref<string>('bar')

const totalHours = computed(() => datasetData.value.reduce((a, b) => a + b, 0))

const route = useRoute()

const targetHours = 140

const doughnutData = computed(() => {
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

const generateDaysOfMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dates = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day).toLocaleDateString('en-CA')
    dates.push(date)
  }
  return dates
}

const generateChartData = () => {
  const year = parseInt(selectedYear.value)
  const month = selectedMonth.value.id

  const daysOfMonth = generateDaysOfMonth(year, month)
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

watch([selectedMonth, selectedYear, chartType], () => {
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
            <Select
              inputId="year-input"
              v-model="selectedYear"
              :options="['2022', '2023', '2024', '2025']"
            />
            <label for="year-input">Select Year</label>
          </FloatLabel>
        </div>
        <div>
          <FloatLabel>
            <Select
              inputId="month-select"
              v-model="selectedMonth"
              :options="monthOptions"
              optionLabel="name"
            />
            <label for="month-select">Select Month</label>
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
          <Chart
            type="doughnut"
            :data="doughnutData"
            :options="{ responsive: true, maintainAspectRatio: false }"
            class="w-full md:w-[30rem] !h-[20vw] min-h-[150px]"
          />
        </Panel>
      </div>
    </div>
  </div>
</template>
