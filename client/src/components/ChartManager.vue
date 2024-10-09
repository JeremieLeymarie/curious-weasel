<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { adapter } from '@/adapters'
import type { WorkingTime } from '@/types'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const route = useRoute()
const workingTimes = ref<WorkingTime[]>()

watch(
  () => route.params.userId,
  (userId) => {
    getWorkingTimes(userId as string).then((res) => {
      workingTimes.value = res
    })
  }
)

onMounted(() => {
  getWorkingTimes(route.params.userId as string).then((res) => {
    workingTimes.value = res
  })
})

const getWorkingTimes = async (userId: string) => {
  const response = await fetch(`http://localhost:4000/api/workingtimes/${userId}`)
    .then((res) => res.json())
    .catch()

  return response.data.map(adapter.from.api.workingTime)
}

const chartData = {
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }]
}

const chartOptions = {
  responsive: true
}
</script>

<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
