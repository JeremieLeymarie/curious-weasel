<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { ref, onMounted, watch, computed } from 'vue'

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement)

interface WorkingTime {
  id: number;
  start: string;
  end: string;
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

// Fonction pour récupérer les temps de travail depuis l'API
const getWorkingTimes = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:4000/api/workingtimes/${userId}`)
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
    // Format YYYY-MM-DD pour s'assurer que les dates sont correctes
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
    const dateKey = new Date(time.start).toLocaleDateString('en-CA') // Format YYYY-MM-DD
    if (groupedData[dateKey] !== undefined) {
      groupedData[dateKey] += calculateDuration(time.start, time.end)
    }
  })

  labels.value = Object.keys(groupedData)
  datasetData.value = Object.values(groupedData)

  // Mettre à jour chartData
  chartData.value = {
    labels: labels.value,
    datasets: [
      {
        label: 'Hours Worked',
        backgroundColor: chartType.value === 'line' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(220, 53, 69, 0.6)',
        borderColor: chartType.value === 'line' ? 'rgba(75, 192, 192, 1)' : 'rgba(220, 53, 69, 1)',
        borderWidth: 2,
        data: datasetData.value,
        fill: chartType.value === 'line' ? false : true,
        tension: chartType.value === 'line' ? 0.1 : 0
      }
    ]
  }
}

watch([selectedMonth, selectedYear], () => {
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
      label: 'Hours Worked',
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
    },
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
        text: 'Hours Worked',
        color: '#ffffff'
      },
      beginAtZero: true
    }
  }
}
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg">
    <div class="flex justify-between mb-4">
      <div class="bg-gray-700 text-white p-4 rounded-lg">
        <h3 class="text-lg">Total hours work this month:</h3>
        <p class="text-2xl font-bold">{{ totalHours }}</p>
      </div>
      <div class="bg-gray-700 text-white p-4 rounded-lg">
        <h3 class="text-lg">Estimated salary for this month:</h3>
        <p class="text-2xl font-bold">${{ estimatedSalary.toFixed(2) }}</p>
      </div>
      <div class="bg-gray-700 text-white p-4 rounded-lg">
        <h3 class="text-lg">Hourly Rate:</h3>
        <input type="number" v-model="hourlyRate" class="bg-gray-600 text-white rounded p-2" min="0" />
      </div>
    </div>
    <div class="mb-4 flex space-x-4">
      <div>
        <label for="year-select" class="text-white">Select Year:</label>
        <select id="year-select" v-model="selectedYear" class="bg-gray-700 text-white rounded p-2">
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <div>
        <label for="month-select" class="text-white">Select Month:</label>
        <select id="month-select" v-model="selectedMonth" class="bg-gray-700 text-white rounded p-2">
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
      </div>
    </div>
    <div class="mb-4">
      <label class="text-white">Select Chart Type:</label>
      <select v-model="chartType" class="bg-gray-700 text-white rounded p-2 ml-2">
        <option value="bar">Bar</option>
        <option value="line">Line</option>
      </select>
    </div>
    <div class="h-96">
      <component :is="chartType === 'bar' ? Bar : Line" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.bg-gray-800 {
  background-color: #2d3748;
}
</style>
