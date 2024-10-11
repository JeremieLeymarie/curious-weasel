<script setup lang="ts">
import { Bar, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ArcElement
} from 'chart.js'
import { ref, onMounted, watch, computed } from 'vue'
import AppButton from './ui/AppButton.vue'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ArcElement
)

interface WorkingTime {
  id: number
  start: string
  end: string
}

// Références pour les données des temps de travail et le graphique
const workingTimes = ref<WorkingTime[]>([])
const labels = ref<string[]>([])
const datasetData = ref<number[]>([])
const selectedMonth = ref<string>('10') // Mois par défaut
const selectedYear = ref<string>('2024') // Année par défaut
const chartType = ref<string>('bar')
const hourlyRate = ref<number>(20) // Salaire horaire par défaut

const totalHours = computed(() => datasetData.value.reduce((a, b) => a + b, 0))
const estimatedSalary = computed(() => totalHours.value * hourlyRate.value)

// Objectif d'heures pour le mois (35 heures * 4 semaines)
const targetHours = 140

// Calculer le pourcentage atteint pour le graphique en camembert
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

// Fonction pour récupérer les temps de travail depuis l'API
const getWorkingTimes = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.HOST}:4000/api/workingtimes/${userId}`)
    const data = await response.json()
    return data.data as WorkingTime[]
  } catch (error) {
    console.error('Error fetching working times:', error)
    return []
  }
}

// Fonction pour calculer la durée d'un intervalle en heures
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
  const month = parseInt(selectedMonth.value)

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
        backgroundColor:
          chartType.value === 'stacked' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(220, 53, 69, 0.6)',
        borderColor:
          chartType.value === 'stacked' ? 'rgba(75, 192, 192, 1)' : 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        data: datasetData.value,
        fill: chartType.value === 'stacked', // Remplir la zone pour le graphique en aires empilées
        tension: chartType.value === 'line' ? 0.1 : 0
      }
    ]
  }
}

watch([selectedMonth, selectedYear, chartType], () => {
  generateChartData()
})

onMounted(() => {
  getWorkingTimes('1').then((res) => {
    workingTimes.value = res
    generateChartData()
  })
})

// Référence pour le graphique
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
      display: true,
      labels: {
        color: '#ffffff'
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#333333',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: '#444444'
      },
      title: {
        display: true,
        text: 'Date',
        color: '#ffffff'
      }
    },
    y: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: '#444444'
      },
      title: {
        display: true,
        text: 'Worked hours',
        color: '#ffffff'
      },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <h3 class="text-2xl m-4">Dashboard</h3>
  <div class="bg-[#1D0455] p-6 flex flex-col mb-8">
    <div class="flex flex-col">
      <div class="m-2 p-2">
        <div class="bg-[#1D0455] p-6 h-screen flex flex-col">
          <div class="mb-4 flex flex-wrap space-x-4 items-center">
            <div class="bg-[#1D0455] text-white p-2 rounded">
              <h3 class="text-sm">Total worked hours:</h3>
              <p class="text-xl font-bold">{{ totalHours }}</p>
            </div>
            <div>
              <label for="year-select" class="text-white">Select Year:</label>
              <select
                id="year-select"
                v-model="selectedYear"
                class="bg-gray-600 text-white rounded p-2 m-3"
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label for="month-select" class="text-white">Select Month:</label>
              <select
                id="month-select"
                v-model="selectedMonth"
                class="bg-gray-600 text-white rounded p-2 m-3"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <label class="text-white">Select Chart Type:</label>
              <select v-model="chartType" class="bg-gray-600 text-white rounded p-2 m-3">
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="stacked">Stacked Area</option>
              </select>
              <button class="rounded bg-gray-600 p-2 ml-4 text-white">Export Data</button>
            </div>
          </div>
          <div class="flex-1 flex flex-row overflow-hidden">
            <div class="flex-1 overflow-hidden pr-4">
              <!-- Graphique principal (Bar, Line, Stacked Area) -->
              <component
                :is="chartType === 'bar' ? Bar : Line"
                :data="chartData"
                :options="chartOptions"
                class="h-full"
              />
            </div>
            <div class="w-1/5 flex justify-center items-center h-full">
              <!-- Graphique en camembert -->
              <Doughnut
                :data="doughnutData"
                :options="{ responsive: true, maintainAspectRatio: false }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
