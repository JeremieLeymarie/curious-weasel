<template>
  <div class="p-6 bg-gray-800 shadow-lg rounded-lg w-full">
    <h2 class="text-2xl font-bold mb-6 text-white">Working Times for User {{ userId }}</h2>
    <div v-if="loading" class="text-center text-gray-300">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="(times, date) in groupedWorkingTimes" :key="date" class="mb-4">
          <div
            @click="toggleDetails(date)"
            class="cursor-pointer p-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
          >
            <div class="flex justify-between">
              <span>{{ date }}</span>
              <span>{{ calculateTotalDuration(times) }} hours</span>
            </div>
          </div>
          <div v-if="expandedDate === date" class="mt-2 p-4 bg-gray-600 text-white rounded">
            <div v-for="(time, index) in times" :key="index" class="mb-2">
              <p>
                <strong>{{ getPeriod(time.start) }}:</strong> {{ formatTime(time.start) }} -
                {{ formatTime(time.end) }}
              </p>
              <p>Duration: {{ calculateDuration(time.start, time.end) }} hours</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      workingTimes: [],
      loading: true,
      expandedDate: null
    }
  },
  computed: {
    groupedWorkingTimes() {
      // Crée un objet pour grouper les working times par date
      const grouped = {}
      this.workingTimes.forEach((time) => {
        const dateKey = new Date(time.start).toLocaleDateString()
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(time)
      })

      // Trie les dates du plus ancien au plus récent
      const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b))

      // Retourne un nouvel objet trié par date
      const sortedGrouped = {}
      sortedKeys.forEach((key) => {
        sortedGrouped[key] = grouped[key]
      })

      return sortedGrouped
    }
  },
  methods: {
    async getWorkingTimes() {
      try {
        const response = await axios.get(`http://localhost:4000/api/workingtimes/` + 1)
        this.workingTimes = response.data.data
        this.loading = false
      } catch (error) {
        console.error('Error fetching working times:', error)
      }
    },
    formatTime(dateString) {
      const date = new Date(dateString)
      return (
        date.getUTCHours().toString().padStart(2, '0') +
        ':' +
        date.getUTCMinutes().toString().padStart(2, '0')
      )
    },
    calculateDuration(start, end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const duration = (endDate - startDate) / (1000 * 60 * 60) // Duration in hours
      return duration.toFixed(2)
    },
    calculateTotalDuration(times) {
      return times
        .reduce((total, time) => {
          const startDate = new Date(time.start)
          const endDate = new Date(time.end)
          return total + (endDate - startDate) / (1000 * 60 * 60)
        }, 0)
        .toFixed(2)
    },
    getPeriod(start) {
      const hour = new Date(start).getHours()
      return hour < 12 ? 'Morning' : 'Afternoon'
    },
    toggleDetails(date) {
      this.expandedDate = this.expandedDate === date ? null : date
    }
  },
  mounted() {
    this.getWorkingTimes()
  }
}
</script>

<style scoped>
/* Ajoutez ici des styles supplémentaires pour personnaliser davantage les listes */
</style>
